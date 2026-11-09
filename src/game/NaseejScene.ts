import Phaser from 'phaser';
import type { GridPoint, Level } from './levels';
import { isNextPoint, pointKey } from './logic';

const WIDTH = 480;
const HEIGHT = 620;
const CENTER_X = WIDTH / 2;
const TOP = 76;
const ROW_GAP = 58;
const COL_GAP = 34;

export class NaseejScene extends Phaser.Scene {
  private graphics!: Phaser.GameObjects.Graphics;
  private level: Level | null = null;
  private selected: GridPoint[] = [];
  private hintPoint: GridPoint | null = null;
  private solved = false;
  private lastWrongAt = 0;

  constructor() {
    super('NaseejScene');
  }

  create(): void {
    this.graphics = this.add.graphics();
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => this.handlePointer(pointer));
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) this.handlePointer(pointer);
    });
    this.drawBoard();
    this.game.events.emit('naseej:ready', this);
  }

  setLevel(level: Level): void {
    this.level = level;
    this.selected = [];
    this.hintPoint = null;
    this.solved = false;
    this.drawBoard();
    this.game.events.emit('naseej:progress', { current: 0, total: level.route.length });
  }

  resetPath(): void {
    if (!this.level || this.solved) return;
    this.selected = [];
    this.hintPoint = null;
    this.drawBoard();
    this.game.events.emit('naseej:progress', { current: 0, total: this.level.route.length });
  }

  undoPath(): void {
    if (!this.level || this.solved || this.selected.length <= 1) return;
    this.selected.pop();
    this.hintPoint = null;
    this.drawBoard();
    this.game.events.emit('naseej:progress', { current: this.selected.length, total: this.level.route.length });
  }

  showHint(): void {
    if (!this.level || this.solved) return;
    this.hintPoint = this.level.route[this.selected.length] ?? null;
    this.drawBoard();
    this.time.delayedCall(1150, () => {
      this.hintPoint = null;
      this.drawBoard();
    });
  }

  getSelectedCount(): number {
    return this.selected.length;
  }

  private handlePointer(pointer: Phaser.Input.Pointer): void {
    if (!this.level || this.solved) return;
    const point = this.nearestNode(pointer.x, pointer.y);
    if (!point) return;

    if (this.selected.length === 0) {
      if (pointKey(point) !== pointKey(this.level.route[0]!)) {
        this.emitWrong();
        return;
      }
      this.selected = [point];
      this.afterSelection();
      return;
    }

    const last = this.selected[this.selected.length - 1]!;
    if (pointKey(last) === pointKey(point)) return;

    if (isNextPoint(this.level.route, this.selected, point)) {
      this.selected.push(point);
      this.afterSelection();
    } else {
      this.emitWrong();
    }
  }

  private nearestNode(x: number, y: number): GridPoint | null {
    if (!this.level) return null;
    let nearest: GridPoint | null = null;
    let best = 23;
    for (const point of this.level.nodes) {
      const position = this.position(point);
      const distance = Phaser.Math.Distance.Between(x, y, position.x, position.y);
      if (distance < best) {
        best = distance;
        nearest = point;
      }
    }
    return nearest;
  }

  private position(point: GridPoint, mirror = false): { x: number; y: number } {
    const offset = point.x * COL_GAP;
    return {
      x: CENTER_X + (mirror ? offset : -offset),
      y: TOP + point.y * ROW_GAP,
    };
  }

  private afterSelection(): void {
    if (!this.level) return;
    this.hintPoint = null;
    this.drawBoard();
    this.game.events.emit('naseej:progress', { current: this.selected.length, total: this.level.route.length });
    if (this.selected.length === this.level.route.length) {
      this.solved = true;
      this.game.events.emit('naseej:complete', { levelId: this.level.id });
    }
  }

  private emitWrong(): void {
    const now = Date.now();
    if (now - this.lastWrongAt > 650) {
      this.lastWrongAt = now;
      this.game.events.emit('naseej:wrong');
    }
  }

  private drawPath(points: GridPoint[], color: number, alpha: number, width: number): void {
    if (points.length < 2) return;
    this.graphics.lineStyle(width, color, alpha);
    const first = this.position(points[0]!);
    this.graphics.beginPath();
    this.graphics.moveTo(first.x, first.y);
    for (let i = 1; i < points.length; i += 1) {
      const next = this.position(points[i]!);
      this.graphics.lineTo(next.x, next.y);
    }
    this.graphics.strokePath();

    const mirrorFirst = this.position(points[0]!, true);
    this.graphics.beginPath();
    this.graphics.moveTo(mirrorFirst.x, mirrorFirst.y);
    for (let i = 1; i < points.length; i += 1) {
      const next = this.position(points[i]!, true);
      this.graphics.lineTo(next.x, next.y);
    }
    this.graphics.strokePath();
  }

  private drawBoard(): void {
    if (!this.graphics) return;
    const g = this.graphics;
    g.clear();

    // A quiet, layered night-sky board.
    g.fillStyle(0x0b1423, 1);
    g.fillRoundedRect(0, 0, WIDTH, HEIGHT, 28);
    g.fillStyle(0x183a46, 0.12);
    g.fillCircle(92, 120, 150);
    g.fillStyle(0x4c3b27, 0.10);
    g.fillCircle(390, 480, 180);

    // Delicate grid and the mirror axis.
    g.lineStyle(1, 0x91a4b8, 0.045);
    for (let row = 0; row <= 8; row += 1) {
      const y = TOP + row * ROW_GAP;
      g.beginPath(); g.moveTo(28, y); g.lineTo(WIDTH - 28, y); g.strokePath();
    }
    for (let col = -4; col <= 4; col += 1) {
      const x = CENTER_X + col * COL_GAP;
      g.beginPath(); g.moveTo(x, 40); g.lineTo(x, HEIGHT - 36); g.strokePath();
    }
    g.lineStyle(1.5, 0x62ead8, 0.2);
    for (let y = 30; y < HEIGHT - 24; y += 14) {
      g.beginPath(); g.moveTo(CENTER_X, y); g.lineTo(CENTER_X, y + 5); g.strokePath();
    }

    if (!this.level) {
      this.drawIdleMotif();
      return;
    }

    // Faint reference path: a soft guide, never a hard timer or penalty.
    this.drawPath(this.level.route, 0x92a5b8, 0.12, 3);

    // Current path is mirrored instantly on the opposite side.
    this.drawPath(this.selected, 0x62ead8, 0.95, 4.5);

    // A soft moving-looking glow at the next hint point.
    if (this.hintPoint) {
      const p = this.position(this.hintPoint);
      g.fillStyle(0x62ead8, 0.12); g.fillCircle(p.x, p.y, 28);
      g.fillStyle(0x62ead8, 0.18); g.fillCircle(p.x, p.y, 18);
      g.lineStyle(2, 0x9cfff2, 0.95); g.strokeCircle(p.x, p.y, 12);
    }

    const selectedKeys = new Set(this.selected.map(pointKey));
    const startKey = pointKey(this.level.route[0]!);
    const endKey = pointKey(this.level.route[this.level.route.length - 1]!);

    for (const point of this.level.nodes) {
      const p = this.position(point);
      const key = pointKey(point);
      const selected = selectedKeys.has(key);
      const start = key === startKey;
      const end = key === endKey;
      if (selected || start || end) {
        const color = start ? 0x62ead8 : end ? 0xe8c78b : 0x62ead8;
        g.fillStyle(color, 0.12); g.fillCircle(p.x, p.y, 18);
        g.fillStyle(color, 0.22); g.fillCircle(p.x, p.y, 11);
        g.lineStyle(1.5, color, 0.92); g.strokeCircle(p.x, p.y, 7);
        g.fillStyle(color, 1); g.fillCircle(p.x, p.y, 3.2);
      } else {
        g.fillStyle(0x9aafc4, 0.18); g.fillCircle(p.x, p.y, 3.2);
        g.lineStyle(1, 0x9aafc4, 0.22); g.strokeCircle(p.x, p.y, 6);
      }
    }

    // Start/end markers on the mirror axis.
    const start = this.position(this.level.route[0]!);
    const end = this.position(this.level.route[this.level.route.length - 1]!);
    g.fillStyle(0x62ead8, 0.07); g.fillCircle(start.x, start.y, 28);
    g.lineStyle(1, 0x62ead8, 0.55); g.strokeCircle(start.x, start.y, 17);
    g.fillStyle(0xe8c78b, 0.07); g.fillCircle(end.x, end.y, 28);
    g.lineStyle(1, 0xe8c78b, 0.55); g.strokeCircle(end.x, end.y, 17);

    if (this.solved) {
      g.fillStyle(0x62ead8, 0.10); g.fillCircle(CENTER_X, 306, 190);
    }
  }

  private drawIdleMotif(): void {
    const route: GridPoint[] = [
      { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 },
      { x: 3, y: 3 }, { x: 2, y: 4 }, { x: 1, y: 6 }, { x: 0, y: 8 },
    ];
    this.drawPath(route, 0x62ead8, 0.32, 4);
    for (const point of route) {
      const p = this.position(point);
      this.graphics.fillStyle(0x62ead8, 0.24);
      this.graphics.fillCircle(p.x, p.y, 7);
    }
  }
}

export function createNaseejGame(parent: HTMLElement): Phaser.Game {
  const game = new Phaser.Game({
    type: Phaser.CANVAS,
    width: WIDTH,
    height: HEIGHT,
    parent,
    backgroundColor: '#0b1423',
    transparent: false,
    antialias: true,
    render: { pixelArt: false, roundPixels: false },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: WIDTH,
      height: HEIGHT,
    },
    input: {
      activePointers: 2,
      smoothFactor: 0,
    },
    scene: [NaseejScene],
  });
  return game;
}
