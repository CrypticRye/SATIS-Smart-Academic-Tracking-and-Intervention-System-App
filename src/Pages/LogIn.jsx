import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';


 function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    
    console.log('Login attempt:', { email, password });
    alert('Login successful! Welcome to Baliwasan Stand Alone Senior High School portal.');
  };

  const handleForgotPassword = () => {
    alert('Password reset link would be sent to your email address.');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      <div 
        className="absolute inset-0 bg-cover bg-center"
      >
        {/* Overlay to create the building effect */}
        <div className="absolute inset-0 from-blue-200/30 to-purple-200/30"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center">
              <div className="relative w-20 h-20">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Seal_of_Baliwasan_Senior_High_School.png/800px-Seal_of_Baliwasan_Senior_High_School.png"
                  alt="Baliwasan SHS Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label For="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
                {error}
              </div>
            )}

            {/* Sign In Button */}
            <button
              onClick={handleSubmit}
              className="w-full  bg-pink-400 text-black font-medium py-3 rounded-lg hover:bg-pink-100  transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Sign In
            </button>

            {/* Forgot Password */}
            <button
              onClick={handleForgotPassword}
              className="w-full text-center text-sm font-medium text-gray-700 hover:text-pink-500 transition"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;