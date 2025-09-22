import React from 'react';
import { MessageCircle } from 'lucide-react';
import MessageItem from './MessageItem.jsx';

function MessageList({ messages, user, formatTime, messagesEndRef }) {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Start the conversation</h3>
          <p className="text-gray-500 text-sm">Send your first message to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {messages.map((message, index) => (
        <MessageItem
          key={message._id}
          message={message}
          index={index}
          messages={messages}
          user={user}
          formatTime={formatTime}
        />
      ))}
      <div ref={messagesEndRef} />
    </>
  );
}

export default MessageList;