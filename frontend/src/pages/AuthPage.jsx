import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, User, Mail, Lock, Camera, Edit3, Sparkles, ArrowRight, ArrowLeft, MessageCircle, Users, Heart, Share2, Globe, Shield, Smartphone, Home, Settings } from 'lucide-react';
import { toast } from 'react-toastify';

const NetworkAnimation = () => {
  const nodes = [
    { id: 1, cx: 50, cy: 50, icon: Users, label: 'Connect' },
    { id: 2, cx: 150, cy: 70, icon: MessageCircle, label: 'Chat' },
    { id: 3, cx: 100, cy: 150, icon: Heart, label: 'Share' },
    { id: 4, cx: 200, cy: 120, icon: Globe, label: 'Discover' },
    { id: 5, cx: 80, cy: 100, icon: Home, label: 'Home' },
    { id: 6, cx: 170, cy: 80, icon: Settings, label: 'Settings' },
  ];

  const lines = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 1 },
    { from: 1, to: 5 },
    { from: 2, to: 6 },
    { from: 5, to: 6 },
  ];

  return (
    <div className="relative w-full h-full">
      <svg className="w-full h-full" viewBox="0 0 250 200">
        {/* Glowing background effect */}
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#A855F7', stopOpacity: 0.8 }} />
            <stop offset="70%" style={{ stopColor: '#5B21B6', stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: '#5B21B6', stopOpacity: 0 }} />
          </radialGradient>
          
          <filter id="glow-effect">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="star-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Animated connection lines */}
        {lines.map((line, index) => (
          <motion.line
            key={index}
            x1={nodes.find(n => n.id === line.from).cx}
            y1={nodes.find(n => n.id === line.from).cy}
            x2={nodes.find(n => n.id === line.to).cx}
            y2={nodes.find(n => n.id === line.to).cy}
            stroke="url(#glow)"
            strokeWidth="3"
            filter="url(#glow-effect)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: 'reverse', 
              ease: 'easeInOut',
              delay: index * 0.2 
            }}
          />
        ))}

        {/* Glowing nodes with icons */}
        {nodes.map((node) => {
          const IconComponent = node.icon;
          return (
            <g key={node.id}>
              {/* Outer glow */}
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r="20"
                fill="url(#glow)"
                filter="url(#glow-effect)"
                initial={{ scale: 0.8, opacity: 0.3 }}
                animate={{ 
                  scale: [0.8, 1.2, 0.8], 
                  opacity: [0.3, 0.8, 0.3] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: node.id * 0.2 
                }}
              />
              
              {/* Main node */}
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r="12"
                fill="url(#glow)"
                filter="url(#star-glow)"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: [0.8, 1.1, 0.8], 
                  opacity: [0.5, 1, 0.5] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: node.id * 0.1 
                }}
              />
              
              {/* Icon */}
              <motion.foreignObject
                x={node.cx - 8}
                y={node.cy - 8}
                width="16"
                height="16"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: node.id * 0.1 + 0.5 
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <IconComponent className="w-4 h-4 text-white drop-shadow-lg" />
                </div>
              </motion.foreignObject>
              
              {/* Node label */}
              <motion.text
                x={node.cx}
                y={node.cy + 25}
                textAnchor="middle"
                className="text-xs font-medium fill-current text-brand-primary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.7, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: node.id * 0.1 + 0.8 
                }}
              >
                {node.label}
              </motion.text>
            </g>
          );
        })}

        {/* Floating sparkles */}
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={`sparkle-${i}`}
            cx={50 + Math.random() * 150}
            cy={30 + Math.random() * 140}
            r="2"
            fill="#C084FC"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0], 
              opacity: [0, 1, 0],
              y: [0, -10, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.3 
            }}
          />
        ))}
      </svg>
    </div>
  );
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    bio: '',
    avatar: '',
    interests: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const interests = [
    'Technology', 'Design', 'Business', 'Health', 'Sports',
    'Music', 'Travel', 'Food', 'Science', 'Art'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          bio: formData.bio,
          avatar: formData.avatar,
          interests: formData.interests
        });
      }

      if (result.success) {
        if (isLogin) {
          toast.success('Welcome back!');
        } else {
          toast.success('Account created successfully!');
        }
        window.location.href = '/';
      } else {
        setError(result.error);
        toast.error(result.error);
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const resetForm = () => {
    setIsLogin(!isLogin);
    setCurrentStep(1);
    setError('');
    setFormData({ email: '', password: '', name: '', bio: '', avatar: '', interests: [] });
  };

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-8 mx-auto p-4">
        {/* Animation Column */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full lg:w-1/2 h-96 flex items-center justify-center"
        >
          <div className="w-full max-w-md h-full">
            <NetworkAnimation />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center text-text-secondary font-medium mt-4"
            >
              Connect with people who share your passions on Jugger-Connect
            </motion.p>
          </div>
        </motion.div>

        {/* Form Column */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full lg:w-1/2 max-w-md space-y-8 p-8 bg-bg-card rounded-2xl shadow-brand-xl border border-border-color"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-brand-gradient rounded-2xl flex items-center justify-center shadow-brand-lg mb-6"
            >
              {isLogin ? <Zap className="w-8 h-8 text-white" /> : <Sparkles className="w-8 h-8 text-white" />}
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-text-primary mb-2"
            >
              {isLogin ? 'Welcome Back' : 'Forge Your Path'}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-text-secondary font-medium"
            >
              {isLogin ? 'Power On. Step back into Jugger-Connect.' : 'Ignite Your Presence. Join Jugger-Connect.'}
            </motion.p>

            {!isLogin && (
              <div className="flex justify-center mt-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step <= currentStep 
                        ? 'bg-brand-gradient text-white' 
                        : 'bg-border-color text-text-muted'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-8 h-1 mx-2 ${
                        step < currentStep ? 'bg-brand-gradient' : 'bg-border-color'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 text-error px-4 py-3 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}

          {isLogin ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <Mail className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-bg-card transition-all duration-200"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                <Lock className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-bg-card transition-all duration-200"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-brand-gradient text-white rounded-xl font-semibold hover:bg-brand-gradient-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-brand hover:shadow-brand-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Powering up...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Sign In
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                )}
              </motion.button>
            </form>
          ) : (
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                    <input
                      name="name"
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-bg-card transition-all duration-200"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-bg-card transition-all duration-200"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                    <input
                      name="password"
                      type="password"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-bg-card transition-all duration-200"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={nextStep}
                    className="w-full py-3 px-4 bg-brand-gradient text-white rounded-xl font-semibold hover:bg-brand-gradient-dark transition-all duration-200 shadow-brand hover:shadow-brand-lg flex items-center justify-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <Camera className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                    <input
                      name="avatar"
                      type="url"
                      className="w-full pl-10 pr-4 py-3 border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-bg-card transition-all duration-200"
                      placeholder="Profile picture URL (optional)"
                      value={formData.avatar}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative">
                    <Edit3 className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                    <textarea
                      name="bio"
                      rows="3"
                      className="w-full pl-10 pr-4 py-3 border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-bg-card transition-all duration-200 resize-none"
                      placeholder="Tell us about yourself (optional)"
                      value={formData.bio}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={prevStep}
                      className="flex-1 py-3 px-4 bg-border-light text-text-secondary rounded-xl font-semibold hover:bg-border-color transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={nextStep}
                      className="flex-1 py-3 px-4 bg-brand-gradient text-white rounded-xl font-semibold hover:bg-brand-gradient-dark transition-all duration-200 shadow-brand hover:shadow-brand-lg flex items-center justify-center space-x-2"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-3">What interests you?</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {interests.map((interest) => (
                        <motion.button
                          key={interest}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleInterestToggle(interest)}
                          className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            formData.interests.includes(interest)
                              ? 'bg-brand-gradient text-white shadow-brand'
                              : 'bg-border-light text-text-secondary hover:bg-border-color'
                          }`}
                        >
                          {interest}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={prevStep}
                      className="flex-1 py-3 px-4 bg-border-light text-text-secondary rounded-xl font-semibold hover:bg-border-color transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 py-3 px-4 bg-brand-gradient text-white rounded-xl font-semibold hover:bg-brand-gradient-dark transition-all duration-200 shadow-brand hover:shadow-brand-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Creating...
                        </div>
                      ) : (
                        'Create Account'
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <button
              type="button"
              onClick={resetForm}
              className="text-brand-primary hover:text-brand-dark font-medium transition-colors duration-200"
            >
              {isLogin ? 'Need an account? Forge your path' : 'Already have an account? Power on'}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage; 