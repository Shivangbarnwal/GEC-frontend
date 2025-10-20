import React, { useState, useEffect } from "react";
import axios from "axios";

const Translator = () => {
  const [inputText, setInputText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("fr");
  const [responseText, setResponseText] = useState("");
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.continuous = false;
    recog.interimResults = false;

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
    };

    recog.onend = () => setListening(false);

    setRecognition(recog);
  }, []);

  const handleTranslate = async () => {
    try {
      const response = await axios.post(
        "https://gec-backend1.onrender.com/api/openai/translate",
        {
          text: inputText,
          targetLanguage,
        }
      );
      const result = response.data.translatedText || response.data.response;
      setResponseText(result);
      speakOutLoud(result, targetLanguage);
    } catch (error) {
      setResponseText("Error occurred during translation.");
      console.error(error);
    }
  };

  const speakOutLoud = (text, languageCode) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith(languageCode));
    if (matchedVoice) utterance.voice = matchedVoice;
    window.speechSynthesis.speak(utterance);
  };

  const handleMicClick = () => {
    if (!recognition) return;
    if (listening) recognition.stop();
    else {
      recognition.lang = "en-US";
      recognition.start();
    }
    setListening(!listening);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-800 flex flex-col items-center justify-center px-4 text-white relative overflow-hidden">
      {/* Glowing background wave effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.2),_transparent_60%),_radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.2),_transparent_60%)]"></div>

      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center px-6 py-4 z-10">
        <h2 className="text-2xl font-bold tracking-wide text-pink-400 drop-shadow-md">
          Voice Assistant
        </h2>
      </header>

      {/* Main Card */}
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-8 z-10 border border-white/20 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400 drop-shadow-lg">
          🌍 Multilingual Voice Assistant
        </h1>

        {/* Mic section with animation */}
        <div className="flex justify-center my-6">
          <div
            onClick={handleMicClick}
            className={`relative w-24 h-24 flex items-center justify-center rounded-full cursor-pointer transition-all ${
              listening
                ? "bg-gradient-to-r from-pink-500 to-blue-500 shadow-[0_0_25px_5px_rgba(236,72,153,0.5)] animate-pulse"
                : "bg-gradient-to-r from-gray-700 to-gray-800 hover:shadow-[0_0_20px_4px_rgba(59,130,246,0.5)]"
            }`}
          >
            <span className="text-4xl">🎤</span>
          </div>
        </div>

        {/* Input Section */}
        <textarea
          className="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none mb-4"
          rows="4"
          placeholder="Type or speak your prompt..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <select
            className="flex-1 bg-white/10 border border-white/20 text-gray-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            <option value="en" style={{ color: "black" }}>
              English
            </option>
            <option value="fr" style={{ color: "black" }}>
              French
            </option>
            <option value="hi" style={{ color: "black" }}>
              Hindi
            </option>
            <option value="es" style={{ color: "black" }}>
              Spanish
            </option>
            <option value="de" style={{ color: "black" }}>
              German
            </option>
            <option value="ja" style={{ color: "black" }}>
              Japanese
            </option>
          </select>

          <button
            onClick={handleTranslate}
            className="bg-gradient-to-r from-pink-500 to-blue-500 hover:opacity-90 transition font-semibold px-6 py-3 rounded-xl shadow-lg"
          >
            Generate ✨
          </button>
        </div>


        {/* Response Section */}
        <div className="bg-white/10 border border-white/20 rounded-xl p-4 shadow-inner text-left">
          <p className="text-pink-300 font-semibold mb-1">Response:</p>
          <p className="text-lg text-gray-100 whitespace-pre-wrap">{responseText}</p>
        </div>
      </div>

      {/* Footer wave-like glow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-pink-500/20 to-transparent blur-3xl"></div>
    </div>
  );
};

export default Translator;
