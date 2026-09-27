import React from 'react';

interface PhonicsLetterProps {
  letter: string;
  size?: number; // pixel width/height (default 48)
  className?: string;
  showBadge?: boolean;
  animate?: boolean;
}

// Full vector SVG character designs matching the attached alpha.jpg reference:
// A: Alligator, B: Bear, C: Cat, D: Dog, E: Elephant, F: Frog, G: Giraffe, H: Horse,
// I: Iguana, J: Jaguar, K: Kangaroo, L: Lion, M: Monkey, N: Bird, O: Owl, P: Pig,
// Q: Quail, R: Rabbit, S: Snake, T: Tiger, U: Monster/Unicorn, V: Vulture, W: Whale,
// X: X-ray Fish, Y: Yak, Z: Zebra.

export const ANIMAL_DETAILS: Record<string, { animal: string; partner: string; color: string }> = {
  A: { animal: 'Alligator', partner: 'Apple', color: '#16a34a' },
  B: { animal: 'Bear', partner: 'Baby', color: '#854d0e' },
  C: { animal: 'Cat', partner: 'Crab', color: '#eab308' },
  D: { animal: 'Dog', partner: 'Duck', color: '#b45309' },
  E: { animal: 'Elephant', partner: 'Earthworm', color: '#38bdf8' },
  F: { animal: 'Frog', partner: 'Fox', color: '#22c55e' },
  G: { animal: 'Giraffe', partner: 'Girl', color: '#f59e0b' },
  H: { animal: 'Horse', partner: 'House', color: '#92400e' },
  I: { animal: 'Iguana', partner: 'Ice Cream', color: '#10b981' },
  J: { animal: 'Jaguar', partner: 'Juice', color: '#f59e0b' },
  K: { animal: 'Kangaroo', partner: 'King', color: '#ea580c' },
  L: { animal: 'Lion', partner: 'Leaf', color: '#eab308' },
  M: { animal: 'Monkey', partner: 'Mountain', color: '#78350f' },
  N: { animal: 'Bird', partner: 'Net', color: '#0284c7' },
  O: { animal: 'Owl', partner: 'Orange', color: '#d97706' },
  P: { animal: 'Pig', partner: 'Panda', color: '#ec4899' },
  Q: { animal: 'Quail', partner: 'Queen', color: '#06b6d4' },
  R: { animal: 'Rabbit', partner: 'Robot', color: '#f43f5e' },
  S: { animal: 'Snake', partner: 'Snail', color: '#22c55e' },
  T: { animal: 'Tiger', partner: 'Turtle', color: '#ea580c' },
  U: { animal: 'Unicorn Sea Monster', partner: 'Umbrella', color: '#0ea5e9' },
  V: { animal: 'Vulture', partner: 'Vegetables', color: '#ca8a04' },
  W: { animal: 'Whale', partner: 'Wood', color: '#2563eb' },
  X: { animal: 'X-ray Fish', partner: 'Xylophone', color: '#06b6d4' },
  Y: { animal: 'Yak', partner: 'Yarn', color: '#eab308' },
  Z: { animal: 'Zebra', partner: 'Zipper', color: '#0f172a' },
};

export const PhonicsLetter: React.FC<PhonicsLetterProps> = ({
  letter,
  size = 48,
  className = '',
  showBadge = true,
  animate = false
}) => {
  const char = (letter || 'A').toUpperCase().charAt(0);
  const detail = ANIMAL_DETAILS[char] || { animal: 'Animal', partner: 'Friend', color: '#f59e0b' };

  // Render individual custom illustrated SVG animal characters
  const renderAnimalSvg = () => {
    switch (char) {
      case 'A':
        return (
          // Alligator shaped A with teeth, scales, and eyes
          <g>
            <path d="M 20 90 L 50 12 L 80 90 L 62 90 L 50 62 L 38 90 Z" fill="#22c55e" stroke="#15803d" strokeWidth="3" />
            <path d="M 38 62 L 62 62 L 50 34 Z" fill="#ffffff" />
            {/* Teeth */}
            <polygon points="42,62 46,55 50,62" fill="#fff" />
            <polygon points="50,62 54,55 58,62" fill="#fff" />
            {/* Alligator Eyes */}
            <circle cx="50" cy="16" r="10" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
            <circle cx="50" cy="16" r="5" fill="#fef08a" />
            <circle cx="51" cy="16" r="2.5" fill="#052e16" />
            {/* Scales & Nostrils */}
            <circle cx="34" cy="50" r="2.5" fill="#15803d" />
            <circle cx="66" cy="50" r="2.5" fill="#15803d" />
            <circle cx="30" cy="74" r="2.5" fill="#15803d" />
            <circle cx="70" cy="74" r="2.5" fill="#15803d" />
          </g>
        );

      case 'B':
        return (
          // Bear shaped B with round ears and snout
          <g>
            {/* Ears */}
            <circle cx="28" cy="16" r="10" fill="#92400e" stroke="#78350f" strokeWidth="2" />
            <circle cx="28" cy="16" r="5" fill="#fde68a" />
            <circle cx="72" cy="16" r="10" fill="#92400e" stroke="#78350f" strokeWidth="2" />
            <circle cx="72" cy="16" r="5" fill="#fde68a" />
            {/* B Body */}
            <path d="M 22 18 H 58 Q 78 18 78 40 Q 78 52 64 54 Q 82 56 82 76 Q 82 92 56 92 H 22 Z" fill="#92400e" stroke="#78350f" strokeWidth="3" />
            <path d="M 38 32 H 54 Q 64 32 64 42 Q 64 50 54 50 H 38 Z" fill="#fff" />
            <path d="M 38 60 H 56 Q 68 60 68 74 Q 68 82 56 82 H 38 Z" fill="#fff" />
            {/* Bear Face on upper bump */}
            <circle cx="52" cy="40" r="7" fill="#fde68a" />
            <circle cx="52" cy="38" r="2.5" fill="#451a03" />
            <circle cx="44" cy="32" r="2" fill="#451a03" />
            <circle cx="60" cy="32" r="2" fill="#451a03" />
          </g>
        );

      case 'C':
        return (
          // Cat shaped C with whiskers, pointy ears, and tail
          <g>
            {/* Pointy Cat Ears */}
            <polygon points="62,14 74,4 78,22" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="65,14 72,8 74,20" fill="#f43f5e" />
            {/* C Body */}
            <path d="M 76 28 Q 50 12 32 30 Q 14 50 30 74 Q 48 92 76 80 L 70 66 Q 52 74 42 62 Q 32 50 42 38 Q 52 26 70 36 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="3" />
            {/* Cat Face on top curve */}
            <circle cx="64" cy="24" r="3" fill="#451a03" />
            <polygon points="62,28 66,28 64,31" fill="#f43f5e" />
            {/* Whiskers */}
            <line x1="56" y1="28" x2="48" y2="26" stroke="#451a03" strokeWidth="1.5" />
            <line x1="56" y1="30" x2="48" y2="32" stroke="#451a03" strokeWidth="1.5" />
            {/* Striped Tail on bottom */}
            <path d="M 74 76 Q 88 80 84 92" stroke="#ca8a04" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'D':
        return (
          // Dog shaped D with floppy ear, snout and wagging tail
          <g>
            <path d="M 24 16 H 54 Q 84 16 84 54 Q 84 92 54 92 H 24 Z" fill="#b45309" stroke="#78350f" strokeWidth="3" />
            <path d="M 42 32 H 52 Q 68 32 68 54 Q 68 76 52 76 H 42 Z" fill="#ffffff" />
            {/* Floppy Hound Ear */}
            <path d="M 30 18 Q 16 28 20 46 Q 26 50 32 38 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
            {/* Dog Face */}
            <circle cx="48" cy="46" r="3" fill="#000" />
            <ellipse cx="60" cy="54" r="4" ry="3" fill="#000" />
            <path d="M 58 58 Q 60 64 64 60" fill="#f43f5e" />
            {/* Tail */}
            <path d="M 22 84 Q 10 80 14 70" stroke="#78350f" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'E':
        return (
          // Elephant shaped E with trunk and tusks
          <g>
            <path d="M 24 16 H 78 V 32 H 42 V 46 H 70 V 60 H 42 V 76 H 78 V 92 H 24 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="3" />
            {/* Trunk sweeping on top bar */}
            <path d="M 76 22 Q 92 24 88 38 Q 84 42 80 34" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Big Floppy Ear */}
            <path d="M 20 30 Q 10 46 22 62" fill="#7dd3fc" stroke="#0284c7" strokeWidth="2" />
            <circle cx="34" cy="24" r="3" fill="#0c4a6e" />
            {/* Tusk */}
            <polygon points="34,36 38,44 42,36" fill="#fff" stroke="#94a3b8" strokeWidth="1" />
          </g>
        );

      case 'F':
        return (
          // Frog shaped F with big googly eyes
          <g>
            <path d="M 26 16 H 78 V 34 H 44 V 50 H 70 V 66 H 44 V 92 H 26 Z" fill="#4ade80" stroke="#16a34a" strokeWidth="3" />
            {/* Big Googly Eyes */}
            <circle cx="34" cy="14" r="9" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
            <circle cx="34" cy="14" r="5" fill="#fff" />
            <circle cx="35" cy="13" r="2.5" fill="#000" />
            <circle cx="70" cy="14" r="9" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
            <circle cx="70" cy="14" r="5" fill="#fff" />
            <circle cx="69" cy="13" r="2.5" fill="#000" />
            {/* Spots */}
            <circle cx="56" cy="24" r="3" fill="#15803d" />
            <circle cx="34" cy="74" r="3" fill="#15803d" />
          </g>
        );

      case 'G':
        return (
          // Giraffe shaped G with horns, long neck, and spots
          <g>
            {/* Ossicone Horns */}
            <line x1="70" y1="18" x2="68" y2="8" stroke="#78350f" strokeWidth="3" />
            <circle cx="68" cy="7" r="3" fill="#b45309" />
            <line x1="76" y1="20" x2="78" y2="10" stroke="#78350f" strokeWidth="3" />
            <circle cx="78" cy="9" r="3" fill="#b45309" />
            {/* G Body */}
            <path d="M 76 26 Q 50 12 32 30 Q 14 50 30 74 Q 48 92 74 80 Q 82 74 82 56 H 52 V 42 H 94 V 68 Q 90 94 62 98 Q 30 100 12 70 Q -2 42 22 18 Q 48 -2 80 14 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2.5" />
            {/* Giraffe Spots */}
            <circle cx="32" cy="40" r="4" fill="#92400e" />
            <circle cx="42" cy="72" r="5" fill="#92400e" />
            <circle cx="62" cy="84" r="4" fill="#92400e" />
            <circle cx="28" cy="60" r="3" fill="#92400e" />
            {/* Giraffe Eye */}
            <circle cx="64" cy="24" r="2.5" fill="#451a03" />
          </g>
        );

      case 'H':
        return (
          // Horse shaped H with mane and tail
          <g>
            <path d="M 22 16 H 38 V 46 H 64 V 16 H 80 V 92 H 64 V 62 H 38 V 92 H 22 Z" fill="#a16207" stroke="#713f12" strokeWidth="3" />
            {/* Horse Mane on left bar */}
            <path d="M 22 16 Q 14 26 22 36 Q 14 46 22 56 Q 14 66 22 76" stroke="#451a03" strokeWidth="4" fill="none" />
            {/* Horse Head / Ears */}
            <polygon points="76,16 84,4 86,16" fill="#713f12" />
            <circle cx="72" cy="26" r="3" fill="#000" />
            <ellipse cx="72" cy="34" r="3" ry="2" fill="#713f12" />
          </g>
        );

      case 'I':
        return (
          // Iguana shaped I with dorsal crest
          <g>
            <path d="M 26 16 H 74 V 30 H 58 V 78 H 74 V 92 H 26 V 78 H 42 V 30 H 26 Z" fill="#10b981" stroke="#047857" strokeWidth="3" />
            {/* Dorsal Crest Spikes */}
            <polygon points="42,34 34,40 42,46" fill="#059669" />
            <polygon points="42,50 34,56 42,62" fill="#059669" />
            <polygon points="42,66 34,72 42,78" fill="#059669" />
            {/* Iguana Eye on top bar */}
            <circle cx="60" cy="22" r="3" fill="#facc15" />
            <circle cx="60" cy="22" r="1.5" fill="#000" />
          </g>
        );

      case 'J':
        return (
          // Jaguar shaped J with spots and tail curve
          <g>
            <path d="M 44 16 H 82 V 30 H 68 V 66 Q 68 84 52 90 Q 32 94 22 80 L 32 68 Q 40 76 52 74 Q 56 72 56 64 V 16 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="3" />
            {/* Jaguar Spots */}
            <circle cx="60" cy="38" r="2.5" fill="#78350f" />
            <circle cx="62" cy="54" r="3" fill="#78350f" />
            <circle cx="44" cy="80" r="2.5" fill="#78350f" />
            {/* Ears on top bar */}
            <polygon points="74,16 80,6 84,16" fill="#b45309" />
            <circle cx="70" cy="22" r="2" fill="#000" />
          </g>
        );

      case 'K':
        return (
          // Kangaroo shaped K with pouch and ears
          <g>
            <path d="M 22 16 H 38 V 92 H 22 Z" fill="#ea580c" stroke="#9a3412" strokeWidth="3" />
            <path d="M 38 58 L 68 16 H 86 L 52 60 L 88 92 H 68 L 38 64 Z" fill="#ea580c" stroke="#9a3412" strokeWidth="3" />
            {/* Kangaroo Ears */}
            <polygon points="28,16 32,4 36,16" fill="#9a3412" />
            <polygon points="24,16 26,6 30,16" fill="#fdba74" />
            {/* Face */}
            <circle cx="30" cy="24" r="2.5" fill="#000" />
            {/* Joey Pouch on stem */}
            <ellipse cx="30" cy="50" r="5" ry="6" fill="#fdba74" stroke="#9a3412" strokeWidth="1.5" />
            <circle cx="30" cy="48" r="1.5" fill="#000" />
          </g>
        );

      case 'L':
        return (
          // Lion shaped L with royal sunburst mane
          <g>
            <path d="M 24 16 H 42 V 76 H 82 V 92 H 24 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="3" />
            {/* Sunburst Lion Mane on top */}
            <circle cx="33" cy="26" r="18" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
            <circle cx="33" cy="26" r="12" fill="#facc15" />
            <circle cx="30" cy="24" r="2" fill="#000" />
            <circle cx="36" cy="24" r="2" fill="#000" />
            <polygon points="31,27 35,27 33,29" fill="#78350f" />
            {/* Tufted Lion Tail at bottom */}
            <circle cx="82" cy="84" r="6" fill="#ea580c" />
          </g>
        );

      case 'M':
        return (
          // Monkey shaped M with ears and curly tail
          <g>
            <path d="M 18 16 H 34 L 50 56 L 66 16 H 82 V 92 H 68 V 44 L 54 78 H 46 L 32 44 V 92 H 18 Z" fill="#78350f" stroke="#451a03" strokeWidth="3" />
            {/* Round Monkey Ears */}
            <circle cx="16" cy="22" r="6" fill="#fed7aa" stroke="#78350f" strokeWidth="2" />
            <circle cx="84" cy="22" r="6" fill="#fed7aa" stroke="#78350f" strokeWidth="2" />
            {/* Monkey Face in central dip */}
            <circle cx="50" cy="62" r="8" fill="#fed7aa" />
            <circle cx="48" cy="60" r="1.5" fill="#000" />
            <circle cx="52" cy="60" r="1.5" fill="#000" />
            <ellipse cx="50" cy="64" r="2" ry="1" fill="#78350f" />
            {/* Curled Tail */}
            <path d="M 80 84 Q 96 82 92 68 Q 88 64 86 68" stroke="#78350f" strokeWidth="3.5" fill="none" />
          </g>
        );

      case 'N':
        return (
          // Blue Bird / Nest shaped N
          <g>
            <path d="M 22 16 H 38 L 66 70 V 16 H 82 V 92 H 66 L 38 38 V 92 H 22 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="3" />
            {/* Bird Head & Beak on right bar */}
            <circle cx="74" cy="22" r="9" fill="#38bdf8" />
            <polygon points="82,20 94,22 82,26" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="75" cy="20" r="2" fill="#000" />
            {/* Wing details on diagonal */}
            <path d="M 46 44 Q 54 48 50 58" stroke="#bae6fd" strokeWidth="3" fill="none" />
          </g>
        );

      case 'O':
        return (
          // Owl shaped O with big eyes, horns and beak
          <g>
            {/* Feather Tufts / Horns */}
            <polygon points="26,20 34,6 40,22" fill="#92400e" />
            <polygon points="60,22 66,6 74,20" fill="#92400e" />
            {/* O Body */}
            <circle cx="50" cy="54" r="38" fill="#b45309" stroke="#78350f" strokeWidth="3" />
            <circle cx="50" cy="54" r="20" fill="#ffffff" />
            {/* Big Owl Eyes */}
            <circle cx="38" cy="46" r="9" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="38" cy="46" r="5" fill="#451a03" />
            <circle cx="62" cy="46" r="9" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="62" cy="46" r="5" fill="#451a03" />
            {/* Owl Beak */}
            <polygon points="46,50 54,50 50,58" fill="#ea580c" />
          </g>
        );

      case 'P':
        return (
          // Pig shaped P with snout and curly tail
          <g>
            <path d="M 24 16 H 60 Q 82 16 82 42 Q 82 66 60 66 H 42 V 92 H 24 Z" fill="#f472b6" stroke="#db2777" strokeWidth="3" />
            <path d="M 42 32 H 58 Q 68 32 68 42 Q 68 52 58 52 H 42 Z" fill="#ffffff" />
            {/* Piggy Ears */}
            <polygon points="30,16 34,4 40,16" fill="#ec4899" />
            <polygon points="56,16 62,4 66,16" fill="#ec4899" />
            {/* Pig Snout */}
            <ellipse cx="64" cy="42" r="7" ry="5" fill="#fbcfe8" stroke="#db2777" strokeWidth="1.5" />
            <circle cx="62" cy="42" r="1.5" fill="#9d174d" />
            <circle cx="66" cy="42" r="1.5" fill="#9d174d" />
            {/* Eye */}
            <circle cx="50" cy="38" r="2" fill="#000" />
            {/* Curly Tail at bottom */}
            <path d="M 24 84 Q 12 80 14 74 Q 18 72 16 80" stroke="#db2777" strokeWidth="2.5" fill="none" />
          </g>
        );

      case 'Q':
        return (
          // Quail shaped Q with feather plume
          <g>
            {/* Plume on top */}
            <path d="M 50 16 Q 52 4 60 4 Q 64 6 60 10 Q 56 12 50 16" fill="#0891b2" stroke="#0e7490" strokeWidth="2" />
            <circle cx="50" cy="54" r="36" fill="#06b6d4" stroke="#0891b2" strokeWidth="3" />
            <circle cx="50" cy="54" r="20" fill="#ffffff" />
            {/* Q Leg/Tail (Quail foot) */}
            <path d="M 64 68 L 88 92" stroke="#eab308" strokeWidth="7" strokeLinecap="round" />
            {/* Eye & Beak */}
            <circle cx="40" cy="46" r="3" fill="#000" />
            <polygon points="28,48 20,52 28,56" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
          </g>
        );

      case 'R':
        return (
          // Rabbit shaped R with long bunny ears
          <g>
            {/* Bunny Ears */}
            <path d="M 32 16 Q 28 -2 36 -2 Q 44 -2 40 16" fill="#f43f5e" stroke="#be123c" strokeWidth="2" />
            <path d="M 34 16 Q 32 4 36 4 Q 40 4 38 16" fill="#fecdd3" />
            <path d="M 44 16 Q 42 0 50 0 Q 58 0 52 16" fill="#f43f5e" stroke="#be123c" strokeWidth="2" />
            <path d="M 46 16 Q 44 6 48 6 Q 52 6 48 16" fill="#fecdd3" />
            {/* R Body */}
            <path d="M 24 16 H 58 Q 78 16 78 40 Q 78 58 60 60 L 82 92 H 62 L 44 62 H 42 V 92 H 24 Z" fill="#fb7185" stroke="#be123c" strokeWidth="3" />
            <path d="M 42 30 H 56 Q 64 30 64 40 Q 64 50 56 50 H 42 Z" fill="#ffffff" />
            {/* Rabbit Face */}
            <circle cx="52" cy="40" r="2.5" fill="#000" />
            <polygon points="56,43 59,43 57.5,45" fill="#be123c" />
          </g>
        );

      case 'S':
        return (
          // Snake shaped S with scales and friendly tongue
          <g>
            <path d="M 76 28 Q 74 14 54 14 Q 32 14 30 32 Q 28 50 56 54 Q 78 58 76 74 Q 74 92 48 92 Q 26 92 22 76 L 38 72 Q 40 80 50 80 Q 62 80 62 72 Q 62 64 46 60 Q 18 54 20 32 Q 22 14 50 4 Q 80 4 84 26 Z" fill="#22c55e" stroke="#15803d" strokeWidth="3" />
            {/* Snake Spots */}
            <circle cx="48" cy="24" r="3" fill="#facc15" />
            <circle cx="52" cy="66" r="3" fill="#facc15" />
            {/* Snake Head on top right */}
            <circle cx="78" cy="18" r="3" fill="#052e16" />
            <path d="M 84 18 L 94 16 M 94 16 L 98 12 M 94 16 L 98 20" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        );

      case 'T':
        return (
          // Tiger shaped T with orange/black stripes
          <g>
            <path d="M 18 16 H 82 V 32 H 58 V 92 H 42 V 32 H 18 Z" fill="#f97316" stroke="#c2410c" strokeWidth="3" />
            {/* Tiger Stripes */}
            <polygon points="26,16 32,24 38,16" fill="#18181b" />
            <polygon points="62,16 68,24 74,16" fill="#18181b" />
            <polygon points="42,46 50,42 42,50" fill="#18181b" />
            <polygon points="58,62 50,66 58,70" fill="#18181b" />
            {/* Tiger Ears on top */}
            <circle cx="22" cy="14" r="6" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
            <circle cx="22" cy="14" r="3" fill="#fff" />
            <circle cx="78" cy="14" r="6" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
            <circle cx="78" cy="14" r="3" fill="#fff" />
          </g>
        );

      case 'U':
        return (
          // Sea Monster / Unicorn U with cute horn and fins
          <g>
            {/* Golden Horn */}
            <polygon points="16,18 20,4 24,18" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
            {/* U Body */}
            <path d="M 22 16 H 38 V 64 Q 38 78 50 78 Q 62 78 62 64 V 16 H 78 V 64 Q 78 92 50 92 Q 22 92 22 64 Z" fill="#0ea5e9" stroke="#0369a1" strokeWidth="3" />
            {/* Face on left stalk */}
            <circle cx="30" cy="30" r="3" fill="#000" />
            <circle cx="30" cy="28" r="1" fill="#fff" />
            <circle cx="70" cy="30" r="3" fill="#000" />
            {/* Cute Spots */}
            <circle cx="40" cy="80" r="3" fill="#7dd3fc" />
            <circle cx="60" cy="80" r="3" fill="#7dd3fc" />
          </g>
        );

      case 'V':
        return (
          // Vulture shaped V with feathered wings and beak
          <g>
            <path d="M 16 16 H 34 L 50 68 L 66 16 H 84 L 58 92 H 42 Z" fill="#ca8a04" stroke="#854d0e" strokeWidth="3" />
            {/* Vulture Head in apex */}
            <circle cx="50" cy="62" r="8" fill="#f87171" stroke="#dc2626" strokeWidth="1.5" />
            <polygon points="46,64 54,64 50,74" fill="#facc15" />
            <circle cx="48" cy="60" r="1.5" fill="#000" />
            <circle cx="52" cy="60" r="1.5" fill="#000" />
            {/* Wing Feather Notches */}
            <path d="M 20 28 L 26 32 M 22 42 L 28 46" stroke="#713f12" strokeWidth="2.5" />
            <path d="M 80 28 L 74 32 M 78 42 L 72 46" stroke="#713f12" strokeWidth="2.5" />
          </g>
        );

      case 'W':
        return (
          // Whale shaped W with water spout from blowhole
          <g>
            {/* Water Spout */}
            <path d="M 50 20 Q 42 6 36 10 M 50 20 Q 58 6 64 10" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* W Body */}
            <path d="M 12 22 H 28 L 38 66 L 48 30 H 52 L 62 66 L 72 22 H 88 L 72 92 H 58 L 50 62 L 42 92 H 28 Z" fill="#2563eb" stroke="#1d4ed8" strokeWidth="3" />
            {/* Whale Eyes */}
            <circle cx="26" cy="38" r="3" fill="#fff" />
            <circle cx="27" cy="38" r="1.5" fill="#000" />
            <circle cx="74" cy="38" r="3" fill="#fff" />
            <circle cx="73" cy="38" r="1.5" fill="#000" />
            {/* Whale Belly Grooves */}
            <line x1="46" y1="74" x2="54" y2="74" stroke="#93c5fd" strokeWidth="2" />
            <line x1="44" y1="80" x2="56" y2="80" stroke="#93c5fd" strokeWidth="2" />
          </g>
        );

      case 'X':
        return (
          // X-ray Fish shaped X with skeletal bones
          <g>
            <path d="M 22 16 H 40 L 50 44 L 60 16 H 78 L 60 54 L 80 92 H 62 L 50 64 L 38 92 H 20 L 40 54 Z" fill="#06b6d4" stroke="#0891b2" strokeWidth="3" />
            {/* Skeleton Bone Ribs */}
            <line x1="32" y1="36" x2="42" y2="36" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="58" y1="36" x2="68" y2="36" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="72" x2="42" y2="72" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="58" y1="72" x2="68" y2="72" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            {/* Glowing Fish Eye */}
            <circle cx="50" cy="54" r="5" fill="#f43f5e" />
            <circle cx="50" cy="54" r="2.5" fill="#ffffff" />
          </g>
        );

      case 'Y':
        return (
          // Yak shaped Y with shaggy hair and curved horns
          <g>
            {/* Curved Yak Horns */}
            <path d="M 26 16 Q 10 6 18 0 Q 24 2 28 14" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
            <path d="M 74 16 Q 90 6 82 0 Q 76 2 72 14" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
            {/* Y Body */}
            <path d="M 20 16 H 38 L 50 48 L 62 16 H 80 L 58 64 V 92 H 42 V 64 Z" fill="#d97706" stroke="#92400e" strokeWidth="3" />
            {/* Shaggy Hair Tuft */}
            <circle cx="50" cy="40" r="7" fill="#78350f" />
            <circle cx="47" cy="38" r="1.5" fill="#fff" />
            <circle cx="53" cy="38" r="1.5" fill="#fff" />
          </g>
        );

      case 'Z':
      default:
        return (
          // Zebra shaped Z with black and white stripes and mane
          <g>
            <path d="M 20 16 H 80 V 32 L 38 76 H 80 V 92 H 20 V 76 L 62 32 H 20 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
            {/* Crisp Zebra Stripes */}
            <polygon points="30,16 38,32 46,16" fill="#0f172a" />
            <polygon points="56,16 64,32 72,16" fill="#0f172a" />
            <polygon points="40,56 50,56 46,64" fill="#0f172a" />
            <polygon points="30,76 38,92 46,76" fill="#0f172a" />
            <polygon points="56,76 64,92 72,76" fill="#0f172a" />
            {/* Zebra Head on top left */}
            <circle cx="22" cy="18" r="3" fill="#0f172a" />
            <polygon points="76,16 84,6 88,16" fill="#0f172a" />
          </g>
        );
    }
  };

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`relative inline-flex items-center justify-center select-none ${
        animate ? 'hover:scale-110 active:scale-95 transition-transform' : ''
      } ${className}`}
      title={`${char} for ${detail.animal} & ${detail.partner}`}
    >
      {/* Outer Card with Rounded Border, matching reference card format */}
      <div className="w-full h-full rounded-2xl bg-white p-1 border-2 border-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.18)] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Colorful Checked Frame Header */}
        <div
          style={{ backgroundColor: detail.color }}
          className="absolute top-0 inset-x-0 h-1.5 opacity-90"
        />

        {/* The Illustrated Animal Letter SVG */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
        >
          {renderAnimalSvg()}
        </svg>

        {/* Mini Animal / Buddy Badge in bottom right corner */}
        {showBadge && size >= 36 && (
          <span
            style={{ fontSize: `${Math.max(9, size * 0.22)}px` }}
            className="absolute bottom-0.5 right-1 font-mono font-black text-slate-800 leading-none opacity-90 drop-shadow"
          >
            {char.toLowerCase()}
          </span>
        )}
      </div>
    </div>
  );
};

export default PhonicsLetter;
