import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, PresentationControls, OrbitControls } from '@react-three/drei';
import { CheckCircle2, TrendingUp, Users, Store, Download, Phone } from 'lucide-react';
import { motion } from 'motion/react';

function CoffeeCupModel() {
  const { scene } = useGLTF('/models/coffee-cup.glb');
  return <primitive object={scene} />;
}

/*
function StallModel() {
  const { scene } = useGLTF('/models/franchise-stall.glb');
  return <primitive object={scene} />;
}
*/

export default function Franchise() {
  // state for form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // mock submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#593222]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          <img src="/images/franchise-hero-stall-1.png" alt="Background" className="w-full h-full object-cover object-bottom opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pt-32 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <span className="text-[#B48C44] text-xs uppercase tracking-[0.3em] font-sans font-bold block mb-4">
                Partner With Us
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-medium tracking-tight mb-6 text-white drop-shadow-lg">
                Brew Success with Chikmagalur Coffee
              </h1>
              <p className="text-lg opacity-90 font-serif italic mb-8 max-w-xl text-gray-200 drop-shadow-md">
                Join our family and open your own premium outlet. We offer a proven business model with 50-70% profit margins and authentic South Indian heritage.
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="#enquiry" className="btn-sweep bg-[#B48C44] text-white px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-sans font-bold flex items-center gap-2 border border-[#B48C44]">
                  <Phone className="w-4 h-4" />
                  <span className="relative z-10">Enquire Now</span>
                </a>
                <button className="border border-[#FFFFFF] text-[#FFFFFF] px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#FFFFFF] hover:text-[#593222] transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>Download Brochure</span>
                </button>
              </div>
            </motion.div>

            {/* Empty Right Column (Keeps text constrained to the left) */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Franchise Requirements Section */}
      <section className="py-16 lg:py-24 bg-white border-b border-[#593222]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: 3D Coffee Cup Model */}
            <div className="relative h-[400px] lg:h-[500px] cursor-grab active:cursor-grabbing bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#593222]/10">
              <Canvas camera={{ position: [2, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 10]} intensity={1} />
                <PresentationControls
                  global
                  snap
                  rotation={[0, Math.PI / 6, 0]}
                  polar={[-Math.PI / 3, Math.PI / 3]}
                  azimuth={[-Math.PI / 1.4, Math.PI / 2]}
                >
                  <Stage environment="city" intensity={0.6} shadows={false}>
                    <CoffeeCupModel />
                  </Stage>
                </PresentationControls>
              </Canvas>
              <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none opacity-50 text-xs font-sans uppercase tracking-widest">
                Drag to rotate
              </div>
            </div>

            {/* Right: Requirements Text */}
            <div>
              <span className="text-[#B48C44] text-xs uppercase tracking-[0.3em] font-sans font-bold block mb-4">
                What it takes
              </span>
              <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-8">Franchise Requirements</h2>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#593222] text-[#B48C44] rounded-full mr-6">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Space & Location</h3>
                    <p className="opacity-75 font-serif italic">A minimum of 70-100 sq ft is required. Ideal locations include busy junctions, malls, hospitals, and highways with high footfall.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#593222] text-[#B48C44] rounded-full mr-6">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Manpower</h3>
                    <p className="opacity-75 font-serif italic">Minimum 2 staff members are required. No professional barista is needed as our brewing process is formula-based and easy to learn.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#593222] text-[#B48C44] rounded-full mr-6">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Basic Infrastructure</h3>
                    <p className="opacity-75 font-serif italic">3-Phase electricity connection and basic water in/out facilities are mandatory for operations.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-4">Why Franchise With Us?</h2>
            <p className="text-lg opacity-80 font-serif italic">A proven formula for high returns and easy operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: TrendingUp, title: "High Profit Margins", desc: "Enjoy incredible profit margins ranging from 50% to 70%." },
              { icon: Users, title: "No Barista Required", desc: "Our system is entirely formula-based. Easy to operate with minimal staff." },
              { icon: CheckCircle2, title: "Complete Support", desc: "From location scouting to supplying raw materials and training." },
              { icon: Store, title: "Low Footprint", desc: "Requires only 70-100 sq ft of space in high-footfall areas." },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 border border-[#593222]/10 text-center hover:border-[#B48C44] transition-colors">
                <feature.icon className="w-10 h-10 mx-auto mb-4 text-[#B48C44]" />
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-sm opacity-70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Enquiry Form */}
      <section id="enquiry" className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium tracking-tight mb-4">Start Your Journey</h2>
            <p className="opacity-80">Leave your details below and our franchise team will get in touch shortly.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 sm:p-12 border border-[#593222]/10">
            {isSuccess ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-2xl font-medium mb-2">Enquiry Sent Successfully!</h3>
                <p className="opacity-70">Thank you for your interest. We will contact you within 24 hours.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.1em] font-sans font-bold opacity-70 mb-2">Full Name</label>
                    <input required type="text" className="w-full border border-[#593222]/20 bg-transparent p-3 text-sm focus:outline-none focus:border-[#B48C44]" />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.1em] font-sans font-bold opacity-70 mb-2">Phone Number</label>
                    <input required type="tel" className="w-full border border-[#593222]/20 bg-transparent p-3 text-sm focus:outline-none focus:border-[#B48C44]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.1em] font-sans font-bold opacity-70 mb-2">Email Address</label>
                  <input required type="email" className="w-full border border-[#593222]/20 bg-transparent p-3 text-sm focus:outline-none focus:border-[#B48C44]" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.1em] font-sans font-bold opacity-70 mb-2">Preferred Location / City</label>
                  <input required type="text" className="w-full border border-[#593222]/20 bg-transparent p-3 text-sm focus:outline-none focus:border-[#B48C44]" />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#593222] text-[#FFFFFF] py-4 text-[11px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#B48C44] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Submit Enquiry'}
                </button>
              </>
            )}
          </form>
        </div>
      </section>

    </div>
  );
}
