
import React, { useState } from 'react';
import Logo from './Logo';
import { UserProfile } from '../types';
import { Eye, EyeOff, Lock, Mail, User as UserIcon } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    kids: '1',
    kidsAges: '',
    healthIssues: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || 'New Mama',
      email: formData.email,
      kids: parseInt(formData.kids),
      kidsAges: formData.kidsAges,
      birthType: 'Vaginal',
      medicalNotes: formData.healthIssues,
      diagnoses: formData.healthIssues,
    };
    onAuthSuccess(mockUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#fef9f2]">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl shadow-pink-50 overflow-hidden border border-pink-50">
        <div className="p-8 md:p-12">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          <h2 className="text-2xl font-bold text-center text-black mb-2">
            {isLogin ? 'Welcome Back' : 'Join the Community'}
          </h2>
          <p className="text-center text-black opacity-60 text-sm mb-8 leading-relaxed font-medium">
            {isLogin 
              ? 'Your healing journey continues. Please sign in to your dashboard.' 
              : 'The Fourth Trimester is here to support you with expert advice and local connections.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="Your Full Name"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none transition-all text-black font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={18} />
              <input 
                type="email" 
                required
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none transition-all text-black font-bold"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={18} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                placeholder="Secure Password"
                className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none transition-all text-black font-bold"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button 
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black opacity-30 hover:opacity-60"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {!isLogin && (
              <div className="pt-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-black uppercase opacity-40 ml-2">Kids</label>
                    <input 
                      type="number" 
                      placeholder="Number of kids"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-100 text-black font-bold"
                      value={formData.kids}
                      onChange={(e) => setFormData({ ...formData, kids: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-black uppercase opacity-40 ml-2">Ages</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 2 mo, 3y"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-100 text-black font-bold"
                      value={formData.kidsAges}
                      onChange={(e) => setFormData({ ...formData, kidsAges: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-black uppercase opacity-40 ml-2">Health Issues / Notes</label>
                  <textarea 
                    placeholder="e.g. Low iron, difficulty sleeping..."
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-100 h-20 resize-none text-black font-medium"
                    value={formData.healthIssues}
                    onChange={(e) => setFormData({ ...formData, healthIssues: e.target.value })}
                  />
                </div>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-pink-600 shadow-lg shadow-pink-100 transition-all transform active:scale-[0.98] mt-4"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-black opacity-60 hover:text-pink-600 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
