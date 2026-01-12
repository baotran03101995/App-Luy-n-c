
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, RotateCcw, Sparkles } from 'lucide-react';

const VoiceRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setAudioUrl(null);
      timerRef.current = window.setInterval(() => setRecordingTime(p => p + 1), 1000);
    } catch (err) {
      alert("Bé ơi, máy chưa bật micro rồi!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-[50px] p-6 md:p-10 border-4 border-dashed border-purple-200 shadow-inner flex flex-col items-center gap-6 mt-4">
      <div className="flex items-center gap-3">
        <div className="bg-purple-500 p-3 rounded-full text-white shadow-lg"><Mic size={24} /></div>
        <h3 className="text-3xl font-black text-purple-700 uppercase">Con đọc nhé!</h3>
      </div>

      <div className="relative flex items-center justify-center h-24 w-full bg-white rounded-[30px] border-4 border-purple-100 overflow-hidden shadow-lg px-4">
        {isRecording ? (
          <div className="flex items-center gap-1 w-full justify-center">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-2 bg-purple-400 rounded-full animate-pulse" style={{ height: `${20 + Math.random() * 60}%`, animationDelay: `${i * 0.1}s` }} />
            ))}
            <span className="ml-4 font-black text-2xl text-red-500">{Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</span>
          </div>
        ) : audioUrl ? (
          <div className="flex items-center gap-2 text-purple-600 font-black text-xl text-center"><Sparkles size={20} className="text-yellow-400" /> Bé đã ghi âm xong!</div>
        ) : (
          <span className="text-gray-300 font-bold text-lg italic text-center">Bấm micro để bắt đầu...</span>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 w-full">
        {!isRecording ? (
          <button onClick={startRecording} className="flex-1 bg-purple-500 text-white py-4 rounded-[25px] font-black text-xl flex items-center justify-center gap-2 shadow-[0_6px_0_#7e22ce] active:translate-y-1 active:shadow-none transition-all">
            <Mic size={24} /> BẮT ĐẦU
          </button>
        ) : (
          <button onClick={stopRecording} className="flex-1 bg-red-500 text-white py-4 rounded-[25px] font-black text-xl flex items-center justify-center gap-2 shadow-[0_6px_0_#b91c1c] active:translate-y-1 active:shadow-none transition-all">
            <Square size={24} fill="white" /> XONG!
          </button>
        )}
        
        {audioUrl && !isRecording && (
          <div className="flex gap-2 w-full">
            <button onClick={() => new Audio(audioUrl).play()} className="flex-1 bg-green-500 text-white py-4 rounded-[25px] font-black text-xl flex items-center justify-center gap-2 shadow-[0_6px_0_#15803d] active:translate-y-1">
              <Play size={24} fill="white" /> NGHE LẠI
            </button>
            <button onClick={() => setAudioUrl(null)} className="bg-gray-400 text-white px-6 py-4 rounded-[25px] font-black text-xl shadow-[0_6px_0_#4b5563] active:translate-y-1">
              <RotateCcw size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
