import React from 'react';
import { Search, MessageCircle, Users, X, ArrowLeft } from 'lucide-react';
import ChatListItem from './ChatListItem.jsx';

function MessageSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  navigate,
  totalUnreadCount,
  user,
  socketConnected,
  searchTerm,
  setSearchTerm,
  filteredChats,
  selectedChat,
  handleChatSelect,
  unreadCounts,
  formatLastMessageTime
}) {
  return (
    <div className={`
      fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto w-full sm:w-80 lg:w-80 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:transform-none
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium text-gray-800">Messages</h1>
            {totalUnreadCount > 0 && (
              <div className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </div>
            )}
          </div>
          
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
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
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border-none rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat._id}
              chat={chat}
              selectedChat={selectedChat}
              handleChatSelect={handleChatSelect}
              unreadCounts={unreadCounts}
              formatLastMessageTime={formatLastMessageTime}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default MessageSidebar;