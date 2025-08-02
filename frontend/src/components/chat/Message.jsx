import React from 'react';

const Message = ({ message, isOwn }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-2 rounded-lg ${
            isOwn
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-900'
          }`}
        >
          {message.content && (
            <p className="text-sm">{message.content}</p>
          )}
          
          {message.fileUrl && (
            <div className="mt-2">
              {message.messageType === 'image' ? (
                <img 
                  src={message.fileUrl} 
                  alt="Shared image" 
                  className="max-w-full rounded"
                />
              ) : (
                <a 
                  href={message.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center"
                >
                  <span className="mr-1">📎</span>
                  Attachment
                </a>
              )}
            </div>
          )}
          
          <div className={`text-xs mt-1 ${
            isOwn ? 'text-indigo-200' : 'text-gray-500'
          }`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
        
        {message.isRead && isOwn && (
          <div className="text-xs text-gray-500 mt-1 text-right">
            ✓ Read
          </div>
        )}
      </div>
    </div>
  );
};

export default Message; 