import React from 'react';

export default function About() {
  return (
    <div className="bg-[#FFFFFF] text-[#593222] font-serif">
      {/* Hero Section */}
      <div className="relative py-32 bg-[#F2EDE4] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=2000"
            alt="Coffee Beans Placeholder"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-medium tracking-tight mb-4">About Us</h1>
          <span className="text-[#B48C44] text-sm uppercase tracking-[0.3em] font-sans font-bold block">
            Chikmagalur Filter Coffee
          </span>
        </div>
      </div>

      {/* Our History Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#B48C44] text-xs uppercase tracking-[0.3em] font-sans font-bold block mb-4">Our Heritage</span>
            <h2 className="text-3xl lg:text-4xl font-medium tracking-tight mb-6">At Chikmagalur Filter Coffee, we are deeply committed to sharing the genuine essence of South Indian coffee with enthusiasts across the globe.</h2>
            <div className="space-y-4 opacity-90 leading-relaxed text-lg">
              <p>
                What started as a modest vision to introduce the world to our time-honored heritage and distinct flavors has grown into a remarkable journey.
              </p>
              <p>
                By hand-selecting the finest beans and honoring age-old brewing methods, we guarantee that every sip provides an unmistakably bold and satisfying experience.
              </p>
              <p>
                Be a part of our story as we champion the cultural legacy of South Indian coffee and deliver exceptional quality to your cup.
              </p>
            </div>
          </div>
          <div className="relative h-[600px]">
            <img
              src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800"
              alt="History Placeholder"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Our Coffee Section */}
      <section className="py-24 bg-[#593222] text-[#F2EDE4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-row-reverse lg:flex-row-reverse">
            <div className="order-2 lg:order-1 relative h-[500px]">
              <img
                src="/images/about-stall.jpg"
                alt="Our Coffee Stall"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-[#B48C44] text-xs uppercase tracking-[0.3em] font-sans font-bold block mb-4">Our Coffee</span>
              <h2 className="text-3xl lg:text-4xl font-medium tracking-tight mb-6">Discover the quintessential taste of heritage with Chikmagalur Filter Coffee.</h2>
              <div className="space-y-4 opacity-90 leading-relaxed text-lg">
                <p>
                  We meticulously craft our signature offerings using premium beans and classic brewing practices, allowing each cup to radiate with profound aroma and character.
                </p>
                <p>
                  Perfect for any moment of the day, our selections cater to all preferences whether you are looking for a comforting hot brew or an invigorating iced coffee.
                </p>
                <p>
                  Browse our diverse collection of blends and find the perfect roast to elevate your daily routine!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Process Section */}
      <section className="py-24 bg-[#F2EDE4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#B48C44] text-xs uppercase tracking-[0.3em] font-sans font-bold block mb-4">Our Coffee Production Process</span>
            <h2 className="text-3xl lg:text-4xl font-medium tracking-tight mb-6">Commitment to Quality</h2>
            <p className="max-w-3xl mx-auto text-lg opacity-90 leading-relaxed">
              At Chikmagalur Filter Coffee, uncompromising quality is our foundation. From the initial harvest to your very first sip, our entire production cycle is meticulously designed to offer a genuinely authentic and untainted South Indian coffee experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 border border-[#593222]/10 hover:border-[#B48C44] transition-colors">
              <div className="w-12 h-12 flex items-center justify-center bg-[#593222] text-[#F2EDE4] rounded-full mb-6 text-xl font-sans font-bold">1</div>
              <h3 className="text-xl font-medium mb-4">Meticulously Sourced Beans</h3>
              <p className="opacity-80">We hand-select each batch, guaranteeing that only the most exceptional coffee cherries are chosen for our signature blends.</p>
            </div>

            <div className="bg-white p-8 border border-[#593222]/10 hover:border-[#B48C44] transition-colors">
              <div className="w-12 h-12 flex items-center justify-center bg-[#593222] text-[#F2EDE4] rounded-full mb-6 text-xl font-sans font-bold">2</div>
              <h3 className="text-xl font-medium mb-4">Artisanal Roasting</h3>
              <p className="opacity-80">By taking our time with a slow-roasting approach, we naturally release the profound, complex flavors hidden within every bean.</p>
            </div>

            <div className="bg-white p-8 border border-[#593222]/10 hover:border-[#B48C44] transition-colors">
              <div className="w-12 h-12 flex items-center justify-center bg-[#593222] text-[#F2EDE4] rounded-full mb-6 text-xl font-sans font-bold">3</div>
              <h3 className="text-xl font-medium mb-4">Expert Grinding</h3>
              <p className="opacity-80">We rigorously monitor the grinding process, achieving the exact texture required to maximize flavor extraction in your cup.</p>
            </div>

            <div className="bg-white p-8 border border-[#593222]/10 hover:border-[#B48C44] transition-colors">
              <div className="w-12 h-12 flex items-center justify-center bg-[#593222] text-[#F2EDE4] rounded-full mb-6 text-xl font-sans font-bold">4</div>
              <h3 className="text-xl font-medium mb-4">Time-Honored Brewing</h3>
              <p className="opacity-80">To complete the journey, we rely on classic, generation tested methods that preserve the historic essence of South Indian coffee.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
