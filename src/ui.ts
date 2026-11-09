import { LEVELS, getDailyLevel, getLevel } from './game/levels';
import type { Language, SaveData } from './storage';
import { direction, t } from './i18n';

type Screen = 'home' | 'play' | 'collection';

function logo(): string {
  return `<span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M20 3 29 12 20 21 11 12Z"/><path d="M20 21 34 35 20 49 6 35Z" transform="translate(0 -5)"/><path d="M20 3v32M6 30h28"/></svg></span>`;
}

function topBar(language: Language, onPlay = false): string {
  return `<header class="topbar">
    <div class="brand-lockup">${logo()}<span class="brand-name">${t('brand', language)}</span><span class="brand-dot"></span></div>
    <div class="top-actions">
      ${onPlay ? `<button class="icon-button" data-action="back" aria-label="${t('back', language)}"><svg viewBox="0 0 24 24"><path d="M15 18 9 12l6-6"/></svg></button>` : `<span class="top-kicker">${t('tagline', language)}</span>`}
      ${!onPlay ? `<button class="icon-button" data-action="settings" aria-label="${t('settings', language)}"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1a1.8 1.8 0 1 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3 .9v.2a1.8 1.8 0 1 1-3.6 0v-.2a1.8 1.8 0 0 0-3-.9l-.1.1a1.8 1.8 0 1 1-2.5-2.5l.1-.1a1.8 1.8 0 0 0-.9-3h-.2a1.8 1.8 0 1 1 0-3.6h.2a1.8 1.8 0 0 0 .9-3l-.1-.1a1.8 1.8 0 1 1 2.5-2.5l.1.1a1.8 1.8 0 0 0 3-.9v-.2a1.8 1.8 0 1 1 3.6 0v.2a1.8 1.8 0 0 0 3 .9l.1-.1a1.8 1.8 0 1 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0 .9 3h.2a1.8 1.8 0 1 1 0 3.6h-.2a1.8 1.8 0 0 0-.9 3Z"/></svg></button>` : ''}
    </div>
  </header>`;
}

function bottomNav(language: Language, active: Screen): string {
  return `<nav class="bottom-nav" aria-label="${t('home', language)}">
    <button class="nav-item ${active === 'home' ? 'active' : ''}" data-action="home"><span class="nav-icon"><svg viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/></svg></span><span>${t('home', language)}</span></button>
    <button class="nav-item ${active === 'collection' ? 'active' : ''}" data-action="collection"><span class="nav-icon"><svg viewBox="0 0 24 24"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg></span><span>${t('collection', language)}</span></button>
  </nav>`;
}

function artwork(): string {
  return `<svg class="hero-artwork" viewBox="0 0 260 240" aria-hidden="true">
    <defs><radialGradient id="artGlow"><stop offset="0" stop-color="#62ead8" stop-opacity=".18"/><stop offset="1" stop-color="#62ead8" stop-opacity="0"/></radialGradient></defs>
    <circle cx="130" cy="118" r="118" fill="url(#artGlow)"/>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M130 18 168 56 130 94 92 56Z" stroke="#62ead8" stroke-width="2.5" opacity=".9"/>
      <path d="M130 94 202 166 130 238 58 166Z" stroke="#e8c78b" stroke-width="2.5" opacity=".85"/>
      <path d="M130 18V238M58 166h144M92 56h76" stroke="#62ead8" stroke-width="1.5" opacity=".55"/>
      <path d="M130 94 168 132 130 170 92 132Z" stroke="#62ead8" stroke-width="2" opacity=".65"/>
      <circle cx="130" cy="94" r="4" fill="#62ead8"/><circle cx="130" cy="238" r="4" fill="#e8c78b"/>
      <circle cx="58" cy="166" r="3" fill="#62ead8"/><circle cx="202" cy="166" r="3" fill="#62ead8"/>
    </g>
  </svg>`;
}

function miniPattern(index: number): string {
  const variants = [
    'M30 10 50 30 30 50 10 30Z M30 10V50 M10 30h40',
    'M30 8 48 25 30 42 12 25Z M30 42 48 58 30 74 12 58Z',
    'M30 8 48 28 30 48 12 28Z M30 48 50 68 30 88 10 68Z',
    'M30 10 55 35 30 60 5 35Z M30 10V60 M5 35h50',
  ];
  return `<svg viewBox="0 0 60 96" class="mini-pattern" aria-hidden="true"><path d="${variants[index % variants.length]}"/></svg>`;
}

export function renderHome(language: Language, save: SaveData): string {
  const done = save.completed.length;
  const dailyId = getDailyLevel();
  const daily = getLevel(dailyId);
  const nextLevel = Math.min(30, Math.max(save.unlocked, save.lastLevel));
  const welcomeAction = done > 0 ? 'continue' : 'play';
  const welcomeLabel = done > 0 ? t('continue', language) : t('play', language);
  const recentlyCompleted = save.completed.slice(-3).reverse();
  return `<div class="app-shell" data-screen="home">
    ${topBar(language)}
    <main class="home-content">
      <section class="hero-card">
        <div class="hero-copy">
          <span class="eyebrow"><i></i>${t('heroEyebrow', language)}</span>
          <h1>${t('heroTitle', language)}</h1>
          <p>${t('heroBody', language)}</p>
          <button class="primary-button" data-action="${welcomeAction}" data-level="${nextLevel}"><span>${welcomeLabel}</span><svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button>
        </div>
        ${artwork()}
        <div class="hero-orbit orbit-one"></div><div class="hero-orbit orbit-two"></div>
      </section>

      <section class="stats-row">
        <div class="stat-card"><span class="stat-icon mint"><svg viewBox="0 0 24 24"><path d="m12 3 2.5 5.1L20 9l-4 3.9.9 5.6-4.9-2.6-4.9 2.6.9-5.6L4 9l5.5-.9Z"/></svg></span><div><strong>${done}</strong><small>${t('patterns', language)}</small></div></div>
        <div class="stat-card"><span class="stat-icon gold"><svg viewBox="0 0 24 24"><path d="M4 19V5m0 14h16M8 15l3-4 3 2 5-7"/></svg></span><div><strong>${Math.round(done / 30 * 100)}%</strong><small>${t('progress', language)}</small></div></div>
      </section>

      <section class="daily-card">
        <div class="daily-icon"><svg viewBox="0 0 24 24"><path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1"/><circle cx="12" cy="12" r="5"/></svg></div>
        <div class="daily-copy"><span class="eyebrow gold-text">${t('daily', language)}</span><strong>${daily.title[language]}</strong><small>${t('dailySub', language)}</small></div>
        <button class="round-arrow" data-action="daily" aria-label="${t('daily', language)}"><svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button>
      </section>

      <section class="section-block">
        <div class="section-heading"><div><span class="eyebrow">${t('collectionTitle', language)}</span><h2>${t('collectionBody', language)}</h2></div><button class="text-button" data-action="collection">${t('viewAll', language)} <span>↗</span></button></div>
        <div class="pattern-strip">${recentlyCompleted.length ? recentlyCompleted.map((id) => `<button class="pattern-tile completed" data-action="level" data-level="${id}">${miniPattern(id)}<span>${String(id).padStart(2, '0')}</span></button>`).join('') : `<div class="empty-tile">${miniPattern(0)}<span>${t('first', language)}</span></div>`}</div>
      </section>
    </main>
    ${bottomNav(language, 'home')}
    <div id="modal-root"></div><div id="toast" class="toast" role="status"></div>
  </div>`;
}

export function renderPlay(language: Language, levelId: number, isDaily: boolean): string {
  const level = getLevel(levelId);
  return `<div class="app-shell play-shell" data-screen="play">
    ${topBar(language, true)}
    <main class="play-content">
      <div class="level-heading">
        <div><span class="eyebrow">${isDaily ? t('dailyLabel', language) : `${t('level', language)} ${level.id} ${t('of', language)} 30`}</span><h1>${level.title[language]}</h1><p>${level.note[language]}</p></div>
        <div class="level-stamp"><span>${String(level.id).padStart(2, '0')}</span><small>${t('difficulty', language).split(',')[level.difficulty - 1] ?? (language === 'ar' ? 'متوسط' : 'Medium')}</small></div>
      </div>
      <div class="game-instructions"><span class="instruction-dot"></span><span>${t('drawHelp', language)}</span></div>
      <div class="game-frame"><div id="game-canvas" class="game-canvas"></div><div class="board-corner board-corner-tl"></div><div class="board-corner board-corner-br"></div></div>
      <div class="game-progress"><div class="progress-meta"><span>${t('progressLabel', language)}</span><strong><span id="step-count">0</span><span class="muted-slash"> / </span><span id="step-total">${level.route.length}</span></strong></div><div class="progress-track"><div id="progress-fill" class="progress-fill" style="width:0%"></div></div></div>
      <div class="tool-row">
        <button class="tool-button" data-action="hint"><span class="tool-symbol">✦</span><span>${t('hint', language)}</span></button>
        <button class="tool-button" data-action="undo"><span class="tool-symbol">↶</span><span>${t('undo', language)}</span></button>
        <button class="tool-button" data-action="reset"><span class="tool-symbol">⟲</span><span>${t('reset', language)}</span></button>
      </div>
      <div class="play-footnote"><span class="mirror-icon">◇</span>${language === 'ar' ? 'ارسم على الجانب الأيسر فقط. الجانب الآخر ينعكس تلقائيًا.' : 'Draw on the left side. The other half mirrors automatically.'}</div>
    </main>
    <div id="modal-root"></div><div id="toast" class="toast" role="status"></div>
  </div>`;
}

export function renderCollection(language: Language, save: SaveData): string {
  const tiles = LEVELS.map((level) => {
    const unlocked = level.id <= save.unlocked || save.completed.includes(level.id);
    const completed = save.completed.includes(level.id);
    return `<button class="collection-tile ${completed ? 'completed' : ''} ${!unlocked ? 'locked' : ''}" data-action="level" data-level="${level.id}" ${!unlocked ? 'disabled' : ''}>
      <div class="tile-art">${miniPattern(level.id)}${!unlocked ? '<span class="lock-mark">⌑</span>' : ''}${completed ? '<span class="done-mark">✓</span>' : ''}</div>
      <div class="tile-meta"><strong>${String(level.id).padStart(2, '0')} · ${level.title[language]}</strong><small>${completed ? t('complete', language) : unlocked ? t('unlocked', language) : t('locked', language)}</small></div>
    </button>`;
  }).join('');
  return `<div class="app-shell" data-screen="collection">
    ${topBar(language)}
    <main class="collection-content">
      <div class="collection-intro"><span class="eyebrow">${t('collectionTitle', language)}</span><h1>${t('collectionBody', language)}</h1><p>${save.completed.length} / 30 ${t('patterns', language)}</p><div class="progress-track"><div class="progress-fill" style="width:${Math.round(save.completed.length / 30 * 100)}%"></div></div></div>
      <div class="collection-grid">${tiles}</div>
    </main>
    ${bottomNav(language, 'collection')}
    <div id="modal-root"></div><div id="toast" class="toast" role="status"></div>
  </div>`;
}

export function renderSettings(language: Language): string {
  return `<div class="modal-backdrop" data-action="close-modal"><section class="modal-card settings-card" role="dialog" aria-modal="true" aria-labelledby="settings-title">
    <div class="modal-top"><span class="eyebrow">NASEEJ</span><button class="icon-button" data-action="close-modal" aria-label="${t('close', language)}">×</button></div>
    <h2 id="settings-title">${t('settings', language)}</h2>
    <div class="setting-block"><span>${t('language', language)}</span><div class="language-switch"><button class="${language === 'ar' ? 'selected' : ''}" data-action="language" data-language="ar">${t('arabic', language)}</button><button class="${language === 'en' ? 'selected' : ''}" data-action="language" data-language="en">${t('english', language)}</button></div></div>
    <div class="setting-note"><span class="setting-icon">◌</span><div><strong>${t('sound', language)}</strong><small>${t('soundOff', language)}</small></div></div>
    <button class="secondary-button full-width" data-action="close-modal">${t('close', language)}</button>
  </section></div>`;
}

export function renderCompleteModal(language: Language, levelId: number, nextAvailable: boolean): string {
  const level = getLevel(levelId);
  return `<div class="modal-backdrop success-backdrop"><section class="modal-card success-card" role="dialog" aria-modal="true" aria-labelledby="complete-title">
    <div class="success-burst"><span>✦</span><span>✧</span><span>✦</span><div class="success-rosette"><svg viewBox="0 0 80 80"><path d="M40 5 50 25 75 20 60 40 75 60 50 55 40 75 30 55 5 60 20 40 5 20 30 25Z"/><path d="M40 19 52 40 40 61 28 40Z"/></svg></div></div>
    <span class="eyebrow gold-text">${t('complete', language)}</span><h2 id="complete-title">${level.title[language]}</h2><p>${t('completeBody', language)}</p>
    <div class="success-actions"><button class="primary-button full-width" data-action="share"><span>${t('share', language)}</span><svg viewBox="0 0 24 24"><path d="M12 16V4m-5 5 5-5 5 5M5 14v5h14v-5"/></svg></button>${nextAvailable ? `<button class="secondary-button full-width" data-action="next">${t('next', language)} ${language === 'ar' ? '←' : '→'}</button>` : `<button class="secondary-button full-width" data-action="collection">${t('collection', language)}</button>`}<button class="subtle-button" data-action="replay">${t('replay', language)}</button></div>
  </section></div>`;
}

export function renderToast(message: string): void {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 1500);
}

export function currentDailyLevel(): number {
  return getDailyLevel();
}

export function screenDirection(language: Language): 'rtl' | 'ltr' {
  return direction(language);
}
