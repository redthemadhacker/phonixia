// Cybersecurity and Password Protection Suite for Phonixia
// Ensures family home Wi-Fi and account safety against intrusions, brute force, and injection

export interface PasswordRequirement {
  id: string;
  label: string;
  test: (pw: string) => boolean;
}

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    id: 'length',
    label: 'At least 8 characters long',
    test: (pw: string) => pw.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'At least 1 uppercase letter (A-Z)',
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    id: 'lowercase',
    label: 'At least 1 lowercase letter (a-z)',
    test: (pw: string) => /[a-z]/.test(pw),
  },
  {
    id: 'number',
    label: 'At least 1 number (0-9)',
    test: (pw: string) => /[0-9]/.test(pw),
  },
  {
    id: 'special',
    label: 'At least 1 special character (!@#$%^&*...)',
    test: (pw: string) => /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\]/.test(pw),
  },
];

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0 to 5
  checks: { id: string; label: string; passed: boolean }[];
  errorMessage: string | null;
}

export function validatePassword(password: string): PasswordValidationResult {
  const checks = PASSWORD_REQUIREMENTS.map((req) => ({
    id: req.id,
    label: req.label,
    passed: req.test(password),
  }));

  const passedCount = checks.filter((c) => c.passed).length;
  const isValid = passedCount === PASSWORD_REQUIREMENTS.length;

  let errorMessage: string | null = null;
  if (!isValid) {
    const missing = checks.filter((c) => !c.passed).map((c) => c.label);
    errorMessage = `Password must meet standard security parameters: ${missing.join(', ')}.`;
  }

  return {
    isValid,
    score: passedCount,
    checks,
    errorMessage,
  };
}

// Client-side sanitization to prevent XSS and malicious payloads
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // strip HTML brackets
    .slice(0, 100); // cap length
}

// Simple deterministic hash for password verification
export async function hashPasswordClient(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}:phonixia_shield_v1`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
