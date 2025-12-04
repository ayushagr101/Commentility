import { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Message from './components/Message';
import EmptyState from './components/EmptyState';
import TypingIndicator from './components/TypingIndicator';

function App() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text) => {
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = {
        role: 'assistant',
        content: "I'm a demo Claude interface! In a real implementation, I would connect to the Claude API to provide intelligent responses. For now, I'm showing you how the interface works with beautiful Tailwind CSS styling."
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header onNewChat={handleNewChat} />
      
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {messages.map((message, index) => (
              <Message key={index} role={message.role} content={message.content} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="border-t border-gray-200 bg-white">
        <SearchBar onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  );
}

export default App;