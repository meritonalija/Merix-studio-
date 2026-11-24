"use client";

import { useEffect, useRef } from "react";
import { heroParticleCenter } from "./hero-particles";

// The five letter contours come from the existing Merix wordmark.
const letterContours = [
  [
    "M158,166 143,152 141,152 83,204 82,204 73,213 72,213 72,214 106,214Z",
    "M86,185 101,173 107,167 107,118 108,117 147,148 160,161 163,162 183,144 247,91 210,91 161,135 160,135 155,130 150,127 140,118 100,86 95,83 86,75Z",
    "M239,109 233,113 214,130 207,135 200,142 171,166 169,169 179,179 180,179 211,150 219,144 220,145 220,179 239,179Z",
  ],
  [
    "M250,107 250,179 328,179 328,163 270,163 268,161 268,152 270,150 325,150 325,135 269,135 268,134 268,124 270,122 327,122 327,107Z",
  ],
  [
    "M429,116 424,111 418,108 410,107 409,106 388,106 387,107 337,107 351,121 407,121 410,122 414,127 413,132 408,136 339,136 339,179 357,179 357,153 358,152 380,152 407,179 432,179 405,153 410,151 415,151 425,146 430,140 432,135 432,130 433,128Z",
  ],
  [
    "M445,106 445,179 463,179 463,106Z",
  ],
  [
    "M474,106 510,141 510,142 473,179 496,180 535,143 498,107 496,106Z",
    "M527,159 527,160 548,180 572,180 539,148Z",
    "M575,107 549,107 528,128 528,129 529,129 540,140Z",
  ],
];
const letterDuration = 455;

export function LogoTrace() {
  return (
    <svg className="brandGlow" viewBox="65 72 515 178" aria-hidden="true">
      {letterContours.map((contours) => (
        <g key={contours[0]}>
          {contours.map((contour) => <path key={contour} d={contour} pathLength={1} />)}
        </g>
      ))}
    </svg>
  );
}

export function MenuTrace({ label }: { label: string }) {
  return (
    <span className="navLabel">
      {label}
      <svg className="navTrace" aria-hidden="true">
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle">{label}</text>
      </svg>
    </span>
  );
}

export function IntroLight() {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = lightRef.current;
    const site = light?.closest(".site");
    const logo = site?.querySelector<SVGSVGElement>(".brandGlow");
    const canvas = site?.querySelector<HTMLCanvasElement>(".heroParticles");
    const burst = light?.querySelector<HTMLElement>(".introLightBurst");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!light || !site || !logo || !canvas || !burst || motion.matches || window.scrollY > 0) return;

    const animations: Animation[] = [];
    const frame = requestAnimationFrame(() => {
      const origin = light.getBoundingClientRect();
      const logoBounds = logo.getBoundingClientRect();
      const canvasBounds = canvas.getBoundingClientRect();
      const center = heroParticleCenter(canvasBounds.width, canvasBounds.height);
      const x = canvasBounds.left - origin.left + center.x;
      const y = canvasBounds.top - origin.top + center.y;
      const startX = logoBounds.right - origin.left;
      const startY = logoBounds.top + logoBounds.height / 2 - origin.top;
      const targets = Array.from(site.querySelectorAll(".navigation a, .headerTools button"))
        .map(target => target.getBoundingClientRect())
        .filter(rect => rect.width > 0 && rect.height > 0);

      const stops = targets.map(rect => `L ${rect.left + rect.width / 2 - origin.left} ${rect.bottom + 5 - origin.top}`);
      const last = targets.at(-1);
      const turnY = last ? last.bottom + 5 - origin.top : startY;
      const route = `M ${startX} ${startY} ${stops.join(" ")} Q ${x + 82} ${turnY + 25} ${x} ${y}`;
      light.style.setProperty("--intro-route", `path("${route}")`);
      burst.style.left = `${x}px`;
      burst.style.top = `${y}px`;

      Array.from(logo.querySelectorAll("g")).forEach((letter, index) => {
        for (const contour of letter.querySelectorAll("path")) {
          animations.push(contour.animate([
            { strokeDashoffset: .24, opacity: 0 },
            { strokeDashoffset: .08, opacity: 1, offset: .12 },
            { strokeDashoffset: -.83, opacity: 1, offset: .86 },
            { strokeDashoffset: -1, opacity: 0 },
          ], { duration: letterDuration + 45, delay: index * letterDuration }));
        }
      });

      const travelDelay = letterDuration * letterContours.length;
      const travelDuration = 2000;
      const menuTiming = Array.from(site.querySelectorAll<SVGTextElement>(".navTrace text"))
        .filter(label => label.getBoundingClientRect().width > 0);
      menuTiming.forEach((label, index) => {
        animations.push(label.animate([
          { opacity: 0, strokeDashoffset: 0 },
          { opacity: 1, offset: .24 },
          { opacity: 1, offset: .76 },
          { opacity: 0, strokeDashoffset: -14 },
        ], { duration: 420, delay: travelDelay + 90 + index * 200 }));
      });

      const trail = Array.from(light.querySelectorAll<HTMLElement>(".introLightDot"));
      trail.forEach((dot, index) => {
        const travel = dot.animate([
          { offsetDistance: "0%", opacity: 0 },
          { offsetDistance: "8%", opacity: 1 },
          { offsetDistance: "88%", opacity: 1 },
          { offsetDistance: "100%", opacity: 0 },
        ], { duration: travelDuration, delay: travelDelay + index * 34, easing: "cubic-bezier(.35, 0, .55, 1)" });
        if (index === 0) travel.onfinish = () => canvas.dispatchEvent(new Event("merix-light-arrive"));
        animations.push(travel);
      });

      const release = burst.animate([
        { scale: .2, opacity: 0 },
        { scale: .45, opacity: .8, offset: .16 },
        { scale: 2.5, opacity: 0 },
      ], { duration: 680, delay: travelDelay + travelDuration - 100, easing: "ease-out" });
      animations.push(release);
    });

    function stop() {
      cancelAnimationFrame(frame);
      for (const animation of animations) animation.cancel();
    }

    window.addEventListener("resize", stop);
    motion.addEventListener("change", stop);
    return () => {
      stop();
      window.removeEventListener("resize", stop);
      motion.removeEventListener("change", stop);
    };
  }, []);

  return (
    <div ref={lightRef} className="introLight" aria-hidden="true">
      <span className="introLightDot" />
      <span className="introLightDot" />
      <span className="introLightDot" />
      <span className="introLightBurst" />
    </div>
  );
}
