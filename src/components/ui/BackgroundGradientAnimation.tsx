"use client";

import { useEffect, useRef, useState } from "react";

interface BackgroundGradientAnimationProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  interactive?: boolean;
}

export function BackgroundGradientAnimation({
  children,
  className,
  containerClassName,
  interactive = true,
}: BackgroundGradientAnimationProps) {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set CSS variables for colors — Nevermind emerald/dark palette
    container.style.setProperty("--gradient-background-start", "rgb(2, 8, 4)");
    container.style.setProperty("--gradient-background-end", "rgb(5, 5, 5)");
    container.style.setProperty("--first-color", "0, 150, 105");    // emerald-600
    container.style.setProperty("--second-color", "6, 78, 59");     // emerald-900
    container.style.setProperty("--third-color", "16, 185, 129");   // emerald-500
    container.style.setProperty("--fourth-color", "0, 80, 60");     // dark teal
    container.style.setProperty("--fifth-color", "52, 211, 153");   // emerald-400
    container.style.setProperty("--pointer-color", "16, 185, 129"); // emerald-500
    container.style.setProperty("--size", "80%");
    container.style.setProperty("--blending-value", "hard-light");
  }, []);

  useEffect(() => {
    let animationId: number;

    function move() {
      setCurX((prev) => prev + (tgX - prev) / 20);
      setCurY((prev) => prev + (tgY - prev) / 20);

      if (interactiveRef.current) {
        interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      }

      animationId = requestAnimationFrame(move);
    }

    animationId = requestAnimationFrame(move);
    return () => cancelAnimationFrame(animationId);
  }, [tgX, tgY, curX, curY]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!interactive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTgX(event.clientX - rect.left - rect.width / 2);
    setTgY(event.clientY - rect.top - rect.height / 2);
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${containerClassName ?? ""}`}
      onMouseMove={handleMouseMove}
    >
      <div
        className={`absolute inset-0 ${className ?? ""}`}
        style={{
          background:
            "linear-gradient(to bottom, var(--gradient-background-start), var(--gradient-background-end))",
        }}
      >
        <svg className="hidden">
          <defs>
            <filter id="blurMe">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div className="gradients-container" style={{ filter: "url(#blurMe) blur(40px)", width: "100%", height: "100%" }}>
          <div
            className="absolute animate-first opacity-100"
            style={{
              background: "radial-gradient(circle at center, rgba(var(--first-color), 0.8) 0, rgba(var(--first-color), 0) 50%) no-repeat",
              mixBlendMode: "var(--blending-value)" as never,
              width: "var(--size)",
              height: "var(--size)",
              top: "calc(50% - var(--size) / 2)",
              left: "calc(50% - var(--size) / 2)",
              transformOrigin: "center center",
            }}
          />
          <div
            className="absolute animate-second opacity-100"
            style={{
              background: "radial-gradient(circle at center, rgba(var(--second-color), 0.8) 0, rgba(var(--second-color), 0) 50%) no-repeat",
              mixBlendMode: "var(--blending-value)" as never,
              width: "var(--size)",
              height: "var(--size)",
              top: "calc(50% - var(--size) / 2)",
              left: "calc(50% - var(--size) / 2)",
              transformOrigin: "calc(50% - 400px)",
            }}
          />
          <div
            className="absolute animate-third opacity-100"
            style={{
              background: "radial-gradient(circle at center, rgba(var(--third-color), 0.8) 0, rgba(var(--third-color), 0) 50%) no-repeat",
              mixBlendMode: "var(--blending-value)" as never,
              width: "var(--size)",
              height: "var(--size)",
              top: "calc(50% - var(--size) / 2 + 200px)",
              left: "calc(50% - var(--size) / 2 - 500px)",
              transformOrigin: "calc(50% + 400px)",
            }}
          />
          <div
            className="absolute animate-fourth opacity-70"
            style={{
              background: "radial-gradient(circle at center, rgba(var(--fourth-color), 0.8) 0, rgba(var(--fourth-color), 0) 50%) no-repeat",
              mixBlendMode: "var(--blending-value)" as never,
              width: "var(--size)",
              height: "var(--size)",
              top: "calc(50% - var(--size) / 2)",
              left: "calc(50% - var(--size) / 2)",
              transformOrigin: "calc(50% - 200px)",
            }}
          />
          <div
            className="absolute animate-fifth opacity-100"
            style={{
              background: "radial-gradient(circle at center, rgba(var(--fifth-color), 0.8) 0, rgba(var(--fifth-color), 0) 50%) no-repeat",
              mixBlendMode: "var(--blending-value)" as never,
              width: "calc(var(--size) * 2)",
              height: "calc(var(--size) * 2)",
              top: "calc(50% - var(--size))",
              left: "calc(50% - var(--size))",
              transformOrigin: "calc(50% - 800px) calc(50% + 200px)",
            }}
          />

          {interactive && (
            <div
              ref={interactiveRef}
              className="absolute opacity-70"
              style={{
                background: "radial-gradient(circle at center, rgba(var(--pointer-color), 0.8) 0, rgba(var(--pointer-color), 0) 50%) no-repeat",
                mixBlendMode: "var(--blending-value)" as never,
                width: "100%",
                height: "100%",
                top: "-50%",
                left: "-50%",
              }}
            />
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
