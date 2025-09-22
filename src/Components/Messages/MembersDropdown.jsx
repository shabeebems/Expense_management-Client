import React from 'react';

function MembersDropdown({ selectedChat, user }) {
  return (
    <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-3 border-b border-gray-100">
        <h3 className="font-medium text-gray-900">{selectedChat.name}</h3>
        <p className="text-xs text-gray-500">{selectedChat.members?.length || 0} members</p>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {selectedChat.members?.map((member) => (
          <div key={member.userId} className="flex items-center space-x-3 p-3 hover:bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-medium">
              {member.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm text-gray-900">{member.username}</span>
                {member.isAdmin && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">
                    Admin
                  </span>
                )}
                {member.userId === user._id && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                    You
                  </span>
                )}
              </div>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MembersDropdown;