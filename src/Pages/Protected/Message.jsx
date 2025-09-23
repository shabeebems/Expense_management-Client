import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Menu } from 'lucide-react';
import io from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router';
import MessageSidebar from '../../Components/Messages/MessageSidebar.jsx';
import MessageHeader from '../../Components/Messages/MessageHeader.jsx';
import MessageList from '../../Components/Messages/MessageList.jsx';
import MessageInput from '../../Components/Messages/MessageInput.jsx';

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
  const [isSending, setIsSending] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [showMembersDropdown, setShowMembersDropdown] = useState(false);
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
    if (selectedChat && inputRef.current && !isSending) {
      inputRef.current.focus();
    }
  }, [selectedChat, isSending]);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || isSending) return;

    const messageToSend = newMessage;
    setIsSending(true);
    
    try {
      const response = await axios.post(
        `${API_URL}/messages`,
        {
          content: messageToSend,
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
      // Restore the message if there was an error
      setNewMessage(messageToSend);
    } finally {
      setIsSending(false);
      // Focus back to input after sending
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSending) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setIsSidebarOpen(false);
    setShowMembersDropdown(false);
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
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-300 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Chat List */}
      <MessageSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        navigate={navigate}
        totalUnreadCount={totalUnreadCount}
        user={user}
        socketConnected={socketConnected}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredChats={filteredChats}
        selectedChat={selectedChat}
        handleChatSelect={handleChatSelect}
        unreadCounts={unreadCounts}
        formatLastMessageTime={formatLastMessageTime}
      />

      {/* Right Side - Messages */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <MessageHeader
              selectedChat={selectedChat}
              setIsSidebarOpen={setIsSidebarOpen}
              isTyping={isTyping}
              typingUser={typingUser}
              showMembersDropdown={showMembersDropdown}
              setShowMembersDropdown={setShowMembersDropdown}
              user={user}
            />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
              <MessageList
                messages={messages}
                user={user}
                formatTime={formatTime}
                messagesEndRef={messagesEndRef}
              />
            </div>

            {/* Message Input */}
            <MessageInput
              handleSendMessage={handleSendMessage}
              inputRef={inputRef}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleKeyPress={handleKeyPress}
              isSending={isSending}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-full shadow-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="text-center">
              <MessageCircle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">Welcome to Messages</h3>
              <p className="text-gray-500">Select a conversation to start chatting.</p>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
              >
                View Conversations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;