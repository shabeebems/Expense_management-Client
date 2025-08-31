import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, MessageCircle, Users, X, Crown, User, Menu, ArrowLeft } from 'lucide-react';
import io from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router';

const API_URL = `${import.meta.env.VITE_SERVER_API_URL}/api`;

function Message() {
  const socket = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  
  const [socketConnected, setSocketConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize data and socket connection
  useEffect(() => {
    const initializeData = async () => {
      try {
        const [chatsResponse, userResponse, unreadResponse] = await Promise.all([
          axios.get(`${API_URL}/chats`, { withCredentials: true }),
          axios.get(`${API_URL}/current-user`, { withCredentials: true }),
          axios.get(`${API_URL}/unread-count`, { withCredentials: true })
        ]);
        
        setChats(chatsResponse.data);
        setUser(userResponse.data);
        setUnreadCounts(unreadResponse.data.chatUnreadCounts);
        setTotalUnreadCount(unreadResponse.data.totalUnreadCount);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Socket connection setup
  useEffect(() => {
    if (!user?._id) return;

    socket.current = io(`${import.meta.env.VITE_SERVER_API_URL}`);

    socket.current.emit("setup", {
      username: user.username,
      _id: user._id,
    });

    socket.current.on("connected", () => {
      setSocketConnected(true);
      console.log("Socket connected");
    });

    socket.current.on("message received", (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
      
      // Update unread counts
      setUnreadCounts(prev => ({
        ...prev,
        [newMsg.chatId]: (prev[newMsg.chatId] || 0) + 1
      }));
      setTotalUnreadCount(prev => prev + 1);
    });

    socket.current.on("typing", (user) => {
      setIsTyping(true);
      setTypingUser(user.username);
    });

    socket.current.on("stop typing", () => {
      setIsTyping(false);
      setTypingUser('');
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [user?._id]);

  // Load messages when chat is selected
  useEffect(() => {
    if (!selectedChat) return;

    const loadMessages = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/messages/${selectedChat._id}`,
          { withCredentials: true }
        );
        setMessages(response.data);
        
        // Clear unread count for current chat
        setUnreadCounts(prev => {
          const currentUnread = prev[selectedChat._id] || 0;
          setTotalUnreadCount(prevTotal => prevTotal - currentUnread);
          return {
            ...prev,
            [selectedChat._id]: 0
          };
        });
        
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();
    setNewMessage('');

    if (socket.current) {
      socket.current.emit("join chat", selectedChat._id);
    }

    return () => {
      if (socket.current && selectedChat) {
        socket.current.emit("leave chat", selectedChat._id);
      }
    };
  }, [selectedChat]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat selected
  useEffect(() => {
    if (selectedChat && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedChat]);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await axios.post(
        `${API_URL}/messages`,
        {
          content: newMessage,
          chatId: selectedChat._id,
          ledgerId: selectedChat.ledgerId,
        },
        { withCredentials: true }
      );

      // Ensure new message appears at the end
      setMessages((prev) => [...prev, response.data]);
      setNewMessage('');

      if (socket.current) {
        socket.current.emit("new message", response.data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setIsSidebarOpen(false); // Close sidebar on mobile when chat is selected
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatLastMessageTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return messageTime.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-purple-400 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading your conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex relative overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Chat List */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
        w-full sm:w-96 lg:w-80 xl:w-96
        bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        shadow-xl lg:shadow-none
      `}>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)} 
              className="text-blue-600 hover:text-blue-700 transition-colors duration-200 flex items-center gap-2 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Messages
              </h1>
              {totalUnreadCount > 0 && (
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse shadow-lg">
                  {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                </div>
              )}
            </div>
            
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                socketConnected ? 'bg-green-400 shadow-lg shadow-green-200' : 'bg-gray-400'
              }`}></div>
              <span className="text-sm font-medium text-gray-700">{user.username}</span>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base hover:bg-gray-100"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 space-y-2">
            {filteredChats.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-medium">No conversations found</p>
                <p className="text-sm mt-1">Try adjusting your search</p>
              </div>
            ) : (
              filteredChats.map((chat, index) => {
                const unreadCount = unreadCounts[chat._id] || 0;
                const hasUnread = unreadCount > 0;
                
                return (
                  <div
                    key={chat._id}
                    onClick={() => handleChatSelect(chat)}
                    className={`
                      group relative p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 ease-out
                      hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md hover:scale-[1.02]
                      active:scale-[0.98] touch-manipulation
                      ${selectedChat?._id === chat._id 
                        ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 shadow-lg transform scale-[1.02]' 
                        : hasUnread
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                      }
                    `}
                    style={{
                      animationDelay: `${index * 75}ms`
                    }}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      {/* Group Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg transform transition-transform duration-200 group-hover:scale-110">
                          <Users className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        {hasUnread && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-bounce">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </div>
                        )}
                      </div>

                      {/* Chat Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold truncate transition-colors duration-200 text-sm sm:text-base ${
                            selectedChat?._id === chat._id ? 'text-blue-800' : 
                            hasUnread ? 'text-gray-900' : 'text-gray-800'
                          }`}>
                            {chat.name}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-white bg-opacity-70 text-xs font-medium text-gray-600 shadow-sm">
                              {chat.members?.length || 0}
                            </span>
                            {chat.latestMessageDetails && (
                              <span className="text-xs text-gray-500 font-medium">
                                {formatLastMessageTime(chat.latestMessageDetails.createdAt)}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className={`text-xs sm:text-sm truncate ${
                          hasUnread ? 'text-gray-700 font-medium' : 'text-gray-500'
                        }`}>
                          {chat.latestMessageDetails ? (
                            <>
                              <span className="font-semibold text-blue-600">
                                {chat.latestMessageDetails.sender.username}:
                              </span> {chat.latestMessageDetails.content}
                            </>
                          ) : (
                            'Start the conversation...'
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Active indicator */}
                    {selectedChat?._id === chat._id && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg"></div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Messages */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 sm:p-6 bg-white border-b border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                  {/* Mobile menu button */}
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0"
                  >
                    <Menu className="w-5 h-5" />
                  </button>

                  <div 
                    className="flex items-center space-x-3 sm:space-x-4 cursor-pointer hover:bg-gray-50 rounded-xl p-2 -m-2 transition-all duration-200 flex-1 min-w-0"
                    onClick={() => setShowMembersModal(true)}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-gray-900 text-lg sm:text-xl truncate">{selectedChat.name}</h2>
                      <p className="text-sm text-gray-500 truncate">
                        {isTyping && typingUser ? (
                          <span className="text-blue-600 animate-pulse font-medium">{typingUser} is typing...</span>
                        ) : (
                          `${selectedChat.members?.length || 0} members • Tap to view details`
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-50 via-white to-blue-50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-sm mx-auto">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <MessageCircle className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Start the conversation!</h3>
                    <p className="text-gray-500">Send your first message to get things going.</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => {
                    const isOwnMessage = message.sender._id === user?._id;
                    const showAvatar = !isOwnMessage && (
                      index === 0 || 
                      messages[index - 1].sender._id !== message.sender._id
                    );

                    return (
                      <div
                        key={message._id}
                        className={`flex items-end space-x-2 sm:space-x-3 animate-fadeIn ${
                          isOwnMessage ? 'justify-end' : 'justify-start'
                        }`}
                        style={{
                          animationDelay: `${index * 50}ms`
                        }}
                      >
                        {/* Avatar for other users */}
                        {!isOwnMessage && (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm font-bold mb-1 flex-shrink-0 shadow-md">
                            {showAvatar ? message.sender.username.charAt(0).toUpperCase() : ''}
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div className={`max-w-[75%] sm:max-w-xs lg:max-w-md px-4 py-3 sm:px-5 sm:py-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] ${
                          isOwnMessage
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md shadow-blue-200'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md shadow-gray-200'
                        }`}>
                          {!isOwnMessage && showAvatar && (
                            <p className="text-xs font-bold text-blue-600 mb-2">
                              {message.sender.username}
                            </p>
                          )}
                          <p className="text-sm sm:text-base leading-relaxed break-words">
                            {message.content}
                          </p>
                          <p className={`text-xs mt-2 ${
                            isOwnMessage ? 'text-blue-100' : 'text-gray-400'
                          }`}>
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="p-3 sm:p-6 bg-white border-t border-gray-200 shadow-lg">
              <form onSubmit={handleSendMessage} className="flex items-end space-x-3 sm:space-x-4">
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows="1"
                    className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none max-h-32 text-sm sm:text-base hover:bg-gray-100"
                    style={{ minHeight: '52px' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`p-3 sm:p-4 rounded-2xl transition-all duration-300 transform active:scale-95 flex-shrink-0 ${
                    newMessage.trim()
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 hover:scale-105'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            {/* Mobile menu button for no chat selected state */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden fixed top-4 left-4 z-30 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            <div className="text-center max-w-md mx-auto px-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <MessageCircle className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Welcome to Messages</h3>
              <p className="text-gray-500 leading-relaxed">Select a conversation from the sidebar to start chatting with your team.</p>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                View Conversations
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Members Modal */}
      {showMembersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={() => setShowMembersModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden transform transition-all duration-300 scale-100" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center backdrop-blur-sm">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedChat.name}</h3>
                    <p className="text-sm text-blue-100">{selectedChat.members?.length || 0} members</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMembersModal(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Members List */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {selectedChat.members?.map((member, index) => (
                  <div
                    key={member.userId}
                    className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:border-gray-200 hover:shadow-md"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Member Avatar */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                      {member.username.charAt(0).toUpperCase()}
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-gray-900 truncate text-base">
                          {member.username}
                        </h4>
                        {member.isAdmin && (
                          <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                            <Crown className="w-3 h-3" />
                            <span>Admin</span>
                          </div>
                        )}
                        {member.userId === user._id && (
                          <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Member since {new Date(selectedChat.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>

                    {/* Online Status */}
                    <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                      <div className="w-4 h-4 bg-green-400 rounded-full shadow-lg animate-pulse"></div>
                      <span className="text-xs text-gray-500 font-medium">Online</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="font-medium">Ledger: {selectedChat.name}</span>
                <span className="font-medium">Created {new Date(selectedChat.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Message;