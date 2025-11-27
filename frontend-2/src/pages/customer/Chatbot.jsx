import { useState, useRef, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { GiChefToque } from 'react-icons/gi';
import { FaPaperPlane } from 'react-icons/fa';
import './Chatbot.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm Mr. Chef. How can I help you with your food or health queries today?", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        // Add user message
        const userMessage = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');

        // Simulate bot response
        setTimeout(() => {
            const botResponse = {
                id: Date.now() + 1,
                text: "That's a great question! As an AI Chef, I'm still learning, but I'd recommend choosing fresh ingredients and balanced meals. (Backend integration coming soon!)",
                sender: 'bot'
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    return (
        <div className="chatbot-page">
            <Navbar />

            <div className="chatbot-container">
                <div className="chatbot-header">
                    <div className="chef-avatar">
                        <GiChefToque />
                    </div>
                    <h1>Mr. Chef</h1>
                </div>

                <div className="chatbot-messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message ${msg.sender}`}>
                            <span className="message-sender">{msg.sender === 'bot' ? 'Mr. Chef' : 'You'}</span>
                            <p>{msg.text}</p>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chatbot-input-area" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        className="chatbot-input"
                        placeholder="Ask Mr. Chef anything..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <button type="submit" className="send-btn">
                        <FaPaperPlane />
                    </button>
                </form>
            </div>

            <Footer />
        </div>
    );
};

export default Chatbot;
