import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';
import './Support.css';

const Support = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: 'Hello! How can I help you today?',
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [inputMessage, setInputMessage] = useState('');

    const quickResponses = [
        'Track my order',
        'Help with payment',
        'Restaurant not found',
        'Cancel order',
        'Talk to agent',
    ];

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            text: inputMessage,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages([...messages, newMessage]);
        setInputMessage('');

        // Simulate bot response
        setTimeout(() => {
            const botResponse = {
                id: messages.length + 2,
                text: getBotResponse(inputMessage),
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botResponse]);
        }, 1000);
    };

    const getBotResponse = (message) => {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('track') || lowerMessage.includes('order')) {
            return 'You can track your order from the "My Orders" page. Click on any order to see live tracking details.';
        }
        if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
            return 'We accept UPI, Credit Card, Debit Card, and Cash on Delivery. If you\'re having payment issues, please ensure your payment method is valid.';
        }
        if (lowerMessage.includes('cancel')) {
            return 'You can cancel an order within 5 minutes of placing it. Go to "My Orders" and click the Cancel button on your order.';
        }
        if (lowerMessage.includes('agent') || lowerMessage.includes('human')) {
            return 'I\'ll connect you with a support agent. Please hold while we transfer your chat.';
        }

        return 'I understand your concern. Could you please provide more details so I can assist you better?';
    };

    const handleQuickResponse = (response) => {
        setInputMessage(response);
    };

    return (
        <div className="support-page">
            <Navbar />

            <div className="container" style={{ padding: '40px 20px' }}>
                <h1>Customer Support</h1>

                <div className="support-container">
                    {/* FAQ Section */}
                    <div className="faq-section">
                        <h2>Frequently Asked Questions</h2>
                        <div className="faq-list">
                            <details className="faq-item">
                                <summary>How do I track my order?</summary>
                                <p>
                                    Go to "My Orders" page and click on any active order. You'll see real-time
                                    tracking with delivery partner location and order status.
                                </p>
                            </details>
                            <details className="faq-item">
                                <summary>What payment methods are accepted?</summary>
                                <p>
                                    We accept UPI, Credit Card, Debit Card, and Cash on Delivery (COD).
                                    All online payments are secure and encrypted.
                                </p>
                            </details>
                            <details className="faq-item">
                                <summary>How do I cancel an order?</summary>
                                <p>
                                    You can cancel an order within 5 minutes of placing it. Go to "My Orders"
                                    and click the Cancel button on your order.
                                </p>
                            </details>
                            <details className="faq-item">
                                <summary>What if my food is late?</summary>
                                <p>
                                    Track your order in real-time. If it's significantly delayed, contact
                                    support through this chatbot and we'll assist you.
                                </p>
                            </details>
                        </div>
                    </div>

                    {/* Chatbot */}
                    <div className="chatbot-section">
                        <div className="chat-header">
                            <FaRobot className="bot-icon" />
                            <div>
                                <h3>Delivr Support Bot</h3>
                                <p>Online</p>
                            </div>
                        </div>

                        <div className="chat-messages">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                                >
                                    <div className="message-content">
                                        <p>{message.text}</p>
                                        <span className="message-time">
                                            {message.timestamp.toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="quick-responses">
                            {quickResponses.map((response, index) => (
                                <button
                                    key={index}
                                    className="quick-response-btn"
                                    onClick={() => handleQuickResponse(response)}
                                >
                                    {response}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSendMessage} className="chat-input-form">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="chat-input"
                            />
                            <button type="submit" className="send-btn">
                                <FaPaperPlane />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Support;
