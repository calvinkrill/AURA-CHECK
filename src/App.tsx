/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Coffee, 
  Moon, 
  Sun, 
  Mountain, 
  Waves, 
  Music, 
  Gamepad2, 
  Sparkles, 
  ArrowRight, 
  RefreshCw,
  Camera,
  Ghost,
  Cat,
  Zap,
  Star,
  Cloud,
  Flower,
  SmilePlus,
  Flame,
  Palette,
  Laptop,
  Smartphone,
  Pizza,
  Plane,
  HeartCrack,
  Coffee as CoffeeIcon,
  Tent,
  Book,
  Camera as CameraIcon,
  Sparkle,
  Trees,
  User,
  Skull
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

// Sound Utility for procedural cute sounds
const playSound = (type: 'pop' | 'twinkle' | 'reveal' | 'click') => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  if (type === 'click') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'pop') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'twinkle') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.05);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  } else if (type === 'reveal') {
    [880, 1100, 1320].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.setValueAtTime(freq, now + i * 0.1);
      g.gain.setValueAtTime(0.1, now + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
      o.start(now + i * 0.1);
      o.stop(now + i * 0.1 + 0.3);
    });
  }
};

// Simple mocks for missing icons
const Spa = (props: any) => <Trees {...props} />;
const Planet = (props: any) => <Star {...props} />;
const Dizzy = (props: any) => <Skull {...props} />;

// Expanded 20 Questions with 6 choices each for maximum coverage
const QUESTIONS = [
  {
    id: 'chronotype',
    title: 'Your peak existence window?',
    options: [
      { id: '5am', label: '5 AM Grind', icon: Sun, color: 'bg-amber-100' },
      { id: 'midday', label: 'Noon Warrior', icon: Star, color: 'bg-blue-100' },
      { id: 'sunset', label: 'Golden Hour', icon: Cloud, color: 'bg-orange-100' },
      { id: 'evening', label: 'Late Bloomer', icon: Moon, color: 'bg-lavender' },
      { id: 'midnight', label: 'Witching Hour', icon: Sparkles, color: 'bg-indigo-200' },
      { id: '3am', label: '3 AM Demon', icon: Ghost, color: 'bg-slate-800 text-white' },
    ]
  },
  {
    id: 'drink',
    title: 'Liquid personality trait?',
    options: [
      { id: 'matcha', label: 'Oat Matcha', icon: Cat, color: 'bg-matcha' },
      { id: 'coldbrew', label: 'Black Cold Brew', icon: CoffeeIcon, color: 'bg-stone-300' },
      { id: 'energy', label: 'Blue Battery', icon: Zap, color: 'bg-blueberry' },
      { id: 'tea', label: 'Chai Latte', icon: Flower, color: 'bg-lemon' },
      { id: 'water', label: 'Emotional Support Water', icon: Waves, color: 'bg-sky-100' },
      { id: 'boba', label: 'Brown Sugar Boba', icon: Heart, color: 'bg-pink-100' },
    ]
  },
  {
    id: 'aesthetic',
    title: 'The feed vibe is...',
    options: [
      { id: 'minimal', label: 'Clean Girl/Boy', icon: Sparkles, color: 'bg-white' },
      { id: 'grunge', label: '90s Archive', icon: Ghost, color: 'bg-stone-400' },
      { id: 'y2k', label: 'McBling Cyber', icon: Laptop, color: 'bg-pink-300' },
      { id: 'cottage', label: 'Ghibli Core', icon: Tent, color: 'bg-green-200' },
      { id: 'street', label: 'Blokecore', icon: Zap, color: 'bg-blue-300' },
      { id: 'cozy', label: 'Soft Girl/Boy', icon: Flower, color: 'bg-lavender' },
    ]
  },
  {
    id: 'music',
    title: 'Handing you the aux...',
    options: [
      { id: 'hyperpop', label: 'Hyperpop', icon: Zap, color: 'bg-yellow-300' },
      { id: 'rnb', label: 'R&B / Soul', icon: Moon, color: 'bg-indigo-300' },
      { id: 'indie', label: 'Indie Folk', icon: Mountain, color: 'bg-orange-200' },
      { id: 'kpop', label: 'K-Pop Hype', icon: Star, color: 'bg-rose-300' },
      { id: 'rap', label: 'Underground Rap', icon: Flame, color: 'bg-neutral-800 text-white' },
      { id: 'house', label: 'Euro House', icon: Music, color: 'bg-cyan-200' },
    ]
  },
  {
    id: 'social',
    title: 'Social battery status?',
    options: [
      { id: 'yapper', label: 'Professional Yapper', icon: SmilePlus, color: 'bg-green-300' },
      { id: 'loyal', label: 'Small Circle Only', icon: Heart, color: 'bg-rose-200' },
      { id: 'observer', label: 'The Wallflower', icon: Ghost, color: 'bg-stone-200' },
      { id: 'fried', label: 'Burnt Out', icon: HeartCrack, color: 'bg-red-200' },
      { id: 'life', label: 'Main Attraction', icon: Star, color: 'bg-yellow-200' },
      { id: 'ghost', label: 'Leaving Early', icon: Ghost, color: 'bg-neutral-400' },
    ]
  },
  {
    id: 'hobby',
    title: 'Saturday afternoon POV?',
    options: [
      { id: 'gaming', label: 'Ranked Grinding', icon: Gamepad2, color: 'bg-purple-300' },
      { id: 'thrifting', label: 'Bin Diving', icon: Star, color: 'bg-amber-300' },
      { id: 'sleeping', label: 'Bed Rotting', icon: Moon, color: 'bg-indigo-100' },
      { id: 'creative', label: 'Side Hustle', icon: Palette, color: 'bg-pink-200' },
      { id: 'walking', label: 'Silly Little Walk', icon: Cloud, color: 'bg-sky-100' },
      { id: 'cafe', label: 'Cafe Hopping', icon: CoffeeIcon, color: 'bg-matcha' },
    ]
  },
  {
    id: 'snack',
    title: 'Emotional support snack?',
    options: [
      { id: 'hotchips', label: 'Spicy Chips', icon: Flame, color: 'bg-red-500 text-white' },
      { id: 'sushi', label: 'Sushi Platter', icon: Cat, color: 'bg-emerald-100' },
      { id: 'cookie', label: 'Target Cookies', icon: Sparkle, color: 'bg-pink-100' },
      { id: 'fruit', label: 'Frozen Grapes', icon: Sparkles, color: 'bg-purple-100' },
      { id: 'nugs', label: 'McNuggets', icon: Flame, color: 'bg-orange-200' },
      { id: 'matchapudding', label: 'Matcha Pudding', icon: Cat, color: 'bg-matcha' },
    ]
  },
  {
    id: 'tech',
    title: 'Screen time reality?',
    options: [
      { id: 'zen', label: 'Zen (2 hrs)', icon: Cloud, color: 'bg-sky-100' },
      { id: 'avg', label: 'Standard (5 hrs)', icon: Smartphone, color: 'bg-blue-100' },
      { id: 'high', label: 'Chronic (8 hrs)', icon: Laptop, color: 'bg-indigo-100' },
      { id: 'god', label: 'Terminally Online', icon: Dizzy, color: 'bg-red-100' },
      { id: 'scroll', label: 'Doom-scroller', icon: RefreshCw, color: 'bg-stone-300' },
      { id: 'touchgrass', label: 'Touched Grass Once', icon: Flower, color: 'bg-green-100' },
    ]
  },
  {
    id: 'pet',
    title: 'Soulmate animal?',
    options: [
      { id: 'cat', label: 'Orange Cat', icon: Cat, color: 'bg-orange-200' },
      { id: 'dog', label: 'Golden Retriever', icon: Sun, color: 'bg-yellow-200' },
      { id: 'turtle', label: 'Lazy Turtle', icon: Waves, color: 'bg-emerald-200' },
      { id: 'capy', label: 'Capybara Chill', icon: Spa, color: 'bg-stone-300' },
      { id: 'frog', label: 'Forrest Frog', icon: Cloud, color: 'bg-green-100' },
      { id: 'birb', label: 'Birb', icon: Music, color: 'bg-blue-100' },
    ]
  },
  {
    id: 'movie',
    title: 'Binge-watching era?',
    options: [
      { id: 'horror', label: 'Psych Horror', icon: Ghost, color: 'bg-black text-white' },
      { id: 'romcom', label: 'Delusional Romcom', icon: Heart, color: 'bg-pink-300' },
      { id: 'doc', label: 'True Crime', icon: Book, color: 'bg-stone-400' },
      { id: 'anime', label: 'Shonen Anime', icon: Flame, color: 'bg-orange-400' },
      { id: 'comfort', label: 'Sitcom Re-watch', icon: SmilePlus, color: 'bg-blue-200' },
      { id: 'mystery', label: 'Niche Mystery', icon: Sparkles, color: 'bg-indigo-400' },
    ]
  },
  {
    id: 'travel',
    title: 'Escape plan destination?',
    options: [
      { id: 'tokyo', label: 'Tokyo Vibes', icon: Zap, color: 'bg-fuchsia-300' },
      { id: 'bali', label: 'Bali Jungle', icon: Mountain, color: 'bg-emerald-400' },
      { id: 'nyc', label: 'NYC Chaos', icon: Plane, color: 'bg-blue-400' },
      { id: 'home', label: 'Staycation', icon: Sun, color: 'bg-stone-200' },
      { id: 'euro', label: 'Euro Summer', icon: Waves, color: 'bg-cyan-200' },
      { id: 'cabin', label: 'A-Frame Cabin', icon: Tent, color: 'bg-orange-300' },
    ]
  },
  {
    id: 'fashion',
    title: 'Footwear of choice?',
    options: [
      { id: 'j1', label: 'Jordan 1s', icon: Zap, color: 'bg-red-400' },
      { id: 'crocs', label: 'Crocs + Jibbitz', icon: SmilePlus, color: 'bg-green-200' },
      { id: 'boots', label: 'Doc Martens', icon: Mountain, color: 'bg-stone-800 text-white' },
      { id: 'slides', label: 'Cloud Slides', icon: Cloud, color: 'bg-stone-300' },
      { id: 'samba', label: 'Sambas', icon: Star, color: 'bg-neutral-100' },
      { id: 'feet', label: 'No Shoes (Barefoot)', icon: Waves, color: 'bg-sky-100' },
    ]
  },
  {
    id: 'text',
    title: 'Communication style?',
    options: [
      { id: 'slang', label: 'Slang (No Cap)', icon: Zap, color: 'bg-yellow-200' },
      { id: 'emoji', label: 'Emoji Spam', icon: SmilePlus, color: 'bg-pink-200' },
      { id: 'proper', label: 'Lowercase Only', icon: Book, color: 'bg-blue-100' },
      { id: 'voice', label: 'Voice Notes', icon: Music, color: 'bg-purple-200' },
      { id: 'react', label: 'Reactions Only', icon: Heart, color: 'bg-rose-100' },
      { id: 'ghost', label: 'Ghosts (Forgot)', icon: Ghost, color: 'bg-neutral-300' },
    ]
  },
  {
    id: 'stress',
    title: 'Coping mechanism?',
    options: [
      { id: 'gym', label: 'Lifting Heavy', icon: Flame, color: 'bg-orange-500' },
      { id: 'retail', label: 'Add to Cart', icon: Laptop, color: 'bg-blue-300' },
      { id: 'humor', label: 'Meme Therapy', icon: Ghost, color: 'bg-stone-200' },
      { id: 'music', label: 'Earbuds In', icon: Music, color: 'bg-indigo-300' },
      { id: 'cry', label: 'A Good Cry', icon: Cloud, color: 'bg-sky-100' },
      { id: 'yap', label: 'Yapping to Bestie', icon: SmilePlus, color: 'bg-green-200' },
    ]
  },
  {
    id: 'room',
    title: 'Interior design vibe?',
    options: [
      { id: 'max', label: 'Maximalist Chaos', icon: Palette, color: 'bg-red-200' },
      { id: 'min', label: 'Pinterest Minimal', icon: Cloud, color: 'bg-white' },
      { id: 'led', label: 'RGB LED Cave', icon: Gamepad2, color: 'bg-purple-500 text-white' },
      { id: 'jungle', label: 'Too Many Plants', icon: Flower, color: 'bg-green-500 text-white' },
      { id: 'vintage', label: 'Thrift Store Find', icon: Star, color: 'bg-amber-300' },
      { id: 'messy', label: 'Floordrobe', icon: Ghost, color: 'bg-stone-300' },
    ]
  },
  {
    id: 'future',
    title: 'The ultimate goal?',
    options: [
      { id: 'rich', label: 'Corporate Baddie', icon: Star, color: 'bg-yellow-400' },
      { id: 'happy', label: 'Peaceful Bliss', icon: Sun, color: 'bg-sky-200' },
      { id: 'famous', label: 'Main Character', icon: CameraIcon, color: 'bg-pink-400' },
      { id: 'impact', label: 'Saving the World', icon: Planet, color: 'bg-emerald-300' },
      { id: 'travel', label: 'Digital Nomad', icon: Laptop, color: 'bg-blue-300' },
      { id: 'simple', label: 'Living in Woods', icon: Tent, color: 'bg-orange-400' },
    ]
  },
  {
    id: 'humor',
    title: 'Sense of humor?',
    options: [
      { id: 'dry', label: 'Sarcastic/Dry', icon: Ghost, color: 'bg-stone-400' },
      { id: 'absurd', label: 'Gen Alpha Slang', icon: Dizzy, color: 'bg-green-400' },
      { id: 'dark', label: 'Dark/Existential', icon: HeartCrack, color: 'bg-black text-white' },
      { id: 'whole', label: 'Wholesome Memes', icon: Heart, color: 'bg-rose-200' },
      { id: 'loud', label: 'Loud/Energetic', icon: Zap, color: 'bg-yellow-300' },
      { id: 'silent', label: 'Internal Screaming', icon: Cloud, color: 'bg-sky-100' },
    ]
  },
  {
    id: 'lunch',
    title: 'Lunch today is...',
    options: [
      { id: 'bowl', label: 'Grain Bowl', icon: Flower, color: 'bg-matcha' },
      { id: 'pizza', label: 'Pizza Slice', icon: Pizza, color: 'bg-orange-300' },
      { id: 'iced', label: 'Iced Coffee Only', icon: CoffeeIcon, color: 'bg-stone-800 text-white' },
      { id: 'fast', label: 'Maccas Run', icon: Flame, color: 'bg-red-200' },
      { id: 'pasta', label: 'Carb Party', icon: SmilePlus, color: 'bg-yellow-100' },
      { id: 'left', label: 'Yesterday\'s Rain', icon: Ghost, color: 'bg-stone-200' },
    ]
  },
  {
    id: 'vibe',
    title: 'Current mood tier?',
    options: [
      { id: 'slay', label: 'Slaying 💅', icon: Sparkles, color: 'bg-pink-400' },
      { id: 'locked', label: 'Locked In 🔒', icon: Zap, color: 'bg-blue-500 text-white' },
      { id: 'delulu', label: 'Delusional ✨', icon: Cloud, color: 'bg-lavender' },
      { id: 'cooked', label: 'I\'m Cooked 💀', icon: Ghost, color: 'bg-stone-500 text-white' },
      { id: 'vibing', label: 'Just Vibing 🤙', icon: Waves, color: 'bg-sky-300' },
      { id: 'peak', label: 'Peak Form 📈', icon: Star, color: 'bg-yellow-200' },
    ]
  },
  {
    id: 'aura_final',
    title: 'Final check: The Aura',
    options: [
      { id: 'gold', label: 'Pure Gold', icon: Sun, color: 'bg-yellow-400' },
      { id: 'void', label: 'The Void', icon: Moon, color: 'bg-black text-white' },
      { id: 'chaos', label: 'Static Chaos', icon: Zap, color: 'bg-indigo-500 text-white' },
      { id: 'pink', label: 'Cloud Candy', icon: Heart, color: 'bg-rose-300' },
      { id: 'green', label: 'Nature Boy/Girl', icon: Flower, color: 'bg-emerald-400' },
      { id: 'blue', label: 'Blue Serenity', icon: Waves, color: 'bg-blue-300' },
    ]
  }
];

const Sticker = ({ emoji, top, left, delay, rot }: { emoji: string, top: string, left: string, delay: number, rot: number }) => (
  <motion.div
    initial={{ scale: 0, rotate: rot - 20 }}
    animate={{ scale: 1, rotate: rot }}
    className="sticker animate-float"
    style={{ top, left, '--rot': `${rot}deg` } as any}
    transition={{ delay, type: 'spring' }}
  >
    {emoji}
  </motion.div>
);

// Pixel Character Component with improved shading and details
const PixelAvatar = ({ traits }: { traits: any }) => {
  const skinColor = traits.skinColor || '#FFDBAC';
  const hairColor = traits.hairColor || '#4A2C2A';
  const shirtColor = traits.shirtColor || '#FF007F';
  const pantsColor = traits.pantsColor || '#2B2B2B';
  const shoeColor = traits.shoeColor || '#FFFFFF';

  // Helper for shading
  const shade = (hex: string, percent: number) => {
    const f = parseInt(hex.slice(1), 16),
          t = percent < 0 ? 0 : 255,
          p = percent < 0 ? percent * -1 : percent,
          R = f >> 16,
          G = (f >> 8) & 0x00FF,
          B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
  };

  const skinShade = shade(skinColor, -0.2);
  const hairShade = shade(hairColor, -0.3);
  const shirtShade = shade(shirtColor, -0.2);

  const getCellColor = (r: number, c: number) => {
    // Hair
    if (r >= 1 && r <= 10 && c >= 4 && c <= 15) {
      if ((r === 1 && (c < 7 || c > 12)) || (r === 2 && (c < 6 || c > 13))) return 'transparent';
      if (c === 5 || c === 14 || r === 2) return hairShade;
      return hairColor;
    }
    // Face
    if (r >= 5 && r <= 11 && c >= 6 && c <= 13) {
      // Eyes
      if (r === 8 && (c === 8 || c === 11)) return '#000000';
      if (r === 7 && (c === 8 || c === 11)) return '#000000'; // taller eyes
      // Blush
      if (r === 9 && (c === 7 || c === 12)) return '#ffb6c1';
      // Shading on side of face
      if (c === 6 || c === 13) return skinShade;
      return skinColor;
    }
    // Neck
    if (r === 12 && c >= 9 && c <= 10) return skinShade;
    
    // Body (Shirt)
    if (r >= 13 && r <= 23 && c >= 5 && c <= 14) {
      if (r === 13 && (c < 7 || c > 12)) return 'transparent';
      if (c === 5 || c === 14 || r === 23) return shirtShade;
      // Detail on shirt (pocket)
      if (r === 15 && c === 11) return shirtShade;
      return shirtColor;
    }
    // Arms (Skin)
    if (r >= 17 && r <= 22 && (c === 4 || c === 15)) return skinColor;
    if (r >= 21 && (c === 4 || c === 15)) return skinShade;
    
    // Pants
    if (r >= 24 && r <= 30) {
      if (c >= 6 && c <= 9) return c === 6 ? shade(pantsColor, -0.2) : pantsColor;
      if (c >= 10 && c <= 13) return c === 13 ? shade(pantsColor, -0.2) : pantsColor;
    }
    // Shoes
    if (r === 31 && ((c >= 5 && c <= 9) || (c >= 10 && c <= 14))) {
      if (c === 5 || c === 14) return shade(shoeColor, -0.1);
      return shoeColor;
    }

    return 'transparent';
  };

  const grid = useMemo(() => {
    const arr = [];
    for (let r = 0; r < 32; r++) {
      for (let c = 0; c < 20; c++) {
        arr.push({ r, c, color: getCellColor(r, c) });
      }
    }
    return arr;
  }, [traits]);

  return (
    <motion.div 
      animate={{ y: [0, -4, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      className="pixel-grid bg-white/20" 
      id="pixel-model"
    >
      {grid.map((cell, i) => (
        <div 
          key={i} 
          className="pixel-cell transition-colors duration-500" 
          style={{ backgroundColor: cell.color }} 
        />
      ))}
    </motion.div>
  );
};

export default function App() {
  const [step, setStep] = useState<'welcome' | 'interactive' | 'analyzing' | 'result' | 'pictorial'>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [analysis, setAnalysis] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [loadingText, setLoadingText] = useState("Consulting the stars...");

  const loadingMessages = [
    "Reading your aura...",
    "Mixing some matcha magic...",
    "Finding the right adjectives...",
    "Consulting the cute committee...",
    "Finalizing your radiance..."
  ];

  useEffect(() => {
    let interval: any;
    if (step === 'analyzing') {
      let index = 0;
      interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingText(loadingMessages[index]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleStart = () => {
    playSound('click');
    setStep('interactive');
  };

  const handleSelect = (optionId: string) => {
    playSound('pop');
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
    
    setTimeout(() => {
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setStep('analyzing');
      }
    }, 300);
  };

  const generateAnalysis = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        A Gen Z user answered 20 vibe questions.
        Results: ${JSON.stringify(answers)}
        
        Generate a "Digital Identity Dashboard" in Gen Z style.
        Provide a JSON response with:
        - title: Playful Gen Z title (e.g. "Tea-Sipping Protagonist", "Midnight Matcha Menace")
        - bio: 2-sentence summary using Gen Z slang.
        - auraStats: 4 key stats (Aura Points, Main Character Energy, Chaos Level, Chill Factor) as objects {name: string, val: string}.
        - auraColor: A soft background hex color that fits their vibe.
        - compatibilityTag: A fun short phrase.
        - emojiSticker: A main thematic emoji.
        - skinColor: Hex skin tone.
        - hairColor: Hex hair color.
        - shirtColor: Hex shirt color.
        - pantsColor: Hex pants color.
        - shoeColor: Hex shoe color.
        - motto: A cool Gen Z quote.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              bio: { type: Type.STRING },
              auraStats: { 
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { name: { type: Type.STRING }, val: { type: Type.STRING } }
                }
              },
              auraColor: { type: Type.STRING },
              compatibilityTag: { type: Type.STRING },
              emojiSticker: { type: Type.STRING },
              skinColor: { type: Type.STRING },
              hairColor: { type: Type.STRING },
              shirtColor: { type: Type.STRING },
              pantsColor: { type: Type.STRING },
              shoeColor: { type: Type.STRING },
              motto: { type: Type.STRING }
            }
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      playSound('reveal');
      setAnalysis(data);
      setStep('result');
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysis({
        title: "The Mystery Icon",
        bio: "You're too unique for the algorithm. A total enigma, no cap.",
        auraStats: [{name: "Aura", val: "Infinite"}, {name: "Protagonist", val: "Max"}, {name: "Chaos", val: "Level 1"}, {name: "Chill", val: "100%"}],
        auraColor: "#e5e7eb",
        compatibilityTag: "Legendary Tier",
        emojiSticker: "⚡",
        skinColor: "#FFDBAC", hairColor: "#1a1a1a", shirtColor: "#ff007f", pantsColor: "#00f2ff", shoeColor: "#ffffff",
        motto: "Born to slay, forced to rot."
      });
      setStep('result');
    }
  };

  useEffect(() => {
    if (step === 'analyzing') {
      generateAnalysis();
    }
  }, [step]);

  const reset = () => {
    setStep('welcome');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#fafaf9] relative overflow-hidden">
      {/* Dynamic Stickers */}
      <Sticker emoji="🎨" top="5%" left="10%" delay={0.1} rot={-15} />
      <Sticker emoji="🍵" top="85%" left="5%" delay={0.3} rot={12} />
      <Sticker emoji="✨" top="15%" right="10%" delay={0.2} rot={8} />
      <Sticker emoji="🍄" top="80%" right="8%" delay={0.4} rot={-10} />

      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="brutal-card max-w-xl w-full p-12 text-center bg-white z-10"
            id="welcome-card"
          >
            <div className="flex justify-center gap-4 mb-8">
              <Flower className="w-10 h-10 text-pink-400" />
              <SmilePlus className="w-10 h-10 text-blueberry" />
              <Cloud className="w-10 h-10 text-lavender" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-sans mb-6 uppercase leading-[0.9]">
              The Ultra <br /> <span className="text-pink-500">Vibe Check</span>
            </h1>
            
            <p className="text-ink/60 text-lg mb-10 font-medium font-sans">
              20 deep-cut questions to map your digital aura. 
              We'll generate a custom 500px pixel human based on your results.
            </p>

            <button 
              onClick={handleStart}
              className="brutal-button text-2xl w-full flex items-center justify-center gap-3"
              id="start-button"
            >
              START THE QUEST <Zap className="w-6 h-6 fill-yellow-400" />
            </button>
          </motion.div>
        )}

        {step === 'interactive' && (
          <motion.div
            key="interactive"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="brutal-card max-w-4xl w-full p-8 md:p-12 bg-white z-10"
            id="quiz-container"
          >
            <div className="flex items-center gap-4 mb-12">
              <div className="brutal-card h-10 w-12 flex items-center justify-center bg-lemon text-sm font-black">
                {currentQuestionIndex + 1}/20
              </div>
              <div className="flex-1 h-4 brutal-card p-0 overflow-hidden relative">
                <motion.div 
                  className="absolute inset-0 bg-ink"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="text-3xl md:text-5xl mb-12 text-center uppercase leading-tight font-black">
              {QUESTIONS[currentQuestionIndex].title}
            </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {QUESTIONS[currentQuestionIndex].options.map((option) => {
                const Icon = option.icon;
                const isSelected = answers[QUESTIONS[currentQuestionIndex].id] === option.id;
                
                return (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.05, rotate: isSelected ? 0 : 2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect(option.id)}
                    className={`brutal-card p-4 md:p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${isSelected ? 'bg-ink text-white invert-0' : option.color}`}
                    id={`option-${option.id}`}
                  >
                    <div className="brutal-card p-2 bg-white text-ink border-2">
                       <Icon className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <span className="text-sm md:text-lg font-black uppercase tracking-tighter text-center">{option.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center z-10"
            id="analyzing-state"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="mb-8 inline-block"
            >
              <RefreshCw className="w-24 h-24 text-ink" />
            </motion.div>
            <h2 className="text-4xl font-black uppercase mb-2 tracking-tighter">{loadingText}</h2>
            <div className="vibe-pill mx-auto mt-4 inline-block font-sans">Decoding your digital DNA...</div>
          </motion.div>
        )}

        {step === 'result' && analysis && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-6xl z-10 my-8"
            id="result-dashboard"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Pixel Human Column */}
              <div className="flex flex-col items-center gap-6">
                <div className="text-xs font-black uppercase tracking-[0.2em] bg-ink text-white px-4 py-2 brutal-card rounded-none">
                  Pixel Identity v1.0
                </div>
                <PixelAvatar traits={analysis} />
                <div className="brutal-card bg-lemon p-4 w-full text-center font-bold italic">
                  "{analysis.motto}"
                </div>
              </div>

              {/* Stats Column */}
              <div className="flex-1 space-y-6">
                <div className="brutal-card p-10 bg-white relative overflow-hidden">
                   <div className="absolute top-4 right-4 text-8xl opacity-10 pointer-events-none">
                    {analysis.emojiSticker}
                  </div>
                  <div className="vibe-pill mb-4 w-fit bg-pink-100 text-pink-600">{analysis.compatibilityTag}</div>
                  <h2 className="text-5xl md:text-7xl uppercase leading-[0.85] mb-6 font-black tracking-tighter">
                    {analysis.title}
                  </h2>
                  <p className="text-2xl text-ink font-sans leading-relaxed border-l-8 border-ink pl-6 py-2">
                    {analysis.bio}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {analysis.auraStats.map((stat: any, i: number) => (
                    <div key={i} className="brutal-card p-6 bg-white flex flex-col items-center justify-center gap-2">
                      <div className="text-[10px] font-black uppercase tracking-widest text-ink/40">{stat.name}</div>
                      <div className="text-2xl font-black text-pink-500 uppercase">{stat.val}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="brutal-card p-4 bg-white flex flex-col md:flex-row gap-4 items-center">
                    <input 
                      type="text" 
                      placeholder="ENTER YOUR NAME..." 
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="flex-1 w-full bg-transparent border-b-4 border-ink p-2 text-xl font-black uppercase focus:outline-none focus:border-pink-500 transition-colors"
                    />
                    <button 
                      onClick={() => {
                        if (!userName) return alert("Drop your name first, bestie! ✨");
                        playSound('twinkle');
                        setStep('pictorial');
                      }}
                      className="brutal-button bg-pink-500 w-full md:w-auto flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" /> PICTORIAL MODE
                    </button>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={reset}
                      className="brutal-button bg-white text-ink flex-1 flex items-center justify-center gap-3 text-xl"
                    >
                      <RefreshCw className="w-6 h-6" /> NEW RUN
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'pictorial' && analysis && (
          <motion.div
            key="pictorial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-[#fafaf9] flex flex-col items-center justify-center p-4"
          >
            <div className="brutal-card bg-white p-8 max-w-2xl w-full flex flex-col items-center gap-8 relative overflow-hidden" id="snapshot-frame">
              {/* Background accent */}
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{ backgroundColor: analysis.auraColor }}
              />
              
              <div className="flex flex-col items-center gap-2 z-10">
                <div className="vibe-pill bg-ink text-white">Digital Identity Card</div>
                <h2 className="text-4xl md:text-6xl font-black uppercase text-center">{userName || 'VIBE ICON'}</h2>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center z-10 w-full justify-center">
                <div className="scale-125">
                  <PixelAvatar traits={analysis} />
                </div>
                <div className="space-y-4 flex-1 w-full">
                  <div className="brutal-card p-6 bg-lemon">
                    <div className="text-xs font-black uppercase opacity-40 mb-2">Vibe Title</div>
                    <div className="text-2xl font-black uppercase leading-tight italic">{analysis.title}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {analysis.auraStats.slice(0, 4).map((stat: any, i: number) => (
                      <div key={i} className="brutal-card p-3 bg-white flex flex-col items-center justify-center border-2">
                        <div className="text-[8px] font-black uppercase opacity-40">{stat.name}</div>
                        <div className="text-sm font-black">{stat.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full text-center z-10 border-t-4 border-ink pt-6 flex justify-between items-end">
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase">Identity Verified</div>
                  <div className="text-xs font-mono font-bold">SHA-VIBE-{Math.floor(Math.random() * 9000 + 1000)}</div>
                </div>
                <div className="text-6xl">{analysis.emojiSticker}</div>
              </div>
            </div>

            <div className="mt-8 flex gap-4 no-print">
              <button 
                onClick={() => setStep('result')}
                className="brutal-button bg-white text-ink flex items-center gap-2"
              >
                <ArrowRight className="w-5 h-5 rotate-180" /> BACK
              </button>
              <button 
                onClick={() => {
                  window.print();
                }}
                className="brutal-button bg-ink text-white flex items-center gap-2"
              >
                <Camera className="w-5 h-5" /> PRINT / SAVE
              </button>
            </div>
            
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-ink/30 no-print animate-pulse">
              📸 Screen shot this area for your story
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Home(props: any) {
  return <Sun {...props} />;
}
