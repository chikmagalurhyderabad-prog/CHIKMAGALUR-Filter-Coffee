import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/errorHelper';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please fill out all fields.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await addDoc(collection(db, 'contact_messages'), {
        name: name.substring(0, 100),
        email: email.substring(0, 150),
        message: message.substring(0, 1000),
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError('Failed to send message. Please try again later.');
      handleFirestoreError(err, OperationType.CREATE, 'contact_messages');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <span className="text-[#B48C44] text-xs uppercase tracking-[0.3em] font-sans font-bold block mb-4">Get In Touch</span>
        <h1 className="text-4xl lg:text-5xl font-medium text-[#3D2B1F] tracking-tight">Contact Us</h1>
      </div>
      <div className="max-w-xl mx-auto bg-[#FAF7F2] p-10 border border-[#3D2B1F]/10">
        {success ? (
          <div className="text-center py-8">
            <h3 className="text-2xl font-medium text-[#3D2B1F] mb-4">Thank You</h3>
            <p className="text-[#3D2B1F] opacity-80">Your message has been sent successfully. We will get back to you shortly.</p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-8 bg-[#3D2B1F] text-white px-10 py-5 text-[11px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#B48C44] transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-50 text-red-800 text-sm border border-red-200">
                {error}
              </div>
            )}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] font-sans font-bold text-[#3D2B1F] mb-2">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
                className="w-full border-b border-[#3D2B1F]/20 bg-transparent py-3 focus:outline-none focus:border-[#B48C44] text-[#3D2B1F] font-serif" 
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] font-sans font-bold text-[#3D2B1F] mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={150}
                required
                className="w-full border-b border-[#3D2B1F]/20 bg-transparent py-3 focus:outline-none focus:border-[#B48C44] text-[#3D2B1F] font-serif" 
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] font-sans font-bold text-[#3D2B1F] mb-2">Message</label>
              <textarea 
                rows={4} 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                required
                className="w-full border-b border-[#3D2B1F]/20 bg-transparent py-3 focus:outline-none focus:border-[#B48C44] text-[#3D2B1F] font-serif"
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#3D2B1F] text-white px-10 py-5 text-[11px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-[#B48C44] transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
