import React, { useContext, useRef } from 'react';
import Card from '../components/Card';
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from "react-icons/md";

function Customize() {
  const { backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage } = useContext(userDataContext);
  const navigate = useNavigate();
  const inputImage = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
      setSelectedImage("input");
    }
  };

  const isCustomSelected = selectedImage === "input";

  return (
    <div className='w-full min-h-screen bg-radial-glow flex flex-col items-center justify-center py-10 px-4 relative overflow-x-hidden overflow-y-auto'>
      {/* Decorative blurred circles */}
      <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[150px] opacity-30 animate-float"></div>
      
      <button 
        onClick={() => navigate("/")}
        className='absolute top-8 left-8 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white hover:bg-white/10 transition-colors z-20'
      >
        <MdKeyboardBackspace size={24} />
      </button>

      <div className="z-10 w-full max-w-5xl flex flex-col items-center">
        <h1 className='text-white text-4xl font-bold mb-3 text-center'>
          Select your <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500'>Assistant Avatar</span>
        </h1>
        <p className="text-gray-400 text-center mb-10 max-w-lg">
          Choose a visual representation for your AI companion. You can select from our premium collection or upload your own.
        </p>

        <div className='w-full flex justify-center items-center flex-wrap gap-6 mb-12'>
          <Card image={image1} />
          <Card image={image2} />
          <Card image={image3} />
          <Card image={image4} />
          <Card image={image5} />
          <Card image={image6} />
          <Card image={image7} />

          {/* Custom Upload Card */}
          <div 
            className={`relative w-[90px] h-[160px] lg:w-[160px] lg:h-[260px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-2 group flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/30 hover:border-white/60
              ${isCustomSelected ? "ring-4 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] border-solid border-transparent" : ""}
            `}
            onClick={() => inputImage.current.click()}
          >
            {!frontendImage ? (
              <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-white transition-colors">
                <RiImageAddLine size={32} />
                <span className="text-sm font-medium">Upload</span>
              </div>
            ) : (
              <>
                <img src={frontendImage} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' alt="Custom upload" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
              </>
            )}

            {/* Selection indicator */}
            {isCustomSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage} />
        </div>

        {selectedImage && (
          <div className="animate-[float_1s_ease-out]">
            <button 
              className='min-w-[200px] h-[55px] text-white font-semibold btn-primary rounded-full text-lg tracking-wide shadow-lg flex items-center justify-center gap-2 px-8' 
              onClick={() => navigate("/customize2")}
            >
              Continue
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Customize;
