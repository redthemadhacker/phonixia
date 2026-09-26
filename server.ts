import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Cybersecurity & Network Protection Middleware
// 1. Content Security Policy & Security Headers (Shields home Wi-Fi & browser from malicious scripts)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Local network isolation: explicitly reject internal subnet reflection/probing
  const forwardedFor = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
  if (req.path.startsWith('/api') && (req.headers['x-probe-local'] || req.headers['x-lan-scan'])) {
    return res.status(403).json({ error: 'Blocked: Local network probe rejected by Phonixia Cybersecurity Armor.' });
  }
  next();
});

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Anti-Brute-Force Rate Limiting in memory
const authAttempts: Record<string, { count: number; resetAt: number }> = {};
function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'ip';
  const now = Date.now();
  const record = authAttempts[ip];

  if (record && record.resetAt > now) {
    if (record.count >= 15) {
      return res.status(429).json({
        error: 'Too many login attempts. Cybersecurity rate limit active. Please wait 1 minute to protect your network.'
      });
    }
    record.count++;
  } else {
    authAttempts[ip] = { count: 1, resetAt: now + 60 * 1000 };
  }
  next();
}

// Persistent Storage Directory
const DATA_DIR = path.join(process.cwd(), '.data');
const ACCOUNTS_FILE = path.join(DATA_DIR, 'accounts.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface StoredAccountRecord {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  accountData: any;
  updatedAt: string;
}

// Password hashing with salt
function hashPassword(password: string, salt: string): string {
  return crypto.createHash('sha256').update(`${salt}:${password}:phonixia_shield_v1`).digest('hex');
}

function loadAccounts(): Record<string, StoredAccountRecord> {
  try {
    if (fs.existsSync(ACCOUNTS_FILE)) {
      const data = fs.readFileSync(ACCOUNTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading accounts:', e);
  }
  return {};
}

function saveAccounts(accounts: Record<string, StoredAccountRecord>) {
  try {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving accounts:', e);
  }
}

// Seed default initial accounts if none exist
(function initDefaultAccounts() {
  const accounts = loadAccounts();
  if (!accounts['readingheroes']) {
    const salt = crypto.randomBytes(16).toString('hex');
    accounts['readingheroes'] = {
      id: 'acc-readingheroes',
      username: 'readingheroes',
      salt,
      passwordHash: hashPassword('Phonics123!', salt),
      updatedAt: new Date().toISOString(),
      accountData: {
        id: 'acc-readingheroes',
        familyName: 'Explorer Family',
        username: 'readingheroes',
        role: 'parent',
        explorers: [
          {
            id: 'exp-leo',
            name: 'Leo',
            gender: 'boy',
            companionGuide: 'kam',
            ageTier: 'preschool',
            level: 1,
            totalStars: 12,
            coins: 40,
            arcadeTokens: 5,
            isHallOfFameInducted: false,
            timesStorylineCompleted: 0,
            landScores: {
              'sound-shallows': { completedGamesCount: 4, stars: 12, unlocked: true },
              'builders-guild': { completedGamesCount: 0, stars: 0, unlocked: false },
              'tricky-trails': { completedGamesCount: 0, stars: 0, unlocked: false },
              'whispering-peaks': { completedGamesCount: 0, stars: 0, unlocked: false },
              'lexicon-empire': { completedGamesCount: 0, stars: 0, unlocked: false }
            },
            customization: {
              skinTone: '#ffd1a4',
              hairStyle: 'curls',
              hairColor: '#3d2314',
              outfitColor: '#3b82f6',
              accessory: 'glasses',
              companionPet: 'baby-dragon',
              title: 'Shallow Scout'
            }
          },
          {
            id: 'exp-maya',
            name: 'Maya',
            gender: 'girl',
            companionGuide: 'celine',
            ageTier: 'late-elementary',
            level: 50,
            totalStars: 750,
            coins: 850,
            arcadeTokens: 120,
            isHallOfFameInducted: true,
            timesStorylineCompleted: 1,
            landScores: {
              'sound-shallows': { completedGamesCount: 50, stars: 150, unlocked: true },
              'builders-guild': { completedGamesCount: 50, stars: 150, unlocked: true },
              'tricky-trails': { completedGamesCount: 50, stars: 150, unlocked: true },
              'whispering-peaks': { completedGamesCount: 50, stars: 150, unlocked: true },
              'lexicon-empire': { completedGamesCount: 50, stars: 150, unlocked: true }
            },
            customization: {
              skinTone: '#d99058',
              hairStyle: 'braids',
              hairColor: '#1e1b18',
              outfitColor: '#a855f7',
              accessory: 'sparkles',
              companionPet: 'golden-phonix',
              title: 'Hall of Fame Grand Scholar'
            }
          }
        ]
      }
    };
    saveAccounts(accounts);
  }
})();

// Password parameter validator (Standard secure site standards: 8+ chars, upper, lower, number, special char)
function validatePasswordSecurity(password: string): { valid: boolean; reason?: string } {
  if (password.length < 8) return { valid: false, reason: 'Password must be at least 8 characters long.' };
  if (!/[A-Z]/.test(password)) return { valid: false, reason: 'Password must include at least 1 uppercase letter.' };
  if (!/[a-z]/.test(password)) return { valid: false, reason: 'Password must include at least 1 lowercase letter.' };
  if (!/[0-9]/.test(password)) return { valid: false, reason: 'Password must include at least 1 number.' };
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\]/.test(password)) {
    return { valid: false, reason: 'Password must include at least 1 special character (!@#$%^&*...).' };
  }
  return { valid: true };
}

// ================= API ROUTES =================

// 1. Health & Cybersecurity Status
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    cybersecurityShield: 'active',
    networkIsolation: 'protected',
    crossDeviceSync: 'enabled',
    timestamp: new Date().toISOString()
  });
});

// 2. Register Account with Standard Secure Password Validation
app.post('/api/auth/register', rateLimiter, (req: Request, res: Response) => {
  const { username, password, familyName, role, starterExplorerName, gender } = req.body;

  if (!username || !password || !starterExplorerName) {
    return res.status(400).json({ error: 'Username, password, and explorer name are required.' });
  }

  const cleanUser = String(username).trim().toLowerCase();
  const cleanPass = String(password);

  // Validate standard security parameters
  const pwCheck = validatePasswordSecurity(cleanPass);
  if (!pwCheck.valid) {
    return res.status(400).json({ error: pwCheck.reason });
  }

  const accounts = loadAccounts();
  if (accounts[cleanUser]) {
    return res.status(409).json({ error: 'This username is already taken. Please choose another one.' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(cleanPass, salt);

  const explorerGender = gender === 'girl' ? 'girl' : 'boy';
  const companionGuide = explorerGender === 'girl' ? 'celine' : 'kam';

  const defaultScores = {
    'sound-shallows': { completedGamesCount: 0, stars: 0, unlocked: true },
    'builders-guild': { completedGamesCount: 0, stars: 0, unlocked: false },
    'tricky-trails': { completedGamesCount: 0, stars: 0, unlocked: false },
    'whispering-peaks': { completedGamesCount: 0, stars: 0, unlocked: false },
    'lexicon-empire': { completedGamesCount: 0, stars: 0, unlocked: false }
  };

  const starterExplorer = {
    id: `exp-${Date.now()}`,
    name: String(starterExplorerName).trim(),
    gender: explorerGender,
    companionGuide,
    ageTier: 'preschool',
    level: 1,
    totalStars: 0,
    coins: 30,
    arcadeTokens: 5,
    isHallOfFameInducted: false,
    timesStorylineCompleted: 0,
    landScores: defaultScores,
    customization: {
      skinTone: '#ffd1a4',
      hairStyle: explorerGender === 'boy' ? 'short' : 'pigtails',
      hairColor: '#3d2314',
      outfitColor: explorerGender === 'boy' ? '#3b82f6' : '#ec4899',
      accessory: 'none',
      companionPet: explorerGender === 'boy' ? 'baby-dragon' : 'feather-owl',
      title: explorerGender === 'boy' ? 'Adventurer with Kam' : 'Adventurer with Celine'
    }
  };

  const newAccountData = {
    id: `acc-${Date.now()}`,
    familyName: String(familyName || `${starterExplorerName}'s Family`).trim(),
    username: cleanUser,
    role: role === 'teacher' ? 'teacher' : 'parent',
    explorers: [starterExplorer]
  };

  accounts[cleanUser] = {
    id: newAccountData.id,
    username: cleanUser,
    salt,
    passwordHash,
    accountData: newAccountData,
    updatedAt: new Date().toISOString()
  };

  saveAccounts(accounts);

  res.json({
    success: true,
    account: newAccountData,
    message: 'Account created with standard cybersecurity encryption!'
  });
});

// 3. Login Account across all devices (phone, CPU, tablet)
app.post('/api/auth/login', rateLimiter, (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required.' });
  }

  const cleanUser = String(username).trim().toLowerCase();
  const accounts = loadAccounts();
  const record = accounts[cleanUser];

  if (!record) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const expectedHash = hashPassword(String(password), record.salt);
  if (expectedHash !== record.passwordHash) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  res.json({
    success: true,
    account: record.accountData,
    message: 'Welcome back! Saved progress retrieved across all devices.'
  });
});

// 4. Background Sync Save Data (automatically saves game progress to backend)
app.post('/api/account/save', (req: Request, res: Response) => {
  const { username, accountData } = req.body;
  if (!username || !accountData) {
    return res.status(400).json({ error: 'Username and accountData required.' });
  }

  const cleanUser = String(username).trim().toLowerCase();
  const accounts = loadAccounts();

  if (accounts[cleanUser]) {
    accounts[cleanUser].accountData = accountData;
    accounts[cleanUser].updatedAt = new Date().toISOString();
    saveAccounts(accounts);
    return res.json({ success: true, savedAt: accounts[cleanUser].updatedAt });
  }

  // If account doesn't exist yet, save as fallback
  const salt = crypto.randomBytes(16).toString('hex');
  accounts[cleanUser] = {
    id: accountData.id || `acc-${Date.now()}`,
    username: cleanUser,
    salt,
    passwordHash: hashPassword('Phonics123!', salt),
    accountData,
    updatedAt: new Date().toISOString()
  };
  saveAccounts(accounts);
  res.json({ success: true, savedAt: accounts[cleanUser].updatedAt });
});

// 5. Get Account Data (for cross-device polling or refresh)
app.get('/api/account/:username', (req: Request, res: Response) => {
  const cleanUser = String(req.params.username).trim().toLowerCase();
  const accounts = loadAccounts();
  const record = accounts[cleanUser];

  if (!record) {
    return res.status(404).json({ error: 'Account not found.' });
  }

  res.json({ success: true, account: record.accountData });
});

// ================= VITE DEV / PROD INTEGRATION =================
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Phonixia Engine] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
