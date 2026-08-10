
# careMP — Investor Demo Build Plan

Fully static, mobile-first web app. All data hardcoded, no backend, no auth, no AI calls. Every screen prepopulated with realistic sample data so it reads as a launch-ready product. Chat is in-memory only.

## Step 1 — Pick a visual direction

The directions tool refused (it expects an existing UI to redesign, and this is a new build). Instead, pick one written direction below. All three share: soft blue/teal primary + emerald/amber/coral status, Inter or Manrope, 20–24px rounded cards, outline icons only, no emoji, generous whitespace, gradient radial rings, sparklines with no gridlines, glassmorphic floating AI button.

**A. Serene Clinic** — Very airy pure-white base. Single accent teal (#3AB0A2-ish). Pastel status chips. Home leads with one huge radial Overall Health Score at the top; everything else understated below. Closest to Apple Health / Headspace. Safest and most "medical trust."

**B. Living Twin** — Off-white light mode with a signature dark-mode Twin screen. Deep midnight-navy panels behind the Twin avatar, luminous teal + emerald glows radiating from the silhouette (breathing halo). More atmospheric, avatar-dominant. Closest to Oura / Tesla app. Most memorable for investors, "signature screen" reads strongest.

**C. Calm Bento** — Light base with a warm sand undertone balanced by cool teal accents. Home is a bento grid — mixed-size cards, Overall Score large, Recovery medium, vitals as smaller tiles. Twin uses a 2-col circular grid. Closest to Notion / Linear health-app hybrid. Densest information per screen while staying calm.

**Reply with A, B, or C** (or ask for tweaks). Default if you don't specify: **B**, since your spec emphasizes the Twin as the signature screen.

## Step 2 — Foundation

- Tailwind v4 tokens in `src/styles.css` for the chosen direction (background, foreground, primary teal, accent blue, status emerald/amber/coral, glass surface, ring gradient stops). All colors as oklch semantic tokens — zero hardcoded colors in components.
- Import Manrope (headings) + Inter (body) via `<link>` in `__root.tsx` head. Register in `@theme`.
- Mobile viewport locked: max-width container (~440px) centered on desktop, edge-to-edge on mobile. Preview device set to mobile.
- Shared primitives in `src/components/care/`: `RadialScore`, `Sparkline`, `StatCard`, `StatusChip`, `SectionHeader`, `GlassButton`, `PhoneShell`, `BottomNav`, `TopBar`, `SkeletonCard`, `CountUp`, `RingProgress`, `TimelineItem`, `AvatarGlow`, `AiBubble`, `SuggestionChip`.
- Motion via `tw-animate-css` + a lightweight count-up hook. No heavy animation lib.
- Mock data centralized in `src/data/mock.ts` (user, vitals, twin, family, providers, appointments, reports, notifications, chat seed).
- Outline icons from `lucide-react` (already available). Zero emoji anywhere.

## Step 3 — Routing (TanStack Start)

Bottom nav 5 tabs + auxiliary screens. All routes are static views reading from mock data.

```text
/                       Splash → auto-forwards to /onboarding on first visit, else /home
/onboarding             4-step flow (Welcome, Goals, Wearable, Profile, Notifications)
/auth                   Login card (visual only)
/home                   Home Dashboard
/companion              AI Health Companion chat
/twin                   My Health Twin (signature)
/twin/$system           Body system detail (cardiovascular, etc.)
/family                 Family Circle
/family/$memberId       Member detail
/support                Health Support Network (marketplace)
/support/$category      Provider list
/support/provider/$id   Provider detail + booking flow
/support/booking        Booking confirmation with live status
/vitals/$metric         Vital detail (heart-rate, sleep, spo2, activity, bp)
/reports                Reports list
/reports/$id            Medical Report Viewer
/notifications          Grouped notifications
/premium                Upgrade tiers
/profile                Profile hub
/profile/$section       Personal Info / Wearables / Medications / Privacy / Settings / Subscription
```

Each route file gets its own `head()` with a unique careMP-specific title + description. `__root.tsx` metadata updated (no more "Lovable App").

Bottom nav + floating AI button rendered from `__root.tsx` around `<Outlet />`, hidden on `/`, `/onboarding`, `/auth`, `/support/booking` (fullscreen states).

## Step 4 — Screen build order

Grouped so each batch is coherent and I can verify visually as I go.

**Batch 1 — Shell + Home.** PhoneShell, BottomNav, TopBar with avatar menu (dropdown), floating AI button, splash, onboarding (4 steps + progress dots + skip + celebratory finish), auth. Home Dashboard with time-aware greeting, animated radial Overall Health Score (82) + trend arrow, Recovery Score (76), Today's AI Insight ("Your resting heart rate dropped 4 bpm this week — sleep consistency is paying off." with expandable "why"), Daily Wellness Mission ("Take a 10-min walk after lunch" with complete toggle), Quick Health Summary strip, vitals cards (HR 68 bpm, BP 118/76, Sleep 7h 32m, Activity 8,240 steps, SpO2 98%) each with sparkline + status color, Medication Reminder (Atorvastatin 10mg — mark as taken), Upcoming Appointment (Dr. Nadia Rahman, Cardiology, Thu 3:30 PM), Recent Alerts (collapsible, "No new alerts" empty), Weekly Trends chart, Quick Actions row.

**Batch 2 — Twin + system detail.** Central AvatarGlow silhouette with breathing pulse, Overall Twin Health 84, Twin Confidence 78% (info tooltip), Health Age card (Biological 34 / Actual 38), Current State badge ("Recovering"), 2-col circular progress grid for 6 body systems with score/status/trend, AI Twin Summary paragraph card (warm tone), "What Has Changed" horizontal chip timeline (Sleep +12%, Stress −18%, Resting HR −4 bpm, Steps +22%), Health Memory vertical milestone timeline with icons/dates (Started Gym, Lost 10kg, BP Improved, Recovered from Flu, Started Atorvastatin, Annual Checkup), Twin Confidence detail expandable with data-source progress bars. System detail page reused for all six with per-system mock history + factors.

**Batch 3 — AI Companion.** Chat UI with bubbles (user solid right / AI soft left + avatar), voice input mock with waveform animation, contextual suggested-question chips, upload button, typing indicator, rich inline response cards (medication explainer card, lab-value-with-range card), searchable history sidebar drawer. In-memory only (resets on refresh) — seed with 3 sample turns so it never looks empty. No AI wired in.

**Batch 4 — Family Circle + Support marketplace + booking flow.** Family grid (4 seeded members: mother, father, spouse, child) with photo, relationship, status badge, mini score; member detail with shared score, wellness update, meds, appointments, emergency contacts with quick-call, caregiver feed, per-member privacy toggles, empty state with invite flow. Support: 7 category tiles, provider list with photo/credentials/rating/distance/ETA/price/availability, provider detail, time-slot picker, address confirm, mock payment, confirmation with animated live status stepper (Requested → Confirmed → On the way → Arrived).

**Batch 5 — Auxiliary.** Vital detail pages with day/week/month/year toggle, reading history, AI insight, recommendations. Medical Report Viewer with AI-extracted highlighted values + normal-range indicators + "Ask AI about this" shortcut. Notifications grouped with swipe actions + read/unread. Premium upgrade with 3 tiered pricing cards + single CTA. Profile hub linking to all sub-sections (all rendered with real seeded content, not stubs). Empty states illustrated for wearable/family/appointments/data/chat.

## Step 5 — Polish pass

- Every score/metric uses CountUp or radial fill on mount — nothing static.
- SkeletonCard on first paint of data-heavy screens (~400ms simulated) so it never flashes blank.
- Consistent status color language audited across Home, Twin, Family.
- Page transitions 200–300ms ease.
- Pull-to-refresh gesture on Home + Twin (mock refetch spinner).
- Every primary action reachable in ≤2 taps from Home.
- Grep for emoji + `text-white`/`bg-black` hardcoded classes; remove any.
- Update `__root.tsx` head with careMP title/description/og.
- Replace `src/routes/index.tsx` placeholder with the real Splash + auto-forward.

## Technical notes

- No Lovable Cloud, no Supabase, no server functions, no AI SDK. Everything client-side static.
- No image generation needed — the Twin avatar is an SVG silhouette + CSS glow; family/provider photos use a small set of consistent illustrated avatars (SVG placeholders or Unsplash portrait URLs, TBD in Step 2).
- Chart primitives are hand-rolled SVG (sparklines, radial rings, weekly bars) — no chart library — for full styling control and zero runtime cost.
- No dependencies to add beyond what's in the template (lucide-react, tw-animate-css already there). If motion needs escalate mid-build I'll add `motion` (framer) — flagged, not preinstalled.

## What this plan does NOT include

- No real authentication, no persisted user data, no backend, no real AI responses, no real payments, no real wearable sync, no real map/geolocation.
- No push notifications (in-app notification screen only).
- No dark-mode toggle (Direction B has a dark Twin screen by design; app-wide dark mode is out of scope for the demo).
- No i18n, no accessibility audit beyond semantic HTML + focus rings + alt text.

Reply with **A / B / C** for the direction and I'll build.
