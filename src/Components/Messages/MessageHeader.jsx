import React from 'react';
import { Menu, Users, ChevronDown } from 'lucide-react';
import MembersDropdown from './MembersDropdown.jsx';

function MessageHeader({
  selectedChat,
  setIsSidebarOpen,
  isTyping,
  typingUser,
  showMembersDropdown,
  setShowMembersDropdown,
  user
}) {
  return (
    <div className="p-3 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            <Users className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-gray-900">{selectedChat.name}</h2>
            <p className="text-xs text-gray-500">
              {isTyping && typingUser ? (
                <span className="text-green-600">{typingUser} typing...</span>
              ) : (
                `${selectedChat.members?.length || 0} members`
              )}
            </p>
          </div>
        </div>

        {/* Members Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMembersDropdown(!showMembersDropdown)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </button>

          {showMembersDropdown && (
            <MembersDropdown
              selectedChat={selectedChat}
              user={user}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageHeader;