import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const ChatModal: React.FC = ({
  isOpen,
  onClose,
  booking,
  technician,
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey there! 👋",
      sender: "technician",
      timestamp: "10:15",
      status: "delivered",
    },
    {
      id: 2,
      text: "Since it's a new job that my needs update for records. There is support for many new items and characters 😊",
      sender: "technician",
      timestamp: "10:16",
      status: "delivered",
    },
    {
      id: 3,
      text: "Hi",
      sender: "user",
      timestamp: "10:17",
      status: "delivered",
    },
    {
      id: 4,
      text: "I had messaged you to know more about my A/C service When you will be available",
      sender: "user",
      timestamp: "10:17",
      status: "delivered",
    },
    {
      id: 5,
      text: "Thanks for contacting me I will say more about the conditioner",
      sender: "technician",
      timestamp: "10:18",
      status: "delivered",
    },
    {
      id: 6,
      text: "Will take the work by 2:30 today I will contact you regarding this",
      sender: "technician",
      timestamp: "10:19",
      status: "delivered",
    },
    {
      id: 7,
      text: "Great! 👍",
      sender: "user",
      timestamp: "10:20",
      status: "delivered",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        status: "sent",
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 30,
      transition: {
        duration: 0.25,
        ease: "easeInOut",
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3, delay: 0.1 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-[60]"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-[70] pointer-events-none">
            <div className="flex h-full items-end justify-end p-4">
              <motion.div
                className="bg-white rounded-lg w-full max-w-md h-[600px] flex flex-col shadow-xl"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header with Close Button */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="font-medium text-lg text-gray-800">Message</h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-light transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* Technician Info */}
                <div className="flex items-center p-4 bg-gray-50 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium mr-3">
                    {technician?.name?.charAt(0) || "N"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {technician?.name || "Nicolas"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {technician?.specialty || "A/C Mechanic"}
                    </p>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-end space-x-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                      >
                        {/* Profile Picture for Technician */}
                        {message.sender === "technician" && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                            {technician?.name?.charAt(0) || "N"}
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.sender === "user"
                              ? "bg-gray-800 text-white"
                              : "bg-gray-800 text-white"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs opacity-70">
                              {message.timestamp}
                            </span>
                            {message.sender === "user" && (
                              <span className="text-xs opacity-70 ml-2">
                                {message.status === "sent" && "✓"}
                                {message.status === "delivered" && "✓✓"}
                                {message.status === "read" && "✓✓"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
