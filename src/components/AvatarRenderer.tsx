import React from 'react';
import { AvatarCustomization } from '../types/character';

interface AvatarRendererProps {
  customization?: AvatarCustomization;
  size?: number;
  facing?: 'left' | 'right' | 'down' | 'up';
  isWalking?: boolean;
  isRunning?: boolean;
  walkCycle?: number;
  showPet?: boolean;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  customization,
  size = 64,
  facing = 'down',
  isWalking = false,
  isRunning = false,
  walkCycle = 0,
  showPet = true,
}) => {
  const skin = customization?.skinTone || '#ffd1a4';
  const hairStyle = customization?.hairStyle || 'curls';
  const hairColor = customization?.hairColor || '#3d2314';
  const outfitStyle = customization?.outfitStyle || 'ranger';
  const outfitColor = customization?.outfitColor || '#3b82f6';
  const accessory = customization?.accessory || 'none';
  const companion = customization?.companionPet || 'baby-dragon';

  // Walk bob & stride offsets
  const bobY = isWalking ? Math.sin(walkCycle * 2) * (isRunning ? 3.5 : 2) : 0;
  const leftLegRot = isWalking ? Math.sin(walkCycle) * (isRunning ? 26 : 16) : 0;
  const rightLegRot = isWalking ? -Math.sin(walkCycle) * (isRunning ? 26 : 16) : 0;
  const leftArmRot = isWalking ? -Math.sin(walkCycle) * (isRunning ? 28 : 18) : 0;
  const rightArmRot = isWalking ? Math.sin(walkCycle) * (isRunning ? 28 : 18) : 0;

  const isFlipped = facing === 'left';

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{
        width: size,
        height: size,
        transform: isFlipped ? 'scaleX(-1)' : 'none',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        style={{ transform: `translateY(${bobY}px)` }}
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* --- SHADOW --- */}
        <ellipse cx="50" cy="94" rx="20" ry="5" fill="#000000" opacity="0.28" />

        {/* --- LEGS --- */}
        <g id="legs">
          {/* Left Leg */}
          <g style={{ transform: `rotate(${leftLegRot}deg)`, transformOrigin: '42px 72px' }}>
            <rect x="37" y="72" width="9" height="18" rx="4.5" fill="#1e293b" />
            <ellipse cx="41.5" cy="90" rx="6" ry="3.5" fill="#0f172a" />
          </g>

          {/* Right Leg */}
          <g style={{ transform: `rotate(${rightLegRot}deg)`, transformOrigin: '58px 72px' }}>
            <rect x="54" y="72" width="9" height="18" rx="4.5" fill="#1e293b" />
            <ellipse cx="58.5" cy="90" rx="6" ry="3.5" fill="#0f172a" />
          </g>
        </g>

        {/* --- BACK HAIR (for long styles) --- */}
        {hairStyle === 'braids' && (
          <g fill={hairColor}>
            <rect x="23" y="42" width="8" height="24" rx="4" />
            <rect x="69" y="42" width="8" height="24" rx="4" />
            <circle cx="27" cy="68" r="3" fill="#f59e0b" />
            <circle cx="73" cy="68" r="3" fill="#f59e0b" />
          </g>
        )}
        {hairStyle === 'wavy' && (
          <g fill={hairColor}>
            <path d="M 22 45 Q 16 60 25 72 Q 28 60 28 45 Z" />
            <path d="M 78 45 Q 84 60 75 72 Q 72 60 72 45 Z" />
          </g>
        )}

        {/* --- BODY / OUTFIT --- */}
        <g id="torso" filter="url(#shadow)">
          {/* Base Shirt/Tunic */}
          <path
            d="M 32 48 Q 50 44 68 48 L 65 74 Q 50 77 35 74 Z"
            fill={outfitColor}
          />

          {/* Themed Suit Details */}
          {outfitStyle === 'ranger' && (
            <g>
              {/* Ranger Cross-Strap & Buckle */}
              <line x1="36" y1="49" x2="63" y2="73" stroke="#78350f" strokeWidth="3.5" />
              <circle cx="49.5" cy="61" r="3.5" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
              <rect x="34" y="69" width="32" height="4" fill="#78350f" />
              <rect x="47" y="68" width="6" height="6" fill="#fbbf24" rx="1" />
            </g>
          )}

          {outfitStyle === 'scholar' && (
            <g>
              {/* Scholar Inner Stole & Book Medallion */}
              <polygon points="50,47 43,72 57,72" fill="#f8fafc" opacity="0.9" />
              <circle cx="50" cy="58" r="3" fill="#fbbf24" />
              <line x1="50" y1="47" x2="50" y2="72" stroke="#cbd5e1" strokeWidth="1.5" />
            </g>
          )}

          {outfitStyle === 'wizard' && (
            <g>
              {/* Wizard Star Mantle */}
              <path d="M 33 48 Q 50 56 67 48 L 65 58 Q 50 63 35 58 Z" fill="#4338ca" />
              <polygon points="50,52 52,57 57,57 53,60 55,65 50,62 45,65 47,60 43,57 48,57" fill="#fbbf24" transform="scale(0.5) translate(50, 52)" />
            </g>
          )}

          {outfitStyle === 'knight' && (
            <g>
              {/* Knight Chestplate */}
              <path d="M 37 51 L 63 51 L 59 70 L 41 70 Z" fill="#94a3b8" />
              <polygon points="50,54 55,61 50,68 45,61" fill="#e2e8f0" />
              <rect x="35" y="69" width="30" height="4" fill="#475569" />
              <circle cx="50" cy="71" r="2.5" fill="#fbbf24" />
            </g>
          )}

          {outfitStyle === 'ninja' && (
            <g>
              {/* Ninja Cross Sash */}
              <path d="M 40 48 L 50 62 L 60 48" stroke="#0f172a" strokeWidth="4" fill="none" />
              <rect x="35" y="68" width="30" height="5" fill="#ef4444" />
            </g>
          )}

          {outfitStyle === 'adventurer' && (
            <g>
              {/* Adventurer Vest */}
              <path d="M 33 48 L 42 48 L 40 73 L 35 73 Z" fill="#78350f" />
              <path d="M 67 48 L 58 48 L 60 73 L 65 73 Z" fill="#78350f" />
              <circle cx="38" cy="56" r="1.5" fill="#fbbf24" />
              <circle cx="38" cy="64" r="1.5" fill="#fbbf24" />
              <circle cx="62" cy="56" r="1.5" fill="#fbbf24" />
              <circle cx="62" cy="64" r="1.5" fill="#fbbf24" />
            </g>
          )}

          {outfitStyle === 'classic' && (
            <g>
              {/* Classic Pocket & Seams */}
              <rect x="36" y="68" width="28" height="4" fill="#0f172a" opacity="0.3" />
              <rect x="40" y="55" width="7" height="8" rx="1.5" fill="#ffffff" opacity="0.25" />
            </g>
          )}
        </g>

        {/* --- ARMS --- */}
        <g id="arms">
          {/* Left Arm */}
          <g style={{ transform: `rotate(${leftArmRot}deg)`, transformOrigin: '32px 50px' }}>
            <rect x="25" y="49" width="8" height="17" rx="4" fill={outfitColor} />
            <circle cx="29" cy="67" r="4.5" fill={skin} />
          </g>

          {/* Right Arm */}
          <g style={{ transform: `rotate(${rightArmRot}deg)`, transformOrigin: '68px 50px' }}>
            <rect x="67" y="49" width="8" height="17" rx="4" fill={outfitColor} />
            <circle cx="71" cy="67" r="4.5" fill={skin} />
          </g>
        </g>

        {/* --- HEAD & NECK --- */}
        <rect x="45" y="42" width="10" height="9" fill={skin} />
        <ellipse cx="50" cy="34" rx="19" ry="17" fill={skin} filter="url(#shadow)" />

        {/* Ears */}
        <circle cx="31" cy="34" r="4" fill={skin} />
        <circle cx="69" cy="34" r="4" fill={skin} />

        {/* --- FACE --- */}
        <g id="face">
          {/* Eyes */}
          <circle cx="43" cy="33" r="3" fill="#1e293b" />
          <circle cx="57" cy="33" r="3" fill="#1e293b" />
          {/* Eye Shine */}
          <circle cx="42" cy="32" r="1" fill="#ffffff" />
          <circle cx="56" cy="32" r="1" fill="#ffffff" />

          {/* Rosy Cheeks */}
          <circle cx="39" cy="37" r="3" fill="#f87171" opacity="0.35" />
          <circle cx="61" cy="37" r="3" fill="#f87171" opacity="0.35" />

          {/* Friendly Smile */}
          <path d="M 46 39 Q 50 43 54 39" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </g>

        {/* --- HAIRSTYLES (Never Blank / Never Bald) --- */}
        <g id="hair" fill={hairColor}>
          {hairStyle === 'curls' && (
            <g>
              <circle cx="34" cy="20" r="9" />
              <circle cx="45" cy="16" r="9.5" />
              <circle cx="56" cy="16" r="9.5" />
              <circle cx="66" cy="20" r="9" />
              <circle cx="28" cy="28" r="8" />
              <circle cx="72" cy="28" r="8" />
              <path d="M 30 25 Q 50 18 70 25 Q 65 31 50 26 Q 35 31 30 25 Z" />
            </g>
          )}

          {hairStyle === 'braids' && (
            <g>
              <path d="M 30 26 Q 50 16 70 26 L 68 20 Q 50 13 32 20 Z" />
              <circle cx="37" cy="21" r="6" />
              <circle cx="45" cy="18" r="6" />
              <circle cx="55" cy="18" r="6" />
              <circle cx="63" cy="21" r="6" />
              <circle cx="30" cy="30" r="5" />
              <circle cx="70" cy="30" r="5" />
            </g>
          )}

          {hairStyle === 'afro' && (
            <g>
              <ellipse cx="50" cy="25" rx="26" ry="21" />
              <circle cx="30" cy="28" r="11" />
              <circle cx="70" cy="28" r="11" />
              <circle cx="50" cy="13" r="12" />
            </g>
          )}

          {hairStyle === 'short' && (
            <g>
              <path d="M 28 29 Q 32 15 50 15 Q 68 15 72 29 Q 62 21 50 21 Q 38 21 28 29 Z" />
              <path d="M 30 27 L 27 34 L 32 32 Z" />
              <path d="M 70 27 L 73 34 L 68 32 Z" />
            </g>
          )}

          {hairStyle === 'spiky' && (
            <g>
              <polygon points="32,25 36,9 42,21" />
              <polygon points="41,20 49,6 54,18" />
              <polygon points="53,19 61,8 65,22" />
              <polygon points="63,22 71,13 71,28" />
              <path d="M 28 27 Q 50 18 72 27 Q 50 23 28 27 Z" />
            </g>
          )}

          {hairStyle === 'wavy' && (
            <g>
              <ellipse cx="50" cy="22" rx="22" ry="14" />
              <path d="M 27 27 Q 32 40 25 50 Q 22 36 29 27 Z" />
              <path d="M 73 27 Q 68 40 75 50 Q 78 36 71 27 Z" />
              <path d="M 33 24 Q 45 28 50 23 Q 55 28 67 24 Z" />
            </g>
          )}

          {hairStyle === 'straight' && (
            <g>
              <path d="M 27 29 Q 31 16 50 16 Q 69 16 73 29 L 74 46 L 68 44 L 69 26 Q 50 24 31 26 L 32 44 L 26 46 Z" />
            </g>
          )}
        </g>

        {/* --- ACCESSORIES --- */}
        {accessory === 'glasses' && (
          <g stroke="#1e293b" strokeWidth="2" fill="none">
            <rect x="37" y="28" width="11" height="9" rx="2.5" fill="#38bdf8" fillOpacity="0.3" />
            <rect x="52" y="28" width="11" height="9" rx="2.5" fill="#38bdf8" fillOpacity="0.3" />
            <line x1="48" y1="32" x2="52" y2="32" strokeWidth="2.5" />
            <line x1="31" y1="31" x2="37" y2="31" strokeWidth="1.5" />
            <line x1="63" y1="31" x2="69" y2="31" strokeWidth="1.5" />
          </g>
        )}

        {accessory === 'sparkles' && (
          <g fill="#fbbf24">
            <path d="M 24 16 L 25.5 21 L 30 22 L 25.5 23 L 24 28 L 22.5 23 L 18 22 L 22.5 21 Z" />
            <path d="M 75 12 L 76 15 L 79 16 L 76 17 L 75 20 L 74 17 L 71 16 L 74 15 Z" />
            <circle cx="77" cy="30" r="1.5" fill="#fef08a" />
          </g>
        )}

        {accessory === 'crown' && (
          <g filter="url(#shadow)">
            <polygon points="36,17 40,8 45,14 50,6 55,14 60,8 64,17" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
            <rect x="36" y="16" width="28" height="4" rx="1" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
            <circle cx="50" cy="18" r="1.5" fill="#ef4444" />
            <circle cx="43" cy="18" r="1.2" fill="#3b82f6" />
            <circle cx="57" cy="18" r="1.2" fill="#22c55e" />
          </g>
        )}

        {accessory === 'bandana' && (
          <g>
            <path d="M 29 25 Q 50 19 71 25 L 70 29 Q 50 23 30 29 Z" fill="#dc2626" />
            <polygon points="69,27 75,26 73,34" fill="#dc2626" />
          </g>
        )}

        {accessory === 'headband' && (
          <g>
            <path d="M 29 24 Q 50 18 71 24 L 70 28 Q 50 22 30 28 Z" fill="#f97316" />
            <polygon points="50,21 52,24 49,24 51,27 47,24 49,24" fill="#ffffff" />
          </g>
        )}

        {/* --- COMPANION PETS (Rendered In-Canvas with Floating Bob) --- */}
        {showPet && (
          <g
            id="companion-pet"
            style={{
              transform: `translate(${isFlipped ? '-24px' : '62px'}, ${54 + Math.sin(walkCycle * 2 + 1) * 3}px)`,
            }}
          >
            {companion === 'baby-dragon' && (
              <g filter="url(#shadow)">
                <ellipse cx="14" cy="15" rx="8" ry="7" fill="#10b981" />
                <ellipse cx="14" cy="9" rx="6" ry="5.5" fill="#10b981" />
                <polygon points="12,4 10,1 14,3" fill="#f59e0b" />
                <polygon points="16,4 18,1 14,3" fill="#f59e0b" />
                <polygon points="7,13 1,8 7,16" fill="#059669" />
                <circle cx="16" cy="8" r="1.5" fill="#1e293b" />
                <circle cx="16.5" cy="7.5" r="0.5" fill="#ffffff" />
                <path d="M 12 18 Q 8 23 5 21" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                {/* Fire puff */}
                <circle cx="21" cy="10" r="1.5" fill="#f97316" opacity="0.8" />
              </g>
            )}

            {companion === 'golden-phonix' && (
              <g filter="url(#shadow)">
                <ellipse cx="14" cy="14" rx="7.5" ry="6.5" fill="#f59e0b" />
                <circle cx="14" cy="8" r="5" fill="#fbbf24" />
                {/* Wings */}
                <path d="M 9 12 Q 1 6 7 16 Z" fill="#ea580c" />
                <path d="M 19 12 Q 27 6 21 16 Z" fill="#ea580c" />
                {/* Crest */}
                <polygon points="14,4 12,0 16,1" fill="#dc2626" />
                {/* Beak */}
                <polygon points="17,8 21,9 17,11" fill="#ea580c" />
                <circle cx="15" cy="7" r="1.2" fill="#1e293b" />
                {/* Tail feather plumes */}
                <path d="M 12 19 Q 9 26 12 28 Q 14 24 14 19 Z" fill="#ea580c" />
              </g>
            )}

            {companion === 'woodland-fox' && (
              <g filter="url(#shadow)">
                <ellipse cx="14" cy="15" rx="7" ry="6" fill="#ea580c" />
                <ellipse cx="14" cy="9" rx="5.5" ry="5" fill="#ea580c" />
                {/* Ears */}
                <polygon points="10,6 8,1 12,4" fill="#9a3412" />
                <polygon points="18,6 20,1 16,4" fill="#9a3412" />
                {/* White snout */}
                <ellipse cx="15" cy="11" rx="3.5" ry="2.5" fill="#ffffff" />
                <circle cx="17.5" cy="10.5" r="1" fill="#1e293b" />
                <circle cx="14" cy="8" r="1.2" fill="#1e293b" />
                {/* Bushy tail */}
                <path d="M 8 16 Q 1 18 3 11 Q 7 13 8 16 Z" fill="#ea580c" />
                <circle cx="2" cy="12" r="2" fill="#ffffff" />
              </g>
            )}

            {companion === 'sea-turtle' && (
              <g filter="url(#shadow)">
                <ellipse cx="14" cy="14" rx="8" ry="6" fill="#047857" />
                <ellipse cx="14" cy="14" rx="6.5" ry="4.5" fill="#10b981" />
                {/* Head */}
                <ellipse cx="21" cy="13" rx="3.5" ry="2.5" fill="#34d399" />
                <circle cx="22" cy="12.5" r="0.8" fill="#064e3b" />
                {/* Flippers */}
                <ellipse cx="17" cy="8" rx="4" ry="2" fill="#34d399" transform="rotate(-25, 17, 8)" />
                <ellipse cx="17" cy="20" rx="4" ry="2" fill="#34d399" transform="rotate(25, 17, 20)" />
                <ellipse cx="9" cy="10" rx="2.5" ry="1.5" fill="#34d399" />
                <ellipse cx="9" cy="18" rx="2.5" ry="1.5" fill="#34d399" />
              </g>
            )}

            {companion === 'owl' && (
              <g filter="url(#shadow)">
                <ellipse cx="14" cy="14" rx="6.5" ry="7.5" fill="#78350f" />
                <circle cx="14" cy="9" rx="5.5" ry="5" fill="#9a3412" />
                {/* Eyes */}
                <circle cx="12" cy="8.5" r="2.8" fill="#ffffff" />
                <circle cx="16" cy="8.5" r="2.8" fill="#ffffff" />
                <circle cx="12" cy="8.5" r="1.4" fill="#1e293b" />
                <circle cx="16" cy="8.5" r="1.4" fill="#1e293b" />
                <polygon points="14,10 15,12 13,12" fill="#f59e0b" />
                {/* Ear tufts */}
                <polygon points="9,5 7,1 11,4" fill="#78350f" />
                <polygon points="19,5 21,1 17,4" fill="#78350f" />
              </g>
            )}

            {companion === 'bunny' && (
              <g filter="url(#shadow)">
                <ellipse cx="14" cy="15" rx="6.5" ry="6" fill="#e2e8f0" />
                <circle cx="14" cy="10" r="4.5" fill="#f8fafc" />
                {/* Long Ears */}
                <ellipse cx="11" cy="4" rx="2" ry="5" fill="#f8fafc" />
                <ellipse cx="11" cy="4" rx="1" ry="3.5" fill="#f472b6" />
                <ellipse cx="16" cy="4" rx="2" ry="5" fill="#f8fafc" />
                <ellipse cx="16" cy="4" rx="1" ry="3.5" fill="#f472b6" />
                <circle cx="15.5" cy="9.5" r="1" fill="#ec4899" />
                <circle cx="7" cy="16" r="2.2" fill="#ffffff" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};