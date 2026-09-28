import { MinigameDefinition } from '../data/minigamesCurriculum';

export interface MinigameVisualTheme {
  toolIcon: string;
  toolName: string;
  actionLabel: string;
  actionEffectText: string;
  actionEffectIcon: string;
  mechanicCategory: 'claw' | 'slingshot' | 'dive' | 'catch' | 'drum' | 'sonar' | 'conveyor' | 'whack' | 'laser' | 'tiki' | 'rowboat' | 'vault';
  soundType: 'claw' | 'slingshot' | 'splash' | 'catch' | 'drum' | 'laser' | 'whack' | 'collect';
}

export function getMinigameVisuals(game: MinigameDefinition): MinigameVisualTheme {
  const name = game.name.toLowerCase();
  const id = game.id;
  const num = game.gameNum;

  // 1. CLAW CRANE GAMES (Games 28, 44, or any crane/claw games)
  if (name.includes('claw') || name.includes('crane')) {
    return {
      toolIcon: '🦾',
      toolName: 'Pneumatic Crane Claw Gantry',
      actionLabel: '🦾 DROP CLAW (SPACE)',
      actionEffectText: 'CLAW GRABBED!',
      actionEffectIcon: '🦾🪝',
      mechanicCategory: 'claw',
      soundType: 'claw'
    };
  }

  // 2. SLINGSHOT & CANNON GAMES
  if (name.includes('slingshot') || name.includes('cannon') || name.includes('plunge') || name.includes('air drop')) {
    const isCoconut = name.includes('coconut');
    const isDepth = name.includes('depth');
    return {
      toolIcon: isCoconut ? '🥥' : isDepth ? '💣' : '🏹',
      toolName: isCoconut ? 'Bamboo Coconut Slingshot' : isDepth ? 'Depth Charge Torpedo' : 'Precision Slingshot',
      actionLabel: isCoconut ? '🥥 LAUNCH COCONUT (SPACE)' : isDepth ? '💣 FIRE DEPTH CHARGE (SPACE)' : '🏹 SLINGSHOT (SPACE)',
      actionEffectText: isCoconut ? 'COCONUT HIT!' : isDepth ? 'TORPEDO BLAST!' : 'DIRECT SLING!',
      actionEffectIcon: isCoconut ? '💥🥥' : isDepth ? '💣💥' : '🎯✨',
      mechanicCategory: 'slingshot',
      soundType: 'slingshot'
    };
  }

  // 3. PEARL DIVE & UNDERWATER BUBBLE POP
  if (name.includes('dive') || name.includes('pearl') || name.includes('bubble')) {
    return {
      toolIcon: '🤿',
      toolName: 'Diving Mask & Aqua Wand',
      actionLabel: '🫧 DIVE & POP (SPACE)',
      actionEffectText: 'BUBBLE POPPED!',
      actionEffectIcon: '🫧✨',
      mechanicCategory: 'dive',
      soundType: 'splash'
    };
  }

  // 4. BASKET CATCH & NET SWEEP
  if (name.includes('catch') || name.includes('basket') || name.includes('net')) {
    const isNet = name.includes('net');
    return {
      toolIcon: isNet ? '🕸️' : '🧺',
      toolName: isNet ? 'Silk Capture Net' : 'Woven Bamboo Basket',
      actionLabel: isNet ? '🕸️ SWIPE NET (SPACE)' : '🧺 CATCH IN BASKET (SPACE)',
      actionEffectText: isNet ? 'NET CAPTURED!' : 'BASKET CAUGHT!',
      actionEffectIcon: isNet ? '🕸️🌟' : '🧺✨',
      mechanicCategory: 'catch',
      soundType: 'catch'
    };
  }

  // 5. DRUMS & RHYTHM
  if (name.includes('drum') || name.includes('beat')) {
    return {
      toolIcon: '🥁',
      toolName: 'Carved Bamboo Drumsticks',
      actionLabel: '🥁 STRIKE BEAT (SPACE)',
      actionEffectText: 'RHYTHM BEAT!',
      actionEffectIcon: '🥁🎶',
      mechanicCategory: 'drum',
      soundType: 'drum'
    };
  }

  // 6. SONAR & RADAR
  if (name.includes('sonar') || name.includes('radar') || name.includes('beacon') || name.includes('submarine')) {
    return {
      toolIcon: '📡',
      toolName: 'Acoustic Sonar Dish',
      actionLabel: '📡 EMIT SONAR PING (SPACE)',
      actionEffectText: 'SONAR LOCKED!',
      actionEffectIcon: '📡⚡',
      mechanicCategory: 'sonar',
      soundType: 'laser'
    };
  }

  // 7. CONVEYOR & ROUTING
  if (name.includes('conveyor') || name.includes('sorter') || name.includes('matrix') || name.includes('winch')) {
    return {
      toolIcon: '⚙️',
      toolName: 'Sorting Switch Lever',
      actionLabel: '⚙️ ROUTE CARGO (SPACE)',
      actionEffectText: 'CARGO ROUTED!',
      actionEffectIcon: '⚙️✨',
      mechanicCategory: 'conveyor',
      soundType: 'collect'
    };
  }

  // 8. ROWBOAT & RAFT
  if (name.includes('rowboat') || name.includes('raft') || name.includes('boat')) {
    return {
      toolIcon: '🚣',
      toolName: 'Carved Wooden Oars',
      actionLabel: '🚣 ROW FORWARD (SPACE)',
      actionEffectText: 'COURSE REACHED!',
      actionEffectIcon: '🚣🌊',
      mechanicCategory: 'rowboat',
      soundType: 'splash'
    };
  }

  // 9. LASER / BLAST / PHASER
  if (name.includes('laser') || name.includes('blaster') || name.includes('plasma') || name.includes('pulse') || name.includes('tentacle')) {
    return {
      toolIcon: '⚡',
      toolName: 'Neon Pulse Phaser',
      actionLabel: '⚡ ARCADE BLAST (SPACE)',
      actionEffectText: 'LASER ZAP!',
      actionEffectIcon: '⚡💥',
      mechanicCategory: 'laser',
      soundType: 'laser'
    };
  }

  // 10. TIKI / BELL / CHIME / TOTEM
  if (name.includes('tiki') || name.includes('chime') || name.includes('totem') || name.includes('wheel')) {
    return {
      toolIcon: '🗿',
      toolName: 'Ceremonial Tiki Striker',
      actionLabel: '🗿 RING CHIME (SPACE)',
      actionEffectText: 'CHIME RUNG!',
      actionEffectIcon: '🔔✨',
      mechanicCategory: 'tiki',
      soundType: 'collect'
    };
  }

  // 11. VAULT & DECRYPTER
  if (name.includes('vault') || name.includes('decrypter')) {
    return {
      toolIcon: '🔐',
      toolName: 'Quantum Cypher Keypad',
      actionLabel: '🔐 DECRYPT (SPACE)',
      actionEffectText: 'CODE CRACKED!',
      actionEffectIcon: '🔐✨',
      mechanicCategory: 'vault',
      soundType: 'collect'
    };
  }

  // 12. WHACK (Hermit Crab, Cyber Shark, Whack-a-droid, Mole)
  if (game.mechanicType === 'whack' || name.includes('whack')) {
    const isDroid = name.includes('droid') || name.includes('shark');
    return {
      toolIcon: isDroid ? '⚡' : '🪵',
      toolName: isDroid ? 'EMP Power Mallet' : 'Beach Wooden Mallet',
      actionLabel: '🔨 TAP TARGET (SPACE)',
      actionEffectText: 'BOPPED!',
      actionEffectIcon: isDroid ? '⚡💥' : '🪵✨',
      mechanicCategory: 'whack',
      soundType: 'whack'
    };
  }

  // Default Fallback
  return {
    toolIcon: '✨',
    toolName: 'Magic Reading Wand',
    actionLabel: '✨ SELECT (SPACE)',
    actionEffectText: 'MATCHED!',
    actionEffectIcon: '✨💎',
    mechanicCategory: 'laser',
    soundType: 'collect'
  };
}
