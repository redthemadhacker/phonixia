import React from 'react';
import { CharacterCustomization } from '../types/character';

interface AvatarRendererProps {
  customization: CharacterCustomization;
  size?: number;
  isWalking?: boolean;
  isRunning?: boolean;
  facing?: 'left' | 'right' | 'down' | 'up';
  walkCycle?: number;
  showPet?: boolean;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  customization,
  size = 64,
  isWalking = false,
  isRunning = false,
  facing = 'down',
  walkCycle = 0,
  showPet = true
}) => {
  const {
    skinTone,
    hairStyle,
    hairColor,
    outfit,
    headgear,
    companionPet
  } = customization;

  // Mirror for facing left
  const transform = facing === 'left' ? 'scale(-1, 1) translate(-64, 0)' : '';

  // Calculate leg swing offsets based on walkCycle
  const legOffsetLeft = isWalking ? Math.sin(walkCycle * 2.5) * (isRunning ? 6 : 4) : 0;
  const legOffsetRight = isWalking ? -Math.sin(walkCycle * 2.5) * (isRunning ? 6 : 4) : 0;
  const bodyBob = isWalking ? Math.abs(Math.sin(walkCycle * 2.5)) * (isRunning ? -3 : -1.5) : 0;


  return (
    <div
      className={`relative inline-block select-none ${isWalking ? 'animate-bounce-gentle' : ''}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        className="overflow-visible filter drop-shadow-md"
      >
        <g transform={transform}>
          {/* Shadow */}
          <ellipse cx="32" cy="58" rx="14" ry="4" fill="rgba(0, 0, 0, 0.25)" />

          {/* Body / Legs with dynamic walking offset */}
          <g transform={`translate(0, ${bodyBob})`}>
            <rect x="25" y={44 + legOffsetLeft} width="5" height="12" rx="2" fill="#1e293b" />
            <rect x="34" y={44 + legOffsetRight} width="5" height="12" rx="2" fill="#1e293b" />
            <rect x="24" y={53 + legOffsetLeft} width="7" height="4" rx="2" fill="#78350f" />
            <rect x="33" y={53 + legOffsetRight} width="7" height="4" rx="2" fill="#78350f" />
          </g>

          {/* Torso & Head with gentle bobbing */}
          <g transform={`translate(0, ${bodyBob})`}>
            {/* Outfit Torso */}
            {outfit === 'ranger-vest' && (
              <g>
                <rect x="22" y="28" width="20" height="18" rx="4" fill="#047857" />
                {facing !== 'up' ? (
                  <>
                    <rect x="26" y="28" width="12" height="18" fill="#f59e0b" />
                    <circle cx="32" cy="34" r="1.5" fill="#fef3c7" />
                    <circle cx="32" cy="40" r="1.5" fill="#fef3c7" />
                    <line x1="24" y1="28" x2="28" y2="46" stroke="#92400e" strokeWidth="2" />
                    <line x1="40" y1="28" x2="36" y2="46" stroke="#92400e" strokeWidth="2" />
                  </>
                ) : (
                  <>
                    {/* Back of vest with backpack */}
                    <rect x="24" y="30" width="16" height="14" rx="3" fill="#b45309" />
                    <line x1="25" y1="28" x2="25" y2="46" stroke="#78350f" strokeWidth="2" />
                    <line x1="39" y1="28" x2="39" y2="46" stroke="#78350f" strokeWidth="2" />
                  </>
                )}
              </g>
            )}

            {outfit === 'phoenix-cloak' && (
              <g>
                <path d="M 20 30 Q 32 25 44 30 L 46 48 Q 32 44 18 48 Z" fill="#dc2626" />
                <path d="M 24 30 Q 32 28 40 30 L 41 46 Q 32 42 23 46 Z" fill="#ea580c" />
                {facing !== 'up' && <polygon points="32,32 30,38 34,38" fill="#fef08a" />}
              </g>
            )}

            {outfit === 'scholar-robe' && (
              <g>
                <rect x="21" y="28" width="22" height="20" rx="3" fill="#4338ca" />
                {facing !== 'up' && (
                  <>
                    <rect x="29" y="28" width="6" height="20" fill="#fbbf24" />
                    <circle cx="32" cy="33" r="2" fill="#ffffff" />
                  </>
                )}
              </g>
            )}

            {outfit === 'safari-suit' && (
              <g>
                <rect x="22" y="28" width="20" height="18" rx="4" fill="#d97706" />
                {facing !== 'up' && (
                  <>
                    <rect x="24" y="32" width="6" height="6" rx="1" fill="#b45309" />
                    <rect x="34" y="32" width="6" height="6" rx="1" fill="#b45309" />
                  </>
                )}
              </g>
            )}

            {outfit === 'cyber-tunic' && (
              <g>
                <rect x="22" y="28" width="20" height="18" rx="4" fill="#0f172a" />
                <line x1="24" y1="36" x2="40" y2="36" stroke="#06b6d4" strokeWidth="2" />
                <line x1="32" y1="28" x2="32" y2="46" stroke="#06b6d4" strokeWidth="2" />
              </g>
            )}

            {/* Arms & Hands with walk swing */}
            <rect x="18" y={30 + legOffsetRight} width="5" height="11" rx="2" fill={skinTone} />
            <rect x="41" y={30 + legOffsetLeft} width="5" height="11" rx="2" fill={skinTone} />

            {/* Head & Neck */}
            <rect x="29" y="24" width="6" height="6" fill={skinTone} />
            <ellipse cx="32" cy="20" rx="11" ry="11" fill={skinTone} />

            {/* Back of Head Hair Fill when facing away */}
            {facing === 'up' && (
              <ellipse cx="32" cy="19" rx="11.5" ry="11.5" fill={hairColor} />
            )}

            {/* Eyes & Smile - only when not facing away */}
            {facing !== 'up' && (
              <>
                <circle cx="28" cy="19" r="1.8" fill="#0f172a" />
                <circle cx="36" cy="19" r="1.8" fill="#0f172a" />
                <circle cx="28.5" cy="18.5" r="0.6" fill="#ffffff" />
                <circle cx="36.5" cy="18.5" r="0.6" fill="#ffffff" />
                <ellipse cx="25" cy="22" rx="1.8" ry="1" fill="#fca5a5" opacity="0.6" />
                <ellipse cx="39" cy="22" rx="1.8" ry="1" fill="#fca5a5" opacity="0.6" />
                <path d="M 29 23 Q 32 26 35 23" stroke="#991b1b" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              </>
            )}
          </g>

          {/* Hair Styles */}
          {hairStyle === 'spiky' && (
            <path
              d="M 21 16 Q 23 8 28 8 Q 32 6 36 8 Q 41 8 43 16 Q 44 20 42 22 Q 41 12 32 10 Q 23 12 22 22 Z"
              fill={hairColor}
            />
          )}

          {hairStyle === 'curly' && (
            <g fill={hairColor}>
              <circle cx="22" cy="14" r="5" />
              <circle cx="28" cy="10" r="5.5" />
              <circle cx="35" cy="10" r="5.5" />
              <circle cx="41" cy="14" r="5" />
              <circle cx="20" cy="19" r="4" />
              <circle cx="43" cy="19" r="4" />
            </g>
          )}

          {hairStyle === 'wavy' && (
            <path
              d="M 20 18 Q 22 9 32 9 Q 42 9 44 18 Q 45 25 43 28 Q 41 20 38 15 Q 32 12 26 15 Q 23 20 21 28 Z"
              fill={hairColor}
            />
          )}

          {hairStyle === 'afro' && (
            <ellipse cx="32" cy="16" rx="14" ry="13" fill={hairColor} />
          )}

          {hairStyle === 'braids' && (
            <g fill={hairColor}>
              <path d="M 21 16 Q 32 10 43 16 Q 41 12 32 11 Q 23 12 21 16 Z" />
              {/* Left braid */}
              <circle cx="20" cy="22" r="3" />
              <circle cx="19" cy="27" r="2.8" />
              <circle cx="18" cy="32" r="2.5" />
              {/* Right braid */}
              <circle cx="44" cy="22" r="3" />
              <circle cx="45" cy="27" r="2.8" />
              <circle cx="46" cy="32" r="2.5" />
            </g>
          )}

          {hairStyle === 'short' && (
            <path
              d="M 21 18 Q 23 11 32 11 Q 41 11 43 18 Q 40 14 32 13 Q 24 14 21 18 Z"
              fill={hairColor}
            />
          )}

          {hairStyle === 'explorer-bun' && (
            <g fill={hairColor}>
              <circle cx="32" cy="6" r="5" />
              <path d="M 21 17 Q 32 10 43 17 Q 41 13 32 12 Q 23 13 21 17 Z" />
            </g>
          )}

          {/* Headgear */}
          {headgear === 'explorer-hat' && (
            <g>
              <ellipse cx="32" cy="12" rx="17" ry="4" fill="#b45309" />
              <rect x="24" y="5" width="16" height="7" rx="3" fill="#d97706" />
              <rect x="24" y="10" width="16" height="2" fill="#78350f" />
            </g>
          )}

          {headgear === 'phoenix-crown' && (
            <g>
              <polygon points="23,12 26,4 32,8 38,4 41,12" fill="#f59e0b" />
              <circle cx="32" cy="10" r="2" fill="#ef4444" />
            </g>
          )}

          {headgear === 'pilot-goggles' && (
            <g>
              <rect x="22" y="11" width="20" height="2" fill="#334155" />
              <ellipse cx="27" cy="12" rx="4" ry="3.5" fill="#38bdf8" stroke="#1e293b" strokeWidth="1.2" />
              <ellipse cx="37" cy="12" rx="4" ry="3.5" fill="#38bdf8" stroke="#1e293b" strokeWidth="1.2" />
            </g>
          )}

          {headgear === 'bandana' && (
            <g>
              <rect x="21" y="12" width="22" height="4" rx="2" fill="#ef4444" />
              <polygon points="41,14 46,16 43,18" fill="#ef4444" />
            </g>
          )}

          {headgear === 'cap' && (
            <g>
              <path d="M 22 13 Q 32 7 42 13 Z" fill="#2563eb" />
              <path d="M 32 13 Q 44 13 46 15 L 36 15 Z" fill="#1d4ed8" />
            </g>
          )}
        </g>

        {/* Companion Pet floating nearby */}
        {showPet && (
          <g transform="translate(44, 28) scale(0.6)" className="animate-float">
            {companionPet === 'phoenix-chick' && (
              <g>
                <circle cx="10" cy="10" r="8" fill="#f97316" />
                <circle cx="10" cy="8" r="5" fill="#fbbf24" />
                <polygon points="10,0 7,6 13,6" fill="#ef4444" />
                <polygon points="15,8 19,10 15,12" fill="#ea580c" />
                <circle cx="12" cy="7" r="1.2" fill="#000" />
                <circle cx="12.5" cy="6.5" r="0.4" fill="#fff" />
              </g>
            )}

            {companionPet === 'clever-fox' && (
              <g>
                <circle cx="10" cy="12" r="8" fill="#ea580c" />
                <polygon points="4,4 3,11 10,8" fill="#ea580c" />
                <polygon points="16,4 10,8 17,11" fill="#ea580c" />
                <polygon points="10,13 7,16 13,16" fill="#ffffff" />
                <circle cx="10" cy="15" r="1" fill="#000" />
                <circle cx="8" cy="11" r="1.2" fill="#000" />
                <circle cx="12" cy="11" r="1.2" fill="#000" />
              </g>
            )}

            {companionPet === 'golden-eagle' && (
              <g>
                <circle cx="10" cy="10" r="7" fill="#78350f" />
                <circle cx="10" cy="8" r="5" fill="#fef08a" />
                <polygon points="14,8 19,10 14,12" fill="#f59e0b" />
                <circle cx="12" cy="7" r="1.2" fill="#000" />
              </g>
            )}

            {companionPet === 'coral-turtle' && (
              <g>
                <ellipse cx="10" cy="12" rx="8" ry="6" fill="#10b981" />
                <circle cx="16" cy="10" r="3" fill="#34d399" />
                <circle cx="17" cy="9.5" r="0.8" fill="#000" />
                <ellipse cx="10" cy="12" rx="5" ry="4" fill="#059669" />
              </g>
            )}

            {companionPet === 'gem-golem' && (
              <g>
                <rect x="4" y="4" width="12" height="12" rx="2" fill="#8b5cf6" />
                <polygon points="10,2 14,7 6,7" fill="#c084fc" />
                <rect x="7" y="8" width="2" height="2" fill="#38bdf8" />
                <rect x="11" y="8" width="2" height="2" fill="#38bdf8" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
