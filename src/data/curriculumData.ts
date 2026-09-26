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
          makeGame('ss-1-1', 1, 'SOUND_MATCH', 'Sound of MMM', 'Which shell makes the MMM sound?', 'm', 'mmm', 'M is for MMM / OO / NNN and MMM / AH / NNN / KUH / EE.', ['m', 's', 't', 'p'], 'm', 'MMM like MMM / OW / NNN / TUH / IH / NNN!', 1),
          makeGame('ss-1-2', 2, 'SOUND_MATCH', 'Beginning Sound: SSS / UH / NNN', 'Which letter makes the SSS sound at the start of SSS / UH / NNN?', 's', 'sss uh nnn', 'Listen closely to the first hissing sound SSS.', ['s', 'm', 'a', 'b'], 's', 'S makes the SSS sound like SSS / NNN / AY / KUH.', 1),
          makeGame('ss-1-3', 3, 'SOUND_MATCH', 'Sound of AHH', 'Which shell makes the AHH sound like in AHH / PUH / LLL?', 'a', 'ahh puh lll', 'Short A sounds like ahhh.', ['a', 'o', 'e', 'u'], 'a', 'A says AHH like AHH / LLL / IH / GUH / AY / TUH / ER!', 1),
          makeGame('ss-1-4', 4, 'WORD_BUILDER', 'Build AHH / TUH', 'Which word do these pearls build: AHH / TUH?', 'at', 'ahh tuh', 'Start with AHH, then add TUH.', ['a', 't', 'm', 'p'], ['a', 't'], 'AHH + TUH makes AHH / TUH (at)!', 1),
          makeGame('ss-1-5', 5, 'SOUND_MATCH', 'Sound of TUH', 'Which pearl makes the ticking TUH sound?', 't', 'tuh', 'T makes a tapping TUH sound.', ['t', 'd', 'p', 'k'], 't', 'T is for TUH / ER / TUH / LLL and TUH / EYE / GUH / ER!', 1),
          makeGame('ss-1-6', 6, 'SOUND_MATCH', 'Sound of PUH', 'Which letter makes the popping PUH sound at the start of PUH / AHH / NNN?', 'p', 'puh ahh nnn', 'Pop your lips for PUH.', ['p', 'b', 'd', 't'], 'p', 'P pops with the PUH sound!', 1),
          makeGame('ss-1-7', 7, 'SOUND_MATCH', 'Sound of BUH', 'Which letter makes the BUH sound?', 'b', 'buh', 'Press lips together for BUH.', ['b', 'd', 'p', 't'], 'b', 'B makes the BUH sound like BUH / AIR!', 1),
          makeGame('ss-1-8', 8, 'WORD_BUILDER', 'Build MMM / AHH / PUH', 'Which word do these pearls build: MMM / AHH / PUH?', 'map', 'mmm ahh puh', 'MMM - AHH - PUH.', ['m', 'a', 'p', 's'], ['m', 'a', 'p'], 'MMM + AHH + PUH = MMM / AHH / PUH (map)!', 2),
          makeGame('ss-1-9', 9, 'SOUND_MATCH', 'Middle Sound in PUH / AHH / TUH', 'Which pearl makes the AHH sound in PUH / AHH / TUH?', 'a', 'puh ahh tuh', 'AHH, EH, IH, OH, UH are vowels.', ['a', 'p', 't', 's'], 'a', 'A is the middle vowel AHH in PUH / AHH / TUH.', 2),
          makeGame('ss-1-10', 10, 'WORD_BUILDER', 'Build SSS / AHH / MMM', 'Which word do these pearls build: SSS / AHH / MMM?', 'sam', 'sss ahh mmm', 'Blend SSS / AHH / MMM.', ['s', 'a', 'm', 't'], ['s', 'a', 'm'], 'Super job! SSS / AHH / MMM is ready to explore!', 2)
        ]
      },
      {
        levelNumber: 2,
        name: 'Coral Word Endings',
        gradeTier: 'Preschool Advanced',
        skillFocus: 'Short Vowels & Simple Rimes (-an, -at, -op, -ig)',
        description: 'Explore tidal pools where letters group into word ending families.',
        games: [
          makeGame('ss-2-1', 1, 'WORD_BUILDER', 'Build FFF / AHH / NNN', 'Which word do these pearls build: FFF / AHH / NNN?', 'fan', 'fff ahh nnn', 'FFF + AHH + NNN', ['f', 'a', 'n', 't'], ['f', 'a', 'n'], 'FFF - AHH - NNN spells FFF / AHH / NNN (fan)!', 2),
          makeGame('ss-2-2', 2, 'RHYME_RUSH', 'Rhyme with PUH / OH / PUH', 'What rhymes with PUH / OH / PUH (pop)?', 'hop', 'puh oh puh', 'Listen for the OH / PUH sound.', ['hop', 'car', 'hat', 'run'], 'hop', 'PUH / OH / PUH and HHH / OH / PUH both end in OH / PUH!', 2),
          makeGame('ss-2-3', 3, 'SOUND_MATCH', 'Sound of OH', 'Which word has the short OH sound like OH / KUH / TUH / OH / PUH / UH / SSS?', 'pot', 'puh oh tuh', 'Listen for the open OH sound.', ['pot', 'pet', 'pit', 'pat'], 'pot', 'PUH / OH / TUH has short OH!', 2),
          makeGame('ss-2-4', 4, 'WORD_BUILDER', 'Build PUH / IH / GUH', 'Which word do these pearls build: PUH / IH / GUH?', 'pig', 'puh ih guh', 'PUH / IH / GUH', ['p', 'i', 'g', 'd'], ['p', 'i', 'g'], 'PUH - IH - GUH spells PUH / IH / GUH (pig)!', 2),
          makeGame('ss-2-5', 5, 'RHYME_RUSH', 'Rhyme with WUU / IH / GUH', 'Which sea creature word rhymes with WUU / IH / GUH (wig)?', 'big', 'wuu ih guh', 'IH / GUH word family.', ['big', 'bad', 'box', 'bed'], 'big', 'BUH / IH / GUH and WUU / IH / GUH are in the IH / GUH family!', 2),
          makeGame('ss-2-6', 6, 'SOUND_MATCH', 'Ending Sound in KUH / UH / PUH', 'Which letter makes the final PUH sound in KUH / UH / PUH (cup)?', 'p', 'kuh uh puh', 'Focus on the final sound PUH you hear.', ['p', 'k', 't', 'm'], 'p', 'KUH / UH / PUH ends with the PUH sound.', 2),
          makeGame('ss-2-7', 7, 'WORD_BUILDER', 'Build SSS / UH / NNN', 'Which word do these pearls build: SSS / UH / NNN?', 'sun', 'sss uh nnn', 'SSS - UH - NNN', ['s', 'u', 'n', 'o'], ['s', 'u', 'n'], 'SSS - UH - NNN makes SSS / UH / NNN (sun)!', 2),
          makeGame('ss-2-8', 8, 'RHYME_RUSH', 'Rhyme with SSS / UH / NNN', 'Which pearl word rhymes with SSS / UH / NNN (sun)?', 'run', 'sss uh nnn', 'UH / NNN word family.', ['run', 'sand', 'sky', 'sea'], 'run', 'SSS / UH / NNN and RRR / UH / NNN rhyme together in UH / NNN!', 2),
          makeGame('ss-2-9', 9, 'SOUND_MATCH', 'Sound of EH', 'Which letter makes the short EH sound like in EH / LLL / EH / PUH / AHH / NNN / TUH?', 'e', 'buh eh duh', 'Short E says EH.', ['bed', 'bad', 'bud', 'bod'], 'bed', 'BUH / EH / DUH has the short EH sound!', 2),
          makeGame('ss-2-10', 10, 'WORD_BUILDER', 'Build TUH / OH / PUH', 'Which word do these pearls build: TUH / OH / PUH?', 'top', 'tuh oh puh', 'TUH / OH / PUH', ['t', 'o', 'p', 'b'], ['t', 'o', 'p'], 'Fantastic! TUH - OH - PUH makes TUH / OH / PUH (top)!', 2)
        ]
      },
      {
        levelNumber: 3,
        name: 'Lagoon Rhyme Haven',
        gradeTier: 'Preschool Mastery',
        skillFocus: 'Phonemic Awareness & Auditory Rhymes',
        description: 'Listen to the singing lagoon dolphins and match acoustic rhymes.',
        games: [
          makeGame('ss-3-1', 1, 'RHYME_RUSH', 'Rhyme with FFF / OH / KSS', 'Which word rhymes with FFF / OH / KSS (fox)?', 'box', 'fff oh kss', 'OH / KSS ending sound.', ['box', 'fish', 'frog', 'fly'], 'box', 'FFF / OH / KSS and BUH / OH / KSS rhyme in OH / KSS!', 2),
          makeGame('ss-3-2', 2, 'RHYME_RUSH', 'Rhyme with HHH / EH / NNN', 'What rhymes with HHH / EH / NNN (hen)?', 'pen', 'hhh eh nnn', 'EH / NNN family sound.', ['pen', 'pig', 'pan', 'pup'], 'pen', 'HHH / EH / NNN and PUH / EH / NNN both rhyme with EH / NNN!', 2),
          makeGame('ss-3-3', 3, 'SOUND_MATCH', 'First Sound Match: BUH', 'Which word starts with the same BUH sound as BUH / AIR (bear)?', 'boat', 'buh air', 'Look for words starting with BUH.', ['boat', 'seal', 'clam', 'crab'], 'boat', 'BUH / AIR and BUH / OH / TUH both start with BUH!', 2),
          makeGame('ss-3-4', 4, 'WORD_BUILDER', 'Build RRR / EH / DUH', 'Spell the vibrant coral color RRR / EH / DUH (red).', 'red', 'rrr eh duh', 'RRR / EH / DUH', ['r', 'e', 'd', 'b'], ['r', 'e', 'd'], 'RRR - EH - DUH spells red!', 2),
          makeGame('ss-3-5', 5, 'RHYME_RUSH', 'Rhyme with NNN / EH / TUH', 'What rhymes with the sea NNN / EH / TUH (net)?', 'wet', 'nnn eh tuh', 'EH / TUH sound ending.', ['wet', 'not', 'nut', 'neat'], 'wet', 'NNN / EH / TUH and WUU / EH / TUH make an EH / TUH splash rhyme!', 2),
          makeGame('ss-3-6', 6, 'SOUND_MATCH', 'Middle Sound in FFF / IH / NNN', 'What is the middle sound in FFF / IH / NNN (fin)?', 'i', 'fff ih nnn', 'Listen between FFF and NNN.', ['i', 'a', 'o', 'e'], 'i', 'The middle sound is short I: IH!', 2),
          makeGame('ss-3-7', 7, 'WORD_BUILDER', 'Build WUU / EH / TUH', 'Spell WUU / EH / TUH (wet) before the tide rises.', 'wet', 'wuu eh tuh', 'WUU / EH / TUH', ['w', 'e', 't', 'm'], ['w', 'e', 't'], 'WUU - EH - TUH spells wet!', 2),
          makeGame('ss-3-8', 8, 'RHYME_RUSH', 'Rhyme with DUH / OH / GUH', 'Which creature rhymes with DUH / OH / GUH (dog)?', 'frog', 'duh oh guh', 'OH / GUH ending sound.', ['frog', 'duck', 'deer', 'dove'], 'frog', 'DUH / OH / GUH and FFF / RRR / OH / GUH rhyme with OH / GUH!', 2),
          makeGame('ss-3-9', 9, 'SOUND_MATCH', 'Initial DUH', 'Which word begins with the DUH sound like DUH / OH / LLL / FFF / IH / NNN?', 'dive', 'duh oh lll fff ih nnn', 'Feel your tongue tap for DUH.', ['dive', 'tide', 'swim', 'wave'], 'dive', 'DUH / EYE / VUU starts with DUH!', 2),
          makeGame('ss-3-10', 10, 'WORD_BUILDER', 'Lagoon Secret: FFF / IH / NNN', 'Spell FFF / IH / NNN (fin) to swim with the dolphins!', 'fin', 'fff ih nnn', 'FFF / IH / NNN', ['f', 'i', 'n', 'm'], ['f', 'i', 'n'], 'Hooray! FFF - IH - NNN makes fin!', 2)
        ]
      },
      {
        levelNumber: 4,
        name: 'Tidepool Sound Blends',
        gradeTier: 'Preschool Bridge',
        skillFocus: 'Initial Sound Blending & 3-Sound Phoneme Segmentation',
        description: 'Isolate each individual phoneme sound in small water creatures.',
        games: [
          makeGame('ss-4-1', 1, 'SOUND_MATCH', 'Count Sounds in KUH / AHH / TUH', 'How many sounds do you hear in KUH / AHH / TUH?', '3', 'kuh ahh tuh', 'Count each sound: KUH - AHH - TUH.', ['2', '3', '4', '1'], '3', 'KUH / AHH / TUH has 3 phonemes: KUH, AHH, TUH.', 2),
          makeGame('ss-4-2', 2, 'WORD_BUILDER', 'Spell BUH / UH / GUH', 'Assemble BUH / UH / GUH (bug) to help the hermit crab.', 'bug', 'buh uh guh', 'BUH / UH / GUH', ['b', 'u', 'g', 'p'], ['b', 'u', 'g'], 'BUH - UH - GUH spells bug!', 2),
          makeGame('ss-4-3', 3, 'SOUND_MATCH', 'Sound Subtraction', 'What word do you get if you take KUH from KUH / UH / PUH and put PUH?', 'pup', 'kuh uh puh', 'Swap KUH to PUH to make PUH / UH / PUH.', ['pup', 'pop', 'pip', 'pet'], 'pup', 'Changing KUH to PUH makes PUH / UH / PUH (pup)!', 2),
          makeGame('ss-4-4', 4, 'WORD_BUILDER', 'Spell ZZZ / IH / PUH', 'Spell ZZZ / IH / PUH (zip) like a speedy water bug.', 'zip', 'zzz ih puh', 'ZZZ / IH / PUH', ['z', 'i', 'p', 's'], ['z', 'i', 'p'], 'ZZZ - IH - PUH spells zip!', 2),
          makeGame('ss-4-5', 5, 'RHYME_RUSH', 'Rhyme with LLL / IH / PUH', 'What rhymes with LLL / IH / PUH (lip)?', 'ship', 'lll ih puh', 'IH / PUH ending.', ['ship', 'lap', 'lop', 'loop'], 'ship', 'LLL / IH / PUH and SHHH / IH / PUH rhyme with IH / PUH!', 2),
          makeGame('ss-4-6', 6, 'SOUND_MATCH', 'Hard KUH sound', 'Which letter makes the KUH sound in KUH / LLL / AHH / MMM (clam)?', 'c', 'kuh lll ahh mmm', 'C sounds like KUH here.', ['c', 's', 'z', 'm'], 'c', 'C makes the KUH sound!', 2),
          makeGame('ss-4-7', 7, 'WORD_BUILDER', 'Spell JUH / AHH / MMM', 'Make JUH / AHH / MMM (jam) for the seagull picnic.', 'jam', 'juh ahh mmm', 'JUH / AHH / MMM', ['j', 'a', 'm', 'g'], ['j', 'a', 'm'], 'JUH - AHH - MMM spells jam!', 2),
          makeGame('ss-4-8', 8, 'RHYME_RUSH', 'Rhyme with JUH / AHH / MMM', 'What rhymes with sweet JUH / AHH / MMM (jam)?', 'clam', 'juh ahh mmm', 'AHH / MMM word family.', ['clam', 'crab', 'coral', 'current'], 'clam', 'JUH / AHH / MMM and KUH / LLL / AHH / MMM rhyme in AHH / MMM!', 2),
          makeGame('ss-4-9', 9, 'SOUND_MATCH', 'Ending Sound in TUH / UH / BUH', 'What is the last sound in TUH / UH / BUH (tub)?', 'b', 'tuh uh buh', 'Listen to the finish: BUH.', ['b', 'd', 'p', 't'], 'b', 'TUH / UH / BUH ends with BUH!', 2),
          makeGame('ss-4-10', 10, 'WORD_BUILDER', 'Tidepool Legend: JUH / EH / TUH', 'Spell JUH / EH / TUH (jet) as water shoots high!', 'jet', 'juh eh tuh', 'JUH / EH / TUH', ['j', 'e', 't', 'g'], ['j', 'e', 't'], 'Splendid! JUH - EH - TUH makes jet!', 2)
        ]
      },
      {
        levelNumber: 5,
        name: 'The Pearl Temple Trial',
        gradeTier: 'Preschool Graduation',
        skillFocus: 'Master Sound Blending & CVC Fluency',
        description: 'Unlock the great Golden Oyster of Sound Shallows by decoding 10 sound riddles.',
        games: [
          makeGame('ss-5-1', 1, 'WORD_BUILDER', 'Spell SHHH / EH / LLL', 'Spell SHHH / EH / LLL (shell) with digraph SHHH.', 'shell', 'shhh eh lll', 'SHHH + EH + LLL', ['sh', 'e', 'll', 'ck'], ['sh', 'e', 'll'], 'SHHH - EH - LLL spells shell!', 3),
          makeGame('ss-5-2', 2, 'SOUND_MATCH', 'Find Digraph SHHH', 'Which letters make the quiet SHHH sound?', 'sh', 'shhh', 'Quiet hush sound: SHHH.', ['sh', 'ch', 'th', 'wh'], 'sh', 'SH says SHHH like in SHHH / EH / LLL!', 3),
          makeGame('ss-5-3', 3, 'WORD_BUILDER', 'Spell FFF / IH / SHHH', 'Spell the swimming creature FFF / IH / SHHH (fish).', 'fish', 'fff ih shhh', 'FFF + IH + SHHH', ['f', 'i', 'sh', 'ch'], ['f', 'i', 'sh'], 'FFF - IH - SHHH makes fish!', 3),
          makeGame('ss-5-4', 4, 'RHYME_RUSH', 'Rhyme with FFF / IH / SHHH', 'What rhymes with FFF / IH / SHHH (fish)?', 'wish', 'fff ih shhh', 'IH / SHHH rhyme sound.', ['wish', 'fin', 'fist', 'fast'], 'wish', 'FFF / IH / SHHH and WUU / IH / SHHH rhyme in IH / SHHH!', 3),
          makeGame('ss-5-5', 5, 'SOUND_MATCH', 'Blend FFF / LLL / AHH / GUH', 'Blend these sounds together: FFF / LLL / AHH / GUH:', 'flag', 'fff lll ahh guh', 'Listen to the blended sounds.', ['flag', 'frog', 'fog', 'flap'], 'flag', 'FFF / LLL / AHH / GUH blends into flag!', 3),
          makeGame('ss-5-6', 6, 'WORD_BUILDER', 'Spell SSS / TUH / AHH / RRR', 'Spell SSS / TUH / AHH / RRR (star) in the night sky.', 'star', 'sss tuh ahh rrr', 'SSS / TUH + AHH / RRR', ['st', 'a', 'r', 'p'], ['st', 'a', 'r'], 'SSS - TUH - AHH - RRR spells star!', 3),
          makeGame('ss-5-7', 7, 'RHYME_RUSH', 'Rhyme with SSS / TUH / AHH / RRR', 'What word rhymes with SSS / TUH / AHH / RRR (star)?', 'far', 'sss tuh ahh rrr', 'AHH / RRR word sound.', ['far', 'stay', 'step', 'sand'], 'far', 'SSS / TUH / AHH / RRR and FFF / AHH / RRR share the AHH / RRR sound!', 3),
          makeGame('ss-5-8', 8, 'SOUND_MATCH', 'Turtle Sound Test: TUH', 'Which word begins with TUH and rhymes with NNN / EH / SSS / TUH?', 'test', 'nnn eh sss tuh', 'Think about TUH + EH / SSS / TUH.', ['test', 'best', 'rest', 'west'], 'test', 'TUH / EH / SSS / TUH starts with TUH and rhymes with nest!', 3),
          makeGame('ss-5-9', 9, 'WORD_BUILDER', 'Spell KUH / LLL / AHH / MMM', 'Spell KUH / LLL / AHH / MMM (clam) from the sandy bed.', 'clam', 'kuh lll ahh mmm', 'KUH / LLL + AHH + MMM', ['c', 'l', 'a', 'm'], ['c', 'l', 'a', 'm'], 'KUH - LLL - AHH - MMM spells clam!', 3),
          makeGame('ss-5-10', 10, 'WORD_BUILDER', 'The Pearl Pearl Crown: WUU / AY / VUU', 'Spell WUU / AY / VUU (wave) with magic E power!', 'wave', 'wuu ay vuu', 'WUU + AY + VUU + silent E', ['w', 'a', 'v', 'e'], ['w', 'a', 'v', 'e'], 'CONGRATULATIONS! You conquered Sound Shallows!', 3)
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
          makeGame('bg-1-1', 1, 'WORD_BUILDER', 'Build KUH / AHH / TUH', 'Which word do these keystones build: KUH / AHH / TUH?', 'cat', 'kuh ahh tuh', 'KUH + AHH + TUH', ['c', 'a', 't', 'b'], ['c', 'a', 't'], 'KUH - AHH - TUH makes cat!', 2),
          makeGame('bg-1-2', 2, 'WORD_BUILDER', 'Build DUH / OH / GUH', 'Which word do these keystones build: DUH / OH / GUH?', 'dog', 'duh oh guh', 'DUH + OH + GUH', ['d', 'o', 'g', 'b'], ['d', 'o', 'g'], 'DUH - OH - GUH makes dog!', 2),
          makeGame('bg-1-3', 3, 'WORD_BUILDER', 'Build BUH / EH / DUH', 'Which word do these keystones build: BUH / EH / DUH?', 'bed', 'buh eh duh', 'BUH + EH + DUH', ['b', 'e', 'd', 'p'], ['b', 'e', 'd'], 'BUH - EH - DUH makes bed!', 2),
          makeGame('bg-1-4', 4, 'WORD_BUILDER', 'Build SSS / UH / NNN', 'Which word do these keystones build: SSS / UH / NNN?', 'sun', 'sss uh nnn', 'SSS + UH + NNN', ['s', 'u', 'n', 'm'], ['s', 'u', 'n'], 'SSS - UH - NNN makes sun!', 2),
          makeGame('bg-1-5', 5, 'RHYME_RUSH', 'Rhyme with HHH / AHH / TUH', 'Which block rhymes with HHH / AHH / TUH (hat)?', 'mat', 'hhh ahh tuh', 'AHH / TUH family block.', ['mat', 'mop', 'mud', 'man'], 'mat', 'HHH / AHH / TUH and MMM / AHH / TUH both end in AHH / TUH!', 2),
          makeGame('bg-1-6', 6, 'WORD_BUILDER', 'Build FFF / OH / KSS', 'Which word do these keystones build: FFF / OH / KSS?', 'fox', 'fff oh kss', 'FFF + OH + KSS', ['f', 'o', 'x', 's'], ['f', 'o', 'x'], 'FFF - OH - KSS makes fox!', 2),
          makeGame('bg-1-7', 7, 'SOUND_MATCH', 'Sound of Letter X: KSS', 'What two sounds does the letter X make at the end of BUH / OH / KSS (box)?', '/ks/', 'buh oh kss', 'X sounds like KUH and SSS together: KSS.', ['/ks/', '/sh/', '/ch/', '/th/'], '/ks/', 'X sounds like KUH / SSS (KSS)!', 2),
          makeGame('bg-1-8', 8, 'WORD_BUILDER', 'Build ZZZ / IH / PUH', 'Which word do these keystones build: ZZZ / IH / PUH?', 'zip', 'zzz ih puh', 'ZZZ + IH + PUH', ['z', 'i', 'p', 'b'], ['z', 'i', 'p'], 'ZZZ - IH - PUH spells zip!', 2),
          makeGame('bg-1-9', 9, 'RHYME_RUSH', 'Rhyme with PUH / IH / NNN', 'Which word rhymes with PUH / IH / NNN (pin)?', 'win', 'puh ih nnn', 'IH / NNN family block.', ['win', 'wet', 'web', 'wax'], 'win', 'PUH / IH / NNN and WUU / IH / NNN share the IH / NNN sound!', 2),
          makeGame('bg-1-10', 10, 'WORD_BUILDER', 'Build KUH / UH / PUH', 'Which word do these keystones build: KUH / UH / PUH?', 'cup', 'kuh uh puh', 'KUH + UH + PUH', ['c', 'u', 'p', 't'], ['c', 'u', 'p'], 'Terrific! The CVC Stone Yard is complete!', 2)
        ]
      },
      {
        levelNumber: 2,
        name: 'The Digraph Crane: SH & CH',
        gradeTier: 'Kindergarten Digraphs',
        skillFocus: 'Consonant Digraphs SH and CH',
        description: 'Operate the mighty quarry crane to weld two letters into one unique sound.',
        games: [
          makeGame('bg-2-1', 1, 'SOUND_MATCH', 'Digraph SHHH', 'Which digraph makes the SHHH sound in SHHH / IH / PUH (ship)?', 'sh', 'shhh ih puh', 'S and H combine to make SHHH.', ['sh', 'ch', 'th', 'wh'], 'sh', 'S and H make SHHH!', 2),
          makeGame('bg-2-2', 2, 'WORD_BUILDER', 'Build SHHH / IH / PUH', 'Use the SHHH block to spell SHHH / IH / PUH (ship).', 'ship', 'shhh ih puh', 'SHHH + IH + PUH', ['sh', 'i', 'p', 'b'], ['sh', 'i', 'p'], 'SHHH - IH - PUH spells ship!', 2),
          makeGame('bg-2-3', 3, 'SOUND_MATCH', 'Digraph CHUH sound', 'Which sound starts the word CHUH / IH / PUH (chip)?', 'ch', 'chuh ih puh', 'Train chug sound: CHUH.', ['ch', 'sh', 'th', 'ph'], 'ch', 'CH makes the CHUH sound!', 2),
          makeGame('bg-2-4', 4, 'WORD_BUILDER', 'Build CHUH / IH / NNN', 'Spell CHUH / IH / NNN (chin) using the crane.', 'chin', 'chuh ih nnn', 'CHUH + IH + NNN', ['ch', 'i', 'n', 'm'], ['ch', 'i', 'n'], 'CHUH - IH - NNN spells chin!', 2),
          makeGame('bg-2-5', 5, 'RHYME_RUSH', 'Rhyme with WUU / IH / SHHH', 'Which word rhymes with WUU / IH / SHHH (wish)?', 'dish', 'wuu ih shhh', 'IH / SHHH digraph ending.', ['dish', 'ditch', 'dock', 'damp'], 'dish', 'WUU / IH / SHHH and DUH / IH / SHHH rhyme with IH / SHHH!', 2),
          makeGame('bg-2-6', 6, 'WORD_BUILDER', 'Build CHUH / OH / PUH', 'Chop timber with stone: spell CHUH / OH / PUH (chop).', 'chop', 'chuh oh puh', 'CHUH + OH + PUH', ['ch', 'o', 'p', 't'], ['ch', 'o', 'p'], 'CHUH - OH - PUH spells chop!', 2),
          makeGame('bg-2-7', 7, 'SOUND_MATCH', 'Ending Digraph in RRR / IH / CHUH', 'What digraph finishes the word RRR / IH / CHUH (rich)?', 'ch', 'rrr ih chuh', 'Listen to the ending: CHUH.', ['ch', 'sh', 'th', 'ck'], 'ch', 'RRR / IH / CHUH ends with CHUH (CH)!', 2),
          makeGame('bg-2-8', 8, 'WORD_BUILDER', 'Build SHHH / EH / DUH', 'Construct a stone SHHH / EH / DUH (shed).', 'shed', 'shhh eh duh', 'SHHH + EH + DUH', ['sh', 'e', 'd', 'b'], ['sh', 'e', 'd'], 'SHHH - EH - DUH spells shed!', 2),
          makeGame('bg-2-9', 9, 'RHYME_RUSH', 'Rhyme with CHUH / AHH / TUH', 'What rhymes with CHUH / AHH / TUH (chat)?', 'flat', 'chuh ahh tuh', 'AHH / TUH family sound.', ['flat', 'frog', 'flip', 'fast'], 'flat', 'CHUH / AHH / TUH and FFF / LLL / AHH / TUH rhyme in AHH / TUH!', 2),
          makeGame('bg-2-10', 10, 'WORD_BUILDER', 'Master Digraph: CHUH / IH / NNN', 'Forge the master block CHUH / IH / NNN!', 'chin', 'chuh ih nnn', 'CHUH + IH + NNN', ['ch', 'i', 'n', 'g'], ['ch', 'i', 'n'], 'Superb! The SHHH & CHUH Crane is fully mastered!', 2)
        ]
      },
      {
        levelNumber: 3,
        name: 'The Anvil of TH, WH & CK',
        gradeTier: 'Kindergarten Expansion',
        skillFocus: 'Digraphs TH (voiced/unvoiced), WH, and CK spelling rule',
        description: 'Learn the rule: CK comes after a single short vowel!',
        games: [
          makeGame('bg-3-1', 1, 'RULE_DETECTIVE', 'The CK Rule', 'Which word is spelled correctly for DUH / UH / KUH (duck)?', 'duck', 'duh uh kuh', 'CK follows a short vowel UH!', ['duck', 'duk', 'duc', 'dukk'], 'duck', 'DUH / UH / KUH uses CK after short UH!', 2),
          makeGame('bg-3-2', 2, 'SOUND_MATCH', 'Digraph THHH Sound', 'Which letters make the unvoiced THHH sound in THHH / UH / MMM?', 'th', 'thhh uh mmm', 'Tongue between teeth for THHH.', ['th', 'wh', 'sh', 'ch'], 'th', 'T and H make THHH!', 2),
          makeGame('bg-3-3', 3, 'WORD_BUILDER', 'Build THHH / IH / NNN', 'Forge the word THHH / IH / NNN (thin).', 'thin', 'thhh ih nnn', 'THHH + IH + NNN', ['th', 'i', 'n', 'k'], ['th', 'i', 'n'], 'THHH - IH - NNN spells thin!', 2),
          makeGame('bg-3-4', 4, 'SOUND_MATCH', 'Question Word WH', 'Which digraph starts words like WH / EH / NNN and WH / IH / PUH?', 'wh', 'whhh ih puh', 'W and H breath.', ['wh', 'th', 'ch', 'sh'], 'wh', 'WH begins questions like when and where!', 2),
          makeGame('bg-3-5', 5, 'WORD_BUILDER', 'Build SSS / OH / KUH', 'Remember: short OH takes CK in SSS / OH / KUH (sock)!', 'sock', 'sss oh kuh', 'SSS + OH + CK', ['s', 'o', 'ck', 'k'], ['s', 'o', 'ck'], 'SSS - OH - CK spells sock!', 2),
          makeGame('bg-3-6', 6, 'RHYME_RUSH', 'Rhyme with RRR / OH / KUH', 'Which masonry word rhymes with RRR / OH / KUH (rock)?', 'block', 'rrr oh kuh', 'OH / KUH ending family.', ['block', 'brick', 'bark', 'beam'], 'block', 'RRR / OH / KUH and BUH / LLL / OH / KUH rhyme in OH / KUH!', 2),
          makeGame('bg-3-7', 7, 'WORD_BUILDER', 'Build WH / IH / PUH', 'Spell WH / IH / PUH (whip) using the WH block.', 'whip', 'whhh ih puh', 'WH + IH + PUH', ['wh', 'i', 'p', 'b'], ['wh', 'i', 'p'], 'WH - IH - PUH spells whip!', 2),
          makeGame('bg-3-8', 8, 'RULE_DETECTIVE', 'Voiced TH', 'Which word has the buzzing voiced TH sound like in FFF / EH / TH / ER?', 'this', 'thhh ih sss', 'Feel your throat vibrate: TH.', ['this', 'thick', 'thin', 'thimble'], 'this', 'TH / IH / SSS has the voiced TH sound!', 3),
          makeGame('bg-3-9', 9, 'WORD_BUILDER', 'Build LLL / OH / KUH', 'Secure the gate: spell LLL / OH / KUH (lock).', 'lock', 'lll oh kuh', 'LLL + OH + CK', ['l', 'o', 'ck', 'k'], ['l', 'o', 'ck'], 'LLL - OH - CK spells lock!', 2),
          makeGame('bg-3-10', 10, 'WORD_BUILDER', 'Keystone: THHH / IH / KUH', 'Combine THHH and CK to forge THHH / IH / KUH (thick)!', 'thick', 'thhh ih kuh', 'THHH + IH + CK', ['th', 'i', 'ck', 'k'], ['th', 'i', 'ck'], 'Incredible! You welded THHH and CK together!', 3)
        ]
      },
      {
        levelNumber: 4,
        name: 'The Floss Rule Workshop',
        gradeTier: 'Kindergarten Advanced',
        skillFocus: 'Double Consonant Rule: F, L, S, Z (FLOSS)',
        description: 'When a 1-syllable word has a short vowel ending in F, L, S, or Z, double the final letter!',
        games: [
          makeGame('bg-4-1', 1, 'RULE_DETECTIVE', 'Double FFF in KUH / LLL / IH / FFF', 'Which spelling obeys the FLOSS rule for KUH / LLL / IH / FFF (cliff)?', 'cliff', 'kuh lll ih fff', 'Double FFF after short IH.', ['cliff', 'clif', 'clyf', 'klif'], 'cliff', 'Cliff ends in double FFF!', 3),
          makeGame('bg-4-2', 2, 'WORD_BUILDER', 'Build BUH / EH / LLL', 'Ring the tower: double LLL after short EH in BUH / EH / LLL.', 'bell', 'buh eh lll', 'BUH + EH + LL', ['b', 'e', 'll', 'l'], ['b', 'e', 'll'], 'BUH - EH - LL spells bell!', 2),
          makeGame('bg-4-3', 3, 'RULE_DETECTIVE', 'Double SSS in GUH / LLL / AHH / SSS', 'Find the correct FLOSS spelling of GUH / LLL / AHH / SSS (glass):', 'glass', 'guh lll ahh sss', 'Double SSS after short AHH.', ['glass', 'glas', 'glace', 'glaas'], 'glass', 'Glass doubles the SSS!', 2),
          makeGame('bg-4-4', 4, 'WORD_BUILDER', 'Build BUH / UH / ZZZ', 'Like a bee: spell BUH / UH / ZZZ (buzz).', 'buzz', 'buh uh zzz', 'BUH + UH + ZZ', ['b', 'u', 'zz', 'z'], ['b', 'u', 'zz'], 'BUH - UH - ZZ spells buzz!', 2),
          makeGame('bg-4-5', 5, 'RHYME_RUSH', 'Rhyme with HHH / IH / LLL', 'Which word rhymes with HHH / IH / LLL (hill)?', 'mill', 'hhh ih lll', 'IH / LLL FLOSS family.', ['mill', 'meal', 'mail', 'mile'], 'mill', 'HHH / IH / LLL and MMM / IH / LLL both rhyme!', 2),
          makeGame('bg-4-6', 6, 'WORD_BUILDER', 'Build PUH / UH / FFF', 'A puff of dust: spell PUH / UH / FFF (puff).', 'puff', 'puh uh fff', 'PUH + UH + FF', ['p', 'u', 'ff', 'f'], ['p', 'u', 'ff'], 'PUH - UH - FF spells puff!', 2),
          makeGame('bg-4-7', 7, 'RULE_DETECTIVE', 'Exception Spotter', 'Which word is an exception and does NOT double its final SSS?', 'bus', 'buh uh sss', 'BUH / UH / SSS is a famous everyday exception.', ['bus', 'boss', 'bliss', 'bass'], 'bus', 'BUH / UH / SSS is an exception to the floss rule!', 3),
          makeGame('bg-4-8', 8, 'WORD_BUILDER', 'Build MMM / IH / SSS', 'Spell MMM / IH / SSS (miss) using the double SSS rule.', 'miss', 'mmm ih sss', 'MMM + IH + SS', ['m', 'i', 'ss', 's'], ['m', 'i', 'ss'], 'MMM - IH - SS spells miss!', 2),
          makeGame('bg-4-9', 9, 'RHYME_RUSH', 'Rhyme with WUU / EH / LLL', 'Which word rhymes with WUU / EH / LLL (well)?', 'yell', 'wuu eh lll', 'Look for the EH / LLL sound.', ['yell', 'wall', 'wool', 'will'], 'yell', 'WUU / EH / LLL and YUH / EH / LLL rhyme in EH / LLL!', 2),
          makeGame('bg-4-10', 10, 'WORD_BUILDER', 'Guild Arch: SHHH / EH / LLL', 'Combine SHHH and double LLL to build SHHH / EH / LLL (shell)!', 'shell', 'shhh eh lll', 'SHHH + EH + LL', ['sh', 'e', 'll', 'l'], ['sh', 'e', 'll'], 'Outstanding! Floss Rule Mastered!', 3)
        ]
      },
      {
        levelNumber: 5,
        name: 'The Grand Cathedral Spire',
        gradeTier: 'Kindergarten Capstone',
        skillFocus: 'Consonant Blends & Multi-Block Architecture',
        description: 'Place the golden gargoyles atop the Cathedral by decoding complex blends.',
        games: [
          makeGame('bg-5-1', 1, 'WORD_BUILDER', 'Build FFF / RRR / OH / GUH', 'Assemble blend FFF / RRR + OH / GUH.', 'frog', 'fff rrr oh guh', 'FFF / RRR + OH + GUH', ['fr', 'o', 'g', 'b'], ['fr', 'o', 'g'], 'FFF - RRR - OH - GUH spells frog!', 3),
          makeGame('bg-5-2', 2, 'SOUND_MATCH', 'Initial Blend in KUH / LLL / AHH / PUH', 'What blend starts KUH / LLL / AHH / PUH (clap)?', 'cl', 'kuh lll ahh puh', 'KUH and LLL blending.', ['cl', 'cr', 'fl', 'gl'], 'cl', 'KUH and LLL blend into KUH / LLL (CL)!', 2),
          makeGame('bg-5-3', 3, 'WORD_BUILDER', 'Build SSS / TUH / OH / PUH', 'Spell SSS / TUH / OH / PUH (stop) with blend SSS / TUH.', 'stop', 'sss tuh oh puh', 'SSS / TUH + OH + PUH', ['st', 'o', 'p', 'b'], ['st', 'o', 'p'], 'SSS - TUH - OH - PUH spells stop!', 2),
          makeGame('bg-5-4', 4, 'SOUND_MATCH', 'Ending Blend in KUH / AHH / MMM / PUH', 'What two consonant sounds end KUH / AHH / MMM / PUH (camp)?', 'mp', 'kuh ahh mmm puh', 'MMM and PUH blend: MMM / PUH.', ['mp', 'nt', 'nd', 'st'], 'mp', 'MMM and PUH blend into MMM / PUH!', 2),
          makeGame('bg-5-5', 5, 'WORD_BUILDER', 'Build PUH / LLL / UH / GUH', 'Power the waterwheel: spell PUH / LLL / UH / GUH (plug).', 'plug', 'puh lll uh guh', 'PUH / LLL + UH + GUH', ['pl', 'u', 'g', 'd'], ['pl', 'u', 'g'], 'PUH - LLL - UH - GUH spells plug!', 3),
          makeGame('bg-5-6', 6, 'RHYME_RUSH', 'Rhyme with SSS / TUH / AHH / NNN / DUH', 'Which word rhymes with SSS / TUH / AHH / NNN / DUH (stand)?', 'grand', 'sss tuh ahh nnn duh', 'AHH / NNN / DUH blend ending.', ['grand', 'grain', 'grunt', 'grin'], 'grand', 'Stand and grand rhyme with AHH / NNN / DUH!', 3),
          makeGame('bg-5-7', 7, 'WORD_BUILDER', 'Build BUH / RRR / IH / KUH', 'Combine blend BUH / RRR + IH + CK!', 'brick', 'buh rrr ih kuh', 'BUH / RRR + IH + CK', ['br', 'i', 'ck', 'k'], ['br', 'i', 'ck'], 'BUH - RRR - IH - CK spells brick!', 3),
          makeGame('bg-5-8', 8, 'RULE_DETECTIVE', 'CK vs K in MMM / IH / LLL / KUH', 'Why does MMM / IH / LLL / KUH (milk) end in K instead of CK?', 'consonant before K', 'mmm ih lll kuh', 'LLL is a consonant, not a short vowel!', ['consonant before K', 'it has short vowel', 'magic e rule', 'silent letter'], 'consonant before K', 'CK only comes directly after a single short vowel. In milk, LLL comes first!', 3),
          makeGame('bg-5-9', 9, 'WORD_BUILDER', 'Build KUH / RRR / AY / NNN', 'Spell KUH / RRR / AY / NNN (crane) with magic E power!', 'crane', 'kuh rrr ay nnn', 'KUH / RRR + AY + NNN + silent E', ['cr', 'a', 'n', 'e'], ['cr', 'a', 'n', 'e'], 'KUH - RRR - AY - NNN spells crane!', 3),
          makeGame('bg-5-10', 10, 'WORD_BUILDER', 'Master Mason: BUH / IH / LLL / DUH', 'Spell the ultimate Guild word: BUH / IH / LLL / DUH (build)!', 'build', 'buh ih lll duh', 'BUH + U + I + LLL + DUH', ['b', 'u', 'i', 'l', 'd'], ['b', 'u', 'i', 'l', 'd'], 'CONGRATULATIONS! You are now a Master Mason of Builders Guild!', 3)
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
          makeGame('tt-1-1', 1, 'MAGIC_E', 'KUH / AHH / PUH to KUH / AY / PUH', 'What does KUH / AHH / PUH (cap) become when Magic E arrives?', 'cape', 'kuh ay puh', 'Magic E makes A say its long AY sound.', ['cape', 'cope', 'cupe', 'cap'], 'cape', 'Silent E transforms cap into KUH / AY / PUH (cape)!', 2),
          makeGame('tt-1-2', 2, 'MAGIC_E', 'KUH / IH / TUH to KUH / EYE / TUH', 'Transform KUH / IH / TUH (kit) into a flying toy with Magic E:', 'kite', 'kuh eye tuh', 'Short IH becomes long EYE.', ['kite', 'kute', 'kate', 'kot'], 'kite', 'KUH / IH / TUH becomes KUH / EYE / TUH (kite)!', 2),
          makeGame('tt-1-3', 3, 'MAGIC_E', 'HHH / OH / PUH to HHH / OHW / PUH', 'What does HHH / OH / PUH (hop) become with Magic E?', 'hope', 'hhh ohw puh', 'Short OH becomes long OHW.', ['hope', 'hype', 'hape', 'hupe'], 'hope', 'HHH / OH / PUH becomes HHH / OHW / PUH (hope)!', 2),
          makeGame('tt-1-4', 4, 'WORD_BUILDER', 'Spell KUH / AY / KUH', 'Spell the sweet treat KUH / AY / KUH (cake) with Magic E.', 'cake', 'kuh ay kuh', 'KUH + AY + KUH + silent E', ['c', 'a', 'k', 'e'], ['c', 'a', 'k', 'e'], 'KUH - AY - KUH spells cake!', 2),
          makeGame('tt-1-5', 5, 'MAGIC_E', 'TUH / UH / BUH to TUH / YOO / BUH', 'Transform TUH / UH / BUH (tub) with Magic E:', 'tube', 'tuh yoo buh', 'Short UH becomes long YOO.', ['tube', 'tobe', 'tabe', 'tybe'], 'tube', 'TUH / UH / BUH becomes TUH / YOO / BUH (tube)!', 2),
          makeGame('tt-1-6', 6, 'WORD_BUILDER', 'Spell BUH / EYE / KUH', 'Spell BUH / EYE / KUH (bike) using the CVCe pattern.', 'bike', 'buh eye kuh', 'BUH + EYE + KUH + silent E', ['b', 'i', 'k', 'e'], ['b', 'i', 'k', 'e'], 'BUH - EYE - KUH spells bike!', 2),
          makeGame('tt-1-7', 7, 'RULE_DETECTIVE', 'Soft SSS with Magic E', 'Why does FFF / AY / SSS (face) have a soft SSS sound?', 'E follows C', 'fff ay sss', 'When C is followed by E, I, or Y, it says SSS!', ['E follows C', 'A is long', 'F is quiet', 'It has two vowels'], 'E follows C', 'C makes the soft SSS sound when followed by E, I, or Y!', 3),
          makeGame('tt-1-8', 8, 'WORD_BUILDER', 'Spell RRR / OHW / ZZZ', 'Spell the fragrant flower RRR / OHW / ZZZ (rose).', 'rose', 'rrr ohw zzz', 'RRR + OHW + ZZZ + silent E', ['r', 'o', 's', 'e'], ['r', 'o', 's', 'e'], 'RRR - OHW - ZZZ spells rose!', 2),
          makeGame('tt-1-9', 9, 'MAGIC_E', 'PUH / IH / NNN to PUH / EYE / NNN', 'Transform PUH / IH / NNN (pin) into a tall pine tree:', 'pine', 'puh eye nnn', 'Short IH to Long EYE.', ['pine', 'pane', 'pone', 'pune'], 'pine', 'PUH / IH / NNN becomes PUH / EYE / NNN (pine)!', 2),
          makeGame('tt-1-10', 10, 'WORD_BUILDER', 'Grove Champion: FFF / LLL / AY / MMM', 'Forge the Phoenix flame word FFF / LLL / AY / MMM!', 'flame', 'fff lll ay mmm', 'FFF / LLL + AY + MMM + silent E', ['fl', 'a', 'm', 'e'], ['fl', 'a', 'm', 'e'], 'Brilliant! The Magic E Grove shines bright!', 3)
        ]
      },
      {
        levelNumber: 2,
        name: 'The Foxs Tricky Stepping Stones',
        gradeTier: '1st Grade Sight Words',
        skillFocus: 'High-Frequency Tricky Sight Words',
        description: 'Cross the rushing river by stepping only on correctly spelled tricky sight words.',
        games: [
          makeGame('tt-2-1', 1, 'SIGHT_BRIDGE', 'Tricky Word: SSS / EH / DUH', 'Pick the correct spelling of the foxs word SSS / EH / DUH (said):', 'said', 'sss eh duh', 'Common irregular word SSS / EH / DUH.', ['said', 'sed', 'sayed', 'siad'], 'said', 'SSS / EH / DUH is spelled S-A-I-D!', 2),
          makeGame('tt-2-2', 2, 'SIGHT_BRIDGE', 'Tricky Word: KUH / OO / DUH', 'Find the correct spelling of KUH / OO / DUH (could):', 'could', 'kuh oo duh', 'O-U-L-D silent L family.', ['could', 'cud', 'cood', 'culd'], 'could', 'C-O-U-L-D spells could!', 3),
          makeGame('tt-2-3', 3, 'SIGHT_BRIDGE', 'Tricky Word: WUU / OO / DUH', 'Pick the partner word: WUU / OO / DUH (would):', 'would', 'wuu oo duh', 'Rhymes with KUH / OO / DUH.', ['would', 'wud', 'wood', 'wuld'], 'would', 'W-O-U-L-D spells would!', 3),
          makeGame('tt-2-4', 4, 'SIGHT_BRIDGE', 'Tricky Word: TH / AIR', 'Which word sounds like TH / AIR meaning belonging to them?', 'their', 'thhh air', 'Possessive pronoun.', ['their', 'there', 'theyre', 'thare'], 'their', 'T-H-E-I-R shows possession!', 3),
          makeGame('tt-2-5', 5, 'WORD_BUILDER', 'Build WH / AIR', 'Spell the question word WH / AIR (where).', 'where', 'whhh air', 'WH + AIR', ['wh', 'e', 'r', 'e'], ['wh', 'e', 'r', 'e'], 'W-H-E-R-E asks for location!', 3),
          makeGame('tt-2-6', 6, 'SIGHT_BRIDGE', 'Tricky Word: BUH / IH / KUH / UH / ZZZ', 'Find the true spelling of BUH / IH / KUH / UH / ZZZ (because):', 'because', 'buh ih kuh uh zzz', 'Big Elephant Can Always Upset Small Elephants!', ['because', 'becuz', 'becaws', 'bekoze'], 'because', 'B-E-C-A-U-S-E is because!', 3),
          makeGame('tt-2-7', 7, 'SIGHT_BRIDGE', 'Tricky Word: DUH / UH / ZZZ', 'Which stone spells DUH / UH / ZZZ (does)?', 'does', 'duh uh zzz', 'He does his reading.', ['does', 'dose', 'duz', 'dos'], 'does', 'D-O-E-S spells does!', 2),
          makeGame('tt-2-8', 8, 'WORD_BUILDER', 'Build FFF / RRR / EH / NNN / DUH', 'Spell FFF / RRR / EH / NNN / DUH (friend):', 'friend', 'fff rrr eh nnn duh', 'FFF / RRR + EH + NNN + DUH', ['fr', 'i', 'e', 'n', 'd'], ['fr', 'i', 'e', 'n', 'd'], 'F-R-I-E-N-D spells friend!', 3),
          makeGame('tt-2-9', 9, 'SIGHT_BRIDGE', 'Tricky Word: PUH / EE / PUH / LLL', 'Identify the spelling of PUH / EE / PUH / LLL (people):', 'people', 'puh ee puh lll', 'Notice the EO vowel pair.', ['people', 'peeple', 'poeple', 'pepel'], 'people', 'P-E-O-P-L-E spells people!', 3),
          makeGame('tt-2-10', 10, 'SIGHT_BRIDGE', 'River Crest: THHH / RRR / OO', 'Cross the stone: THHH / RRR / OO (through) the woods:', 'through', 'thhh rrr oo', 'T-H-R-O-U-G-H', ['through', 'thru', 'threw', 'throu'], 'through', 'Bravo! You leaped across the Tricky River!', 3)
        ]
      },
      {
        levelNumber: 3,
        name: 'The Diphthong Den (OI/OY & OU/OW)',
        gradeTier: '2nd Grade Core',
        skillFocus: 'Diphthongs: Sound Glides (oi/oy, ou/ow)',
        description: 'Master the dancing vowels that twist together in your mouth.',
        games: [
          makeGame('tt-3-1', 1, 'RULE_DETECTIVE', 'OY vs OI Rule', 'When do we usually use OY for the OY sound?', 'at the end of a word', 'tuh oy', 'OY likes the end of a base word like BUH / OY and TUH / OY!', ['at the end of a word', 'at the beginning', 'before short vowels', 'never'], 'at the end of a word', 'OY usually comes at the end of a root word!', 3),
          makeGame('tt-3-2', 2, 'WORD_BUILDER', 'Build KUH / OY / NNN', 'Spell KUH / OY / NNN (coin) with middle OI diphthong.', 'coin', 'kuh oy nnn', 'KUH + OI + NNN', ['c', 'oi', 'n', 'oy'], ['c', 'oi', 'n'], 'C-OI-N spells coin!', 2),
          makeGame('tt-3-3', 3, 'WORD_BUILDER', 'Build JUH / OY', 'Spell JUH / OY (joy) with final OY.', 'joy', 'juh oy', 'JUH + OY', ['j', 'oy', 'oi', 'e'], ['j', 'oy'], 'J-OY spells joy!', 2),
          makeGame('tt-3-4', 4, 'SOUND_MATCH', 'Diphthong in KUH / LLL / OW / DUH', 'Which letters make the OW sound in KUH / LLL / OW / DUH (cloud)?', 'ou', 'kuh lll ow duh', 'OU diphthong.', ['ou', 'ow', 'oo', 'au'], 'ou', 'OU makes OW in cloud!', 2),
          makeGame('tt-3-5', 5, 'WORD_BUILDER', 'Build KUH / RRR / OW / NNN', 'Spell the royal KUH / RRR / OW / NNN (crown) with OW.', 'crown', 'kuh rrr ow nnn', 'KUH / RRR + OW + NNN', ['cr', 'ow', 'n', 'ou'], ['cr', 'ow', 'n'], 'CR-OW-N spells crown!', 3),
          makeGame('tt-3-6', 6, 'RHYME_RUSH', 'Rhyme with SSS / OW / NNN / DUH', 'Which word rhymes with SSS / OW / NNN / DUH (sound)?', 'ground', 'sss ow nnn duh', 'OW / NNN / DUH family.', ['ground', 'groan', 'grain', 'grip'], 'ground', 'Sound and ground share the OW / NNN / DUH sound!', 3),
          makeGame('tt-3-7', 7, 'WORD_BUILDER', 'Build BUH / OY / LLL', 'Boil the kettle: spell BUH / OY / LLL (boil).', 'boil', 'buh oy lll', 'BUH + OI + LLL', ['b', 'oi', 'l', 'oy'], ['b', 'oi', 'l'], 'B-OI-L spells boil!', 2),
          makeGame('tt-3-8', 8, 'RULE_DETECTIVE', 'Sounds of OW', 'Which word has the OW sound like in KUH / OW (not OHW like SSS / NNN / OHW)?', 'howl', 'hhh ow lll', 'Listen for the HHH / OW / LLL sound.', ['howl', 'glow', 'blow', 'slow'], 'howl', 'HHH / OW / LLL has the OW sound!', 3),
          makeGame('tt-3-9', 9, 'WORD_BUILDER', 'Build SHHH / OW / TUH', 'Spell SHHH / OW / TUH (shout) combining SHHH and OU.', 'shout', 'shhh ow tuh', 'SHHH + OU + TUH', ['sh', 'ou', 't', 'ow'], ['sh', 'ou', 't'], 'SH-OU-T spells shout!', 3),
          makeGame('tt-3-10', 10, 'WORD_BUILDER', 'Diphthong Gem: VUU / OY / IH / JUH', 'Spell VUU / OY / IH / JUH (voyage) to set sail!', 'voyage', 'vuu oy ih juh', 'VUU + OY + A + G + E', ['v', 'oy', 'a', 'g', 'e'], ['v', 'oy', 'a', 'g', 'e'], 'Spectacular! The Diphthong Den is conquered!', 3)
        ]
      },
      {
        levelNumber: 4,
        name: 'The Compound Word Canopy',
        gradeTier: '2nd Grade Structural',
        skillFocus: 'Compound Words & Syllable Junctures',
        description: 'Climb tree platforms by combining two complete words into one new meaning.',
        games: [
          makeGame('tt-4-1', 1, 'WORD_BUILDER', 'Make SSS / UH / NNN + FFF / LLL / OW / ER', 'Combine two words: SSS / UH / NNN and FFF / LLL / OW / ER:', 'sunflower', 'sss uh nnn fff lll ow er', 'SUN + FLOWER', ['sun', 'flower', 'tree', 'shine'], ['sun', 'flower'], 'Sun + Flower = Sunflower!', 2),
          makeGame('tt-4-2', 2, 'WORD_BUILDER', 'Make BUH / AHH / KUH + PUH / AHH / KUH', 'Combine the gear: BUH / AHH / KUH + PUH / AHH / KUH (backpack).', 'backpack', 'buh ahh kuh puh ahh kuh', 'BACK + PACK', ['back', 'pack', 'bag', 'book'], ['back', 'pack'], 'Back + Pack = Backpack!', 2),
          makeGame('tt-4-3', 3, 'SOUND_MATCH', 'Compound Meaning', 'What does LLL / EYE / TUH + HHH / OW / SSS do?', 'shines light for ships', 'lll eye tuh hhh ow sss', 'Light + house.', ['shines light for ships', 'light weight cabin', 'house of feathers', 'candle store'], 'shines light for ships', 'A lighthouse shines light to guide ships!', 2),
          makeGame('tt-4-4', 4, 'WORD_BUILDER', 'Make RRR / AY / NNN + BUH / OHW', 'Join RRR / AY / NNN and BUH / OHW across the sky:', 'rainbow', 'rrr ay nnn buh ohw', 'RAIN + BOW', ['rain', 'bow', 'sky', 'arrow'], ['rain', 'bow'], 'Rain + Bow = Rainbow!', 2),
          makeGame('tt-4-5', 5, 'SYLLABLE_SPLIT', 'Count in KUH / AHH / MMM / PUH - FFF / EYE / ER', 'How many beats are in KUH / AHH / MMM / PUH - FFF / EYE / ER?', '2', 'kuh ahh mmm puh fff eye er', 'Clap the parts: camp-fire.', ['1', '2', '3', '4'], '2', 'Camp-fire has 2 syllables!', 2),
          makeGame('tt-4-6', 6, 'WORD_BUILDER', 'Make JUH / EH / LLL / EE + FFF / IH / SHHH', 'Combine sea parts: JUH / EH / LLL / EE + FFF / IH / SHHH:', 'jellyfish', 'juh eh lll ee fff ih shhh', 'JELLY + FISH', ['jelly', 'fish', 'jam', 'water'], ['jelly', 'fish'], 'Jelly + Fish = Jellyfish!', 2),
          makeGame('tt-4-7', 7, 'RULE_DETECTIVE', 'Compound Detective', 'Which is a true closed compound word?', 'pancake', 'puh ahh nnn kuh ay kuh', 'One single combined word.', ['pancake', 'ice cream', 'living room', 'high school'], 'pancake', 'PUH / AHH / NNN / KUH / AY / KUH is a single compound word!', 3),
          makeGame('tt-4-8', 8, 'WORD_BUILDER', 'Make DUH / RRR / AHH / GUH / UH / NNN + FFF / LLL / EYE', 'Combine dragon + fly:', 'dragonfly', 'duh rrr ahh guh uh nnn fff lll eye', 'DRAGON + FLY', ['dragon', 'fly', 'fire', 'bug'], ['dragon', 'fly'], 'Dragon + Fly = Dragonfly!', 3),
          makeGame('tt-4-9', 9, 'SYLLABLE_SPLIT', 'Syllable Count in GUH / RRR / AHH / SSS - HHH / OH / PUH - ER', 'How many syllables in GUH / RRR / AHH / SSS - HHH / OH / PUH - ER?', '3', 'guh rrr ahh sss hhh oh puh er', 'Grass - hop - per.', ['1', '2', '3', '4'], '3', 'Grasshopper has 3 syllables!', 3),
          makeGame('tt-4-10', 10, 'WORD_BUILDER', 'Canopy Summit: SSS / TUH / AHH / RRR + LLL / EYE / TUH', 'Join star + light to illuminate the treetops!', 'starlight', 'sss tuh ahh rrr lll eye tuh', 'STAR + LIGHT', ['star', 'light', 'beam', 'sun'], ['star', 'light'], 'Brilliant! You mastered the Compound Canopy!', 3)
        ]
      },
      {
        levelNumber: 5,
        name: 'The Ancient Forest Guardian',
        gradeTier: '2nd Grade Capstone',
        skillFocus: 'Mastery of Tricky Words, Blends, & Complex Vowels',
        description: 'Solve the riddle of the ancient stone moss portal to unlock the path to the peaks.',
        games: [
          makeGame('tt-5-1', 1, 'WORD_BUILDER', 'Spell NNN / EYE / TUH (Knight)', 'Spell the armored explorer with silent K: NNN / EYE / TUH (knight):', 'knight', 'nnn eye tuh', 'KN + IGH + TUH', ['kn', 'igh', 't', 'n'], ['kn', 'igh', 't'], 'KN-IGH-T spells knight!', 3),
          makeGame('tt-5-2', 2, 'RULE_DETECTIVE', 'Silent K in NNN / EE', 'Which word starts with a silent K in NNN / EE (knee)?', 'knee', 'nnn ee', 'K before N is quiet.', ['knee', 'kite', 'king', 'koala'], 'knee', 'NNN / EE (knee) starts with silent K!', 3),
          makeGame('tt-5-3', 3, 'WORD_BUILDER', 'Spell LLL / EYE / TUH', 'Spell LLL / EYE / TUH (light) with high vowel team IGH.', 'light', 'lll eye tuh', 'LLL + IGH + TUH', ['l', 'igh', 't', 'ite'], ['l', 'igh', 't'], 'L-IGH-T spells light!', 3),
          makeGame('tt-5-4', 4, 'SIGHT_BRIDGE', 'Tricky Word: THHH / AW / TUH', 'Choose the spelling of THHH / AW / TUH (thought):', 'thought', 'thhh aw tuh', 'T-H-O-U-G-H-T', ['thought', 'thot', 'thawt', 'thoght'], 'thought', 'T-H-O-U-G-H-T spells thought!', 3),
          makeGame('tt-5-5', 5, 'RHYME_RUSH', 'Rhyme with BUH / RRR / EYE / TUH', 'Which word rhymes with BUH / RRR / EYE / TUH (bright)?', 'flight', 'buh rrr eye tuh', 'EYE / TUH phonogram.', ['flight', 'blight', 'front', 'frost'], 'flight', 'Bright and flight both end in EYE / TUH!', 3),
          makeGame('tt-5-6', 6, 'WORD_BUILDER', 'Spell KUH / LLL / EYE / MMM', 'Spell KUH / LLL / EYE / MMM (climb) with silent B!', 'climb', 'kuh lll eye mmm', 'KUH / LLL + EYE + MMM + silent B', ['cl', 'i', 'm', 'b'], ['cl', 'i', 'm', 'b'], 'C-L-I-M-B has a silent B!', 3),
          makeGame('tt-5-7', 7, 'RULE_DETECTIVE', 'Silent W in RRR / EYE / TUH', 'Which word means putting words on paper with a pencil?', 'write', 'rrr eye tuh', 'Begins with silent W.', ['write', 'right', 'rite', 'rite'], 'write', 'W-R-I-T-E is to write words!', 3),
          makeGame('tt-5-8', 8, 'WORD_BUILDER', 'Spell BUH / RRR / IH / JUH', 'Spell BUH / RRR / IH / JUH (bridge) with DGE after short IH.', 'bridge', 'buh rrr ih juh', 'BUH / RRR + IH + DGE', ['br', 'i', 'dge', 'g'], ['br', 'i', 'dge'], 'B-R-I-D-G-E spells bridge!', 3),
          makeGame('tt-5-9', 9, 'SIGHT_BRIDGE', 'Tricky Word: EH / NNN / UH / FFF', 'Find the correct spelling of EH / NNN / UH / FFF (enough):', 'enough', 'eh nnn uh fff', 'GH makes FFF here!', ['enough', 'enuf', 'enuff', 'anuff'], 'enough', 'E-N-O-U-G-H is enough!', 3),
          makeGame('tt-5-10', 10, 'WORD_BUILDER', 'Passage Key: EH / KSS / PUH / LLL / OHW / RRR / ER', 'Spell EH / KSS / PUH / LLL / OHW / RRR / ER (explorer) to step through!', 'explorer', 'eh kss puh lll ohw rrr er', 'EX + PLOR + ER', ['ex', 'plor', 'er', 'or'], ['ex', 'plor', 'er'], 'HEROIC! You unlocked Whispering Peaks!', 4)
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
          makeGame('wp-1-1', 1, 'RULE_DETECTIVE', 'The Vowel Team Walk: GUH / LLL / EE / MMM', 'Which vowel team spells long EE in GUH / LLL / EE / MMM (gleam)?', 'ea', 'guh lll ee mmm', 'EA team.', ['ea', 'ee', 'ei', 'ey'], 'ea', 'G-L-E-A-M spells gleam with EA!', 3),
          makeGame('wp-1-2', 2, 'WORD_BUILDER', 'Build SSS / AY / LLL', 'Sail the waters: spell SSS / AY / LLL (sail) with middle AI.', 'sail', 'sss ay lll', 'SSS + AI + LLL', ['s', 'ai', 'l', 'ay'], ['s', 'ai', 'l'], 'S-AI-L spells sail!', 3),
          makeGame('wp-1-3', 3, 'RULE_DETECTIVE', 'AI vs AY in SSS / PUH / RRR / AY', 'Why does SSS / PUH / RRR / AY (spray) end in AY instead of AI?', 'AY is at the end of root words', 'sss puh rrr ay', 'AI is middle, AY is end.', ['AY is at the end of root words', 'AI cannot make long A', 'S requires Y', 'Magic E rule'], 'AY is at the end of root words', 'English words rarely end in I, so we use AY at the end!', 3),
          makeGame('wp-1-4', 4, 'WORD_BUILDER', 'Build BUH / OHW / TUH', 'Spell BUH / OHW / TUH (boat) with the OA vowel team.', 'boat', 'buh ohw tuh', 'BUH + OA + TUH', ['b', 'oa', 't', 'ow'], ['b', 'oa', 't'], 'B-OA-T spells boat!', 3),
          makeGame('wp-1-5', 5, 'SOUND_MATCH', 'Short EH sound in FFF / EH / TH / ER', 'Which word has short EH sound with EA like in BUH / RRR / EH / DUH (bread)?', 'feather', 'fff eh thhh er', 'EA can say EE, EH, or AY.', ['feather', 'clean', 'steak', 'beach'], 'feather', 'FFF / EH / TH / ER uses EA for short EH!', 3),
          makeGame('wp-1-6', 6, 'WORD_BUILDER', 'Build FFF / RRR / EE / ZZZ', 'Spell FFF / RRR / EE / ZZZ (freeze) with EE and final silent E.', 'freeze', 'fff rrr ee zzz', 'FFF / RRR + EE + ZZZ + silent E', ['fr', 'ee', 'z', 'e'], ['fr', 'ee', 'z', 'e'], 'F-R-E-E-Z-E spells freeze!', 3),
          makeGame('wp-1-7', 7, 'RHYME_RUSH', 'Rhyme with PUH / EE / KUH', 'Which word rhymes with alpine PUH / EE / KUH (peak)?', 'shriek', 'puh ee kuh', 'EE / KUH vowel team rhyme.', ['shriek', 'pine', 'pack', 'poke'], 'shriek', 'PUH / EE / KUH and SHHH / RRR / EE / KUH rhyme in EE / KUH!', 3),
          makeGame('wp-1-8', 8, 'WORD_BUILDER', 'Build KUH / OHW / CHUH', 'Spell KUH / OHW / CHUH (coach) with OA and CHUH.', 'coach', 'kuh ohw chuh', 'KUH + OA + CHUH', ['c', 'oa', 'ch', 'tch'], ['c', 'oa', 'ch'], 'C-OA-CH spells coach!', 3),
          makeGame('wp-1-9', 9, 'RULE_DETECTIVE', 'Long OHW Teams: TUH / OHW', 'Which foot body part ends in OE for TUH / OHW (toe)?', 'toe', 'tuh ohw', 'OE at the end.', ['toe', 'toa', 'tow', 'towe'], 'toe', 'Toe is spelled T-O-E!', 3),
          makeGame('wp-1-10', 10, 'WORD_BUILDER', 'Summit Beacon: GUH / LLL / AY / SH / ER', 'Spell GUH / LLL / AY / SH / ER (glacier) to scale the ice face!', 'glacier', 'guh lll ay sh er', 'GLA + CI + ER', ['gla', 'ci', 'er', 'or'], ['gla', 'ci', 'er'], 'Masterful! Vowel Team Glaciers charted!', 3)
        ]
      },
      {
        levelNumber: 2,
        name: 'The Bossy R Gorge',
        gradeTier: '3rd Grade R-Controlled',
        skillFocus: 'R-Controlled Vowels (AR, OR, ER, IR, UR)',
        description: 'When R follows a vowel, it bosses the vowel to make a brand new sound.',
        games: [
          makeGame('wp-2-1', 1, 'SOUND_MATCH', 'Bossy AHH / RRR Sound', 'Which word has the AHH / RRR sound of a pirate or SSS / TUH / AHH / RRR?', 'spark', 'sss puh ahh rrr kuh', 'AHH / RRR sound.', ['spark', 'spoke', 'speak', 'speck'], 'spark', 'SSS / PUH / AHH / RRR / KUH has the AHH / RRR sound!', 3),
          makeGame('wp-2-2', 2, 'WORD_BUILDER', 'Build SSS / TUH / OR / MMM', 'Spell SSS / TUH / OR / MMM (storm) with the OR sound.', 'storm', 'sss tuh or mmm', 'SSS / TUH + OR + MMM', ['st', 'or', 'm', 'ar'], ['st', 'or', 'm'], 'S-T-O-R-M spells storm!', 3),
          makeGame('wp-2-3', 3, 'RULE_DETECTIVE', 'ER, IR, and UR Sound', 'What sound do ER, IR, and UR all share in BUH / ER / DUH (bird)?', '/er/ sound', 'buh er duh', 'All three sister graphemes say ER!', ['/er/ sound', '/ar/ sound', '/or/ sound', 'long E sound'], '/er/ sound', 'ER, IR, and UR all make the same ER sound!', 3),
          makeGame('wp-2-4', 4, 'WORD_BUILDER', 'Build BUH / ER / DUH', 'Spell the feathered friend BUH / ER / DUH (bird) with IR.', 'bird', 'buh er duh', 'BUH + IR + DUH', ['b', 'ir', 'd', 'er'], ['b', 'ir', 'd'], 'B-IR-D spells bird!', 3),
          makeGame('wp-2-5', 5, 'WORD_BUILDER', 'Build TUH / ER / TUH / LLL', 'Spell TUH / ER / TUH / LLL (turtle) with UR and C-le.', 'turtle', 'tuh er tuh lll', 'TUH + UR + TUH + LLE', ['t', 'ur', 't', 'le'], ['t', 'ur', 't', 'le'], 'T-U-R-T-L-E spells turtle!', 3),
          makeGame('wp-2-6', 6, 'RHYME_RUSH', 'Rhyme with NNN / OR / THHH', 'Which word rhymes with direction NNN / OR / THHH (north)?', 'fourth', 'nnn or thhh', 'OR / THHH ending.', ['fourth', 'nerve', 'nurse', 'notch'], 'fourth', 'North and fourth rhyme in OR / THHH!', 3),
          makeGame('wp-2-7', 7, 'WORD_BUILDER', 'Build HHH / AHH / RRR / BUH / OR', 'Spell HHH / AHH / RRR / BUH / OR (harbor) with two Bossy R sounds.', 'harbor', 'hhh ahh rrr buh or', 'HHH + AR + BUH + OR', ['h', 'ar', 'b', 'or'], ['h', 'ar', 'b', 'or'], 'H-AR-B-OR has both AR and OR!', 3),
          makeGame('wp-2-8', 8, 'RULE_DETECTIVE', 'W + AR makes /wor/', 'What sound does WAR make in WUU / OR / MMM (warm)?', '/wor/', 'wuu or mmm', 'W changes AR sound to OR!', ['/wor/', '/war/', '/wer/', '/wir/'], '/wor/', 'After W, AR makes the OR sound as in warm and warn!', 4),
          makeGame('wp-2-9', 9, 'WORD_BUILDER', 'Build WUU / ER / LLL', 'Whirlwind on the peak: spell WUU / ER / LLL (whirl).', 'whirl', 'wuu er lll', 'WH + IR + LLL', ['wh', 'ir', 'l', 'er'], ['wh', 'ir', 'l'], 'WH-IR-L spells whirl!', 3),
          makeGame('wp-2-10', 10, 'WORD_BUILDER', 'Gorge Master: FFF / OR / TUH / RRR / EH / SSS', 'Spell FFF / OR / TUH / RRR / EH / SSS (fortress)!', 'fortress', 'fff or tuh rrr eh sss', 'FOR + TRESS', ['for', 'tress', 'ter', 'ful'], ['for', 'tress'], 'Epic! Bossy R Gorge conquered!', 4)
        ]
      },
      {
        levelNumber: 3,
        name: 'The Affix Alpine Bridges',
        gradeTier: '4th Grade Structural',
        skillFocus: 'Prefixes (un-, re-, dis-, mis-) & Suffixes (-ful, -less, -able, -tion)',
        description: 'Attach prefixes and suffixes to base words to craft complex meaning.',
        games: [
          makeGame('wp-3-1', 1, 'ROOT_LAB', 'Prefix UH / NNN-', 'Add the prefix meaning "not" to LLL / OH / KUH:', 'unlock', 'uh nnn lll oh kuh', 'UN + LOCK', ['un', 'lock', 're', 'dis'], ['un', 'lock'], 'Un- + lock = unlock (to open)!', 3),
          makeGame('wp-3-2', 2, 'ROOT_LAB', 'Prefix RRR / EE-', 'Add the prefix meaning "again" to BUH / IH / LLL / DUH:', 'rebuild', 'rrr ee buh ih lll duh', 'RE + BUILD', ['re', 'build', 'pre', 'mis'], ['re', 'build'], 'Re- + build = rebuild (to build again)!', 3),
          makeGame('wp-3-3', 3, 'RULE_DETECTIVE', 'Suffix -TION Sound', 'What sound does suffix -tion make in AHH / KUH / SH / UH / NNN (action)?', '/shun/', 'ahh kuh sh uh nnn', '-tion sounds like SH / UH / NNN.', ['/shun/', '/tee-on/', '/zhun/', '/chun/'], '/shun/', '-tion makes the SH / UH / NNN sound!', 3),
          makeGame('wp-3-4', 4, 'ROOT_LAB', 'Suffix -LLL / EH / SSS', 'Add suffix meaning "without" to FFF / EAR:', 'fearless', 'fff ear lll eh sss', 'FEAR + LESS', ['fear', 'less', 'ful', 'ment'], ['fear', 'less'], 'Fear + less = fearless (without fear)!', 3),
          makeGame('wp-3-5', 5, 'ROOT_LAB', 'Suffix -FFF / UH / LLL', 'Add suffix meaning "full of" to HHH / OHW / PUH:', 'hopeful', 'hhh ohw puh fff uh lll', 'HOPE + FUL', ['hope', 'ful', 'ly', 'ness'], ['hope', 'ful'], 'Hope + ful = hopeful (full of hope)!', 3),
          makeGame('wp-3-6', 6, 'RULE_DETECTIVE', 'Dropping Silent E', 'What happens to silent E in HHH / OHW / PUH when adding -IH / NNN / GUH?', 'drop the E', 'hhh ohw puh ih nnn guh', 'Drop E before a vowel suffix!', ['drop the E', 'keep the E', 'change to Y', 'double the P'], 'drop the E', 'Drop silent E before a vowel suffix: hop(e) + ing = hoping!', 3),
          makeGame('wp-3-7', 7, 'ROOT_LAB', 'Prefix DUH / IH / SSS-', 'Combine DUH / IH / SSS- + UH / GUH / RRR / EE:', 'disagree', 'duh ih sss uh guh rrr ee', 'DIS + AGREE', ['dis', 'agree', 'un', 'mis'], ['dis', 'agree'], 'Dis- + agree = disagree!', 3),
          makeGame('wp-3-8', 8, 'ROOT_LAB', 'Word Chemistry: PUH / RRR / EE / VUU / YOO', 'Build PRE- (before) + VIEW (see):', 'preview', 'puh rrr ee vuu yoo', 'PRE + VIEW', ['pre', 'view', 'post', 'sub'], ['pre', 'view'], 'Pre- + view = preview (to see beforehand)!', 3),
          makeGame('wp-3-9', 9, 'RULE_DETECTIVE', 'Changing Y to I', 'What happens when adding -ful to BUH / YOO / TUH / EE (beauty)?', 'change Y to I', 'buh yoo tuh ih fff uh lll', 'Consonant + Y changes to I before suffix!', ['change Y to I', 'drop the Y', 'keep the Y', 'double the T'], 'change Y to I', 'Change Y to I: beaut(y) + i + ful = beautiful!', 4),
          makeGame('wp-3-10', 10, 'ROOT_LAB', 'Bridge Master: UH / NNN / BUH / RRR / AY / KUH / UH / BUH / LLL', 'Combine UN + BREAK + ABLE:', 'unbreakable', 'uh nnn buh rrr ay kuh uh buh lll', 'UN + BREAK + ABLE', ['un', 'break', 'able', 'ful'], ['un', 'break', 'able'], 'Magnificent! You mastered the Affix Bridges!', 4)
        ]
      },
      {
        levelNumber: 4,
        name: 'The Syllable Division Ridge',
        gradeTier: '4th-5th Grade Decoding',
        skillFocus: 'Syllable Division Patterns: VCCV (rabbit), VCV (tiger/camel), -Cle',
        description: 'Chop longer mountain words into easily digestible phonetic syllables.',
        games: [
          makeGame('wp-4-1', 1, 'SYLLABLE_SPLIT', 'Divide RRR / AHH / BUH - BUH / IH / TUH', 'Where do you split consonants in RRR / AHH / BUH - BUH / IH / TUH (rabbit)?', 'rab - bit', 'rrr ahh buh buh ih tuh', 'Split between the two consonants (VCCV)!', ['rab - bit', 'ra - bbit', 'rabb - it', 'r - abbit'], 'rab - bit', 'VCCV rule: split between double consonants: rab-bit!', 3),
          makeGame('wp-4-2', 2, 'SYLLABLE_SPLIT', 'Divide TUH / EYE - GUH / ER', 'In TUH / EYE - GUH / ER (tiger), does the first syllable stay open?', 'ti - ger', 'tuh eye guh er', 'Open syllable: vowel says its name.', ['ti - ger', 'tig - er', 't - iger', 'tige - r'], 'ti - ger', 'VCV rule: ti-ger has an open first syllable with long I!', 3),
          makeGame('wp-4-3', 3, 'RULE_DETECTIVE', 'Open vs Closed Syllables', 'Why is "ti-" in TUH / EYE / GUH / ER long, but "cab-" in KUH / AHH / BUH / IH / NNN short?', 'ti ends in a vowel, cab ends in a consonant', 'tuh eye guh er', 'Closed syllables have a short vowel.', ['ti ends in a vowel, cab ends in a consonant', 'T is capitalized', 'R changes the sound', 'Magic E rule'], 'ti ends in a vowel, cab ends in a consonant', 'Closed syllables end in a consonant making the vowel short!', 4),
          makeGame('wp-4-4', 4, 'SYLLABLE_SPLIT', 'Divide KUH / AHH / NNN - DUH / LLL', 'Consonant + LE grabs one consonant neighbor in KUH / AHH / NNN - DUH / LLL (candle):', 'can - dle', 'kuh ahh nnn duh lll', 'Count back three: [d-l-e].', ['can - dle', 'cand - le', 'ca - ndle', 'candle'], 'can - dle', 'Consonant-le rule: count back 3 letters (-dle) and split: can-dle!', 3),
          makeGame('wp-4-5', 5, 'SYLLABLE_SPLIT', 'Divide BUH / AHH / SSS - KUH / EH / TUH', 'Where does BUH / AHH / SSS - KUH / EH / TUH (basket) split?', 'bas - ket', 'buh ahh sss kuh eh tuh', 'Split between SSS and KUH.', ['bas - ket', 'ba - sket', 'bask - et', 'b - asket'], 'bas - ket', 'VCCV: bas-ket splits right between the consonants!', 3),
          makeGame('wp-4-6', 6, 'SYLLABLE_SPLIT', 'Divide RRR / EH / PUH - TUH / EYE / LLL', 'Split RRR / EH / PUH - TUH / EYE / LLL (reptile):', 'rep - tile', 'rrr eh puh tuh eye lll', 'Closed rep + CVCe tile.', ['rep - tile', 're - ptile', 'rept - ile', 'reptil - e'], 'rep - tile', 'Rep + tile = reptile!', 3),
          makeGame('wp-4-7', 7, 'SYLLABLE_SPLIT', 'Divide PUH / UH / MMM / PUH - KUH / IH / NNN', 'Divide the autumn fruit PUH / UH / MMM / PUH - KUH / IH / NNN (pumpkin):', 'pump - kin', 'puh uh mmm puh kuh ih nnn', 'Pump + kin.', ['pump - kin', 'pum - pkin', 'p - umpkin', 'pumpk - in'], 'pump - kin', 'Pump-kin splits between PUH and KUH!', 3),
          makeGame('wp-4-8', 8, 'SYLLABLE_SPLIT', 'Divide VUU / OH / LLL - KUH / AY - NNN / OHW', 'Chop the molten peak into 3 syllables:', 'vol - ca - no', 'vuu oh lll kuh ay nnn ohw', 'Vol - ca - no.', ['vol - ca - no', 'vo - lca - no', 'volc - an - o', 'vol - cano'], 'vol - ca - no', 'Vol-ca-no has 3 syllables!', 4),
          makeGame('wp-4-9', 9, 'SYLLABLE_SPLIT', 'Divide MMM / AHH / GUH - NNN / EH / TUH - IH / KUH', 'Split MMM / AHH / GUH - NNN / EH / TUH - IH / KUH (magnetic):', 'mag - net - ic', 'mmm ahh guh nnn eh tuh ih kuh', '3 closed syllables.', ['mag - net - ic', 'ma - gne - tic', 'magn - etic', 'magn - et - ic'], 'mag - net - ic', 'Mag-net-ic splits neatly into 3 closed syllables!', 4),
          makeGame('wp-4-10', 10, 'SYLLABLE_SPLIT', 'Ridge Capstone: EH / KSS - PUH / EH - DUH / IH - SH / UH / NNN', 'Decode EH / KSS - PUH / EH - DUH / IH - SH / UH / NNN (4 syllables)!', 'ex - pe - di - tion', 'eh kss puh eh duh ih sh uh nnn', 'Ex-pe-di-tion.', ['ex - pe - di - tion', 'expe - di - tion', 'ex - pedition', 'exp - edit - ion'], 'ex - pe - di - tion', 'Triumphant! You are a master of syllable division!', 4)
        ]
      },
      {
        levelNumber: 5,
        name: 'The Eagle Monastery Summit',
        gradeTier: '5th Grade Capstone',
        skillFocus: 'Homophones, Homographs, Silent Letters & Advanced Decoding',
        description: 'Prove your phonics mastery to the High Abbot Eagle of Whispering Peaks.',
        games: [
          makeGame('wp-5-1', 1, 'RULE_DETECTIVE', 'Homophone: NNN / EYE / TUH vs NNN / EYE / TUH', 'Which word means darkness after sunset for NNN / EYE / TUH?', 'night', 'nnn eye tuh', 'No silent K.', ['night', 'knight', 'nite', 'nyte'], 'night', 'Night with N is after dark; Knight with K wears armor!', 3),
          makeGame('wp-5-2', 2, 'WORD_BUILDER', 'Spell KUH / OH / LLL / UH / MMM', 'Spell KUH / OH / LLL / UH / MMM (column) with its silent final N!', 'column', 'kuh oh lll uh mmm', 'COL + U + MN', ['col', 'u', 'mn', 'm'], ['col', 'u', 'mn'], 'C-O-L-U-M-N has a silent N!', 4),
          makeGame('wp-5-3', 3, 'RULE_DETECTIVE', 'Homophone: PUH / RRR / IH / NNN / SSS / IH / PUH / LLL', 'Which word refers to your school head ("your pal")?', 'principal', 'puh rrr ih nnn sss ih puh lll', 'The principal is your pal!', ['principal', 'principle', 'prinsepal', 'prencipal'], 'principal', 'Principal ends in -pal!', 4),
          makeGame('wp-5-4', 4, 'WORD_BUILDER', 'Spell RRR / IH / TH / UH / MMM', 'Spell the musical word RRR / IH / TH / UH / MMM (rhythm) with only Y!', 'rhythm', 'rrr ih thhh uh mmm', 'RH + Y + TH + M', ['rh', 'y', 'th', 'm'], ['rh', 'y', 'th', 'm'], 'R-H-Y-T-H-M has silent H and vowel Y!', 4),
          makeGame('wp-5-5', 5, 'RULE_DETECTIVE', 'Silent G in NNN / AHH / TUH and SSS / EYE / NNN', 'Why do words like SSS / EYE / NNN (sign) have a silent G?', 'historical etymology', 'sss eye nnn', 'From Latin signum where G was pronounced!', ['historical etymology', 'makes vowel short', 'bossy R rule', 'random typo'], 'historical etymology', 'Etymology! In Latin "signum", the G was pronounced!', 4),
          makeGame('wp-5-6', 6, 'WORD_BUILDER', 'Spell EYE / LLL / AHH / NNN / DUH', 'Spell EYE / LLL / AHH / NNN / DUH (island) with its silent S!', 'island', 'eye lll ahh nnn duh', 'IS + L + AND', ['is', 'l', 'and', 'y'], ['is', 'l', 'and'], 'I-S-L-A-N-D has a silent S!', 3),
          makeGame('wp-5-7', 7, 'RULE_DETECTIVE', 'Homographs: WUU / IH / NNN / DUH vs WUU / EYE / NNN / DUH', 'How do you tell the cold wind blew from wind the clock?', 'context clues in the sentence', 'wuu ih nnn duh', 'Spelled the same, pronounced differently based on context.', ['context clues in the sentence', 'look for an accent mark', 'capital letters', 'silent E'], 'context clues in the sentence', 'Homographs require sentence context clues!', 4),
          makeGame('wp-5-8', 8, 'WORD_BUILDER', 'Spell AW / TUH / UH / MMM', 'Spell the golden season AW / TUH / UH / MMM (autumn) with silent N:', 'autumn', 'aw tuh uh mmm', 'AU + T + U + MN', ['au', 't', 'u', 'mn'], ['au', 't', 'u', 'mn'], 'A-U-T-U-M-N has silent N!', 4),
          makeGame('wp-5-9', 9, 'RULE_DETECTIVE', 'Homophone: WUU / EH / TH / ER', 'Which spelling refers to rain, snow, and sunlight?', 'weather', 'wuu eh thhh er', 'Climatic conditions.', ['weather', 'whether', 'wether', 'wether'], 'weather', 'W-E-A-T-H-E-R is the weather outside!', 4),
          makeGame('wp-5-10', 10, 'WORD_BUILDER', 'Monastery Key: UH / SSS / EH / NNN / DUH', 'Spell UH / SSS / EH / NNN / DUH (ascend) with SC digraph!', 'ascend', 'uh sss eh nnn duh', 'A + SC + END', ['a', 'sc', 'end', 'sk'], ['a', 'sc', 'end'], 'THE EAGLE BOWS! You have unlocked Lexicon Empire!', 4)
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
          makeGame('le-1-1', 1, 'RULE_DETECTIVE', 'After C: RRR / EE / SSS / EE / VUU', 'Which spelling obeys "except after C" for RRR / EE / SSS / EE / VUU (receive)?', 'receive', 'rrr ee sss ee vuu', 'After C, use EI!', ['receive', 'recieve', 'receve', 'receiv'], 'receive', 'After C, use EI: r-e-c-e-i-v-e!', 4),
          makeGame('le-1-2', 2, 'RULE_DETECTIVE', 'Standard: BUH / IH / LLL / EE / VUU', 'Which spelling obeys "I before E" for BUH / IH / LLL / EE / VUU (believe)?', 'believe', 'buh ih lll ee vuu', 'No C before it: IE!', ['believe', 'beleive', 'believ', 'beleave'], 'believe', 'I before E: b-e-l-i-e-v-e!', 4),
          makeGame('le-1-3', 3, 'RULE_DETECTIVE', 'After C: SSS / EE / LLL / IH / NNN / GUH', 'Spell the top of the chamber: SSS / EE / LLL / IH / NNN / GUH (ceiling):', 'ceiling', 'sss ee lll ih nnn guh', 'Follows the C rule.', ['ceiling', 'cieling', 'ceeling', 'cealing'], 'ceiling', 'C-E-I-L-I-N-G follows "except after C"!', 4),
          makeGame('le-1-4', 4, 'RULE_DETECTIVE', 'Sounding like AY: NNN / AY / BUH / ER', 'Which word uses EI because it sounds like AY in NNN / AY / BUH / ER (neighbor)?', 'neighbor', 'nnn ay buh er', 'Sounds like long AY.', ['neighbor', 'nieghbor', 'naybor', 'neibor'], 'neighbor', '"Or when sounding like AY as in neighbor and weigh"!', 4),
          makeGame('le-1-5', 5, 'WORD_BUILDER', 'Spell WUU / AY', 'Spell WUU / AY (weigh) with EI and silent GH.', 'weigh', 'wuu ay', 'WUU + EI + GH', ['w', 'ei', 'gh', 'ie'], ['w', 'ei', 'gh'], 'W-E-I-G-H sounds like AY!', 4),
          makeGame('le-1-6', 6, 'RULE_DETECTIVE', 'The Exception: WUU / EAR / DUH', 'Which word is famously "weird" and breaks the rule for WUU / EAR / DUH (weird)?', 'weird', 'wuu ear duh', 'WEIRD breaks the rule with EI!', ['weird', 'wierd', 'weerd', 'ward'], 'weird', 'Weird is weird because it breaks the rule!', 4),
          makeGame('le-1-7', 7, 'RULE_DETECTIVE', 'Another Exception: SSS / EE / ZZZ', 'Which spelling is correct for SSS / EE / ZZZ (seize)?', 'seize', 'sss ee zzz', 'Famous exception: SEIZE.', ['seize', 'sieze', 'seeze', 'seaze'], 'seize', 'S-E-I-Z-E is an exception!', 4),
          makeGame('le-1-8', 8, 'WORD_BUILDER', 'Spell DUH / EE / SSS / EE / VUU', 'Spell DUH / EE / SSS / EE / VUU (deceive) with EI after C:', 'deceive', 'duh ee sss ee vuu', 'DUH + E + C + EI + VE', ['d', 'e', 'c', 'ei', 've'], ['d', 'e', 'c', 'ei', 've'], 'D-E-C-E-I-V-E follows "except after C"!', 4),
          makeGame('le-1-9', 9, 'RULE_DETECTIVE', 'Exception: AY / NNN / SH / EH / NNN / TUH', 'Why is AY / NNN / SH / EH / NNN / TUH (ancient) spelled with IE even after C?', 'it makes a /sh/ sound, not /ee/', 'ay nnn sh eh nnn tuh', 'Rule only applies when sound is long EE!', ['it makes a /sh/ sound, not /ee/', 'Greek root exception', 'silent letter', 'compound word'], 'it makes a /sh/ sound, not /ee/', 'The rule only applies when the sound is EE! In ancient, CI makes SHHH!', 5),
          makeGame('le-1-10', 10, 'WORD_BUILDER', 'Senate Decree: SSS / AH / VUU / RRR / IH / NNN', 'Spell SSS / AH / VUU / RRR / IH / NNN (sovereign) with its EIGN ending!', 'sovereign', 'sss ah vuu rrr ih nnn', 'SOV + ER + EIGN', ['sov', 'er', 'eign', 'ien'], ['sov', 'er', 'eign'], 'Supreme mastery! The Senate applauds!', 5)
        ]
      },
      {
        levelNumber: 2,
        name: 'The Colosseum of Greek Roots',
        gradeTier: '7th Grade Etymology',
        skillFocus: 'Greek Roots (PHON, TELE, BIO, CHRON, GEO, GRAPH, SCOPE)',
        description: 'Combine ancient Greek roots to decode the architecture of scientific language.',
        games: [
          makeGame('le-2-1', 1, 'ROOT_LAB', 'Root: FFF / OH / NNN (Sound)', 'What does the Greek root PHON (sound of FFF / OH / NNN) mean?', 'sound or voice', 'fff oh nnn', 'Telephone, symphony, phonics.', ['sound or voice', 'light', 'earth', 'time'], 'sound or voice', 'PHON means sound or voice (like in PHONICS)!', 4),
          makeGame('le-2-2', 2, 'ROOT_LAB', 'Build TUH / EH / LLL / EH / FFF / OHW / NNN', 'Combine TELE (distant) + PHON (sound):', 'telephone', 'tuh eh lll eh fff ohw nnn', 'TELE + PHON + E', ['tele', 'phon', 'e', 'bio'], ['tele', 'phon', 'e'], 'Tele (far) + phone (sound) = telephone!', 4),
          makeGame('le-2-3', 3, 'ROOT_LAB', 'Root: BUH / EYE / OH (Life)', 'What does BUH / EYE / OH + GUH / RRR / AHH / FFF + EE mean?', 'written story of a life', 'buh eye oh guh rrr ahh fff ee', 'Bio = life, Graph = write.', ['written story of a life', 'drawing of earth', 'study of plants', 'sound recording'], 'written story of a life', 'Bio (life) + Graph (write) = biography!', 4),
          makeGame('le-2-4', 4, 'WORD_BUILDER', 'Build KUH / RRR / OH / NNN / AH / MMM / EH / TUH / ER', 'Combine CHRON (time) + METER (measure):', 'chronometer', 'kuh rrr oh nnn ah mmm eh tuh er', 'CHRONO + METER', ['chrono', 'meter', 'graph', 'tele'], ['chrono', 'meter'], 'Chronometer = precise instrument measuring time!', 4),
          makeGame('le-2-5', 5, 'ROOT_LAB', 'Root: JUH / EE / OH (Earth)', 'What is the study of the Earths rocks and crust: JUH / EE / OH / LLL / OH / JUH / EE?', 'geology', 'juh ee oh lll oh juh ee', 'Geo (earth) + logy (study of).', ['geology', 'geometry', 'geography', 'geocentric'], 'geology', 'Geo (earth) + logy (study of) = geology!', 4),
          makeGame('le-2-6', 6, 'WORD_BUILDER', 'Build MMM / EYE / KUH / RRR / OH / SSS / KUH / OHW / PUH', 'Combine MICRO (small) + SCOPE (view):', 'microscope', 'mmm eye kuh rrr oh sss kuh ohw puh', 'MICRO + SCOPE', ['micro', 'scope', 'tele', 'graph'], ['micro', 'scope'], 'Micro (small) + scope (see) = microscope!', 4),
          makeGame('le-2-7', 7, 'ROOT_LAB', 'Root: AHH / SSS / TUH / RRR (Star)', 'What is a space explorer called: AHH / SSS / TUH / RRR / OH / NNN / AW / TUH?', 'astronaut', 'ahh sss tuh rrr oh nnn aw tuh', 'Astr (star) + naut (sailor).', ['astronaut', 'astronomer', 'astroid', 'astrology'], 'astronaut', 'Astronaut literally means "star sailor"!', 4),
          makeGame('le-2-8', 8, 'WORD_BUILDER', 'Build SSS / IH / MMM / FFF / OH / NNN / EE', 'Combine SYM (together) + PHON (sound):', 'symphony', 'sss ih mmm fff oh nnn ee', 'SYM + PHON + Y', ['sym', 'phon', 'y', 'ic'], ['sym', 'phon', 'y'], 'Sym (together) + phon (sound) = symphony!', 5),
          makeGame('le-2-9', 9, 'ROOT_LAB', 'Root: AW / TUH / OH (Self)', 'Build AUTO + GRAPH (self-written signature):', 'autograph', 'aw tuh oh guh rrr ahh fff', 'AUTO + GRAPH', ['auto', 'graph', 'bio', 'tele'], ['auto', 'graph'], 'Auto (self) + graph (write) = autograph!', 4),
          makeGame('le-2-10', 10, 'ROOT_LAB', 'Gladiator Crown: PUH / OH / LLL / EE / FFF / OH / NNN / IH / KUH', 'Combine POLY (many) + PHON (voices/sounds) + IC:', 'polyphonic', 'puh oh lll ee fff oh nnn ih kuh', 'POLY + PHON + IC', ['poly', 'phon', 'ic', 'ous'], ['poly', 'phon', 'ic'], 'Triumphant in the Colosseum! Greek Roots Mastered!', 5)
        ]
      },
      {
        levelNumber: 3,
        name: 'The Latin Stems Vault',
        gradeTier: '8th Grade Morphology',
        skillFocus: 'Latin Roots (DICT, SCRIB/SCRIPT, PORT, STRUCT, VIS/VID, TRACT)',
        description: 'Unlock imperial vaults by translating Latin stems into powerful English words.',
        games: [
          makeGame('le-3-1', 1, 'ROOT_LAB', 'Stem: DUH / IH / KUH / TUH (To Speak)', 'What does the Latin root DICT (DUH / IH / KUH / TUH) mean?', 'to speak or say', 'duh ih kuh tuh', 'Dictate, predict, verdict.', ['to speak or say', 'to write', 'to carry', 'to build'], 'to speak or say', 'DICT means to speak! (Predict = say beforehand)!', 4),
          makeGame('le-3-2', 2, 'ROOT_LAB', 'Stem: PUH / OR / TUH (To Carry)', 'Combine TRANS (across) + PORT (carry):', 'transport', 'tuh rrr ahh nnn sss puh or tuh', 'TRANS + PORT', ['trans', 'port', 'ex', 'im'], ['trans', 'port'], 'Trans (across) + port (carry) = transport!', 4),
          makeGame('le-3-3', 3, 'WORD_BUILDER', 'Build KUH / OH / NNN / SSS / TUH / RRR / UH / KUH / SH / UH / NNN', 'Combine CON + STRUCT (build) + ION:', 'construction', 'kuh oh nnn sss tuh rrr uh kuh sh uh nnn', 'CON + STRUCT + ION', ['con', 'struct', 'ion', 'or'], ['con', 'struct', 'ion'], 'Con + struct + ion = construction!', 4),
          makeGame('le-3-4', 4, 'ROOT_LAB', 'Stem: SSS / KUH / RRR / IH / PUH / TUH (To Write)', 'What is a doctor’s written order: PUH / RRR / EE / SSS / KUH / RRR / IH / PUH / SH / UH / NNN?', 'prescription', 'puh rrr ee sss kuh rrr ih puh sh uh nnn', 'Pre (before) + script (written).', ['prescription', 'description', 'inscription', 'subscription'], 'prescription', 'Pre- (before) + script (written) = prescription!', 4),
          makeGame('le-3-5', 5, 'ROOT_LAB', 'Stem: VUU / IH / ZZZ (To See)', 'What does IN- + VIS + -IBLE mean in IH / NNN / VUU / IH / ZZZ / UH / BUH / LLL?', 'cannot be seen', 'ih nnn vuu ih zzz uh buh lll', 'In (not) + vis (see) + ible (able).', ['cannot be seen', 'easily seen', 'able to speak', 'able to carry'], 'cannot be seen', 'In (not) + vis (see) + ible = cannot be seen!', 4),
          makeGame('le-3-6', 6, 'WORD_BUILDER', 'Build BUH / EH / NNN / EH / DUH / IH / KUH / SH / UH / NNN', 'Combine BENE (good) + DICT (speech) + ION:', 'benediction', 'buh eh nnn eh duh ih kuh sh uh nnn', 'BENE + DICT + ION', ['bene', 'dict', 'ion', 'or'], ['bene', 'dict', 'ion'], 'Bene (good) + dict (speech) = a blessing!', 5),
          makeGame('le-3-7', 7, 'ROOT_LAB', 'Stem: TUH / RRR / AHH / KUH / TUH (To Pull)', 'What vehicle pulls equipment: TUH / RRR / AHH / KUH / TUH / ER?', 'tractor', 'tuh rrr ahh kuh tuh er', 'Tract (pull) + or (one who).', ['tractor', 'trainer', 'tracker', 'trailer'], 'tractor', 'Tract (pull) + or = tractor!', 4),
          makeGame('le-3-8', 8, 'WORD_BUILDER', 'Build KUH / OH / NNN / TUH / RRR / UH / DUH / IH / KUH / SH / UH / NNN', 'Combine CONTRA (against) + DICT + ION:', 'contradiction', 'kuh oh nnn tuh rrr uh duh ih kuh sh uh nnn', 'CONTRA + DICT + ION', ['contra', 'dict', 'ion', 'ive'], ['contra', 'dict', 'ion'], 'Contra (against) + dict (say) = contradiction!', 5),
          makeGame('le-3-9', 9, 'ROOT_LAB', 'Stem: JUH / EH / KUH / TUH (To Throw)', 'What do you do when you throw out an offer: RRR / EE / JUH / EH / KUH / TUH?', 'reject', 'rrr ee juh eh kuh tuh', 'Re (back) + ject (throw).', ['reject', 'inject', 'project', 'object'], 'reject', 'Re- (back) + ject (throw) = reject!', 4),
          makeGame('le-3-10', 10, 'ROOT_LAB', 'Vault Keystone: IH / NNN / SSS / KUH / RRR / EYE / BUH', 'Carve IN + SCRIBE (write into stone):', 'inscribe', 'ih nnn sss kuh rrr eye buh', 'IN + SCRIBE', ['in', 'scribe', 'de', 'sub'], ['in', 'scribe'], 'Magnificent! The Latin Vault swings wide open!', 5)
        ]
      },
      {
        levelNumber: 4,
        name: 'The Amphitheater of Morphology',
        gradeTier: '8th-9th Grade Advanced',
        skillFocus: 'Assimilation of Prefixes (IN -> IM/IL/IR), Double Consonants, & Etymology',
        description: 'Discover how chameleon prefixes shift their spelling to match consonant neighbors.',
        games: [
          makeGame('le-4-1', 1, 'RULE_DETECTIVE', 'Chameleon Prefix: IN- before P', 'Why is IH / MMM / PUH / OH / SSS / UH / BUH / LLL spelled with IM-?', 'N changes to M before P, B, and M for mouth ease', 'ih mmm puh oh sss uh buh lll', 'Try saying "in-possible" quickly!', ['N changes to M before P, B, and M for mouth ease', 'it is Greek', 'vowel team rule', 'random English quirk'], 'N changes to M before P, B, and M for mouth ease', 'Assimilation! Your lips close for PUH, making MMM much easier to pronounce!', 5),
          makeGame('le-4-2', 2, 'WORD_BUILDER', 'Build IH / RRR / EH / SSS / PUH / OH / NNN / SSS / UH / BUH / LLL', 'Combine IR- (not) + RESPONSIBLE:', 'irresponsible', 'ih rrr eh sss puh oh nnn sss uh buh lll', 'IR + RESPONSIBLE', ['ir', 'responsible', 'in', 'im'], ['ir', 'responsible'], 'In- assimilates to Ir- before R: irresponsible!', 5),
          makeGame('le-4-3', 3, 'RULE_DETECTIVE', 'Chameleon Prefix: IN- before L', 'Which spelling means "not legal" for IH / LLL / EE / GUH / UH / LLL?', 'illegal', 'ih lll ee guh uh lll', 'In- becomes Il- before L.', ['illegal', 'inlegal', 'imlegal', 'irlegal'], 'illegal', 'In- assimilates to Il- before L: illegal!', 4),
          makeGame('le-4-4', 4, 'WORD_BUILDER', 'Build SSS / IH / MMM / EH / TUH / RRR / EE', 'SYN- assimilates to SYM- before M in symmetry:', 'symmetry', 'sss ih mmm eh tuh rrr ee', 'SYM + METRY', ['sym', 'metry', 'syn', 'sim'], ['sym', 'metry'], 'Syn- + metry becomes symmetry!', 5),
          makeGame('le-4-5', 5, 'RULE_DETECTIVE', 'Double Consonant in UH / KUH / UH / MMM / PUH / UH / NNN / EE', 'Why does accompany have a double C?', 'AD- assimilated to AC- before C', 'uh kuh uh mmm puh uh nnn ee', 'Ad- + company became ac-company.', ['AD- assimilated to AC- before C', 'floss rule', 'short vowel rule', 'magic E'], 'AD- assimilated to AC- before C', 'The Latin prefix AD- assimilated into AC- before company!', 5),
          makeGame('le-4-6', 6, 'WORD_BUILDER', 'Build SSS / UH / BUH / TUH / EH / RRR / AY / NNN / EE / UH / NNN', 'SUB (under) + TERRA (earth) + NEAN:', 'subterranean', 'sss uh buh tuh eh rrr ay nnn ee uh nnn', 'SUB + TERRA + NEAN', ['sub', 'terra', 'nean', 'ous'], ['sub', 'terra', 'nean'], 'Sub (under) + terra (earth) = subterranean!', 5),
          makeGame('le-4-7', 7, 'RULE_DETECTIVE', 'Suffix -ABLE vs -IBLE', 'Which word correctly uses Latin -IBLE in EH / DUH / IH / BUH / LLL?', 'edible', 'eh duh ih buh lll', 'From Latin edere (to eat).', ['edible', 'edable', 'visable', 'audable'], 'edible', 'Edible uses -ible from Latin root!', 5),
          makeGame('le-4-8', 8, 'WORD_BUILDER', 'Build UH / NNN / AHH / KUH / RRR / OH / NNN / IH / ZZZ / UH / MMM', 'ANA (back) + CHRON (time) + ISM:', 'anachronism', 'uh nnn ahh kuh rrr oh nnn ih zzz uh mmm', 'ANA + CHRON + ISM', ['ana', 'chron', 'ism', 'ic'], ['ana', 'chron', 'ism'], 'Anachronism: something belonging to another time!', 5),
          makeGame('le-4-9', 9, 'RULE_DETECTIVE', 'Etymology of AHH / LLL / FFF / UH / BUH / EH / TUH', 'Where does the word "alphabet" come from?', 'Alpha and Beta, the first two Greek letters', 'ahh lll fff uh buh eh tuh', 'Alpha + Beta.', ['Alpha and Beta, the first two Greek letters', 'Latin for reading', 'King Alfred', 'Phoenician boat'], 'Alpha and Beta, the first two Greek letters', 'From Alpha + Beta, the first two letters of the Greek alphabet!', 5),
          makeGame('le-4-10', 10, 'WORD_BUILDER', 'Colosseum Triumph: KUH / RRR / OH / NNN / UH / LLL / AH / JUH / IH / KUH / LLL', 'Build CHRONO + LOGICAL (arranged in order of time):', 'chronological', 'kuh rrr oh nnn uh lll ah juh ih kuh lll', 'CHRONO + LOGICAL', ['chrono', 'logical', 'bio', 'tele'], ['chrono', 'logical'], 'Sensational! You conquered the Amphitheater of Morphology!', 5)
        ]
      },
      {
        levelNumber: 5,
        name: 'The Golden Phoenix Scepter',
        gradeTier: 'High School & Lifelong Mastery',
        skillFocus: 'Master Polysyllabic Etymology & Phonics Pinnacle',
        description: 'Prove the ultimate mastery of the English language to reign as High Scholar of Phonixia.',
        games: [
          makeGame('le-5-1', 1, 'RULE_DETECTIVE', 'Root of FFF / IH / LLL / AH / SSS / OH / FFF / EE', 'What does philosophy literally mean in Greek?', 'love of wisdom', 'fff ih lll ah sss oh fff ee', 'Philo (love) + sophia (wisdom).', ['love of wisdom', 'study of plants', 'law of kings', 'speech of gods'], 'love of wisdom', 'Philo (love) + Sophia (wisdom) = love of wisdom!', 5),
          makeGame('le-5-2', 2, 'WORD_BUILDER', 'Spell AH / MMM / NNN / IH / SH / EH / NNN / TUH', 'OMNI (all) + SCI (know) + ENT in omniscient:', 'omniscient', 'ah mmm nnn ih sh eh nnn tuh', 'OMNI + SCI + ENT', ['omni', 'sci', 'ent', 'ant'], ['omni', 'sci', 'ent'], 'Omni (all) + sci (knowing) = omniscient!', 5),
          makeGame('le-5-3', 3, 'RULE_DETECTIVE', 'Silent Letters in NNN / OO / MMM / OHW / NNN / YUH', 'Which language gave English silent initial PN in pneumonia?', 'Ancient Greek', 'nnn oo mmm ohw nnn yuh', 'Greek pronounced both letters; English dropped the first.', ['Ancient Greek', 'Latin', 'Old Norse', 'French'], 'Ancient Greek', 'Ancient Greek! English kept the spelling but silences the first consonant!', 5),
          makeGame('le-5-4', 4, 'WORD_BUILDER', 'Spell MMM / EH / TUH / MMM / OR / FFF / OH / SSS / IH / SSS', 'META (change) + MORPH (form) + OSIS (process):', 'metamorphosis', 'mmm eh tuh mmm or fff oh sss ih sss', 'META + MORPH + OSIS', ['meta', 'morph', 'osis', 'ism'], ['meta', 'morph', 'osis'], 'Meta (change) + morph (shape) = metamorphosis!', 5),
          makeGame('le-5-5', 5, 'RULE_DETECTIVE', 'The Schwa Sound (UH)', 'What is the most common lazy neutral UH vowel sound called in English?', 'the schwa', 'shhh wuu ahh', 'The lazy neutral "uh" sound.', ['the schwa', 'the long vowel', 'the diphthong', 'the digraph'], 'the schwa', 'The schwa (ə)! It sounds like UH in banana, about, and pencil!', 5),
          makeGame('le-5-6', 6, 'WORD_BUILDER', 'Spell MMM / IH / SSS / CHUH / IH / VUU / UH / SSS', 'Watch the spelling of mischievous (3 syllables, not 4!):', 'mischievous', 'mmm ih sss chuh ih vuu uh sss', 'MIS + CHIEV + OUS', ['mis', 'chiev', 'ous', 'ious'], ['mis', 'chiev', 'ous'], 'M-I-S-C-H-I-E-V-O-U-S (no extra "i" after v)!', 5),
          makeGame('le-5-7', 7, 'RULE_DETECTIVE', 'Root: BUH / EH / NNN / EE vs MMM / AHH / LLL', 'What is the antonym of benefactor (one who does evil)?', 'malefactor', 'mmm ahh lll eh fff ahh kuh tuh er', 'Bene = good, Male = bad.', ['malefactor', 'beneficiary', 'spectator', 'dictator'], 'malefactor', 'Male- means evil or bad, opposite of Bene-!', 5),
          makeGame('le-5-8', 8, 'WORD_BUILDER', 'Spell JUH / UH / KSS / TUH / UH / PUH / OH / ZZZ / IH / SH / UH / NNN', 'JUXTA (next to) + POSITION:', 'juxtaposition', 'juh uh kss tuh uh puh oh zzz ih sh uh nnn', 'JUXTA + POSITION', ['juxta', 'position', 'side', 'post'], ['juxta', 'position'], 'Juxta (beside) + position = placing side-by-side!', 5),
          makeGame('le-5-9', 9, 'RULE_DETECTIVE', 'The Origin of FFF / OH / NNN / IH / KSS', 'What root gave birth to our magical world of Phonixia?', 'Greek phone meaning sound', 'fff oh nnn ih kss', 'Phon = sound / voice.', ['Greek phone meaning sound', 'Latin phoenix meaning fire', 'French reading', 'Old English stone'], 'Greek phone meaning sound', 'The Greek root "phone", meaning sound and voice!', 5),
          makeGame('le-5-10', 10, 'WORD_BUILDER', 'Imperial Phoenix Seal: FFF / OH / NNN / IH / KSS / EE / UH', 'Spell the legendary name: FFF / OH / NNN / IH / KSS / EE / UH (Phonixia)!', 'phonixia', 'fff oh nnn ih kss ee uh', 'PHON + IX + IA', ['phon', 'ix', 'ia', 'ex'], ['phon', 'ix', 'ia'], 'ALL HAIL THE HIGH SCHOLAR OF PHONIXIA! YOU HAVE MASTERED ALL FIVE LANDS!', 5)
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