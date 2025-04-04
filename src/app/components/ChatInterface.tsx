'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './ChatInterface.module.css';
import OpenAI from 'openai';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() && !isLoading) {
      const newMessage = { text: inputValue, sender: 'user' as const };
      setMessages(prev => [...prev, newMessage]);
      setInputValue('');
      setIsLoading(true);
      setError(null);

      try {
        const apiKey = process.env.NEXT_PUBLIC_SILICONFLOW_API_KEY;
        if (!apiKey) {
          throw new Error('API密钥未设置');
        }

        const client = new OpenAI({
          baseURL: 'https://api.siliconflow.cn/v1',
          apiKey: apiKey,
          dangerouslyAllowBrowser: true
        });

        const response = await client.chat.completions.create({
          model: "deepseek-ai/DeepSeek-V2.5",
          messages: [
            { role: "user", content: inputValue }
          ],
        });

        const botReply = response.choices[0].message.content || "抱歉，我没有收到回复。";
        setMessages(prev => [...prev, { text: botReply, sender: 'bot' as const }]);
      } catch (error) {
        console.error('Error:', error);
        const errorMessage = error instanceof Error ? error.message : '发生未知错误';
        setError(errorMessage);
        setMessages(prev => [...prev, { 
          text: `抱歉，发生了错误：${errorMessage}`, 
          sender: 'bot' as const 
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <div className={styles.chatContainer}>
      {error && (
        <div className={styles.errorMessage}>
          错误: {error}
        </div>
      )}
      <div className={styles.messages}>
        {messages.map((message, index) => (
          <div key={index} className={`${styles.message} ${styles[message.sender]}`}>
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.message} ${styles.bot}`}>
            正在思考...
          </div>
        )}
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
          disabled={isLoading}
        />
        <button 
          onClick={handleSendMessage} 
          className={styles.sendButton}
          disabled={isLoading}
        >
          {isLoading ? '发送中...' : '发送'}
        </button>
      </div>
    </div>
  );
} 