
export interface DifficultWord {
  id: string;
  word: string;
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
}

export interface WordTiming {
  text: string;
  duration: number;
  difficult?: boolean;
}

export interface LineTiming {
  line: number;
  start: number;
  end: number;
  words: WordTiming[];
}

export interface Poem {
  title: string;
  author: string;
  detailedLines: LineTiming[];
  sampleAudioUrl?: string;
}

export interface AppState {
  isTeacherMode: boolean;
  poem: Poem;
  difficultWords: DifficultWord[];
}
