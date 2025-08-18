import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Target, ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router';

const FloatingCard = ({ children, delay = 0, className = "" }) => {

  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 + delay }}
    >
      {children}
    </motion.div>
  );
};

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 32V.5H32" fill="none" stroke="rgb(16, 185, 129)" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              ProFinance
            </span>
          </motion.div>

          <motion.div 
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a href="#features" className="text-gray-600 hover:text-emerald-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-emerald-600 transition-colors">How it Works</a>
            <a href="#benefits" className="text-gray-600 hover:text-emerald-600 transition-colors">Benefits</a>
            <button 
              onClick={() => navigate('/login')}
              className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition-colors cursor-pointer">
                Get Started
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Shield className="w-4 h-4 text-emerald-600 mr-2" />
            <span className="text-emerald-700 text-sm font-medium">Trusted by 10,000+ users worldwide</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Manage Your
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Finances Smartly
            </span>
          </motion.h1>

          <motion.p 
            className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            ProFinance helps you keep track of incomes and expenses for different areas of life — 
            whether it's your business, household, food, or parties — all neatly organized in separate Ledgers.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <button
              onClick={() => navigate('/login')}
              className="group bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-all duration-300 hover:scale-105 flex items-center cursor-pointer">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            {/* <button className="group flex items-center text-gray-700 hover:text-emerald-600 transition-colors">
              <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center mr-3 group-hover:border-emerald-300 transition-colors">
                <Play className="w-5 h-5 ml-0.5" />
              </div>
              Watch Demo
            </button> */}
          </motion.div>
        </div>

        {/* Floating Cards */}
        <div className="relative h-96">
          <FloatingCard 
            className="left-8 top-8"
            delay={0.1}
          >
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 max-w-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Business Ledger</h3>
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Income</span>
                  <span className="text-emerald-600 font-semibold">+$12,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Expenses</span>
                  <span className="text-red-500 font-semibold">-$8,230</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-semibold">Net</span>
                  <span className="text-emerald-600 font-bold">+$4,220</span>
                </div>
              </div>
            </div>
          </FloatingCard>

          <FloatingCard 
            className="right-8 top-16"
            delay={0.3}
          >
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-6 shadow-xl border border-emerald-100 max-w-xs">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">4 Active Ledgers</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">127 Transactions</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">$24,680 Tracked</span>
                </div>
              </div>
            </div>
          </FloatingCard>

          <FloatingCard 
            className="left-1/2 bottom-8 transform -translate-x-1/2"
            delay={0.5}
          >
            <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-sm text-gray-600">3 categories organized</span>
              </div>
            </div>
          </FloatingCard>
        </div>
      </div>
    </div>
  );
};

export default Hero;