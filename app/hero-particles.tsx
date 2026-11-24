"use client";

import { useEffect, useRef } from "react";

const palette = ["#838383", "#aeaeae", "#dedede", "#ffffff"];
const stroke = [[-.76, .76], [-.76, -.76], [0, .08], [.76, -.76], [.76, .76]];

function makeParticle(index: number) {
  const segment = Math.floor(index / palette.length) % 4;
  const [ax, ay] = stroke[segment];
  const [bx, by] = stroke[segment + 1];
  const along = Math.random();
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(Math.random()) * .17;
  const spread = Math.sqrt(Math.random()) * 1.16;

  return {
    mx: ax + (bx - ax) * along + Math.cos(angle) * radius,
    my: ay + (by - ay) * along + Math.sin(angle) * radius,
    mz: (Math.random() - .5) * .35,
    rx: Math.cos(angle) * spread,
    ry: Math.sin(angle) * spread,
    rz: (Math.random() - .5) * .8,
    size: .65 + Math.random() * 1.45,
    dx: 0,
    dy: 0,
  };
}

function heroParticleCenter(width: number, height: number) {
  const compact = width <= 700;
  return { x: width * (compact ? .55 : .755), y: height * (compact ? .74 : .46) };
}

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest("section");
    const context = canvas?.getContext("2d");
    if (!canvas || !hero || !context) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const particles = Array.from({ length: 3200 }, (_, index) => makeParticle(index));
    let width = 1;
    let height = 1;
    let visible = false;
    let frame = 0;
    let yaw = 0;
    let pitch = 0;
    const touch = window.matchMedia("(pointer: coarse)");
    let introComplete = window.scrollY > 0;
    let scrollProgress = 0;
    let formation = preference.matches ? 1 : 0;
    const pointer = { x: 0, y: 0, active: false };

    function draw() {
      frame = 0;
      const still = preference.matches;
      const compact = width <= 700;
      const scale = Math.min(width * (compact ? .37 : .24), height * (compact ? .24 : .39), 355);
      const { x: centerX, y: centerY } = heroParticleCenter(width, height);
      const scrollToForm = width <= 900 || touch.matches;
      if (scrollToForm) scrollProgress = Math.max(scrollProgress, Math.min(1, window.scrollY / 120));

      const target = scrollToForm ? scrollProgress : Number(introComplete);
      formation = still ? 1 : formation + (target - formation) * .09;
      const assembled = formation * formation * (3 - 2 * formation);
      const morph = 1 - assembled;
      yaw += ((pointer.active ? (pointer.x / width - .5) * .85 : 0) - yaw) * .07;
      pitch += ((pointer.active ? (.5 - pointer.y / height) * .55 : 0) - pitch) * .07;

      const turn = still ? 0 : yaw;
      const lean = still ? 0 : pitch;
      const cosY = Math.cos(turn);
      const sinY = Math.sin(turn);
      const cosX = Math.cos(lean);
      const sinX = Math.sin(lean);
      const reach = Math.min(145, width * .23);
      const count = compact ? 1800 : particles.length;

      context!.clearRect(0, 0, width, height);
      for (let color = 0; color < palette.length; color++) {
        context!.fillStyle = palette[color];
        context!.globalAlpha = (.46 + color * .14) * (.37 + assembled * .63);
        for (let index = color; index < count; index += palette.length) {
          const point = particles[index];
          const x = point.mx + (point.rx - point.mx) * morph;
          const y = point.my + (point.ry - point.my) * morph;
          const z = point.mz + (point.rz - point.mz) * morph;
          const depth = z * cosY - x * sinY;
          const perspective = 2.8 / (2.8 - depth);
          const px = centerX + (x * cosY + z * sinY) * scale * perspective;
          const py = centerY + (y * cosX - depth * sinX) * scale * perspective;
          const vx = px - pointer.x;
          const vy = py - pointer.y;
          const distance = pointer.active && !still ? Math.hypot(vx, vy) : reach;
          const force = Math.max(0, 1 - distance / reach) * 114 / Math.max(distance, 1);
          point.dx = still ? 0 : point.dx + (vx * force - point.dx) * .16;
          point.dy = still ? 0 : point.dy + (vy * force - point.dy) * .16;
          const size = point.size * perspective;
          context!.fillRect(px + point.dx, py + point.dy, size, size);
        }
      }

      if (visible && !still) frame = requestAnimationFrame(draw);
    }

    function refresh() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    }

    function resize() {
      const bounds = canvas!.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      refresh();
    }

    function move(event: PointerEvent) {
      if (event.pointerType === "touch" || preference.matches) return;
      const bounds = canvas!.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    }

    function leave() {
      pointer.active = false;
    }

    const completeIntro = () => { introComplete = true; };

    const sizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      refresh();
    });

    sizeObserver.observe(canvas);
    visibilityObserver.observe(hero);
    canvas.addEventListener("merix-intro-complete", completeIntro);
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", leave);
    preference.addEventListener("change", refresh);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      sizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("merix-intro-complete", completeIntro);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      preference.removeEventListener("change", refresh);
    };
  }, []);

  return <canvas ref={canvasRef} className="heroParticles" aria-hidden="true" />;
}
