import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "../assets/ai.gif";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import userImg from "../assets/user.gif";

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
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center overflow-hidden relative">
      {/* Mobile hamburger */}
      <CgMenuRight
        className="lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] z-50"
        onClick={() => setHam(true)}
      />

      {/* Mobile slide-out menu */}
      <div
        className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start z-40 ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}
      >
        <RxCross1
          className="text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]"
          onClick={() => setHam(false)}
        />
        <button
          className="min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]"
          onClick={handleLogOut}
        >
          Log Out
        </button>
        <button
          className="min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]"
          onClick={() => navigate("/customize")}
        >
          Customize your Assistant
        </button>
        <div className="w-full h-[2px] bg-gray-400"></div>
        <h1 className="text-white font-semibold text-[19px]">History</h1>
        <div className="w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate">
          {userData.history?.map((his, i) => (
            <div key={i} className="text-gray-200 text-[18px] w-full h-[30px]">
              {his}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop buttons */}
      <button
        className="min-w-[150px] h-[60px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px] bg-white rounded-full cursor-pointer text-[19px]"
        onClick={handleLogOut}
      >
        Log Out
      </button>
      <button
        className="min-w-[150px] h-[60px] text-black font-semibold bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block"
        onClick={() => navigate("/customize")}
      >
        Customize your Assistant
      </button>

      {/* Main content: AI panel + Chat panel side by side */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-[40px] w-full max-w-[1100px] px-[20px]">

        {/* Left: AI section */}
        <div className="flex flex-col items-center gap-[10px]">
          <div className="w-[220px] h-[320px] lg:w-[280px] lg:h-[400px] flex justify-center items-center overflow-hidden rounded-3xl shadow-lg shadow-blue-900">
            <img
              src={userData?.assistantImage}
              alt="assistant"
              className="h-full object-cover"
            />
          </div>
          <h1 className="text-white text-[18px] font-semibold">
            I'm {userData?.assistantName}
          </h1>
          {/* Listening / Speaking indicator */}
          <div className="flex items-center gap-2">
            {listening && (
              <span className="flex items-center gap-1 text-green-400 text-[14px] font-medium">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block"></span>
                Listening...
              </span>
            )}
            {aiText && !listening && (
              <span className="flex items-center gap-1 text-blue-300 text-[14px] font-medium">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse inline-block"></span>
                Speaking...
              </span>
            )}
            {!listening && !aiText && (
              <span className="text-gray-500 text-[13px]">Idle</span>
            )}
          </div>
          {!aiText && <img src={userImg} alt="" className="w-[120px]" />}
          {aiText && <img src={aiImg} alt="" className="w-[120px]" />}
        </div>

        {/* Right: Chat window */}
        <div className="flex flex-col w-full max-w-[480px] h-[480px] lg:h-[520px] bg-[#ffffff08] border border-[#ffffff18] rounded-2xl backdrop-blur-md shadow-xl shadow-black overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#ffffff15] bg-[#ffffff06]">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
            <h2 className="text-white font-semibold text-[16px]">
              Conversation
            </h2>
            <span className="ml-auto text-gray-400 text-[12px]">
              {messages.length} message{messages.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scroll-smooth"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#ffffff20 transparent" }}>
            {messages.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500 text-[14px] text-center">
                  Start speaking to begin the conversation...
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* AI avatar dot */}
                {msg.role === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold mr-2 mt-1 flex-shrink-0">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-4 py-2 rounded-2xl text-[14px] leading-relaxed break-words ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-[#ffffff14] text-gray-100 rounded-tl-sm border border-[#ffffff10]"
                  }`}
                >
                  {msg.text}
                </div>
                {/* User avatar dot */}
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center text-white text-[11px] font-bold ml-2 mt-1 flex-shrink-0">
                    {userData?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
            ))}
            {/* Live user text while speaking */}
            {userText && (
              <div className="flex justify-end">
                <div className="max-w-[78%] px-4 py-2 rounded-2xl text-[14px] leading-relaxed bg-blue-500 text-white rounded-tr-sm opacity-70 italic">
                  {userText}
                </div>
                <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center text-white text-[11px] font-bold ml-2 mt-1 flex-shrink-0">
                  {userData?.name?.[0]?.toUpperCase() || "U"}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat footer status */}
          <div className="px-5 py-3 border-t border-[#ffffff15] bg-[#ffffff06] flex items-center gap-2">
            {listening ? (
              <>
                <span className="flex gap-[3px] items-end h-4">
                  <span className="w-1 h-2 bg-green-400 rounded animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1 h-3 bg-green-400 rounded animate-bounce" style={{ animationDelay: "100ms" }}></span>
                  <span className="w-1 h-4 bg-green-400 rounded animate-bounce" style={{ animationDelay: "200ms" }}></span>
                  <span className="w-1 h-3 bg-green-400 rounded animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  <span className="w-1 h-2 bg-green-400 rounded animate-bounce" style={{ animationDelay: "400ms" }}></span>
                </span>
                <span className="text-green-400 text-[13px]">Listening to you...</span>
              </>
            ) : aiText ? (
              <>
                <span className="flex gap-[3px] items-end h-4">
                  <span className="w-1 h-2 bg-blue-400 rounded animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1 h-3 bg-blue-400 rounded animate-bounce" style={{ animationDelay: "100ms" }}></span>
                  <span className="w-1 h-4 bg-blue-400 rounded animate-bounce" style={{ animationDelay: "200ms" }}></span>
                  <span className="w-1 h-3 bg-blue-400 rounded animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  <span className="w-1 h-2 bg-blue-400 rounded animate-bounce" style={{ animationDelay: "400ms" }}></span>
                </span>
                <span className="text-blue-300 text-[13px]">{userData?.assistantName} is speaking...</span>
              </>
            ) : (
              <span className="text-gray-500 text-[13px]">🎤 Say something to talk to your assistant</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
