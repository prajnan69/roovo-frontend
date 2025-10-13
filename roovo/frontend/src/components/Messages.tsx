"use client";

import { useState } from 'react';

interface Message {
  sender: string;
  text: string;
  time: string;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
}

const conversations: Conversation[] = [
  { id: 1, name: 'John Doe', lastMessage: 'See you then!', timestamp: '10:40 AM', avatar: 'JD' },
  { id: 2, name: 'Jane Smith', lastMessage: 'Sounds good!', timestamp: 'Yesterday', avatar: 'JS' },
  { id: 3, name: 'Host Support', lastMessage: 'Your request has been updated.', timestamp: 'Tuesday', avatar: 'HS' },
];

const messages: { [key: number]: Message[] } = {
  1: [
    { sender: 'John Doe', text: 'Hey, is the place available next week?', time: '10:30 AM' },
    { sender: 'You', text: 'Hi John, yes it is! Which dates were you thinking?', time: '10:32 AM' },
    { sender: 'John Doe', text: 'Great! From the 15th to the 18th.', time: '10:35 AM' },
    { sender: 'You', text: 'Perfect, I\'ve blocked those dates for you.', time: '10:38 AM' },
    { sender: 'John Doe', text: 'See you then!', time: '10:40 AM' },
  ],
  2: [
    { sender: 'Jane Smith', text: 'Just wanted to confirm my check-in time.', time: 'Yesterday' },
    { sender: 'You', text: 'Hi Jane, you can check in anytime after 3 PM.', time: 'Yesterday' },
    { sender: 'Jane Smith', text: 'Sounds good!', time: 'Yesterday' },
  ],
  3: [
    { sender: 'Host Support', text: 'Your request #12345 has been updated.', time: 'Tuesday' },
  ],
};

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState<Conversation>(conversations[0]);

  return (
    <div className="h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Inbox</h1>
          <input
            type="text"
            placeholder="Search messages"
            className="w-full bg-gray-900 border border-gray-700 p-2 mt-4"
          />
        </div>
        <div className="flex-grow overflow-y-auto">
          {conversations.map((convo) => (
            <div
              key={convo.id}
              onClick={() => setActiveConversation(convo)}
              className={`p-4 flex items-center cursor-pointer border-b border-gray-800 ${activeConversation.id === convo.id ? 'bg-gray-800' : 'hover:bg-gray-900'}`}
            >
              <div className="w-10 h-10 bg-blue-600 flex items-center justify-center font-bold mr-4">
                {convo.avatar}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">{convo.name}</h3>
                  <span className="text-xs text-gray-400">{convo.timestamp}</span>
                </div>
                <p className="text-sm text-gray-400 truncate">{convo.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="w-2/3 flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center">
          <div className="w-10 h-10 bg-blue-600 flex items-center justify-center font-bold mr-4">
            {activeConversation.avatar}
          </div>
          <h2 className="text-xl font-bold">{activeConversation.name}</h2>
        </div>
        <div className="flex-grow p-6 overflow-y-auto bg-gray-900">
          <div className="space-y-4">
            {messages[activeConversation.id].map((msg: Message, index: number) => (
              <div key={index} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 max-w-lg ${msg.sender === 'You' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'You' ? 'text-gray-600' : 'text-gray-400'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-800 bg-black">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-grow bg-gray-800 border border-gray-700 p-3"
            />
            <button className="ml-4 bg-white text-black font-bold py-3 px-6">
              Send
            </button>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <button className="hover:text-white">Saved Replies</button>
            <button className="hover:text-white">Schedule Message</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
