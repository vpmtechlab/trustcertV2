"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle2, Users, Globe, Zap } from "lucide-react";
<<<<<<< HEAD
=======
import Image from "next/image";
>>>>>>> 5386f732217102893923743a3d68f902f33ee196

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const features = [
    { icon: Shield, label: "Bank-grade Security" },
    { icon: CheckCircle2, label: "99.9% Accuracy" },
    { icon: Users, label: "2M+ Verifications" },
    { icon: Globe, label: "180+ Countries" },
  ];

  return (
    <div className="min-h-[calc(100vh-3rem)] w-full flex items-center justify-center p-4 lg:p-8 font-sans overflow-hidden relative">
      {/* Main Background with Greenish Bluish Gradient and Blur */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0a192f] via-[#0f2e2e] to-[#0a142f] z-0" />
      <div className="absolute inset-0 bg-teal-900/20 backdrop-blur-3xl z-0 pointer-events-none" />

      {/* Ambient Blobs for extra 'blurrish' feel */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1400px] h-[90vh] min-h-[550px] max-h-[900px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col lg:flex-row ring-1 ring-gray-200/50 dark:bg-slate-900 dark:ring-white/10">
        {/* Form Section - Left Side */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center overflow-y-auto relative no-scrollbar">
          <div className="w-full max-w-sm mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Branding Section - Right Side */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-[#0a192f] via-[#0a192f] to-[#112240]" />
          <div className="absolute inset-0 bg-linear-to-br from-secondary via-secondary/95 to-primary opacity-90" />

          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-3xl" />

            {/* Diagonal Lines */}
            <div className="absolute top-20 right-0 h-px w-[800px] -rotate-45 bg-linear-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute top-40 right-0 h-px w-[800px] -rotate-45 bg-linear-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute bottom-40 left-0 h-px w-[800px] -rotate-45 bg-linear-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center p-12 w-full max-w-2xl h-full">
            {/* Center Content Group */}
            <div className="flex flex-col items-center text-center">
              {/* Large Logo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <div className="relative">
                  <div className="w-32 h-32 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl text-white font-bold text-2xl">
                    LOGO
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="max-w-lg"
              >
                <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                  Welcome to TrustCert
                </h1>
                <p className="text-teal-100/80 text-lg leading-relaxed">
                  Automate corporate KYC, verify entities globally, and ensure compliance with a platform built for modern financial institutions.
                </p>
              </motion.div>

              {/* Feature Pills */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 flex flex-wrap justify-center gap-3"
              >
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 transition-all hover:bg-white/20"
                  >
                    <feature.icon className="w-4 h-4 text-teal-300" />
                    <span className="text-white/90 text-sm font-medium">
                      {feature.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Bottom: Social Proof Card - Pushed to bottom or just below */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 w-full max-w-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Trusted by Industry Leaders
                  </h3>
                  <p className="mt-1 text-sm text-white/60">
                    Join 2,000+ companies using TrustCert.
                  </p>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-teal-900 bg-gray-300 flex items-center justify-center text-xs font-bold"
                    ></div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
