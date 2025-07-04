import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  technician?: any;
  user?: any;
  messages: any[];
  loading: boolean;
  onSendMessage: (message: string) => void;
  sending: boolean;
  currentUserType: "user" | "technician";
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  booking,
  technician,
  user,
  messages,
  loading,
  onSendMessage,
  sending,
  currentUserType,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserRole = currentUserType;
  
  // Debug: Log the booking and technician/user props
  console.log("Booking object:", booking);
  console.log("Technician prop:", technician);
  console.log("User prop:", user);
  
  const chatPartner = technician || user;
  console.log("Chat Partner Object in chat modal:", chatPartner);
  
  // Try to get partner details from booking if technician/user are just IDs
  let partnerDetails = null;
  if (typeof chatPartner === 'string') {
    // If chatPartner is just an ID, try to get details from booking object
    if (currentUserType === 'user' && booking?.technicianId && typeof booking.technicianId === 'object') {
      partnerDetails = booking.technicianId;
    } else if (currentUserType === 'technician' && booking?.userId && typeof booking.userId === 'object') {
      partnerDetails = booking.userId;
    }
  } else {
    partnerDetails = chatPartner;
  }
  
  console.log("Partner details:", partnerDetails);
  
  const chatPartnerName = partnerDetails?.username || partnerDetails?.name || "User";
  const chatPartnerPhoto = partnerDetails?.profilePicture || 
                          partnerDetails?.avatar || 
                          partnerDetails?.photo || 
                          partnerDetails?.profileImage ||
                          partnerDetails?.userImage ||
                          partnerDetails?.image;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !sending) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
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
          />

          <div className="fixed inset-0 z-[70] pointer-events-none">
            <div className="flex h-full items-end justify-end p-4">
              <motion.div
                className="bg-white rounded-lg w-full max-w-md h-[600px] flex flex-col shadow-xl pointer-events-auto"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header with Recipient Info */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center space-x-3">
                    {chatPartnerPhoto ? (
                      <div>
                        <img
                          src={chatPartnerPhoto}
                          alt={chatPartnerName}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            console.log("Image failed to load:", chatPartnerPhoto);
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium" style={{display: 'none'}}>
                          {chatPartnerName.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                        {chatPartnerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <h3 className="font-medium text-lg text-gray-800">
                      {chatPartnerName}
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-light transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${
                          message.senderType === currentUserRole
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div className="max-w-[80%]">
                          {/* Message Bubble */}
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              message.senderType === currentUserRole
                                ? "bg-blue-500 text-white"
                                : "bg-white text-gray-800 border border-gray-200"
                            }`}
                          >
                            <div className="flex items-end justify-between gap-3">
                              <p className="text-sm flex-1">{message.messageText}</p>
                              <span className={`text-xs flex-shrink-0 ${
                                message.senderType === currentUserRole
                                  ? "text-blue-100"
                                  : "text-gray-500"
                              }`}>
                                {formatTimestamp(message.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
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
                      )}
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