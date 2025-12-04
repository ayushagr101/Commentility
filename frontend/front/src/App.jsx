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
    // Call heuristic backend analyzer at /analyze
    try {
      const resp = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: text })
      });
      if (!resp.ok) throw new Error(`Server responded ${resp.status}`);
      const body = await resp.json();
      let assistantText = '';
      if (body && body.success && body.data) {
        const d = body.data;
        assistantText = `Sentiment: ${d.sentiment}\nScore: ${d.score}\nExplanation: ${d.explanation}`;
      } else if (body && body.message) {
        assistantText = `Analysis failed: ${body.message}`;
      } else {
        assistantText = `Analysis returned unexpected result.`;
      }
      const aiResponse = { role: 'assistant', content: assistantText };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      const aiResponse = { role: 'assistant', content: `Error analyzing comment: ${err.message || err}` };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
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