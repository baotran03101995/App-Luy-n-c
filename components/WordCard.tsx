
import React, { useState } from 'react';
import { DifficultWord } from '../types';
import { Volume2, Image as ImageIcon, Trash2, Edit3, Upload, X, Save } from 'lucide-react';

interface WordCardProps {
  word: DifficultWord;
  isTeacherMode: boolean;
  onRemove: (id: string) => void;
  onUpdate: (word: DifficultWord) => void;
  onSelect: () => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, isTeacherMode, onRemove, onUpdate, onSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedWord, setEditedWord] = useState(word);

  const handleSave = () => {
    onUpdate(editedWord);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditedWord({ ...editedWord, imageUrl: url });
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white border-2 border-orange-400 p-4 rounded-3xl shadow-lg flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <input 
            className="text-lg font-bold border-b-2 border-gray-200 outline-none focus:border-orange-400 w-full"
            value={editedWord.word}
            onChange={(e) => setEditedWord({...editedWord, word: e.target.value})}
          />
          <button onClick={() => setIsEditing(false)} className="text-gray-400"><X size={20} /></button>
        </div>
        <textarea 
          placeholder="Giải thích nghĩa từ..."
          className="text-sm p-2 bg-gray-50 rounded-lg w-full h-20 outline-none"
          value={editedWord.explanation}
          onChange={(e) => setEditedWord({...editedWord, explanation: e.target.value})}
        />
        <div className="flex gap-2">
            <label className="flex-1 bg-gray-100 p-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer hover:bg-gray-200">
                <ImageIcon size={14} /> Ảnh
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
            <button 
                onClick={handleSave}
                className="flex-1 bg-orange-500 text-white p-2 rounded-xl text-xs flex items-center justify-center gap-1 font-bold"
            >
                <Save size={14} /> Lưu
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white p-4 rounded-3xl shadow-md border-b-4 border-orange-100 hover:border-orange-300 transition-all flex items-center gap-4 relative">
      <div 
        onClick={onSelect}
        className="w-16 h-16 bg-blue-50 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
      >
        {word.imageUrl ? (
          <img src={word.imageUrl} alt={word.word} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-blue-200">
            <ImageIcon size={24} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 cursor-pointer" onClick={onSelect}>
        <h4 className="text-xl font-bold text-gray-800 truncate">{word.word}</h4>
        <div className="flex gap-2 mt-1">
            <span className="p-1 bg-green-100 rounded-full text-green-600"><Volume2 size={14} /></span>
            <span className="p-1 bg-blue-100 rounded-full text-blue-600"><ImageIcon size={14} /></span>
        </div>
      </div>

      {isTeacherMode && (
        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 bg-gray-100 hover:bg-orange-100 text-orange-500 rounded-xl transition-colors"
          >
            <Edit3 size={16} />
          </button>
          <button 
            onClick={() => onRemove(word.id)}
            className="p-2 bg-gray-100 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default WordCard;
