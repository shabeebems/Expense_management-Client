import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Target, 
  Shield, 
  Zap,
  CheckCircle
} from 'lucide-react';

const BenefitCard = ({ icon: Icon, title, description, benefits, delay = 0 }) => {
  return (
    <motion.div
      id='benefits'
      className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
      </div>
      
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      
      <ul className="space-y-3">
        {benefits.map((benefit, index) => (
          <motion.li
            key={index}
            className="flex items-center text-gray-700"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: delay + (index * 0.1) }}
          >
            <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
            <span>{benefit}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

const Benefits = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Save Time",
      description: "Stop spending hours organizing receipts and calculating expenses manually. Our automated system does the heavy lifting for you.",
      benefits: [
        "Quick transaction entry with smart categorization",
        "Automated calculations and balance updates",
        "Instant report generation with one click"
      ]
    },
    {
      icon: Target,
      title: "Stay Organized",
      description: "Keep different aspects of your financial life separate and organized with our intuitive ledger system.",
      benefits: [
        "Separate ledgers for business and personal finances",
        "Color-coded categories for easy identification",
        "Smart tagging and filtering options"
      ]
    },
    {
      icon: Zap,
      title: "Make Better Decisions",
      description: "Get insights into your spending habits with detailed analytics and visual reports that help you make informed decisions.",
      benefits: [
        "Visual charts showing spending trends",
        "Budget vs actual comparisons",
        "Monthly and yearly financial summaries"
      ]
    },
    {
      icon: Shield,
      title: "Peace of Mind",
      description: "Your financial data is secure and always accessible, giving you confidence in your money management.",
      benefits: [
        "Bank-level encryption for all data",
        "Automated backups and data recovery",
        "24/7 customer support when you need it"
      ]
    }
  ];

  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why choose
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"> ProFinance?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the benefits that make ProFinance the perfect choice for managing your finances
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={benefit.title}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
              benefits={benefit.benefits}
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Benefits;