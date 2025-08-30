import React, { useState } from 'react';
import { Search, Send, MessageCircle } from 'lucide-react';

const dummyChats = [
  {
    id: 1,
    name: 'Alice Johnson',
    lastMessage: 'Hey! How are you doing?',
    time: '2:30 PM',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 2,
    name: 'Bob Smith',
    lastMessage: 'Can we schedule a meeting for tomorrow?',
    time: '1:45 PM',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 3,
    name: 'Carol Williams',
    lastMessage: 'Thanks for the help with the project!',
    time: '12:15 PM',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 4,
    name: 'David Brown',
    lastMessage: 'Let me know when you are free',
    time: '11:30 AM',
    avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 5,
    name: 'Emma Davis',
    lastMessage: 'The presentation looks great!',
    time: '10:20 AM',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

const dummyMessages = {
  1: [
    { id: 1, text: 'Hey! How are you doing?', sender: 'Alice Johnson', time: '2:25 PM', isOwn: false },
    { id: 2, text: 'I\'m doing great, thanks! How about you?', sender: 'Me', time: '2:27 PM', isOwn: true },
    { id: 3, text: 'Pretty good! Just working on some projects', sender: 'Alice Johnson', time: '2:30 PM', isOwn: false }
  ],
  2: [
    { id: 4, text: 'Can we schedule a meeting for tomorrow?', sender: 'Bob Smith', time: '1:40 PM', isOwn: false },
    { id: 5, text: 'Sure! What time works for you?', sender: 'Me', time: '1:42 PM', isOwn: true },
    { id: 6, text: 'How about 10 AM?', sender: 'Bob Smith', time: '1:45 PM', isOwn: false }
  ],
  3: [
    { id: 7, text: 'Thanks for the help with the project!', sender: 'Carol Williams', time: '12:10 PM', isOwn: false },
    { id: 8, text: 'You\'re welcome! Happy to help', sender: 'Me', time: '12:12 PM', isOwn: true },
    { id: 9, text: 'Let me know if you need anything else', sender: 'Me', time: '12:13 PM', isOwn: true }
  ],
  4: [
    { id: 10, text: 'Let me know when you are free', sender: 'David Brown', time: '11:30 AM', isOwn: false }
  ],
  5: [
    { id: 11, text: 'The presentation looks great!', sender: 'Emma Davis', time: '10:15 AM', isOwn: false },
    { id: 12, text: 'Thank you! I put a lot of work into it', sender: 'Me', time: '10:17 PM', isOwn: true },
    { id: 13, text: 'It really shows! Great job', sender: 'Emma Davis', time: '10:20 AM', isOwn: false }
  ]
};

function Message() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(dummyMessages);

  const filteredChats = dummyChats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMessages = messages[selectedChat] || [];
  const currentChat = dummyChats.find(chat => chat.id === selectedChat);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now(),
        text: newMessage,
        sender: 'Me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };

      setMessages(prev => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), newMsg]
      }));
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Chat List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MessageCircle className="text-blue-600" />
            Messages
          </h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChat === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Messages */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <img
                  src={currentChat.avatar}
                  alt={currentChat.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-semibold text-gray-900">{currentChat.name}</h2>
                  <p className="text-sm text-green-600">Online</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isOwn
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-gray-200 text-gray-800 rounded-bl-sm'
                  }`}>
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isOwn ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
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
    </div>
  );
}

export default Message;