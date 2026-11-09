"use client";

import { motion, useReducedMotion } from "motion/react";
import type React from "react";
import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedBeamProps extends React.SVGProps<SVGSVGElement> {
  containerRef: React.RefObject<HTMLElement | null>;
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientColors?: [string, string];
  startYOffset?: number;
  endYOffset?: number;
}

/**
 * Magic UI's animated beam, vendored rather than pulled through the registry:
 * one client component, no extra dependency beyond the already-installed
 * `motion`. The path is a single quadratic curve between the two elements'
 * centres, bowed by `curvature`; a light band sweeps along it by animating
 * the gradient's x1/x2. Reduced motion gets a static gradient.
 */
export const AnimatedBeam = ({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientColors = ["#FF007F", "#7C3AED"],
  startYOffset = 0,
  endYOffset = 0,
  className,
  ...svgProps
}: AnimatedBeamProps) => {
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const gradientId = useId();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const updatePath = () => {
      const container = containerRef.current;
      const from = fromRef.current;
      const to = toRef.current;
      if (!(container && from && to)) return;

      const containerRect = container.getBoundingClientRect();
      const fromRect = from.getBoundingClientRect();
      const toRect = to.getBoundingClientRect();

      setSvgDimensions({
        width: containerRect.width,
        height: containerRect.height,
      });

      const startX = fromRect.left - containerRect.left + fromRect.width / 2;
      const startY = fromRect.top - containerRect.top + fromRect.height / 2;
      const endX = toRect.left - containerRect.left + toRect.width / 2;
      const endY = toRect.top - containerRect.top + toRect.height / 2;

      const controlPointX = (startX + endX) / 2;
      const controlPointY = (startY + endY) / 2 + curvature;

      setPathD(
        `M ${startX},${startY + startYOffset} Q ${controlPointX},${controlPointY} ${endX},${endY + endYOffset}`,
      );
    };

    updatePath();

    const resizeObserver = new ResizeObserver(updatePath);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [containerRef, fromRef, toRef, curvature, startYOffset, endYOffset]);

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-0 left-0 transform-gpu stroke-2",
        className,
      )}
      {...svgProps}
    >
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      <path
        d={pathD}
        strokeWidth={pathWidth}
        stroke={`url(#${gradientId})`}
        strokeLinecap="round"
      />
      <defs>
        {reducedMotion ? (
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1={svgDimensions.width / 2}
            y1={0}
            x2={svgDimensions.width / 2}
            y2={svgDimensions.height}
          >
            <Stop color={gradientColors[0]} opacity={0} />
            <Stop color={gradientColors[0]} />
            <Stop color={gradientColors[1]} offset="32.5%" />
            <Stop color={gradientColors[0]} offset="100%" opacity={0} />
          </linearGradient>
        ) : (
          <motion.linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            initial={{
              x1: reverse ? svgDimensions.width : 0,
              x2: reverse ? svgDimensions.width * 2 : 0,
            }}
            animate={{
              x1: reverse ? [svgDimensions.width, 0] : [0, svgDimensions.width],
              x2: reverse
                ? [svgDimensions.width * 2, 0]
                : [0, svgDimensions.width * 2],
            }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 0.5,
              delay: 0.4,
            }}
          >
            <Stop color={gradientColors[0]} opacity={0} />
            <Stop color={gradientColors[0]} />
            <Stop color={gradientColors[1]} offset="32.5%" />
            <Stop color={gradientColors[0]} offset="100%" opacity={0} />
          </motion.linearGradient>
        )}
      </defs>
    </svg>
  );
};

/*
 * Gradient stops take their colour through style, not the attribute, so CSS
 * tokens (var(--primary)) are legal here the same way they are in CSS.
 */
function Stop({
  color,
  opacity,
  offset,
}: {
  color: string;
  opacity?: number;
  offset?: string;
}) {
  return (
    <stop style={{ stopColor: color }} stopOpacity={opacity} offset={offset} />
  );
}
