import React from 'react';
import { AvatarCustomization } from '../types/character';

interface AvatarRendererProps {
  customization?: AvatarCustomization;
  size?: number;
  facing?: 'left' | 'right' | 'down' | 'up';
  isWalking?: boolean;
  isRunning?: boolean;
  isSwimming?: boolean;
  walkCycle?: number;
  swimCycle?: number;
  showPet?: boolean;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  customization,
  size = 64,
  facing = 'down',
  isWalking = false,
  isRunning = false,
  isSwimming = false,
  walkCycle = 0,
  swimCycle = 0,
  showPet = true,
}) => {
  const skin = customization?.skinTone || '#fcd5b5';
  const hairStyle = customization?.hairStyle || 'curls';
  const hairColor = customization?.hairColor || '#5c3818';
  const outfitStyle = customization?.outfitStyle || 'adventurer';
  const outfitColor = customization?.outfitColor || '#dc2626';
  const accessory = customization?.accessory || 'bandana';
  const companion = customization?.companionPet || 'sea-turtle';

  const bobY = isSwimming
    ? Math.sin(swimCycle * 2) * 3
    : isWalking
    ? Math.sin(walkCycle * 2) * (isRunning ? 3.5 : 2)
    : 0;

  const walkLeftLegRot = isWalking ? Math.sin(walkCycle) * (isRunning ? 26 : 16) : 0;
  const walkRightLegRot = isWalking ? -Math.sin(walkCycle) * (isRunning ? 26 : 16) : 0;
  const walkLeftArmRot = isWalking ? -Math.sin(walkCycle) * (isRunning ? 28 : 18) : 0;
  const walkRightArmRot = isWalking ? Math.sin(walkCycle) * (isRunning ? 28 : 18) : 0;

  // Swimming motion: Arms sweep up/down, legs kick open/closed
  const swimArmSweep = Math.sin(swimCycle) * 45;
  const swimLegSpread = Math.abs(Math.sin(swimCycle)) * 25;

  const leftLegRot = isSwimming ? -swimLegSpread : walkLeftLegRot;
  const rightLegRot = isSwimming ? swimLegSpread : walkRightLegRot;
  const leftArmRot = isSwimming ? -70 + swimArmSweep : walkLeftArmRot;
  const rightArmRot = isSwimming ? 70 - swimArmSweep : walkRightArmRot;

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

        {isSwimming ? (
          <g id="water-wake" opacity="0.75">
            <ellipse
              cx="50"
              cy="80"
              rx={26 + Math.sin(swimCycle * 2) * 3}
              ry={7 + Math.sin(swimCycle * 2) * 1.5}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />
            <ellipse cx="50" cy="79" rx="19" ry="5.5" fill="#0284c7" opacity="0.35" />
            <circle cx={42 + Math.sin(swimCycle) * 3} cy="81" r="2" fill="#e0f2fe" opacity="0.8" />
            <circle cx={58 - Math.sin(swimCycle) * 3} cy="81" r="2" fill="#e0f2fe" opacity="0.8" />
          </g>
        ) : (
          <ellipse cx="50" cy="94" rx="20" ry="5" fill="#000000" opacity="0.28" />
        )}

        {/* --- LEGS --- */}
        <g id="legs">
          <g style={{ transform: `rotate(${leftLegRot}deg)`, transformOrigin: '42px 72px' }}>
            <rect x="37" y="72" width="9" height="18" rx="4.5" fill="#1e293b" />
            <ellipse cx="41.5" cy="90" rx="6" ry="3.5" fill="#0f172a" />
          </g>
          <g style={{ transform: `rotate(${rightLegRot}deg)`, transformOrigin: '58px 72px' }}>
            <rect x="54" y="72" width="9" height="18" rx="4.5" fill="#1e293b" />
            <ellipse cx="58.5" cy="90" rx="6" ry="3.5" fill="#0f172a" />
          </g>
        </g>

        {/* --- BACK HAIR --- */}
        {hairStyle === 'braids' && (
          <g fill={hairColor}>
            <rect x="23" y="42" width="8" height="24" rx="4" />
            <rect x="69" y="42" width="8" height="24" rx="4" />
            <circle cx="27" cy="68" r="3" fill="#f59e0b" />
            <circle cx="73" cy="68" r="3" fill="#f59e0b" />
          </g>
        )}

        {/* --- BODY / OUTFIT --- */}
        <g id="torso" filter="url(#shadow)">
          <path d="M 32 48 Q 50 44 68 48 L 65 74 Q 50 77 35 74 Z" fill={outfitColor} />

          {outfitStyle === 'adventurer' && (
            <g>
              <path d="M 33 48 L 42 48 L 40 73 L 35 73 Z" fill="#991b1b" />
              <path d="M 67 48 L 58 48 L 60 73 L 65 73 Z" fill="#991b1b" />
              <circle cx="38" cy="56" r="1.5" fill="#fbbf24" />
              <circle cx="38" cy="64" r="1.5" fill="#fbbf24" />
              <circle cx="62" cy="56" r="1.5" fill="#fbbf24" />
              <circle cx="62" cy="64" r="1.5" fill="#fbbf24" />
            </g>
          )}

          {outfitStyle === 'wizard' && (
            <g>
              <path d="M 33 48 Q 50 56 67 48 L 65 58 Q 50 63 35 58 Z" fill="#581c87" />
              <polygon points="50,52 52,57 57,57 53,60 55,65 50,62 45,65 47,60 43,57 48,57" fill="#fbbf24" transform="scale(0.5) translate(50, 52)" />
            </g>
          )}

          {outfitStyle === 'ranger' && (
            <g>
              <line x1="36" y1="49" x2="63" y2="73" stroke="#78350f" strokeWidth="3.5" />
              <circle cx="49.5" cy="61" r="3.5" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
            </g>
          )}
        </g>

        {/* --- ARMS --- */}
        <g id="arms">
          <g style={{ transform: `rotate(${leftArmRot}deg)`, transformOrigin: '32px 50px' }}>
            <rect x="25" y="49" width="8" height="17" rx="4" fill={outfitColor} />
            <circle cx="29" cy="67" r="4.5" fill={skin} />
          </g>
          <g style={{ transform: `rotate(${rightArmRot}deg)`, transformOrigin: '68px 50px' }}>
            <rect x="67" y="49" width="8" height="17" rx="4" fill={outfitColor} />
            <circle cx="71" cy="67" r="4.5" fill={skin} />
          </g>
        </g>

        {/* --- HEAD & FACE --- */}
        <rect x="45" y="42" width="10" height="9" fill={skin} />
        <ellipse cx="50" cy="34" rx="19" ry="17" fill={skin} filter="url(#shadow)" />
        <circle cx="31" cy="34" r="4" fill={skin} />
        <circle cx="69" cy="34" r="4" fill={skin} />

        <g id="face">
          <circle cx="43" cy="33" r="3" fill="#1e293b" />
          <circle cx="57" cy="33" r="3" fill="#1e293b" />
          <circle cx="42" cy="32" r="1" fill="#ffffff" />
          <circle cx="56" cy="32" r="1" fill="#ffffff" />
          <circle cx="39" cy="37" r="3" fill="#f87171" opacity="0.35" />
          <circle cx="61" cy="37" r="3" fill="#f87171" opacity="0.35" />
          <path d="M 46 39 Q 50 43 54 39" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </g>

        {/* --- CURLS HAIR --- */}
        <g id="hair" fill={hairColor}>
          {hairStyle === 'curls' ? (
            <g>
              <circle cx="34" cy="20" r="9" />
              <circle cx="45" cy="16" r="9.5" />
              <circle cx="56" cy="16" r="9.5" />
              <circle cx="66" cy="20" r="9" />
              <circle cx="28" cy="28" r="8" />
              <circle cx="72" cy="28" r="8" />
              <path d="M 30 25 Q 50 18 70 25 Q 65 31 50 26 Q 35 31 30 25 Z" />
            </g>
          ) : (
            <g>
              <ellipse cx="50" cy="22" rx="22" ry="14" />
              <path d="M 28 27 Q 50 20 72 27 Z" />
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

        {accessory === 'bandana' && (
          <g>
            <path d="M 29 25 Q 50 19 71 25 L 70 29 Q 50 23 30 29 Z" fill="#b91c1c" />
            <polygon points="69,27 75,26 73,34" fill="#b91c1c" />
          </g>
        )}

        {/* --- PETS (Turtle, Dragon, Golden Eagle) --- */}
        {showPet && (
          <g
            id="companion-pet"
            style={{
              transform: `translate(${isFlipped ? '-24px' : '62px'}, ${54 + Math.sin(walkCycle * 2 + 1) * 3}px)`,
            }}
          >
            {companion === 'sea-turtle' && (
              <g filter="url(#shadow)">
                <ellipse cx="14" cy="14" rx="8" ry="6" fill="#047857" />
                <ellipse cx="14" cy="14" rx="6.5" ry="4.5" fill="#10b981" />
                <ellipse cx="21" cy="13" rx="3.5" ry="2.5" fill="#34d399" />
                <circle cx="22" cy="12.5" r="0.8" fill="#064e3b" />
                <ellipse cx="17" cy="8" rx="4" ry="2" fill="#34d399" transform="rotate(-25, 17, 8)" />
                <ellipse cx="17" cy="20" rx="4" ry="2" fill="#34d399" transform="rotate(25, 17, 20)" />
              </g>
            )}

            {companion === 'baby-dragon' && (
              <g filter="url(#shadow)">
                <ellipse cx="14" cy="15" rx="8" ry="7" fill="#10b981" />
                <ellipse cx="14" cy="9" rx="6" ry="5.5" fill="#10b981" />
                <polygon points="12,4 10,1 14,3" fill="#f59e0b" />
                <polygon points="16,4 18,1 14,3" fill="#f59e0b" />
                <polygon points="7,13 1,8 7,16" fill="#059669" />
                <circle cx="16" cy="8" r="1.5" fill="#1e293b" />
                <circle cx="21" cy="10" r="1.5" fill="#f97316" opacity="0.8" />
              </g>
            )}

            {companion === 'golden-eagle' && (
              <g filter="url(#shadow)">
                <ellipse cx="14" cy="14" rx="8" ry="7" fill="#b45309" />
                <circle cx="14" cy="8" r="5" fill="#f59e0b" />
                <path d="M 8 11 Q 1 4 7 16 Z" fill="#d97706" />
                <path d="M 20 11 Q 27 4 21 16 Z" fill="#d97706" />
                <polygon points="17,8 22,9 17,11" fill="#fbbf24" />
                <circle cx="15" cy="7" r="1.2" fill="#1e293b" />
                <path d="M 12 20 Q 9 27 13 28 Q 15 24 15 20 Z" fill="#92400e" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};