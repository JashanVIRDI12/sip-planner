"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export default function ContactPage() {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 py-10"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
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

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.open(`https://wa.me/917015591455?text=Hi!%20I'm%20interested%20in%20your%20services.`, '_blank')}
                                className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-green-500/50 transition"
                            >
                                Chat on WhatsApp
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=your@email.com&su=Inquiry%20from%20SIP%20Planner&body=Hi%20there,%0A%0AI'd%20like%20to%20know%20more%20about%20your%20services.%0A%0AThanks!`, '_blank')}
                                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-cyan-500/50 transition"
                            >
                                Send Email
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}






