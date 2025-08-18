import { motion } from 'framer-motion';

const TrustedBy = () => {
  const companies = [
    { name: "TechCorp", logo: "TC" },
    { name: "FinanceFlow", logo: "FF" },
    { name: "StartupHub", logo: "SH" },
    { name: "BusinessPro", logo: "BP" },
    { name: "MoneyWise", logo: "MW" },
    { name: "AccountSync", logo: "AS" }
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gray-500 text-lg font-medium">Trusted by forward-thinking companies</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3 text-gray-400 hover:text-gray-600 transition-colors">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold">{company.logo}</span>
                </div>
                <span className="text-lg font-semibold">{company.name}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TrustedBy;