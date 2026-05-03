import React, { useContext } from 'react';
import { userDataContext } from '../context/UserContext';

function Card({ image }) {
  const { setBackendImage, setFrontendImage, selectedImage, setSelectedImage } = useContext(userDataContext);
  
  const isSelected = selectedImage === image;

  return (
    <div 
      className={`relative w-[90px] h-[160px] lg:w-[160px] lg:h-[260px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-2 group
        ${isSelected ? "ring-4 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]" : "ring-1 ring-white/10 hover:ring-white/30 shadow-lg"}
      `}
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null);
        setFrontendImage(null);
      }}
    >
      <img src={image} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' alt="Assistant option" />
      
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default Card;
