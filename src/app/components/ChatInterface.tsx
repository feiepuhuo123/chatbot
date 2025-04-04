'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './ChatInterface.module.css';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = { text: inputValue, sender: 'user' as const };
      setMessages(prev => [...prev, newMessage]);
      setInputValue('');

      // 模拟机器人回复
      setTimeout(() => {
        const botReply = getBotReply(inputValue);
        setMessages(prev => [...prev, { text: botReply, sender: 'bot' as const }]);
      }, 500);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const getBotReply = (userMessage: string): string => {
    if (userMessage.includes('你好')) {
      return '你好！有什么我可以帮助你的吗？';
    } else if (userMessage.includes('天气')) {
      return '今天天气晴朗，适合外出！';
    } else {
      return '抱歉，我不太明白你说什么。';
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((message, index) => (
          <div key={index} className={`${styles.message} ${styles[message.sender]}`}>
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputArea}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入你的消息..."
          className={styles.input}
        />
        <button onClick={handleSendMessage} className={styles.sendButton}>
          发送
        </button>
      </div>
    </div>
  );
} 