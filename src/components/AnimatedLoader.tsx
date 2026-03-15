"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const steps = [
    { text: "Analyzing experience", delay: 0 },
    { text: "Optimizing ATS keywords", delay: 0.5 },
    { text: "Formatting professional layout", delay: 1.0 },
    { text: "Generating final resume", delay: 1.5 },
];

export default function AnimatedLoader() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center gap-8 py-16"
        >
            {/* Glow ring */}
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 blur-xl opacity-30 animate-pulse" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/30">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
            </div>

            {/* Title */}
            <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                    ✨ AI is crafting your resume...
                </h3>
                <p className="text-sm text-gray-400">
                    This may take a few seconds
                </p>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-3 w-full max-w-xs">
                {steps.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: step.delay, duration: 0.4 }}
                        className="flex items-center gap-3"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: step.delay + 0.2, duration: 0.3 }}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20"
                        >
                            <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                        </motion.div>
                        <span className="text-sm text-gray-300 font-medium">
                            {step.text}
                        </span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
