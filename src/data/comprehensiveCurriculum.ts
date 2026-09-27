import { LandId } from '../types/character';

export interface StageChallenge {
  stageNumber: number;
  skillTitle: string;
  instruction: string;
  spokenPrompt: string;
  targetSound: string;
  soundCue: string;
  choices: string[];
  correct: string;
  explanation: string;
  builderLetters?: string[];
  builderTarget?: string;
  whisperingParts?: {
    targetWord: string;
    part1: string;
    part2: string;
    choices1: string[];
    choices2: string[];
  };
}

// -------------------------------------------------------------
// LAND 1: SOUND SHALLOWS (Preschool & Kindergarten Starter)
// -------------------------------------------------------------
const SOUND_SHALLOWS_STAGES: Record<number, StageChallenge[]> = {
  1: [
    {
      stageNumber: 1,
      skillTitle: 'Letter Sound: /a/ (Short A)',
      instruction: 'Dive down! Which letter makes the /a/ sound like apple?',
      spokenPrompt: 'Listen carefully! Which letter makes the sound, ah?',
      targetSound: 'A /æ/',
      soundCue: 'ah as in apple',
      choices: ['A', 'B', 'C', 'D'],
      correct: 'A',
      explanation: 'Letter A makes the /a/ sound like in apple and ant!'
    },
    {
      stageNumber: 1,
      skillTitle: 'Letter Sound: /a/ (Short A)',
      instruction: 'Listen to the pure sound: ah. Pick the letter A!',
      spokenPrompt: 'Listen! Ah. Tap letter A!',
      targetSound: 'A /æ/',
      soundCue: 'ah',
      choices: ['A', 'E', 'O', 'U'],
      correct: 'A',
      explanation: 'Letter A is the first vowel of the alphabet!'
    }
  ],
  2: [
    {
      stageNumber: 2,
      skillTitle: 'Letter Sound: /b/',
      instruction: 'Pop the sound pearl! Which letter makes the /b/ sound like bear?',
      spokenPrompt: 'Listen! Which letter makes the sound, buh?',
      targetSound: 'B /b/',
      soundCue: 'buh as in bear',
      choices: ['B', 'D', 'P', 'T'],
      correct: 'B',
      explanation: 'Letter B makes the bouncy /b/ sound like in bear and ball!'
    },
    {
      stageNumber: 2,
      skillTitle: 'Letter Sound: /b/',
      instruction: 'Press your lips together: buh! Find letter B!',
      spokenPrompt: 'Press your lips together. Buh! Which letter is it?',
      targetSound: 'B /b/',
      soundCue: 'buh',
      choices: ['B', 'M', 'V', 'R'],
      correct: 'B',
      explanation: 'B says buh!'
    }
  ],
  3: [
    {
      stageNumber: 3,
      skillTitle: 'Letter Sound: /c/',
      instruction: 'Which letter makes the crisp /k/ sound like cat?',
      spokenPrompt: 'Listen! Which letter makes the sound, kuh?',
      targetSound: 'C /k/',
      soundCue: 'kuh as in cat',
      choices: ['C', 'S', 'G', 'O'],
      correct: 'C',
      explanation: 'Letter C makes the /k/ sound like in cat and cup!'
    },
    {
      stageNumber: 3,
      skillTitle: 'Letter Sound: /c/',
      instruction: 'Tap the letter that starts the word cat: kuh!',
      spokenPrompt: 'Kuh, kuh, cat. Find letter C!',
      targetSound: 'C /k/',
      soundCue: 'kuh',
      choices: ['C', 'K', 'T', 'D'],
      correct: 'C',
      explanation: 'Letter C starts the word cat!'
    }
  ],
  4: [
    {
      stageNumber: 4,
      skillTitle: 'Letter Sound: /d/',
      instruction: 'Tap your tongue! Which letter makes the /d/ sound like dog?',
      spokenPrompt: 'Listen! Which letter makes the sound, duh?',
      targetSound: 'D /d/',
      soundCue: 'duh as in dog',
      choices: ['D', 'B', 'T', 'P'],
      correct: 'D',
      explanation: 'Letter D makes the /d/ sound like in dog and duck!'
    }
  ],
  5: [
    {
      stageNumber: 5,
      skillTitle: 'Letter Sound: /e/ (Short E)',
      instruction: 'Listen to the pure sound: eh. Which letter says eh like elephant?',
      spokenPrompt: 'Listen! Which letter makes the sound, eh?',
      targetSound: 'E /ɛ/',
      soundCue: 'eh as in elephant',
      choices: ['E', 'A', 'I', 'O'],
      correct: 'E',
      explanation: 'Letter E makes the short /e/ sound like in egg and elephant!'
    }
  ],
  6: [
    {
      stageNumber: 6,
      skillTitle: 'Letter Sound: /f/',
      instruction: 'Blow soft air through your teeth: fff! Which letter is this?',
      spokenPrompt: 'Listen! Which letter makes the soft sound, fff?',
      targetSound: 'F /f/',
      soundCue: 'fff as in fish',
      choices: ['F', 'V', 'T', 'H'],
      correct: 'F',
      explanation: 'Letter F makes the gentle /f/ sound like in fish and frog!'
    }
  ],
  7: [
    {
      stageNumber: 7,
      skillTitle: 'Letter Sound: /g/',
      instruction: 'Gulp in your throat: guh! Which letter says guh like goat?',
      spokenPrompt: 'Listen! Which letter makes the sound, guh?',
      targetSound: 'G /ɡ/',
      soundCue: 'guh as in goat',
      choices: ['G', 'J', 'C', 'Q'],
      correct: 'G',
      explanation: 'Letter G makes the /g/ sound like in goat and gate!'
    }
  ],
  8: [
    {
      stageNumber: 8,
      skillTitle: 'Letter Sound: /h/',
      instruction: 'Breathe out a warm breath: hhh! Which letter says hhh like hat?',
      spokenPrompt: 'Breathe warm air. Hhh! Which letter is it?',
      targetSound: 'H /h/',
      soundCue: 'hhh as in hat',
      choices: ['H', 'F', 'P', 'N'],
      correct: 'H',
      explanation: 'Letter H makes the warm breathing /h/ sound like in hat and horse!'
    }
  ],
  9: [
    {
      stageNumber: 9,
      skillTitle: 'Letter Sound: /i/ (Short I)',
      instruction: 'Scrunch your nose: ih! Which vowel makes the sound in igloo?',
      spokenPrompt: 'Listen! Which letter makes the quick sound, ih?',
      targetSound: 'I /ɪ/',
      soundCue: 'ih as in igloo',
      choices: ['I', 'E', 'A', 'U'],
      correct: 'I',
      explanation: 'Letter I makes the short /i/ sound like in igloo and iguana!'
    }
  ],
  10: [
    {
      stageNumber: 10,
      skillTitle: 'Letter Sounds: /j/ & /k/',
      instruction: 'Listen: juh! Which letter makes the /j/ sound like jam?',
      spokenPrompt: 'Listen! Which letter makes the jumping sound, juh?',
      targetSound: 'J /dʒ/',
      soundCue: 'juh as in jam',
      choices: ['J', 'G', 'Y', 'Z'],
      correct: 'J',
      explanation: 'Letter J makes the cheerful /j/ sound like in jam and jet!'
    }
  ],
  11: [
    {
      stageNumber: 11,
      skillTitle: 'Letter Sounds: /l/ & /m/',
      instruction: 'Hum with your lips closed: mmm! Which letter is this?',
      spokenPrompt: 'Listen to the humming sound: mmm. Which letter is it?',
      targetSound: 'M /m/',
      soundCue: 'mmm as in moon',
      choices: ['M', 'N', 'W', 'V'],
      correct: 'M',
      explanation: 'Letter M makes the continuous hum /m/ like in moon and monkey!'
    }
  ],
  12: [
    {
      stageNumber: 12,
      skillTitle: 'Letter Sounds: /n/ & /o/',
      instruction: 'Open your mouth wide like a circle: ah! Which vowel is this?',
      spokenPrompt: 'Open wide. Ah! Which vowel is shaped like an open circle?',
      targetSound: 'O /ɒ/',
      soundCue: 'ah as in octopus',
      choices: ['O', 'U', 'A', 'C'],
      correct: 'O',
      explanation: 'Letter O makes the open /o/ sound like in octopus and otter!'
    }
  ],
  13: [
    {
      stageNumber: 13,
      skillTitle: 'Letter Sounds: /p/ & /q/',
      instruction: 'Pop your lips with air: puh! Which letter is this?',
      spokenPrompt: 'Pop your lips with air. Puh! Which letter is it?',
      targetSound: 'P /p/',
      soundCue: 'puh as in pig',
      choices: ['P', 'B', 'D', 'Q'],
      correct: 'P',
      explanation: 'Letter P makes the popping /p/ sound like in pig and pan!'
    }
  ],
  14: [
    {
      stageNumber: 14,
      skillTitle: 'Letter Sounds: /r/ & /s/',
      instruction: 'Hiss like a friendly snake: sss! Which letter is this?',
      spokenPrompt: 'Listen to the hissing sound: sss. Which letter is it?',
      targetSound: 'S /s/',
      soundCue: 'sss as in sun',
      choices: ['S', 'C', 'Z', 'F'],
      correct: 'S',
      explanation: 'Letter S makes the hissing /s/ sound like in sun and star!'
    }
  ],
  15: [
    {
      stageNumber: 15,
      skillTitle: 'Alphabet Mastery: Letters T through Z',
      instruction: 'Tap the pearl! Which letter makes the ticking /t/ sound like top?',
      spokenPrompt: 'Listen to the tapping sound: tuh. Which letter is it?',
      targetSound: 'T /t/',
      soundCue: 'tuh as in top',
      choices: ['T', 'D', 'P', 'K'],
      correct: 'T',
      explanation: 'Letter T makes the crisp tapping /t/ sound like in top and tiger!'
    }
  ],
  16: [
    {
      stageNumber: 16,
      skillTitle: '2-Letter Blend: -AT',
      instruction: 'Blend the pure sounds: ah - tuh. What 2-letter word is this?',
      spokenPrompt: 'Blend these two sounds: ah - tuh. What word is it?',
      targetSound: 'A + T = AT',
      soundCue: 'ah - tuh blends into at',
      choices: ['AT', 'IT', 'ON', 'UP'],
      correct: 'AT',
      explanation: 'A + T blends into the word AT!'
    }
  ],
  17: [
    {
      stageNumber: 17,
      skillTitle: '2-Letter Blend: -AN',
      instruction: 'Blend the sounds: ah - nnn. What 2-letter word do they build?',
      spokenPrompt: 'Blend: ah - nnn. What word does it build?',
      targetSound: 'A + N = AN',
      soundCue: 'ah - nnn blends into an',
      choices: ['AN', 'AM', 'AS', 'AT'],
      correct: 'AN',
      explanation: 'A + N blends together into AN!'
    }
  ],
  18: [
    {
      stageNumber: 18,
      skillTitle: '2-Letter Blend: -AM & -AS',
      instruction: 'Blend: ah - mmm. Which word forms when we blend these sounds?',
      spokenPrompt: 'Blend: ah - mmm. What word is it?',
      targetSound: 'A + M = AM',
      soundCue: 'ah - mmm blends into am',
      choices: ['AM', 'AN', 'AT', 'AS'],
      correct: 'AM',
      explanation: 'A + M creates the word AM!'
    }
  ],
  19: [
    {
      stageNumber: 19,
      skillTitle: '2-Letter Blend: -IN',
      instruction: 'Dive down! Blend the sounds: ih - nnn. What word is it?',
      spokenPrompt: 'Blend: ih - nnn. What word is inside the pearl?',
      targetSound: 'I + N = IN',
      soundCue: 'ih - nnn blends into in',
      choices: ['IN', 'ON', 'AN', 'IT'],
      correct: 'IN',
      explanation: 'I + N blends into the word IN!'
    }
  ],
  20: [
    {
      stageNumber: 20,
      skillTitle: '2-Letter Blend: -IT',
      instruction: 'Blend: ih - tuh. What small 2-letter word does this make?',
      spokenPrompt: 'Listen: ih - tuh. What word do you hear?',
      targetSound: 'I + T = IT',
      soundCue: 'ih - tuh blends into it',
      choices: ['IT', 'AT', 'IF', 'IN'],
      correct: 'IT',
      explanation: 'I + T blends into the word IT!'
    }
  ],
  21: [
    {
      stageNumber: 21,
      skillTitle: '2-Letter Blend: -ON & -OX',
      instruction: 'Blend: ah - nnn. Which 2-letter word lights up?',
      spokenPrompt: 'Blend: ah - nnn. Which word is it?',
      targetSound: 'O + N = ON',
      soundCue: 'ah - nnn blends into on',
      choices: ['ON', 'IN', 'NO', 'AN'],
      correct: 'ON',
      explanation: 'O + N makes the word ON!'
    }
  ],
  22: [
    {
      stageNumber: 22,
      skillTitle: '2-Letter Blend: -UP',
      instruction: 'Swim to the surface! Blend: uh - puh. What word is it?',
      spokenPrompt: 'Blend: uh - puh. What word is this?',
      targetSound: 'U + P = UP',
      soundCue: 'uh - puh blends into up',
      choices: ['UP', 'US', 'ON', 'UT'],
      correct: 'UP',
      explanation: 'U + P makes the word UP!'
    }
  ],
  23: [
    {
      stageNumber: 23,
      skillTitle: '2-Letter Blend: -US',
      instruction: 'Blend: uh - sss. Which 2-letter word brings us together?',
      spokenPrompt: 'Blend: uh - sss. What word does it spell?',
      targetSound: 'U + S = US',
      soundCue: 'uh - sss blends into us',
      choices: ['US', 'UP', 'AS', 'IS'],
      correct: 'US',
      explanation: 'U + S makes the word US!'
    }
  ],
  24: [
    {
      stageNumber: 24,
      skillTitle: '2-Letter Blend: -IF & -IS',
      instruction: 'Blend: ih - sss. What common 2-letter word forms?',
      spokenPrompt: 'Blend: ih - sss. What word do you hear?',
      targetSound: 'I + S = IS',
      soundCue: 'ih - sss blends into is',
      choices: ['IS', 'IF', 'IN', 'IT'],
      correct: 'IS',
      explanation: 'I + S makes the word IS!'
    }
  ],
  25: [
    {
      stageNumber: 25,
      skillTitle: '2-Letter Blend: -OX',
      instruction: 'Blend: ah - ksss. Which word names the strong ox?',
      spokenPrompt: 'Blend: ah - ksss. What word is it?',
      targetSound: 'O + X = OX',
      soundCue: 'ah - ksss blends into ox',
      choices: ['OX', 'AX', 'ON', 'EX'],
      correct: 'OX',
      explanation: 'O + X makes the word OX!'
    }
  ],
  26: [
    {
      stageNumber: 26,
      skillTitle: 'CVC Short A: -AT Family',
      instruction: 'Listen to the pure sounds: k - ah - t. Spell the word!',
      spokenPrompt: 'Listen: k - ah - t. Which word does this spell?',
      targetSound: 'CAT',
      soundCue: 'k - ah - t',
      choices: ['CAT', 'BAT', 'HAT', 'COT'],
      correct: 'CAT',
      explanation: 'k - ah - t blends into CAT!'
    },
    {
      stageNumber: 26,
      skillTitle: 'CVC Short A: -AT Family',
      instruction: 'Listen to the sounds: b - ah - t. Pick the word BAT!',
      spokenPrompt: 'Listen: b - ah - t. What word is it?',
      targetSound: 'BAT',
      soundCue: 'b - ah - t',
      choices: ['BAT', 'BET', 'BIT', 'BAG'],
      correct: 'BAT',
      explanation: 'b - ah - t spells BAT!'
    }
  ],
  27: [
    {
      stageNumber: 27,
      skillTitle: 'CVC Short A: -AN Family',
      instruction: 'Listen: f - ah - nnn. Which word has a spinning fan?',
      spokenPrompt: 'Listen: f - ah - nnn. Spell the word!',
      targetSound: 'FAN',
      soundCue: 'f - ah - nnn',
      choices: ['FAN', 'FIN', 'FUN', 'FAT'],
      correct: 'FAN',
      explanation: 'f - ah - nnn spells FAN!'
    }
  ],
  28: [
    {
      stageNumber: 28,
      skillTitle: 'CVC Short A: -AP Family',
      instruction: 'Listen: m - ah - puh. What word guides us on our adventure?',
      spokenPrompt: 'Listen: m - ah - puh. What word is it?',
      targetSound: 'MAP',
      soundCue: 'm - ah - puh',
      choices: ['MAP', 'MOP', 'MUG', 'MAT'],
      correct: 'MAP',
      explanation: 'm - ah - puh spells MAP!'
    }
  ],
  29: [
    {
      stageNumber: 29,
      skillTitle: 'CVC Short A: -AG Family',
      instruction: 'Listen: b - ah - guh. What holds all your treasure?',
      spokenPrompt: 'Listen: b - ah - guh. What word is it?',
      targetSound: 'BAG',
      soundCue: 'b - ah - guh',
      choices: ['BAG', 'BUG', 'BEG', 'BIG'],
      correct: 'BAG',
      explanation: 'b - ah - guh spells BAG!'
    }
  ],
  30: [
    {
      stageNumber: 30,
      skillTitle: 'CVC Short A: Rhyme Time',
      instruction: 'Which word rhymes with CAT and ends with -AT?',
      spokenPrompt: 'Which word rhymes with cat? Listen for the at sound!',
      targetSound: '-AT Rhyme',
      soundCue: 'rhymes with cat',
      choices: ['HAT', 'HOT', 'HUT', 'HUG'],
      correct: 'HAT',
      explanation: 'CAT and HAT both rhyme in -AT!'
    }
  ],
  31: [
    {
      stageNumber: 31,
      skillTitle: 'CVC Short E: -ED Family',
      instruction: 'Listen: b - eh - d. Where do you sleep at night?',
      spokenPrompt: 'Listen: b - eh - d. Spell the word!',
      targetSound: 'BED',
      soundCue: 'b - eh - d',
      choices: ['BED', 'BAD', 'BUD', 'BAT'],
      correct: 'BED',
      explanation: 'b - eh - d spells BED!'
    }
  ],
  32: [
    {
      stageNumber: 32,
      skillTitle: 'CVC Short E: -ED Color',
      instruction: 'Listen: r - eh - d. What vibrant color is this?',
      spokenPrompt: 'Listen: r - eh - d. What color is it?',
      targetSound: 'RED',
      soundCue: 'r - eh - d',
      choices: ['RED', 'ROD', 'RAD', 'RID'],
      correct: 'RED',
      explanation: 'r - eh - d spells RED!'
    }
  ],
  33: [
    {
      stageNumber: 33,
      skillTitle: 'CVC Short E: -ET Family',
      instruction: 'Listen: n - eh - t. What catches seashells in the water?',
      spokenPrompt: 'Listen: n - eh - t. What word is it?',
      targetSound: 'NET',
      soundCue: 'n - eh - t',
      choices: ['NET', 'NUT', 'NOT', 'NEAT'],
      correct: 'NET',
      explanation: 'n - eh - t spells NET!'
    }
  ],
  34: [
    {
      stageNumber: 34,
      skillTitle: 'CVC Short E: -EN Family',
      instruction: 'Listen: h - eh - nnn. Which bird pecks on the farm?',
      spokenPrompt: 'Listen: h - eh - nnn. Spell the word!',
      targetSound: 'HEN',
      soundCue: 'h - eh - nnn',
      choices: ['HEN', 'HAT', 'HOT', 'HUT'],
      correct: 'HEN',
      explanation: 'h - eh - nnn spells HEN!'
    }
  ],
  35: [
    {
      stageNumber: 35,
      skillTitle: 'CVC Short E: Rhyme Time',
      instruction: 'What rhymes with NET and gets soaked in water?',
      spokenPrompt: 'What rhymes with net? Listen for the et sound!',
      targetSound: '-ET Rhyme',
      soundCue: 'rhymes with net',
      choices: ['WET', 'WIN', 'WEB', 'WAG'],
      correct: 'WET',
      explanation: 'NET and WET both rhyme in -ET!'
    }
  ],
  36: [
    {
      stageNumber: 36,
      skillTitle: 'CVC Short I: -IG Family',
      instruction: 'Listen: p - ih - guh. Which animal says oink?',
      spokenPrompt: 'Listen: p - ih - guh. Spell the word!',
      targetSound: 'PIG',
      soundCue: 'p - ih - guh',
      choices: ['PIG', 'PUG', 'PEG', 'PIN'],
      correct: 'PIG',
      explanation: 'p - ih - guh spells PIG!'
    }
  ],
  37: [
    {
      stageNumber: 37,
      skillTitle: 'CVC Short I: -IN Family',
      instruction: 'Listen: f - ih - nnn. What helps a dolphin swim fast?',
      spokenPrompt: 'Listen: f - ih - nnn. Spell the word!',
      targetSound: 'FIN',
      soundCue: 'f - ih - nnn',
      choices: ['FIN', 'FAN', 'FUN', 'FIT'],
      correct: 'FIN',
      explanation: 'f - ih - nnn spells FIN!'
    }
  ],
  38: [
    {
      stageNumber: 38,
      skillTitle: 'CVC Short I: -IP Family',
      instruction: 'Listen: z - ih - puh. Fasten your jacket with a zip!',
      spokenPrompt: 'Listen: z - ih - puh. Spell the word!',
      targetSound: 'ZIP',
      soundCue: 'z - ih - puh',
      choices: ['ZIP', 'ZAP', 'LIP', 'TIP'],
      correct: 'ZIP',
      explanation: 'z - ih - puh spells ZIP!'
    }
  ],
  39: [
    {
      stageNumber: 39,
      skillTitle: 'CVC Short I: -IT Family',
      instruction: 'Listen: s - ih - t. Rest in a chair and sit down!',
      spokenPrompt: 'Listen: s - ih - t. What word is it?',
      targetSound: 'SIT',
      soundCue: 's - ih - t',
      choices: ['SIT', 'SAT', 'SET', 'SUN'],
      correct: 'SIT',
      explanation: 's - ih - t spells SIT!'
    }
  ],
  40: [
    {
      stageNumber: 40,
      skillTitle: 'CVC Short I: Rhyme Time',
      instruction: 'Which word rhymes with PIG and means giant?',
      spokenPrompt: 'Which word rhymes with pig? Listen for the ig sound!',
      targetSound: '-IG Rhyme',
      soundCue: 'rhymes with pig',
      choices: ['BIG', 'BAG', 'BED', 'BOY'],
      correct: 'BIG',
      explanation: 'PIG and BIG rhyme together in -IG!'
    }
  ],
  41: [
    {
      stageNumber: 41,
      skillTitle: 'CVC Short O: -OG Family',
      instruction: 'Listen: d - ah - guh. Who is a loyal barking friend?',
      spokenPrompt: 'Listen: d - ah - guh. Spell the word!',
      targetSound: 'DOG',
      soundCue: 'd - ah - guh',
      choices: ['DOG', 'DIG', 'DUG', 'DOT'],
      correct: 'DOG',
      explanation: 'd - ah - guh spells DOG!'
    }
  ],
  42: [
    {
      stageNumber: 42,
      skillTitle: 'CVC Short O: -OX Family',
      instruction: 'Listen: f - ah - ksss. Which clever animal lives in the woods?',
      spokenPrompt: 'Listen: f - ah - ksss. Spell the word!',
      targetSound: 'FOX',
      soundCue: 'fff - ah - ksss',
      choices: ['FOX', 'FIX', 'FAX', 'BOX'],
      correct: 'FOX',
      explanation: 'fff - ah - ksss blends cleanly into FOX!'
    }
  ],
  43: [
    {
      stageNumber: 43,
      skillTitle: 'CVC Short O: -OP Family',
      instruction: 'Listen: t - ah - puh. What spins around on the table?',
      spokenPrompt: 'Listen: t - ah - puh. Spell the word!',
      targetSound: 'TOP',
      soundCue: 't - ah - puh',
      choices: ['TOP', 'TIP', 'TAP', 'TUB'],
      correct: 'TOP',
      explanation: 't - ah - puh spells TOP!'
    }
  ],
  44: [
    {
      stageNumber: 44,
      skillTitle: 'CVC Short O: -OT Family',
      instruction: 'Listen: p - ah - t. What cooks warm soup on the stove?',
      spokenPrompt: 'Listen: p - ah - t. Spell the word!',
      targetSound: 'POT',
      soundCue: 'p - ah - t',
      choices: ['POT', 'PET', 'PIT', 'PAT'],
      correct: 'POT',
      explanation: 'p - ah - t spells POT!'
    }
  ],
  45: [
    {
      stageNumber: 45,
      skillTitle: 'CVC Short O: Rhyme Time',
      instruction: 'What rhymes with DOG and sits in the forest as wood?',
      spokenPrompt: 'What rhymes with dog? Listen for the og sound!',
      targetSound: '-OG Rhyme',
      soundCue: 'rhymes with dog',
      choices: ['LOG', 'LEG', 'LIP', 'LOT'],
      correct: 'LOG',
      explanation: 'DOG and LOG both rhyme in -OG!'
    }
  ],
  46: [
    {
      stageNumber: 46,
      skillTitle: 'CVC Short U: -UN Family',
      instruction: 'Listen: s - uh - nnn. What shines bright in the day sky?',
      spokenPrompt: 'Listen: s - uh - nnn. Spell the word!',
      targetSound: 'SUN',
      soundCue: 'sss - uh - nnn',
      choices: ['SUN', 'SIN', 'RUN', 'SON'],
      correct: 'SUN',
      explanation: 'sss - uh - nnn spells SUN!'
    }
  ],
  47: [
    {
      stageNumber: 47,
      skillTitle: 'CVC Short U: -UP Family',
      instruction: 'Listen: k - uh - puh. What do you drink warm cocoa from?',
      spokenPrompt: 'Listen: k - uh - puh. Spell the word!',
      targetSound: 'CUP',
      soundCue: 'k - uh - puh',
      choices: ['CUP', 'CAP', 'COP', 'CUT'],
      correct: 'CUP',
      explanation: 'k - uh - puh spells CUP!'
    }
  ],
  48: [
    {
      stageNumber: 48,
      skillTitle: 'CVC Short U: -UG Family',
      instruction: 'Listen: b - uh - guh. What small insect crawls on a leaf?',
      spokenPrompt: 'Listen: b - uh - guh. Spell the word!',
      targetSound: 'BUG',
      soundCue: 'b - uh - guh',
      choices: ['BUG', 'BAG', 'BEG', 'BIG'],
      correct: 'BUG',
      explanation: 'b - uh - guh spells BUG!'
    }
  ],
  49: [
    {
      stageNumber: 49,
      skillTitle: 'CVC Short U: -UT Family',
      instruction: 'Listen: n - uh - t. What crunchy treat does a squirrel hide?',
      spokenPrompt: 'Listen: n - uh - t. Spell the word!',
      targetSound: 'NUT',
      soundCue: 'n - uh - t',
      choices: ['NUT', 'NET', 'NOT', 'NEAT'],
      correct: 'NUT',
      explanation: 'n - uh - t spells NUT!'
    }
  ],
  50: [
    {
      stageNumber: 50,
      skillTitle: 'Sound Shallows Grand Finale: CVC Master Blend',
      instruction: 'Super star! Blend all 3 sounds: s - uh - nnn to rescue the reef!',
      spokenPrompt: 'Grand Finale! Blend: s - uh - nnn. Spell the glorious sun!',
      targetSound: 'SUN',
      soundCue: 'sss - uh - nnn',
      choices: ['SUN', 'STAR', 'SEA', 'SAND'],
      correct: 'SUN',
      explanation: 'You mastered all pure sounds and CVC words in Sound Shallows!'
    }
  ]
};

// -------------------------------------------------------------
// LAND 2: BUILDERS GUILD WORDS BANK
// -------------------------------------------------------------
const BUILDERS_WORDS_BANK: { word: string; category: string; soundCue: string; distractors: string[] }[] = [
  { word: 'BED', category: 'CVC Foundation', soundCue: 'b - eh - d', distractors: ['M', 'T', 'S', 'P', 'A'] },
  { word: 'CAT', category: 'CVC Foundation', soundCue: 'k - ah - t', distractors: ['B', 'O', 'M', 'P', 'S'] },
  { word: 'DOG', category: 'CVC Foundation', soundCue: 'd - ah - g', distractors: ['P', 'I', 'N', 'T', 'B'] },
  { word: 'SUN', category: 'CVC Foundation', soundCue: 's - uh - n', distractors: ['M', 'P', 'T', 'A', 'B'] },
  { word: 'CUP', category: 'CVC Foundation', soundCue: 'k - uh - p', distractors: ['S', 'T', 'B', 'M', 'N'] },
  { word: 'FOX', category: 'CVC Foundation', soundCue: 'f - ah - ks', distractors: ['B', 'T', 'M', 'P', 'S'] },
  { word: 'MAP', category: 'CVC Foundation', soundCue: 'm - ah - p', distractors: ['T', 'S', 'B', 'N', 'O'] },
  { word: 'NET', category: 'CVC Foundation', soundCue: 'n - eh - t', distractors: ['P', 'B', 'S', 'M', 'A'] },
  { word: 'PIG', category: 'CVC Foundation', soundCue: 'p - ih - g', distractors: ['B', 'T', 'M', 'N', 'O'] },
  { word: 'TUB', category: 'CVC Foundation', soundCue: 't - uh - b', distractors: ['S', 'M', 'P', 'N', 'E'] },

  { word: 'SHIP', category: 'Digraph SH', soundCue: 'sh - ih - p', distractors: ['T', 'M', 'B', 'N'] },
  { word: 'CHIN', category: 'Digraph CH', soundCue: 'ch - ih - n', distractors: ['P', 'T', 'B', 'S'] },
  { word: 'FISH', category: 'Digraph SH', soundCue: 'f - ih - sh', distractors: ['T', 'M', 'B', 'P'] },
  { word: 'CHOP', category: 'Digraph CH', soundCue: 'ch - ah - p', distractors: ['T', 'S', 'M', 'B'] },
  { word: 'SHOP', category: 'Digraph SH', soundCue: 'sh - ah - p', distractors: ['T', 'M', 'B', 'N'] },
  { word: 'THAT', category: 'Digraph TH', soundCue: 'th - ah - t', distractors: ['M', 'P', 'S', 'B'] },
  { word: 'WITH', category: 'Digraph TH', soundCue: 'w - ih - th', distractors: ['M', 'P', 'S', 'B'] },
  { word: 'WHIP', category: 'Digraph WH', soundCue: 'wh - ih - p', distractors: ['T', 'M', 'B', 'S'] },
  { word: 'DUCK', category: 'Digraph CK', soundCue: 'd - uh - ck', distractors: ['T', 'M', 'P', 'S'] },
  { word: 'LOCK', category: 'Digraph CK', soundCue: 'l - ah - ck', distractors: ['T', 'M', 'P', 'B'] },

  { word: 'CLAP', category: 'L-Blend CL', soundCue: 'k - l - ah - p', distractors: ['M', 'T', 'S', 'B'] },
  { word: 'FROG', category: 'R-Blend FR', soundCue: 'f - r - ah - g', distractors: ['M', 'T', 'S', 'B'] },
  { word: 'DRUM', category: 'R-Blend DR', soundCue: 'd - r - uh - m', distractors: ['P', 'T', 'S', 'B'] },
  { word: 'FLAG', category: 'L-Blend FL', soundCue: 'f - l - ah - g', distractors: ['M', 'T', 'S', 'P'] },
  { word: 'SLIP', category: 'S-Blend SL', soundCue: 's - l - ih - p', distractors: ['M', 'T', 'B', 'N'] },
  { word: 'CRAB', category: 'R-Blend CR', soundCue: 'k - r - ah - b', distractors: ['M', 'T', 'S', 'P'] },
  { word: 'DROP', category: 'R-Blend DR', soundCue: 'd - r - ah - p', distractors: ['M', 'T', 'S', 'B'] },
  { word: 'TRIP', category: 'R-Blend TR', soundCue: 't - r - ih - p', distractors: ['M', 'S', 'B', 'N'] },
  { word: 'GRAB', category: 'R-Blend GR', soundCue: 'g - r - ah - b', distractors: ['M', 'T', 'S', 'P'] },
  { word: 'PLUM', category: 'L-Blend PL', soundCue: 'p - l - uh - m', distractors: ['T', 'S', 'B', 'N'] },

  { word: 'CAMP', category: 'Ending Blend MP', soundCue: 'k - ah - m - p', distractors: ['S', 'T', 'B', 'N'] },
  { word: 'JUMP', category: 'Ending Blend MP', soundCue: 'j - uh - m - p', distractors: ['S', 'T', 'B', 'N'] },
  { word: 'NEST', category: 'Ending Blend ST', soundCue: 'n - eh - s - t', distractors: ['M', 'P', 'B', 'O'] },
  { word: 'MILK', category: 'Ending Blend LK', soundCue: 'm - ih - l - k', distractors: ['S', 'P', 'T', 'B'] },
  { word: 'SINK', category: 'Ending Blend NK', soundCue: 's - ih - n - k', distractors: ['M', 'T', 'P', 'B'] },
  { word: 'TENT', category: 'Ending Blend NT', soundCue: 't - eh - n - t', distractors: ['M', 'P', 'S', 'B'] },
  { word: 'WIND', category: 'Ending Blend ND', soundCue: 'w - ih - n - d', distractors: ['M', 'P', 'S', 'T'] },
  { word: 'DESK', category: 'Ending Blend SK', soundCue: 'd - eh - s - k', distractors: ['M', 'P', 'T', 'B'] },
  { word: 'BELT', category: 'Ending Blend LT', soundCue: 'b - eh - l - t', distractors: ['M', 'P', 'S', 'N'] },
  { word: 'HAND', category: 'Ending Blend ND', soundCue: 'h - ah - n - d', distractors: ['M', 'P', 'S', 'T'] },

  { word: 'BELL', category: 'Double Letter LL', soundCue: 'b - eh - l', distractors: ['M', 'P', 'S', 'T', 'O'] },
  { word: 'HILL', category: 'Double Letter LL', soundCue: 'h - ih - l', distractors: ['M', 'P', 'S', 'T', 'A'] },
  { word: 'WALL', category: 'Double Letter LL', soundCue: 'w - aw - l', distractors: ['M', 'P', 'S', 'T', 'E'] },
  { word: 'BUZZ', category: 'Double Letter ZZ', soundCue: 'b - uh - z', distractors: ['M', 'P', 'S', 'T', 'A'] },
  { word: 'KISS', category: 'Double Letter SS', soundCue: 'k - ih - s', distractors: ['M', 'P', 'T', 'B', 'A'] },
  { word: 'TRUCK', category: 'Blend & CK', soundCue: 't - r - uh - ck', distractors: ['M', 'P', 'S'] },
  { word: 'CLOCK', category: 'Blend & CK', soundCue: 'k - l - ah - ck', distractors: ['M', 'P', 'S'] },
  { word: 'BRICK', category: 'Blend & CK', soundCue: 'b - r - ih - ck', distractors: ['M', 'P', 'S'] },
  { word: 'BLOCK', category: 'Blend & CK', soundCue: 'b - l - ah - ck', distractors: ['M', 'P', 'S'] },
  { word: 'PLANT', category: 'Blends PL & NT', soundCue: 'p - l - ah - n - t', distractors: ['M', 'S', 'B'] }
];

const getBuilderGuildChallenge = (stageNum: number): StageChallenge => {
  const item = BUILDERS_WORDS_BANK[(stageNum - 1) % BUILDERS_WORDS_BANK.length];
  const targetLetters = item.word.toUpperCase().split('');
  const uniqueTargetLetters = Array.from(new Set(targetLetters));

  const pool = [...uniqueTargetLetters];

  for (const d of item.distractors) {
    if (pool.length >= 8) break;
    const cleanD = d.toUpperCase();
    if (!pool.includes(cleanD)) {
      pool.push(cleanD);
    }
  }

  const extras = ['S', 'T', 'R', 'N', 'L', 'M', 'P', 'B', 'C', 'D', 'A', 'E', 'I', 'O', 'U'];
  for (const e of extras) {
    if (pool.length >= 8) break;
    if (!pool.includes(e)) {
      pool.push(e);
    }
  }

  for (const letter of uniqueTargetLetters) {
    if (!pool.includes(letter)) {
      pool.unshift(letter);
    }
  }

  const shuffledChoices = pool.slice(0, 8).sort(() => 0.5 - Math.random());

  return {
    stageNumber: stageNum,
    skillTitle: `Stone Masonry: ${item.category} (${item.word})`,
    instruction: `Pick the letter tiles in order to build: ${item.word}!`,
    spokenPrompt: `Listen carefully! Pick the letter tiles in order to build: ${item.word}!`,
    targetSound: item.word,
    soundCue: item.soundCue,
    choices: shuffledChoices,
    correct: item.word,
    explanation: `${item.word} is stacked keystone by keystone in perfect order!`,
    builderLetters: shuffledChoices,
    builderTarget: item.word
  };
};

// -------------------------------------------------------------
// LAND 3: TRICKY TRAILS (2nd - 3rd Grade)
// -------------------------------------------------------------
const TRICKY_TRAILS_STAGES: Record<number, StageChallenge[]> = {
  1: [
    {
      stageNumber: 1,
      skillTitle: 'Magic Silent E: A_E (Long A)',
      instruction: 'Add magic silent E to CAP. What tasty treat does it become?',
      spokenPrompt: 'Add magic silent E to cap. What long A word does it become?',
      targetSound: 'CAP + MAGIC E = ?',
      soundCue: 'magic E makes A say its name',
      choices: ['CAPE', 'COP', 'CUP', 'COPE'],
      correct: 'CAPE',
      explanation: 'Silent E makes the letter A say its long vowel name in CAPE!'
    }
  ],
  2: [
    {
      stageNumber: 2,
      skillTitle: 'Magic Silent E: A_E (Long A)',
      instruction: 'Add magic silent E to TAP. What does it become?',
      spokenPrompt: 'Add silent E to tap. What word does it build?',
      targetSound: 'TAP + MAGIC E = ?',
      soundCue: 't - ay - p',
      choices: ['TAPE', 'TOP', 'TUB', 'TIP'],
      correct: 'TAPE',
      explanation: 'Magic silent E transforms TAP into sticky TAPE!'
    }
  ],
  3: [
    {
      stageNumber: 3,
      skillTitle: 'Magic Silent E: I_E (Long I)',
      instruction: 'Add magic silent E to PIN. What tall evergreen tree does it become?',
      spokenPrompt: 'Add silent E to pin. What tall tree does it make?',
      targetSound: 'PIN + MAGIC E = ?',
      soundCue: 'p - eye - n',
      choices: ['PINE', 'PAN', 'PUN', 'PALE'],
      correct: 'PINE',
      explanation: 'PIN becomes majestic PINE with magic silent E!'
    }
  ],
  4: [
    {
      stageNumber: 4,
      skillTitle: 'Magic Silent E: I_E (Long I)',
      instruction: 'Add magic silent E to KIT. What soaring flyer does it make?',
      spokenPrompt: 'Add silent E to kit. What flies high in the sky?',
      targetSound: 'KIT + MAGIC E = ?',
      soundCue: 'k - eye - t',
      choices: ['KITE', 'KAT', 'KNOT', 'KEPT'],
      correct: 'KITE',
      explanation: 'KIT becomes soaring KITE!'
    }
  ],
  5: [
    {
      stageNumber: 5,
      skillTitle: 'Magic Silent E: O_E (Long O)',
      instruction: 'Add magic silent E to HOP. What feeling does it build?',
      spokenPrompt: 'Add silent E to hop. What word does it become?',
      targetSound: 'HOP + MAGIC E = ?',
      soundCue: 'h - oh - p',
      choices: ['HOPE', 'HIP', 'HEAP', 'HYPE'],
      correct: 'HOPE',
      explanation: 'HOP becomes joyful HOPE!'
    }
  ],
  6: [
    {
      stageNumber: 6,
      skillTitle: 'Magic Silent E: O_E (Long O)',
      instruction: 'Add magic silent E to ROB. What cozy garment is it?',
      spokenPrompt: 'Add silent E to rob. What cozy clothing does it make?',
      targetSound: 'ROB + MAGIC E = ?',
      soundCue: 'r - oh - b',
      choices: ['ROBE', 'RUB', 'RIB', 'ROOF'],
      correct: 'ROBE',
      explanation: 'ROB becomes warm ROBE with magic E!'
    }
  ],
  7: [
    {
      stageNumber: 7,
      skillTitle: 'Magic Silent E: U_E (Long U)',
      instruction: 'Add magic silent E to TUB. What hollow cylinder is formed?',
      spokenPrompt: 'Add silent E to tub. What word does it build?',
      targetSound: 'TUB + MAGIC E = ?',
      soundCue: 't - yoo - b',
      choices: ['TUBE', 'TAB', 'TOE', 'TAIL'],
      correct: 'TUBE',
      explanation: 'TUB becomes a long TUBE!'
    }
  ],
  8: [
    {
      stageNumber: 8,
      skillTitle: 'Magic Silent E: U_E (Long U)',
      instruction: 'Add magic silent E to CUB. What 3D geometric box is formed?',
      spokenPrompt: 'Add silent E to cub. What 3D block does it make?',
      targetSound: 'CUB + MAGIC E = ?',
      soundCue: 'k - yoo - b',
      choices: ['CUBE', 'COB', 'CAB', 'CURE'],
      correct: 'CUBE',
      explanation: 'CUB transforms into a geometric CUBE!'
    }
  ],
  9: [
    {
      stageNumber: 9,
      skillTitle: 'Magic Silent E: A_E Family',
      instruction: 'Which word contains the magic E sound in CAKE?',
      spokenPrompt: 'Listen! Which word has the long A magic E sound as in cake?',
      targetSound: 'CAKE',
      soundCue: 'k - ay - k',
      choices: ['CAKE', 'CAN', 'CAP', 'CAT'],
      correct: 'CAKE',
      explanation: 'CAKE uses magic silent E at the end!'
    }
  ],
  10: [
    {
      stageNumber: 10,
      skillTitle: 'Magic Silent E: I_E Family',
      instruction: 'Which word contains the magic E sound in BIKE?',
      spokenPrompt: 'Listen! Which word has the long I magic E sound as in bike?',
      targetSound: 'BIKE',
      soundCue: 'b - eye - k',
      choices: ['BIKE', 'BIT', 'BIN', 'BIG'],
      correct: 'BIKE',
      explanation: 'BIKE uses silent E to make the I say its name!'
    }
  ],
  11: [
    {
      stageNumber: 11,
      skillTitle: 'Magic Silent E: O_E Family',
      instruction: 'Which word has the magic E sound in HOME?',
      spokenPrompt: 'Listen! Which word has the long O magic E sound as in home?',
      targetSound: 'HOME',
      soundCue: 'h - oh - m',
      choices: ['HOME', 'HUM', 'HEM', 'HOP'],
      correct: 'HOME',
      explanation: 'HOME uses magic silent E!'
    }
  ],
  12: [
    {
      stageNumber: 12,
      skillTitle: 'Magic Silent E: U_E Family',
      instruction: 'Which musical instrument uses magic E in FLUTE?',
      spokenPrompt: 'Listen! Which word spells the silver instrument: flute?',
      targetSound: 'FLUTE',
      soundCue: 'f - l - oo - t',
      choices: ['FLUTE', 'FLAT', 'FLOAT', 'FLEET'],
      correct: 'FLUTE',
      explanation: 'FLUTE uses magic silent E to create the /oo/ sound!'
    }
  ],
  13: [
    {
      stageNumber: 13,
      skillTitle: 'Magic Silent E: A_E Family',
      instruction: 'Which word spells the ocean swell: WAVE?',
      spokenPrompt: 'Listen: w - ay - v. Pick the word wave!',
      targetSound: 'WAVE',
      soundCue: 'w - ay - v',
      choices: ['WAVE', 'WAG', 'WEB', 'WIN'],
      correct: 'WAVE',
      explanation: 'WAVE has a silent E protecting the vowel!'
    }
  ],
  14: [
    {
      stageNumber: 14,
      skillTitle: 'Magic Silent E: I_E Family',
      instruction: 'Which word spells the warm expression: SMILE?',
      spokenPrompt: 'Listen: s - m - eye - l. Pick the word smile!',
      targetSound: 'SMILE',
      soundCue: 's - m - eye - l',
      choices: ['SMILE', 'SMELL', 'SMOKE', 'SMART'],
      correct: 'SMILE',
      explanation: 'SMILE has a silent E making the I say /eye/!'
    }
  ],
  15: [
    {
      stageNumber: 15,
      skillTitle: 'Magic Silent E Review',
      instruction: 'Which word has the long vowel sound created by magic E?',
      spokenPrompt: 'Which word uses magic silent E to make a long vowel sound?',
      targetSound: 'BONE',
      soundCue: 'b - oh - n',
      choices: ['BONE', 'BUN', 'BIN', 'BAT'],
      correct: 'BONE',
      explanation: 'BONE has a magic silent E at the end!'
    }
  ],
  16: [
    {
      stageNumber: 16,
      skillTitle: 'Tricky Sight Word: SAID',
      instruction: 'Spot the tricky sight word: SAID (sounds like sed)!',
      spokenPrompt: 'Can you spot the tricky sight word: said?',
      targetSound: 'SAID',
      soundCue: 'said (sounds like s-eh-d)',
      choices: ['SAID', 'SAD', 'SAY', 'SEEN'],
      correct: 'SAID',
      explanation: 'SAID has an irregular spelling: AI sounds like short E!'
    }
  ],
  17: [
    {
      stageNumber: 17,
      skillTitle: 'Tricky Sight Word: THEY',
      instruction: 'Spot the tricky sight word: THEY (sounds like thay)!',
      spokenPrompt: 'Can you spot the tricky sight word: they?',
      targetSound: 'THEY',
      soundCue: 'they (ey sounds like long a)',
      choices: ['THEY', 'THE', 'THEN', 'THAT'],
      correct: 'THEY',
      explanation: 'THEY ends with EY making the long A sound!'
    }
  ],
  18: [
    {
      stageNumber: 18,
      skillTitle: 'Tricky Sight Word: COULD',
      instruction: 'Swing across! Spot the tricky sight word: COULD (with silent L)!',
      spokenPrompt: 'Find the tricky sight word: could. It has a silent letter L!',
      targetSound: 'COULD',
      soundCue: 'could (silent L)',
      choices: ['COULD', 'COLD', 'CLOUD', 'CALLED'],
      correct: 'COULD',
      explanation: 'COULD has a silent letter L inside!'
    }
  ],
  19: [
    {
      stageNumber: 19,
      skillTitle: 'Tricky Sight Word: WOULD',
      instruction: 'Spot the tricky sight word: WOULD (rhymes with could)!',
      spokenPrompt: 'Find the tricky sight word: would!',
      targetSound: 'WOULD',
      soundCue: 'would',
      choices: ['WOULD', 'WOOD', 'WORD', 'WORLD'],
      correct: 'WOULD',
      explanation: 'WOULD shares the -OULD silent letter pattern!'
    }
  ],
  20: [
    {
      stageNumber: 20,
      skillTitle: 'Tricky Sight Word: SHOULD',
      instruction: 'Spot the tricky sight word: SHOULD!',
      spokenPrompt: 'Spot the tricky sight word: should!',
      targetSound: 'SHOULD',
      soundCue: 'should',
      choices: ['SHOULD', 'SHOUT', 'SHIELD', 'SHORE'],
      correct: 'SHOULD',
      explanation: 'SHOULD is part of the could-would-should trio!'
    }
  ],
  21: [
    {
      stageNumber: 21,
      skillTitle: 'Tricky Sight Word: WHERE',
      instruction: 'Spot the question word: WHERE (asking for a location)?',
      spokenPrompt: 'Which word asks for a location: where?',
      targetSound: 'WHERE',
      soundCue: 'where',
      choices: ['WHERE', 'WERE', 'HERE', 'WEAR'],
      correct: 'WHERE',
      explanation: 'WHERE begins with WH and asks about place!'
    }
  ],
  22: [
    {
      stageNumber: 22,
      skillTitle: 'Tricky Sight Word: WERE',
      instruction: 'Spot the tricky past tense word: WERE!',
      spokenPrompt: 'Find the past tense word: were!',
      targetSound: 'WERE',
      soundCue: 'were (sounds like wer)',
      choices: ['WERE', 'WHERE', 'WAR', 'WEAR'],
      correct: 'WERE',
      explanation: 'WERE rhymes with her and fur!'
    }
  ],
  23: [
    {
      stageNumber: 23,
      skillTitle: 'Tricky Sight Word: FRIEND',
      instruction: 'Spot the word that names your best buddy: FRIEND!',
      spokenPrompt: 'Find the word: friend. Remember: I before E!',
      targetSound: 'FRIEND',
      soundCue: 'friend (f - r - eh - n - d)',
      choices: ['FRIEND', 'FIEND', 'FRONT', 'FIND'],
      correct: 'FRIEND',
      explanation: 'FRIEND has IE sounding like short E!'
    }
  ],
  24: [
    {
      stageNumber: 24,
      skillTitle: 'Tricky Sight Word: LAUGH',
      instruction: 'Spot the word with the funny GH sound: LAUGH!',
      spokenPrompt: 'Find the joyful word: laugh. GH makes an /f/ sound!',
      targetSound: 'LAUGH',
      soundCue: 'laugh (GH sounds like /f/)',
      choices: ['LAUGH', 'LIGHT', 'LOUD', 'LEAP'],
      correct: 'LAUGH',
      explanation: 'In LAUGH, the letters GH make the /f/ sound!'
    }
  ],
  25: [
    {
      stageNumber: 25,
      skillTitle: 'Tricky Sight Word: PEOPLE',
      instruction: 'Spot the tricky word: PEOPLE (names all of us)!',
      spokenPrompt: 'Can you find the tricky word: people?',
      targetSound: 'PEOPLE',
      soundCue: 'people',
      choices: ['PEOPLE', 'PURPLE', 'PUPIL', 'POPPLE'],
      correct: 'PEOPLE',
      explanation: 'PEOPLE has a silent O after P!'
    }
  ],
  26: [
    {
      stageNumber: 26,
      skillTitle: 'Tricky Sight Word: WATER',
      instruction: 'Spot the essential liquid word: WATER!',
      spokenPrompt: 'Spot the word: water!',
      targetSound: 'WATER',
      soundCue: 'water',
      choices: ['WATER', 'WAITER', 'WINTER', 'WEATHER'],
      correct: 'WATER',
      explanation: 'WATER has an A that makes the /ah/ sound!'
    }
  ],
  27: [
    {
      stageNumber: 27,
      skillTitle: 'Tricky Sight Word: ENOUGH',
      instruction: 'Spot the tricky word: ENOUGH (GH makes the /f/ sound)!',
      spokenPrompt: 'Find the word: enough. GH says /f/!',
      targetSound: 'ENOUGH',
      soundCue: 'enough (ends in /f/)',
      choices: ['ENOUGH', 'EAGLE', 'ENTER', 'EVERY'],
      correct: 'ENOUGH',
      explanation: 'ENOUGH ends with GH making the /f/ sound!'
    }
  ],
  28: [
    {
      stageNumber: 28,
      skillTitle: 'Tricky Sight Word: THROUGH',
      instruction: 'Spot the tricky path word: THROUGH!',
      spokenPrompt: 'Find the word: through!',
      targetSound: 'THROUGH',
      soundCue: 'through',
      choices: ['THROUGH', 'THOUGHT', 'THOUGH', 'THROW'],
      correct: 'THROUGH',
      explanation: 'THROUGH rhymes with blue and true!'
    }
  ],
  29: [
    {
      stageNumber: 29,
      skillTitle: 'Tricky Sight Word: THOUGHT',
      instruction: 'Spot the thinking word: THOUGHT!',
      spokenPrompt: 'Find the word: thought!',
      targetSound: 'THOUGHT',
      soundCue: 'thought',
      choices: ['THOUGHT', 'THROUGH', 'TAUGHT', 'TOUGH'],
      correct: 'THOUGHT',
      explanation: 'THOUGHT has OUGHT making the /awt/ sound!'
    }
  ],
  30: [
    {
      stageNumber: 30,
      skillTitle: 'Tricky Sight Word: BEAUTIFUL',
      instruction: 'Spot the glowing descriptive word: BEAUTIFUL!',
      spokenPrompt: 'Find the word: beautiful!',
      targetSound: 'BEAUTIFUL',
      soundCue: 'beautiful',
      choices: ['BEAUTIFUL', 'BOUNTIFUL', 'BREATHLESS', 'BRILLIANT'],
      correct: 'BEAUTIFUL',
      explanation: 'BEAUTIFUL starts with EAU creating the long U sound!'
    }
  ],
  31: [
    {
      stageNumber: 31,
      skillTitle: 'Diphthong: OI (Coin)',
      instruction: 'Which word contains the noisy /oy/ sound spelled with OI?',
      spokenPrompt: 'Listen! Which word has the oy sound spelled with O-I?',
      targetSound: 'COIN',
      soundCue: 'k - oy - n',
      choices: ['COIN', 'CORN', 'CONE', 'COAT'],
      correct: 'COIN',
      explanation: 'COIN uses the diphthong OI in the middle!'
    }
  ],
  32: [
    {
      stageNumber: 32,
      skillTitle: 'Diphthong: OY (Toy)',
      instruction: 'Which word ends with the /oy/ sound spelled with OY?',
      spokenPrompt: 'Listen! Which word ends with the joyful sound: toy?',
      targetSound: 'TOY',
      soundCue: 't - oy',
      choices: ['TOY', 'TOP', 'TOE', 'TWO'],
      correct: 'TOY',
      explanation: 'TOY uses OY at the end of the word!'
    }
  ],
  33: [
    {
      stageNumber: 33,
      skillTitle: 'Diphthong: OU (Cloud)',
      instruction: 'Which fluffy sky word uses the /ow/ sound spelled OU?',
      spokenPrompt: 'Listen! Which sky word has the ow sound spelled O-U?',
      targetSound: 'CLOUD',
      soundCue: 'k - l - ow - d',
      choices: ['CLOUD', 'CLOD', 'COLD', 'CLAY'],
      correct: 'CLOUD',
      explanation: 'CLOUD uses the diphthong OU!'
    }
  ],
  34: [
    {
      stageNumber: 34,
      skillTitle: 'Diphthong: OW (Brown)',
      instruction: 'Which earthy color word uses the /ow/ sound spelled OW?',
      spokenPrompt: 'Listen! Which color word has the ow sound spelled O-W?',
      targetSound: 'BROWN',
      soundCue: 'b - r - ow - n',
      choices: ['BROWN', 'BLOWN', 'BORN', 'BARN'],
      correct: 'BROWN',
      explanation: 'BROWN uses OW to make the /ow/ sound!'
    }
  ],
  35: [
    {
      stageNumber: 35,
      skillTitle: 'Diphthong: AW (Hawk)',
      instruction: 'Which soaring bird word uses the /aw/ sound spelled AW?',
      spokenPrompt: 'Listen! Which bird word has the aw sound spelled A-W?',
      targetSound: 'HAWK',
      soundCue: 'h - aw - k',
      choices: ['HAWK', 'HOOK', 'HORN', 'HIKE'],
      correct: 'HAWK',
      explanation: 'HAWK uses the vowel pattern AW!'
    }
  ],
  36: [
    {
      stageNumber: 36,
      skillTitle: 'Diphthong: AU (Sauce)',
      instruction: 'Which tasty word uses the /aw/ sound spelled AU?',
      spokenPrompt: 'Listen! Which word has the aw sound spelled A-U?',
      targetSound: 'SAUCE',
      soundCue: 's - aw - s',
      choices: ['SAUCE', 'SPACE', 'SLICE', 'SOUP'],
      correct: 'SAUCE',
      explanation: 'SAUCE uses AU in the middle!'
    }
  ],
  37: [
    {
      stageNumber: 37,
      skillTitle: 'Diphthong: OU (Mouse)',
      instruction: 'Which tiny creature word uses the /ow/ sound spelled OU?',
      spokenPrompt: 'Listen: m - ow - s. Which word is it?',
      targetSound: 'MOUSE',
      soundCue: 'm - ow - s',
      choices: ['MOUSE', 'MOOSE', 'MOSS', 'MUSE'],
      correct: 'MOUSE',
      explanation: 'MOUSE uses OU to make the /ow/ sound!'
    }
  ],
  38: [
    {
      stageNumber: 38,
      skillTitle: 'Diphthong: OY (Joy)',
      instruction: 'Which happy word rhymes with boy and ends in OY?',
      spokenPrompt: 'Which happy word rhymes with boy? Joy!',
      targetSound: 'JOY',
      soundCue: 'j - oy',
      choices: ['JOY', 'JAY', 'JUG', 'JOB'],
      correct: 'JOY',
      explanation: 'JOY ends with the bright diphthong OY!'
    }
  ],
  39: [
    {
      stageNumber: 39,
      skillTitle: 'Diphthong: OI (Boil)',
      instruction: 'What happens to bubbling hot water: BOIL?',
      spokenPrompt: 'Listen: b - oy - l. Which word is it?',
      targetSound: 'BOIL',
      soundCue: 'b - oy - l',
      choices: ['BOIL', 'BOWL', 'BAIL', 'BALL'],
      correct: 'BOIL',
      explanation: 'BOIL uses the diphthong OI!'
    }
  ],
  40: [
    {
      stageNumber: 40,
      skillTitle: 'Diphthong: OW (Town)',
      instruction: 'Which community place word uses OW for the /ow/ sound?',
      spokenPrompt: 'Listen: t - ow - n. Which word is it?',
      targetSound: 'TOWN',
      soundCue: 't - ow - n',
      choices: ['TOWN', 'TONE', 'TEEN', 'TWIN'],
      correct: 'TOWN',
      explanation: 'TOWN uses OW to make the /ow/ sound!'
    }
  ],
  41: [
    {
      stageNumber: 41,
      skillTitle: 'Soft C Rule: /s/ before E, I, Y',
      instruction: 'When C is followed by I, it sounds like /s/! Spot the word: CITY!',
      spokenPrompt: 'Letter C says /s/ before I. Spot the word: city!',
      targetSound: 'CITY',
      soundCue: 's - ih - t - ee',
      choices: ['CITY', 'CAT', 'CUP', 'COT'],
      correct: 'CITY',
      explanation: 'In CITY, the letter C makes the soft /s/ sound!'
    }
  ],
  42: [
    {
      stageNumber: 42,
      skillTitle: 'Soft C Rule: /s/ before E',
      instruction: 'When C is followed by E, it makes the soft /s/ sound! Spot: CENT!',
      spokenPrompt: 'Find the coin word with soft C: cent!',
      targetSound: 'CENT',
      soundCue: 's - eh - n - t',
      choices: ['CENT', 'CANT', 'CONE', 'CUBE'],
      correct: 'CENT',
      explanation: 'CENT begins with a soft C sounding like /s/!'
    }
  ],
  43: [
    {
      stageNumber: 43,
      skillTitle: 'Soft G Rule: /j/ before E, I, Y',
      instruction: 'When G is followed by I, it sounds like /j/! Spot: GIANT!',
      spokenPrompt: 'Letter G makes the /j/ sound before I. Spot: giant!',
      targetSound: 'GIANT',
      soundCue: 'j - eye - ah - n - t',
      choices: ['GIANT', 'GOAT', 'GIRL', 'GATE'],
      correct: 'GIANT',
      explanation: 'In GIANT, letter G makes the soft /j/ sound!'
    }
  ],
  44: [
    {
      stageNumber: 44,
      skillTitle: 'Soft G Rule: /j/ before E',
      instruction: 'Which word contains the soft G sound at the end: CAGE?',
      spokenPrompt: 'Find the soft G word: cage!',
      targetSound: 'CAGE',
      soundCue: 'k - ay - j',
      choices: ['CAGE', 'CAKE', 'CAPE', 'CANE'],
      correct: 'CAGE',
      explanation: 'CAGE ends with GE making the soft /j/ sound!'
    }
  ],
  45: [
    {
      stageNumber: 45,
      skillTitle: 'Silent Consonant: KN (Knight)',
      instruction: 'Letter K is silent before N! Spot the brave hero: KNIGHT!',
      spokenPrompt: 'Letter K is silent before N. Find the brave hero: knight!',
      targetSound: 'KNIGHT',
      soundCue: 'n - eye - t',
      choices: ['KNIGHT', 'NIGHT', 'KITE', 'KNOT'],
      correct: 'KNIGHT',
      explanation: 'KNIGHT starts with silent K!'
    }
  ],
  46: [
    {
      stageNumber: 46,
      skillTitle: 'Silent Consonant: KN (Knee)',
      instruction: 'Which body joint word starts with silent K: KNEE?',
      spokenPrompt: 'Find the leg joint with silent K: knee!',
      targetSound: 'KNEE',
      soundCue: 'n - ee',
      choices: ['KNEE', 'NEED', 'NEST', 'NEAR'],
      correct: 'KNEE',
      explanation: 'KNEE starts with silent K before N!'
    }
  ],
  47: [
    {
      stageNumber: 47,
      skillTitle: 'Silent Consonant: WR (Write)',
      instruction: 'Letter W is silent before R! Spot the word: WRITE (with a pencil)!',
      spokenPrompt: 'Letter W is silent before R. Spot the word: write!',
      targetSound: 'WRITE',
      soundCue: 'r - eye - t',
      choices: ['WRITE', 'RIGHT', 'WHITE', 'RIDE'],
      correct: 'WRITE',
      explanation: 'WRITE starts with silent W before R!'
    }
  ],
  48: [
    {
      stageNumber: 48,
      skillTitle: 'Silent Consonant: WR (Wrist)',
      instruction: 'Which arm joint word begins with silent W: WRIST?',
      spokenPrompt: 'Find the arm joint with silent W: wrist!',
      targetSound: 'WRIST',
      soundCue: 'r - ih - s - t',
      choices: ['WRIST', 'RUST', 'REST', 'WEST'],
      correct: 'WRIST',
      explanation: 'WRIST begins with silent W!'
    }
  ],
  49: [
    {
      stageNumber: 49,
      skillTitle: 'Silent Consonant: GN (Gnome)',
      instruction: 'Letter G is silent before N! Spot the mythical garden GNOME!',
      spokenPrompt: 'Letter G is silent before N. Spot the garden gnome!',
      targetSound: 'GNOME',
      soundCue: 'n - oh - m',
      choices: ['GNOME', 'NAME', 'NOSE', 'GAME'],
      correct: 'GNOME',
      explanation: 'GNOME begins with silent G!'
    }
  ],
  50: [
    {
      stageNumber: 50,
      skillTitle: 'Tricky Trails Grand Finale',
      instruction: 'Grand Champion! Pick the brave warrior with silent K: KNIGHT!',
      spokenPrompt: 'Grand Finale! Pick the brave armored hero: knight!',
      targetSound: 'KNIGHT',
      soundCue: 'silent K in knight',
      choices: ['KNIGHT', 'KING', 'KANGAROO', 'KEY'],
      correct: 'KNIGHT',
      explanation: 'You mastered all tricky sight words and silent rules in Tricky Trails!'
    }
  ]
};

// -------------------------------------------------------------
// LAND 4: WHISPERING PEAKS (3rd - 5th Grade)
// -------------------------------------------------------------
const WHISPERING_PEAKS_STAGES: Record<number, StageChallenge[]> = {
  1: [
    {
      stageNumber: 1,
      skillTitle: 'Vowel Team: EE',
      instruction: 'Jump the hoverboard! Which word uses the vowel team EE in TREE?',
      spokenPrompt: 'Bounce high! Which word uses vowel team E-E in tree?',
      targetSound: 'TREE',
      soundCue: 't - r - ee',
      choices: ['TREE', 'TRY', 'TRUE', 'TRAIN'],
      correct: 'TREE',
      explanation: 'Two Es join together to make the long /ee/ sound in TREE!'
    }
  ],
  2: [
    {
      stageNumber: 2,
      skillTitle: 'Vowel Team: EA',
      instruction: 'Which word uses the vowel team EA to make the /ee/ sound in DREAM?',
      spokenPrompt: 'Listen! Which word has the vowel team E-A in dream?',
      targetSound: 'DREAM',
      soundCue: 'd - r - ee - m',
      choices: ['DREAM', 'DRUM', 'DAMP', 'DRAW'],
      correct: 'DREAM',
      explanation: 'E and A unite to say /ee/ in DREAM!'
    }
  ],
  3: [
    {
      stageNumber: 3,
      skillTitle: 'Vowel Team: OA',
      instruction: 'Which sailing watercraft uses vowel team OA in BOAT?',
      spokenPrompt: 'Listen: b - oh - t. Which word uses vowel team O-A?',
      targetSound: 'BOAT',
      soundCue: 'b - oh - t',
      choices: ['BOAT', 'BOOT', 'BITE', 'BAT'],
      correct: 'BOAT',
      explanation: 'O and A form the long O sound in BOAT!'
    }
  ],
  4: [
    {
      stageNumber: 4,
      skillTitle: 'Vowel Team: AI',
      instruction: 'Which word uses vowel team AI for the falling drops in RAIN?',
      spokenPrompt: 'Listen: r - ay - n. Which word has vowel team A-I?',
      targetSound: 'RAIN',
      soundCue: 'r - ay - n',
      choices: ['RAIN', 'RUN', 'RUG', 'RING'],
      correct: 'RAIN',
      explanation: 'A and I combine to make the long A sound in RAIN!'
    }
  ],
  5: [
    {
      stageNumber: 5,
      skillTitle: 'Vowel Team: AY',
      instruction: 'Which word uses vowel team AY at the end of PLAY?',
      spokenPrompt: 'Listen: p - l - ay. Which word ends with A-Y?',
      targetSound: 'PLAY',
      soundCue: 'p - l - ay',
      choices: ['PLAY', 'PLOW', 'PLOT', 'PLUM'],
      correct: 'PLAY',
      explanation: 'A and Y make the long A sound at the end of PLAY!'
    }
  ],
  6: [
    {
      stageNumber: 6,
      skillTitle: 'Vowel Team: OO (Moon)',
      instruction: 'Which celestial word uses double O for the /oo/ sound in MOON?',
      spokenPrompt: 'Listen: m - oo - n. Which word has double O?',
      targetSound: 'MOON',
      soundCue: 'm - oo - n',
      choices: ['MOON', 'MAN', 'MEN', 'MOP'],
      correct: 'MOON',
      explanation: 'Double O makes the smooth /oo/ sound in MOON!'
    }
  ],
  7: [
    {
      stageNumber: 7,
      skillTitle: 'Vowel Team: EW',
      instruction: 'Which word uses EW to make the /oo/ sound in FLEW?',
      spokenPrompt: 'Listen: f - l - oo. Which word uses E-W in flew?',
      targetSound: 'FLEW',
      soundCue: 'f - l - oo',
      choices: ['FLEW', 'FLOW', 'FLAW', 'FLAT'],
      correct: 'FLEW',
      explanation: 'E and W combine to say /oo/ in FLEW!'
    }
  ],
  8: [
    {
      stageNumber: 8,
      skillTitle: 'Vowel Team: OE',
      instruction: 'Which body part uses vowel team OE in TOE?',
      spokenPrompt: 'Listen: t - oh. Which word uses O-E in toe?',
      targetSound: 'TOE',
      soundCue: 't - oh',
      choices: ['TOE', 'TOO', 'TOP', 'TIE'],
      correct: 'TOE',
      explanation: 'O and E make the long O sound in TOE!'
    }
  ],
  9: [
    {
      stageNumber: 9,
      skillTitle: 'Vowel Team: UE',
      instruction: 'Which vibrant sky color uses vowel team UE in BLUE?',
      spokenPrompt: 'Listen: b - l - oo. Which word uses U-E in blue?',
      targetSound: 'BLUE',
      soundCue: 'b - l - oo',
      choices: ['BLUE', 'BLOW', 'BLOT', 'BALL'],
      correct: 'BLUE',
      explanation: 'U and E unite to make /oo/ in BLUE!'
    }
  ],
  10: [
    {
      stageNumber: 10,
      skillTitle: 'Vowel Team: EA (Short E variant)',
      instruction: 'Sometimes EA makes a short E sound! Spot the word: BREAD!',
      spokenPrompt: 'Sometimes E-A makes a short E sound as in bread. Spot bread!',
      targetSound: 'BREAD',
      soundCue: 'b - r - eh - d',
      choices: ['BREAD', 'BRIDE', 'BROAD', 'BRAID'],
      correct: 'BREAD',
      explanation: 'In BREAD, the vowel team EA makes a short E /eh/ sound!'
    }
  ],
  16: [
    {
      stageNumber: 16,
      skillTitle: 'Bossy R: AR',
      instruction: 'Bossy R makes vowels change their sound! Spot: STAR (with AR)!',
      spokenPrompt: 'Bossy R controls the vowel. Find the shining word: star!',
      targetSound: 'STAR',
      soundCue: 's - t - ar',
      choices: ['STAR', 'STIR', 'STORE', 'STEP'],
      correct: 'STAR',
      explanation: 'Letter R bosses letter A to say /ar/ in STAR!'
    }
  ],
  17: [
    {
      stageNumber: 17,
      skillTitle: 'Bossy R: OR',
      instruction: 'Which weather word uses the bossy R sound /or/ in STORM?',
      spokenPrompt: 'Listen: s - t - or - m. Which word has O-R in storm?',
      targetSound: 'STORM',
      soundCue: 's - t - or - m',
      choices: ['STORM', 'STAR', 'STEM', 'STREAM'],
      correct: 'STORM',
      explanation: 'Letter R bosses letter O to say /or/ in STORM!'
    }
  ],
  18: [
    {
      stageNumber: 18,
      skillTitle: 'Bossy R: IR',
      instruction: 'Which feathered creature uses the bossy R sound /er/ in BIRD?',
      spokenPrompt: 'Listen: b - er - d. Which word has I-R in bird?',
      targetSound: 'BIRD',
      soundCue: 'b - er - d',
      choices: ['BIRD', 'BARD', 'BEARD', 'BREAD'],
      correct: 'BIRD',
      explanation: 'I and R combine to make the /er/ sound in BIRD!'
    }
  ],
  19: [
    {
      stageNumber: 19,
      skillTitle: 'Bossy R: UR',
      instruction: 'Which ocean swimmer uses the bossy R sound /er/ in TURTLE?',
      spokenPrompt: 'Listen: t - er - t - l. Which word has U-R in turtle?',
      targetSound: 'TURTLE',
      soundCue: 't - er - t - l',
      choices: ['TURTLE', 'TITLE', 'TOTAL', 'TINT'],
      correct: 'TURTLE',
      explanation: 'U and R make the /er/ sound in TURTLE!'
    }
  ],
  20: [
    {
      stageNumber: 20,
      skillTitle: 'Bossy R: ER',
      instruction: 'Which mountain companion uses the bossy R ending /er/ in SISTER?',
      spokenPrompt: 'Find the family word ending in bossy E-R: sister!',
      targetSound: 'SISTER',
      soundCue: 's - ih - s - t - er',
      choices: ['SISTER', 'SILVER', 'SUNSET', 'SAILOR'],
      correct: 'SISTER',
      explanation: 'SISTER ends with the bossy R pattern ER!'
    }
  ],
  31: [
    {
      stageNumber: 31,
      skillTitle: 'Prefix: UN- (meaning Not)',
      instruction: 'The prefix UN- means NOT. What word means not happy?',
      spokenPrompt: 'The prefix un- means not. Which word means not happy?',
      targetSound: 'UNHAPPY',
      soundCue: 'un- means not',
      choices: ['UNHAPPY', 'REHAPPY', 'PREHAPPY', 'DISHAPPY'],
      correct: 'UNHAPPY',
      explanation: 'UN + HAPPY means NOT happy!'
    }
  ],
  32: [
    {
      stageNumber: 32,
      skillTitle: 'Prefix: RE- (meaning Again)',
      instruction: 'The prefix RE- means AGAIN. What word means play again?',
      spokenPrompt: 'The prefix re- means again. Which word means play again?',
      targetSound: 'REPLAY',
      soundCue: 're- means again',
      choices: ['REPLAY', 'UNPLAY', 'MISPLAY', 'PREPLAY'],
      correct: 'REPLAY',
      explanation: 'RE + PLAY means to play again!'
    }
  ],
  33: [
    {
      stageNumber: 33,
      skillTitle: 'Prefix: PRE- (meaning Before)',
      instruction: 'The prefix PRE- means BEFORE. What word means heat before?',
      spokenPrompt: 'The prefix pre- means before. Which word means heat before?',
      targetSound: 'PREHEAT',
      soundCue: 'pre- means before',
      choices: ['PREHEAT', 'REHEAT', 'UNHEAT', 'DISHEAT'],
      correct: 'PREHEAT',
      explanation: 'PRE + HEAT means to heat before cooking!'
    }
  ],
  34: [
    {
      stageNumber: 34,
      skillTitle: 'Suffix: -FUL (meaning Full of)',
      instruction: 'The suffix -FUL means FULL OF. What word means full of joy?',
      spokenPrompt: 'The suffix -ful means full of. What word means full of joy?',
      targetSound: 'JOYFUL',
      soundCue: '-ful means full of',
      choices: ['JOYFUL', 'JOYLESS', 'JOYLY', 'JOYABLE'],
      correct: 'JOYFUL',
      explanation: 'JOY + FUL means full of joy!'
    }
  ],
  35: [
    {
      stageNumber: 35,
      skillTitle: 'Suffix: -LESS (meaning Without)',
      instruction: 'The suffix -LESS means WITHOUT. What word means without fear?',
      spokenPrompt: 'The suffix -less means without. Which word means without fear?',
      targetSound: 'FEARLESS',
      soundCue: '-less means without',
      choices: ['FEARLESS', 'FEARFUL', 'FEARLY', 'FEARABLE'],
      correct: 'FEARLESS',
      explanation: 'FEAR + LESS means completely without fear!'
    }
  ],
  36: [
    {
      stageNumber: 36,
      skillTitle: 'Suffix: -TION (makes a Noun)',
      instruction: 'The suffix -TION makes an action noun! Spot the word: ACTION!',
      spokenPrompt: 'The suffix t-i-o-n sounds like shun. Spot the word: action!',
      targetSound: 'ACTION',
      soundCue: 'action (t-i-o-n says shun)',
      choices: ['ACTION', 'ACTOR', 'ACTIVE', 'ACTUAL'],
      correct: 'ACTION',
      explanation: 'In ACTION, -TION creates the noun ending!'
    }
  ],
  41: [
    {
      stageNumber: 41,
      skillTitle: 'Mountain Vocabulary: MOUNTAIN',
      instruction: 'Shatter the frost crystal! Spot the 2-syllable peak word: MOUNTAIN!',
      spokenPrompt: 'Shatter the frost crystal! Spot the 2-syllable word: mountain!',
      targetSound: 'MOUNTAIN',
      soundCue: 'moun - tain',
      choices: ['MOUNTAIN', 'FOUNTAIN', 'MAINTAIN', 'MONSTER'],
      correct: 'MOUNTAIN',
      explanation: 'MOUN-TAIN has 2 syllables and ends with -AIN!'
    }
  ],
  42: [
    {
      stageNumber: 42,
      skillTitle: 'Mountain Vocabulary: BLIZZARD',
      instruction: 'Spot the howling snowstorm word: BLIZZARD!',
      spokenPrompt: 'Find the powerful snowstorm word: blizzard!',
      targetSound: 'BLIZZARD',
      soundCue: 'bliz - zard',
      choices: ['BLIZZARD', 'BUZZARD', 'BLAST', 'BLANKET'],
      correct: 'BLIZZARD',
      explanation: 'BLIZZARD has double Z and the -ARD suffix!'
    }
  ],
  43: [
    {
      stageNumber: 43,
      skillTitle: 'Mountain Vocabulary: GLACIER',
      instruction: 'Spot the giant moving ice sheet word: GLACIER!',
      spokenPrompt: 'Find the ancient river of ice: glacier!',
      targetSound: 'GLACIER',
      soundCue: 'gla - cier',
      choices: ['GLACIER', 'GEYSER', 'GARDEN', 'GLOVE'],
      correct: 'GLACIER',
      explanation: 'GLACIER uses CI sounding like /sh/!'
    }
  ],
  44: [
    {
      stageNumber: 44,
      skillTitle: 'Mountain Vocabulary: AVALANCHE',
      instruction: 'Spot the rushing snow slide word: AVALANCHE!',
      spokenPrompt: 'Find the 3-syllable snow slide word: avalanche!',
      targetSound: 'AVALANCHE',
      soundCue: 'av - a - lanche',
      choices: ['AVALANCHE', 'ANVIL', 'AURORA', 'ALLIANCE'],
      correct: 'AVALANCHE',
      explanation: 'AV-A-LANCHE is a magnificent 3-syllable French-origin phonics word!'
    }
  ],
  45: [
    {
      stageNumber: 45,
      skillTitle: 'Mountain Vocabulary: WHISPER',
      instruction: 'Which quiet mountain breeze word begins with WH: WHISPER?',
      spokenPrompt: 'Find the quiet mountain breeze word: whisper!',
      targetSound: 'WHISPER',
      soundCue: 'whis - per',
      choices: ['WHISPER', 'WHISTLE', 'WHETHER', 'WHENEVER'],
      correct: 'WHISPER',
      explanation: 'WHISPER starts with the gentle WH breath!'
    }
  ],
  50: [
    {
      stageNumber: 50,
      skillTitle: 'Whispering Peaks Grand Finale',
      instruction: 'Spring off the cloud! Spot the summit word: CRYSTALLINE!',
      spokenPrompt: 'Grand Finale! Shatter the glacier with the pure word: crystalline!',
      targetSound: 'CRYSTALLINE',
      soundCue: 'crys - tal - line',
      choices: ['CRYSTALLINE', 'CHRONICLE', 'CANDLE', 'CIRCUIT'],
      correct: 'CRYSTALLINE',
      explanation: 'You scaled the summit and conquered Whispering Peaks!'
    }
  ]
};

// -------------------------------------------------------------
// LAND 5: LEXICON EMPIRE (Middle School - High School / Advanced)
// -------------------------------------------------------------
const LEXICON_EMPIRE_STAGES: Record<number, StageChallenge[]> = {
  1: [
    {
      stageNumber: 1,
      skillTitle: 'Greek Root: CHRON',
      instruction: 'Strike the sentry! What does the Greek root CHRON mean?',
      spokenPrompt: 'Strike the barrier! What does the Greek root chron mean?',
      targetSound: 'CHRON',
      soundCue: 'chron means time',
      choices: ['Time', 'Earth', 'Life', 'Sound'],
      correct: 'Time',
      explanation: 'CHRON translates from Greek to mean TIME!'
    }
  ],
  2: [
    {
      stageNumber: 2,
      skillTitle: 'Greek Root: BIO',
      instruction: 'What does the Greek root BIO mean?',
      spokenPrompt: 'What does the Greek root bio mean?',
      targetSound: 'BIO',
      soundCue: 'bio means life',
      choices: ['Life', 'Water', 'Time', 'Light'],
      correct: 'Life',
      explanation: 'BIO translates to mean LIFE!'
    }
  ],
  3: [
    {
      stageNumber: 3,
      skillTitle: 'Greek Root: GEO',
      instruction: 'What does the Greek root GEO mean?',
      spokenPrompt: 'What does the Greek root geo mean?',
      targetSound: 'GEO',
      soundCue: 'geo means earth',
      choices: ['Earth', 'Sky', 'Heat', 'Rock'],
      correct: 'Earth',
      explanation: 'GEO comes from the ancient Greek word for EARTH!'
    }
  ],
  4: [
    {
      stageNumber: 4,
      skillTitle: 'Greek Root: TELE',
      instruction: 'What does the Greek root TELE mean?',
      spokenPrompt: 'What does the Greek root tele mean?',
      targetSound: 'TELE',
      soundCue: 'tele means far or distant',
      choices: ['Distant / Far', 'Small', 'Near', 'Fast'],
      correct: 'Distant / Far',
      explanation: 'TELE means DISTANT or FAR away!'
    }
  ],
  5: [
    {
      stageNumber: 5,
      skillTitle: 'Greek Root: GRAPH',
      instruction: 'What does the Greek root GRAPH mean?',
      spokenPrompt: 'What does the Greek root graph mean?',
      targetSound: 'GRAPH',
      soundCue: 'graph means to write or draw',
      choices: ['Write / Draw', 'Speak', 'Hear', 'Count'],
      correct: 'Write / Draw',
      explanation: 'GRAPH means to WRITE or DRAW!'
    }
  ],
  6: [
    {
      stageNumber: 6,
      skillTitle: 'Greek Root: PHON',
      instruction: 'What does the root PHON mean?',
      spokenPrompt: 'What does the root phon mean?',
      targetSound: 'PHON',
      soundCue: 'phon means sound',
      choices: ['Sound', 'Light', 'Shape', 'Color'],
      correct: 'Sound',
      explanation: 'PHON translates directly to SOUND or VOICE!'
    }
  ],
  7: [
    {
      stageNumber: 7,
      skillTitle: 'Latin Root: SPEC / SPECT',
      instruction: 'What does the Latin root SPEC mean?',
      spokenPrompt: 'What does the Latin root spec mean?',
      targetSound: 'SPEC',
      soundCue: 'spec means look or see',
      choices: ['Look / See', 'Touch', 'Smell', 'Move'],
      correct: 'Look / See',
      explanation: 'SPEC means to LOOK or OBSERVE!'
    }
  ],
  8: [
    {
      stageNumber: 8,
      skillTitle: 'Latin Root: PORT',
      instruction: 'What does the Latin root PORT mean?',
      spokenPrompt: 'What does the Latin root port mean?',
      targetSound: 'PORT',
      soundCue: 'port means carry',
      choices: ['Carry', 'Break', 'Build', 'Throw'],
      correct: 'Carry',
      explanation: 'PORT comes from the Latin verb meaning to CARRY!'
    }
  ],
  9: [
    {
      stageNumber: 9,
      skillTitle: 'Greek Root: ASTR / ASTER',
      instruction: 'What does the Greek root ASTR mean?',
      spokenPrompt: 'What does the root astr mean?',
      targetSound: 'ASTR',
      soundCue: 'astr means star',
      choices: ['Star', 'Cloud', 'Planet', 'Moon'],
      correct: 'Star',
      explanation: 'ASTR comes from the Greek word for STAR!'
    }
  ],
  10: [
    {
      stageNumber: 10,
      skillTitle: 'Latin Root: AUD',
      instruction: 'What does the Latin root AUD mean?',
      spokenPrompt: 'What does the Latin root aud mean?',
      targetSound: 'AUD',
      soundCue: 'aud means hear',
      choices: ['Hear', 'Taste', 'See', 'Speak'],
      correct: 'Hear',
      explanation: 'AUD means to HEAR or LISTEN!'
    }
  ],
  16: [
    {
      stageNumber: 16,
      skillTitle: 'Latin Root: BENE',
      instruction: 'What does the Latin root BENE mean?',
      spokenPrompt: 'What does the Latin root bene mean?',
      targetSound: 'BENE',
      soundCue: 'bene means good or well',
      choices: ['Good / Well', 'Evil / Bad', 'Great / Big', 'Fast'],
      correct: 'Good / Well',
      explanation: 'BENE translates to GOOD or WELL!'
    }
  ],
  17: [
    {
      stageNumber: 17,
      skillTitle: 'Latin Root: MAL',
      instruction: 'What does the Latin root MAL mean?',
      spokenPrompt: 'What does the Latin root mal mean?',
      targetSound: 'MAL',
      soundCue: 'mal means bad or evil',
      choices: ['Bad / Evil', 'Good / Kind', 'Slow', 'Weak'],
      correct: 'Bad / Evil',
      explanation: 'MAL translates to BAD, WRONG, or EVIL!'
    }
  ],
  18: [
    {
      stageNumber: 18,
      skillTitle: 'Latin Root: DICT',
      instruction: 'What does the Latin root DICT mean?',
      spokenPrompt: 'What does the Latin root dict mean?',
      targetSound: 'DICT',
      soundCue: 'dict means speak or say',
      choices: ['Speak / Say', 'Hear', 'Write', 'Read'],
      correct: 'Speak / Say',
      explanation: 'DICT comes from the Latin verb to SPEAK or DECLARE!'
    }
  ],
  19: [
    {
      stageNumber: 19,
      skillTitle: 'Latin Root: STRUCT',
      instruction: 'What does the Latin root STRUCT mean?',
      spokenPrompt: 'What does the root struct mean?',
      targetSound: 'STRUCT',
      soundCue: 'struct means build',
      choices: ['Build', 'Break', 'Paint', 'Burn'],
      correct: 'Build',
      explanation: 'STRUCT means to BUILD or PILE UP!'
    }
  ],
  20: [
    {
      stageNumber: 20,
      skillTitle: 'Greek Root: THERM',
      instruction: 'What does the Greek root THERM mean?',
      spokenPrompt: 'What does the Greek root therm mean?',
      targetSound: 'THERM',
      soundCue: 'therm means heat',
      choices: ['Heat', 'Cold', 'Wind', 'Water'],
      correct: 'Heat',
      explanation: 'THERM translates to HEAT or WARMTH!'
    }
  ],
  31: [
    {
      stageNumber: 31,
      skillTitle: 'Latin Root: OMNI',
      instruction: 'What does the Latin morpheme OMNI mean?',
      spokenPrompt: 'What does the Latin root omni mean?',
      targetSound: 'OMNI',
      soundCue: 'omni means all',
      choices: ['All / Every', 'Few', 'None', 'Many'],
      correct: 'All / Every',
      explanation: 'OMNI means ALL or EVERYWHERE!'
    }
  ],
  32: [
    {
      stageNumber: 32,
      skillTitle: 'Greek Root: PHIL',
      instruction: 'What does the Greek root PHIL mean?',
      spokenPrompt: 'What does the Greek root phil mean?',
      targetSound: 'PHIL',
      soundCue: 'phil means love of wisdom',
      choices: ['Love', 'War', 'Fear', 'Anger'],
      correct: 'Love',
      explanation: 'PHIL translates to LOVE or AFFECTION!'
    }
  ],
  33: [
    {
      stageNumber: 33,
      skillTitle: 'Latin Root: RUPT',
      instruction: 'What does the Latin root RUPT mean?',
      spokenPrompt: 'What does the root rupt mean?',
      targetSound: 'RUPT',
      soundCue: 'rupt means break or burst',
      choices: ['Break / Burst', 'Flow', 'Melt', 'Fly'],
      correct: 'Break / Burst',
      explanation: 'RUPT means to BREAK or BURST violently!'
    }
  ],
  46: [
    {
      stageNumber: 46,
      skillTitle: 'High School Vocabulary: METAMORPHOSIS',
      instruction: 'Strike the Shadow King! What does METAMORPHOSIS mean?',
      spokenPrompt: 'Strike the Shadow King! What does metamorphosis mean?',
      targetSound: 'METAMORPHOSIS',
      soundCue: 'transformation or change of form',
      choices: ['Complete transformation of form', 'Sudden explosion of light', 'Ancient stone formation', 'Frozen crystal lake'],
      correct: 'Complete transformation of form',
      explanation: 'Meta (change) + Morph (form) = Complete transformation of form!'
    }
  ],
  47: [
    {
      stageNumber: 47,
      skillTitle: 'High School Vocabulary: ARCHIPELAGO',
      instruction: 'What geographical feature is an ARCHIPELAGO?',
      spokenPrompt: 'What geographical feature is an archipelago?',
      targetSound: 'ARCHIPELAGO',
      soundCue: 'cluster or chain of islands',
      choices: ['A vast chain of islands', 'A deep mountain canyon', 'A towering glacier', 'An underground cave'],
      correct: 'A vast chain of islands',
      explanation: 'ARCHIPELAGO comes from Greek Archi (chief) + Pelagos (sea) to mean an island cluster!'
    }
  ],
  48: [
    {
      stageNumber: 48,
      skillTitle: 'High School Vocabulary: BENEVOLENT',
      instruction: 'Deplete the barrier! What does BENEVOLENT mean?',
      spokenPrompt: 'What does benevolent mean?',
      targetSound: 'BENEVOLENT',
      soundCue: 'kindly and generous',
      choices: ['Showing goodwill and generosity', 'Harsh and unforgiving', 'Quiet and reserved', 'Speedy and nimble'],
      correct: 'Showing goodwill and generosity',
      explanation: 'Bene (well) + Volens (wishing) = Wishing well and showing great generosity!'
    }
  ],
  49: [
    {
      stageNumber: 49,
      skillTitle: 'High School Vocabulary: JUXTAPOSITION',
      instruction: 'Strike the Throne! What does JUXTAPOSITION mean in language?',
      spokenPrompt: 'What does juxtaposition mean?',
      targetSound: 'JUXTAPOSITION',
      soundCue: 'placing side by side for contrast',
      choices: ['Placing two contrasting things side by side', 'Writing an apology letter', 'Speaking in rhythmic verse', 'Measuring atmospheric pressure'],
      correct: 'Placing two contrasting things side by side',
      explanation: 'Juxta (next to) + Position = Placing items side-by-side to highlight differences!'
    }
  ],
  50: [
    {
      stageNumber: 50,
      skillTitle: 'Grand Finale: Shadow King Magma Showdown',
      instruction: 'FINAL BLOW! What classical word describes the wild uproar of the fallen fortress: PANDEMONIUM?',
      spokenPrompt: 'Final strike! What does pandemonium mean?',
      targetSound: 'PANDEMONIUM',
      soundCue: 'wild uproar and chaotic confusion',
      choices: ['Wild uproar and chaotic confusion', 'Peaceful quiet sanctuary', 'Royal golden banquet', 'Sunlit oceanic voyage'],
      correct: 'Wild uproar and chaotic confusion',
      explanation: 'Pan (all) + Daimon (spirit) = Wild uproar! The Shadow King is defeated and the Golden Phonix is free!'
    }
  ]
};

// -------------------------------------------------------------
// UNIFIED GETTER: Returns difficulty-calibrated challenges
// -------------------------------------------------------------
export const getComprehensiveStageChallenge = (
  landId: LandId,
  stageNumber: number,
  _ageTier: string = 'early-elementary'
): StageChallenge => {
  const normalizedStage = Math.max(1, Math.min(50, stageNumber));

  if (landId === 'sound-shallows') {
    const list = SOUND_SHALLOWS_STAGES[normalizedStage] || SOUND_SHALLOWS_STAGES[1];
    return list[Math.floor(Math.random() * list.length)];
  }

  if (landId === 'builders-guild') {
    return getBuilderGuildChallenge(normalizedStage);
  }

  if (landId === 'tricky-trails') {
    const list = TRICKY_TRAILS_STAGES[normalizedStage];
    if (list && list.length > 0) {
      return list[Math.floor(Math.random() * list.length)];
    }
    const sights = ['SAID', 'THEY', 'COULD', 'WOULD', 'SHOULD', 'WHERE', 'WERE', 'FRIEND', 'LAUGH', 'PEOPLE', 'WATER', 'ENOUGH', 'THROUGH', 'THOUGHT', 'BEAUTIFUL'];
    const s = sights[(normalizedStage - 1) % sights.length];
    const dist = sights.filter(w => w !== s).sort(() => Math.random() - 0.5).slice(0, 3);
    return {
      stageNumber: normalizedStage,
      skillTitle: `Tricky Word Trail: ${s}`,
      instruction: `Leap across the vine! Spot the tricky word: ${s}!`,
      spokenPrompt: `Spot the tricky sight word: ${s}!`,
      targetSound: s,
      soundCue: s,
      choices: [s, ...dist].sort(() => Math.random() - 0.5),
      correct: s,
      explanation: `"${s}" is an essential tricky word!`
    };
  }

  if (landId === 'whispering-peaks') {
    const list = WHISPERING_PEAKS_STAGES[normalizedStage];
    if (list && list.length > 0) {
      return list[Math.floor(Math.random() * list.length)];
    }
    const peaksDualList = [
      { word: 'BLIZZARD', part1: 'BL', part2: 'ARD', choices1: ['BL', 'CL', 'FL', 'GL'], choices2: ['ARD', 'ORD', 'ERD', 'URD'], cue: 'b - l - ih - z - ar - d' },
      { word: 'WINTER', part1: 'IN', part2: 'ER', choices1: ['IN', 'AN', 'ON', 'UN'], choices2: ['ER', 'AR', 'OR', 'UR'], cue: 'w - in - t - er' },
      { word: 'THUNDER', part1: 'UN', part2: 'ER', choices1: ['UN', 'AN', 'EN', 'IN'], choices2: ['ER', 'OR', 'AR', 'UR'], cue: 'th - un - d - er' },
      { word: 'GLACIER', part1: 'GL', part2: 'ER', choices1: ['GL', 'CL', 'BL', 'FL'], choices2: ['ER', 'AR', 'OR', 'UR'], cue: 'g - l - ay - sh - er' },
      { word: 'HARBOR', part1: 'AR', part2: 'OR', choices1: ['AR', 'ER', 'IR', 'UR'], choices2: ['OR', 'AR', 'ER', 'UR'], cue: 'h - ar - b - or' },
      { word: 'FREEZING', part1: 'EE', part2: 'ING', choices1: ['EE', 'EA', 'AI', 'OA'], choices2: ['ING', 'ED', 'LY', 'ER'], cue: 'f - r - ee - z - ing' },
      { word: 'SNOWMAN', part1: 'OW', part2: 'AN', choices1: ['OW', 'OA', 'OU', 'OO'], choices2: ['AN', 'EN', 'IN', 'ON'], cue: 's - n - ow - m - an' },
      { word: 'MOUNTAIN', part1: 'OU', part2: 'AIN', choices1: ['OU', 'OW', 'OI', 'OY'], choices2: ['AIN', 'EAM', 'OOT', 'AIL'], cue: 'm - ou - n - t - ain' },
      { word: 'STARLIGHT', part1: 'AR', part2: 'IGH', choices1: ['AR', 'OR', 'ER', 'UR'], choices2: ['IGH', 'EE', 'AY', 'OW'], cue: 's - t - ar - l - igh - t' },
      { word: 'FORTRESS', part1: 'OR', part2: 'ESS', choices1: ['OR', 'AR', 'ER', 'UR'], choices2: ['ESS', 'ABLE', 'FUL', 'LESS'], cue: 'f - or - t - r - ess' }
    ];
    const item = peaksDualList[(normalizedStage - 1) % peaksDualList.length];
    return {
      stageNumber: normalizedStage,
      skillTitle: `Alpine Slalom: ${item.word}`,
      instruction: `Downhill Snowboard Slalom! Carve through BOTH sound parts for ${item.word}!`,
      spokenPrompt: `Downhill Snowboard Slalom! Carve through both sound parts for ${item.word}!`,
      targetSound: item.word,
      soundCue: item.cue,
      choices: item.choices1,
      correct: item.part1,
      explanation: `${item.word} decodes into sounds '${item.part1}' and '${item.part2}'!`,
      whisperingParts: {
        targetWord: item.word,
        part1: item.part1,
        part2: item.part2,
        choices1: item.choices1,
        choices2: item.choices2
      }
    };
  }

  // Lexicon Empire standard
  const list = LEXICON_EMPIRE_STAGES[normalizedStage];
  if (list && list.length > 0) {
    return list[Math.floor(Math.random() * list.length)];
  }

  const roots = [
    { root: 'CHRON', meaning: 'Time', ex: 'Chronometer' },
    { root: 'BIO', meaning: 'Life', ex: 'Biology' },
    { root: 'GEO', meaning: 'Earth', ex: 'Geology' },
    { root: 'TELE', meaning: 'Distant / Far', ex: 'Telescope' },
    { root: 'GRAPH', meaning: 'Write / Draw', ex: 'Autograph' },
    { root: 'PHON', meaning: 'Sound', ex: 'Symphony' },
    { root: 'SPEC', meaning: 'Look / See', ex: 'Inspect' },
    { root: 'PORT', meaning: 'Carry', ex: 'Transport' },
    { root: 'BENE', meaning: 'Good / Well', ex: 'Benevolent' },
    { root: 'MAL', meaning: 'Bad / Evil', ex: 'Malicious' },
    { root: 'OMNI', meaning: 'All / Every', ex: 'Omniscient' },
    { root: 'THERM', meaning: 'Heat', ex: 'Thermometer' }
  ];
  const r = roots[(normalizedStage - 1) % roots.length];
  const dist = roots.filter(item => item.meaning !== r.meaning).map(item => item.meaning).slice(0, 3);
  return {
    stageNumber: normalizedStage,
    skillTitle: `Imperial Etymology: ${r.root}`,
    instruction: `Strike the Shadow Barrier! What does the ancient root "${r.root}" mean?`,
    spokenPrompt: `What is the meaning of the root: ${r.root}?`,
    targetSound: r.root,
    soundCue: `${r.root} means ${r.meaning}`,
    choices: [r.meaning, ...dist].sort(() => Math.random() - 0.5),
    correct: r.meaning,
    explanation: `"${r.root}" translates to "${r.meaning}"!`
  };
};