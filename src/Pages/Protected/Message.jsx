import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, MessageCircle, Users, X, Crown, User } from 'lucide-react';
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
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Left Sidebar - Chat List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
              <h2
                onClick={() => navigate(-1)} 
                className="text-xl font-semibold text-blue-300 cursor-pointer">
                  {"<- back"}
              </h2>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
              {totalUnreadCount > 0 && (
                <div className="bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                  {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                socketConnected ? 'bg-green-400' : 'bg-gray-400'
              }`}></div>
              <span className="text-sm text-gray-600">{user.username}</span>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-1">
            {filteredChats.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No conversations found</p>
              </div>
            ) : (
              filteredChats.map((chat, index) => {
                const unreadCount = unreadCounts[chat._id] || 0;
                const hasUnread = unreadCount > 0;
                
                return (
                  <div
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    className={`
                      group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ease-in-out
                      hover:bg-gray-50 hover:shadow-sm transform hover:-translate-y-0.5
                      ${selectedChat?._id === chat._id 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 shadow-sm' 
                        : 'hover:bg-gray-50'
                      }
                    `}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Group Avatar */}
                      <div className="relative">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm transition-transform duration-200 group-hover:scale-105">
                          <Users className="w-5 h-5" />
                        </div>
                        {hasUnread && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </div>
                        )}
                      </div>

                      {/* Chat Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium truncate transition-colors duration-200 ${
                            selectedChat?._id === chat._id ? 'text-blue-700' : 
                            hasUnread ? 'text-gray-900 font-semibold' : 'text-gray-900'
                          }`}>
                            {chat.name}
                          </h3>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-xs">
                              {chat.members?.length || 0}
                            </span>
                            {chat.latestMessageDetails && (
                              <span className="ml-1">
                                {formatLastMessageTime(chat.latestMessageDetails.createdAt)}
                              </span>
                            )}
                          </span>
                        </div>
                        <p className={`text-sm truncate mt-1 ${
                          hasUnread ? 'text-gray-800 font-medium' : 'text-gray-500'
                        }`}>
                          {chat.latestMessageDetails ? (
                            <>
                              <span className="font-medium">
                                {chat.latestMessageDetails.sender.username}:
                              </span> {chat.latestMessageDetails.content}
                            </>
                          ) : (
                            'No messages yet'
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Active indicator */}
                    {selectedChat?._id === chat._id && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
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
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors duration-200" onClick={() => setShowMembersModal(true)}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedChat.name}</h2>
                  <p className="text-sm text-gray-500">
                    {isTyping && typingUser ? (
                      <span className="text-blue-600 animate-pulse">{typingUser} is typing...</span>
                    ) : (
                      `${selectedChat.members?.length || 0} members • Click to view`
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
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
                        className={`flex items-end space-x-2 animate-fadeIn ${
                          isOwnMessage ? 'justify-end' : 'justify-start'
                        }`}
                        style={{
                          animationDelay: `${index * 50}ms`
                        }}
                      >
                        {/* Avatar for other users */}
                        {!isOwnMessage && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm font-medium mb-1">
                            {showAvatar ? message.sender.username.charAt(0).toUpperCase() : ''}
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                          isOwnMessage
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                        }`}>
                          {!isOwnMessage && showAvatar && (
                            <p className="text-xs font-medium text-gray-600 mb-1">
                              {message.sender.username}
                            </p>
                          )}
                          <p className="text-sm leading-relaxed break-words">
                            {message.content}
                          </p>
                          <p className={`text-xs mt-2 ${
                            isOwnMessage ? 'text-blue-100' : 'text-gray-500'
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
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows="1"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none max-h-32"
                    style={{ minHeight: '48px' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`p-3 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                    newMessage.trim()
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No chat selected</h3>
              <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Members Modal */}
      {showMembersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowMembersModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedChat.name}</h3>
                    <p className="text-sm text-purple-100">{selectedChat.members?.length || 0} members</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMembersModal(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Members List */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {selectedChat.members?.map((member, index) => (
                  <div
                    key={member.userId}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Member Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                      {member.username.charAt(0).toUpperCase()}
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 truncate">
                          {member.username}
                        </h4>
                        {member.isAdmin && (
                          <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            <Crown className="w-3 h-3" />
                            <span>Admin</span>
                          </div>
                        )}
                        {member.userId === user._id && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>Member</span>
                      </p>
                    </div>

                    {/* Online Status */}
                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Ledger: {selectedChat.name}</span>
                <span>Created {new Date(selectedChat.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Message;