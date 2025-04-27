"use client";

import { motion } from "framer-motion";
import React from "react";
import { Calculator, Target, Shield, PieChart, Brain, GraduationCap } from "lucide-react";

export default function ServicesPage() {
    const services = [
        { name: "SIP Calculator", icon: Calculator },
        { name: "Goal-Based Calculator", icon: Target },
        { name: "Risk Profiling", icon: Shield },
        { name: "Asset Allocation", icon: PieChart },
        { name: "AI Advisor", icon: Brain },
        { name: "SIP Mastery (Learn SIP like a Pro)", icon: GraduationCap },
    ];

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 py-10">
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-10 max-w-2xl w-full text-center"
            >
                {/* Blurred Blob */}
                <div className="absolute -top-10 w-72 h-72 bg-gradient-to-tr from-cyan-400 to-blue-600 opacity-20 rounded-full blur-3xl z-0"></div>

                <div className="relative z-10">
                    <h2 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500/80 bg-clip-text text-transparent mb-8">
                        Our Services
                    </h2>

                    <motion.ul
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: {
                                transition: { staggerChildren: 0.2 }
                            }
                        }}
                        className="space-y-6 text-lg"
                    >
                        {services.map((service, index) => (
                            <motion.li
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                className="flex items-center gap-4 justify-center hover:text-white text-white/70 cursor-pointer transition"
                            >
                                <service.icon className="w-6 h-6 text-cyan-400" />
                                {service.name}
                            </motion.li>
                        ))}
                    </motion.ul>
                </div>
            </motion.div>
        </div>
    );
}

