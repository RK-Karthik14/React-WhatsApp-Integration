import React, { useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const mobileNumbers = [
    '+918121000102',
    '+919182861140',
    '+916304752003',
    '+919393054234',
    '+919030974194'
  ];

  const [messages, setMessages] = useState({});
  const [selectedNumbers, setSelectedNumbers] = useState({});

  const handleMessageChange = (index, value) => {
    setMessages(prevMessages => ({
      ...prevMessages,
      [index]: value
    }));
  };

  const handleCheckboxChange = (index) => {
    setSelectedNumbers(prevSelectedNumbers => ({
      ...prevSelectedNumbers,
      [index]: !prevSelectedNumbers[index]
    }));
  };

  const handleSendMessage = async () => {
    const selectedMobileNumbers = mobileNumbers.filter((_, index) => selectedNumbers[index]);
  
    const messagesToSend = selectedMobileNumbers.map((number, index) => ({
      to: number,
      body: messages[mobileNumbers.indexOf(number)] || ''
    })).filter(message => message.body !== '');
  
    if (messagesToSend.length === 0) {
      console.log('No messages to send.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/send-messages', { messages: messagesToSend });
      console.log('Messages sent:', response.data);
    } catch (error) {
      console.error('Error sending messages:', error);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Mobile Numbers</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Select</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Mobile Number</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Message</th>
          </tr>
        </thead>
        <tbody>
          {mobileNumbers.map((number, index) => (
            <tr key={index}>
              <td className="px-6 py-4 border-b border-gray-300">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={selectedNumbers[index] || false}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
              <td className="px-6 py-4 border-b border-gray-300">{number}</td>
              <td className="px-6 py-4 border-b border-gray-300">
                <input
                  type="text"
                  className="form-input mt-1 block w-full"
                  value={messages[index] || ''}
                  onChange={(e) => handleMessageChange(index, e.target.value)}
                  placeholder="Enter your message"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 text-right">
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Send Message
        </button>
      </div>
    </div>
  );
}
