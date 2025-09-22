import React from 'react';
import { Send } from 'lucide-react';

function MessageInput({ 
  handleSendMessage, 
  inputRef, 
  newMessage, 
  setNewMessage, 
  handleKeyPress 
}) {
  return (
    <div className="p-3 bg-white border-t border-gray-200">
      <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
        <div className="flex-1">
          <textarea
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            rows="1"
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none max-h-32 text-sm"
            style={{ minHeight: '36px' }}
          />
        </div>
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className={`p-2 rounded-full transition-all ${
            newMessage.trim()
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;