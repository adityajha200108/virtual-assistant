import React, { useContext, useState } from 'react';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from "axios";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signup`, {
        name, email, password
      }, { withCredentials: true });
      setUserData(result.data);
      setLoading(false);
      navigate("/customize");
    } catch (error) {
      console.log(error);
      setUserData(null);
      setLoading(false);
      setErr(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className='w-full min-h-screen bg-radial-glow flex justify-center items-center p-4 overflow-x-hidden overflow-y-auto relative'>
      {/* Decorative blurred circles behind the panel */}
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-float"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-cyan-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>

      <form 
        className='w-full max-w-[450px] p-8 sm:p-10 rounded-3xl glass-panel flex flex-col items-center justify-center gap-6 z-10' 
        onSubmit={handleSignUp}
      >
        <div className="text-center mb-4">
          <h1 className='text-white text-3xl font-bold mb-2 tracking-tight'>
            Create Account
          </h1>
          <p className='text-gray-400 text-sm'>
            Join <span className='text-blue-400 font-medium'>Virtual Assistant</span> today
          </p>
        </div>

        <div className="w-full space-y-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder='Full Name' 
              className='w-full h-[55px] outline-none glass-input text-white placeholder-gray-400 px-6 rounded-2xl text-base' 
              required 
              onChange={(e) => setName(e.target.value)} 
              value={name}
            />
          </div>

          <div className="relative">
            <input 
              type="email" 
              placeholder='Email Address' 
              className='w-full h-[55px] outline-none glass-input text-white placeholder-gray-400 px-6 rounded-2xl text-base' 
              required 
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
            />
          </div>
          
          <div className='w-full h-[55px] relative'>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder='Password' 
              className='w-full h-full glass-input outline-none text-white placeholder-gray-400 px-6 rounded-2xl text-base pr-12' 
              required 
              onChange={(e) => setPassword(e.target.value)} 
              value={password}
            />
            <button 
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOff size={22} /> : <IoEye size={22} />}
            </button>
          </div>
        </div>

        {err && (
          <div className="w-full p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {err}
          </div>
        )}

        <button 
          className='w-full h-[55px] mt-2 text-white font-semibold btn-primary rounded-2xl text-lg tracking-wide flex items-center justify-center' 
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Registering...
            </span>
          ) : "Sign Up"}
        </button>

        <p className='text-gray-400 text-sm mt-4'>
          Already have an account?{' '}
          <span 
            className='text-blue-400 font-medium cursor-pointer hover:text-blue-300 transition-colors' 
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
