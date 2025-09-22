import React from 'react';

function MessageItem({ message, index, messages, user, formatTime }) {
  const isOwnMessage = message.sender._id === user?._id;
  const showAvatar = !isOwnMessage && (
    index === 0 || 
    messages[index - 1].sender._id !== message.sender._id
  );
  const showUsername = !isOwnMessage && showAvatar;

  return (
    <div className={`flex mb-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isOwnMessage ? '' : 'flex items-end space-x-2'}`}>
        {!isOwnMessage && showAvatar && (
          <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-medium mb-1">
            {message.sender.username.charAt(0).toUpperCase()}
          </div>
        )}
        
        <div className={`${!isOwnMessage && !showAvatar ? 'ml-10' : ''}`}>
          {showUsername && (
            <p className="text-xs text-blue-600 font-medium mb-1 px-1">
              {message.sender.username}
            </p>
          )}
          <div className={`px-3 py-2 rounded-lg relative ${
            isOwnMessage
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
          }`}>
            <p className="text-sm break-words">{message.content}</p>
            <p className={`text-xs mt-1 text-right ${
              isOwnMessage ? 'text-blue-100' : 'text-gray-400'
            }`}>
              {formatTime(message.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageItem;