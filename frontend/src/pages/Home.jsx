import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "../assets/ai.gif";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import userImg from "../assets/user.gif";
import { FaSignOutAlt, FaCog, FaMicrophone, FaHistory } from "react-icons/fa";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const [ham, setHam] = useState(false);
  const isRecognizingRef = useRef(false);
  const isProcessingRef = useRef(false);
  const lastRequestTimeRef = useRef(0);
  const synth = window.speechSynthesis;

  // Chat history: [{role: "user"|"ai", text: string}]
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error);
        }
      }
    }
  };

  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text);
    utterence.lang = "hi-IN";
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) {
      utterence.voice = hindiVoice;
    }

    isSpeakingRef.current = true;
    utterence.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800);
    };
    synth.cancel();
    synth.speak(utterence);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google-search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
    if (type === "calculator-open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }
    if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }
    if (type === "facebook-open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }
    if (type === "weather-show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }
    if (type === "youtube-search" || type === "youtube-play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    if (!userData) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
        } catch (e) {
          if (e.name !== "InvalidStateError") console.error(e);
        }
      }
    }, 1000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current && !isProcessingRef.current) {
        setTimeout(() => {
          if (isMounted && !isProcessingRef.current) {
            try {
              recognition.start();
            } catch (e) {
              if (e.name !== "InvalidStateError") console.error(e);
            }
          }
        }, 2000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current && !isProcessingRef.current) {
        setTimeout(() => {
          if (isMounted && !isProcessingRef.current) {
            try {
              recognition.start();
            } catch (e) {
              if (e.name !== "InvalidStateError") console.error(e);
            }
          }
        }, 2000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();

      // Guard: skip if speaking, already processing, or transcript too short (noise)
      if (!transcript || isSpeakingRef.current || isProcessingRef.current) return;
      if (transcript.split(" ").length < 2) return; // filter single-word noise

      // Rate limit: min 4 seconds between requests
      const now = Date.now();
      if (now - lastRequestTimeRef.current < 4000) return;
      lastRequestTimeRef.current = now;

      isProcessingRef.current = true;
      setAiText("");
      setUserText(transcript);
      recognition.stop();
      isRecognizingRef.current = false;
      setListening(false);

      // Add user message to chat
      setMessages((prev) => [...prev, { role: "user", text: transcript }]);

      try {
        const data = await getGeminiResponse(transcript);
        if (data) {
          handleCommand(data);
          setAiText(data.response);
          setMessages((prev) => [...prev, { role: "ai", text: data.response }]);
        } else {
          const errMsg = "Sorry, I couldn't get a response. Please try again.";
          setMessages((prev) => [...prev, { role: "ai", text: errMsg, isError: true }]);
          speak(errMsg);
        }
      } catch (err) {
        console.error("getGeminiResponse failed:", err);
      } finally {
        isProcessingRef.current = false;
        setUserText("");
      }
    };

    // Greeting
    const greetingText = `Hello ${userData.name}, what can I help you with?`;
    const greeting = new SpeechSynthesisUtterance(greetingText);
    greeting.lang = "hi-IN";
    isSpeakingRef.current = true;
    // Add greeting to chat
    setMessages([{ role: "ai", text: greetingText }]);
    greeting.onend = () => {
      isSpeakingRef.current = false;
      if (isMounted && !isRecognizingRef.current) {
        try {
          recognition.start();
        } catch (e) {
          if (e.name !== "InvalidStateError") console.error(e);
        }
      }
    };
    window.speechSynthesis.speak(greeting);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, [userData]);

  return (
    <div className="w-full min-h-screen bg-radial-glow flex flex-col items-center relative font-sans overflow-x-hidden pt-24 pb-10">
      
      {/* Dynamic Background Elements */}
      <div className={`fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full mix-blend-screen blur-[150px] opacity-40 transition-colors duration-1000 pointer-events-none ${listening ? 'bg-cyan-500' : aiText ? 'bg-purple-600' : 'bg-blue-600'}`}></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600 rounded-full mix-blend-screen blur-[150px] opacity-20 pointer-events-none"></div>

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px]">
            <div className="w-full h-full bg-[#0f172a] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">VA</span>
            </div>
          </div>
          <h1 className="text-white font-semibold text-xl tracking-wide hidden sm:block">Virtual Assistant</h1>
        </div>

        {/* Mobile Hamburger */}
        <button 
          className="lg:hidden w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white"
          onClick={() => setHam(true)}
        >
          <CgMenuRight size={20} />
        </button>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex gap-4">
          <button
            className="px-6 py-2.5 rounded-full glass-panel text-white font-medium hover:bg-white/10 transition-colors flex items-center gap-2 border border-white/10"
            onClick={() => navigate("/customize")}
          >
            <FaCog className="text-gray-400" />
            Customize
          </button>
          <button
            className="px-6 py-2.5 rounded-full bg-white/10 text-white font-medium hover:bg-red-500/20 hover:text-red-400 transition-colors flex items-center gap-2 border border-transparent hover:border-red-500/30"
            onClick={handleLogOut}
          >
            <FaSignOutAlt />
            Log Out
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-50 transition-opacity duration-300 ${ham ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setHam(false)}
      ></div>

      {/* Mobile slide-out menu */}
      <div
        className={`fixed top-0 right-0 w-[80%] max-w-[320px] h-full bg-[#0f172a]/95 border-l border-white/10 p-6 flex flex-col gap-6 z-50 transition-transform duration-300 ease-in-out shadow-2xl ${ham ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center border-b border-white/10 pb-4 shrink-0">
          <h2 className="text-white text-xl font-semibold">Menu</h2>
          <button className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-white" onClick={() => setHam(false)}>
            <RxCross1 />
          </button>
        </div>

        <button
          className="w-full py-3 rounded-xl glass-panel text-white font-medium hover:bg-white/10 transition-colors flex items-center gap-3 px-4 shrink-0"
          onClick={() => { setHam(false); navigate("/customize"); }}
        >
          <FaCog className="text-blue-400" />
          Customize Assistant
        </button>

        {/* History Section */}
        <div className="flex-1 overflow-hidden flex flex-col mt-2">
          <h1 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
            <FaHistory className="text-gray-400" /> History
          </h1>
          <div className="w-full h-full gap-3 overflow-y-auto flex flex-col truncate custom-scrollbar pr-2">
            {userData?.history?.map((his, i) => (
              <div key={i} className="text-gray-300 text-sm w-full py-2 border-b border-white/5 truncate">
                {his}
              </div>
            ))}
            {(!userData?.history || userData.history.length === 0) && (
              <div className="text-gray-500 text-sm italic">No history available</div>
            )}
          </div>
        </div>
        
        <button
          className="w-full py-3 rounded-xl glass-panel text-white font-medium hover:bg-red-500/20 hover:text-red-400 transition-colors flex items-center gap-3 px-4 mt-auto shrink-0"
          onClick={handleLogOut}
        >
          <FaSignOutAlt />
          Log Out
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full max-w-[1200px] px-4 sm:px-8 z-10 mt-4 lg:mt-0">

        {/* Left: AI Avatar Section */}
        <div className="flex flex-col items-center justify-center relative w-full lg:w-1/2 max-w-[400px]">
          
          {/* Avatar Container with glowing rings based on state */}
          <div className="relative group">
            {/* Outer animated ring */}
            <div className={`absolute -inset-4 rounded-[2rem] border transition-all duration-500 
              ${listening ? 'border-cyan-400/50 animate-[spin_4s_linear_infinite]' : 
                aiText ? 'border-purple-500/50 animate-[spin_3s_linear_infinite_reverse]' : 
                'border-white/10'}`}
            ></div>
            
            {/* Inner Ring */}
            <div className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-tr transition-all duration-500 blur-sm opacity-50
              ${listening ? 'from-cyan-400 to-blue-500' : 
                aiText ? 'from-purple-500 to-pink-500' : 
                'from-blue-900/50 to-transparent'}`}
            ></div>

            {/* Image Container */}
            <div className="relative w-[240px] h-[340px] lg:w-[300px] lg:h-[420px] rounded-[1.8rem] overflow-hidden bg-[#020617] border border-white/10 z-10 shadow-2xl">
              <img
                src={userData?.assistantImage}
                alt="assistant"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradient Overlay for bottom text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80"></div>
              
              {/* Name Badge inside Avatar */}
              <div className="absolute bottom-6 left-0 w-full flex flex-col items-center">
                <h2 className="text-white text-2xl font-bold tracking-wide drop-shadow-md">
                  {userData?.assistantName}
                </h2>
                
                {/* Status Indicator Pill */}
                <div className={`mt-3 px-4 py-1.5 rounded-full backdrop-blur-md border flex items-center gap-2 text-sm font-medium transition-colors
                  ${listening ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300' : 
                    aiText ? 'bg-purple-500/20 border-purple-500/30 text-purple-300' : 
                    'bg-white/5 border-white/10 text-gray-400'}`}
                >
                  {listening && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                      Listening...
                    </>
                  )}
                  {aiText && !listening && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                      Speaking...
                    </>
                  )}
                  {!listening && !aiText && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                      Standby
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Visualizer bars below avatar (only show when speaking/listening) */}
          <div className="mt-8 h-12 flex items-center justify-center gap-1 opacity-80">
            {listening ? (
              [...Array(12)].map((_, i) => (
                <div key={i} className="w-1.5 bg-cyan-400 rounded-full animate-[pulse_1s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.1}s`, height: `${Math.random() * 100 + 20}%` }}></div>
              ))
            ) : aiText ? (
              [...Array(12)].map((_, i) => (
                <div key={i} className="w-1.5 bg-purple-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.1}s`, height: `${Math.random() * 100 + 20}%` }}></div>
              ))
            ) : (
              <div className="h-0.5 w-32 bg-gray-600/50 rounded-full"></div>
            )}
          </div>
        </div>

        {/* Right: Chat Window Section */}
        <div className="w-full lg:w-1/2 max-w-[550px] flex flex-col h-[500px] lg:h-[600px] glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${listening || aiText ? 'bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]' : 'bg-gray-500'}`}></div>
              <h2 className="text-white font-medium text-lg tracking-wide">
                Live Conversation
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-400 bg-white/5 px-3 py-1 rounded-full">
              <FaHistory />
              {messages.length} msg
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5 scroll-smooth custom-scrollbar">
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4 opacity-60">
                <FaMicrophone size={40} className="text-gray-500 mb-4" />
                <p className="text-gray-300 text-lg font-medium">I'm ready when you are.</p>
                <p className="text-gray-500 text-sm mt-2">Just start speaking to begin.</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"} animate-[float_0.3s_ease-out]`}
              >
                {/* AI Message Bubble */}
                {msg.role === "ai" && (
                  <div className="flex items-end gap-2 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg border border-white/20">
                      AI
                    </div>
                    <div className="px-5 py-3.5 rounded-2xl rounded-bl-sm bg-white/10 backdrop-blur-md border border-white/10 text-gray-100 text-[15px] leading-relaxed shadow-lg">
                      {msg.text}
                    </div>
                  </div>
                )}

                {/* User Message Bubble */}
                {msg.role === "user" && (
                  <div className="flex items-end gap-2 max-w-[85%]">
                    <div className="px-5 py-3.5 rounded-2xl rounded-br-sm bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-[15px] leading-relaxed shadow-lg border border-white/10">
                      {msg.text}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg border border-white/20">
                      {userData?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Live user text preview */}
            {userText && (
              <div className="flex justify-end w-full animate-[float_0.3s_ease-out]">
                <div className="flex items-end gap-2 max-w-[85%] opacity-70">
                  <div className="px-5 py-3.5 rounded-2xl rounded-br-sm bg-blue-500/30 border border-blue-400/30 text-white text-[15px] leading-relaxed italic backdrop-blur-sm">
                    {userText}
                    <span className="inline-block w-1 h-4 ml-1 bg-white animate-pulse"></span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {userData?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Footer / Input status */}
          <div className="px-6 py-4 border-t border-white/5 bg-[#0a0f1d]/80 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300
              ${listening ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-500'}`}
            >
              <FaMicrophone size={18} className={listening ? "animate-pulse" : ""} />
            </div>
            
            <div className="flex-1">
              {listening ? (
                <p className="text-cyan-400 text-sm font-medium tracking-wide">Listening to you...</p>
              ) : aiText ? (
                <p className="text-purple-400 text-sm font-medium tracking-wide">Processing & Speaking...</p>
              ) : (
                <p className="text-gray-500 text-sm">Microphone is on standby. Speak to interact.</p>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Home;
