import { Variants, Transition } from "framer-motion";

// ─── BASE TRANSITIONS ──────────────────────────────────────────────────────

export const spring = {
  soft: { type: "spring", stiffness: 120, damping: 20, mass: 1 },
  snappy: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 },
  bouncy: { type: "spring", stiffness: 300, damping: 15, mass: 1.2 },
  slow: { type: "spring", stiffness: 60, damping: 20, mass: 1.5 },
} satisfies Record<string, Transition>;

export const ease = {
  out: [0.16, 1, 0.3, 1] as const,          // expo out — fast start, slow end
  inOut: [0.76, 0, 0.24, 1] as const,       // strong inOut
  gentle: [0.25, 0.46, 0.45, 0.94] as const, // standard smooth
};

// ─── REUSABLE VARIANTS ────────────────────────────────────────────────────

// Standard fade up — used for most scroll reveals
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(4px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.65, ease: ease.out },
  },
};

// Fade in only — for things that shouldn't move
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: ease.gentle } },
};

// Slide from right — hero card
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60, filter: "blur(6px)" },
  visible: {
    opacity: 1, x: 0, filter: "blur(0px)",
    transition: { duration: 0.8, ease: ease.out, delay: 0.3 },
  },
};

// Stagger container
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

// Stagger item (use inside staggerContainer)
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } },
};

// Scale pop — for badges, tags, buttons on hover
export const scalePop: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.04, transition: spring.snappy },
  tap: { scale: 0.97, transition: spring.snappy },
};

// Underline expand — for nav links
export const underlineExpand: Variants = {
  rest: { scaleX: 0, originX: 0 },
  hover: { scaleX: 1, originX: 0, transition: { duration: 0.25, ease: ease.out } },
};

// Border glow — for project cards
export const cardHover: Variants = {
  rest: { borderColor: "rgba(255,255,255,0.09)" },
  hover: { borderColor: "rgba(108,99,255,0.4)", transition: { duration: 0.2 } },
};

// Accordion open/close
export const accordionContent: Variants = {
  collapsed: { height: 0, opacity: 0, transition: { duration: 0.3, ease: ease.inOut } },
  open: { height: "auto", opacity: 1, transition: { duration: 0.4, ease: ease.out } },
};

export const accordionChevron: Variants = {
  collapsed: { rotate: 0 },
  open: { rotate: 180, transition: spring.snappy },
};
