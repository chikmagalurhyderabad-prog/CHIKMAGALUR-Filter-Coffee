import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';

const testimonials = [
  {
    text: "During the lockdown I really missed your Coffee. I truly believe that your Coffee is the Rolls Royce of coffees. I am an ardent fan and always sell the idea of your coffee to all my friends and Family.",
    author: "Ardent Fan"
  },
  {
    text: "Amazing coffee powder collection. Friendly staff and hospitable interaction by the owner :) value for money :)",
    author: "Happy Customer"
  },
  {
    text: "Must visit for all the coffee lovers. You would definitely wanna buy the finest quality of coffee that you can find in India.",
    author: "Coffee Lover"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#F2EDE4] border-t border-[#3D2B1F]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#B48C44] text-xs uppercase tracking-[0.3em] font-sans font-bold block mb-4">Our Heritage</span>
          <h2 className="text-4xl lg:text-5xl font-medium text-[#3D2B1F] tracking-tight">What Our Customers Say</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-[#FAF7F2] p-10 border border-[#3D2B1F]/10 flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex text-[#B48C44] mb-6 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current mx-0.5" />
                ))}
              </div>
              <p className="text-[#3D2B1F] text-lg leading-relaxed italic mb-8 flex-grow text-center opacity-80">"{testimonial.text}"</p>
              <p className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-[#3D2B1F] text-center">- {testimonial.author}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
