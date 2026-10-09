import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { LandingNav } from "@/components/prototype-landing/landing-nav";
import { PrimaryActions } from "@/components/prototype-landing/primary-actions";
import { Reveal } from "@/components/prototype-landing/reveal";
import { TelemetryPanel } from "@/components/prototype-landing/telemetry-panel";
import { ThemeToggle } from "@/components/theme-toggle-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSentinelTelemetry } from "@/lib/prototype-landing-telemetry";
import "./landing.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ??
      process.env.APP_URL ??
      "http://localhost:3000",
  ),
  title: "Find outages before your users do",
  description:
    "Sentinel checks your endpoints over HTTP, TCP and ping, opens an incident the moment a check fails, and alerts Slack, Discord, webhooks or email.",
  openGraph: {
    title: "Find outages before your users do — Sentinel",
    description:
      "Uptime monitoring with incidents, multi-channel alerts and a public status page per monitor.",
    type: "website",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find outages before your users do — Sentinel",
    description:
      "Uptime monitoring with incidents, multi-channel alerts and a public status page per monitor.",
  },
};

export const dynamic = "force-dynamic";

const SPECS = [
  ["Protocol", "HTTP, HTTPS, TCP, PING"],
  ["Interval", "Any, from 5 minutes"],
  ["Request", "GET, POST, HEAD"],
  ["Headers", "Arbitrary, per monitor"],
  ["Body", "JSON or form, POST only"],
  ["Pass on", "Any status code you list"],
  ["Timeout", "Per monitor, in ms"],
  ["Visibility", "Public or private"],
] as const;

const FEATURES = [
  {
    n: "01",
    title: "The check is yours to define",
    body: "One interval, method, timeout and pass condition per monitor, so a marketing page and a database are not measured by the same rule.",
    wide: true,
  },
  {
    n: "02",
    title: "Alerts land where you already work",
    body: "Email, Slack, Discord or webhook, behind a failure threshold so one blip does not wake the whole team.",
    wide: false,
  },
  {
    n: "03",
    title: "Incidents keep their root cause",
    body: "Downtime opens an incident, not a log line. Detected, investigating, resolved, with a timeline and postmortem notes attached.",
    wide: false,
  },
  {
    n: "04",
    title: "A status page your users can read",
    body: "Make a monitor public and support gets uptime history and recent checks instead of another reply-all thread.",
    wide: false,
  },
] as const;

const STEPS = [
  {
    n: "01",
    title: "Add a monitor",
    body: "A URL, a host and port, or a host to ping. Set the interval and what counts as a pass.",
  },
  {
    n: "02",
    title: "Sentinel checks it on schedule",
    body: "Every check is stored with its status, status code and response time.",
  },
  {
    n: "03",
    title: "You hear about it first",
    body: "A failure past your threshold opens an incident and fires your channels.",
  },
];

const FOOTER_LINKS = [
  { href: "/sign-up", label: "Create account" },
  { href: "/sign-in", label: "Sign in" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/status", label: "Public status" },
];

export default async function LandingPage() {
  const telemetry = await getSentinelTelemetry();

  return (
    <div className="pl-root flex min-h-screen flex-col bg-background text-foreground">
      <LandingNav />

      <main className="flex-1">
        {/* ----------------------------------------------------------- hero --- */}
        <section className="border-b border-border">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <h1 className="text-[clamp(2.25rem,7vw,3.75rem)] leading-[1.05] font-medium tracking-tighter">
                Find outages before your users do
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Checks over HTTP, TCP and ping on an interval you set. Failures
                become incidents, alert Slack, Discord, webhooks or email, and
                show on a status page your users can read.
              </p>

              <div className="mt-8">
                <PrimaryActions size="lg" />
              </div>
            </div>

            {/* The one live thing on the page. */}
            <div className="lg:col-span-5 lg:pt-10">
              <Reveal>
                <TelemetryPanel telemetry={telemetry} />
              </Reveal>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {telemetry
                  ? "Counts and timings from every monitor on this instance. No customer URLs or names are shown."
                  : "Counts and timings from every monitor on this instance, once a database is connected."}
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- features --- */}
        <section id="features" className="scroll-mt-16 border-b border-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <Reveal>
              <h2 className="max-w-2xl text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight font-medium tracking-tight">
                Everything between a failed check and a user complaining.
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-6 lg:grid-cols-12">
              {/* Wide: the spec list needs the room. */}
              <Card className="gap-4 lg:col-span-7">
                <CardHeader>
                  <div className="flex items-baseline gap-3">
                    <span className="pl-label">{FEATURES[0].n}</span>
                    <CardTitle className="text-lg tracking-tight">
                      {FEATURES[0].title}
                    </CardTitle>
                  </div>
                  <CardDescription className="max-w-md leading-relaxed">
                    {FEATURES[0].body}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="divide-y divide-border border-t border-border">
                    {SPECS.map(([term, value]) => (
                      <div
                        key={term}
                        className="flex items-baseline justify-between gap-4 py-2"
                      >
                        <dt className="pl-label">{term}</dt>
                        <dd className="text-xs text-muted-foreground tabular-nums sm:text-sm">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>

              {/* Narrow column: two stacked. Deliberately not 3-up. */}
              <div className="grid gap-6 lg:col-span-5">
                {FEATURES.slice(1, 3).map((feature) => (
                  <Card key={feature.n} className="gap-3">
                    <CardHeader>
                      <div className="flex items-baseline gap-3">
                        <span className="pl-label">{feature.n}</span>
                        <CardTitle className="text-lg tracking-tight">
                          {feature.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="leading-relaxed">
                        {feature.body}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            {/* Full width, with the status-page miniature beside the copy. */}
            <Card className="mt-6 gap-0 px-6 py-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
                {/*
                  A plain div, not CardHeader. CardHeader is an auto-rows-min
                  grid, and inside this flex row a max-width on it collapses to
                  the width of its narrowest child — one word per line.
                */}
                <div className="lg:max-w-md">
                  <div className="flex items-baseline gap-3">
                    <span className="pl-label">{FEATURES[3].n}</span>
                    <CardTitle className="text-lg tracking-tight">
                      {FEATURES[3].title}
                    </CardTitle>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {FEATURES[3].body}
                  </p>
                </div>
                {/* An illustrative miniature of /status/[monitorId] — not telemetry. */}
                <figure className="w-full max-w-sm overflow-hidden rounded-lg border border-border bg-background shadow-xs ring-1 ring-foreground/10">
                  <figcaption className="border-b border-border px-3 py-1.5 text-[0.625rem] tracking-[0.12em] text-muted-foreground uppercase">
                    Public page, as your users see it
                  </figcaption>
                  <div className="flex items-center justify-between gap-3 px-3 py-2">
                    <span className="text-xs">api.acme.dev</span>
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="pl-dot" data-state="up" />
                      Operational
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 px-3 py-2.5">
                    <span className="pl-label">Uptime</span>
                    <span className="text-sm tabular-nums">99.98%</span>
                  </div>
                  <div className="flex items-baseline gap-2 border-t border-border px-3 py-2.5">
                    <span className="pl-label">Response</span>
                    <span className="text-sm tabular-nums">128ms</span>
                  </div>
                </figure>
              </div>
            </Card>
          </div>
        </section>

        {/* --------------------------------------------------- how it works --- */}
        <section
          id="how-it-works"
          className="scroll-mt-16 border-b border-border"
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <Reveal>
              <h2 className="max-w-2xl text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight font-medium tracking-tight">
                From signup to first alert.
              </h2>
            </Reveal>

            <Reveal className="pl-stagger">
              <ol className="mt-10 grid gap-6 sm:grid-cols-3">
                {STEPS.map((step) => (
                  <li key={step.n}>
                    <Card className="h-full gap-2">
                      <CardHeader>
                        <span className="pl-label">{step.n}</span>
                        <CardTitle className="tracking-tight">
                          {step.title}
                        </CardTitle>
                        <CardDescription className="leading-relaxed">
                          {step.body}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        {/* ------------------------------------------------------------ cta --- */}
        <section className="border-b border-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-32">
            <Reveal>
              <h2 className="max-w-3xl text-[clamp(1.75rem,4.5vw,3rem)] leading-[1.1] font-medium tracking-tight">
                Know it is down before a user tells you.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                Add your first monitor in about a minute. No card, no sales
                call.
              </p>
              <div className="mt-8">
                <PrimaryActions size="lg" />
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------- footer --- */}
      <footer className="mt-auto border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 text-sm font-medium tracking-tight">
              <BrandLogo size={20} />
              <span>Sentinel</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Uptime monitoring for websites, APIs and services.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="pl-rule-link text-xs"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2">
            <Link href="/status" className="pl-rule-link text-xs">
              Platform status
            </Link>
            <a
              href="https://buymeacoffee.com/hyperdevstuff"
              className="pl-rule-link text-xs"
              rel="noreferrer noopener"
              target="_blank"
            >
              Support the project
            </a>
            {/*
              Theme lives here rather than in the header. It is a preference,
              not a destination, so it does not compete with the section
              anchors and the two CTAs for the most valuable row on the page.
            */}
            <div className="mt-1 flex items-center gap-1.5">
              <ThemeToggle />
              <span className="pl-rule-link text-xs">Theme</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Sentinel
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
