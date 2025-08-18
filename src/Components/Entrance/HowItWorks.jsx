import React from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign, BarChart3, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

const Step = ({ number, icon: Icon, title, description, delay = 0, isLast = false }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
      >
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl">
          <Icon className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {number}
        </div>
        {!isLast && (
          <div className="hidden lg:block absolute top-12 left-full w-32 h-0.5 bg-gradient-to-r from-emerald-300 to-blue-300 ml-8">
            <ArrowRight className="absolute -top-2 right-0 w-5 h-5 text-blue-500" />
          </div>
        )}
      </motion.div>
      
      <motion.h3
        className="text-2xl font-semibold text-gray-900 mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
      >
        {title}
      </motion.h3>
      
      <motion.p
        className="text-gray-600 max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: delay + 0.3 }}
      >
        {description}
      </motion.p>
    </div>
  );
};

const HowItWorks = () => {
  const navigate = useNavigate();
  
  const steps = [
    {
      icon: Plus,
      title: "Create Ledgers",
      description: "Start by creating different ledgers for various aspects of your life - Business, Personal, Food, Entertainment, etc."
    },
    {
      icon: DollarSign,
      title: "Track Transactions",
      description: "Add your income and expenses to the appropriate ledgers. Categorize them for better organization."
    },
    {
      icon: BarChart3,
      title: "Monitor & Analyze",
      description: "View detailed reports and insights to understand your spending patterns and make informed financial decisions."
    }
  ];

  return (
    <div id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How it
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"> works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started with ProFinance in just three simple steps. 
            It's designed to be intuitive and easy to use.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          {steps.map((step, index) => (
            <Step
              key={step.title}
              number={index + 1}
              icon={step.icon}
              title={step.title}
              description={step.description}
              delay={index * 0.2}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <button
            onClick={() => navigate('/login')}
            className="bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-colors hover:scale-105 transform duration-200 cursor-pointer">
              Start Your Free Trial
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorks;