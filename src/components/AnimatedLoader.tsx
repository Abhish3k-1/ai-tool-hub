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
            transition={{ duration: 0.35 }}
            className="glass-panel flex flex-col items-center justify-center gap-8 rounded-3xl py-16"
        >
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 blur-xl opacity-30 animate-pulse" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-600 shadow-2xl shadow-sky-500/30">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
            </div>

            <div className="text-center">
                <h3 className="mb-2 text-xl font-bold text-slate-900">
                    AI is crafting your resume...
                </h3>
                <p className="text-sm text-slate-600">This may take a few seconds</p>
            </div>

            <div className="w-full max-w-xs space-y-3">
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
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100"
                        >
                            <div className="h-2 w-2 animate-pulse rounded-full bg-sky-500" />
                        </motion.div>
                        <span className="text-sm font-medium text-slate-700">{step.text}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
