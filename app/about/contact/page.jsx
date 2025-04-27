"use client";

import { motion } from "framer-motion";
import React from "react";

export default function ContactPage() {

    const handleSendWhatsApp = () => {
        const phoneNumber = "917015591455"; // 🔥 your number with country code
        const message = encodeURIComponent("Hi! I'm interested in your services. Can you assist me?");
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    const handleSendEmail = () => {
        const email = "jashanvirdi12@gmail.com"; // 🔥 replace this with your real email
        const subject = encodeURIComponent("Inquiry from SIP Planner Contact Page");
        const body = encodeURIComponent("Hi there,\n\nI would like to know more about your services.\n\nThanks!");
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`, '_blank');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 py-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-10 max-w-2xl w-full text-center"
            >
                {/* Blurry Glow Blob */}
                <div className="absolute -top-10 w-72 h-72 bg-gradient-to-tr from-cyan-400 to-blue-600 opacity-30 rounded-full blur-3xl z-0"></div>

                <div className="relative z-10 space-y-8">
                    <h2 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500/80 bg-clip-text text-transparent mb-6">
                        Contact Us
                    </h2>
                    <p className="text-white/80 mb-8">
                        Got questions? Ready to plan smarter? <br /> Choose your way to connect with us!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {/* WhatsApp Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSendWhatsApp}
                            className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-green-500/50 transition"
                        >
                            Chat on WhatsApp
                        </motion.button>

                        {/* Email Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSendEmail}
                            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-cyan-500/50 transition"
                        >
                            Send Email
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}





