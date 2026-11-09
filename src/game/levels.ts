export type GridPoint = { x: number; y: number };

export type Level = {
  id: number;
  title: { ar: string; en: string };
  note: { ar: string; en: string };
  difficulty: 1 | 2 | 3 | 4 | 5;
  route: GridPoint[];
  nodes: GridPoint[];
};

const raw: Array<{
  title: [string, string];
  note: [string, string];
  difficulty: 1 | 2 | 3 | 4 | 5;
  route: Array<[number, number]>;
}> = [
  { title: ['الخيط الأول', 'First Thread'], note: ['ابدأ من المركز واتبع الانحناءة الأولى.', 'Begin at the center and follow the first curve.'], difficulty: 1, route: [[0,0],[1,1],[2,2],[3,3],[2,4],[1,6],[0,8]] },
  { title: ['بتلة', 'Petal'], note: ['دع الخط يصنع بتلة متوازنة.', 'Let one line form a balanced petal.'], difficulty: 1, route: [[0,0],[1,2],[2,1],[3,2],[4,4],[3,5],[2,7],[1,6],[0,8]] },
  { title: ['تموّج', 'Ripple'], note: ['تقدّم بخطوات قصيرة ومتعرجة.', 'Move through a sequence of gentle turns.'], difficulty: 1, route: [[0,0],[1,1],[2,1],[3,2],[2,3],[1,4],[2,5],[3,6],[1,7],[0,8]] },
  { title: ['بوصلة', 'Compass'], note: ['اصنع زاوية ثم عد إلى المحور.', 'Create an angle, then return to the axis.'], difficulty: 1, route: [[0,0],[1,1],[2,2],[3,2],[4,4],[3,6],[2,6],[1,7],[0,8]] },
  { title: ['فانوس', 'Lantern'], note: ['وازن بين الاتساع والعودة.', 'Balance outward movement with a return.'], difficulty: 1, route: [[0,0],[1,1],[2,2],[3,3],[4,4],[3,5],[2,6],[1,7],[0,8]] },
  { title: ['زهرة', 'Bloom'], note: ['كوّن بتلتين متصلتين في مسار واحد.', 'Connect two petals in one continuous path.'], difficulty: 2, route: [[0,0],[1,1],[2,1],[3,2],[2,3],[1,3],[2,4],[3,5],[2,6],[1,7],[0,8]] },
  { title: ['مدّ وجزر', 'Tide'], note: ['غيّر الاتجاه دون قطع الخيط.', 'Change direction without breaking the thread.'], difficulty: 2, route: [[0,0],[1,1],[2,2],[3,1],[4,2],[3,4],[2,5],[3,6],[1,7],[0,8]] },
  { title: ['نجمة منسوجة', 'Woven Star'], note: ['اتبع الزوايا لتظهر النجمة.', 'Follow the angles to reveal the star.'], difficulty: 2, route: [[0,0],[1,1],[2,2],[3,3],[4,2],[3,4],[4,6],[2,6],[1,7],[0,8]] },
  { title: ['قوس', 'Arc'], note: ['ارسم قوسًا واسعًا ثم أغلق الإيقاع.', 'Draw a broad arc and complete its rhythm.'], difficulty: 2, route: [[0,0],[1,1],[2,2],[3,3],[4,4],[3,5],[2,6],[1,6],[2,7],[0,8]] },
  { title: ['موجة مزدوجة', 'Double Wave'], note: ['تعرّج مرتين مع الحفاظ على المسار.', 'Turn twice while keeping one continuous path.'], difficulty: 2, route: [[0,0],[1,1],[2,2],[3,1],[4,3],[3,4],[2,5],[3,6],[1,7],[0,8]] },
  { title: ['بلّورة', 'Crystal'], note: ['الزوايا الحادة تصنع التوازن.', 'Sharp angles create the balance.'], difficulty: 3, route: [[0,0],[1,1],[2,2],[3,3],[4,4],[3,6],[2,5],[1,7],[0,8]] },
  { title: ['سُلّم ضوئي', 'Light Ladder'], note: ['اصعد وانزل بين نقاط متباعدة.', 'Move up and down between spaced points.'], difficulty: 3, route: [[0,0],[1,1],[2,1],[3,2],[4,3],[3,4],[2,4],[1,5],[2,6],[1,7],[0,8]] },
  { title: ['وردة الرياح', 'Wind Rose'], note: ['اتبع الاتجاهات المتبدلة.', 'Follow the changing directions.'], difficulty: 3, route: [[0,0],[1,1],[2,2],[3,1],[4,3],[3,5],[2,4],[1,6],[2,7],[0,8]] },
  { title: ['أثر متقاطع', 'Crossing Trace'], note: ['اعبر الداخل ثم اتجه إلى الحافة.', 'Cross inward before moving to the edge.'], difficulty: 3, route: [[0,0],[1,1],[2,2],[1,3],[3,4],[4,5],[3,6],[1,6],[2,7],[0,8]] },
  { title: ['قلب هندسي', 'Geometric Heart'], note: ['اجمع منحنيين في حركة واحدة.', 'Join two curves in one movement.'], difficulty: 3, route: [[0,0],[1,1],[2,1],[3,2],[2,3],[1,3],[2,4],[3,5],[4,6],[2,7],[0,8]] },
  { title: ['شُعاع', 'Ray'], note: ['اتساع ثم عودة عبر نقاط متقاربة.', 'Expand, then return through closer points.'], difficulty: 3, route: [[0,0],[1,1],[2,2],[3,3],[4,4],[3,5],[2,5],[1,6],[2,7],[0,8]] },
  { title: ['نسيج متداخل', 'Interlace'], note: ['بدّل بين الداخل والخارج.', 'Alternate between inner and outer points.'], difficulty: 4, route: [[0,0],[1,1],[2,2],[3,1],[2,3],[4,4],[3,5],[1,4],[2,6],[1,7],[0,8]] },
  { title: ['بوابة', 'Gateway'], note: ['اعبر البوابة الضيقة قبل الإكمال.', 'Pass through the narrow gate before finishing.'], difficulty: 4, route: [[0,0],[1,1],[2,2],[3,3],[2,4],[3,5],[4,6],[2,6],[1,7],[0,8]] },
  { title: ['مِرآة', 'Mirrorline'], note: ['المسار واحد والنتيجة مزدوجة.', 'One path, a doubled result.'], difficulty: 4, route: [[0,0],[1,1],[2,2],[3,3],[4,4],[2,5],[3,6],[1,6],[2,7],[0,8]] },
  { title: ['تاج', 'Crown'], note: ['ارسم قممًا متتابعة بإيقاع ثابت.', 'Create a sequence of peaks with steady rhythm.'], difficulty: 4, route: [[0,0],[1,1],[2,2],[3,1],[4,2],[3,4],[2,3],[1,5],[2,6],[1,7],[0,8]] },
  { title: ['مجرة', 'Constellation'], note: ['اربط النقاط البعيدة دون انقطاع.', 'Connect distant points without breaking the line.'], difficulty: 4, route: [[0,0],[1,1],[2,2],[4,2],[3,4],[1,3],[2,5],[4,6],[2,7],[0,8]] },
  { title: ['نسيج عميق', 'Deep Weave'], note: ['راقب ترتيب الانعطافات.', 'Watch the order of the turns.'], difficulty: 4, route: [[0,0],[1,1],[2,2],[3,3],[2,4],[4,5],[3,6],[1,5],[2,7],[0,8]] },
  { title: ['متاهة هادئة', 'Quiet Maze'], note: ['كل نقطة تقود إلى الانعطاف التالي.', 'Each point leads to the next turn.'], difficulty: 4, route: [[0,0],[1,1],[2,1],[3,2],[4,3],[2,4],[1,5],[3,5],[2,7],[0,8]] },
  { title: ['مروحة', 'Fan'], note: ['افتح الشكل تدريجيًا ثم أعده للمركز.', 'Open the shape gradually, then return inward.'], difficulty: 4, route: [[0,0],[1,1],[2,2],[3,3],[4,4],[3,5],[4,6],[2,6],[1,7],[0,8]] },
  { title: ['توازن', 'Equilibrium'], note: ['أصعب ما في الشكل هو ترتيب خطواته.', 'The challenge is the order of the steps.'], difficulty: 5, route: [[0,0],[1,1],[2,2],[3,1],[4,3],[2,4],[3,5],[1,4],[2,6],[1,7],[0,8]] },
  { title: ['قفل هندسي', 'Geometric Lock'], note: ['تعرّف على تسلسل الإغلاق.', 'Find the sequence that closes the form.'], difficulty: 5, route: [[0,0],[1,1],[2,2],[3,3],[4,4],[2,5],[3,6],[1,5],[2,7],[0,8]] },
  { title: ['دوّامة', 'Vortex'], note: ['تقدم نحو الخارج ثم انعطف للداخل.', 'Move outward, then turn back in.'], difficulty: 5, route: [[0,0],[1,1],[2,2],[3,3],[4,4],[3,6],[2,5],[1,6],[2,7],[0,8]] },
  { title: ['حديقة', 'Garden'], note: ['اجمع عدة بتلات في خط متصل.', 'Join several petals in one continuous line.'], difficulty: 5, route: [[0,0],[1,1],[2,1],[3,2],[2,3],[1,4],[3,4],[4,5],[3,6],[1,6],[2,7],[0,8]] },
  { title: ['الترابط', 'Interconnected'], note: ['تحتاج إلى قراءة المسار كاملًا.', 'Read the whole route before you begin.'], difficulty: 5, route: [[0,0],[1,1],[2,2],[3,1],[4,3],[3,4],[1,3],[2,5],[4,6],[2,7],[0,8]] },
  { title: ['التحفة', 'The Masterpiece'], note: ['اجمع كل ما تعلمته في نقش أخير.', 'Bring every skill together in the final pattern.'], difficulty: 5, route: [[0,0],[1,1],[2,2],[3,3],[4,4],[3,5],[2,4],[1,5],[2,6],[3,7],[0,8]] },
];

const decoyPool: Array<[number, number]> = [
  [1,0],[2,0],[3,0],[4,1],[4,2],[3,3],[4,5],[4,7],
  [3,8],[2,8],[1,8],[1,4],[2,3],[3,6],[4,7],[2,5],
];

const key = (p: GridPoint) => `${p.x},${p.y}`;

export const LEVELS: Level[] = raw.map((item, index) => {
  const route = item.route.map(([x, y]) => ({ x, y }));
  const routeKeys = new Set(route.map(key));
  const offset = index % decoyPool.length;
  const candidates = [...decoyPool.slice(offset), ...decoyPool.slice(0, offset)];
  const decoys = candidates
    .filter(([x, y]) => !routeKeys.has(`${x},${y}`))
    .slice(0, 7 + Math.min(3, Math.floor(index / 9)))
    .map(([x, y]) => ({ x, y }));
  const nodesByKey = new Map<string, GridPoint>();
  [...route, ...decoys].forEach((point) => nodesByKey.set(key(point), point));
  return {
    id: index + 1,
    title: { ar: item.title[0], en: item.title[1] },
    note: { ar: item.note[0], en: item.note[1] },
    difficulty: item.difficulty,
    route,
    nodes: [...nodesByKey.values()],
  };
});

export function getLevel(id: number): Level {
  return LEVELS[Math.max(1, Math.min(LEVELS.length, Math.floor(id))) - 1]!;
}

export function getDailyLevel(date = new Date()): number {
  const stamp = Number(`${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, '0')}${String(date.getUTCDate()).padStart(2, '0')}`);
  return (stamp % LEVELS.length) + 1;
}
