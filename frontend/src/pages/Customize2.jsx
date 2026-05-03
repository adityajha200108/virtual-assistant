import React, { useContext, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function Customize2() {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }
      const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true });
      setLoading(false);
      setUserData(result.data);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className='w-full min-h-screen bg-radial-glow flex flex-col items-center justify-center p-4 relative overflow-x-hidden overflow-y-auto'>
      {/* Decorative blurred circles */}
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[150px] opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
      
      <button 
        onClick={() => navigate("/customize")}
        className='absolute top-8 left-8 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white hover:bg-white/10 transition-colors z-20'
      >
        <MdKeyboardBackspace size={24} />
      </button>

      <div className="z-10 w-full max-w-lg glass-panel p-8 sm:p-12 rounded-3xl flex flex-col items-center text-center">
        <h1 className='text-white text-3xl font-bold mb-3'>
          Name your <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500'>Assistant</span>
        </h1>
        <p className="text-gray-400 mb-8">
          Give your AI companion a unique identity. What should we call them?
        </p>

        <div className="w-full relative mb-8">
          <input 
            type="text" 
            placeholder='e.g. Shifra, Jarvis, Athena...' 
            className='w-full h-[60px] outline-none glass-input text-white placeholder-gray-400 px-6 rounded-2xl text-lg text-center' 
            required 
            onChange={(e) => setAssistantName(e.target.value)} 
            value={assistantName}
          />
        </div>

        {assistantName && (
          <button 
            className='w-full h-[60px] text-white font-semibold btn-primary rounded-2xl text-lg tracking-wide shadow-lg flex items-center justify-center gap-2 animate-[float_1s_ease-out]' 
            disabled={loading} 
            onClick={handleUpdateAssistant}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Creating...
              </span>
            ) : "Complete Setup"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Customize2;