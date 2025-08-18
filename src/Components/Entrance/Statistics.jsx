import { motion } from 'framer-motion';
import { Users, DollarSign, BookOpen, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, number, label, delay = 0 }) => {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
      <motion.h3
        className="text-4xl md:text-5xl font-bold text-white mb-2"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: delay + 0.2 }}
      >
        {number}
      </motion.h3>
      <p className="text-emerald-100 text-lg">{label}</p>
    </motion.div>
  );
};

const Statistics = () => {
  const stats = [
    {
      icon: Users,
      number: "10K+",
      label: "Active Users"
    },
    {
      icon: DollarSign,
      number: "$2.5M+",
      label: "Money Tracked"
    },
    {
      icon: BookOpen,
      number: "45K+",
      label: "Ledgers Created"
    },
    {
      icon: TrendingUp,
      number: "98%",
      label: "User Satisfaction"
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-r from-emerald-600 to-blue-600">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by thousands worldwide
          </h2>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Join our growing community of users who have taken control of their finances
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              number={stat.number}
              label={stat.label}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;