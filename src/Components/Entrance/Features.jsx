"use client"

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { BookOpen, DollarSign, Shield, Smartphone, Zap, Sparkles, Wallet } from "lucide-react";

const Features = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: BookOpen,
      title: "Multiple Ledgers",
      description: "Create separate ledgers for business, household, food, and entertainment expenses.",
      color: "blue"
    },
    {
      icon: DollarSign,
      title: "Income & Expense Tracking",
      description: "Easily add and categorize your financial transactions with our intuitive interface.",
      color: "green"
    },
    // {
    //   icon: BarChart3,
    //   title: "Visual Reports",
    //   description: "Get insights into your spending patterns with beautiful charts and analytics.",
    //   color: "purple"
    // },
    {
      icon: Wallet,
      title: "Easy Expense Tracking",
      description: "Manage all your expenses in one place with an intuitive and simple interface.",
      color: "purple"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is encrypted and secure. We never share your information.",
      color: "red"
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Access your finances anywhere with our responsive design.",
      color: "indigo"
    },
    {
      icon: Zap,
      title: "Quick Setup",
      description: "Get started in minutes. No complex setup or lengthy onboarding process.",
      color: "yellow"
    }
  ];

  const colorClasses = {
    blue: { bg: "bg-gradient-to-r from-blue-100 to-blue-200", text: "text-blue-600", border: "border-blue-200", shadow: "shadow-blue-100" },
    green: { bg: "bg-gradient-to-r from-green-100 to-green-200", text: "text-green-600", border: "border-green-200", shadow: "shadow-green-100" },
    purple: { bg: "bg-gradient-to-r from-purple-100 to-purple-200", text: "text-purple-600", border: "border-purple-200", shadow: "shadow-purple-100" },
    red: { bg: "bg-gradient-to-r from-red-100 to-red-200", text: "text-red-600", border: "border-red-200", shadow: "shadow-red-100" },
    indigo: { bg: "bg-gradient-to-r from-indigo-100 to-indigo-200", text: "text-indigo-600", border: "border-indigo-200", shadow: "shadow-indigo-100" },
    yellow: { bg: "bg-gradient-to-r from-yellow-100 to-yellow-200", text: "text-yellow-600", border: "border-yellow-200", shadow: "shadow-yellow-100" }
  };

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-sm font-medium mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
            </motion.div>
            Core Features
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            whileHover={{ scale: 1.02 }}
          >
            Everything you need to manage your finances
          </motion.h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ProFinance provides all the tools you need to track, organize, and understand your financial life.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 border ${colorClasses[feature.color].border} hover:shadow-xl transition-all duration-300 group`}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)"
              }}
            >
              <motion.div 
                className={`${colorClasses[feature.color].bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[feature.color].shadow} shadow-lg`}
                whileHover={{ 
                  rotate: 360,
                  scale: 1.1
                }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className={`w-6 h-6 ${colorClasses[feature.color].text}`} />
              </motion.div>
              <motion.h3 
                className="text-xl font-semibold text-gray-900 mb-2"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                {feature.title}
              </motion.h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
              
              {/* Hover Effect Line */}
              <motion.div
                className={`h-1 ${colorClasses[feature.color].bg} rounded-full mt-4 w-0 group-hover:w-full transition-all duration-300`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;