
export interface Vector {
  x: number;
  y: number;
}

export interface Entity {
  pos: Vector;
  vel: Vector;
  radius: number;
  color: string;
}

export interface Player extends Entity {
  team: 'A' | 'B';
  isKicking: boolean;
  score: number;
}

export interface GameState {
  player1: Player;
  player2: Player;
  ball: Entity;
  score: { A: number; B: number };
  status: 'START' | 'PLAYING' | 'GOAL' | 'FINISHED';
  winner: 'A' | 'B' | null;
}

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 500;
export const PLAYER_RADIUS = 20;
export const BALL_RADIUS = 10;
export const GOAL_SIZE = 120;
export const FRICTION = 0.985;
export const BOUNCE = 0.7;
export const PLAYER_SPEED = 0.6;
export const KICK_FORCE = 12;
export const WIN_SCORE = 5;
