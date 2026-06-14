import { create } from 'zustand';

const usePlayerStore = create((set, get) => ({
  currentSong: null,
  queue: [],
  isPlaying: false,
  volume: 1,
  repeat: false,
  shuffle: false,

  playSong: (song, queue = []) =>
    set({ currentSong: song, queue, isPlaying: true }),

  togglePlay: () => set({ isPlaying: !get().isPlaying }),

  setVolume: (volume) => set({ volume }),

  toggleRepeat: () => set({ repeat: !get().repeat }),

  toggleShuffle: () => set({ shuffle: !get().shuffle }),

  playNext: () => {
    const { queue, currentSong, shuffle } = get();
    if (queue.length === 0) return;

    if (shuffle) {
      const random = queue[Math.floor(Math.random() * queue.length)];
      set({ currentSong: random, isPlaying: true });
      return;
    }

    const index = queue.findIndex((s) => s.id === currentSong?.id);
    const next = queue[(index + 1) % queue.length];
    set({ currentSong: next, isPlaying: true });
  },

  playPrevious: () => {
    const { queue, currentSong } = get();
    if (queue.length === 0) return;
    const index = queue.findIndex((s) => s.id === currentSong?.id);
    const prev = queue[(index - 1 + queue.length) % queue.length];
    set({ currentSong: prev, isPlaying: true });
  },
}));

export default usePlayerStore;