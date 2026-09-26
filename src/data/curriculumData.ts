import { LandId } from '../types/character';
import { LandCurriculum, GameChallenge } from '../types/curriculum';

// Helper to construct structured phonics game sets
function makeGame(
  id: string,
  num: number,
  type: GameChallenge['type'],
  title: string,
  prompt: string,
  target: string,
  spoken: string,
  tip: string,
  options: string[],
  answer: string | string[],
  explanation: string,
  diff: number
): GameChallenge {
  return {
    id,
    gameNumber: num,
    type,
    title,
    prompt,
    targetSoundOrWord: target,
    spokenAudioText: spoken,
    phonicsRuleTip: tip,
    options,
    correctAnswer: answer,
    explanation,
    difficultyRating: diff
  };
}

export const PHONIXIA_LANDS: LandCurriculum[] = [
  // LAND 1: SOUND SHALLOWS (Preschool)
  {
    id: 'sound-shallows',
    name: 'Sound Shallows',
    gradeLevel: 'Preschool (Ages 3-5)',
    themeColor: '#0ea5e9',
    accentColor: '#38bdf8',
    lore: 'A sunlit tropical reef where mystical seashells sing the fundamental sounds of language.',
    levels: [
      {
        levelNumber: 1,
        name: 'First Phonics Pearls',
        gradeTier: 'Preschool Starter',
        skillFocus: 'Single Consonant Sounds & Short A',
        description: 'Discover the pure beginning sounds of letters A, M, S, T, P.',
        games: [
          makeGame('ss-1-1', 1, 'SOUND_MATCH', 'Sound of MMM', 'Which shell makes the MMM sound?', 'm', 'mmm', 'M is for moon and monkey.', ['m', 's', 't', 'p'], 'm', 'MMM like mountain!', 1),
          makeGame('ss-1-2', 2, 'SOUND_MATCH', 'Beginning Sound: Sun', 'Which letter makes the SSS sound at the start of "sun"?', 's', 'sun', 'Listen closely to the first hissing sound.', ['s', 'm', 'a', 'b'], 's', 'S makes the SSS sound like snake.', 1),
          makeGame('ss-1-3', 3, 'SOUND_MATCH', 'Sound of AHH', 'Which shell makes the AHH sound like in apple?', 'a', 'apple', 'Short A sounds like ahhh.', ['a', 'o', 'e', 'u'], 'a', 'A says AHH like alligator!', 1),
          makeGame('ss-1-4', 4, 'WORD_BUILDER', 'Build AHH / TUH', 'Which word do these pearls build: AHH / TUH?', 'at', 'at', 'Start with AHH, then add TUH.', ['a', 't', 'm', 'p'], ['a', 't'], 'a + t makes at!', 1),
          makeGame('ss-1-5', 5, 'SOUND_MATCH', 'Sound of TUH', 'Which pearl makes the ticking TUH sound?', 't', 'tuh', 'T makes a tapping TUH sound.', ['t', 'd', 'p', 'k'], 't', 'T is for turtle and tiger!', 1),
          makeGame('ss-1-6', 6, 'SOUND_MATCH', 'Sound of PUH', 'Which letter makes the popping PUH sound at the start of "pan"?', 'p', 'pan', 'Pop your lips for PUH.', ['p', 'b', 'd', 't'], 'p', 'P pops with the PUH sound!', 1),
          makeGame('ss-1-7', 7, 'SOUND_MATCH', 'Sound of BUH', 'Which letter makes the BUH sound?', 'b', 'buh', 'Press lips together for BUH.', ['b', 'd', 'p', 't'], 'b', 'B makes the BUH sound like bear!', 1),
          makeGame('ss-1-8', 8, 'WORD_BUILDER', 'Build MMM / AHH / PUH', 'Which word do these pearls build: MMM / AHH / PUH?', 'map', 'map', 'MMM - AHH - PUH.', ['m', 'a', 'p', 's'], ['m', 'a', 'p'], 'm + a + p = map!', 2),
          makeGame('ss-1-9', 9, 'SOUND_MATCH', 'Middle Sound in "PAT"', 'Which pearl makes the AHH sound in "pat"?', 'a', 'pat', 'A, E, I, O, U are vowels.', ['a', 'p', 't', 's'], 'a', 'A is the middle vowel AHH in pat.', 2),
          makeGame('ss-1-10', 10, 'WORD_BUILDER', 'Build SSS / AHH / MMM', 'Which word do these pearls build: SSS / AHH / MMM?', 'sam', 'sam', 'Blend SSS / AHH / MMM.', ['s', 'a', 'm', 't'], ['s', 'a', 'm'], 'Super job! Sam is ready to explore!', 2)
        ]
      },
      {
        levelNumber: 2,
        name: 'Coral Word Endings',
        gradeTier: 'Preschool Advanced',
        skillFocus: 'Short Vowels & Simple Rimes (-an, -at, -op, -ig)',
        description: 'Explore tidal pools where letters group into word ending families.',
        games: [
          makeGame('ss-2-1', 1, 'WORD_BUILDER', 'Build FFF / AHH / NNN', 'Which word do these pearls build: FFF / AHH / NNN?', 'fan', 'fan', 'FFF + AHH + NNN', ['f', 'a', 'n', 't'], ['f', 'a', 'n'], 'F-A-N spells fan!', 2),
          makeGame('ss-2-2', 2, 'RHYME_RUSH', 'Rhyme with Pop', 'What rhymes with "pop"?', 'hop', 'pop', 'Listen for the -op sound.', ['hop', 'car', 'hat', 'run'], 'hop', 'Pop and hop both end in -op!', 2),
          makeGame('ss-2-3', 3, 'SOUND_MATCH', 'Sound of AHH / OH', 'Which word has the short OH / AHH sound like octopus?', 'pot', 'pot', 'Listen for the open "ah" sound.', ['pot', 'pet', 'pit', 'pat'], 'pot', 'Pot has short o!', 2),
          makeGame('ss-2-4', 4, 'WORD_BUILDER', 'Build PUH / IH / GUH', 'Which word do these pearls build: PUH / IH / GUH?', 'pig', 'pig', 'PUH / IH / GUH', ['p', 'i', 'g', 'd'], ['p', 'i', 'g'], 'P-I-G spells pig!', 2),
          makeGame('ss-2-5', 5, 'RHYME_RUSH', 'Rhyme with Wig', 'Which sea creature word rhymes with "wig"?', 'big', 'wig', '-ig word family.', ['big', 'bad', 'box', 'bed'], 'big', 'Big and wig are in the -ig family!', 2),
          makeGame('ss-2-6', 6, 'SOUND_MATCH', 'Ending Sound in "CUP"', 'Which letter makes the final PUH sound in "cup"?', 'p', 'cup', 'Focus on the final sound you hear.', ['p', 'k', 't', 'm'], 'p', 'Cup ends with the PUH sound.', 2),
          makeGame('ss-2-7', 7, 'WORD_BUILDER', 'Build SSS / UH / NNN', 'Which word do these pearls build: SSS / UH / NNN?', 'sun', 'sun', 'SSS - UH - NNN', ['s', 'u', 'n', 'o'], ['s', 'u', 'n'], 'S-U-N makes sun!', 2),
          makeGame('ss-2-8', 8, 'RHYME_RUSH', 'Rhyme with Sun', 'Which pearl word rhymes with "sun"?', 'run', 'sun', '-un word family.', ['run', 'sand', 'sky', 'sea'], 'run', 'Sun and run rhyme together!', 2),
          makeGame('ss-2-9', 9, 'SOUND_MATCH', 'Sound of EH', 'Which letter makes the short EH sound like in elephant?', 'e', 'bed', 'Short E says EH.', ['bed', 'bad', 'bud', 'bod'], 'bed', 'Bed has the short EH sound!', 2),
          makeGame('ss-2-10', 10, 'WORD_BUILDER', 'Build TUH / OH / PUH', 'Which word do these pearls build: TUH / OH / PUH?', 'top', 'top', 'TUH / OH / PUH', ['t', 'o', 'p', 'b'], ['t', 'o', 'p'], 'Fantastic! You mastered Coral Endings!', 2)
        ]
      },
      {
        levelNumber: 3,
        name: 'Lagoon Rhyme Haven',
        gradeTier: 'Preschool Mastery',
        skillFocus: 'Phonemic Awareness & Auditory Rhymes',
        description: 'Listen to the singing lagoon dolphins and match acoustic rhymes.',
        games: [
          makeGame('ss-3-1', 1, 'RHYME_RUSH', 'Rhyme with Fox', 'Which word rhymes with "fox"?', 'box', 'fox', '-ox ending sound.', ['box', 'fish', 'frog', 'fly'], 'box', 'Fox and box rhyme!', 2),
          makeGame('ss-3-2', 2, 'RHYME_RUSH', 'Rhyme with Hen', 'What rhymes with "hen"?', 'pen', 'hen', '-en family sound.', ['pen', 'pig', 'pan', 'pup'], 'pen', 'Hen and pen both rhyme with -en!', 2),
          makeGame('ss-3-3', 3, 'SOUND_MATCH', 'First Sound Match', 'Which word starts with the same sound as "bear"?', 'boat', 'bear', 'Look for words starting with /b/.', ['boat', 'seal', 'clam', 'crab'], 'boat', 'Bear and boat both start with /b/!', 2),
          makeGame('ss-3-4', 4, 'WORD_BUILDER', 'Build "RED"', 'Spell the vibrant coral color "red".', 'red', 'red', '/r/ /e/ /d/', ['r', 'e', 'd', 'b'], ['r', 'e', 'd'], 'R-E-D spells red!', 2),
          makeGame('ss-3-5', 5, 'RHYME_RUSH', 'Rhyme with Net', 'What rhymes with the sea "net"?', 'wet', 'net', '-et sound ending.', ['wet', 'not', 'nut', 'neat'], 'wet', 'Net and wet make a splash rhyme!', 2),
          makeGame('ss-3-6', 6, 'SOUND_MATCH', 'Middle Sound Hunt', 'What is the middle sound in "fin"?', 'i', 'fin', 'Listen between /f/ and /n/.', ['i', 'a', 'o', 'e'], 'i', 'The middle sound is short i: /ih/.', 2),
          makeGame('ss-3-7', 7, 'WORD_BUILDER', 'Build "WET"', 'Spell "wet" before the tide rises.', 'wet', 'wet', '/w/ /e/ /t/', ['w', 'e', 't', 'm'], ['w', 'e', 't'], 'W-E-T spells wet!', 2),
          makeGame('ss-3-8', 8, 'RHYME_RUSH', 'Rhyme with Dog', 'Which creature rhymes with "dog"?', 'frog', 'dog', '-og ending sound.', ['frog', 'duck', 'deer', 'dove'], 'frog', 'Dog and frog rhyme with -og!', 2),
          makeGame('ss-3-9', 9, 'SOUND_MATCH', 'Initial /d/', 'Which word begins with the /d/ sound like dolphin?', 'dive', 'dolphin', 'Feel your tongue tap for /d/.', ['dive', 'tide', 'swim', 'wave'], 'dive', 'Dive starts with /d/!', 2),
          makeGame('ss-3-10', 10, 'WORD_BUILDER', 'Lagoon Secret: FIN', 'Spell "fin" to swim with the dolphins!', 'fin', 'fin', '/f/ /i/ /n/', ['f', 'i', 'n', 'm'], ['f', 'i', 'n'], 'Hooray! The dolphins cheer for you!', 2)
        ]
      },
      {
        levelNumber: 4,
        name: 'Tidepool Sound Blends',
        gradeTier: 'Preschool Bridge',
        skillFocus: 'Initial Sound Blending & 3-Sound Phoneme Segmentation',
        description: 'Isolate each individual phoneme sound in small water creatures.',
        games: [
          makeGame('ss-4-1', 1, 'SOUND_MATCH', 'Count Sounds in "CAT"', 'How many sounds do you hear in /k/ /æ/ /t/?', '3', 'cat', 'Count each sound separately.', ['2', '3', '4', '1'], '3', 'C-A-T has 3 phonemes: /k/ /æ/ /t/.', 2),
          makeGame('ss-4-2', 2, 'WORD_BUILDER', 'Spell "BUG"', 'Assemble "bug" to help the hermit crab.', 'bug', 'bug', '/b/ /u/ /g/', ['b', 'u', 'g', 'p'], ['b', 'u', 'g'], 'B-U-G spells bug!', 2),
          makeGame('ss-4-3', 3, 'SOUND_MATCH', 'Sound Subtraction', 'What word do you get if you take /c/ from "cup" and put /p/?', 'pup', 'pup', 'Swap the first sound.', ['pup', 'pop', 'pip', 'pet'], 'pup', 'Changing /c/ to /p/ makes pup!', 2),
          makeGame('ss-4-4', 4, 'WORD_BUILDER', 'Spell "ZIP"', 'Spell "zip" like a speedy water bug.', 'zip', 'zip', '/z/ /i/ /p/', ['z', 'i', 'p', 's'], ['z', 'i', 'p'], 'Z-I-P spells zip!', 2),
          makeGame('ss-4-5', 5, 'RHYME_RUSH', 'Rhyme with Lip', 'What rhymes with "lip"?', 'ship', 'lip', '-ip ending.', ['ship', 'lap', 'lop', 'loop'], 'ship', 'Lip and ship rhyme with -ip!', 2),
          makeGame('ss-4-6', 6, 'SOUND_MATCH', 'Hard C sound', 'Which letter makes the /k/ sound in "clam"?', 'c', 'clam', 'C sounds like /k/ here.', ['c', 's', 'z', 'm'], 'c', 'C makes the /k/ sound!', 2),
          makeGame('ss-4-7', 7, 'WORD_BUILDER', 'Spell "JAM"', 'Make "jam" for the seagull picnic.', 'jam', 'jam', '/j/ /a/ /m/', ['j', 'a', 'm', 'g'], ['j', 'a', 'm'], 'J-A-M spells jam!', 2),
          makeGame('ss-4-8', 8, 'RHYME_RUSH', 'Rhyme with Jam', 'What rhymes with sweet "jam"?', 'clam', 'jam', '-am word family.', ['clam', 'crab', 'coral', 'current'], 'clam', 'Jam and clam rhyme in -am!', 2),
          makeGame('ss-4-9', 9, 'SOUND_MATCH', 'Ending Sound in "TUB"', 'What is the last sound in "tub"?', 'b', 'tub', 'Listen to the finish.', ['b', 'd', 'p', 't'], 'b', 'Tub ends with /b/!', 2),
          makeGame('ss-4-10', 10, 'WORD_BUILDER', 'Tidepool Legend: JET', 'Spell "jet" as water shoots high!', 'jet', 'jet', '/j/ /e/ /t/', ['j', 'e', 't', 'g'], ['j', 'e', 't'], 'Splendid! Tidepool sounds mastered!', 2)
        ]
      },
      {
        levelNumber: 5,
        name: 'The Pearl Temple Trial',
        gradeTier: 'Preschool Graduation',
        skillFocus: 'Master Sound Blending & CVC Fluency',
        description: 'Unlock the great Golden Oyster of Sound Shallows by decoding 10 sound riddles.',
        games: [
          makeGame('ss-5-1', 1, 'WORD_BUILDER', 'Spell "SHELL"', 'Spell "shell" with digraph sh.', 'shell', 'shell', 'sh + e + ll', ['sh', 'e', 'll', 'ck'], ['sh', 'e', 'll'], 'SH-E-LL spells shell!', 3),
          makeGame('ss-5-2', 2, 'SOUND_MATCH', 'Find Digraph SH', 'Which letters make the quiet /sh/ sound?', 'sh', 'sh', 'Hush sound.', ['sh', 'ch', 'th', 'wh'], 'sh', 'SH says /sh/ like in shell!', 3),
          makeGame('ss-5-3', 3, 'WORD_BUILDER', 'Spell "FISH"', 'Spell the swimming creature "fish".', 'fish', 'fish', 'f + i + sh', ['f', 'i', 'sh', 'ch'], ['f', 'i', 'sh'], 'F-I-SH makes fish!', 3),
          makeGame('ss-5-4', 4, 'RHYME_RUSH', 'Rhyme with Fish', 'What rhymes with "fish"?', 'wish', 'fish', '-ish rhyme sound.', ['wish', 'fin', 'fist', 'fast'], 'wish', 'Fish and wish rhyme perfectly!', 3),
          makeGame('ss-5-5', 5, 'SOUND_MATCH', 'Blend /f/ /l/ /æ/ /g/', 'Blend these sounds together: /f/ /l/ /æ/ /g/', 'flag', 'flag', 'Listen to the blended word.', ['flag', 'frog', 'fog', 'flap'], 'flag', 'Sounds blend into flag!', 3),
          makeGame('ss-5-6', 6, 'WORD_BUILDER', 'Spell "STAR"', 'Spell "star" in the night sky.', 'star', 'star', 'st + ar', ['st', 'a', 'r', 'p'], ['st', 'a', 'r'], 'S-T-A-R spells star!', 3),
          makeGame('ss-5-7', 7, 'RHYME_RUSH', 'Rhyme with Star', 'What word rhymes with "star"?', 'far', 'star', '-ar word sound.', ['far', 'stay', 'step', 'sand'], 'far', 'Star and far share the -ar sound!', 3),
          makeGame('ss-5-8', 8, 'SOUND_MATCH', 'Turtle Sound Test', 'Which word begins with /t/ and rhymes with "nest"?', 'test', 'test', 'Think about /t/ + est.', ['test', 'best', 'rest', 'west'], 'test', 'Test starts with /t/ and rhymes with nest!', 3),
          makeGame('ss-5-9', 9, 'WORD_BUILDER', 'Spell "CLAM"', 'Spell "clam" from the sandy bed.', 'clam', 'clam', 'cl + a + m', ['c', 'l', 'a', 'm'], ['c', 'l', 'a', 'm'], 'C-L-A-M spells clam!', 3),
          makeGame('ss-5-10', 10, 'WORD_BUILDER', 'The Pearl Pearl Crown: WAVE', 'Spell "wave" with magic e power!', 'wave', 'wave', 'w + a + v + e', ['w', 'a', 'v', 'e'], ['w', 'a', 'v', 'e'], 'CONGRATULATIONS! You conquered Sound Shallows!', 3)
        ]
      }
    ]
  },

  // LAND 2: BUILDERS GUILD (Kindergarten)
  {
    id: 'builders-guild',
    name: 'Builders Guild',
    gradeLevel: 'Kindergarten (Ages 5-6)',
    themeColor: '#f59e0b',
    accentColor: '#fbbf24',
    lore: 'A bustling architectural quarry where stone masons craft consonant digraphs, word families, and CVC towers.',
    levels: [
      {
        levelNumber: 1,
        name: 'The CVC Stone Yard',
        gradeTier: 'Kindergarten Core',
        skillFocus: 'Consonant-Vowel-Consonant Building Blocks',
        description: 'Chisel basic CVC words to lay sturdy foundations.',
        games: [
          makeGame('bg-1-1', 1, 'WORD_BUILDER', 'Build KUH / AHH / TUH', 'Which word do these keystones build: KUH / AHH / TUH?', 'cat', 'cat', 'KUH + AHH + TUH', ['c', 'a', 't', 'b'], ['c', 'a', 't'], 'C-A-T makes cat!', 2),
          makeGame('bg-1-2', 2, 'WORD_BUILDER', 'Build DUH / AH / GUH', 'Which word do these keystones build: DUH / AH / GUH?', 'dog', 'dog', 'DUH + AH + GUH', ['d', 'o', 'g', 'b'], ['d', 'o', 'g'], 'D-O-G makes dog!', 2),
          makeGame('bg-1-3', 3, 'WORD_BUILDER', 'Build BUH / EH / DAH', 'Which word do these keystones build: BUH / EH / DAH?', 'bed', 'bed', 'BUH + EH + DAH', ['b', 'e', 'd', 'p'], ['b', 'e', 'd'], 'B-E-D makes bed!', 2),
          makeGame('bg-1-4', 4, 'WORD_BUILDER', 'Build SSS / UH / NNN', 'Which word do these keystones build: SSS / UH / NNN?', 'sun', 'sun', 'SSS + UH + NNN', ['s', 'u', 'n', 'm'], ['s', 'u', 'n'], 'S-U-N makes sun!', 2),
          makeGame('bg-1-5', 5, 'RHYME_RUSH', 'Rhyme with Hat', 'Which block rhymes with "hat"?', 'mat', 'hat', '-at family block.', ['mat', 'mop', 'mud', 'man'], 'mat', 'Hat and mat both end in -at!', 2),
          makeGame('bg-1-6', 6, 'WORD_BUILDER', 'Build FFF / OH / KSS', 'Which word do these keystones build: FFF / OH / KSS?', 'fox', 'fox', 'FFF + OH + KSS', ['f', 'o', 'x', 's'], ['f', 'o', 'x'], 'F-O-X makes fox!', 2),
          makeGame('bg-1-7', 7, 'SOUND_MATCH', 'Sound of Letter X', 'What two sounds does the letter X make at the end of "box"?', '/ks/', 'box', 'X sounds like KUH and SSS together.', ['/ks/', '/sh/', '/ch/', '/th/'], '/ks/', 'X sounds like KSS!', 2),
          makeGame('bg-1-8', 8, 'WORD_BUILDER', 'Build ZZZ / IH / PUH', 'Which word do these keystones build: ZZZ / IH / PUH?', 'zip', 'zip', 'ZZZ + IH + PUH', ['z', 'i', 'p', 'b'], ['z', 'i', 'p'], 'Z-I-P spells zip!', 2),
          makeGame('bg-1-9', 9, 'RHYME_RUSH', 'Rhyme with Pin', 'Which word rhymes with "pin"?', 'win', 'pin', '-in family block.', ['win', 'wet', 'web', 'wax'], 'win', 'Pin and win share the -in sound!', 2),
          makeGame('bg-1-10', 10, 'WORD_BUILDER', 'Build KUH / UH / PUH', 'Which word do these keystones build: KUH / UH / PUH?', 'cup', 'cup', 'KUH + UH + PUH', ['c', 'u', 'p', 't'], ['c', 'u', 'p'], 'Terrific! The CVC Stone Yard is complete!', 2)
        ]
      },
      {
        levelNumber: 2,
        name: 'The Digraph Crane: SH & CH',
        gradeTier: 'Kindergarten Digraphs',
        skillFocus: 'Consonant Digraphs SH and CH',
        description: 'Operate the mighty quarry crane to weld two letters into one unique sound.',
        games: [
          makeGame('bg-2-1', 1, 'SOUND_MATCH', 'Digraph Identification', 'Which digraph makes the /sh/ sound as in "ship"?', 'sh', 'ship', 'S and H combine.', ['sh', 'ch', 'th', 'wh'], 'sh', 'S and H make /sh/!', 2),
          makeGame('bg-2-2', 2, 'WORD_BUILDER', 'Build "SHIP"', 'Use the SH block to spell "ship".', 'ship', 'ship', 'SH + I + P', ['sh', 'i', 'p', 'b'], ['sh', 'i', 'p'], 'SH-I-P spells ship!', 2),
          makeGame('bg-2-3', 3, 'SOUND_MATCH', 'Digraph CH sound', 'Which sound starts the word "chip"?', 'ch', 'chip', 'Train chug sound.', ['ch', 'sh', 'th', 'ph'], 'ch', 'CH makes the /ch/ sound!', 2),
          makeGame('bg-2-4', 4, 'WORD_BUILDER', 'Build "CHIN"', 'Spell "chin" using the crane.', 'chin', 'chin', 'CH + I + N', ['ch', 'i', 'n', 'm'], ['ch', 'i', 'n'], 'CH-I-N spells chin!', 2),
          makeGame('bg-2-5', 5, 'RHYME_RUSH', 'Rhyme with Wish', 'Which word rhymes with "wish"?', 'dish', 'wish', '-ish digraph ending.', ['dish', 'ditch', 'dock', 'damp'], 'dish', 'Wish and dish rhyme with -ish!', 2),
          makeGame('bg-2-6', 6, 'WORD_BUILDER', 'Build "CHOP"', 'Chop timber with stone: spell "chop".', 'chop', 'chop', 'CH + O + P', ['ch', 'o', 'p', 't'], ['ch', 'o', 'p'], 'CH-O-P spells chop!', 2),
          makeGame('bg-2-7', 7, 'SOUND_MATCH', 'Ending Digraph in "RICH"', 'What digraph finishes the word "rich"?', 'ch', 'rich', 'Listen to the ending.', ['ch', 'sh', 'th', 'ck'], 'ch', 'Rich ends with CH!', 2),
          makeGame('bg-2-8', 8, 'WORD_BUILDER', 'Build "SHED"', 'Construct a stone "shed".', 'shed', 'shed', 'SH + E + D', ['sh', 'e', 'd', 'b'], ['sh', 'e', 'd'], 'SH-E-D spells shed!', 2),
          makeGame('bg-2-9', 9, 'RHYME_RUSH', 'Rhyme with Chat', 'What rhymes with "chat"?', 'flat', 'chat', '-at family sound.', ['flat', 'frog', 'flip', 'fast'], 'flat', 'Chat and flat rhyme!', 2),
          makeGame('bg-2-10', 10, 'WORD_BUILDER', 'Master Digraph: CHIEF', 'Forge the master block "chin"!', 'chin', 'chin', 'CH + I + N', ['ch', 'i', 'n', 'g'], ['ch', 'i', 'n'], 'Superb! The SH & CH Crane is fully mastered!', 2)
        ]
      },
      {
        levelNumber: 3,
        name: 'The Anvil of TH, WH & CK',
        gradeTier: 'Kindergarten Expansion',
        skillFocus: 'Digraphs TH (voiced/unvoiced), WH, and CK spelling rule',
        description: 'Learn the rule: CK comes after a single short vowel!',
        games: [
          makeGame('bg-3-1', 1, 'RULE_DETECTIVE', 'The CK Rule', 'Which word is spelled correctly with the CK rule?', 'duck', 'duck', 'CK follows a short vowel!', ['duck', 'duk', 'duc', 'dukk'], 'duck', 'Duck uses CK after short u!', 2),
          makeGame('bg-3-2', 2, 'SOUND_MATCH', 'Digraph TH Sound', 'Which letters make the /th/ sound in "thumb"?', 'th', 'thumb', 'Tongue between teeth.', ['th', 'wh', 'sh', 'ch'], 'th', 'T and H make /th/!', 2),
          makeGame('bg-3-3', 3, 'WORD_BUILDER', 'Build "THIN"', 'Forge the word "thin".', 'thin', 'thin', 'TH + I + N', ['th', 'i', 'n', 'k'], ['th', 'i', 'n'], 'TH-I-N spells thin!', 2),
          makeGame('bg-3-4', 4, 'SOUND_MATCH', 'Question Word WH', 'Which digraph starts words like "when", "what", and "whip"?', 'wh', 'whip', 'W and H breath.', ['wh', 'th', 'ch', 'sh'], 'wh', 'WH begins questions like when and where!', 2),
          makeGame('bg-3-5', 5, 'WORD_BUILDER', 'Build "SOCK"', 'Remember: short O takes CK!', 'sock', 'sock', 'S + O + CK', ['s', 'o', 'ck', 'k'], ['s', 'o', 'ck'], 'S-O-CK spells sock!', 2),
          makeGame('bg-3-6', 6, 'RHYME_RUSH', 'Rhyme with Rock', 'Which masonry word rhymes with "rock"?', 'block', 'rock', '-ock ending family.', ['block', 'brick', 'bark', 'beam'], 'block', 'Rock and block rhyme with -ock!', 2),
          makeGame('bg-3-7', 7, 'WORD_BUILDER', 'Build "WHIP"', 'Spell "whip" using WH block.', 'whip', 'whip', 'WH + I + P', ['wh', 'i', 'p', 'b'], ['wh', 'i', 'p'], 'WH-I-P spells whip!', 2),
          makeGame('bg-3-8', 8, 'RULE_DETECTIVE', 'Voiced TH', 'Which word has the buzzing voiced TH sound like in "feather"?', 'this', 'this', 'Feel your throat vibrate.', ['this', 'thick', 'thin', 'thimble'], 'this', 'This has the voiced TH sound!', 3),
          makeGame('bg-3-9', 9, 'WORD_BUILDER', 'Build "LOCK"', 'Secure the guild gate: spell "lock".', 'lock', 'lock', 'L + O + CK', ['l', 'o', 'ck', 'k'], ['l', 'o', 'ck'], 'L-O-CK spells lock!', 2),
          makeGame('bg-3-10', 10, 'WORD_BUILDER', 'Keystone: THICK', 'Combine TH and CK to forge "thick"!', 'thick', 'thick', 'TH + I + CK', ['th', 'i', 'ck', 'k'], ['th', 'i', 'ck'], 'Incredible! You welded TH and CK together!', 3)
        ]
      },
      {
        levelNumber: 4,
        name: 'The Floss Rule Workshop',
        gradeTier: 'Kindergarten Advanced',
        skillFocus: 'Double Consonant Rule: F, L, S, Z (FLOSS)',
        description: 'When a 1-syllable word has a short vowel ending in F, L, S, or Z, double the final letter!',
        games: [
          makeGame('bg-4-1', 1, 'RULE_DETECTIVE', 'Double F in Cliff', 'Which spelling obeys the FLOSS rule for "cliff"?', 'cliff', 'cliff', 'Double F after short I.', ['cliff', 'clif', 'clyf', 'klif'], 'cliff', 'Cliff ends in double FF!', 3),
          makeGame('bg-4-2', 2, 'WORD_BUILDER', 'Build "BELL"', 'Ring the tower: double L after short E.', 'bell', 'bell', 'B + E + LL', ['b', 'e', 'll', 'l'], ['b', 'e', 'll'], 'B-E-LL spells bell!', 2),
          makeGame('bg-4-3', 3, 'RULE_DETECTIVE', 'Double S in Glass', 'Find the correct FLOSS spelling of "glass":', 'glass', 'glass', 'Double S after short A.', ['glass', 'glas', 'glace', 'glaas'], 'glass', 'Glass doubles the S!', 2),
          makeGame('bg-4-4', 4, 'WORD_BUILDER', 'Build "BUZZ"', 'Like a bee at the quarry: spell "buzz".', 'buzz', 'buzz', 'B + U + ZZ', ['b', 'u', 'zz', 'z'], ['b', 'u', 'zz'], 'B-U-ZZ spells buzz!', 2),
          makeGame('bg-4-5', 5, 'RHYME_RUSH', 'Rhyme with Hill', 'Which word rhymes with "hill"?', 'mill', 'hill', '-ill FLOSS family.', ['mill', 'meal', 'mail', 'mile'], 'mill', 'Hill and mill both rhyme!', 2),
          makeGame('bg-4-6', 6, 'WORD_BUILDER', 'Build "PUFF"', 'A puff of stone dust: spell "puff".', 'puff', 'puff', 'P + U + FF', ['p', 'u', 'ff', 'f'], ['p', 'u', 'ff'], 'P-U-FF spells puff!', 2),
          makeGame('bg-4-7', 7, 'RULE_DETECTIVE', 'Exception Spotter', 'Which word is an exception and does NOT double its final consonant?', 'bus', 'bus', 'Bus is a famous everyday exception.', ['bus', 'boss', 'bliss', 'bass'], 'bus', 'Bus is an exception to the floss rule!', 3),
          makeGame('bg-4-8', 8, 'WORD_BUILDER', 'Build "MISS"', 'Spell "miss" using the double S rule.', 'miss', 'miss', 'M + I + SS', ['m', 'i', 'ss', 's'], ['m', 'i', 'ss'], 'M-I-SS spells miss!', 2),
          makeGame('bg-4-9', 9, 'RHYME_RUSH', 'Rhyme with Well', 'Which quarry tool rhymes with "well"?', 'drill', 'well', 'Look for -ell sound.', ['yell', 'wall', 'wool', 'will'], 'yell', 'Well and yell rhyme in -ell!', 2),
          makeGame('bg-4-10', 10, 'WORD_BUILDER', 'Guild Arch: SHELL', 'Combine SH and double LL to build "shell"!', 'shell', 'shell', 'SH + E + LL', ['sh', 'e', 'll', 'l'], ['sh', 'e', 'll'], 'Outstanding! Floss Rule Mastered!', 3)
        ]
      },
      {
        levelNumber: 5,
        name: 'The Grand Cathedral Spire',
        gradeTier: 'Kindergarten Capstone',
        skillFocus: 'Consonant Blends & Multi-Block Architecture',
        description: 'Place the golden gargoyles atop the Cathedral by decoding complex blends.',
        games: [
          makeGame('bg-5-1', 1, 'WORD_BUILDER', 'Build "FROG"', 'Assemble blend FR + OG.', 'frog', 'frog', 'FR + O + G', ['fr', 'o', 'g', 'b'], ['fr', 'o', 'g'], 'FR-O-G spells frog!', 3),
          makeGame('bg-5-2', 2, 'SOUND_MATCH', 'Initial Blend in "CLAP"', 'What blend starts "clap"?', 'cl', 'clap', 'C and L blending.', ['cl', 'cr', 'fl', 'gl'], 'cl', 'C and L blend into /cl/!', 2),
          makeGame('bg-5-3', 3, 'WORD_BUILDER', 'Build "STOP"', 'Spell "stop" with blend ST.', 'stop', 'stop', 'ST + O + P', ['st', 'o', 'p', 'b'], ['st', 'o', 'p'], 'ST-O-P spells stop!', 2),
          makeGame('bg-5-4', 4, 'SOUND_MATCH', 'Ending Blend in "CAMP"', 'What two consonant sounds end "camp"?', 'mp', 'camp', 'M and P blend.', ['mp', 'nt', 'nd', 'st'], 'mp', 'M and P blend into /mp/!', 2),
          makeGame('bg-5-5', 5, 'WORD_BUILDER', 'Build "PLUG"', 'Power the waterwheel: spell "plug".', 'plug', 'plug', 'PL + U + G', ['pl', 'u', 'g', 'd'], ['pl', 'u', 'g'], 'PL-U-G spells plug!', 3),
          makeGame('bg-5-6', 6, 'RHYME_RUSH', 'Rhyme with Stand', 'Which word rhymes with "stand"?', 'grand', 'stand', '-and blend ending.', ['grand', 'grain', 'grunt', 'grin'], 'grand', 'Stand and grand rhyme with -and!', 3),
          makeGame('bg-5-7', 7, 'WORD_BUILDER', 'Build "BRICK"', 'Combine blend BR + I + CK!', 'brick', 'brick', 'BR + I + CK', ['br', 'i', 'ck', 'k'], ['br', 'i', 'ck'], 'BR-I-CK spells brick!', 3),
          makeGame('bg-5-8', 8, 'RULE_DETECTIVE', 'CK vs K', 'Why does "milk" end in K instead of CK?', 'consonant before K', 'milk', 'L is a consonant, not a short vowel!', ['consonant before K', 'it has short vowel', 'magic e rule', 'silent letter'], 'consonant before K', 'CK only comes directly after a single short vowel. In milk, L comes first!', 3),
          makeGame('bg-5-9', 9, 'WORD_BUILDER', 'Build "CRANE"', 'Spell "crane" with magic e power!', 'crane', 'crane', 'CR + A + N + E', ['cr', 'a', 'n', 'e'], ['cr', 'a', 'n', 'e'], 'CR-A-N-E spells crane!', 3),
          makeGame('bg-5-10', 10, 'WORD_BUILDER', 'Master Mason: BUILD', 'Spell the ultimate Guild word: "BUILD"!', 'build', 'build', 'B + U + I + L + D', ['b', 'u', 'i', 'l', 'd'], ['b', 'u', 'i', 'l', 'd'], 'CONGRATULATIONS! You are now a Master Mason of Builders Guild!', 3)
        ]
      }
    ]
  },

  // LAND 3: TRICKY TRAILS (Early Elementary / 1st-2nd Grade)
  {
    id: 'tricky-trails',
    name: 'Tricky Trails',
    gradeLevel: 'Early Elementary (Grades 1-2)',
    themeColor: '#10b981',
    accentColor: '#34d399',
    lore: 'An enchanted winding forest of magical mushrooms, talking foxes, and secret stepping stones where sight words and Silent E rule.',
    levels: [
      {
        levelNumber: 1,
        name: 'The Magic E Grove',
        gradeTier: '1st Grade Core',
        skillFocus: 'Magic E / Silent E (CVCe Vowel Long Sounds)',
        description: 'See how the silent E transforms short vowels into long vowels that say their name!',
        games: [
          makeGame('tt-1-1', 1, 'MAGIC_E', 'Cap to Cape', 'What does "cap" become when Magic E arrives?', 'cape', 'cape', 'Magic E makes A say its name.', ['cape', 'cope', 'cupe', 'cap'], 'cape', 'Silent E transforms cap into cape!', 2),
          makeGame('tt-1-2', 2, 'MAGIC_E', 'Kit to Kite', 'Transform "kit" into a flying toy with Magic E:', 'kite', 'kite', 'Short I becomes long I.', ['kite', 'kute', 'kate', 'kot'], 'kite', 'Kit becomes kite!', 2),
          makeGame('tt-1-3', 3, 'MAGIC_E', 'Hop to Hope', 'What does "hop" become with Magic E?', 'hope', 'hope', 'Short O becomes long O.', ['hope', 'hype', 'hape', 'hupe'], 'hope', 'Hop becomes hope!', 2),
          makeGame('tt-1-4', 4, 'WORD_BUILDER', 'Spell "CAKE"', 'Spell the sweet treat with Magic E.', 'cake', 'cake', 'C + A + K + E', ['c', 'a', 'k', 'e'], ['c', 'a', 'k', 'e'], 'C-A-K-E spells cake!', 2),
          makeGame('tt-1-5', 5, 'MAGIC_E', 'Tub to Tube', 'Transform "tub" with Magic E:', 'tube', 'tube', 'Short U becomes long U (oo).', ['tube', 'tobe', 'tabe', 'tybe'], 'tube', 'Tub becomes tube!', 2),
          makeGame('tt-1-6', 6, 'WORD_BUILDER', 'Spell "BIKE"', 'Spell "bike" using the CVCe pattern.', 'bike', 'bike', 'B + I + K + E', ['b', 'i', 'k', 'e'], ['b', 'i', 'k', 'e'], 'B-I-K-E spells bike!', 2),
          makeGame('tt-1-7', 7, 'RULE_DETECTIVE', 'Soft C with Magic E', 'Why does "face" have a soft /s/ sound?', 'E follows C', 'face', 'When C is followed by E, I, or Y, it says /s/!', ['E follows C', 'A is long', 'F is quiet', 'It has two vowels'], 'E follows C', 'C makes the soft /s/ sound when followed by E, I, or Y!', 3),
          makeGame('tt-1-8', 8, 'WORD_BUILDER', 'Spell "ROSE"', 'Spell the fragrant flower "rose".', 'rose', 'rose', 'R + O + S + E', ['r', 'o', 's', 'e'], ['r', 'o', 's', 'e'], 'R-O-S-E spells rose!', 2),
          makeGame('tt-1-9', 9, 'MAGIC_E', 'Pin to Pine', 'Transform "pin" into a tall evergreen tree:', 'pine', 'pine', 'Short I to Long I.', ['pine', 'pane', 'pone', 'pune'], 'pine', 'Pin becomes pine!', 2),
          makeGame('tt-1-10', 10, 'WORD_BUILDER', 'Grove Champion: FLAME', 'Forge the Phoenix flame word!', 'flame', 'flame', 'FL + A + M + E', ['fl', 'a', 'm', 'e'], ['fl', 'a', 'm', 'e'], 'Brilliant! The Magic E Grove shines bright!', 3)
        ]
      },
      {
        levelNumber: 2,
        name: 'The Foxs Tricky Stepping Stones',
        gradeTier: '1st Grade Sight Words',
        skillFocus: 'High-Frequency Tricky Sight Words',
        description: 'Cross the rushing river by stepping only on correctly spelled tricky sight words.',
        games: [
          makeGame('tt-2-1', 1, 'SIGHT_BRIDGE', 'Tricky Word: SAID', 'Pick the correct spelling of the foxs past spoken word:', 'said', 'said', 'Common irregular word.', ['said', 'sed', 'sayed', 'siad'], 'said', '"Said" is spelled S-A-I-D!', 2),
          makeGame('tt-2-2', 2, 'SIGHT_BRIDGE', 'Tricky Word: COULD', 'Find the correct spelling of "could":', 'could', 'could', 'O-U-L-D silent L family.', ['could', 'cud', 'cood', 'culd'], 'could', 'C-O-U-L-D spells could!', 3),
          makeGame('tt-2-3', 3, 'SIGHT_BRIDGE', 'Tricky Word: WOULD', 'Pick the partner word: "would":', 'would', 'would', 'Rhymes with could.', ['would', 'wud', 'wood', 'wuld'], 'would', 'W-O-U-L-D spells would!', 3),
          makeGame('tt-2-4', 4, 'SIGHT_BRIDGE', 'Tricky Word: THEIR', 'Which word means belonging to them?', 'their', 'their', 'Possessive pronoun.', ['their', 'there', 'theyre', 'thare'], 'their', 'T-H-E-I-R shows possession!', 3),
          makeGame('tt-2-5', 5, 'WORD_BUILDER', 'Build "WHERE"', 'Spell the question word "where".', 'where', 'where', 'WH + E + R + E', ['wh', 'e', 'r', 'e'], ['wh', 'e', 'r', 'e'], 'W-H-E-R-E asks for location!', 3),
          makeGame('tt-2-6', 6, 'SIGHT_BRIDGE', 'Tricky Word: BECAUSE', 'Find the true spelling of "because":', 'because', 'because', 'Big Elephant Can Always Upset Small Elephants!', ['because', 'becuz', 'becaws', 'bekoze'], 'because', 'B-E-C-A-U-S-E is because!', 3),
          makeGame('tt-2-7', 7, 'SIGHT_BRIDGE', 'Tricky Word: DOES', 'Which stone is spelled correctly?', 'does', 'does', 'He does his reading.', ['does', 'dose', 'duz', 'dos'], 'does', 'D-O-E-S spells does!', 2),
          makeGame('tt-2-8', 8, 'WORD_BUILDER', 'Build "FRIEND"', 'Spell "friend" (a friend to the end, i before e):', 'friend', 'friend', 'FR + I + E + N + D', ['fr', 'i', 'e', 'n', 'd'], ['fr', 'i', 'e', 'n', 'd'], 'F-R-I-E-N-D spells friend!', 3),
          makeGame('tt-2-9', 9, 'SIGHT_BRIDGE', 'Tricky Word: PEOPLE', 'Identify the correct spelling of "people":', 'people', 'people', 'Notice the EO vowel pair.', ['people', 'peeple', 'poeple', 'pepel'], 'people', 'P-E-O-P-L-E spells people!', 3),
          makeGame('tt-2-10', 10, 'SIGHT_BRIDGE', 'River Crest: THROUGH', 'Cross the final stone: "through" the woods:', 'through', 'through', 'T-H-R-O-U-G-H', ['through', 'thru', 'threw', 'throu'], 'through', 'Bravo! You leaped across the Tricky River!', 3)
        ]
      },
      {
        levelNumber: 3,
        name: 'The Diphthong Den (OI/OY & OU/OW)',
        gradeTier: '2nd Grade Core',
        skillFocus: 'Diphthongs: Sound Glides (oi/oy, ou/ow)',
        description: 'Master the dancing vowels that twist together in your mouth.',
        games: [
          makeGame('tt-3-1', 1, 'RULE_DETECTIVE', 'OI vs OY Rule', 'When do we usually use OY instead of OI?', 'at the end of a word', 'toy', 'OY likes the end of a base word (boy, toy, joy)!', ['at the end of a word', 'at the beginning', 'before short vowels', 'never'], 'at the end of a word', 'OY usually comes at the end of a root word (joy, boy, coy)!', 3),
          makeGame('tt-3-2', 2, 'WORD_BUILDER', 'Build "COIN"', 'Spell "coin" with middle OI diphthong.', 'coin', 'coin', 'C + OI + N', ['c', 'oi', 'n', 'oy'], ['c', 'oi', 'n'], 'C-OI-N spells coin!', 2),
          makeGame('tt-3-3', 3, 'WORD_BUILDER', 'Build "JOY"', 'Spell "joy" with final OY.', 'joy', 'joy', 'J + OY', ['j', 'oy', 'oi', 'e'], ['j', 'oy'], 'J-OY spells joy!', 2),
          makeGame('tt-3-4', 4, 'SOUND_MATCH', 'Diphthong in "CLOUD"', 'Which letters make the /ow/ sound in "cloud"?', 'ou', 'cloud', 'OU sound.', ['ou', 'ow', 'oo', 'au'], 'ou', 'OU makes /ow/ in cloud!', 2),
          makeGame('tt-3-5', 5, 'WORD_BUILDER', 'Build "CROWN"', 'Spell the royal "crown" with OW.', 'crown', 'crown', 'CR + OW + N', ['cr', 'ow', 'n', 'ou'], ['cr', 'ow', 'n'], 'CR-OW-N spells crown!', 3),
          makeGame('tt-3-6', 6, 'RHYME_RUSH', 'Rhyme with Sound', 'Which word rhymes with "sound"?', 'ground', 'sound', '-ound family.', ['ground', 'groan', 'grain', 'grip'], 'ground', 'Sound and ground share the -ound sound!', 3),
          makeGame('tt-3-7', 7, 'WORD_BUILDER', 'Build "BOIL"', 'Boil the campfire kettle: spell "boil".', 'boil', 'boil', 'B + OI + L', ['b', 'oi', 'l', 'oy'], ['b', 'oi', 'l'], 'B-OI-L spells boil!', 2),
          makeGame('tt-3-8', 8, 'RULE_DETECTIVE', 'Two Sounds of OW', 'Which word has the /ow/ sound as in "cow" (not /oh/ as in "snow")?', 'howl', 'howl', 'Listen for the owl sound.', ['howl', 'glow', 'blow', 'slow'], 'howl', 'Howl has the /ow/ sound!', 3),
          makeGame('tt-3-9', 9, 'WORD_BUILDER', 'Build "SHOUT"', 'Spell "shout" combining SH and OU.', 'shout', 'shout', 'SH + OU + T', ['sh', 'ou', 't', 'ow'], ['sh', 'ou', 't'], 'SH-OU-T spells shout!', 3),
          makeGame('tt-3-10', 10, 'WORD_BUILDER', 'Diphthong Gem: VOYAGE', 'Spell "voyage" to set sail!', 'voyage', 'voyage', 'V + OY + A + G + E', ['v', 'oy', 'a', 'g', 'e'], ['v', 'oy', 'a', 'g', 'e'], 'Spectacular! The Diphthong Den is conquered!', 3)
        ]
      },
      {
        levelNumber: 4,
        name: 'The Compound Word Canopy',
        gradeTier: '2nd Grade Structural',
        skillFocus: 'Compound Words & Syllable Junctures',
        description: 'Climb tree platforms by combining two complete words into one new meaning.',
        games: [
          makeGame('tt-4-1', 1, 'WORD_BUILDER', 'Make "SUNFLOWER"', 'Combine two words to create a sunny blossom:', 'sunflower', 'sunflower', 'SUN + FLOWER', ['sun', 'flower', 'tree', 'shine'], ['sun', 'flower'], 'Sun + Flower = Sunflower!', 2),
          makeGame('tt-4-2', 2, 'WORD_BUILDER', 'Make "BACKPACK"', 'Combine the explorer gear: back + pack.', 'backpack', 'backpack', 'BACK + PACK', ['back', 'pack', 'bag', 'book'], ['back', 'pack'], 'Back + Pack = Backpack!', 2),
          makeGame('tt-4-3', 3, 'SOUND_MATCH', 'Compound Meaning', 'What does a "lighthouse" do?', 'shines light for ships', 'lighthouse', 'Light + house.', ['shines light for ships', 'light weight cabin', 'house of feathers', 'candle store'], 'shines light for ships', 'A lighthouse is a house that shines light to guide ships!', 2),
          makeGame('tt-4-4', 4, 'WORD_BUILDER', 'Make "RAINBOW"', 'Join rain and bow across the sky:', 'rainbow', 'rainbow', 'RAIN + BOW', ['rain', 'bow', 'sky', 'arrow'], ['rain', 'bow'], 'Rain + Bow = Rainbow!', 2),
          makeGame('tt-4-5', 5, 'SYLLABLE_SPLIT', 'Count Syllables in "Campfire"', 'How many beats are in camp - fire?', '2', 'campfire', 'Clap the parts: camp-fire.', ['1', '2', '3', '4'], '2', 'Camp-fire has 2 syllables!', 2),
          makeGame('tt-4-6', 6, 'WORD_BUILDER', 'Make "JELLYFISH"', 'Combine sea creature parts:', 'jellyfish', 'jellyfish', 'JELLY + FISH', ['jelly', 'fish', 'jam', 'water'], ['jelly', 'fish'], 'Jelly + Fish = Jellyfish!', 2),
          makeGame('tt-4-7', 7, 'RULE_DETECTIVE', 'Compound Detective', 'Which of these is a true closed compound word?', 'pancake', 'pancake', 'One single combined word.', ['pancake', 'ice cream', 'living room', 'high school'], 'pancake', 'Pancake is a single compound word!', 3),
          makeGame('tt-4-8', 8, 'WORD_BUILDER', 'Make "DRAGONFLY"', 'Combine dragon + fly:', 'dragonfly', 'dragonfly', 'DRAGON + FLY', ['dragon', 'fly', 'fire', 'bug'], ['dragon', 'fly'], 'Dragon + Fly = Dragonfly!', 3),
          makeGame('tt-4-9', 9, 'SYLLABLE_SPLIT', 'Syllable Count in "Grasshopper"', 'How many syllables in grass - hop - per?', '3', 'grasshopper', 'Grass - hop - per.', ['1', '2', '3', '4'], '3', 'Grasshopper has 3 syllables!', 3),
          makeGame('tt-4-10', 10, 'WORD_BUILDER', 'Canopy Summit: STARLIGHT', 'Join star + light to illuminate the treetops!', 'starlight', 'starlight', 'STAR + LIGHT', ['star', 'light', 'beam', 'sun'], ['star', 'light'], 'Brilliant! You mastered the Compound Canopy!', 3)
        ]
      },
      {
        levelNumber: 5,
        name: 'The Ancient Forest Guardian',
        gradeTier: '2nd Grade Capstone',
        skillFocus: 'Mastery of Tricky Words, Blends, & Complex Vowels',
        description: 'Solve the riddle of the ancient stone moss portal to unlock the path to the peaks.',
        games: [
          makeGame('tt-5-1', 1, 'WORD_BUILDER', 'Spell "KNIGHT"', 'Spell the armored explorer with silent K and GH:', 'knight', 'knight', 'KN + IGH + T', ['kn', 'igh', 't', 'n'], ['kn', 'igh', 't'], 'KN-IGH-T spells knight!', 3),
          makeGame('tt-5-2', 2, 'RULE_DETECTIVE', 'Silent K in Knee', 'Which word starts with a silent K?', 'knee', 'knee', 'K before N is quiet.', ['knee', 'kite', 'king', 'koala'], 'knee', 'Knee starts with silent K!', 3),
          makeGame('tt-5-3', 3, 'WORD_BUILDER', 'Spell "LIGHT"', 'Spell "light" with high vowel team IGH.', 'light', 'light', 'L + IGH + T', ['l', 'igh', 't', 'ite'], ['l', 'igh', 't'], 'L-IGH-T spells light!', 3),
          makeGame('tt-5-4', 4, 'SIGHT_BRIDGE', 'Tricky Word: THOUGHT', 'Choose the spelling of "thought":', 'thought', 'thought', 'T-H-O-U-G-H-T', ['thought', 'thot', 'thawt', 'thoght'], 'thought', 'T-H-O-U-G-H-T spells thought!', 3),
          makeGame('tt-5-5', 5, 'RHYME_RUSH', 'Rhyme with Bright', 'Which word rhymes with "bright"?', 'flight', 'bright', '-ight phonogram.', ['flight', 'blight', 'front', 'frost'], 'flight', 'Bright and flight both end in -ight!', 3),
          makeGame('tt-5-6', 6, 'WORD_BUILDER', 'Spell "CLIMB"', 'Spell "climb" with its silent B!', 'climb', 'climb', 'CL + I + M + B', ['cl', 'i', 'm', 'b'], ['cl', 'i', 'm', 'b'], 'C-L-I-M-B has a silent B!', 3),
          makeGame('tt-5-7', 7, 'RULE_DETECTIVE', 'Silent W in Write', 'Which word means to put words on paper with a pencil?', 'write', 'write', 'Begins with silent W.', ['write', 'right', 'rite', 'rite'], 'write', 'W-R-I-T-E is to write words!', 3),
          makeGame('tt-5-8', 8, 'WORD_BUILDER', 'Spell "BRIDGE"', 'Spell "bridge" with DGE after short I.', 'bridge', 'bridge', 'BR + I + DGE', ['br', 'i', 'dge', 'g'], ['br', 'i', 'dge'], 'B-R-I-D-G-E spells bridge!', 3),
          makeGame('tt-5-9', 9, 'SIGHT_BRIDGE', 'Tricky Word: ENOUGH', 'Find the correct spelling of "enough":', 'enough', 'enough', 'GH makes /f/ here!', ['enough', 'enuf', 'enuff', 'anuff'], 'enough', 'E-N-O-U-G-H is enough!', 3),
          makeGame('tt-5-10', 10, 'WORD_BUILDER', 'Passage Key: EXPLORER', 'Spell "explorer" to step through the ancient gate!', 'explorer', 'explorer', 'EX + PLOR + ER', ['ex', 'plor', 'er', 'or'], ['ex', 'plor', 'er'], 'HEROIC! You have unlocked Whispering Peaks!', 4)
        ]
      }
    ]
  },

  // LAND 4: WHISPERING PEAKS (Late Elementary / 3rd-5th Grade)
  {
    id: 'whispering-peaks',
    name: 'Whispering Peaks',
    gradeLevel: 'Late Elementary (Grades 3-5)',
    themeColor: '#6366f1',
    accentColor: '#818cf8',
    lore: 'Glacial alpine heights where soaring golden eagles echo vowel teams, Bossy R storms, and multisyllabic decoding.',
    levels: [
      {
        levelNumber: 1,
        name: 'The Vowel Team Glaciers',
        gradeTier: '3rd Grade Core',
        skillFocus: 'Vowel Teams: EA, EE, AI, AY, OA, OE',
        description: 'When two vowels go walking, the first one does the talking and says its name!',
        games: [
          makeGame('wp-1-1', 1, 'RULE_DETECTIVE', 'The Vowel Team Walk', 'Which vowel team spells the long E in "gleam"?', 'ea', 'gleam', 'EA team.', ['ea', 'ee', 'ei', 'ey'], 'ea', 'G-L-E-A-M spells gleam with EA!', 3),
          makeGame('wp-1-2', 2, 'WORD_BUILDER', 'Build "SAIL"', 'Sail the icy waters: AI in the middle of a word.', 'sail', 'sail', 'S + AI + L', ['s', 'ai', 'l', 'ay'], ['s', 'ai', 'l'], 'S-AI-L spells sail!', 3),
          makeGame('wp-1-3', 3, 'RULE_DETECTIVE', 'AI vs AY', 'Why does "spray" end in AY instead of AI?', 'AY is at the end of root words', 'spray', 'AI is middle, AY is end.', ['AY is at the end of root words', 'AI cannot make long A', 'S requires Y', 'Magic E rule'], 'AY is at the end of root words', 'English words rarely end in I, so we use AY at the end!', 3),
          makeGame('wp-1-4', 4, 'WORD_BUILDER', 'Build "BOAT"', 'Spell "boat" with the OA vowel team.', 'boat', 'boat', 'B + OA + T', ['b', 'oa', 't', 'ow'], ['b', 'oa', 't'], 'B-OA-T spells boat!', 3),
          makeGame('wp-1-5', 5, 'SOUND_MATCH', 'Three Sounds of EA', 'Which word has the short /e/ sound of EA like "bread"?', 'feather', 'feather', 'EA can say /ee/, /e/, or /ay/.', ['feather', 'clean', 'steak', 'beach'], 'feather', 'Feather uses EA for short /eh/!', 3),
          makeGame('wp-1-6', 6, 'WORD_BUILDER', 'Build "FREEZE"', 'Spell "freeze" with EE and final silent E.', 'freeze', 'freeze', 'FR + EE + Z + E', ['fr', 'ee', 'z', 'e'], ['fr', 'ee', 'z', 'e'], 'F-R-E-E-Z-E spells freeze!', 3),
          makeGame('wp-1-7', 7, 'RHYME_RUSH', 'Rhyme with Peak', 'Which word rhymes with alpine "peak"?', 'shriek', 'peak', '-eak vowel team rhyme.', ['shriek', 'pine', 'pack', 'poke'], 'shriek', 'Peak and shriek rhyme in -eak!', 3),
          makeGame('wp-1-8', 8, 'WORD_BUILDER', 'Build "COACH"', 'Spell "coach" with OA and CH.', 'coach', 'coach', 'C + OA + CH', ['c', 'oa', 'ch', 'tch'], ['c', 'oa', 'ch'], 'C-OA-CH spells coach!', 3),
          makeGame('wp-1-9', 9, 'RULE_DETECTIVE', 'Long O Teams: OA vs OE', 'Which foot accessory ends in OE?', 'toe', 'toe', 'OE at the end.', ['toe', 'toa', 'tow', 'towe'], 'toe', 'Toe is spelled T-O-E!', 3),
          makeGame('wp-1-10', 10, 'WORD_BUILDER', 'Summit Beacon: GLACIER', 'Spell "glacier" to scale the ice face!', 'glacier', 'glacier', 'GLA + CI + ER', ['gla', 'ci', 'er', 'or'], ['gla', 'ci', 'er'], 'Masterful! Vowel Team Glaciers charted!', 3)
        ]
      },
      {
        levelNumber: 2,
        name: 'The Bossy R Gorge',
        gradeTier: '3rd Grade R-Controlled',
        skillFocus: 'R-Controlled Vowels (AR, OR, ER, IR, UR)',
        description: 'When R follows a vowel, it bosses the vowel to make a brand new sound.',
        games: [
          makeGame('wp-2-1', 1, 'SOUND_MATCH', 'Bossy AR Sound', 'Which word has the /ar/ sound of a pirate or star?', 'spark', 'spark', 'AR sound.', ['spark', 'spoke', 'speak', 'speck'], 'spark', 'Spark has the /ar/ sound!', 3),
          makeGame('wp-2-2', 2, 'WORD_BUILDER', 'Build "STORM"', 'Spell "storm" with the OR sound.', 'storm', 'storm', 'ST + OR + M', ['st', 'or', 'm', 'ar'], ['st', 'or', 'm'], 'ST-OR-M spells storm!', 3),
          makeGame('wp-2-3', 3, 'RULE_DETECTIVE', 'Her, Bird, and Fur', 'What sound do ER, IR, and UR all share?', '/er/ sound', 'bird', 'The three sisters of sound all say /er/!', ['/er/ sound', '/ar/ sound', '/or/ sound', 'long E sound'], '/er/ sound', 'ER, IR, and UR all make the same /er/ sound!', 3),
          makeGame('wp-2-4', 4, 'WORD_BUILDER', 'Build "BIRD"', 'Spell the feathered friend with IR.', 'bird', 'bird', 'B + IR + D', ['b', 'ir', 'd', 'er'], ['b', 'ir', 'd'], 'B-IR-D spells bird!', 3),
          makeGame('wp-2-5', 5, 'WORD_BUILDER', 'Build "TURTLE"', 'Spell "turtle" with UR and Cle.', 'turtle', 'turtle', 'T + UR + T + LE', ['t', 'ur', 't', 'le'], ['t', 'ur', 't', 'le'], 'T-U-R-T-L-E spells turtle!', 3),
          makeGame('wp-2-6', 6, 'RHYME_RUSH', 'Rhyme with North', 'Which word rhymes with the cardinal direction "north"?', 'fourth', 'north', '-orth ending.', ['fourth', 'nerve', 'nurse', 'notch'], 'fourth', 'North and fourth rhyme in -orth!', 3),
          makeGame('wp-2-7', 7, 'WORD_BUILDER', 'Build "HARBOR"', 'Spell "harbor" with two R-controlled vowels.', 'harbor', 'harbor', 'H + AR + B + OR', ['h', 'ar', 'b', 'or'], ['h', 'ar', 'b', 'or'], 'H-AR-B-OR has both AR and OR!', 3),
          makeGame('wp-2-8', 8, 'RULE_DETECTIVE', 'W + AR makes /wor/', 'What sound does WAR make in "warm" and "warn"?', '/wor/', 'warm', 'W changes the AR sound to /or/!', ['/wor/', '/war/', '/wer/', '/wir/'], '/wor/', 'After W, AR makes the /or/ sound as in warm and warn!', 4),
          makeGame('wp-2-9', 9, 'WORD_BUILDER', 'Build "WHIRL"', 'Whirlwind on the peak: spell "whirl".', 'whirl', 'whirl', 'WH + IR + L', ['wh', 'ir', 'l', 'er'], ['wh', 'ir', 'l'], 'WH-IR-L spells whirl!', 3),
          makeGame('wp-2-10', 10, 'WORD_BUILDER', 'Gorge Master: FORTRESS', 'Spell "fortress" guarding the alpine pass!', 'fortress', 'fortress', 'FOR + TRESS', ['for', 'tress', 'ter', 'ful'], ['for', 'tress'], 'Epic! Bossy R Gorge conquered!', 4)
        ]
      },
      {
        levelNumber: 3,
        name: 'The Affix Alpine Bridges',
        gradeTier: '4th Grade Structural',
        skillFocus: 'Prefixes (un-, re-, dis-, mis-) & Suffixes (-ful, -less, -able, -tion)',
        description: 'Attach prefixes and suffixes to base words to craft complex meaning.',
        games: [
          makeGame('wp-3-1', 1, 'ROOT_LAB', 'Prefix UN-', 'Add the prefix meaning "not" to "lock":', 'unlock', 'unlock', 'UN + LOCK', ['un', 'lock', 're', 'dis'], ['un', 'lock'], 'Un- + lock = unlock (to open)!', 3),
          makeGame('wp-3-2', 2, 'ROOT_LAB', 'Prefix RE-', 'Add the prefix meaning "again" to "build":', 'rebuild', 'rebuild', 'RE + BUILD', ['re', 'build', 'pre', 'mis'], ['re', 'build'], 'Re- + build = rebuild (to build again)!', 3),
          makeGame('wp-3-3', 3, 'RULE_DETECTIVE', 'Suffix -TION Sound', 'What sound does the suffix -tion make in "action"?', '/shun/', 'action', '-tion sounds like shun.', ['/shun/', '/tee-on/', '/zhun/', '/chun/'], '/shun/', '-tion makes the /shun/ sound!', 3),
          makeGame('wp-3-4', 4, 'ROOT_LAB', 'Suffix -LESS', 'Add the suffix meaning "without" to "fear":', 'fearless', 'fearless', 'FEAR + LESS', ['fear', 'less', 'ful', 'ment'], ['fear', 'less'], 'Fear + less = fearless (without fear)!', 3),
          makeGame('wp-3-5', 5, 'ROOT_LAB', 'Suffix -FUL', 'Add the suffix meaning "full of" to "hope":', 'hopeful', 'hopeful', 'HOPE + FUL', ['hope', 'ful', 'ly', 'ness'], ['hope', 'ful'], 'Hope + ful = hopeful (full of hope)!', 3),
          makeGame('wp-3-6', 6, 'RULE_DETECTIVE', 'Dropping E before Vowel Suffix', 'What happens to the silent E in "hope" when adding "-ing"?', 'drop the E', 'hoping', 'Drop the E before a vowel suffix!', ['drop the E', 'keep the E', 'change to Y', 'double the P'], 'drop the E', 'Drop the silent E before a vowel suffix: hop(e) + ing = hoping!', 3),
          makeGame('wp-3-7', 7, 'ROOT_LAB', 'Prefix DIS-', 'Combine DIS- (opposite) + AGREE:', 'disagree', 'disagree', 'DIS + AGREE', ['dis', 'agree', 'un', 'mis'], ['dis', 'agree'], 'Dis- + agree = disagree!', 3),
          makeGame('wp-3-8', 8, 'ROOT_LAB', 'Word Chemistry: PREVIEW', 'Build PRE- (before) + VIEW:', 'preview', 'preview', 'PRE + VIEW', ['pre', 'view', 'post', 'sub'], ['pre', 'view'], 'Pre- + view = preview (to see beforehand)!', 3),
          makeGame('wp-3-9', 9, 'RULE_DETECTIVE', 'Changing Y to I', 'What happens when adding "-ful" to "beauty"?', 'change Y to I', 'beautiful', 'Consonant + Y changes to I before a suffix!', ['change Y to I', 'drop the Y', 'keep the Y', 'double the T'], 'change Y to I', 'Change Y to I: beaut(y) + i + ful = beautiful!', 4),
          makeGame('wp-3-10', 10, 'ROOT_LAB', 'Bridge Master: UNBREAKABLE', 'Combine UN + BREAK + ABLE:', 'unbreakable', 'unbreakable', 'UN + BREAK + ABLE', ['un', 'break', 'able', 'ful'], ['un', 'break', 'able'], 'Magnificent! You mastered the Affix Bridges!', 4)
        ]
      },
      {
        levelNumber: 4,
        name: 'The Syllable Division Ridge',
        gradeTier: '4th-5th Grade Decoding',
        skillFocus: 'Syllable Division Patterns: VCCV (rabbit), VCV (tiger/camel), -Cle',
        description: 'Chop longer mountain words into easily digestible phonetic syllables.',
        games: [
          makeGame('wp-4-1', 1, 'SYLLABLE_SPLIT', 'Divide "RABBIT" (VCCV)', 'Where do you split consonants in rab - bit?', 'rab - bit', 'rabbit', 'Split between the two consonants (VCCV)!', ['rab - bit', 'ra - bbit', 'rabb - it', 'r - abbit'], 'rab - bit', 'VCCV rule: split between the double consonants: rab-bit!', 3),
          makeGame('wp-4-2', 2, 'SYLLABLE_SPLIT', 'Divide "TIGER" (Open VCV)', 'In ti-ger, does the first syllable stay open?', 'ti - ger', 'tiger', 'Open syllable: vowel says its name.', ['ti - ger', 'tig - er', 't - iger', 'tige - r'], 'ti - ger', 'VCV rule: ti-ger has an open first syllable with long I!', 3),
          makeGame('wp-4-3', 3, 'RULE_DETECTIVE', 'Open vs Closed Syllables', 'Why is the syllable "ti-" in tiger long, but "cab-" in cabin short?', 'ti ends in a vowel, cab ends in a consonant', 'tiger', 'Closed syllables have a short vowel.', ['ti ends in a vowel, cab ends in a consonant', 'T is capitalized', 'R changes the sound', 'Magic E rule'], 'ti ends in a vowel, cab ends in a consonant', 'Closed syllables end in a consonant making the vowel short!', 4),
          makeGame('wp-4-4', 4, 'SYLLABLE_SPLIT', 'Divide "CANDLE" (-Cle)', 'Consonant + LE grabs one consonant neighbor:', 'can - dle', 'candle', 'Count back three: [d-l-e].', ['can - dle', 'cand - le', 'ca - ndle', 'candle'], 'can - dle', 'Consonant-le rule: count back 3 letters (-dle) and split: can-dle!', 3),
          makeGame('wp-4-5', 5, 'SYLLABLE_SPLIT', 'Divide "BASKET" (VCCV)', 'Where does bas-ket split?', 'bas - ket', 'basket', 'Split between S and K.', ['bas - ket', 'ba - sket', 'bask - et', 'b - asket'], 'bas - ket', 'VCCV: bas-ket splits right between the consonants!', 3),
          makeGame('wp-4-6', 6, 'SYLLABLE_SPLIT', 'Divide "REPTILE"', 'Split rep-tile into its parts:', 'rep - tile', 'reptile', 'Closed rep + CVCe tile.', ['rep - tile', 're - ptile', 'rept - ile', 'reptil - e'], 'rep - tile', 'Rep + tile = reptile!', 3),
          makeGame('wp-4-7', 7, 'SYLLABLE_SPLIT', 'Divide "PUMPKIN"', 'Divide the autumn fruit:', 'pump - kin', 'pumpkin', 'Pump + kin.', ['pump - kin', 'pum - pkin', 'p - umpkin', 'pumpk - in'], 'pump - kin', 'Pump-kin splits between P and K!', 3),
          makeGame('wp-4-8', 8, 'SYLLABLE_SPLIT', 'Divide "VOLCANO" (3 Syllables)', 'Chop the molten peak into 3 syllables:', 'vol - ca - no', 'volcano', 'Vol - ca - no.', ['vol - ca - no', 'vo - lca - no', 'volc - an - o', 'vol - cano'], 'vol - ca - no', 'Vol-ca-no has 3 syllables!', 4),
          makeGame('wp-4-9', 9, 'SYLLABLE_SPLIT', 'Divide "MAGNETIC"', 'Split the magnetic field:', 'mag - net - ic', 'magnetic', '3 closed syllables.', ['mag - net - ic', 'ma - gne - tic', 'magn - etic', 'magn - et - ic'], 'mag - net - ic', 'Mag-net-ic splits neatly into 3 closed syllables!', 4),
          makeGame('wp-4-10', 10, 'SYLLABLE_SPLIT', 'Ridge Capstone: EXPEDITION', 'Decode ex - pe - di - tion (4 syllables)!', 'ex - pe - di - tion', 'expedition', 'Ex-pe-di-tion.', ['ex - pe - di - tion', 'expe - di - tion', 'ex - pedition', 'exp - edit - ion'], 'ex - pe - di - tion', 'Triumphant! You are a master of syllable division!', 4)
        ]
      },
      {
        levelNumber: 5,
        name: 'The Eagle Monastery Summit',
        gradeTier: '5th Grade Capstone',
        skillFocus: 'Homophones, Homographs, Silent Letters & Advanced Decoding',
        description: 'Prove your phonics mastery to the High Abbot Eagle of Whispering Peaks.',
        games: [
          makeGame('wp-5-1', 1, 'RULE_DETECTIVE', 'Homophone: Knight vs Night', 'Which word means darkness after sunset?', 'night', 'night', 'No silent K.', ['night', 'knight', 'nite', 'nyte'], 'night', 'Night with N is after dark; Knight with K wears armor!', 3),
          makeGame('wp-5-2', 2, 'WORD_BUILDER', 'Spell "COLUMN"', 'Spell "column" with its silent final N!', 'column', 'column', 'COL + U + MN', ['col', 'u', 'mn', 'm'], ['col', 'u', 'mn'], 'C-O-L-U-M-N has a silent N!', 4),
          makeGame('wp-5-3', 3, 'RULE_DETECTIVE', 'Homophone: Principal vs Principle', 'Which word refers to your school head ("your pal")?', 'principal', 'principal', 'The principal is your pal!', ['principal', 'principle', 'prinsepal', 'prencipal'], 'principal', 'Principal ends in -pal!', 4),
          makeGame('wp-5-4', 4, 'WORD_BUILDER', 'Spell "RHYTHM"', 'Spell the musical word with no standard vowels (only Y)!', 'rhythm', 'rhythm', 'RH + Y + TH + M', ['rh', 'y', 'th', 'm'], ['rh', 'y', 'th', 'm'], 'R-H-Y-T-H-M has silent H and vowel Y!', 4),
          makeGame('wp-5-5', 5, 'RULE_DETECTIVE', 'Silent G in Gnat and Sign', 'Why do words like "sign" and "gnat" have a G?', 'historical etymology', 'sign', 'From Latin signum where G was pronounced!', ['historical etymology', 'makes vowel short', 'bossy R rule', 'random typo'], 'historical etymology', 'Etymology! In Latin "signum", the G was pronounced!', 4),
          makeGame('wp-5-6', 6, 'WORD_BUILDER', 'Spell "ISLAND"', 'Spell "island" with its silent S!', 'island', 'island', 'IS + L + AND', ['is', 'l', 'and', 'y'], ['is', 'l', 'and'], 'I-S-L-A-N-D has a silent S!', 3),
          makeGame('wp-5-7', 7, 'RULE_DETECTIVE', 'Homographs: Wind vs Wind', 'How do you tell "the cold wind blew" from "wind the clock"?', 'context clues in the sentence', 'wind', 'Spelled the same, pronounced differently based on context.', ['context clues in the sentence', 'look for an accent mark', 'capital letters', 'silent E'], 'context clues in the sentence', 'Homographs require sentence context clues!', 4),
          makeGame('wp-5-8', 8, 'WORD_BUILDER', 'Spell "AUTUMN"', 'Spell the golden season with silent N:', 'autumn', 'autumn', 'AU + T + U + MN', ['au', 't', 'u', 'mn'], ['au', 't', 'u', 'mn'], 'A-U-T-U-M-N has silent N!', 4),
          makeGame('wp-5-9', 9, 'RULE_DETECTIVE', 'Homophone: Weather vs Whether', 'Which spelling refers to rain, snow, and sunlight?', 'weather', 'weather', 'Climatic conditions.', ['weather', 'whether', 'wether', 'wether'], 'weather', 'W-E-A-T-H-E-R is the weather outside!', 4),
          makeGame('wp-5-10', 10, 'WORD_BUILDER', 'Monastery Key: ASCEND', 'Spell "ascend" with SC digraph to enter the Empire!', 'ascend', 'ascend', 'A + SC + END', ['a', 'sc', 'end', 'sk'], ['a', 'sc', 'end'], 'THE EAGLE BOWS! You have unlocked Lexicon Empire!', 4)
        ]
      }
    ]
  },

  // LAND 5: LEXICON EMPIRE (Advanced Middle School through Beginner High School)
  {
    id: 'lexicon-empire',
    name: 'Lexicon Empire',
    gradeLevel: 'Advanced Middle School (Grades 6-9+)',
    themeColor: '#d97706',
    accentColor: '#f59e0b',
    lore: 'A breathtaking acropolis of marble statues, grand colosseums, and golden libraries where Greek and Latin roots and complex orthography reign.',
    levels: [
      {
        levelNumber: 1,
        name: 'The Senate of Orthographic Law',
        gradeTier: '6th Grade Advanced',
        skillFocus: 'I Before E Except After C (and its Weird Exceptions)',
        description: 'Master the classic rule: "I before E, except after C, or when sounding like A as in neighbor and weigh!"',
        games: [
          makeGame('le-1-1', 1, 'RULE_DETECTIVE', 'After C: Receive', 'Which spelling obeys "except after C"?', 'receive', 'receive', 'After C, use EI!', ['receive', 'recieve', 'receve', 'receiv'], 'receive', 'After C, use EI: r-e-c-e-i-v-e!', 4),
          makeGame('le-1-2', 2, 'RULE_DETECTIVE', 'Standard: Believe', 'Which spelling obeys "I before E"?', 'believe', 'believe', 'No C before it: IE!', ['believe', 'beleive', 'believ', 'beleave'], 'believe', 'I before E: b-e-l-i-e-v-e!', 4),
          makeGame('le-1-3', 3, 'RULE_DETECTIVE', 'After C: Ceiling', 'Spell the top of the marble chamber:', 'ceiling', 'ceiling', 'Follows the C rule.', ['ceiling', 'cieling', 'ceeling', 'cealing'], 'ceiling', 'C-E-I-L-I-N-G follows "except after C"!', 4),
          makeGame('le-1-4', 4, 'RULE_DETECTIVE', 'Sounding like A: Neighbor', 'Which word uses EI because it sounds like /ay/?', 'neighbor', 'neighbor', 'Sounds like long A.', ['neighbor', 'nieghbor', 'naybor', 'neibor'], 'neighbor', '"Or when sounding like A as in neighbor and weigh"!', 4),
          makeGame('le-1-5', 5, 'WORD_BUILDER', 'Spell "WEIGH"', 'Spell "weigh" with EI and silent GH.', 'weigh', 'weigh', 'W + EI + GH', ['w', 'ei', 'gh', 'ie'], ['w', 'ei', 'gh'], 'W-E-I-G-H sounds like /ay/!', 4),
          makeGame('le-1-6', 6, 'RULE_DETECTIVE', 'The Famous Exception: Weird', 'Which word is famously "weird" and breaks the rule?', 'weird', 'weird', 'WEIRD breaks the rule with EI!', ['weird', 'wierd', 'weerd', 'ward'], 'weird', 'Weird is weird because it breaks the rule!', 4),
          makeGame('le-1-7', 7, 'RULE_DETECTIVE', 'Another Exception: Seize', 'Which spelling is correct for "to seize control"?', 'seize', 'seize', 'Another famous exception: SEIZE.', ['seize', 'sieze', 'seeze', 'seaze'], 'seize', 'S-E-I-Z-E is an exception!', 4),
          makeGame('le-1-8', 8, 'WORD_BUILDER', 'Spell "DECEIVE"', 'Spell "deceive" with EI after C:', 'deceive', 'deceive', 'D + E + C + EI + VE', ['d', 'e', 'c', 'ei', 've'], ['d', 'e', 'c', 'ei', 've'], 'D-E-C-E-I-V-E follows "except after C"!', 4),
          makeGame('le-1-9', 9, 'RULE_DETECTIVE', 'Exception: Ancient', 'Why is "ancient" spelled with IE even after C?', 'it makes a /sh/ sound, not /ee/', 'ancient', 'Rule only applies when sound is long /ee/!', ['it makes a /sh/ sound, not /ee/', 'Greek root exception', 'silent letter', 'compound word'], 'it makes a /sh/ sound, not /ee/', 'The rule only applies when the sound is /ee/! In ancient, CI makes /sh/!', 5),
          makeGame('le-1-10', 10, 'WORD_BUILDER', 'Senate Decree: SOVEREIGN', 'Spell "sovereign" with its royal EIGN ending!', 'sovereign', 'sovereign', 'SOV + ER + EIGN', ['sov', 'er', 'eign', 'ien'], ['sov', 'er', 'eign'], 'Supreme mastery! The Senate applauds!', 5)
        ]
      },
      {
        levelNumber: 2,
        name: 'The Colosseum of Greek Roots',
        gradeTier: '7th Grade Etymology',
        skillFocus: 'Greek Roots (PHON, TELE, BIO, CHRON, GEO, GRAPH, SCOPE)',
        description: 'Combine ancient Greek roots to decode the architecture of scientific language.',
        games: [
          makeGame('le-2-1', 1, 'ROOT_LAB', 'Root: PHON (Sound)', 'What does the Greek root "PHON" mean?', 'sound or voice', 'phon', 'Telephone, symphony, phonics.', ['sound or voice', 'light', 'earth', 'time'], 'sound or voice', 'PHON means sound or voice (like in PHONICS)!', 4),
          makeGame('le-2-2', 2, 'ROOT_LAB', 'Build "TELEPHONE"', 'Combine TELE (distant) + PHON (sound):', 'telephone', 'telephone', 'TELE + PHON + E', ['tele', 'phon', 'e', 'bio'], ['tele', 'phon', 'e'], 'Tele (far) + phone (sound) = telephone!', 4),
          makeGame('le-2-3', 3, 'ROOT_LAB', 'Root: BIO (Life)', 'What does BIO + GRAPH + Y mean?', 'written story of a life', 'biography', 'Bio = life, Graph = write.', ['written story of a life', 'drawing of earth', 'study of plants', 'sound recording'], 'written story of a life', 'Bio (life) + Graph (write) = biography!', 4),
          makeGame('le-2-4', 4, 'WORD_BUILDER', 'Build "CHRONOMETER"', 'Combine CHRON (time) + METER (measure):', 'chronometer', 'chronometer', 'CHRONO + METER', ['chrono', 'meter', 'graph', 'tele'], ['chrono', 'meter'], 'Chronometer = precise instrument measuring time!', 4),
          makeGame('le-2-5', 5, 'ROOT_LAB', 'Root: GEO (Earth)', 'What is the study of the Earths rocks and crust?', 'geology', 'geology', 'Geo (earth) + logy (study of).', ['geology', 'geometry', 'geography', 'geocentric'], 'geology', 'Geo (earth) + logy (study of) = geology!', 4),
          makeGame('le-2-6', 6, 'WORD_BUILDER', 'Build "MICROSCOPE"', 'Combine MICRO (small) + SCOPE (view):', 'microscope', 'microscope', 'MICRO + SCOPE', ['micro', 'scope', 'tele', 'graph'], ['micro', 'scope'], 'Micro (small) + scope (see) = microscope!', 4),
          makeGame('le-2-7', 7, 'ROOT_LAB', 'Root: ASTR / ASTER (Star)', 'What is a space explorer called?', 'astronaut', 'astronaut', 'Astr (star) + naut (sailor).', ['astronaut', 'astronomer', 'astroid', 'astrology'], 'astronaut', 'Astronaut literally means "star sailor"!', 4),
          makeGame('le-2-8', 8, 'WORD_BUILDER', 'Build "SYMPHONY"', 'Combine SYM (together) + PHON (sound):', 'symphony', 'symphony', 'SYM + PHON + Y', ['sym', 'phon', 'y', 'ic'], ['sym', 'phon', 'y'], 'Sym (together) + phon (sound) = symphony!', 5),
          makeGame('le-2-9', 9, 'ROOT_LAB', 'Root: AUTO (Self)', 'Build AUTO + GRAPH (self-written signature):', 'autograph', 'autograph', 'AUTO + GRAPH', ['auto', 'graph', 'bio', 'tele'], ['auto', 'graph'], 'Auto (self) + graph (write) = autograph!', 4),
          makeGame('le-2-10', 10, 'ROOT_LAB', 'Gladiator Crown: POLYPHONIC', 'Combine POLY (many) + PHON (voices/sounds) + IC:', 'polyphonic', 'polyphonic', 'POLY + PHON + IC', ['poly', 'phon', 'ic', 'ous'], ['poly', 'phon', 'ic'], 'Triumphant in the Colosseum! Greek Roots Mastered!', 5)
        ]
      },
      {
        levelNumber: 3,
        name: 'The Latin Stems Vault',
        gradeTier: '8th Grade Morphology',
        skillFocus: 'Latin Roots (DICT, SCRIB/SCRIPT, PORT, STRUCT, VIS/VID, TRACT)',
        description: 'Unlock imperial vaults by translating Latin stems into powerful English words.',
        games: [
          makeGame('le-3-1', 1, 'ROOT_LAB', 'Stem: DICT (To Speak)', 'What does the Latin root DICT mean?', 'to speak or say', 'dict', 'Dictate, predict, verdict.', ['to speak or say', 'to write', 'to carry', 'to build'], 'to speak or say', 'DICT means to speak! (Predict = say beforehand)!', 4),
          makeGame('le-3-2', 2, 'ROOT_LAB', 'Stem: PORT (To Carry)', 'Combine TRANS (across) + PORT (carry):', 'transport', 'transport', 'TRANS + PORT', ['trans', 'port', 'ex', 'im'], ['trans', 'port'], 'Trans (across) + port (carry) = transport!', 4),
          makeGame('le-3-3', 3, 'WORD_BUILDER', 'Build "CONSTRUCTION"', 'Combine CON + STRUCT (build) + ION:', 'construction', 'construction', 'CON + STRUCT + ION', ['con', 'struct', 'ion', 'or'], ['con', 'struct', 'ion'], 'Con + struct + ion = construction!', 4),
          makeGame('le-3-4', 4, 'ROOT_LAB', 'Stem: SCRIB / SCRIPT (To Write)', 'What is a doctor’s written medicine order called?', 'prescription', 'prescription', 'Pre (before) + script (written).', ['prescription', 'description', 'inscription', 'subscription'], 'prescription', 'Pre- (before) + script (written) = prescription!', 4),
          makeGame('le-3-5', 5, 'ROOT_LAB', 'Stem: VIS / VID (To See)', 'What does IN- + VIS + -IBLE mean?', 'cannot be seen', 'invisible', 'In (not) + vis (see) + ible (able).', ['cannot be seen', 'easily seen', 'able to speak', 'able to carry'], 'cannot be seen', 'In (not) + vis (see) + ible = cannot be seen!', 4),
          makeGame('le-3-6', 6, 'WORD_BUILDER', 'Build "BENEDICTION"', 'Combine BENE (good) + DICT (speech) + ION:', 'benediction', 'benediction', 'BENE + DICT + ION', ['bene', 'dict', 'ion', 'or'], ['bene', 'dict', 'ion'], 'Bene (good) + dict (speech) = a blessing!', 5),
          makeGame('le-3-7', 7, 'ROOT_LAB', 'Stem: TRACT (To Pull or Drag)', 'What vehicle pulls heavy farm equipment?', 'tractor', 'tractor', 'Tract (pull) + or (one who).', ['tractor', 'trainer', 'tracker', 'trailer'], 'tractor', 'Tract (pull) + or = tractor!', 4),
          makeGame('le-3-8', 8, 'WORD_BUILDER', 'Build "CONTRADICTION"', 'Combine CONTRA (against) + DICT + ION:', 'contradiction', 'contradiction', 'CONTRA + DICT + ION', ['contra', 'dict', 'ion', 'ive'], ['contra', 'dict', 'ion'], 'Contra (against) + dict (say) = contradiction!', 5),
          makeGame('le-3-9', 9, 'ROOT_LAB', 'Stem: JECT (To Throw)', 'What do you do when you throw out an idea or offer?', 'reject', 'reject', 'Re (back) + ject (throw).', ['reject', 'inject', 'project', 'object'], 'reject', 'Re- (back) + ject (throw) = reject!', 4),
          makeGame('le-3-10', 10, 'ROOT_LAB', 'Vault Keystone: INSCRIBE', 'Carve IN + SCRIBE (write into stone):', 'inscribe', 'inscribe', 'IN + SCRIBE', ['in', 'scribe', 'de', 'sub'], ['in', 'scribe'], 'Magnificent! The Latin Vault swings wide open!', 5)
        ]
      },
      {
        levelNumber: 4,
        name: 'The Amphitheater of Morphology',
        gradeTier: '8th-9th Grade Advanced',
        skillFocus: 'Assimilation of Prefixes (IN -> IM/IL/IR), Double Consonants, & Etymology',
        description: 'Discover how chameleon prefixes shift their spelling to match consonant neighbors.',
        games: [
          makeGame('le-4-1', 1, 'RULE_DETECTIVE', 'Chameleon Prefix: IN- before P', 'Why is "impossible" spelled with IM- instead of IN-?', 'N changes to M before P, B, and M for mouth ease', 'impossible', 'Try saying "in-possible" quickly!', ['N changes to M before P, B, and M for mouth ease', 'it is Greek', 'vowel team rule', 'random English quirk'], 'N changes to M before P, B, and M for mouth ease', 'Assimilation! Your lips close for P and B, making M much easier to pronounce!', 5),
          makeGame('le-4-2', 2, 'WORD_BUILDER', 'Build "IRRESPONSIBLE"', 'Combine IR- (not) + RESPONSIBLE:', 'irresponsible', 'irresponsible', 'IR + RESPONSIBLE', ['ir', 'responsible', 'in', 'im'], ['ir', 'responsible'], 'In- assimilates to Ir- before R: irresponsible!', 5),
          makeGame('le-4-3', 3, 'RULE_DETECTIVE', 'Chameleon Prefix: IN- before L', 'Which spelling means "not legal"?', 'illegal', 'illegal', 'In- becomes Il- before L.', ['illegal', 'inlegal', 'imlegal', 'irlegal'], 'illegal', 'In- assimilates to Il- before L: illegal!', 4),
          makeGame('le-4-4', 4, 'WORD_BUILDER', 'Build "SYMMETRY"', 'SYN- assimilates to SYM- before M:', 'symmetry', 'symmetry', 'SYM + METRY', ['sym', 'metry', 'syn', 'sim'], ['sym', 'metry'], 'Syn- + metry becomes symmetry!', 5),
          makeGame('le-4-5', 5, 'RULE_DETECTIVE', 'Double Consonant in Accompany', 'Why does "accompany" have a double C?', 'AD- assimilated to AC- before C', 'accompany', 'Ad- + company became ac-company.', ['AD- assimilated to AC- before C', 'floss rule', 'short vowel rule', 'magic E'], 'AD- assimilated to AC- before C', 'The Latin prefix AD- assimilated into AC- before company!', 5),
          makeGame('le-4-6', 6, 'WORD_BUILDER', 'Build "SUBTERRANEAN"', 'SUB (under) + TERRA (earth) + NEAN:', 'subterranean', 'subterranean', 'SUB + TERRA + NEAN', ['sub', 'terra', 'nean', 'ous'], ['sub', 'terra', 'nean'], 'Sub (under) + terra (earth) = subterranean!', 5),
          makeGame('le-4-7', 7, 'RULE_DETECTIVE', 'Suffix -ABLE vs -IBLE', 'Which word correctly uses the Latin -IBLE suffix?', 'edible', 'edible', 'From Latin edere (to eat).', ['edible', 'edable', 'visable', 'audable'], 'edible', 'Edible uses -ible from Latin root!', 5),
          makeGame('le-4-8', 8, 'WORD_BUILDER', 'Build "ANACHRONISM"', 'ANA (against/back) + CHRON (time) + ISM:', 'anachronism', 'anachronism', 'ANA + CHRON + ISM', ['ana', 'chron', 'ism', 'ic'], ['ana', 'chron', 'ism'], 'Anachronism: something belonging to another time!', 5),
          makeGame('le-4-9', 9, 'RULE_DETECTIVE', 'Etymology of "Alphabet"', 'Where does our word "alphabet" come from?', 'Alpha and Beta, the first two Greek letters', 'alphabet', 'Alpha + Beta.', ['Alpha and Beta, the first two Greek letters', 'Latin for reading', 'King Alfred', 'Phoenician boat'], 'Alpha and Beta, the first two Greek letters', 'From Alpha + Beta, the first two letters of the Greek alphabet!', 5),
          makeGame('le-4-10', 10, 'WORD_BUILDER', 'Colosseum Triumph: CHRONOLOGICAL', 'Build CHRONO + LOGICAL (arranged in order of time):', 'chronological', 'chronological', 'CHRONO + LOGICAL', ['chrono', 'logical', 'bio', 'tele'], ['chrono', 'logical'], 'Sensational! You conquered the Amphitheater of Morphology!', 5)
        ]
      },
      {
        levelNumber: 5,
        name: 'The Golden Phoenix Scepter',
        gradeTier: 'High School & Lifelong Mastery',
        skillFocus: 'Master Polysyllabic Etymology & Phonics Pinnacle',
        description: 'Prove the ultimate mastery of the English language to reign as High Scholar of Phonixia.',
        games: [
          makeGame('le-5-1', 1, 'RULE_DETECTIVE', 'The Root of "Philosophy"', 'What does "philosophy" literally mean in Greek?', 'love of wisdom', 'philosophy', 'Philo (love) + sophia (wisdom).', ['love of wisdom', 'study of plants', 'law of kings', 'speech of gods'], 'love of wisdom', 'Philo (love) + Sophia (wisdom) = love of wisdom!', 5),
          makeGame('le-5-2', 2, 'WORD_BUILDER', 'Spell "OMNISCIENT"', 'OMNI (all) + SCI (know) + ENT:', 'omniscient', 'omniscient', 'OMNI + SCI + ENT', ['omni', 'sci', 'ent', 'ant'], ['omni', 'sci', 'ent'], 'Omni (all) + sci (knowing) = omniscient!', 5),
          makeGame('le-5-3', 3, 'RULE_DETECTIVE', 'Silent Letters in "Pneumonia"', 'Which language gave English silent initial PN, PS, and PT (psychology, pterodactyl)?', 'Ancient Greek', 'psychology', 'Greek pronounced both letters, English dropped the first sound.', ['Ancient Greek', 'Latin', 'Old Norse', 'French'], 'Ancient Greek', 'Ancient Greek! English kept the spelling but silences the first consonant!', 5),
          makeGame('le-5-4', 4, 'WORD_BUILDER', 'Spell "METAMORPHOSIS"', 'META (change) + MORPH (form) + OSIS (process):', 'metamorphosis', 'metamorphosis', 'META + MORPH + OSIS', ['meta', 'morph', 'osis', 'ism'], ['meta', 'morph', 'osis'], 'Meta (change) + morph (shape) = metamorphosis!', 5),
          makeGame('le-5-5', 5, 'RULE_DETECTIVE', 'The Shwa Sound (ə)', 'What is the most common vowel sound in unstressed syllables in English called?', 'the schwa', 'schwa', 'The lazy neutral "uh" sound.', ['the schwa', 'the long vowel', 'the diphthong', 'the digraph'], 'the schwa', 'The schwa (ə)! It sounds like "uh" in banana, about, and pencil!', 5),
          makeGame('le-5-6', 6, 'WORD_BUILDER', 'Spell "MISCHIEVOUS"', 'Watch the spelling: M-I-S-C-H-I-E-V-O-U-S (3 syllables, not 4!):', 'mischievous', 'mischievous', 'MIS + CHIEV + OUS', ['mis', 'chiev', 'ous', 'ious'], ['mis', 'chiev', 'ous'], 'M-I-S-C-H-I-E-V-O-U-S (no extra "i" after v)!', 5),
          makeGame('le-5-7', 7, 'RULE_DETECTIVE', 'Root: BENE vs MALE', 'What is the antonym of "benefactor" (one who does good)?', 'malefactor', 'malefactor', 'Bene = good, Male = bad.', ['malefactor', 'beneficiary', 'spectator', 'dictator'], 'malefactor', 'Male- means evil or bad, opposite of Bene-!', 5),
          makeGame('le-5-8', 8, 'WORD_BUILDER', 'Spell "JUXTAPOSITION"', 'JUXTA (next to) + POSITION:', 'juxtaposition', 'juxtaposition', 'JUXTA + POSITION', ['juxta', 'position', 'side', 'post'], ['juxta', 'position'], 'Juxta (beside) + position = placing side-by-side!', 5),
          makeGame('le-5-9', 9, 'RULE_DETECTIVE', 'The Origin of "Phonics"', 'What root gave birth to our magical world of Phonixia?', 'Greek phone meaning sound', 'phonixia', 'Phon = sound / voice.', ['Greek phone meaning sound', 'Latin phoenix meaning fire', 'French reading', 'Old English stone'], 'Greek phone meaning sound', 'The Greek root "phone", meaning sound and voice!', 5),
          makeGame('le-5-10', 10, 'WORD_BUILDER', 'Imperial Phoenix Seal: PHONIXIA', 'Spell the legendary name: PHONIXIA!', 'phonixia', 'phonixia', 'PHON + IX + IA', ['phon', 'ix', 'ia', 'ex'], ['phon', 'ix', 'ia'], 'ALL HAIL THE HIGH SCHOLAR OF PHONIXIA! YOU HAVE MASTERED ALL FIVE LANDS!', 5)
        ]
      }
    ]
  }
];

export const MINIGAMES_CONFIG = {
  islesOfPlay: {
    name: 'Isles of Play',
    tagline: 'Phonics Playground & Arcade Sandbox',
    theme: 'Tropical playground with floating letter balloons and mining quarries',
    games: [
      { id: 'bubble-popper', name: 'Phoneme Popper', desc: 'Pop bubbles floating to the sky matching the spoken phoneme sounds!' },
      { id: 'word-blast-miner', name: 'Word Blast Miner', desc: 'Mine underground letter blocks like Minecraft to build phonics words before lava rises!' },
      { id: 'rhyme-river', name: 'Rhyme River Rapids', desc: 'Navigate your raft through the river catching matching rhyming fish!' },
      { id: 'syllable-smasher', name: 'Speedy Syllable Smasher', desc: 'Hit the drum matching the correct syllable count (1, 2, 3, or 4)!' }
    ]
  },
  shellshoreArcade: {
    name: 'Shellshore Arcade',
    tagline: 'Retro Boardwalk Seaside Cabinets',
    theme: 'Sunset beach pier with glowing vintage neon phonics arcade cabinets',
    games: [
      { id: 'pearl-diver', name: 'Pearl Diver Clam Match', desc: 'Dive into turquoise waters to flip clam shells and match phonics sound pairs!' },
      { id: 'claw-crane', name: 'Claw Crane Speller', desc: 'Control the arcade crane left and right, then drop the claw to grab missing letter blocks!' },
      { id: 'vowel-pinball', name: 'Neon Vowel Pinball', desc: 'Launch the silver ball into short vs long vowel bumpers and rack up combos!' },
      { id: 'whack-a-sound', name: 'Whack-a-Sound Gopher', desc: 'Tap the cheeky beach gophers popping up with target phonics sound tiles!' }
    ]
  }
};
