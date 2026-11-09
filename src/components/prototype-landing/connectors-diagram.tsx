"use client";

import { IconBrandDiscord } from "@tabler/icons-react";
import { Mail, Slack, Webhook } from "lucide-react";
import type React from "react";
import { forwardRef, useRef } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { cn } from "@/lib/utils";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border border-border bg-background p-3 shadow-xs",
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

const BEAM_COLORS: [string, string] = ["var(--muted)", "var(--primary)"];

/**
 * The connectors diagram: Sentinel at the hub, the four alert channels in a
 * row beneath it, one animated beam per wire. Each beam is drawn outward, from
 * the hub to its channel. Decorative by design — the ruled rows below this
 * figure carry the actual copy, so the diagram announces itself as a picture
 * and the channel names stay in the document.
 */
export function ConnectorsDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const slackRef = useRef<HTMLDivElement>(null);
  const discordRef = useRef<HTMLDivElement>(null);
  const webhookRef = useRef<HTMLDivElement>(null);

  return (
    <div
      role="img"
      aria-label="Diagram: Sentinel connected to Email, Slack, Discord and Webhook"
      className="relative mx-auto flex h-[240px] w-full max-w-xl flex-col items-center justify-between overflow-hidden py-5"
      ref={containerRef}
    >
      <Circle ref={hubRef} className="size-16 border-foreground/15">
        <BrandLogo size={26} />
      </Circle>

      <div className="flex w-full flex-row items-center justify-between">
        <Circle ref={emailRef}>
          <Mail className="size-5 text-muted-foreground" />
        </Circle>
        <Circle ref={slackRef}>
          <Slack className="size-5 text-muted-foreground" />
        </Circle>
        <Circle ref={discordRef}>
          <IconBrandDiscord className="size-5 text-muted-foreground" />
        </Circle>
        <Circle ref={webhookRef}>
          <Webhook className="size-5 text-muted-foreground" />
        </Circle>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={hubRef}
        toRef={emailRef}
        curvature={40}
        reverse
        pathColor="var(--border)"
        gradientColors={BEAM_COLORS}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={hubRef}
        toRef={slackRef}
        curvature={40}
        reverse
        pathColor="var(--border)"
        gradientColors={BEAM_COLORS}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={hubRef}
        toRef={discordRef}
        curvature={40}
        pathColor="var(--border)"
        gradientColors={BEAM_COLORS}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={hubRef}
        toRef={webhookRef}
        curvature={40}
        pathColor="var(--border)"
        gradientColors={BEAM_COLORS}
      />
    </div>
  );
}
