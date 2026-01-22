
import React, { useRef, useEffect, useState } from 'react';
import { 
  CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_RADIUS, BALL_RADIUS, 
  GOAL_SIZE, FRICTION, BOUNCE, PLAYER_SPEED, KICK_FORCE, Entity, Player 
} from '../types';

interface GameCanvasProps {
  onGoal: (team: 'A' | 'B') => void;
  status: 'START' | 'PLAYING' | 'GOAL' | 'FINISHED';
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onGoal, status }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  
  // Input tracking
  const keys = useRef<Record<string, boolean>>({});

  // Game state in refs for physics consistency in the loop
  const p1 = useRef<Player>({
    pos: { x: 100, y: CANVAS_HEIGHT / 2 },
    vel: { x: 0, y: 0 },
    radius: PLAYER_RADIUS,
    color: '#3b82f6',
    team: 'A',
    isKicking: false,
    score: 0
  });

  const p2 = useRef<Player>({
    pos: { x: CANVAS_WIDTH - 100, y: CANVAS_HEIGHT / 2 },
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
    p1.current.pos = { x: 100, y: CANVAS_HEIGHT / 2 };
    p1.current.vel = { x: 0, y: 0 };
    p2.current.pos = { x: CANVAS_WIDTH - 100, y: CANVAS_HEIGHT / 2 };
    p2.current.vel = { x: 0, y: 0 };
    ball.current.pos = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };
    ball.current.vel = { x: 0, y: 0 };
  };

  useEffect(() => {
    if (status === 'GOAL' || status === 'START' || status === 'FINISHED') {
      resetPositions();
    }
  }, [status]);

  const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.code] = true; };
  const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.code] = false; };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const resolveCollision = (e1: Entity, e2: Entity) => {
    const dx = e2.pos.x - e1.pos.x;
    const dy = e2.pos.y - e1.pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = e1.radius + e2.radius;

    if (distance < minDistance) {
      // Resolve overlap
      const overlap = minDistance - distance;
      const nx = dx / distance;
      const ny = dy / distance;
      
      e1.pos.x -= nx * overlap / 2;
      e1.pos.y -= ny * overlap / 2;
      e2.pos.x += nx * overlap / 2;
      e2.pos.y += ny * overlap / 2;

      // Elastic collision reflection
      const relativeVelocityX = e1.vel.x - e2.vel.x;
      const relativeVelocityY = e1.vel.y - e2.vel.y;
      const velocityAlongNormal = relativeVelocityX * nx + relativeVelocityY * ny;

      if (velocityAlongNormal > 0) return;

      const j = -(1 + BOUNCE) * velocityAlongNormal;
      const impulse = j / 2; // Equal mass for simplicity

      e1.vel.x += impulse * nx;
      e1.vel.y += impulse * ny;
      e2.vel.x -= impulse * nx;
      e2.vel.y -= impulse * ny;
    }
  };

  const update = () => {
    if (status !== 'PLAYING') return;

    // Movement P1
    if (keys.current['KeyW']) p1.current.vel.y -= PLAYER_SPEED;
    if (keys.current['KeyS']) p1.current.vel.y += PLAYER_SPEED;
    if (keys.current['KeyA']) p1.current.vel.x -= PLAYER_SPEED;
    if (keys.current['KeyD']) p1.current.vel.x += PLAYER_SPEED;
    
    // Movement P2
    if (keys.current['ArrowUp']) p2.current.vel.y -= PLAYER_SPEED;
    if (keys.current['ArrowDown']) p2.current.vel.y += PLAYER_SPEED;
    if (keys.current['ArrowLeft']) p2.current.vel.x -= PLAYER_SPEED;
    if (keys.current['ArrowRight']) p2.current.vel.x += PLAYER_SPEED;

    // Physics Update
    [p1.current, p2.current, ball.current].forEach(ent => {
      ent.pos.x += ent.vel.x;
      ent.pos.y += ent.vel.y;
      ent.vel.x *= FRICTION;
      ent.vel.y *= FRICTION;

      // Wall collisions
      if (ent.pos.x < ent.radius) {
        // Goal check
        const isGoalHeight = ent.pos.y > (CANVAS_HEIGHT - GOAL_SIZE) / 2 && ent.pos.y < (CANVAS_HEIGHT + GOAL_SIZE) / 2;
        if (ent === ball.current && isGoalHeight) {
          onGoal('B');
          return;
        }
        ent.pos.x = ent.radius;
        ent.vel.x *= -BOUNCE;
      }
      if (ent.pos.x > CANVAS_WIDTH - ent.radius) {
         // Goal check
        const isGoalHeight = ent.pos.y > (CANVAS_HEIGHT - GOAL_SIZE) / 2 && ent.pos.y < (CANVAS_HEIGHT + GOAL_SIZE) / 2;
        if (ent === ball.current && isGoalHeight) {
          onGoal('A');
          return;
        }
        ent.pos.x = CANVAS_WIDTH - ent.radius;
        ent.vel.x *= -BOUNCE;
      }
      if (ent.pos.y < ent.radius) {
        ent.pos.y = ent.radius;
        ent.vel.y *= -BOUNCE;
      }
      if (ent.pos.y > CANVAS_HEIGHT - ent.radius) {
        ent.pos.y = CANVAS_HEIGHT - ent.radius;
        ent.vel.y *= -BOUNCE;
      }
    });

    // Collision Player-Ball & Kicking
    const handleKick = (player: Player) => {
      const dx = ball.current.pos.x - player.pos.x;
      const dy = ball.current.pos.y - player.pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const kickKey = player.team === 'A' ? 'Space' : 'Enter';
      
      if (distance < player.radius + ball.current.radius + 10) {
        if (keys.current[kickKey]) {
          const nx = dx / distance;
          const ny = dy / distance;
          ball.current.vel.x = nx * KICK_FORCE;
          ball.current.vel.y = ny * KICK_FORCE;
          player.isKicking = true;
          setTimeout(() => { player.isKicking = false; }, 200);
        }
      }
    };

    handleKick(p1.current);
    handleKick(p2.current);

    // Collision Resolving
    resolveCollision(p1.current, ball.current);
    resolveCollision(p2.current, ball.current);
    resolveCollision(p1.current, p2.current);
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Grass
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Field Markings
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 4;
    // Boundary
    ctx.strokeRect(20, 20, CANVAS_WIDTH - 40, CANVAS_HEIGHT - 40);
    // Center line
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 20);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20);
    ctx.stroke();
    // Center circle
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 60, 0, Math.PI * 2);
    ctx.stroke();

    // Goals
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    const goalY = (CANVAS_HEIGHT - GOAL_SIZE) / 2;
    // Left Goal
    ctx.strokeRect(-5, goalY, 25, GOAL_SIZE);
    // Right Goal
    ctx.strokeRect(CANVAS_WIDTH - 20, goalY, 25, GOAL_SIZE);

    // Entities
    [p1.current, p2.current, ball.current].forEach(ent => {
      ctx.save();
      ctx.translate(ent.pos.x, ent.pos.y);
      
      // Shadow
      ctx.beginPath();
      ctx.ellipse(0, ent.radius * 0.8, ent.radius * 0.8, ent.radius * 0.3, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fill();

      // Main shape
      ctx.beginPath();
      ctx.arc(0, 0, ent.radius, 0, Math.PI * 2);
      ctx.fillStyle = ent.color;
      ctx.fill();
      
      // Player specific rendering
      if ('team' in ent) {
        const player = ent as Player;
        // Stroke
        ctx.strokeStyle = player.isKicking ? '#fbbf24' : '#00000033';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Eyes/Face for orientation
        ctx.fillStyle = 'white';
        const dirX = player.vel.x === 0 ? (player.team === 'A' ? 1 : -1) : Math.sign(player.vel.x);
        ctx.fillRect(dirX * 5, -5, 4, 4);
        ctx.fillRect(dirX * 12, -5, 4, 4);
      } else {
        // Ball details
        ctx.strokeStyle = '#1a202c';
        ctx.lineWidth = 1;
        ctx.stroke();
        // Simple hexagon patterns
        ctx.fillStyle = '#1a202c';
        for(let i=0; i<5; i++) {
           const angle = (i / 5) * Math.PI * 2;
           ctx.beginPath();
           ctx.arc(Math.cos(angle)*5, Math.sin(angle)*5, 2, 0, Math.PI*2);
           ctx.fill();
        }
      }
      ctx.restore();
    });
  };

  const loop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    update();
    draw(ctx);
    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [status]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="w-full h-auto cursor-none bg-emerald-600"
    />
  );
};

export default GameCanvas;
