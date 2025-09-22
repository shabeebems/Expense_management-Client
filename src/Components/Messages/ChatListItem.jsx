import React from 'react';
import { Users } from 'lucide-react';

function ChatListItem({
  chat,
  selectedChat,
  handleChatSelect,
  unreadCounts,
  formatLastMessageTime
}) {
  const unreadCount = unreadCounts[chat._id] || 0;
  const hasUnread = unreadCount > 0;
  
  return (
    <div
      onClick={() => handleChatSelect(chat)}
      className={`
        p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100
        ${selectedChat?._id === chat._id ? 'bg-gray-50' : ''}
      `}
    >
      <div className="flex items-center space-x-3">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            <Users className="w-5 h-5" />
          </div>
          {hasUnread && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-medium truncate text-sm ${hasUnread ? 'text-gray-900' : 'text-gray-800'}`}>
              {chat.name}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-400">
                {chat.members?.length || 0}
              </span>
              {chat.latestMessageDetails && (
                <span className="text-xs text-gray-400">
                  {formatLastMessageTime(chat.latestMessageDetails.createdAt)}
                </span>
              )}
            </div>
          </div>
          <p className={`text-xs truncate ${hasUnread ? 'text-gray-600 font-medium' : 'text-gray-500'}`}>
            {chat.latestMessageDetails ? (
              <>
                {chat.latestMessageDetails.sender.username}: {chat.latestMessageDetails.content}
              </>
            ) : (
              'No messages yet'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatListItem;