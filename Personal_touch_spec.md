# Personal Touch Spec — sol.dev
## Addon to PORTFOLIO_SPEC.md + ANIMATION_SPEC.md
## Read both previous files first. This layers on top.

---

## The Rule Before Everything

Personal stuff must earn its place. Every reference, every easter egg, every personal detail
must make the reader think one of two things:

  1. "This person has taste" — which extends trust in their engineering/PM judgment
  2. "This is someone I'd actually want to work with" — which is often what tips a hire

If it does neither, it doesn't go in. That's the filter.

---

## Part 1 — References Woven Into Existing Sections

These are not new sections. They are texture inside sections that already exist.
A senior engineer notices them and smiles. A recruiter doesn't even see them.
That's the right balance.

### 1.1 Hero — Terminal Card References

The terminal card already exists. Add these lines into the fake git log:

```
$ git log --oneline -5

a3f1c9b  feat: memeforge local inference (no api cost, finally)
d7e2a10  fix: route optimizer — was slower than Gojo pre-awakening
91bc032  chore: dockerize spring service
b2f3d01  feat: sudoku solver — O(n) backtrack, cleaner than L's plan
7a4c109  docs: updated readme. watched vinland saga. 10/10
```

Rules for commit messages:
- Keep the real technical content first — it's still a commit message
- The reference is the second half, after the dash
- References should be from shows/games that have a REPUTATION for being good taste
  (Vinland Saga, HxH, Berserk > mainstream like Naruto)
- No cringe. If it feels forced, it's forced.

Good reference pool to pick from:
  Anime:  Vinland Saga, Berserk, Ping Pong the Animation, Mushishi, HxH, Planetes
  Games:  Hollow Knight, Celeste, Sekiro, Disco Elysium, Outer Wilds
  Music:  if you play guitar — reference a song you're learning

Additional terminal lines to add (cycle through randomly on page reload):

```javascript
// lib/terminal-lines.ts
// Pick 3-4 randomly on each load. Keep it fresh.

export const terminalLines = [
  { cmd: "now-playing", out: "Periphery — Scarlet (learning the riff)" },
  { cmd: "cat /etc/mood", out: "post-anime-arc. just finished vinland saga s2." },
  { cmd: "uptime", out: "awake 16h. 14h coding. 2h guitar. 0h touching grass." },
  { cmd: "ping life", out: "64 bytes from reality: icmp_seq=1 ttl=21 time=2ms" },
  { cmd: "ls hobbies/", out: "guitar/  anime/  two-wheelers/  hackathons/  movies/" },
  { cmd: "git stash list", out: "stash@{0}: WIP on feature/celeste-100-percent" },
  { cmd: "sudo apt install motivation", out: "already installed. version: berserk-1.0" },
  { cmd: "cat currently-reading.txt", out: "Inspired — Marty Cagan (ch. 12)" },
  { cmd: "df -h /brain", out: "Used: 73G  Free: 27G  Use%: 73%  (learning: +2G/day)" },
];
```

Implementation: on hero mount, pick 2 random lines from this array and render them
in the terminal card after the static lines. Refresh on page reload only, not on a timer.

### 1.2 Project Decisions — Anime/Game Analogies in Reasoning

The decisions log is where you explain your architectural thinking.
Drop ONE analogy per decision — it makes the reasoning memorable AND shows personality.

Examples (use these or write your own — must feel natural, not shoehorned):

**MemeForge — Local vs Cloud:**
"Chose local inference. Think of it like Guts fighting without the Berserker Armor — 
harder, slower, but you own every consequence. No API dependency means no API bill, 
no rate limit, no data leaving the machine."

**Route Optimizer — Algorithm choice:**
"Rolling a custom Dijkstra instead of using Google Maps felt like playing Hollow Knight 
without a guide — painful at first, but you understand every room by the end. 
The knowledge compounds."

**KapdaCraft — Supply first:**
"Supply-side first is just the Monty Hall problem played right. The obvious move 
(build the customer UI) is wrong. The counterintuitive move (win the tailors first) 
is where the actual value is."

Rules for analogies:
- One per decision entry, in the "because" field
- Max 2 sentences
- The analogy must actually illuminate the technical point, not just be a reference
- Never explain the reference (if they get it, they get it)

### 1.3 Skills Section — Subtle Row Labels

In the skills table, add a "context" column for a few rows with tiny text:

```
Tailwind CSS     production    "faster than Levi in season 4"
Backtracking     primary       "used in sudoku + daily life decisions"  
Docker           learning      "currently in the pain arc"
Go               exploring     "like starting a new FromSoft game"
LangChain        learning      "somewhere between episode 1 and understanding"
```

These appear as a third column in the skills table, 11px, --text-tertiary color.
Only show on desktop (hide on mobile — too cramped).
On hover of the row, the context text slides in from opacity 0 (it's a reward for reading carefully).

### 1.4 Footer — The Real "Built By" Line

Replace the generic footer with something that has fingerprints:

```
built by sol in jaipur, india
next.js 14 · framer motion · vercel
fueled by: filter coffee, anime OSTs, and spite
last shipped: [auto-generated timestamp]
currently listening: [hardcoded, update manually every few weeks]
```

The "fueled by" line is the personality. "Spite" is the word that makes people laugh
and remember you. Every engineer understands spite as motivation.

"Currently listening" — hardcode a real song you're actually listening to.
Change it manually every 2-4 weeks. Shows the site is alive and maintained.

### 1.5 404 Page — Full Personality Moment

The 404 page is prime real estate. Nobody expects it to be interesting.
Make it the most personal page on the site.

```
app/not-found.tsx

Layout:
- Big "404" in Fragment Mono
- Subtitle: "you've gone off the map."
- A small ASCII art frame (pick one):

  Option A — Hollow Knight's Shade:
  
      ╔═══╗
      ║ ▲ ║
      ╚═══╝
  "even the shade knows where home is."

  Option B — terminal style:
  
  $ find . -name "this-page" 2>/dev/null
  find: nothing here. maybe check /dev/null
  try: ls ../valid-pages/
  
- Two buttons: [← go back] [→ go home]
- Background: the full dot grid, darker
- A random quote from your favorite show/game appears below the buttons.
  Rotate through 6-8 quotes on each load. Only pick quotes that are
  genuinely interesting — nothing basic.

Good quote pool:
  "I have a dream... that one day..." — Vinland Saga (Askeladd)
  "Abandon your ambitions. Then, I'll let you keep your life." — Griffith, Berserk
  "You can always die. It's living that takes real courage." — Kenshin
  "The only way to deal with an unfree world is to become so absolutely free 
   that your very existence is an act of rebellion." — Camus (not anime but fits)
  "Pain is inevitable. Suffering is optional." — Haruki Murakami
```

---

## Part 2 — The "Human" Section

This is a dedicated section that goes AFTER "About" and BEFORE "Contact".
It is the last thing someone reads before deciding to reach out.
Make it land.

Section ID: `#human`
Section label: `06. outside the code`
Section title: "what I'm actually like"

### 2.1 Layout

Two zones:

**Zone A — "Currently" Dashboard** (top, full width)
A row of 4-5 cards. Each card tracks one interest in real-time (manually updated).
Cards look like mini status panels — same terminal aesthetic as the rest of the site.

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ 🎮 PLAYING       │  │ 📺 WATCHING      │  │ 🎸 LEARNING      │  │ ☕ FUELING       │
│                 │  │                 │  │                 │  │                 │
│ Hollow Knight   │  │ Vinland Saga    │  │ Eruption        │  │ filter coffee   │
│ 87% complete    │  │ Season 2        │  │ Van Halen       │  │ black, always   │
│                 │  │                 │  │ (slowly)        │  │                 │
│ ░░░░░░░░░░ 87%  │  │ ep 17/24        │  │ week 3          │  │ cup #2 today    │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

No emojis in the actual implementation (use SVG icons or Unicode symbols that fit the terminal aesthetic).
Each card is manually updated in `lib/data.ts` — add this object:

```typescript
// lib/data.ts — add this:
export const humanData = {
  playing: {
    title: "Hollow Knight",
    subtitle: "87% — stuck on Radiance",
    progress: 87,          // renders as a thin progress bar, monospace style
    since: "3 weeks ago",
  },
  watching: {
    title: "Vinland Saga",
    subtitle: "Season 2, ep 17/24",
    progress: 71,
    since: "this week",
  },
  learning: {
    title: "Eruption",
    subtitle: "Van Halen — week 3",
    progress: 20,          // honest. 20% of Eruption is still impressive.
    since: "Jan 2025",
  },
  fueling: {
    title: "filter coffee",
    subtitle: "black, always",
    progress: null,        // no progress bar for coffee
    note: "currently: cup 2",
  },
  riding: {                // if you have a bike — add this card
    title: "Royal Enfield",
    subtitle: "weekend escape ritual",
    progress: null,
    note: "jaipur → ajmer road",
  },
};
```

Progress bar style (monospace, not a smooth bar):
```
▓▓▓▓▓▓▓▓▓░░░░  87%
```
Use Unicode block characters ▓ and ░. This is purely a CSS character render.
Calculate filled = Math.round(progress / 100 * 13) blocks.

**Zone B — "Taste" Grid** (below the cards)

A 2-column grid. Left side: things I love. Right side: things that shaped my thinking.
Max 5 items per column. Dense, opinionated, no hedging.

```
THINGS I LOVE                    THINGS THAT SHAPED HOW I THINK
─────────────────────            ────────────────────────────────
Hollow Knight                    Outer Wilds — nothing in tech
  (proof that one person           has made me understand
   can ship something              "discovery > instruction"
   extraordinary)                  more than this game

Vinland Saga S2                  Celeste — Madeline's arc is
  (Askeladd was right)             the best metaphor for
                                   learning to code I've found

Berserk                          Disco Elysium — shows that
  (ship anyway. eclipse             systems thinking is
   or not.)                        actually just empathy
                                   with structure

Filter coffee, black             Ping Pong the Animation
  (simple input, reliable           (talent vs effort,
   output, no nonsense)             still thinking about it)

Long rides, no destination       Mushishi
  (best system design               (some problems don't need
   thinking happens at 80kmph)       solutions, just presence)
```

This is written in a specific voice — short parenthetical commentary after each item.
The tone is: "I've thought about this, not just consumed it."
That's what separates taste from a list of favorites.

**Zone C — The Mini Guitar Interaction** (bottom of section, optional but do it)

A single guitar chord diagram rendered in SVG. Shows the current chord you're learning.
On hover: a subtle string vibration animation plays on the relevant strings.
On click: plays an actual note using the Web Audio API (not a sound file — generated tone).

```typescript
// components/guitar-chord.tsx

// Chord diagram — SVG-based, 6 strings, 5 frets
// Shows finger positions as filled circles
// Open strings as 'O', muted strings as 'X'

// The chord to show: whatever you're actually working on.
// Start with something impressive-looking but not impossible — 
// Dm7 or Am7 looks cool on a fret diagram. Not a G chord.

// Web Audio note generation (NO external library):
function playNote(frequency: number, duration: number = 0.8) {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  // Sawtooth sounds more like a guitar than sine
  oscillator.type = "sawtooth";
  oscillator.frequency.value = frequency;
  
  // Envelope: fast attack, slow decay (plucked string feel)
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

// Guitar string frequencies (standard tuning E2-B3):
const STRING_FREQUENCIES = {
  E2: 82.41,  A2: 110.00, D3: 146.83,
  G3: 196.00, B3: 246.94, E4: 329.63,
};

// When user clicks the chord diagram:
// Play each string in the chord with 80ms delay (simulate strumming)
// Calculate fretted note frequency: freq = openFreq * (2 ^ (fret/12))

// String vibration animation on hover:
// Each active string gets a CSS animation:
// @keyframes vibrate {
//   0%, 100% { transform: translateX(0) }
//   25% { transform: translateX(-1.5px) }
//   75% { transform: translateX(1.5px) }
// }
// animation-duration: 0.08s, animation-iteration-count: 8
// Triggered by adding a class on string hover

// Label under the diagram:
// "Am7 — week 3. sounds almost right."
// This is personality. Honest. Relatable.
```

### 2.2 Section Transitions

The Human section should feel slightly warmer than the rest of the site.
Small adjustments:

- Background: `--bg-surface` instead of `--bg-base` (one shade lighter)
- Section border: top border with a subtle gradient — indigo left → cyan right
  (the two accent colors, symbolizing engineering meets human)
- Font: the "THINGS I LOVE" and "THINGS THAT SHAPED" columns use slightly looser
  line-height (2.0 instead of 1.7) — more breathing room, less technical density

### 2.3 The Two-Wheeler Reference (if you have a bike)

If you ride, add this to the "THINGS I LOVE" column with a small note.
Also add it to the currently panel.

The specific line that works:
"Long rides, no destination (best system design thinking happens at 80kmph)"

This does multiple things:
1. Shows you have a life outside a screen
2. "System design thinking" keeps it connected to the professional context
3. 80kmph is specific — not "fast" — signals you actually ride

---

## Part 3 — Easter Eggs (Scattered, Not Announced)

These exist. Nobody knows about them unless they find them.
Never put "Easter eggs hidden!" anywhere on the site. That defeats the purpose.

### 3.1 Konami Code (already in ANIMATION_SPEC.md)
Upgraded terminal message — add these lines to the easter egg output:

```
$ cat sol.config
{
  "name": "Anush Gupta",
  "alias": "sol",
  "fuel": "filter coffee",
  "guilty_pleasure": "rewatching Ping Pong the Animation",
  "current_grind": "LeetCode + Eruption tabs",
  "philosophy": "ship it. then make it good.",
  "hire_me": true
}
```

### 3.2 Skills Table — Hover Secrets

Three skills have hidden easter eggs on long-hover (1.5 seconds held):

- **C++**: tooltip appears — "DSA or die. mostly die."
- **Docker**: tooltip appears — "containers are just anime arcs. painful, necessary."
- **Go**: tooltip appears — "started because of a blog post. now I can't stop reading Go source."

Implementation: CSS `animation-delay` on a tooltip that only appears after 1.5s hover.
Pure CSS — no JS needed:

```css
.skill-secret-tooltip {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  transition-delay: 0s;
}

.skill-row:hover .skill-secret-tooltip {
  opacity: 1;
  transition-delay: 1.5s;  /* shows after 1.5s hover */
}
```

### 3.3 The Terminal in Hero — Hidden Command

If the user clicks directly on the blinking cursor in the terminal card,
a new "command" is typed and executes:

```
$ sudo make me a sandwich
[sudo] password for sol:
error: sol is not in the sudoers file. 
this incident will be reported. (it won't.)
```

Implementation: onClick on the cursor span, animate a new command typing in,
then show the output. Click again to clear and resume normal state.

### 3.4 About Section — The Hidden Stat

In the "currently reading / building / learning" strip in the About section,
add a fourth column that appears ONLY if the user has been on the page for > 45 seconds:

```
CURRENTLY PROCRASTINATING
leetcode hard problems
(but thinking about them)
```

Implementation:
```typescript
const [showProcrastinating, setShowProcrastinating] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => setShowProcrastinating(true), 45000);
  return () => clearTimeout(timer);
}, []);
```

AnimatePresence fade-in when it appears. The timing means only engaged readers see it.
That's the right audience for this joke.

---

## Part 4 — Content for lib/data.ts (Human Section)

```typescript
// Add to lib/data.ts:

export const humanSection = {
  thingsILove: [
    {
      name: "Hollow Knight",
      note: "proof that one person can ship something extraordinary",
    },
    {
      name: "Vinland Saga S2",
      note: "Askeladd was right",
    },
    {
      name: "Berserk",
      note: "ship anyway. eclipse or not.",
    },
    {
      name: "filter coffee, black",
      note: "simple input, reliable output, no nonsense",
    },
    {
      name: "long rides, no destination",
      note: "best system design thinking happens at 80kmph",
    },
  ],

  thingsThatShapedMe: [
    {
      name: "Outer Wilds",
      note: "nothing in tech has made me understand 'discovery > instruction' more than this game",
    },
    {
      name: "Celeste",
      note: "Madeline's arc is the best metaphor for learning to code I've found",
    },
    {
      name: "Disco Elysium",
      note: "systems thinking is just empathy with structure",
    },
    {
      name: "Ping Pong the Animation",
      note: "talent vs effort. still thinking about it.",
    },
    {
      name: "Mushishi",
      note: "some problems don't need solutions, just presence",
    },
  ],

  currentlyPlaying: {
    title: "Hollow Knight",          // UPDATE THIS
    subtitle: "87% — stuck on Radiance",
    progress: 87,
    since: "3 weeks ago",
  },

  currentlyWatching: {
    title: "Vinland Saga",           // UPDATE THIS
    subtitle: "Season 2, ep 17/24",
    progress: 71,
    since: "this week",
  },

  currentlyLearning: {
    title: "Am7 → Dm7 transition",  // UPDATE THIS
    subtitle: "guitar — week 3",
    progress: 25,
    since: "Jan 2025",
  },

  currentlyFueling: {
    title: "filter coffee",
    subtitle: "black, always",
    note: "cup 2 today",
  },

  currentlyRiding: {
    title: "Royal Enfield",          // REMOVE if you don't ride
    subtitle: "Jaipur → wherever",
    note: "weekend ritual",
  },

  guitarChord: {
    name: "Am7",                     // UPDATE THIS — what you're actually learning
    week: 3,
    honestNote: "sounds almost right.",
    // Finger positions for SVG rendering:
    // string 6 (low E): muted
    // string 5 (A): open (0)
    // string 4 (D): 2nd fret
    // string 3 (G): open (0)
    // string 2 (B): 1st fret
    // string 1 (high E): open (0)
    positions: [null, 0, 2, 0, 1, 0],  // null = muted, 0 = open, n = fret number
    openStrings: [1, 2, 4, 5],
    mutedStrings: [0],
  },
};
```

---

## Part 5 — What NOT to Add (The Cuts)

These were considered and cut. Don't add them:

❌ **A playable mini-game section** — too much. Makes the site feel like a playground, not a portfolio.
   Save this for a personal blog or a separate `/play` page if you want it later.

❌ **Movie ratings or letterboxd embed** — movies are fine but a rated list looks like filler.
   One mention in "things that shaped me" is enough.

❌ **Spotify now-playing widget** — too common. Every dev portfolio has this now.
   The "currently listening" in footer as plain text is more tasteful.

❌ **Anime tier list** — this is a portfolio, not MyAnimeList. One reference in the About bio
   is personality. A tier list is a distraction.

❌ **Car/bike photo gallery** — doesn't belong on a tech portfolio. The line about
   "long rides, 80kmph" communicates the same thing with zero visual noise.

❌ **A "fun facts" section** — this format reads as filler. The personality comes through
   in HOW things are written, not in a dedicated facts block.

---

## Summary — What Gets Added

**Woven into existing sections:**
- Terminal card: randomized git commits with personality, random terminal commands
- Decision log: one analogy per entry (anime/game reference that illuminates the point)
- Skills table: context column with dry humor, secret hover tooltips on 3 skills
- Footer: "fueled by spite" line + manually updated "currently listening"
- 404 page: full personality moment with rotating quotes

**New dedicated section (#human):**
- "Currently" dashboard: 5 cards (playing, watching, guitar, coffee, riding)
- "Things I Love / Things That Shaped Me" two-column grid
- Guitar chord diagram with Web Audio strum + string vibration on hover

**Easter eggs (hidden, never announced):**
- Konami code terminal with updated config output
- Long-hover secret tooltips on 3 skill items
- Click the terminal cursor → sudo sandwich joke
- 45-second timer → "currently procrastinating" column appears in About

**The rule everything follows:**
The personal stuff should make a senior engineer think "this person has taste and is
someone I'd want on my team" — not "this is a fun student project."
Taste is the signal. Everything here is chosen because it signals taste.