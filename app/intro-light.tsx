"use client";

import { useEffect, useRef } from "react";

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
  const logoRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const logo = logoRef.current;
    const site = logo?.closest(".site");
    const canvas = site?.querySelector(".heroParticles");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations: Animation[] = [];
    let mounted = true;

    function finish() {
      if (mounted) canvas?.dispatchEvent(new Event("merix-intro-complete"));
    }

    const frame = requestAnimationFrame(() => {
      if (!logo || !site || motion.matches || window.scrollY > 0) {
        finish();
        return;
      }

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

      const menuDelay = letterDuration * letterContours.length + 45;
      if (window.matchMedia("(min-width: 901px)").matches) {
        site.querySelectorAll<SVGTextElement>(".navTrace text").forEach((label, index) => {
          animations.push(label.animate([
            { opacity: 0, strokeDashoffset: 0 },
            { opacity: 1, offset: .24 },
            { opacity: 1, offset: .76 },
            { opacity: 0, strokeDashoffset: -14 },
          ], { duration: 420, delay: menuDelay + index * 200 }));
        });
      }
      void Promise.allSettled(animations.map(animation => animation.finished)).then(finish);
    });

    const stop = () => animations.forEach(animation => animation.cancel());
    motion.addEventListener("change", stop);
    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
      stop();
      motion.removeEventListener("change", stop);
    };
  }, []);

  return (
    <svg ref={logoRef} className="brandGlow" viewBox="65 72 515 178" aria-hidden="true">
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
