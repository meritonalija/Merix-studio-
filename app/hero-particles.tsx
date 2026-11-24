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
  const t = Math.random() * Math.PI * 2;
  const band = Math.random() * Math.PI * 2;
  const tube = .12 + Math.random() * .10;

  return {
    mx: ax + (bx - ax) * along + Math.cos(angle) * radius,
    my: ay + (by - ay) * along + Math.sin(angle) * radius,
    mz: (Math.random() - .5) * .35,
    rx: (.64 + tube * Math.cos(band) + .12 * Math.cos(3 * t)) * Math.cos(t),
    ry: (.64 + tube * Math.cos(band) + .12 * Math.cos(3 * t)) * Math.sin(t),
    rz: .28 * Math.sin(3 * t) + tube * Math.sin(band),
    size: .65 + Math.random() * 1.45,
    dx: 0,
    dy: 0,
  };
}

export function heroParticleCenter(width: number, height: number) {
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
    let elapsed = 0;
    let previousTime = 0;
    let yaw = 0;
    let pitch = 0;
    let scrollProgress = 0;
    let lightPulse = 0;
    const pointer = { x: 0, y: 0, active: false };

    function draw(now: number) {
      frame = 0;
      const still = preference.matches;
      if (!still && previousTime) elapsed += Math.min(32, now - previousTime) / 1000;
      previousTime = now;
      const compact = width <= 700;
      const scale = Math.min(width * (compact ? .37 : .24), height * (compact ? .24 : .39), 355);
      const { x: centerX, y: centerY } = heroParticleCenter(width, height);
      lightPulse *= .92;
      scrollProgress += (Math.max(0, Math.min(1, -hero!.getBoundingClientRect().top / height)) - scrollProgress) * .1;

      const morphTime = Math.max(0, elapsed - 4.4);
      const angle = morphTime * .65;
      const cycle = Math.max(0, Math.min(1, (.5 - .65 * Math.cos(angle)) + scrollProgress * .85));
      const morph = still ? 0 : cycle * cycle * (3 - 2 * cycle);
      yaw += ((pointer.active ? (pointer.x / width - .5) * .85 : 0) - yaw) * .07;
      pitch += ((pointer.active ? (.5 - pointer.y / height) * .55 : 0) - pitch) * .07;

      const turn = still ? 0 : yaw + morph * Math.sin(elapsed * .56) * .8;
      const lean = still ? 0 : pitch + morph * .45;
      const cosY = Math.cos(turn);
      const sinY = Math.sin(turn);
      const cosX = Math.cos(lean);
      const sinX = Math.sin(lean);
      const reach = Math.min(145, width * .23);
      const count = compact ? 1800 : particles.length;

      context!.clearRect(0, 0, width, height);
      for (let color = 0; color < palette.length; color++) {
        context!.fillStyle = palette[color];
        context!.globalAlpha = .46 + color * .14;
        for (let index = color; index < count; index += palette.length) {
          const point = particles[index];
          const x = point.mx + (point.rx - point.mx) * morph;
          const y = point.my + (point.ry - point.my) * morph;
          const z = point.mz + (point.rz - point.mz) * morph;
          const depth = z * cosY - x * sinY;
          const perspective = 2.8 / (2.8 - depth);
          const px = centerX + (x * cosY + z * sinY) * scale * perspective * (1 + lightPulse * .13);
          const py = centerY + (y * cosX - depth * sinX) * scale * perspective * (1 + lightPulse * .13);
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
      previousTime = 0;
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

    const releaseLight = () => {
      if (!preference.matches) lightPulse = 1;
    };

    const sizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      refresh();
    });

    sizeObserver.observe(canvas);
    visibilityObserver.observe(hero);
    canvas.addEventListener("merix-light-arrive", releaseLight);
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", leave);
    preference.addEventListener("change", refresh);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      sizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("merix-light-arrive", releaseLight);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      preference.removeEventListener("change", refresh);
    };
  }, []);

  return <canvas ref={canvasRef} className="heroParticles" aria-hidden="true" />;
}
