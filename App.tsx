
import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, 
  Play, 
  Pause,
  RotateCcw,
  Image as ImageIcon, 
  Plus, 
  Settings, 
  User, 
  Music,
  X,
  Upload,
  CheckCircle2,
  Sparkles,
  Award,
  Clock
} from 'lucide-react';
import { DifficultWord, Poem, LineTiming } from './types';
import WordCard from './components/WordCard';
import PoemDisplay from './components/PoemDisplay';
import VoiceRecorder from './components/VoiceRecorder';

const INITIAL_POEM: Poem = {
  title: "Chiếc cầu mới",
  author: "Thái Hoàng Linh",
  sampleAudioUrl: "",
  detailedLines: [
    {
      line: 1, start: 0.00, end: 3.68,
      words: [
        { text: "Bài", duration: 0.74 }, { text: "thơ", duration: 0.74 }, { text: "Chiếc", duration: 0.74 }, { text: "cầu", duration: 0.74 }, { text: "mới", duration: 0.72 }
      ]
    },
    {
      line: 2, start: 4.98, end: 6.70,
      words: [{ text: "Trên", duration: 0.43 }, { text: "dòng", duration: 0.43 }, { text: "sông", duration: 0.43 }, { text: "trắng", duration: 0.43 }]
    },
    {
      line: 3, start: 7.72, end: 9.40,
      words: [{ text: "Cầu", duration: 0.42, difficult: true }, { text: "mới", duration: 0.42, difficult: true }, { text: "dựng", duration: 0.42 }, { text: "lên", duration: 0.42 }]
    },
    {
      line: 4, start: 10.28, end: 11.92,
      words: [{ text: "Nhân", duration: 0.41 }, { text: "dân", duration: 0.41 }, { text: "đi", duration: 0.41 }, { text: "bên", duration: 0.41 }]
    },
    {
      line: 5, start: 12.84, end: 14.76,
      words: [{ text: "Tàu", duration: 0.48 }, { text: "xe", duration: 0.48 }, { text: "chạy", duration: 0.48 }, { text: "giữa", duration: 0.48 }]
    },
    {
      line: 6, start: 15.76, end: 17.80,
      words: [{ text: "Tu", duration: 0.51 }, { text: "tu", duration: 0.51 }, { text: "xe", duration: 0.51, difficult: true }, { text: "lửa", duration: 0.51, difficult: true }]
    },
    {
      line: 7, start: 18.60, end: 20.62,
      words: [{ text: "Xình", duration: 0.51, difficult: true }, { text: "xịch", duration: 0.51, difficult: true }, { text: "qua", duration: 0.50 }, { text: "cầu", duration: 0.50 }]
    },
    {
      line: 8, start: 21.58, end: 23.40,
      words: [{ text: "Khách", duration: 0.46 }, { text: "ngồi", duration: 0.46 }, { text: "trên", duration: 0.46 }, { text: "tàu", duration: 0.46 }]
    },
    {
      line: 9, start: 24.04, end: 26.02,
      words: [{ text: "Đoàn", duration: 0.49 }, { text: "người", duration: 0.49 }, { text: "đi", duration: 0.49 }, { text: "bộ", duration: 0.51 }]
    },
    {
      line: 10, start: 26.82, end: 28.40,
      words: [{ text: "Cùng", duration: 0.40 }, { text: "cười", duration: 0.39 }, { text: "hớn", duration: 0.39 }, { text: "hở", duration: 0.40 }]
    },
    {
      line: 11, start: 29.06, end: 30.90,
      words: [{ text: "Nhìn", duration: 0.46 }, { text: "chiếc", duration: 0.46 }, { text: "cầu", duration: 0.46 }, { text: "dài", duration: 0.46 }]
    },
    {
      line: 12, start: 31.68, end: 33.40,
      words: [{ text: "Tấm", duration: 0.43 }, { text: "tắc", duration: 0.43 }, { text: "khen", duration: 0.43 }, { text: "tài", duration: 0.43 }]
    },
    {
      line: 13, start: 34.14, end: 35.94,
      words: [{ text: "Công", duration: 0.45, difficult: true }, { text: "nhân", duration: 0.45, difficult: true }, { text: "xây", duration: 0.45, difficult: true }, { text: "dựng", duration: 0.45, difficult: true }]
    }
  ]
};

const INITIAL_WORDS: DifficultWord[] = [
  { id: '1', word: 'Cầu mới', imageUrl: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=500', explanation: 'Cây cầu vừa mới được xây dựng xong để mọi người qua sông dễ dàng.' },
  { id: '2', word: 'Xe lửa', imageUrl: 'https://images.unsplash.com/photo-1474487056235-5264edf096db?w=500', explanation: 'Một loại tàu hỏa chạy trên đường ray, kêu Tu tu rất vui tai.' },
  { id: '3', word: 'Xình xịch', imageUrl: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=500', explanation: 'Âm thanh mô phỏng tiếng máy của tàu hỏa đang chạy trên đường ray.' },
  { id: '4', word: 'Công nhân xây dựng', imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f3366d4?w=500', explanation: 'Những cô chú thợ xây giỏi giang, làm việc vất vả để xây cầu.' }
];

type PlaybackStatus = 'stopped' | 'playing' | 'paused';

const App: React.FC = () => {
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [poem, setPoem] = useState<Poem>(INITIAL_POEM);
  const [difficultWords, setDifficultWords] = useState<DifficultWord[]>(INITIAL_WORDS);
  const [activeWord, setActiveWord] = useState<DifficultWord | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('stopped');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleTeacherMode = () => setIsTeacherMode(!isTeacherMode);

  const updatePlaybackTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const toggleSampleAudio = () => {
    if (!poem.sampleAudioUrl) {
      alert("Cô/Thầy hãy tải lên file âm thanh mẫu ở chế độ Giáo viên nhé!");
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(poem.sampleAudioUrl);
      audioRef.current.ontimeupdate = updatePlaybackTime;
      audioRef.current.onended = () => {
        setPlaybackStatus('stopped');
        setCurrentTime(0);
      };
    }

    if (playbackStatus === 'playing') {
      audioRef.current.pause();
      setPlaybackStatus('paused');
    } else {
      audioRef.current.play();
      setPlaybackStatus('playing');
    }
  };

  const stopSampleAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaybackStatus('stopped');
      setCurrentTime(0);
    }
  };

  const playWordSound = (word: string) => {
    const speech = new SpeechSynthesisUtterance(word);
    speech.lang = 'vi-VN';
    speech.rate = 0.8;
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center bg-[#FFF9EB]">
      <header className="w-full max-w-[1600px] flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-yellow-300 to-orange-400 p-4 rounded-[25px] shadow-lg border-4 border-white">
            <Sparkles className="text-white w-10 h-10" />
          </div>
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-blue-600 drop-shadow-md">Bé Luyện Đọc</h1>
            <p className="text-orange-500 font-bold text-lg mt-1 flex items-center gap-2"><Award size={20} /> Karaoke Thơ Tương Tác</p>
          </div>
        </div>
        
        <button 
          onClick={toggleTeacherMode}
          className={`flex items-center gap-3 px-8 py-4 rounded-full font-black text-lg transition-all shadow-md ${isTeacherMode ? 'bg-orange-500 text-white' : 'bg-white text-blue-600 border-4 border-blue-100'}`}
        >
          {isTeacherMode ? <User size={24} /> : <Settings size={24} />}
          {isTeacherMode ? 'CHẾ ĐỘ TRẺ EM' : 'CHẾ ĐỘ GIÁO VIÊN'}
        </button>
      </header>

      <main className="w-full max-w-[1600px] grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column (70%) */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          <div className="bg-white rounded-[80px] shadow-2xl overflow-hidden border-8 border-white flex flex-col">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-10 text-center text-white relative">
              <h2 className="text-2xl font-black uppercase tracking-widest text-blue-100 mb-2">LUYỆN ĐỌC THƠ</h2>
              <h3 className="text-5xl md:text-8xl font-black text-red-400 drop-shadow-sm mb-4">{poem.title}</h3>
              <p className="text-3xl italic font-bold opacity-90">Tác giả: {poem.author}</p>
            </div>

            <div className="p-10 md:p-20 bg-[#FFFDF5] flex-grow shadow-inner min-h-[800px]">
              <PoemDisplay 
                poem={poem} 
                difficultWords={difficultWords} 
                currentTime={currentTime}
                onWordClick={(wordStr) => {
                  const dw = difficultWords.find(w => w.word.toLowerCase() === wordStr.toLowerCase());
                  if (dw) {
                    setActiveWord(dw);
                    playWordSound(dw.word);
                  }
                }} 
              />
            </div>

            <div className="p-10 bg-blue-50 flex flex-col md:flex-row items-center justify-between border-t-8 border-dashed border-blue-100 gap-6">
              <div className="flex items-center gap-6">
                <div className={`w-28 h-28 rounded-[35px] flex items-center justify-center ${playbackStatus === 'playing' ? 'bg-green-500 animate-pulse' : 'bg-blue-600'} text-white shadow-xl border-4 border-white`}>
                  {playbackStatus === 'playing' ? <Volume2 size={56} /> : <Play size={56} fill="white" />}
                </div>
                <div>
                  <p className="font-black text-blue-800 text-4xl">Âm thanh đọc mẫu</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-6 py-2 rounded-full text-xl font-bold flex items-center gap-2 ${poem.sampleAudioUrl ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                      {poem.sampleAudioUrl ? <CheckCircle2 size={24} /> : <X size={24} />}
                      {playbackStatus === 'playing' ? 'Đang đọc...' : poem.sampleAudioUrl ? 'Đã sẵn sàng' : 'Chưa có file'}
                    </span>
                    {isTeacherMode && <span className="text-blue-400 font-black text-xl ml-4 bg-blue-100 px-4 py-1 rounded-full"><Clock size={20} className="inline mr-1" />{currentTime.toFixed(2)}s</span>}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                {playbackStatus !== 'stopped' && (
                  <button onClick={stopSampleAudio} className="bg-red-400 text-white px-8 py-6 rounded-[35px] font-black text-2xl shadow-lg active:translate-y-1"><RotateCcw size={32} /></button>
                )}
                <button 
                  onClick={toggleSampleAudio}
                  className={`px-12 py-6 rounded-[35px] font-black text-3xl flex items-center gap-4 shadow-lg active:translate-y-2 ${playbackStatus === 'playing' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'}`}
                >
                  {playbackStatus === 'playing' ? <><Pause size={40} fill="white" /> DỪNG</> : <><Play size={40} fill="white" /> NGHE MẪU</>}
                </button>
                {isTeacherMode && (
                  <label className="cursor-pointer bg-white border-4 border-dashed border-blue-400 text-blue-600 px-8 py-6 rounded-[35px] font-black text-2xl flex items-center gap-3">
                    <Upload size={32} /> TẢI LÊN
                    <input type="file" accept="audio/*" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setPoem({...poem, sampleAudioUrl: URL.createObjectURL(file)});
                    }} />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (30%) */}
        <div className="xl:col-span-4 flex flex-col gap-8 h-full">
          <div className="bg-gradient-to-br from-orange-400 to-red-400 p-10 rounded-[50px] shadow-2xl text-white border-4 border-white">
            <h3 className="text-4xl font-black flex items-center gap-3"><Sparkles size={36} /> TỪ KHÓ MỚI</h3>
            <p className="text-orange-100 font-bold mt-2 opacity-90 text-xl">Bấm xem hình minh họa bé nhé!</p>
          </div>
          <div className="flex flex-col gap-6 overflow-y-auto max-h-[1000px] pr-4 custom-scrollbar">
            {difficultWords.map(word => (
              <WordCard 
                key={word.id} word={word} isTeacherMode={isTeacherMode}
                onRemove={(id) => setDifficultWords(difficultWords.filter(w => w.id !== id))}
                onUpdate={(upd) => setDifficultWords(difficultWords.map(w => w.id === upd.id ? upd : w))}
                onSelect={() => { setActiveWord(word); playWordSound(word.word); }}
              />
            ))}
          </div>
          
          {/* Relocated VoiceRecorder */}
          <VoiceRecorder />
        </div>
      </main>

      {activeWord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-lg">
          <div className="bg-white rounded-[80px] w-full max-w-3xl overflow-hidden shadow-2xl border-8 border-white animate-in zoom-in-75 duration-300">
            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-12 flex justify-between items-center text-white">
              <h2 className="text-7xl font-black drop-shadow-lg">{activeWord.word}</h2>
              <button onClick={() => setActiveWord(null)}><X size={48} strokeWidth={4} /></button>
            </div>
            <div className="p-12 flex flex-col items-center gap-10">
              <div className="w-full h-[400px] bg-gray-100 rounded-[60px] overflow-hidden border-8 border-gray-100 shadow-2xl">
                {activeWord.imageUrl ? <img src={activeWord.imageUrl} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><ImageIcon size={150} /></div>}
              </div>
              <p className="text-4xl font-black text-center text-gray-700">{activeWord.explanation}</p>
              <button onClick={() => playWordSound(activeWord.word)} className="w-full bg-red-500 text-white py-10 rounded-[45px] font-black text-5xl flex items-center justify-center gap-6 shadow-[0_15px_0_#b91c1c] active:translate-y-2">
                <Volume2 size={70} strokeWidth={3} /> NGHE ĐỌC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
