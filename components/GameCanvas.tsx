import React, { useRef, useEffect } from 'react';
import { 
  CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_RADIUS, BALL_RADIUS, 
  GOAL_SIZE, FRICTION, BOUNCE, PLAYER_SPEED, KICK_FORCE, Entity, Player 
} from '../types';

interface GameCanvasProps {
  onGoal: (team: 'A' | 'B') => void;
  status: 'START' | 'PLAYING' | 'GOAL' | 'FINISHED';
  isAIMode: boolean;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onGoal, status, isAIMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Initializing with 0 to satisfy the expected argument requirement in strict TypeScript environments
  const requestRef = useRef<number>(0);
  const keys = useRef<Record<string, boolean>>({});

  const p1 = useRef<Player>({
    pos: { x: 150, y: CANVAS_HEIGHT / 2 },
    vel: { x: 0, y: 0 },
    radius: PLAYER_RADIUS,
    color: '#3b82f6',
    team: 'A',
    isKicking: false,
    score: 0
  });

  const p2 = useRef<Player>({
    pos: { x: CANVAS_WIDTH - 150, y: CANVAS_HEIGHT / 2 },
    vel: { x: 0, y: 0 },
    radius: PLAYER_RADIUS,
    color: '#ef4444',
    team: 'B',
    isKicking: false,
    score: 0
  });

  const ball = useRef<Entity>({
    pos: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
    vel: { x: 0, y: 0 },
    radius: BALL_RADIUS,
    color: '#ffffff'
  });

  const resetPositions = () => {
    p1.current.pos = { x: 150, y: CANVAS_HEIGHT / 2 };
    p1.current.vel = { x: 0, y: 0 };
    p2.current.pos = { x: CANVAS_WIDTH - 150, y: CANVAS_HEIGHT / 2 };
    p2.current.vel = { x: 0, y: 0 };
    ball.current.pos = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };
    ball.current.vel = { x: 0, y: 0 };
  };

  useEffect(() => {
    if (status !== 'PLAYING') resetPositions();
  }, [status]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => { keys.current[e.code] = true; };
    const up = (e: KeyboardEvent) => { keys.current[e.code] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const resolveCollision = (e1: Entity, e2: Entity) => {
    const dx = e2.pos.x - e1.pos.x;
    const dy = e2.pos.y - e1.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const minDist = e1.radius + e2.radius;

    if (dist < minDist) {
      const overlap = minDist - dist;
      const nx = dx / dist;
      const ny = dy / dist;
      
      e1.pos.x -= nx * overlap / 2;
      e1.pos.y -= ny * overlap / 2;
      e2.pos.x += nx * overlap / 2;
      e2.pos.y += ny * overlap / 2;

      const relVelX = e1.vel.x - e2.vel.x;
      const relVelY = e1.vel.y - e2.vel.y;
      const velNormal = relVelX * nx + relVelY * ny;

      if (velNormal > 0) return;

      const impulse = -(1 + BOUNCE) * velNormal / 2;
      e1.vel.x += impulse * nx;
      e1.vel.y += impulse * ny;
      e2.vel.x -= impulse * nx;
      e2.vel.y -= impulse * ny;
    }
  };

  const update = () => {
    if (status !== 'PLAYING') return;

    // Player 1 Controls
    if (keys.current['KeyW']) p1.current.vel.y -= PLAYER_SPEED;
    if (keys.current['KeyS']) p1.current.vel.y += PLAYER_SPEED;
    if (keys.current['KeyA']) p1.current.vel.x -= PLAYER_SPEED;
    if (keys.current['KeyD']) p1.current.vel.x += PLAYER_SPEED;
    
    // Player 2 Controls (AI or Manual)
    if (isAIMode) {
      const targetX = ball.current.pos.x;
      const targetY = ball.current.pos.y;
      const dx = targetX - p2.current.pos.x;
      const dy = targetY - p2.current.pos.y;
      
      // Simple chasing AI
      if (Math.abs(dx) > 10) p2.current.vel.x += (dx > 0 ? 1 : -1) * PLAYER_SPEED * 0.8;
      if (Math.abs(dy) > 10) p2.current.vel.y += (dy > 0 ? 1 : -1) * PLAYER_SPEED * 0.8;

      // Auto-kick if close to ball and ball is in front of AI
      const distToBall = Math.sqrt(dx * dx + dy * dy);
      if (distToBall < 50 && ball.current.pos.x < p2.current.pos.x) {
        keys.current['Enter'] = true;
        setTimeout(() => keys.current['Enter'] = false, 100);
      }
    } else {
      if (keys.current['ArrowUp']) p2.current.vel.y -= PLAYER_SPEED;
      if (keys.current['ArrowDown']) p2.current.vel.y += PLAYER_SPEED;
      if (keys.current['ArrowLeft']) p2.current.vel.x -= PLAYER_SPEED;
      if (keys.current['ArrowRight']) p2.current.vel.x += PLAYER_SPEED;
    }

    // Apply Velocity & Friction
    [p1.current, p2.current, ball.current].forEach(ent => {
      ent.pos.x += ent.vel.x;
      ent.pos.y += ent.vel.y;
      ent.vel.x *= FRICTION;
      ent.vel.y *= FRICTION;

      // Goal Heights
      const goalTop = (CANVAS_HEIGHT - GOAL_SIZE) / 2;
      const goalBottom = goalTop + GOAL_SIZE;

      // Bound checks
      if (ent.pos.x < ent.radius) {
        if (ent === ball.current && ent.pos.y > goalTop && ent.pos.y < goalBottom) {
          onGoal('B'); return;
        }
        ent.pos.x = ent.radius;
        ent.vel.x *= -BOUNCE;
      }
      if (ent.pos.x > CANVAS_WIDTH - ent.radius) {
        if (ent === ball.current && ent.pos.y > goalTop && ent.pos.y < goalBottom) {
          onGoal('A'); return;
        }
        ent.pos.x = CANVAS_WIDTH - ent.radius;
        ent.vel.x *= -BOUNCE;
      }
      if (ent.pos.y < ent.radius) { ent.pos.y = ent.radius; ent.vel.y *= -BOUNCE; }
      if (ent.pos.y > CANVAS_HEIGHT - ent.radius) { ent.pos.y = CANVAS_HEIGHT - ent.radius; ent.vel.y *= -BOUNCE; }
    });

    // Kicking
    const checkKick = (p: Player, keyCode: string) => {
      const dx = ball.current.pos.x - p.pos.x;
      const dy = ball.current.pos.y - p.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < p.radius + ball.current.radius + 15 && keys.current[keyCode]) {
        ball.current.vel.x = (dx / dist) * KICK_FORCE;
        ball.current.vel.y = (dy / dist) * KICK_FORCE;
        p.isKicking = true;
        setTimeout(() => p.isKicking = false, 150);
      }
    };
    checkKick(p1.current, 'Space');
    checkKick(p2.current, 'Enter');

    resolveCollision(p1.current, ball.current);
    resolveCollision(p2.current, ball.current);
    resolveCollision(p1.current, p2.current);
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Pitch
    ctx.fillStyle = '#065f46';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Lines
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, CANVAS_WIDTH - 40, CANVAS_HEIGHT - 40);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH/2, 20); ctx.lineTo(CANVAS_WIDTH/2, CANVAS_HEIGHT-20);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 60, 0, Math.PI*2);
    ctx.stroke();

    // Goals
    const goalTop = (CANVAS_HEIGHT - GOAL_SIZE) / 2;
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(0, goalTop, 20, GOAL_SIZE);
    ctx.fillRect(CANVAS_WIDTH - 20, goalTop, 20, GOAL_SIZE);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(-5, goalTop, 25, GOAL_SIZE);
    ctx.strokeRect(CANVAS_WIDTH - 20, goalTop, 25, GOAL_SIZE);

    // Entities
    [p1.current, p2.current, ball.current].forEach(ent => {
      ctx.save();
      ctx.translate(ent.pos.x, ent.pos.y);
      
      // Shadow
      ctx.beginPath();
      ctx.ellipse(0, ent.radius * 0.9, ent.radius * 0.8, ent.radius * 0.3, 0, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fill();

      // Body
      ctx.beginPath();
      ctx.arc(0, 0, ent.radius, 0, Math.PI*2);
      ctx.fillStyle = ent.color;
      if ('isKicking' in ent && (ent as Player).isKicking) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#fbbf24';
      }
      ctx.fill();
      
      // Details
      if ('team' in ent) {
         ctx.fillStyle = 'rgba(255,255,255,0.4)';
         ctx.fillRect(-ent.radius/2, -ent.radius/4, ent.radius, 2);
      } else {
         ctx.strokeStyle = '#000';
         ctx.lineWidth = 1;
         ctx.stroke();
      }
      ctx.restore();
    });
  };

  const loop = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) { update(); draw(ctx); }
    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [status, isAIMode]);

  return <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-auto rounded-b-xl shadow-inner shadow-black/50" />;
};

export default GameCanvas;