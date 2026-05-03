import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaMicrophone, FaBolt, FaArrowRight, FaCode, FaGlobe, FaMusic } from 'react-icons/fa';

function Hero() {
  const navigate = useNavigate();
  const [typingText, setTypingText] = useState('');
  const fullText = "Hey there! How can I assist you today?";
  
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypingText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#020617] overflow-x-hidden relative font-sans text-white selection:bg-cyan-500/30 flex flex-col">
      
      {/* Background Gradients - Centered Radial */}
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/30 rounded-[100%] mix-blend-screen blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-600/20 rounded-[100%] mix-blend-screen blur-[150px] pointer-events-none z-0 animate-pulse"></div>

      {/* Navbar */}
      <nav className="w-full p-6 sm:p-8 flex justify-between items-center z-30 relative max-w-7xl mx-auto shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 p-[2px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#020617] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">VA</span>
            </div>
          </div>
          <span className="text-white font-semibold text-xl tracking-wide">Nexus AI</span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/signin')}
            className="text-gray-400 hover:text-white transition-colors font-medium text-sm sm:text-base hidden sm:block"
          >
            Log In
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm sm:text-base hover:scale-105 transition-transform"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Main Hero Content - Centered */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 pt-16 lg:pt-24 flex-1 flex flex-col items-center text-center">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-gray-300 text-sm font-medium mb-8 animate-[fade-in-up_0.5s_ease-out]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          Nexus AI v2.0 is now live
        </div>
        
        {/* Massive Headline */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[1.1] mb-6 animate-[fade-in-up_0.7s_ease-out]">
          Voice AI that feels <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
            truly human.
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed animate-[fade-in-up_0.9s_ease-out]">
          Build your custom AI assistant in seconds. Give it a name, a personality, and let it handle your daily tasks with natural voice conversations.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-[fade-in-up_1.1s_ease-out] mb-20">
          <button 
            onClick={() => navigate('/signup')}
            className="w-full sm:w-auto px-8 py-4 rounded-full btn-primary font-semibold text-lg shadow-xl shadow-blue-500/40 flex items-center justify-center gap-2 group"
          >
            Start Building Free
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 font-semibold text-lg transition-colors flex items-center justify-center gap-2"
          >
            Explore Features
          </button>
        </div>

        {/* Dynamic Faux Interface */}
        <div className="w-full max-w-3xl glass-panel rounded-3xl p-2 sm:p-4 animate-[fade-in-up_1.3s_ease-out] shadow-2xl relative overflow-hidden group">
          {/* Top Bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            <div className="mx-auto text-xs font-medium text-gray-500 uppercase tracking-widest">Nexus Assistant</div>
          </div>
          
          {/* Chat Preview */}
          <div className="px-4 pb-4 flex flex-col gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <FaRobot className="text-white text-xs" />
              </div>
              <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-200 inline-block border border-white/5">
                {typingText}
                <span className="inline-block w-1 h-4 bg-cyan-400 ml-1 align-middle animate-pulse"></span>
              </div>
            </div>
            
            <div className="flex justify-end opacity-0 animate-[fade-in-up_0.5s_ease-out_4s_forwards]">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white inline-block shadow-lg">
                "What's the weather like today?"
              </div>
            </div>
          </div>
          
          {/* Subtle glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </div>

      </main>

      {/* Bento Box Features Section */}
      <section id="features" className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Feature 1 - Large */}
          <div className="md:col-span-2 glass-panel rounded-3xl p-8 border border-white/10 hover:border-cyan-500/30 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] group-hover:bg-cyan-500/20 transition-colors"></div>
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6 border border-cyan-500/30">
              <FaMicrophone className="text-cyan-400 text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Flawless Speech Recognition</h3>
            <p className="text-gray-400 max-w-md">Speak naturally. Our advanced recognition engine understands context, accents, and complex commands without missing a beat.</p>
          </div>
          
          {/* Feature 2 */}
          <div className="glass-panel rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/30">
              <FaCode className="text-purple-400 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Custom Identity</h3>
            <p className="text-gray-400">Design your assistant's avatar, name, and underlying personality instructions.</p>
          </div>
          
          {/* Feature 3 */}
          <div className="glass-panel rounded-3xl p-8 border border-white/10 hover:border-blue-500/30 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/30">
              <FaGlobe className="text-blue-400 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Web Navigation</h3>
            <p className="text-gray-400">Instantly search the web, open YouTube, Google, or any social media with just your voice.</p>
          </div>

          {/* Feature 4 - Large */}
          <div className="md:col-span-2 glass-panel rounded-3xl p-8 border border-white/10 hover:border-indigo-500/30 transition-colors group relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 border border-indigo-500/30">
              <FaMusic className="text-indigo-400 text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Media Control</h3>
            <p className="text-gray-400 max-w-md">"Play some jazz music." Your assistant connects directly to media platforms to control your entertainment seamlessly.</p>
          </div>

        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full max-w-4xl mx-auto px-6 sm:px-8 py-20 relative z-10">
        <div className="glass-panel rounded-[2.5rem] p-8 sm:p-12 border border-white/10 relative overflow-hidden">
          {/* Decorative glow inside contact card */}
          <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-[-50%] left-[-10%] w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="text-center mb-10 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-gray-400">Have questions or want to request a custom integration? We'd love to hear from you.</p>
          </div>

          <form className="relative z-10 flex flex-col gap-5 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full px-5 py-3 rounded-xl glass-input text-white placeholder:text-gray-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="w-full px-5 py-3 rounded-xl glass-input text-white placeholder:text-gray-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Message</label>
              <textarea 
                rows="4" 
                placeholder="How can we help you?" 
                className="w-full px-5 py-3 rounded-xl glass-input text-white placeholder:text-gray-500 focus:outline-none resize-none custom-scrollbar"
              ></textarea>
            </div>
            <button className="mt-2 w-full py-4 rounded-xl btn-primary font-bold text-lg tracking-wide shadow-lg shadow-blue-500/30">
              Send Message
            </button>
          </form>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-[#020617]/50 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#020617] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">VA</span>
                </div>
              </div>
              <span className="text-white font-semibold tracking-wide">Nexus AI</span>
            </div>
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Nexus AI. All rights reserved.</p>
          </div>

          {/* Quick Links */}
          <div className="flex gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default Hero;
