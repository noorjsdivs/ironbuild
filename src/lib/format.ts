export const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

/** "1 item" / "3 items"; pass `plural` for irregular words ("story" → "stories"). */
export const cnt = (n: number, word: string, plural = `${word}s`) => `${n} ${n === 1 ? word : plural}`;

export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((x) => x[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

export function greeting(date = new Date()) {
  const h = date.getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

export const shortDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const longDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

export const clock = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isEmail = (v: string) => EMAIL_RE.test(v.trim());
