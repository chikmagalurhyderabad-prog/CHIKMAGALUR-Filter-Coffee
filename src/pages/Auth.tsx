import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { Coffee, Mail, Lock, ArrowRight, Loader, User } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  
  // Navigate back to where they came from (e.g., checkout), or fallback to profile
  const from = location.state?.from?.pathname || '/profile';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate(from, { replace: true });
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: name
            }
          }
        });
        if (error) throw error;
        
        // Some users might need to confirm email based on Supabase settings. 
        // If not required, they are automatically logged in.
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#FFFFFF]">
      <div className="max-w-md w-full bg-white p-8 border border-[#593222]/10 shadow-sm relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#B48C44]/10 rounded-bl-full -z-0" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#593222]/5 rounded-tr-full -z-0" />
        
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#FFFFFF] rounded-full flex items-center justify-center border border-[#593222]/10">
              <Coffee className="w-8 h-8 text-[#593222]" />
            </div>
          </div>
          
          <h2 className="text-2xl font-serif text-[#593222] text-center mb-2">
            {isLogin ? 'Welcome Back' : 'Join the Family'}
          </h2>
          <p className="text-sm text-center text-[#593222]/70 font-sans mb-8">
            {isLogin 
              ? 'Sign in to access your orders and preferences.'
              : 'Create an account for a seamless checkout experience.'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-sans text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#593222] font-bold mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-[#593222]/40" />
                  </div>
                  <input
                    type="text"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-[#593222]/20 bg-transparent text-[#593222] focus:outline-none focus:border-[#B48C44] transition-colors font-sans"
                    placeholder="Your Name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#593222] font-bold mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#593222]/40" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-[#593222]/20 bg-transparent text-[#593222] focus:outline-none focus:border-[#B48C44] transition-colors font-sans"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#593222] font-bold mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#593222]/40" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-[#593222]/20 bg-transparent text-[#593222] focus:outline-none focus:border-[#B48C44] transition-colors font-sans"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#593222] text-white py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#B48C44] transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#593222]/10 pt-6">
            <p className="text-sm text-[#593222]/70 font-sans">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                className="text-[#B48C44] font-bold uppercase tracking-wider text-xs hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
