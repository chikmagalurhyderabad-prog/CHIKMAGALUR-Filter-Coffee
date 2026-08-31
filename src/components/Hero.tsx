import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    subtitle: "Chikmagalur Heritage",
    title: "Best Chikmagalur Coffee",
    description: "Shop Online from Chikmagalur Coffee Works. Buy Coffee Powder, Roasted Beans, Tea, Spices, and Brewing Accessories.",
    buttonText: "SHOP NOW",
    buttonLink: "/shop",
    showPrice: true,
  },
  {
    id: 2,
    subtitle: "Partner With Us",
    title: "Franchise Opportunity",
    description: "Join the Chikmagalur Filter Coffee family. Open your own premium outlet with our complete end-to-end franchise support.",
    buttonText: "FRANCHISE ENQUIRY",
    buttonLink: "/franchise",
    showPrice: false,
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#593222]">
      {/* Static Background Video */}
      <video
        src="/hero-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />

      <div className="absolute inset-0 bg-[#593222]/60 mix-blend-multiply" />
      <div className="absolute inset-0 bg-black/30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center w-full relative z-10 pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-3xl flex flex-col items-center space-y-8"
          >
            <div>
              <span className="text-[#B48C44] text-xs uppercase tracking-[0.3em] font-sans font-bold block mb-4">
                {slides[currentSlide].subtitle}
              </span>
              <h1 className="text-5xl lg:text-7xl leading-[1.05] tracking-tight font-medium mb-6 text-white drop-shadow-lg">
                {slides[currentSlide].title}
              </h1>
              <p className="text-lg leading-relaxed text-white/90 max-w-xl mx-auto font-light drop-shadow-md">
                {slides[currentSlide].description}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
              <Link
                to={slides[currentSlide].buttonLink}
                className="btn-sweep bg-[#593222] text-white px-10 py-5 text-[11px] uppercase tracking-[0.2em] font-sans font-bold inline-block border border-transparent hover:border-[#B48C44] transition-colors"
              >
                <span className="relative z-10">{slides[currentSlide].buttonText}</span>
              </Link>
              {slides[currentSlide].showPrice && (
                <div className="flex flex-col text-left border-l border-white/20 pl-6">
                  <span className="text-[10px] uppercase tracking-[0.1em] text-white/70 font-sans font-bold">Starting at</span>
                  <span className="text-xl text-white font-medium">₹150.00</span>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 text-white hover:bg-black/50 hover:text-[#B48C44] transition-all backdrop-blur-sm group hidden sm:block"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 text-white hover:bg-black/50 hover:text-[#B48C44] transition-all backdrop-blur-sm group hidden sm:block"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${currentSlide === index
              ? 'w-8 h-2 bg-[#B48C44]'
              : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

