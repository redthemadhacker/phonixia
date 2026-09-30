import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/audio';
import { AvatarCustomization } from '../types/character';

export interface AvatarRendererProps {
  customization?: AvatarCustomization;
  size?: number;
  facing?: 'left' | 'right' | 'down' | 'up';
  isWalking?: boolean;
  isRunning?: boolean;
  isSwimming?: boolean;
  isSwinging?: boolean;
  isJumping?: boolean;
  isActing?: boolean;
  isClimbing?: boolean;
  walkCycle?: number;
  swimCycle?: number;
  swingAngle?: number;
  showPet?: boolean;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  customization,
  size = 64,
  facing = 'down',
  isWalking = false,
  isRunning = false,
  isSwimming = false,
  isSwinging = false,
  isJumping = false,
  isActing = false,
  isClimbing = false,
  walkCycle,
  swimCycle,
  swingAngle,
  showPet = true,
}) => {
  // Built-in continuous physics animation clock for self-driving animations
  const [internalClock, setInternalClock] = useState(0);
  const lastStepAudioRef = useRef<number>(0);

  const shouldAnimateInternally = 
    isWalking || isRunning || isSwimming || isSwinging || isJumping || isActing || isClimbing;

  useEffect(() => {
    if (!shouldAnimateInternally) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      const speedMultiplier = isRunning ? 22 : isSwinging ? 6 : isActing ? 12 : 11;
      setInternalClock((prev) => (prev + dt * speedMultiplier) % (Math.PI * 2));

      // Mario-style rapid footsteps for walking and running
      if ((isWalking || isRunning) && currentTime - lastStepAudioRef.current > (isRunning ? 110 : 200)) {
        lastStepAudioRef.current = currentTime;
        if (isRunning) {
          sounds.playRunSteps();
        } else {
          sounds.playStep();
        }
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [shouldAnimateInternally, isRunning, isSwinging, isActing]);

  // Use explicit cycle props if supplied, otherwise fallback to internal clock
  const activeCycle = walkCycle !== undefined ? walkCycle : internalClock;
  const activeSwimCycle = swimCycle !== undefined ? swimCycle : internalClock;

  const skin = customization?.skinTone || '#fcd5b5';
  const hairStyle = customization?.hairStyle || 'curls';
  const hairColor = customization?.hairColor || '#5c3818';
  const outfitStyle = customization?.outfitStyle || 'adventurer';
  const outfitColor = customization?.outfitColor || '#dc2626';
  const accessory = customization?.accessory || 'bandana';
  const companion = customization?.companionPet || 'sea-turtle';

  // --- VERTICAL BOBBING & TORSO DYNAMICS ---
  let bobY = 0;
  let torsoTilt = 0;

  if (isSwimming) {
    bobY = Math.sin(activeSwimCycle * 2) * 3.5;
  } else if (isSwinging) {
    const sAngle = swingAngle !== undefined ? swingAngle : Math.sin(internalClock) * 25;
    bobY = -Math.cos((sAngle * Math.PI) / 180) * 3 + 2;
    torsoTilt = sAngle * 0.45;
  } else if (isJumping) {
    bobY = -5;
    torsoTilt = -3;
  } else if (isWalking || isRunning) {
    bobY = Math.abs(Math.sin(activeCycle)) * (isRunning ? -4.5 : -2.5);
    torsoTilt = isRunning ? 4 : 2;
  }

  // --- LIMB ROTATION CALCULATION (Real-time Human Pendulum Physics) ---
  let leftLegRot = 0;
  let rightLegRot = 0;
  let leftArmRot = 0;
  let rightArmRot = 0;

  if (isSwinging) {
    // Vine Hanging Pose: Arms raised high above head grasping the vine rope!
    const sAngle = swingAngle !== undefined ? swingAngle : Math.sin(internalClock) * 28;
    leftArmRot = -140 + sAngle * 0.3;
    rightArmRot = -140 + sAngle * 0.3;
    // Legs trailing behind the swing arc
    leftLegRot = sAngle * 0.7 - 8;
    rightLegRot = sAngle * 0.7 + 8;
  } else if (isSwimming) {
    // Breaststroke arm sweeps & flutter kicks
    const swimArmSweep = Math.sin(activeSwimCycle) * 45;
    const swimLegSpread = Math.sin(activeSwimCycle * 1.5) * 22;
    leftLegRot = -swimLegSpread;
    rightLegRot = swimLegSpread;
    leftArmRot = -65 + swimArmSweep;
    rightArmRot = 65 - swimArmSweep;
  } else if (isJumping) {
    // In-air jump pose: knees bent up, arms out for balance
    leftLegRot = -24;
    rightLegRot = 24;
    leftArmRot = -45;
    rightArmRot = 45;
  } else if (isActing) {
    // Striking / Action: Dominant right arm swings forward with impact arc
    const strikePhase = Math.sin(internalClock * 2);
    leftArmRot = -15;
    rightArmRot = 55 + strikePhase * 25;
    leftLegRot = -10;
    rightLegRot = 12;
  } else if (isWalking || isRunning) {
    // Mario-style classic stepped locomotion (snappy, repeated fast steps like Mario walking/running)
    // Quantize the cycle into distinct snappy pose steps
    const stepCount = isRunning ? 4 : 4;
    const stepProgress = (activeCycle / (Math.PI * 2)) % 1;
    const stepPhase = Math.floor(stepProgress * stepCount);
    
    // Snappy stepped angles: Left Leg, Right Leg, Left Arm, Right Arm
    // Phase 0: Left forward step, Right back
    // Phase 1: Contact transition snap
    // Phase 2: Right forward step, Left back
    // Phase 3: Contact transition snap
    const runMult = isRunning ? 1.6 : 1.0;
    const poses = [
      { lLeg: 34 * runMult, rLeg: -34 * runMult, lArm: -38 * runMult, rArm: 38 * runMult, bob: isRunning ? -6 : -3 },
      { lLeg: 10 * runMult, rLeg: -10 * runMult, lArm: -12 * runMult, rArm: 12 * runMult, bob: 0 },
      { lLeg: -34 * runMult, rLeg: 34 * runMult, lArm: 38 * runMult, rArm: -38 * runMult, bob: isRunning ? -6 : -3 },
      { lLeg: -10 * runMult, rLeg: 10 * runMult, lArm: 12 * runMult, rArm: -12 * runMult, bob: 0 },
    ];
    const currentPose = poses[stepPhase % poses.length];
    leftLegRot = currentPose.lLeg;
    rightLegRot = currentPose.rLeg;
    leftArmRot = currentPose.lArm;
    rightArmRot = currentPose.rArm;
    bobY = currentPose.bob;
    torsoTilt = isRunning ? 5 : 2;
  } else {
    // Idle subtle breathing
    const idleBreath = Math.sin(internalClock * 0.6) * 1.5;
    leftArmRot = idleBreath;
    rightArmRot = -idleBreath;
  }

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
        style={{
          transform: `translateY(${bobY}px) rotate(${torsoTilt}deg)`,
          transformOrigin: '50px 70px',
        }}
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* --- SHADOW / WATER WAKE --- */}
        {isSwimming ? (
          <g id="water-wake" opacity="0.8">
            <ellipse
              cx="50"
              cy="80"
              rx={25 + Math.sin(activeSwimCycle * 2) * 3}
              ry={7 + Math.sin(activeSwimCycle * 2) * 1.5}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />
            <ellipse cx="50" cy="79" rx="19" ry="5.5" fill="#0284c7" opacity="0.35" />
            <circle cx={42 + Math.sin(activeSwimCycle) * 3} cy="81" r="2" fill="#e0f2fe" opacity="0.8" />
            <circle cx={58 - Math.sin(activeSwimCycle) * 3} cy="81" r="2" fill="#e0f2fe" opacity="0.8" />
          </g>
        ) : !isSwinging ? (
          <ellipse cx="50" cy="94" rx={20 - Math.abs(bobY) * 1.2} ry={5} fill="#000000" opacity={0.28 - Math.abs(bobY) * 0.02} />
        ) : null}

        {/* --- BACK HAIR (Long styles / Braids) --- */}
        {hairStyle === 'braids' && (
          <g fill={hairColor}>
            <rect x="23" y="36" width="7" height="30" rx="3.5" />
            <rect x="70" y="36" width="7" height="30" rx="3.5" />
            <circle cx="26.5" cy="65" r="3" fill="#f59e0b" />
            <circle cx="73.5" cy="65" r="3" fill="#f59e0b" />
          </g>
        )}
        {hairStyle === 'wavy' && (
          <g fill={hairColor}>
            <path d="M 24 35 Q 20 52 26 62 Q 30 52 30 40 Z" />
            <path d="M 76 35 Q 80 52 74 62 Q 70 52 70 40 Z" />
          </g>
        )}

        {/* --- LEGS (Real-Time Pivot Swing) --- */}
        <g id="legs">
          {/* Left Leg */}
          <g
            style={{
              transform: `rotate(${leftLegRot}deg)`,
              transformOrigin: '42px 72px',
            }}
          >
            <rect x="37" y="72" width="9" height="18" rx="4.5" fill="#1e293b" />
            <ellipse cx="41.5" cy="90" rx="6" ry="3.5" fill="#0f172a" />
          </g>

          {/* Right Leg */}
          <g
            style={{
              transform: `rotate(${rightLegRot}deg)`,
              transformOrigin: '58px 72px',
            }}
          >
            <rect x="54" y="72" width="9" height="18" rx="4.5" fill="#1e293b" />
            <ellipse cx="58.5" cy="90" rx="6" ry="3.5" fill="#0f172a" />
          </g>
        </g>

        {/* --- BODY / TORSO --- */}
        <g id="torso" filter="url(#shadow)">
          <path d="M 32 48 Q 50 44 68 48 L 65 74 Q 50 77 35 74 Z" fill={outfitColor} />

          {(outfitStyle === 'adventurer' || outfitStyle === 'ranger-vest') && (
            <g>
              <path d="M 33 48 L 42 48 L 40 73 L 35 73 Z" fill="#991b1b" />
              <path d="M 67 48 L 58 48 L 60 73 L 65 73 Z" fill="#991b1b" />
              <circle cx="38" cy="56" r="1.5" fill="#fbbf24" />
              <circle cx="38" cy="64" r="1.5" fill="#fbbf24" />
              <circle cx="62" cy="56" r="1.5" fill="#fbbf24" />
              <circle cx="62" cy="64" r="1.5" fill="#fbbf24" />
            </g>
          )}

          {(outfitStyle === 'wizard' || outfitStyle === 'phonix-cloak') && (
            <g>
              <path d="M 33 48 Q 50 56 67 48 L 65 58 Q 50 63 35 58 Z" fill="#581c87" />
              <polygon points="50,52 52,57 57,57 53,60 55,65 50,62 45,65 47,60 43,57 48,57" fill="#fbbf24" transform="scale(0.5) translate(50, 52)" />
            </g>
          )}

          {(outfitStyle === 'ranger' || outfitStyle === 'safari-suit') && (
            <g>
              <line x1="36" y1="49" x2="63" y2="73" stroke="#78350f" strokeWidth="3.5" />
              <circle cx="49.5" cy="61" r="3.5" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
            </g>
          )}

          {outfitStyle === 'knight' && (
            <g>
              <rect x="42" y="52" width="16" height="16" rx="2" fill="#94a3b8" />
              <line x1="50" y1="52" x2="50" y2="68" stroke="#f8fafc" strokeWidth="1.5" />
            </g>
          )}
        </g>

        {/* --- ARMS (Real-Time Shoulder Pivot Swing) --- */}
        <g id="arms">
          {/* Left Arm */}
          <g
            style={{
              transform: `rotate(${leftArmRot}deg)`,
              transformOrigin: isSwinging ? '30px 48px' : '31px 50px',
            }}
          >
            <rect x="25" y="49" width="8" height="17" rx="4" fill={outfitColor} />
            <circle cx="29" cy="67" r="4.5" fill={skin} />
            {isSwinging && (
              // Grip outline when holding vine
              <circle cx="29" cy="67" r="5" fill="none" stroke="#22c55e" strokeWidth="1.5" />
            )}
          </g>

          {/* Right Arm */}
          <g
            style={{
              transform: `rotate(${rightArmRot}deg)`,
              transformOrigin: isSwinging ? '70px 48px' : '69px 50px',
            }}
          >
            <rect x="67" y="49" width="8" height="17" rx="4" fill={outfitColor} />
            <circle cx="71" cy="67" r="4.5" fill={skin} />
            {isSwinging && (
              // Grip outline when holding vine
              <circle cx="71" cy="67" r="5" fill="none" stroke="#22c55e" strokeWidth="1.5" />
            )}
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

        {/* --- ALL HAIRSTYLES --- */}
        <g id="hair" fill={hairColor}>
          {(hairStyle === 'curls' || hairStyle === 'curly') && (
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

          {hairStyle === 'spiky' && (
            <g>
              <path d="M 28 27 L 31 14 L 38 21 L 43 10 L 50 20 L 57 9 L 63 21 L 70 14 L 72 27 Q 50 18 28 27 Z" />
              <polygon points="36,18 40,8 44,19" />
              <polygon points="56,19 60,8 64,18" />
            </g>
          )}

          {hairStyle === 'afro' && (
            <g>
              <circle cx="50" cy="20" r="18" />
              <circle cx="35" cy="24" r="14" />
              <circle cx="65" cy="24" r="14" />
              <circle cx="31" cy="33" r="10" />
              <circle cx="69" cy="33" r="10" />
            </g>
          )}

          {hairStyle === 'braids' && (
            <g>
              <ellipse cx="50" cy="22" rx="20" ry="12" />
              <line x1="38" y1="18" x2="38" y2="28" stroke="#f59e0b" strokeWidth="1.5" />
              <line x1="46" y1="16" x2="46" y2="28" stroke="#f59e0b" strokeWidth="1.5" />
              <line x1="54" y1="16" x2="54" y2="28" stroke="#f59e0b" strokeWidth="1.5" />
              <line x1="62" y1="18" x2="62" y2="28" stroke="#f59e0b" strokeWidth="1.5" />
            </g>
          )}

          {hairStyle === 'wavy' && (
            <g>
              <ellipse cx="50" cy="22" rx="21" ry="13" />
              <path d="M 28 25 Q 35 18 50 20 Q 65 18 72 25 Q 68 33 60 27 Q 50 31 40 27 Q 32 33 28 25 Z" />
            </g>
          )}

          {hairStyle === 'short' && (
            <g>
              <path d="M 31 29 Q 32 18 50 18 Q 68 18 69 29 Q 60 24 50 24 Q 40 24 31 29 Z" />
            </g>
          )}

          {hairStyle === 'explorer-bun' && (
            <g>
              <circle cx="50" cy="9" r="8" />
              <ellipse cx="50" cy="11" rx="5" ry="2" fill="#f59e0b" />
              <ellipse cx="50" cy="22" rx="20" ry="12" />
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

        {accessory === 'explorer-hat' && (
          <g filter="url(#shadow)">
            <ellipse cx="50" cy="20" rx="24" ry="4" fill="#78350f" />
            <path d="M 36 20 Q 37 9 50 9 Q 63 9 64 20 Z" fill="#92400e" />
            <rect x="36" y="17" width="28" height="3" fill="#f59e0b" />
          </g>
        )}

        {accessory === 'phonix-crown' && (
          <g filter="url(#shadow)">
            <polygon points="36,23 40,11 45,18 50,7 55,18 60,11 64,23" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
            <circle cx="50" cy="18" r="2" fill="#ef4444" />
          </g>
        )}

        {accessory === 'pilot-goggles' && (
          <g stroke="#0f172a" strokeWidth="1.5" fill="#38bdf8" fillOpacity="0.6">
            <rect x="37" y="19" width="11" height="7" rx="3" />
            <rect x="52" y="19" width="11" height="7" rx="3" />
            <line x1="48" y1="22" x2="52" y2="22" stroke="#475569" strokeWidth="2" />
            <line x1="30" y1="22" x2="37" y2="22" stroke="#475569" strokeWidth="2" />
            <line x1="63" y1="22" x2="70" y2="22" stroke="#475569" strokeWidth="2" />
          </g>
        )}

        {/* --- ANIMATED COMPANION PETS --- */}
        {showPet && (
          <g
            id="companion-pet"
            style={{
              transform: `translate(${isFlipped ? '-24px' : '62px'}, ${54 + Math.sin(internalClock * 1.5 + 1) * 3.5}px)`,
            }}
          >
            {companion === 'sea-turtle' && (
              <g filter="url(#shadow)">
                <ellipse cx="14" cy="14" rx="8" ry="6" fill="#047857" />
                <ellipse cx="14" cy="14" rx="6.5" ry="4.5" fill="#10b981" />
                <ellipse cx="21" cy="13" rx="3.5" ry="2.5" fill="#34d399" />
                <circle cx="22" cy="12.5" r="0.8" fill="#064e3b" />
                {/* Animated flippers */}
                <ellipse cx="17" cy="8" rx="4" ry="2" fill="#34d399" transform={`rotate(${-25 + Math.sin(internalClock * 2) * 15}, 17, 8)`} />
                <ellipse cx="17" cy="20" rx="4" ry="2" fill="#34d399" transform={`rotate(${25 - Math.sin(internalClock * 2) * 15}, 17, 20)`} />
              </g>
            )}

            {companion === 'baby-dragon' && (
              <g filter="url(#shadow)">
                <ellipse cx="14" cy="15" rx="8" ry="7" fill="#10b981" />
                <ellipse cx="14" cy="9" rx="6" ry="5.5" fill="#10b981" />
                <polygon points="12,4 10,1 14,3" fill="#f59e0b" />
                <polygon points="16,4 18,1 14,3" fill="#f59e0b" />
                {/* Flapping dragon wing */}
                <polygon
                  points="7,13 1,8 7,16"
                  fill="#059669"
                  transform={`rotate(${Math.sin(internalClock * 3) * 20}, 7, 13)`}
                />
                <circle cx="16" cy="8" r="1.5" fill="#1e293b" />
                <circle cx="21" cy="10" r="1.5" fill="#f97316" opacity="0.8" />
              </g>
            )}

            {(companion === 'golden-eagle' || companion === 'golden-phonix') && (
              <g filter="url(#shadow)">
                <ellipse cx="14" cy="14" rx="8" ry="7" fill="#b45309" />
                <circle cx="14" cy="8" r="5" fill="#f59e0b" />
                <polygon points="12,3 14,0 16,3" fill="#fbbf24" />
                {/* Flapping wings */}
                <path d="M 8 11 Q 0 3 6 16 Z" fill="#d97706" transform={`rotate(${Math.sin(internalClock * 3) * 18}, 8, 11)`} />
                <path d="M 20 11 Q 28 3 22 16 Z" fill="#d97706" transform={`rotate(${-Math.sin(internalClock * 3) * 18}, 20, 11)`} />
                <polygon points="17,8 23,9.5 17,11" fill="#fbbf24" />
                <circle cx="15" cy="7" r="1.3" fill="#1e293b" />
                <circle cx="15.3" cy="6.7" r="0.4" fill="#ffffff" />
                <path d="M 12 20 Q 9 27 13 28 Q 15 24 15 20 Z" fill="#92400e" />
                <circle cx="11" cy="21" r="1.2" fill="#fbbf24" />
                <circle cx="16" cy="21" r="1.2" fill="#fbbf24" />
              </g>
            )}

            {companion === 'feather-owl' && (
              <g filter="url(#shadow)">
                <ellipse cx="14" cy="14" rx="7.5" ry="7" fill="#4338ca" />
                <circle cx="14" cy="9" r="5" fill="#4f46e5" />
                <polygon points="10,5 9,2 12,4" fill="#a5b4fc" />
                <polygon points="18,5 19,2 16,4" fill="#a5b4fc" />
                <circle cx="11.5" cy="8.5" r="2.2" fill="#fef08a" />
                <circle cx="16.5" cy="8.5" r="2.2" fill="#fef08a" />
                <circle cx="11.5" cy="8.5" r="1" fill="#1e1b4b" />
                <circle cx="16.5" cy="8.5" r="1" fill="#1e1b4b" />
                <polygon points="13,10.5 15,10.5 14,12" fill="#f59e0b" />
              </g>
            )}

            {companion === 'woodland-fox' && (
              <g filter="url(#shadow)">
                <ellipse cx="14" cy="15" rx="7" ry="6" fill="#ea580c" />
                <circle cx="14" cy="9" r="4.5" fill="#ea580c" />
                <polygon points="10,6 9,2 12,5" fill="#ea580c" />
                <polygon points="18,6 19,2 16,5" fill="#ea580c" />
                <polygon points="10,5 9.5,3 11.5,4.5" fill="#fecdd3" />
                <polygon points="18,5 18.5,3 16.5,4.5" fill="#fecdd3" />
                <circle cx="12" cy="9" r="1" fill="#0f172a" />
                <circle cx="16" cy="9" r="1" fill="#0f172a" />
                <circle cx="14" cy="11.5" r="0.8" fill="#0f172a" />
                {/* Wagging tail */}
                <path
                  d="M 7 15 Q 1 12 3 19 Q 8 18 8 16 Z"
                  fill="#ea580c"
                  transform={`rotate(${Math.sin(internalClock * 4) * 20}, 7, 15)`}
                />
                <circle cx="2.5" cy="18" r="1.5" fill="#ffffff" />
              </g>
            )}

            {companion === 'bunny' && (
              <g filter="url(#shadow)">
                <ellipse cx="14" cy="15" rx="6.5" ry="5.5" fill="#f8fafc" />
                <circle cx="14" cy="10" r="4" fill="#f8fafc" />
                <ellipse cx="11.5" cy="4" rx="1.5" ry="4" fill="#f8fafc" />
                <ellipse cx="16.5" cy="4" rx="1.5" ry="4" fill="#f8fafc" />
                <ellipse cx="11.5" cy="4" rx="0.8" ry="3" fill="#f472b6" />
                <ellipse cx="16.5" cy="4" rx="0.8" ry="3" fill="#f472b6" />
                <circle cx="12.5" cy="10" r="0.9" fill="#0f172a" />
                <circle cx="15.5" cy="10" r="0.9" fill="#0f172a" />
                <polygon points="13.5,11.5 14.5,11.5 14,12.2" fill="#f472b6" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
