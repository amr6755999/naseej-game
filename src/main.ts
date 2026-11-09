import './styles.css';
import { getDailyLevel, getLevel } from './game/levels';
import { createNaseejGame, type NaseejScene } from './game/NaseejScene';
import { renderCollection, renderCompleteModal, renderHome, renderPlay, renderSettings, renderToast } from './ui';
import { loadSave, saveData, markCompleted, type Language, type SaveData } from './storage';
import { t, direction } from './i18n';
import { sharePattern } from './share';

type Screen = 'home' | 'play' | 'collection';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root was not found');

let save: SaveData = loadSave();
let screen: Screen = 'home';
let currentLevel = Math.max(1, Math.min(30, save.lastLevel));
let dailyMode = false;
let game: ReturnType<typeof createNaseejGame> | null = null;
let scene: NaseejScene | null = null;

function destroyGame(): void {
  if (game) {
    game.destroy(true);
    game = null;
    scene = null;
  }
}

function render(): void {
  if (screen !== 'play') destroyGame();
  document.documentElement.lang = save.language;
  document.documentElement.dir = direction(save.language);
  document.body.dataset.language = save.language;

  if (screen === 'home') app!.innerHTML = renderHome(save.language, save);
  if (screen === 'collection') app!.innerHTML = renderCollection(save.language, save);
  if (screen === 'play') app!.innerHTML = renderPlay(save.language, currentLevel, dailyMode);

  if (screen === 'play') {
    window.requestAnimationFrame(() => mountGame());
  }
}

function mountGame(): void {
  if (screen !== 'play') return;
  const parent = document.getElementById('game-canvas');
  if (!parent) return;
  destroyGame();
  game = createNaseejGame(parent);
  const attachScene = (readyScene: NaseejScene): void => {
    if (screen !== 'play' || scene) return;
    scene = readyScene;
    scene.setLevel(getLevel(currentLevel));
  };
  game.events.once('naseej:ready', attachScene);
  // Defensive fallback for environments where the first scene event fires during boot.
  window.setTimeout(() => {
    if (scene || !game || screen !== 'play') return;
    try {
      const bootedScene = game.scene.getScene('NaseejScene') as NaseejScene;
      if (bootedScene && game.scene.isActive('NaseejScene')) attachScene(bootedScene);
    } catch {
      // The normal `naseej:ready` event remains the primary initialization path.
    }
  }, 180);
  game.events.on('naseej:progress', (data: { current: number; total: number }) => {
    const count = document.getElementById('step-count');
    const total = document.getElementById('step-total');
    const fill = document.getElementById('progress-fill');
    if (count) count.textContent = String(data.current);
    if (total) total.textContent = String(data.total);
    if (fill) fill.style.width = `${Math.round(data.current / data.total * 100)}%`;
  });
  game.events.on('naseej:wrong', () => renderToast(t('wrong', save.language)));
  game.events.on('naseej:complete', (data: { levelId: number }) => {
    save = markCompleted(save, data.levelId, new Date(), !dailyMode);
    saveData(save);
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) modalRoot.innerHTML = renderCompleteModal(save.language, data.levelId, !dailyMode && data.levelId < 30);
  });
}

function startLevel(levelId: number, daily = false): void {
  const bounded = Math.max(1, Math.min(30, Math.floor(levelId)));
  if (!daily && bounded > save.unlocked && !save.completed.includes(bounded)) {
    renderToast(save.language === 'ar' ? 'أكمل المرحلة السابقة لفتح هذه المرحلة.' : 'Complete the previous level to unlock this one.');
    return;
  }
  currentLevel = bounded;
  dailyMode = daily;
  if (!daily) {
    save.lastLevel = bounded;
    saveData(save);
  }
  screen = 'play';
  render();
}

function openSettings(): void {
  const root = document.getElementById('modal-root');
  if (root) root.innerHTML = renderSettings(save.language);
}

function closeModal(): void {
  const root = document.getElementById('modal-root');
  if (root) root.innerHTML = '';
}

async function handleAction(button: HTMLElement): Promise<void> {
  const action = button.dataset.action;
  switch (action) {
    case 'play':
    case 'continue':
      startLevel(Number(button.dataset.level) || save.lastLevel || save.unlocked);
      break;
    case 'daily':
      startLevel(getDailyLevel(), true);
      break;
    case 'level':
      startLevel(Number(button.dataset.level) || 1);
      break;
    case 'home':
      screen = 'home'; dailyMode = false; render();
      break;
    case 'collection':
      screen = 'collection'; dailyMode = false; render();
      break;
    case 'back':
      screen = 'home'; dailyMode = false; render();
      break;
    case 'settings':
      openSettings();
      break;
    case 'close-modal':
      if (button.classList.contains('modal-backdrop') || button.closest('.modal-card') || button.tagName === 'BUTTON') closeModal();
      break;
    case 'language': {
      const language = button.dataset.language;
      if (language === 'ar' || language === 'en') {
        save.language = language as Language;
        saveData(save);
        render();
      }
      break;
    }
    case 'hint':
      scene?.showHint();
      break;
    case 'undo':
      scene?.undoPath();
      break;
    case 'reset':
      scene?.resetPath();
      break;
    case 'next':
      startLevel(Math.min(30, currentLevel + 1));
      break;
    case 'replay':
      startLevel(currentLevel, dailyMode);
      break;
    case 'share':
      try {
        await sharePattern(getLevel(currentLevel), save.language);
        renderToast(save.language === 'ar' ? 'بطاقة نقشِك جاهزة للمشاركة.' : 'Your pattern card is ready.');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Share unavailable';
        renderToast(message);
      }
      break;
    default:
      break;
  }
}

app.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.classList.contains('modal-backdrop') && target.getAttribute('data-action') === 'close-modal') {
    closeModal();
    return;
  }
  if (target.closest('.modal-card') && !target.closest('button[data-action]')) return;
  const button = target.closest<HTMLElement>('button[data-action]');
  if (!button || button.hasAttribute('disabled')) return;
  void handleAction(button);
});

// The app is fully playable offline after its first load.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => undefined);
  });
}

render();
