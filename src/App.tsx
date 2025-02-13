import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, Download, Volume2, VolumeX, Palette } from 'lucide-react';
import { db } from './firebase'; // Import Firebase Firestore instance
import { collection, addDoc } from 'firebase/firestore';

interface CalculatorState {
  name1: string;
  name2: string;
  result: number | null;
  showResult: boolean;
  sound: boolean;
}

// Themes remain unchanged
const themes = [
  {
    name: "Classic Romance",
    background: "bg-gradient-to-br from-pink-100 via-red-100 to-pink-200",
    cardBg: "bg-white/80",
    primary: "from-red-500 to-pink-500",
    secondary: "bg-gray-100",
    text: "text-gray-800",
    accent: "text-red-500"
  },
  {
    name: "Midnight Love",
    background: "bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900",
    cardBg: "bg-gray-900/80",
    primary: "from-purple-500 to-pink-500",
    secondary: "bg-gray-800",
    text: "text-gray-100",
    accent: "text-purple-400"
  },
  {
    name: "Ocean Hearts",
    background: "bg-gradient-to-br from-cyan-100 via-blue-100 to-teal-100",
    cardBg: "bg-white/80",
    primary: "from-cyan-500 to-blue-500",
    secondary: "bg-gray-50",
    text: "text-gray-800",
    accent: "text-cyan-600"
  },
  {
    name: "Golden Romance",
    background: "bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100",
    cardBg: "bg-white/90",
    primary: "from-amber-500 to-orange-500",
    secondary: "bg-amber-50",
    text: "text-gray-900",
    accent: "text-amber-600"
  },
  {
    name: "Forest Love",
    background: "bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100",
    cardBg: "bg-white/80",
    primary: "from-emerald-500 to-green-500",
    secondary: "bg-emerald-50",
    text: "text-gray-800",
    accent: "text-emerald-600"
  },
  {
    name: "Lavender Dreams",
    background: "bg-gradient-to-br from-purple-100 via-fuchsia-100 to-pink-100",
    cardBg: "bg-white/80",
    primary: "from-purple-400 to-fuchsia-500",
    secondary: "bg-purple-50",
    text: "text-gray-800",
    accent: "text-purple-500"
  },
  {
    name: "Sunset Love",
    background: "bg-gradient-to-br from-orange-100 via-red-100 to-rose-100",
    cardBg: "bg-white/80",
    primary: "from-orange-500 to-rose-500",
    secondary: "bg-orange-50",
    text: "text-gray-800",
    accent: "text-orange-500"
  },
  {
    name: "Royal Hearts",
    background: "bg-gradient-to-br from-indigo-100 via-violet-100 to-purple-100",
    cardBg: "bg-white/80",
    primary: "from-indigo-500 to-violet-500",
    secondary: "bg-indigo-50",
    text: "text-gray-800",
    accent: "text-indigo-600"
  },
  {
    name: "Cherry Blossom",
    background: "bg-gradient-to-br from-pink-50 via-red-50 to-rose-50",
    cardBg: "bg-white/90",
    primary: "from-pink-400 to-rose-400",
    secondary: "bg-pink-50",
    text: "text-gray-800",
    accent: "text-pink-500"
  },
  {
    name: "Cosmic Love",
    background: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
    cardBg: "bg-gray-900/80",
    primary: "from-purple-400 to-pink-400",
    secondary: "bg-gray-800",
    text: "text-gray-100",
    accent: "text-purple-300"
  },
  {
    name: "Desert Romance",
    background: "bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50",
    cardBg: "bg-white/90",
    primary: "from-orange-400 to-amber-400",
    secondary: "bg-orange-50",
    text: "text-gray-800",
    accent: "text-orange-500"
  },
  {
    name: "Arctic Love",
    background: "bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50",
    cardBg: "bg-white/90",
    primary: "from-blue-400 to-sky-400",
    secondary: "bg-blue-50",
    text: "text-gray-800",
    accent: "text-blue-500"
  },
  {
    name: "Enchanted Forest",
    background: "bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900",
    cardBg: "bg-gray-900/80",
    primary: "from-green-400 to-emerald-400",
    secondary: "bg-gray-800",
    text: "text-gray-100",
    accent: "text-green-300"
  },
  {
    name: "Candy Hearts",
    background: "bg-gradient-to-br from-pink-200 via-rose-200 to-red-200",
    cardBg: "bg-white/80",
    primary: "from-pink-400 to-rose-400",
    secondary: "bg-pink-50",
    text: "text-gray-800",
    accent: "text-pink-500"
  },
  {
    name: "Moonlight Serenade",
    background: "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900",
    cardBg: "bg-gray-900/80",
    primary: "from-blue-400 to-indigo-400",
    secondary: "bg-gray-800",
    text: "text-gray-100",
    accent: "text-blue-300"
  },
  {
    name: "Spring Romance",
    background: "bg-gradient-to-br from-green-100 via-yellow-100 to-pink-100",
    cardBg: "bg-white/80",
    primary: "from-green-400 to-yellow-400",
    secondary: "bg-green-50",
    text: "text-gray-800",
    accent: "text-green-500"
  },
  {
    name: "Velvet Love",
    background: "bg-gradient-to-br from-rose-900 via-red-900 to-rose-900",
    cardBg: "bg-gray-900/80",
    primary: "from-rose-400 to-red-400",
    secondary: "bg-gray-800",
    text: "text-gray-100",
    accent: "text-rose-300"
  },
  {
    name: "Pastel Dreams",
    background: "bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100",
    cardBg: "bg-white/80",
    primary: "from-purple-300 to-pink-300",
    secondary: "bg-purple-50",
    text: "text-gray-800",
    accent: "text-purple-400"
  },
  {
    name: "Autumn Romance",
    background: "bg-gradient-to-br from-orange-200 via-amber-200 to-red-200",
    cardBg: "bg-white/80",
    primary: "from-orange-500 to-amber-500",
    secondary: "bg-orange-50",
    text: "text-gray-800",
    accent: "text-orange-600"
  },
  {
    name: "Winter Love",
    background: "bg-gradient-to-br from-blue-100 via-slate-100 to-gray-100",
    cardBg: "bg-white/90",
    primary: "from-blue-400 to-slate-400",
    secondary: "bg-blue-50",
    text: "text-gray-800",
    accent: "text-blue-500"
  }
];

function App() {
  const [state, setState] = useState<CalculatorState>({
    name1: '',
    name2: '',
    result: null,
    showResult: false,
    sound: false,
  });

  const [currentTheme, setCurrentTheme] = useState(themes[0]);
  const [showThemes, setShowThemes] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('love-calculator-theme');
    if (savedTheme) {
      const theme = themes.find(t => t.name === savedTheme);
      if (theme) setCurrentTheme(theme);
    }
  }, []);

  const calculateLove = async () => {
    if (!state.name1 || !state.name2) return;
    
    const combinedNames = (state.name1 + state.name2).toLowerCase();
    let sum = 0;
    for (let i = 0; i < combinedNames.length; i++) {
      sum += combinedNames.charCodeAt(i);
    }
    const result = sum % 101;
    
    // Save to Firebase Firestore
    try {
      await addDoc(collection(db, 'love_calculations'), {
        name1: state.name1,
        name2: state.name2,
        result: result,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error saving calculation:', error);
    }
    
    setState(prev => ({ ...prev, result, showResult: true }));
  };

  const resetCalculator = () => {
    setState({ name1: '', name2: '', result: null, showResult: false, sound: false });
  };

  const toggleSound = () => {
    setState(prev => ({ ...prev, sound: !prev.sound }));
  };

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('love-calculator-theme', theme.name);
    setShowThemes(false);
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} flex items-center justify-center p-4 transition-colors duration-500`}>
      <motion.div className={`w-full max-w-md ${currentTheme.cardBg} backdrop-blur-lg rounded-2xl shadow-xl p-8 relative`}>
        <button
          onClick={() => setShowThemes(!showThemes)}
          className={`absolute top-4 right-4 p-2 ${currentTheme.accent} hover:opacity-80 transition-opacity`}
          aria-label="Change theme"
        >
          <Palette className="w-6 h-6" />
        </button>

        {showThemes && (
          <motion.div className="absolute right-4 top-16 w-48 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl p-2 z-10">
            {themes.map((theme) => (
              <button key={theme.name} onClick={() => changeTheme(theme)} className="w-full text-left px-3 py-2 rounded-md text-sm">
                {theme.name}
              </button>
            ))}
          </motion.div>
        )}

        <div className="text-center mb-8">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <Heart className={`w-12 h-12 ${currentTheme.accent} mx-auto`} fill="currentColor" />
          </motion.div>
          <h1 className={`text-3xl font-bold ${currentTheme.text} mt-4`}>Love Calculator</h1>
          <p className={`${currentTheme.text} mt-2 opacity-80`}>Discover your love compatibility</p>
        </div>

        <AnimatePresence mode="wait">
          {!state.showResult ? (
            <motion.div key="input" className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>Your Name</label>
                <input type="text" value={state.name1} onChange={(e) => setState(prev => ({ ...prev, name1: e.target.value }))} className="w-full px-4 py-2 rounded-lg border" placeholder="Enter your name" />
              </div>

              <div>
                <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>Partner's Name</label>
                <input type="text" value={state.name2} onChange={(e) => setState(prev => ({ ...prev, name2: e.target.value }))} className="w-full px-4 py-2 rounded-lg border" placeholder="Enter partner's name" />
              </div>

              <button onClick={calculateLove} className={`w-full bg-gradient-to-r ${currentTheme.primary} text-white py-3 rounded-lg font-semibold shadow-lg`}>Calculate Love</button>
            </motion.div>
          ) : (
            <motion.div key="result" className="text-center space-y-6">
              <motion.div animate={{ scale: [1, 1.2, 1] }} className={`text-6xl font-bold ${currentTheme.accent}`}>{state.result}%</motion.div>
              <p className={`text-xl ${currentTheme.text}`}>{state.name1} & {state.name2}</p>
              <button onClick={resetCalculator} className={`w-full ${currentTheme.secondary} ${currentTheme.text} py-3 rounded-lg font-semibold`}>Calculate Again</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default App;
