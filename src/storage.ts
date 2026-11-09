export type Language = 'ar' | 'en';

export type SaveData = {
  completed: number[];
  unlocked: number;
  lastLevel: number;
  language: Language;
  lastCompletedAt?: string;
};

const STORAGE_KEY = 'naseej-save-v1';
const defaults: SaveData = { completed: [], unlocked: 1, lastLevel: 1, language: 'ar' };

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaults };
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    const completed = Array.isArray(parsed.completed)
      ? [...new Set(parsed.completed.filter((value): value is number => Number.isInteger(value) && value >= 1 && value <= 30))].sort((a, b) => a - b)
      : [];
    const unlocked = Math.max(1, Math.min(30, Number.isInteger(parsed.unlocked) ? Number(parsed.unlocked) : 1));
    const lastLevel = Math.max(1, Math.min(30, Number.isInteger(parsed.lastLevel) ? Number(parsed.lastLevel) : 1));
    const language: Language = parsed.language === 'en' ? 'en' : 'ar';
    return { completed, unlocked, lastLevel, language, lastCompletedAt: typeof parsed.lastCompletedAt === 'string' ? parsed.lastCompletedAt : undefined };
  } catch {
    return { ...defaults };
  }
}

export function saveData(data: SaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Private browsing or storage restrictions should not block a playable session.
  }
}

export function markCompleted(data: SaveData, levelId: number, date = new Date(), unlockNext = true): SaveData {
  const completed = [...new Set([...data.completed, levelId])].sort((a, b) => a - b);
  return {
    ...data,
    completed,
    unlocked: unlockNext ? Math.min(30, Math.max(data.unlocked, levelId + 1)) : data.unlocked,
    lastLevel: unlockNext ? Math.min(30, levelId + 1) : data.lastLevel,
    lastCompletedAt: date.toISOString().slice(0, 10),
  };
}
