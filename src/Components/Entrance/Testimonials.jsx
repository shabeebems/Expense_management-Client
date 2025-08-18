import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TestimonialCard = ({ name, role, company, content, rating, avatar, delay = 0 }) => {
  return (
    <motion.div
      className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="flex items-center mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>
      
      <div className="mb-6">
        <Quote className="w-8 h-8 text-gray-300 mb-4" />
        <p className="text-gray-700 text-lg leading-relaxed">{content}</p>
      </div>
      
      <div className="flex items-center">
        <div className={`w-12 h-12 ${avatar} rounded-full flex items-center justify-center mr-4`}>
          <span className="text-white font-semibold text-lg">{name.split(' ').map(n => n[0]).join('')}</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-gray-600 text-sm">{role} at {company}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      company: "Johnson's Bakery",
      content: "ProFinance has completely transformed how I manage my business finances. The separate ledgers for different expense categories make tax time so much easier!",
      rating: 5,
      avatar: "bg-emerald-500"
    },
    {
      name: "Mike Chen",
      role: "Freelance Designer",
      company: "Chen Design Studio",
      content: "As a freelancer, tracking expenses from multiple projects was a nightmare. ProFinance's ledger system keeps everything organized and professional.",
      rating: 5,
      avatar: "bg-blue-500"
    },
    {
      name: "Emily Rodriguez",
      role: "Family Finance Manager",
      company: "Rodriguez Family",
      content: "Managing household expenses, kids' activities, and our small side business is now effortless. The website lets me track expenses on the go!",
      rating: 5,
      avatar: "bg-purple-500"
    },
    {
      name: "David Park",
      role: "Startup Founder",
      company: "TechStart Inc",
      content: "ProFinance gives me a clear picture of cash flow and spending. It's like having a financial advisor in my pocket.",
      rating: 5,
      avatar: "bg-orange-500"
    },
    {
      name: "Lisa Thompson",
      role: "Event Planner",
      company: "Perfect Events",
      content: "Each event has its own ledger, making it easy to track costs and profits per project.",
      rating: 5,
      avatar: "bg-pink-500"
    },
    {
      name: "James Wilson",
      role: "Restaurant Owner",
      company: "Wilson's Diner",
      content: "ProFinance helps me track food costs, utilities, and staff expenses separately. The insights have helped me reduce costs by 15% this year.",
      rating: 5,
      avatar: "bg-teal-500"
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What our
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"> users say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what real users have to say about ProFinance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              name={testimonial.name}
              role={testimonial.role}
              company={testimonial.company}
              content={testimonial.content}
              rating={testimonial.rating}
              avatar={testimonial.avatar}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;