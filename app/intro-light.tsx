"use client";

import { useEffect, useRef } from "react";
import { heroParticleCenter } from "./hero-particles";

export function IntroLight() {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = lightRef.current;
    const site = light?.closest(".site");
    const logo = site?.querySelector<HTMLElement>(".brandGlow");
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

      const sweep = logo.animate([
        { opacity: 0, "--logo-beam": "-24%" },
        { opacity: 1, "--logo-beam": "25%" },
        { opacity: 1, "--logo-beam": "80%" },
        { opacity: 0, "--logo-beam": "125%" },
      ], { duration: 950, easing: "ease-in-out" });
      animations.push(sweep);

      const travelDuration = 1850;
      const travelDelay = 895;
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
