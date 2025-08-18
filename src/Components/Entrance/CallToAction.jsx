import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

const CallToAction = () => {
  const features = [
    "No credit card required",
    "Free trial",
    "Create multiple ledgers",
    "24/7 support"
  ];
  const navigate = useNavigate();

  return (
    <div className="py-24 bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V.5H40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to take control of your
            <span className="block text-yellow-300">finances?</span>
          </h2>
          
          <p className="text-xl text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have simplified their financial management with ProFinance. 
            Start your free trial today and see the difference.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-6 mb-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                className="flex items-center text-white text-opacity-90"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
              >
                <CheckCircle className="w-5 h-5 mr-2 text-yellow-300" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={() => navigate('/login')}
              className="group bg-white text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105 flex items-center shadow-xl">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="text-white border-2 border-white border-opacity-30 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors">
              Schedule Demo
            </button>
          </motion.div>

          <motion.p
            className="text-white text-opacity-70 text-sm mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Trusted by 10,000+ users worldwide • 4.9/5 rating on all platforms
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default CallToAction;