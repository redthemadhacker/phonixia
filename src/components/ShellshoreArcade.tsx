import React, { useState } from 'react';
import { useGame, getCompanionGuide } from '../context/GameContext';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';
import { 
  ArrowLeft, Volume2, RotateCcw, 
  Flame, CheckCircle2, X, Play, Coins, Star
} from 'lucide-react';

interface ShellshoreArcadeProps {
  onBackToWorld: () => void;
}

export interface ArcadeGameDef {
  id: string;
  gameNum: number;
  name: string;
  arcadeCabinet: string;
  icon: string;
  skill: string;
  mechanicType: 'slingshot' | 'whack' | 'conveyor' | 'bubble-pop' | 'basket-catch';
  howToPlay: string;
  targetPhoneme: string;
  soundCue: string;
  options: string[];
  correct: string;
  explanation: string;
}

export const SHELLSHORE_25_GAMES: ArcadeGameDef[] = [
  { id: 'ssa-26', gameNum: 26, name: 'Coral Slingshot', arcadeCabinet: 'Neptune Cannon', icon: '🎯', skill: 'Short /a/', mechanicType: 'slingshot', howToPlay: 'Launch the cannon at the target making the pure /æ/ sound!', targetPhoneme: '/æ/', soundCue: 'aaa as in cat', options: ['CAT', 'COT', 'CUT', 'CIT'], correct: 'CAT', explanation: '/æ/ is the short a vowel in cat!' },
  { id: 'ssa-27', gameNum: 27, name: 'Crabby Whack', arcadeCabinet: 'Crab Mallet', icon: '🦀', skill: 'Initial /b/', mechanicType: 'whack', howToPlay: 'Whack the scurrying crab making the pure unvoiced /b/ sound!', targetPhoneme: '/b/', soundCue: 'b', options: ['BAT', 'PAT', 'MAT', 'SAT'], correct: 'BAT', explanation: '/b/ leads the word bat!' },
  { id: 'ssa-28', gameNum: 28, name: 'Conveyor Sorter', arcadeCabinet: 'Steam Conveyor', icon: '📦', skill: 'Ending /t/', mechanicType: 'conveyor', howToPlay: 'Sort the crates ending with the crisp stop /t/ sound!', targetPhoneme: '/t/', soundCue: 't', options: ['HAT', 'HAM', 'HAD', 'HAS'], correct: 'HAT', explanation: '/t/ crisply stops the word hat!' },
  { id: 'ssa-29', gameNum: 29, name: 'Abyssal Bubble Pop', arcadeCabinet: 'Bubble Sphere', icon: '🫧', skill: 'Short /o/', mechanicType: 'bubble-pop', howToPlay: 'Pop the bubble containing the open vowel sound /ɒ/!', targetPhoneme: '/ɒ/', soundCue: 'ah as in fox and dog', options: ['FOX', 'FIX', 'FAX', 'FEW'], correct: 'FOX', explanation: '/f/ /ɒ/ /ks/ spells fox!' },
  { id: 'ssa-30', gameNum: 30, name: 'Seashell Basket Catch', arcadeCabinet: 'Pearl Basket', icon: '🧺', skill: 'Digraph /sh/', mechanicType: 'basket-catch', howToPlay: 'Catch the falling seashell bearing the soft quiet /ʃ/ digraph!', targetPhoneme: '/ʃ/', soundCue: 'shhh', options: ['SHIP', 'CHIP', 'WHIP', 'TRIP'], correct: 'SHIP', explanation: 'S and H combine to make the unvoiced /ʃ/ sound!' },
  { id: 'ssa-31', gameNum: 31, name: 'Tidepool Slingshot', arcadeCabinet: 'Starfish Catapult', icon: '⭐', skill: 'Short /i/', mechanicType: 'slingshot', howToPlay: 'Slingshot the pearl into the /ɪ/ short vowel oyster!', targetPhoneme: '/ɪ/', soundCue: 'ih as in pig', options: ['PIG', 'PUG', 'PEG', 'PAG'], correct: 'PIG', explanation: '/ɪ/ forms the middle sound of pig!' },
  { id: 'ssa-32', gameNum: 32, name: 'Gull Whack-A-Mole', arcadeCabinet: 'Pier Perch', icon: '🪶', skill: 'Initial /m/', mechanicType: 'whack', howToPlay: 'Tap the seagull singing the hummed /m/ nasal phoneme!', targetPhoneme: '/m/', soundCue: 'mmm', options: ['MUG', 'BUG', 'JUG', 'RUG'], correct: 'MUG', explanation: '/m/ begins the word mug!' },
  { id: 'ssa-33', gameNum: 33, name: 'Cargo Belt Runner', arcadeCabinet: 'Derrick Gear', icon: '⚙️', skill: 'Ending /g/', mechanicType: 'conveyor', howToPlay: 'Pick the cargo box that ends with the voiced velar stop /g/!', targetPhoneme: '/g/', soundCue: 'g', options: ['DOG', 'DOT', 'DON', 'DOB'], correct: 'DOG', explanation: 'Dog ends with the voiced velar /g/ sound!' },
  { id: 'ssa-34', gameNum: 34, name: 'Seafoam Bubble Burst', arcadeCabinet: 'Hydro Vault', icon: '🌊', skill: 'Short /e/', mechanicType: 'bubble-pop', howToPlay: 'Burst the bubble carrying the open-mid vowel /ɛ/!', targetPhoneme: '/ɛ/', soundCue: 'eh as in bed', options: ['BED', 'BAD', 'BUD', 'BID'], correct: 'BED', explanation: '/b/ /ɛ/ /d/ spells bed!' },
  { id: 'ssa-35', gameNum: 35, name: 'Pelican Pearl Basket', arcadeCabinet: 'Pelican Beak', icon: '🦤', skill: 'Digraph /ch/', mechanicType: 'basket-catch', howToPlay: 'Catch the chime tile carrying the voiceless affricate /tʃ/!', targetPhoneme: '/tʃ/', soundCue: 'ch as in chin', options: ['CHIN', 'SHIN', 'THIN', 'WIN'], correct: 'CHIN', explanation: 'C and H bond to make the /tʃ/ sound in chin!' },
  { id: 'ssa-36', gameNum: 36, name: 'Anchor Drop Slingshot', arcadeCabinet: 'Iron Winch', icon: '⚓', skill: 'Short /u/', mechanicType: 'slingshot', howToPlay: 'Drop the anchor directly into the central short vowel /ʌ/!', targetPhoneme: '/ʌ/', soundCue: 'uh as in sun', options: ['SUN', 'SIN', 'SON', 'SAN'], correct: 'SUN', explanation: '/s/ /ʌ/ /n/ blends into sun!' },
  { id: 'ssa-37', gameNum: 37, name: 'Octopus Whack', arcadeCabinet: 'Tentacle Tap', icon: '🐙', skill: 'Initial /s/', mechanicType: 'whack', howToPlay: 'Boop the octopus tentacle holding the continuous fricative /s/!', targetPhoneme: '/s/', soundCue: 'sss like a snake', options: ['SIT', 'FIT', 'HIT', 'LIT'], correct: 'SIT', explanation: '/s/ hiss begins sit!' },
  { id: 'ssa-38', gameNum: 38, name: 'Kelp Factory Sorter', arcadeCabinet: 'Tangle Press', icon: '🌿', skill: 'Ending /d/', mechanicType: 'conveyor', howToPlay: 'Route the bundle stopping on the voiced alveolar /d/!', targetPhoneme: '/d/', soundCue: 'd', options: ['RED', 'REN', 'RET', 'REB'], correct: 'RED', explanation: 'Red ends with /d/!' },
  { id: 'ssa-39', gameNum: 39, name: 'Jellyfish Bubble Lamp', arcadeCabinet: 'Glow Lagoon', icon: '🪼', skill: 'Digraph /th/ (Unvoiced)', mechanicType: 'bubble-pop', howToPlay: 'Pop the jellyfish glowing with the breathy /θ/ sound!', targetPhoneme: '/θ/', soundCue: 'thhh with tongue between teeth', options: ['THUMB', 'CHUM', 'DRUM', 'PLUM'], correct: 'THUMB', explanation: 'Thumb starts with the unvoiced /θ/ sound!' },
  { id: 'ssa-40', gameNum: 40, name: 'Sunken Chest Drop', arcadeCabinet: 'Gold Vault', icon: '💎', skill: 'Digraph /ck/', mechanicType: 'basket-catch', howToPlay: 'Catch the heavy gold coin ending in the clean stop /k/!', targetPhoneme: '/k/', soundCue: 'k ending', options: ['DUCK', 'DUSK', 'DUST', 'DUMP'], correct: 'DUCK', explanation: 'C and K fuse at the end of short vowel words like duck!' },
  { id: 'ssa-41', gameNum: 41, name: 'Lobster Pot Slingshot', arcadeCabinet: 'Buoy Launcher', icon: '🦞', skill: 'L-Blend /bl/', mechanicType: 'slingshot', howToPlay: 'Launch a buoy into the initial blend /bl/ target!', targetPhoneme: '/bl/', soundCue: 'b-l blended together', options: ['BLIP', 'SLIP', 'FLIP', 'CLIP'], correct: 'BLIP', explanation: 'B and L blend together into blip!' },
  { id: 'ssa-42', gameNum: 42, name: 'Sea Turtle Mole Tap', arcadeCabinet: 'Shell Tap', icon: '🐢', skill: 'R-Blend /gr/', mechanicType: 'whack', howToPlay: 'Tap the turtle shell presenting the blend /ɡr/!', targetPhoneme: '/ɡr/', soundCue: 'g-r', options: ['GRAB', 'CRAB', 'TRAP', 'BRAG'], correct: 'GRAB', explanation: 'G and R blend smoothly in grab!' },
  { id: 'ssa-43', gameNum: 43, name: 'Salt Factory Conveyor', arcadeCabinet: 'Crystallizer', icon: '🧂', skill: 'S-Blend /st/', mechanicType: 'conveyor', howToPlay: 'Direct the salt block featuring the blend /st/!', targetPhoneme: '/st/', soundCue: 's-t', options: ['STOP', 'SHOP', 'CHOP', 'DROP'], correct: 'STOP', explanation: 'S and T blend to start stop!' },
  { id: 'ssa-44', gameNum: 44, name: 'Pearl Diver Bubble Float', arcadeCabinet: 'Diver Tank', icon: '🤿', skill: 'Glided /w/', mechanicType: 'bubble-pop', howToPlay: 'Release the diver bubble starting with the glide /w/!', targetPhoneme: '/w/', soundCue: 'w', options: ['WET', 'VET', 'MET', 'SET'], correct: 'WET', explanation: 'Wet begins with the labio-velar glide /w/!' },
  { id: 'ssa-45', gameNum: 45, name: 'Sailor Net Catch', arcadeCabinet: 'Sail Rigging', icon: '⛵', skill: 'Ending Blend /nk/', mechanicType: 'basket-catch', howToPlay: 'Swing the rigging net to catch the ending nasal blend /ŋk/!', targetPhoneme: '/ŋk/', soundCue: 'ng-k as in pink', options: ['PINK', 'PICK', 'PIN', 'PIG'], correct: 'PINK', explanation: 'N and K join at the end of pink!' },
  { id: 'ssa-46', gameNum: 46, name: 'Harpoon Slingshot', arcadeCabinet: 'Whaler Spire', icon: '🔱', skill: 'Ending Blend /nd/', mechanicType: 'slingshot', howToPlay: 'Spear the floating barrel that ends with /nd/!', targetPhoneme: '/nd/', soundCue: 'n-d', options: ['SAND', 'SAD', 'SANK', 'SACK'], correct: 'SAND', explanation: 'Sand finishes with the voiced cluster /nd/!' },
  { id: 'ssa-47', gameNum: 47, name: 'Sea Urchin Whack', arcadeCabinet: 'Spike Pit', icon: '🦔', skill: 'Ending Blend /mp/', mechanicType: 'whack', howToPlay: 'Tap the safe sea urchin ending with the bilabial blend /mp/!', targetPhoneme: '/mp/', soundCue: 'm-p', options: ['JUMP', 'JUNK', 'JUST', 'JUG'], correct: 'JUMP', explanation: 'Jump concludes with the /mp/ blend!' },
  { id: 'ssa-48', gameNum: 48, name: 'Lighthouse Conveyor', arcadeCabinet: 'Prism Beam', icon: '🚨', skill: 'Magic Silent E (a_e)', mechanicType: 'conveyor', howToPlay: 'Filter the lens turning short /æ/ into the long name /eɪ/!', targetPhoneme: '/eɪ/', soundCue: 'long a as in cake', options: ['CAKE', 'CAN', 'CAP', 'CAT'], correct: 'CAKE', explanation: 'Magic E reaches over to make the A say its name in cake!' },
  { id: 'ssa-49', gameNum: 49, name: 'Coral Reef Bubble Pop', arcadeCabinet: 'Reef Sphere', icon: '🪸', skill: 'Magic Silent E (i_e)', mechanicType: 'bubble-pop', howToPlay: 'Pop the luminous bubble that contains the long vowel /aɪ/!', targetPhoneme: '/aɪ/', soundCue: 'long i as in kite', options: ['KITE', 'KIT', 'KID', 'KIN'], correct: 'KITE', explanation: 'Silent E transforms kit into kite!' },
  { id: 'ssa-50', gameNum: 50, name: 'Golden Kraken Grand Vault', arcadeCabinet: 'Kraken Shrine', icon: '🦑', skill: 'Master CVC Blending', mechanicType: 'basket-catch', howToPlay: 'Catch the ancient trident that blends the isolated sounds /f/ /ɒ/ /ks/!', targetPhoneme: '/f/ /ɒ/ /ks/', soundCue: 'fff - ah - ksss', options: ['FOX', 'BOX', 'SIX', 'FIX'], correct: 'FOX', explanation: '/f/ /ɒ/ /ks/ blends into the word fox!' }
];

export const ShellshoreArcade: React.FC<ShellshoreArcadeProps> = ({ onBackToWorld }) => {
  const { activeExplorer, awardCurrency } = useGame();
  const companionGuide = getCompanionGuide(activeExplorer);

  const [activeGame, setActiveGame] = useState<ArcadeGameDef | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);

  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const launchCabinet = (game: ArcadeGameDef) => {
    setActiveGame(game);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    sounds.playJump();
    sounds.speakPhonicsSlow(game.soundCue);
  };

  const handleChoice = (opt: string) => {
    if (!activeGame || isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const win = opt.trim().toLowerCase() === activeGame.correct.trim().toLowerCase();
    setIsCorrect(win);

    if (win) {
      sounds.playSuccess();
      awardCurrency(8, 2);
      setStreak(s => s + 1);
    } else {
      sounds.playError();
      sounds.speak('Try again!');
    }
  };

  const handleNextGameInContinuousLoop = () => {
    if (!activeGame) return;
    const nextIdx = (activeGame.gameNum - 26 + 1) % 25;
    const nextGame = SHELLSHORE_25_GAMES[nextIdx];
    launchCabinet(nextGame);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col justify-between overflow-hidden select-none">
      {/* Top Header */}
      <div className="p-3 bg-slate-900 border-b border-amber-500/40 flex items-center justify-between z-30">
        <button
          onClick={onBackToWorld}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-xs cursor-pointer shadow flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Citadel Map</span>
        </button>

        <div className="text-center">
          <div className="text-xs font-mono font-black text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1">
            <span>SHELLSHORE ARCADE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <h1 className="text-sm sm:text-base font-black text-amber-200 font-display">
            25 Unlocked Arcade Cabinets
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>{activeExplorer.coins} Coins</span>
        </div>
      </div>

      {/* Mario Overworld Dot Map Canvas */}
      <div className="relative flex-1 w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-amber-950/40 p-4">
        {/* Connecting SVG Path Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-50">
          <polyline
            points={SHELLSHORE_25_GAMES.map((_, idx) => {
              const row = Math.floor(idx / 5);
              const col = idx % 5;
              const xNorm = row % 2 === 0 ? col : 4 - col;
              const x = 12 + xNorm * 19;
              const y = 14 + row * 18;
              return `${x}%,${y}%`;
            }).join(' ')}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3.5"
            strokeDasharray="6 4"
          />
        </svg>

        {/* 25 Mario Level Dots */}
        {SHELLSHORE_25_GAMES.map((game, idx) => {
          const row = Math.floor(idx / 5);
          const col = idx % 5;
          const xNorm = row % 2 === 0 ? col : 4 - col;
          const x = 12 + xNorm * 19;
          const y = 14 + row * 18;
          const isHovered = hoveredNode === game.gameNum;

          return (
            <div
              key={game.id}
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setHoveredNode(game.gameNum)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => launchCabinet(game)}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            >
              {/* Lil Black Mario Dot */}
              <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black border-2 border-amber-400 hover:scale-130 shadow-[0_0_12px_rgba(245,158,11,0.6)] flex items-center justify-center transition-all">
                <span className="text-[11px] sm:text-xs">{game.icon}</span>
              </div>

              {/* Bouncy Hover Banner */}
              {isHovered && (
                <div className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-slate-950/95 border-2 border-amber-400 px-2.5 py-1.5 rounded-xl shadow-2xl z-40 whitespace-nowrap text-center animate-fade-in pointer-events-none">
                  <div className="text-[11px] font-black text-amber-200">
                    #{game.gameNum} {game.name}
                  </div>
                  <div className="text-[9px] font-bold text-slate-400">
                    {game.skill} · Free Play Unlocked
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Info HUD */}
      <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-slate-400">
        <span>🎮 Free Continuous Arcade Play</span>
        <div className="flex items-center gap-2">
          <span>Companion:</span>
          <b className="text-amber-300">{companionGuide.name}</b>
        </div>
      </div>

      {/* ACTIVE ARCADE CABINET MODAL */}
      {activeGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md select-none animate-fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border-4 border-amber-400 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(245,158,11,0.5)] flex flex-col space-y-4 animate-scale-up text-center">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{activeGame.icon}</span>
                <div className="text-left">
                  <h2 className="text-sm sm:text-base font-black text-amber-200 font-display">
                    #{activeGame.gameNum} {activeGame.name}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold">
                    Cabinet: {activeGame.arcadeCabinet} · {activeGame.skill}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-black">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{streak} Streak</span>
                </div>
                <button
                  onClick={() => setActiveGame(null)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {activeGame.howToPlay}
              </p>

              <div className="inline-flex items-center gap-3 bg-amber-500/20 border-2 border-amber-400 px-6 py-2.5 rounded-2xl shadow-inner animate-pulse">
                <span className="text-2xl sm:text-3xl font-black text-amber-200 font-display tracking-widest">
                  {activeGame.targetPhoneme}
                </span>
                <button
                  type="button"
                  onClick={() => sounds.speakPhonicsSlow(activeGame.soundCue)}
                  className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md cursor-pointer transition-transform hover:scale-110 active:scale-95"
                >
                  <Volume2 className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            <div className="relative h-44 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-amber-950/60 border-2 border-amber-500/40 p-4 flex flex-col justify-between overflow-hidden">
              <div className="text-[10px] font-mono text-amber-300/80 font-bold flex items-center justify-between">
                <span>MECHANIC: {activeGame.mechanicType.toUpperCase()}</span>
                <span>COMPANION: {companionGuide.name}</span>
              </div>

              <div className="grid grid-cols-4 gap-2 z-10">
                {activeGame.options.map((opt) => {
                  const isSelected = selectedOption === opt;
                  let style = 'bg-slate-900 hover:bg-amber-950/80 border-slate-700 text-slate-200';

                  if (isAnswered) {
                    if (opt.toLowerCase() === activeGame.correct.toLowerCase()) {
                      style = 'bg-emerald-600 border-emerald-300 text-white font-black scale-105 shadow-[0_0_20px_rgba(16,185,129,0.8)]';
                    } else if (isSelected) {
                      style = 'bg-rose-900 border-rose-500 text-rose-200';
                    } else {
                      style = 'bg-slate-950 border-slate-800 text-slate-600 opacity-40';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleChoice(opt)}
                      disabled={isAnswered}
                      className={`py-3.5 rounded-xl border-2 text-sm sm:text-base font-black font-display tracking-wider transition-all cursor-pointer ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-3">
                <AvatarRenderer customization={activeExplorer.customization} size={42} showPet={true} />
                <AvatarRenderer customization={companionGuide.customization} size={36} showPet={false} />
              </div>
            </div>

            {isAnswered && (
              <div className={`p-3 rounded-2xl border text-center space-y-2 animate-fade-in ${
                isCorrect ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200' : 'bg-rose-950/80 border-rose-400 text-rose-200'
              }`}>
                <div className="text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Sound Match! +8 Coins &amp; +2 Tokens</span>
                    </>
                  ) : (
                    <span>Not Quite! Listen closely to the segmented sound!</span>
                  )}
                </div>
                <p className="text-xs text-slate-200">
                  {isCorrect ? activeGame.explanation : 'Remember: isolated sounds blend into the full word!'}
                </p>

                <div className="flex justify-center gap-2 pt-1">
                  {!isCorrect ? (
                    <button
                      onClick={() => {
                        setIsAnswered(false);
                        setSelectedOption(null);
                        sounds.speakPhonicsSlow(activeGame.soundCue);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Try Again</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleNextGameInContinuousLoop}
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow cursor-pointer transition-transform hover:scale-105 active:scale-95 flex items-center gap-1"
                    >
                      <span>Next Cabinet ➔</span>
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};