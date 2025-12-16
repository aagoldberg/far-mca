/**
 * Simple identity verification - cross-references names/emails across connected platforms
 */

export interface IdentitySource {
  platform: string;
  name: string | null;
  email: string | null;
}

export interface VerificationResult {
  confidence: number; // 0-100
  nameMatch: 'match' | 'partial' | 'mismatch' | 'insufficient';
  emailMatch: 'match' | 'mismatch' | 'insufficient';
  flags: string[];
  sourcesChecked: string[];
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .trim()
    .split(/\s+/)
    .sort()
    .join(' ');
}

function compareNames(names: string[]): 'match' | 'partial' | 'mismatch' {
  if (names.length < 2) return 'match';

  const normalized = names.map(normalizeName);
  const first = normalized[0];

  for (let i = 1; i < normalized.length; i++) {
    if (normalized[i] === first) continue;

    // Check word overlap
    const words1 = new Set(first.split(' '));
    const words2 = new Set(normalized[i].split(' '));
    const overlap = [...words1].filter(w => words2.has(w)).length;

    if (overlap === 0) return 'mismatch';
    if (overlap < Math.min(words1.size, words2.size)) return 'partial';
  }

  return 'match';
}

export function verifyIdentity(sources: IdentitySource[]): VerificationResult {
  const flags: string[] = [];
  const names = sources.filter(s => s.name).map(s => s.name!);
  const emails = sources.filter(s => s.email).map(s => s.email!.toLowerCase());

  // Name check
  let nameMatch: VerificationResult['nameMatch'] = 'insufficient';
  if (names.length >= 2) {
    nameMatch = compareNames(names);
    if (nameMatch === 'mismatch') flags.push('name_mismatch');
    if (nameMatch === 'partial') flags.push('name_variation');
  }

  // Email check
  let emailMatch: VerificationResult['emailMatch'] = 'insufficient';
  if (emails.length >= 2) {
    const unique = [...new Set(emails)];
    emailMatch = unique.length === 1 ? 'match' : 'mismatch';
    if (emailMatch === 'mismatch') flags.push('email_mismatch');
  }

  // Confidence score
  let confidence = 50;
  if (nameMatch === 'match') confidence += 25;
  else if (nameMatch === 'partial') confidence += 10;
  else if (nameMatch === 'mismatch') confidence -= 20;

  if (emailMatch === 'match') confidence += 25;
  else if (emailMatch === 'mismatch') confidence -= 15;

  confidence = Math.max(0, Math.min(100, confidence));

  return {
    confidence,
    nameMatch,
    emailMatch,
    flags,
    sourcesChecked: sources.map(s => s.platform),
  };
}
