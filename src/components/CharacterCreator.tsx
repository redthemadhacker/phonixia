import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CharacterCustomization } from '../types/character';
import { AvatarRenderer } from './AvatarRenderer';
import { Sparkles, Check, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CharacterCreatorProps {
  onClose: () => void;
}

const SKIN_TONES = ['#fcd34d', '#fde047', '#fed7aa', '#fbcfe8', '#d97706', '#92400e', '#78350f', '#451a03'];
const HAIR_COLORS = ['#1e293b', '#78350f', '#b45309', '#f59e0b', '#dc2626', '#4338ca', '#059669', '#ffffff'];

const HAIR_STYLES: { id: CharacterCustomization['hairStyle']; label: string }[] = [
  { id: 'spiky', label: 'Spiky' },
  { id: 'curly', label: 'Curly' },
  { id: 'wavy', label: 'Wavy' },
  { id: 'afro', label: 'Afro' },
  { id: 'braids', label: 'Braids' },
  { id: 'short', label: 'Short' },
  { id: 'explorer-bun', label: 'Top Bun' }
];

const OUTFITS: { id: CharacterCustomization['outfit']; label: string; desc: string }[] = [
  { id: 'ranger-vest', label: 'Ranger Vest', desc: 'Sturdy green & gold explorer straps' },
  { id: 'phoenix-cloak', label: 'Phoenix Cloak', desc: 'Blazing flame silk woven in Phoenix Keep' },
  { id: 'scholar-robe', label: 'Scholar Robe', desc: 'Imperial blue robe with golden sash' },
  { id: 'safari-suit', label: 'Safari Suit', desc: 'Rugged desert khaki with supply pockets' },
  { id: 'cyber-tunic', label: 'Cyber Tunic', desc: 'Neon cyan tech threads for modern explorers' }
];

const HEADGEARS: { id: CharacterCustomization['headgear']; label: string }[] = [
  { id: 'explorer-hat', label: 'Explorer Fedora' },
  { id: 'phoenix-crown', label: 'Phoenix Crown' },
  { id: 'pilot-goggles', label: 'Pilot Goggles' },
  { id: 'bandana', label: 'Flame Bandana' },
  { id: 'cap', label: 'Adventure Cap' },
  { id: 'none', label: 'No Headgear' }
];

const COMPANIONS: { id: CharacterCustomization['companionPet']; label: string; icon: string; lore: string }[] = [
  { id: 'phoenix-chick', label: 'Phoenix Chick', icon: '🔥', lore: 'Sparks flame warmth when reading tricky sounds' },
  { id: 'clever-fox', label: 'Clever Fox', icon: '🦊', lore: 'Sniffs out hidden sight words on Tricky Trails' },
  { id: 'golden-eagle', label: 'Golden Eagle', icon: '🦅', lore: 'Glides high across Whispering Peaks vowel glaciers' },
  { id: 'coral-turtle', label: 'Coral Turtle', icon: '🐢', lore: 'Swims calmly through Sound Shallows rhythm waters' },
  { id: 'gem-golem', label: 'Gem Golem', icon: '💎', lore: 'Chisels sturdy CVC stone in Builders Guild' }
];

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onClose }) => {
  const { activeExplorer, updateExplorerCustomization } = useGame();
  const [custom, setCustom] = useState<CharacterCustomization>({ ...activeExplorer.customization });
  const [activeTab, setActiveTab] = useState<'style' | 'outfit' | 'pet'>('style');

  const handleSave = () => {
    updateExplorerCustomization(custom);
    sounds.playFanfare();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">✨</span>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-display">
                Explorer Studio · {activeExplorer.name}
              </h2>
              <p className="text-xs text-slate-400">
                Customize your phonics adventurer and companion pet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body: Avatar Preview Left + Customization Tabs Right */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Preview Card */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center">
            <div className="relative p-6 rounded-full bg-radial from-amber-500/20 via-slate-900 to-transparent flex items-center justify-center mb-3">
              <AvatarRenderer customization={custom} size={110} isWalking={true} showPet={true} />
            </div>
            <h3 className="text-sm font-bold text-slate-100 font-game">
              {activeExplorer.name}
            </h3>
            <span className="text-xs text-amber-400 font-medium">
              {custom.title}
            </span>
            <div className="mt-4 text-[11px] text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              Companion: <b className="text-slate-200 capitalize">{custom.companionPet.replace('-', ' ')}</b>
            </div>
          </div>

          {/* Right Tabs & Controls */}
          <div className="md:col-span-8 space-y-4">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('style')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'style' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hair & Skin
              </button>
              <button
                onClick={() => setActiveTab('outfit')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'outfit' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Outfit & Gear
              </button>
              <button
                onClick={() => setActiveTab('pet')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'pet' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Companion Pet
              </button>
            </div>

            {/* Tab 1: Hair & Skin */}
            {activeTab === 'style' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">Skin Complexion</label>
                  <div className="flex flex-wrap gap-2">
                    {SKIN_TONES.map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          setCustom(c => ({ ...c, skinTone: color }));
                          sounds.playStep();
                        }}
                        style={{ backgroundColor: color }}
                        className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                          custom.skinTone === color ? 'border-white scale-110 shadow-md' : 'border-transparent hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">Hair Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {HAIR_STYLES.map(style => (
                      <button
                        key={style.id}
                        onClick={() => {
                          setCustom(c => ({ ...c, hairStyle: style.id }));
                          sounds.playStep();
                        }}
                        className={`p-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                          custom.hairStyle === style.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">Hair Color</label>
                  <div className="flex flex-wrap gap-2">
                    {HAIR_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          setCustom(c => ({ ...c, hairColor: color }));
                          sounds.playStep();
                        }}
                        style={{ backgroundColor: color }}
                        className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                          custom.hairColor === color ? 'border-white scale-110 shadow-md' : 'border-transparent hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Outfit & Gear */}
            {activeTab === 'outfit' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">Explorer Outfit</label>
                  <div className="space-y-2">
                    {OUTFITS.map(outfit => (
                      <button
                        key={outfit.id}
                        onClick={() => {
                          setCustom(c => ({ ...c, outfit: outfit.id }));
                          sounds.playStep();
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          custom.outfit === outfit.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">{outfit.label}</div>
                          <div className="text-[11px] text-slate-400">{outfit.desc}</div>
                        </div>
                        {custom.outfit === outfit.id && <Check className="w-4 h-4 text-amber-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">Headgear</label>
                  <div className="grid grid-cols-3 gap-2">
                    {HEADGEARS.map(gear => (
                      <button
                        key={gear.id}
                        onClick={() => {
                          setCustom(c => ({ ...c, headgear: gear.id }));
                          sounds.playStep();
                        }}
                        className={`p-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                          custom.headgear === gear.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {gear.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Companion Pet */}
            {activeTab === 'pet' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 block mb-1">Select Faithful Companion</label>
                {COMPANIONS.map(pet => (
                  <button
                    key={pet.id}
                    onClick={() => {
                      setCustom(c => ({ ...c, companionPet: pet.id }));
                      sounds.playStep();
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      custom.companionPet === pet.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{pet.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs font-bold">{pet.label}</div>
                      <div className="text-[11px] text-slate-400">{pet.lore}</div>
                    </div>
                    {custom.companionPet === pet.id && <Check className="w-4 h-4 text-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setCustom({ ...activeExplorer.customization })}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Changes
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg cursor-pointer"
            >
              Save Explorer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
