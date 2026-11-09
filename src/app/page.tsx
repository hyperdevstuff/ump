import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { ConnectorsDiagram } from "@/components/prototype-landing/connectors-diagram";
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
  title: "Sentinel — Uptime monitoring",
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

const BAND = [
  { value: "5 min", label: "Smallest interval" },
  { value: "3", label: "Protocols: HTTP, TCP, ping" },
  { value: "4", label: "Alert channels" },
  { value: "1", label: "Status page per public monitor" },
] as const;

const FEATURES = [
  {
    n: "01",
    title: "Monitor anything, exactly how you want",
    body: "HTTP, TCP or ping — with the interval, method, timeout and pass condition you set. A landing page and a database should never be judged by the same rule.",
    wide: true,
  },
  {
    n: "02",
    title: "Alerts that reach the right place",
    body: "Email, Slack, Discord or webhook, fired only once your failure threshold is crossed — so a single blip never pages the whole team.",
    wide: false,
  },
  {
    n: "03",
    title: "Incidents that keep the full story",
    body: "Downtime opens an incident, not a log line. Detected, investigating, resolved — with a timeline and postmortem notes attached.",
    wide: false,
  },
  {
    n: "04",
    title: "A status page your users trust",
    body: "Publish any monitor and give your users live uptime and recent checks, instead of another reply-all thread.",
    wide: false,
  },
] as const;

const CHANNELS = [
  {
    n: "Email",
    body: "One mail per incident, sent when the failure threshold is crossed — not on the first blip.",
  },
  {
    n: "Slack",
    body: "Posted to the channel you pick, with the monitor, the failure and the time it started.",
  },
  {
    n: "Discord",
    body: "The same message, in the server your on-call already lives in.",
  },
  {
    n: "Webhook",
    body: "A JSON POST to your endpoint, so anything can subscribe: PagerDuty, n8n, your own runbook.",
  },
] as const;

const STEPS = [
  {
    title: "Add a monitor",
    body: "A URL, a host and port, or a host to ping. Set the interval and what counts as a pass.",
  },
  {
    title: "Sentinel checks it on schedule",
    body: "Every check is stored with its status, status code and response time.",
  },
  {
    title: "You hear about it first",
    body: "A failure past your threshold opens an incident and fires your channels.",
  },
];

const FAQ = [
  {
    q: "What can it check?",
    a: "HTTP and HTTPS endpoints with GET, POST or HEAD, arbitrary headers and a JSON or form body. Raw TCP ports. Hosts over ICMP ping. Each monitor picks its protocol, interval and what counts as a pass.",
  },
  {
    q: "What counts as down?",
    a: "You decide. Pass on any status code you list, time out at a threshold you set per monitor, and stay quiet until failures cross the threshold you configured — so a single dropped request does not page anyone.",
  },
  {
    q: "How often does it check?",
    a: "Any interval from 5 minutes up, set per monitor. Every check is stored with its status, status code and response time, so history is there when you need it.",
  },
  {
    q: "Can my users see any of this?",
    a: "Make a monitor public and it gets its own status page with uptime history and recent checks. No account needed to read it, and no customer URLs are exposed anywhere else.",
  },
  {
    q: "Do I need a card to start?",
    a: "No. Create an account, add your first monitor, and the first check runs on your interval in about a minute. No card, no sales call.",
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
          <div className="mx-auto w-full max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
            {/* The copy takes the narrow column and the instrument the wide
                one — the text reads in its measure instead of running to the
                right edge, and the card gets the room its readouts ask for.
                The copy is centred against the card so it sits on the
                instrument's mid line rather than riding its top edge. */}
            <div className="grid w-full items-center gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <h1 className="pl-h1">Find outages before your users do</h1>

                <p className="pl-copy pl-lede mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Checks over HTTP, TCP and ping on an interval you set.
                  Failures become incidents, alert Slack, Discord, webhooks or
                  email, and show on a status page your users can read.
                </p>

                <div className="mt-8">
                  <PrimaryActions size="lg" />
                </div>
              </div>

              {/* The one live thing on the page. */}
              <div className="lg:col-span-7">
                <Reveal>
                  <TelemetryPanel telemetry={telemetry} />
                </Reveal>
                <p className="pl-copy mt-3 text-xs leading-relaxed text-muted-foreground">
                  {telemetry
                    ? "Counts and timings from every monitor on this instance. No customer URLs or names are shown."
                    : "Counts and timings from every monitor on this instance, once a database is connected."}
                </p>
              </div>
            </div>

            {/* The band reads as one ruled instrument strip, part of the hero. */}
            <Reveal className="mt-14 sm:mt-20">
              <dl className="pl-band">
                {BAND.map((item) => (
                  <div key={item.label} className="flex flex-col">
                    <dt className="pl-label order-2 mt-1.5">{item.label}</dt>
                    <dd className="pl-band-value order-1">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* ------------------------------------------------------- features --- */}
        <section id="features" className="scroll-mt-16 border-b border-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <Reveal>
              <h2 className="pl-h2 max-w-2xl">
                Everything between a failed check and a happy user.
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
                  <CardDescription className="pl-copy max-w-md leading-relaxed">
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
                      <CardDescription className="pl-copy leading-relaxed">
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
                  <p className="pl-copy mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {FEATURES[3].body}
                  </p>
                </div>
                {/* An illustrative miniature of /status/[monitorId] — not telemetry. */}
                <figure className="w-full max-w-sm overflow-hidden rounded-lg border border-border bg-background shadow-xs ring-1 ring-foreground/10">
                  <figcaption className="border-b border-border px-3 py-1.5 text-[0.625rem] tracking-[0.06em] text-muted-foreground uppercase">
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

        {/* -------------------------------------------------------- alerts --- */}
        <section id="alerts" className="scroll-mt-16 border-b border-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <Reveal>
              <h2 className="pl-h2 max-w-2xl">
                Alerts land where you already work.
              </h2>
              <p className="pl-copy pl-lede mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                Attach any mix of channels to a monitor. All of them are gated
                on the same failure threshold, so the pager is quiet unless the
                outage is real.
              </p>
            </Reveal>

            {/* The connector picture: Sentinel at the hub, the four channels
                wired to it. The ruled rows below carry the copy, so this
                announces itself as a picture and the channel names stay in
                the document. */}
            <Reveal className="mt-12">
              <ConnectorsDiagram />
            </Reveal>

            <Reveal className="mt-6">
              <div className="pl-rows">
                {CHANNELS.map((channel) => (
                  <div key={channel.n}>
                    <span className="pl-label pt-0.5">{channel.n}</span>
                    <p className="pl-copy max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                      {channel.body}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* --------------------------------------------------- how it works --- */}
        <section
          id="how-it-works"
          className="scroll-mt-16 border-b border-border"
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <Reveal>
              <h2 className="pl-h2 max-w-2xl">From signup to first alert.</h2>
            </Reveal>

            <Reveal className="mt-10">
              <ol className="pl-steps">
                {STEPS.map((step) => (
                  <li key={step.title}>
                    <div className="pt-0.5">
                      <h3 className="text-base font-medium tracking-tight">
                        {step.title}
                      </h3>
                      <p className="pl-copy mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        {/* ------------------------------------------------------------- faq --- */}
        <section id="faq" className="scroll-mt-16 border-b border-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <Reveal>
              <h2 className="pl-h2 max-w-2xl">
                Everything you might be wondering.
              </h2>
            </Reveal>

            <Reveal className="mt-10">
              <div className="pl-faq">
                {FAQ.map((item) => (
                  <details key={item.q} name="faq">
                    <summary className="text-[0.9375rem]">{item.q}</summary>
                    <p className="pl-copy text-sm sm:text-[0.9375rem]">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ------------------------------------------------------------ cta --- */}
        <section className="border-b border-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-32">
            <Reveal>
              <h2 className="pl-h1 max-w-3xl">
                Know it is down before a user tells you.
              </h2>
              <p className="pl-copy pl-lede mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
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
