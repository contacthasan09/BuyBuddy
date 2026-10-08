"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { api } from "@/lib/api";
import type { Category } from "@/types";

/* ——————————————————————————————————————————————
   Palette — Maison edition (adapted for dark hero)
—————————————————————————————————————————————— */
const T = {
  ink: "#0E0A07",
  bone: "#F7F1E3",
  gold: "#B8935A",
  goldBright: "#D4B478",
  goldLeaf: "#E8D4A0",
  wine: "#5A1A1F",
};

/* ═══════════════════════════════════════════════════════
   ROTATING HEADLINES / SUBTITLES — Elevated copy
   ═══════════════════════════════════════════════════════ */
const HEADLINES = [
  { a: "Curated", b: "pieces,", c: "delivered." },
  { a: "Expedited", b: "shipping,", c: "nationwide." },
  { a: "Seamless", b: "cash on", c: "delivery." },
  { a: "Trusted", b: "by", c: "collectors." },
] as const;

const SUBTITLES = [
  "Quality assured products with complimentary nationwide delivery and easy 7-day returns.",
  "Order in moments. Pay securely when your package arrives at your door.",
  "No accounts required. Just exceptional quality, delivered with care.",
  "Join our community of discerning clients across Bangladesh.",
] as const;

const ROTATE_MS = 4200;

/* ═══════════════════════════════════════════════════════
   VIDEO PAIRS
   ═══════════════════════════════════════════════════════ */
const VIDEO_SLOTS = [
  { fwd: "v-scene-fwd", rev: "v-scene-rev", fwdDur: 2.08, revDur: 2.08, fwdHold: 0.08, revHold: 0.18 },
  { fwd: "v-light-fwd", rev: "v-light-rev", fwdDur: 2.08, revDur: 2.04, fwdHold: 0.08, revHold: 0.08 },
  { fwd: "v-clothing-fwd", rev: "v-clothing-rev", fwdDur: 2.08, revDur: 2.08, fwdHold: 0.08, revHold: 0.08 },
  { fwd: "v-cast-fwd", rev: "v-cast-rev", fwdDur: 3.0, revDur: 2.48, fwdHold: 0.08, revHold: 0.08 },
] as const;

const VIDEO_SRCS: Record<string, string> = {
  "v-clothing-fwd": "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/video-1.mp4",
  "v-clothing-rev": "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/video-1-reverse.mp4",
  "v-scene-fwd": "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/video-2.mp4",
  "v-scene-rev": "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/video-2-reverse.mp4",
  "v-light-fwd": "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/video-3.mp4",
  "v-light-rev": "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/video-3-reverse.mp4",
  "v-cast-fwd": "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/video-4.mp4",
  "v-cast-rev": "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/video-4-reverse.mp4",
};

const CAP_POS = [
  { left: "-5px", width: "calc(20% + 5px)" },
  { left: "20%", width: "20%" },
  { left: "40%", width: "20%" },
  { left: "60%", width: "20%" },
  { left: "80%", width: "calc(20% + 5px)" },
];

/* ═══════════════════════════════════════════════════════
   FALLBACK CATEGORIES
   ═══════════════════════════════════════════════════════ */
const FALLBACK_CATEGORIES: Category[] = [
  { _id: "fallback-shop", name: "Shop", slug: "shop" },
  { _id: "fallback-gadgets", name: "Gadgets", slug: "gadgets" },
  { _id: "fallback-home", name: "Home", slug: "home" },
  { _id: "fallback-beauty", name: "Beauty", slug: "beauty" },
];

/* ═══════════════════════════════════════════════════════
   BRANCH CONFIG
   ═══════════════════════════════════════════════════════ */
interface BranchConfig {
  fwd: string;
  rev: string;
  fwdDur: number;
  revDur: number;
  fwdHold: number;
  revHold: number;
  label: string;
  href: string;
}

type BranchKey = "b0" | "b1" | "b2" | "b3";
const BRANCH_KEYS: BranchKey[] = ["b0", "b1", "b2", "b3"];

function buildBranches(cats: Category[]): Record<BranchKey, BranchConfig> {
  const chosen = cats.slice(0, 4);
  const out = {} as Record<BranchKey, BranchConfig>;

  BRANCH_KEYS.forEach((key, i) => {
    const slot = VIDEO_SLOTS[i];
    const cat = chosen[i];
    out[key] = {
      fwd: slot.fwd,
      rev: slot.rev,
      fwdDur: slot.fwdDur,
      revDur: slot.revDur,
      fwdHold: slot.fwdHold,
      revHold: slot.revHold,
      label: cat?.name || FALLBACK_CATEGORIES[i].name,
      href: cat ? `/products?category=${cat._id}` : "/products",
    };
  });

  return out;
}

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function LTXScene() {
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);
  const noticeTextRef = useRef<HTMLSpanElement>(null);

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const tokenRef = useRef(0);
  const lockRef = useRef(false);
  const sceneRef = useRef<"base" | BranchKey>("base");
  const focusedBtnRef = useRef<HTMLButtonElement | null>(null);
  const pairReadyRef = useRef<Record<BranchKey, boolean>>({ b0: false, b1: false, b2: false, b3: false });
  const pendingNavRef = useRef<string | null>(null);
  const branchesRef = useRef<Record<BranchKey, BranchConfig>>(buildBranches(FALLBACK_CATEGORIES));

  const [isMobile, setIsMobile] = useState(false);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const cartCount = useCart((s) => s.itemCount());

  const [btnStates, setBtnStates] = useState<Record<BranchKey, { disabled: boolean; label: string; active: boolean; reset: boolean }>>(() => {
    const init = buildBranches(FALLBACK_CATEGORIES);
    return {
      b0: { disabled: true, label: init.b0.label, active: false, reset: false },
      b1: { disabled: true, label: init.b1.label, active: false, reset: false },
      b2: { disabled: true, label: init.b2.label, active: false, reset: false },
      b3: { disabled: true, label: init.b3.label, active: false, reset: false },
    };
  });

  useEffect(() => {
    let cancelled = false;
    api.getCategories().then((res) => {
      if (cancelled) return;
      let arr: any[] = [];
      if (Array.isArray(res)) arr = res;
      else if (Array.isArray((res as any)?.items)) arr = (res as any).items;
      else if (Array.isArray((res as any)?.data)) arr = (res as any).data;

      const cleaned: Category[] = arr
        .filter((c) => c && typeof c === "object" && c._id && c.name)
        .map((c) => ({
          _id: String(c._id),
          name: String(c.name),
          slug: String(c.slug || String(c.name).toLowerCase().replace(/\s+/g, "-")),
          description: c.description ? String(c.description) : undefined,
          image: c.image ? String(c.image) : undefined,
        }));

      if (cleaned.length > 0) {
        setCategories(cleaned);
        const newBranches = buildBranches(cleaned);
        branchesRef.current = newBranches;
        setBtnStates((prev) => {
          const next = { ...prev };
          BRANCH_KEYS.forEach((key) => {
            next[key] = { ...prev[key], label: newBranches[key].label };
          });
          return next;
        });
        BRANCH_KEYS.forEach((br) => markPair(br));
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;
    const h = setInterval(() => setHeadlineIndex((i) => (i + 1) % HEADLINES.length), ROTATE_MS);
    const s = setInterval(() => setSubtitleIndex((i) => (i + 1) % SUBTITLES.length), ROTATE_MS);
    const delay = setTimeout(() => setSubtitleIndex(1), 400);
    return () => { clearInterval(h); clearInterval(s); clearTimeout(delay); };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1081px)");
    const close = () => setMenuOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const announce = useCallback((msg: string) => {
    if (liveRef.current) liveRef.current.textContent = msg;
  }, []);

  const setCapsule = useCallback((index: number) => {
    const p = CAP_POS[index] || CAP_POS[0];
    const el = controllerRef.current;
    if (!el) return;
    el.style.setProperty("--cap-left", p.left);
    el.style.setProperty("--cap-width", p.width);
  }, []);

  const updateLabelOpacity = useCallback((highlight: boolean) => {
    const label = document.getElementById("label-cell");
    if (label) {
      label.style.opacity = highlight ? "0.5" : "1";
      label.style.transition = "opacity 300ms var(--retake-ease)";
    }
  }, []);

  const clearAllButtonStyles = useCallback(() => {
    document.querySelectorAll<HTMLButtonElement>(".ltx-cell[data-branch]").forEach((b) => {
      b.style.transform = "";
      b.style.filter = "";
      b.style.opacity = "";
      b.style.pointerEvents = "";
      b.classList.remove("active-cell");
    });
  }, []);

  const markPair = useCallback((branch: BranchKey) => {
    const b = branchesRef.current[branch];
    const fwd = videoRefs.current[b.fwd];
    const rev = videoRefs.current[b.rev];
    if (fwd && fwd.readyState >= 2 && rev && rev.readyState >= 2) {
      pairReadyRef.current[branch] = true;
      if (!lockRef.current && sceneRef.current === "base") {
        setBtnStates((prev) => ({ ...prev, [branch]: { ...prev[branch], disabled: false } }));
      }
    }
  }, []);

  const showBase = useCallback(() => {
    Object.keys(videoRefs.current).forEach((id) => {
      const v = videoRefs.current[id];
      if (v) { v.classList.remove("visible"); try { v.pause(); } catch {} }
    });
    const base = videoRefs.current["v-clothing-fwd"];
    if (base) {
      base.currentTime = 0;
      base.classList.add("visible");
      activeVideoRef.current = base;
    }
  }, []);

  const waitFirstFrame = useCallback((video: HTMLVideoElement, myToken: number) => {
    return new Promise<void>((resolve, reject) => {
      let settled = false;
      let deadline: ReturnType<typeof setTimeout> | null = null;
      const rafIds: number[] = [];
      let frameCb: number | null = null;

      const cleanup = () => {
        if (frameCb != null && "cancelVideoFrameCallback" in video) { try { (video as any).cancelVideoFrameCallback(frameCb); } catch {} }
        rafIds.forEach((id) => cancelAnimationFrame(id));
        if (deadline) clearTimeout(deadline);
        document.removeEventListener("visibilitychange", onVis);
      };
      const succeed = () => { if (settled || myToken !== tokenRef.current) return; settled = true; cleanup(); resolve(); };
      const fail = (reason?: string) => { if (settled || myToken !== tokenRef.current) return; settled = true; cleanup(); reject(new Error(reason || "frame timeout")); };
      const startDeadline = () => { if (deadline) clearTimeout(deadline); deadline = setTimeout(() => fail("First-frame timeout"), 12000); };
      const onVis = () => {
        if (document.hidden) { if (deadline) clearTimeout(deadline); try { video.pause(); video.currentTime = 0; } catch {} }
        else { startDeadline(); try { const p = video.play(); if (p && p.catch) p.catch(() => {}); } catch {} }
      };
      document.addEventListener("visibilitychange", onVis);
      startDeadline();

      if (typeof (video as any).requestVideoFrameCallback === "function") {
        const onFrame = (_now: number, meta: { mediaTime: number }) => {
          if (myToken !== tokenRef.current) return;
          if (meta.mediaTime <= 0.5 && video.readyState >= 2) succeed();
          else frameCb = (video as any).requestVideoFrameCallback(onFrame);
        };
        frameCb = (video as any).requestVideoFrameCallback(onFrame);
      } else {
        const check = () => {
          if (myToken !== tokenRef.current) return;
          if (video.readyState >= 2 && !video.paused && video.currentTime < 0.5) { succeed(); return; }
          const id = requestAnimationFrame(() => requestAnimationFrame(check));
          rafIds.push(id);
        };
        const onPlay = () => { video.removeEventListener("playing", onPlay); check(); };
        video.addEventListener("playing", onPlay);
        check();
      }
    });
  }, []);

  const seekToZero = useCallback((video: HTMLVideoElement) => {
    return new Promise<void>((resolve) => {
      if (video.currentTime <= 0.001) { resolve(); return; }
      const onSeeked = () => { video.removeEventListener("seeked", onSeeked); resolve(); };
      video.addEventListener("seeked", onSeeked);
      try { video.currentTime = 0; } catch { resolve(); }
      setTimeout(() => { video.removeEventListener("seeked", onSeeked); resolve(); }, 2000);
    });
  }, []);

  const monitorHold = useCallback((video: HTMLVideoElement, holdBefore: number, myToken: number, onHold: () => void) => {
    let endedHandled = false;
    let rafId: number | null = null;
    const cleanup = () => { if (rafId) cancelAnimationFrame(rafId); video.removeEventListener("ended", onEnded); };
    const onEnded = () => { if (endedHandled || myToken !== tokenRef.current) return; endedHandled = true; cleanup(); try { video.pause(); } catch {} onHold(); };
    const tick = () => {
      if (myToken !== tokenRef.current) { cleanup(); return; }
      const dur = video.duration;
      if (dur && isFinite(dur) && video.currentTime >= dur - holdBefore) { endedHandled = true; cleanup(); try { video.pause(); } catch {} onHold(); return; }
      rafId = requestAnimationFrame(tick);
    };
    video.addEventListener("ended", onEnded);
    rafId = requestAnimationFrame(tick);
    return cleanup;
  }, []);

  const goForward = useCallback(async (branch: BranchKey, btn: HTMLButtonElement) => {
    if (lockRef.current || sceneRef.current !== "base") return;
    if (!pairReadyRef.current[branch]) return;

    lockRef.current = true;
    tokenRef.current += 1;
    const myToken = tokenRef.current;
    const branchCfg = branchesRef.current[branch];
    announce(`Transitioning to ${branchCfg.label}`);

    if (document.activeElement === btn) focusedBtnRef.current = btn;
    clearAllButtonStyles();

    setBtnStates((prev) => {
      const next = { ...prev };
      BRANCH_KEYS.forEach((k) => { next[k] = { ...next[k], disabled: true, active: false, reset: false }; });
      return next;
    });

    const stage = stageRef.current;
    const controller = controllerRef.current;
    if (stage) stage.classList.add("title-hidden");

    if (controller) {
      controller.classList.add("collapsed");
      const btnRect = btn.getBoundingClientRect();
      const ctrlRect = controller.getBoundingClientRect();
      const targetX = ctrlRect.left + ctrlRect.width / 2;
      const targetY = ctrlRect.top + 36;
      const dx = targetX - (btnRect.left + btnRect.width / 2);
      const dy = targetY - (btnRect.top + btnRect.height / 2);

      btn.style.transition = "transform 980ms var(--retake-slow-ease), opacity 420ms var(--retake-ease), filter 420ms var(--retake-ease)";
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
      btn.classList.add("active-cell");
    }

    const target = videoRefs.current[branchCfg.fwd];
    const prev = activeVideoRef.current;
    if (!target) { lockRef.current = false; return; }

    try {
      target.pause();
      await seekToZero(target);
      if (myToken !== tokenRef.current) return;

      const playPromise = target.play().catch(() => {});
      const framePromise = waitFirstFrame(target, myToken);
      await Promise.all([playPromise, framePromise]);
      if (myToken !== tokenRef.current) return;

      if (prev) prev.classList.remove("visible");
      target.classList.add("visible");
      activeVideoRef.current = target;

      monitorHold(target, branchCfg.fwdHold, myToken, () => {
        if (myToken !== tokenRef.current) return;
        sceneRef.current = branch;
        if (controller) { controller.classList.add("selected"); controller.classList.remove("collapsed"); }

        btn.style.transition = "none";
        btn.style.transform = "";
        btn.style.filter = "";
        btn.style.opacity = "1";
        btn.classList.add("active-cell");
        void btn.offsetWidth;
        btn.style.transition = "opacity 520ms var(--retake-ease), filter 520ms var(--retake-ease)";

        setBtnStates((prev) => {
          const next = { ...prev };
          BRANCH_KEYS.forEach((k) => {
            if (k === branch) next[k] = { disabled: false, label: "Reset", active: true, reset: true };
            else next[k] = { disabled: true, label: branchesRef.current[k].label, active: false, reset: false };
          });
          return next;
        });

        if (focusedBtnRef.current) { try { focusedBtnRef.current.focus({ preventScroll: true }); } catch {} focusedBtnRef.current = null; }
        lockRef.current = false;
        announce(`${branchCfg.label} selected.`);

        if (pendingNavRef.current) {
          const dest = pendingNavRef.current;
          pendingNavRef.current = null;
          announce(`Opening ${branchCfg.label}…`);
          setTimeout(() => router.push(dest), 260);
        }
      });
    } catch {
      if (myToken !== tokenRef.current) return;
      lockRef.current = false;
      announce("Playback error. Retry available.");
      setNoticeVisible(true);
      if (noticeTextRef.current) noticeTextRef.current.textContent = "Could not play transition.";
      if (pendingNavRef.current) {
        const dest = pendingNavRef.current;
        pendingNavRef.current = null;
        router.push(dest);
      }
    }
  }, [announce, seekToZero, waitFirstFrame, monitorHold, clearAllButtonStyles, router]);

  const goReverse = useCallback(async (branch: BranchKey, btn: HTMLButtonElement) => {
    if (lockRef.current || sceneRef.current === "base") return;

    lockRef.current = true;
    tokenRef.current += 1;
    const myToken = tokenRef.current;
    announce("Returning to base");

    setBtnStates((prev) => {
      const next = { ...prev };
      BRANCH_KEYS.forEach((k) => { next[k] = { ...next[k], disabled: true }; });
      return next;
    });

    const controller = controllerRef.current;
    const stage = stageRef.current;
    const branchCfg = branchesRef.current[branch];

    if (controller) {
      controller.classList.remove("selected");
      controller.classList.add("collapsed");
      setTimeout(() => {
        if (myToken !== tokenRef.current) return;
        controller.classList.remove("collapsed");
        setCapsule(0);
        updateLabelOpacity(false);
      }, 60);
    }

    btn.style.transition = "opacity 420ms var(--retake-ease), filter 420ms var(--retake-ease)";
    btn.style.opacity = "0";
    btn.style.filter = "blur(10px)";

    setTimeout(() => {
      if (myToken !== tokenRef.current) return;
      clearAllButtonStyles();
      setBtnStates((prev) => {
        const next = { ...prev };
        BRANCH_KEYS.forEach((k) => { next[k] = { disabled: true, label: branchesRef.current[k].label, active: false, reset: false }; });
        return next;
      });
    }, 100);

    const target = videoRefs.current[branchCfg.rev];
    const prev = activeVideoRef.current;
    if (!target) { lockRef.current = false; return; }

    try {
      target.pause();
      await seekToZero(target);
      if (myToken !== tokenRef.current) return;

      const playPromise = target.play().catch(() => {});
      const framePromise = waitFirstFrame(target, myToken);
      await Promise.all([playPromise, framePromise]);
      if (myToken !== tokenRef.current) return;

      if (prev) prev.classList.remove("visible");
      target.classList.add("visible");
      activeVideoRef.current = target;

      monitorHold(target, branchCfg.revHold, myToken, () => {
        if (myToken !== tokenRef.current) return;
        sceneRef.current = "base";
        lockRef.current = false;
        clearAllButtonStyles();

        setBtnStates((prev) => {
          const next = { ...prev };
          BRANCH_KEYS.forEach((k) => { next[k] = { disabled: !pairReadyRef.current[k], label: branchesRef.current[k].label, active: false, reset: false }; });
          return next;
        });

        if (stage) stage.classList.remove("title-hidden");
        setCapsule(0);
        updateLabelOpacity(false);
        announce("Base scene restored.");
      });
    } catch {
      if (myToken !== tokenRef.current) return;
      lockRef.current = false;
      setNoticeVisible(true);
      if (noticeTextRef.current) noticeTextRef.current.textContent = "Could not play transition.";
    }
  }, [announce, seekToZero, waitFirstFrame, monitorHold, setCapsule, updateLabelOpacity, clearAllButtonStyles]);

  const onCellClick = useCallback((branch: BranchKey, e: React.MouseEvent<HTMLButtonElement>) => {
    if (lockRef.current) return;
    const btn = e.currentTarget;
    if (sceneRef.current === "base") {
      pendingNavRef.current = branchesRef.current[branch].href;
      goForward(branch, btn);
    } else if (sceneRef.current === branch && btnStates[branch].reset) {
      goReverse(branch, btn);
    }
  }, [goForward, goReverse, btnStates]);

  const onPointerEnter = useCallback((index: number) => {
    if (lockRef.current || sceneRef.current !== "base" || isMobile) return;
    setCapsule(index);
    updateLabelOpacity(index > 0);
  }, [isMobile, setCapsule, updateLabelOpacity]);

  const onControllerLeave = useCallback(() => {
    if (lockRef.current || sceneRef.current !== "base" || isMobile) return;
    const focused = document.activeElement;
    let still = false;
    document.querySelectorAll(".ltx-cell[data-branch]").forEach((b) => { if (b === focused) still = true; });
    if (!still) { setCapsule(0); updateLabelOpacity(false); }
  }, [isMobile, setCapsule, updateLabelOpacity]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const el = controllerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--glass-x", `${x}%`);
    el.style.setProperty("--glass-y", `${y}%`);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia("(max-width: 700px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    Object.keys(VIDEO_SRCS).forEach((id) => {
      const el = document.getElementById(id) as HTMLVideoElement | null;
      if (el) {
        videoRefs.current[id] = el;
        const onReady = () => {
          BRANCH_KEYS.forEach((br) => {
            const cfg = branchesRef.current[br];
            if (cfg.fwd === id || cfg.rev === id) markPair(br);
          });
        };
        if (el.readyState >= 2) onReady();
        el.addEventListener("loadeddata", onReady);
        el.addEventListener("canplaythrough", onReady);
      }
    });

    const base = videoRefs.current["v-clothing-fwd"];
    if (base) {
      if (base.readyState >= 2) showBase();
      else base.addEventListener("loadeddata", showBase, { once: true });
    }

    setCapsule(0);
    announce("Loading scene media…");
    const t = setTimeout(() => { BRANCH_KEYS.forEach(markPair); }, 8000);
    return () => clearTimeout(t);
  }, [markPair, showBase, setCapsule, announce]);

  const handleRetry = () => {
    setNoticeVisible(false);
    pendingNavRef.current = null;
    sceneRef.current = "base";
    const stage = stageRef.current;
    const controller = controllerRef.current;
    if (stage) stage.classList.remove("title-hidden");
    if (controller) controller.classList.remove("collapsed", "selected");
    clearAllButtonStyles();
    setBtnStates(() => {
      const next = {} as any;
      BRANCH_KEYS.forEach((k) => { next[k] = { disabled: !pairReadyRef.current[k], label: branchesRef.current[k].label, active: false, reset: false }; });
      return next;
    });
    setCapsule(0);
    showBase();
  };

  const currentHeadline = HEADLINES[headlineIndex];
  const currentSubtitle = SUBTITLES[subtitleIndex];

  return (
    <>
      <style jsx global>{`
        :root {
          --retake-ease: cubic-bezier(0.22, 1, 0.36, 1);
          --retake-slow-ease: cubic-bezier(0.65, 0, 0.35, 1);
          --cap-left: -5px;
          --cap-width: calc(20% + 5px);
          --glass-x: 24%;
          --glass-y: 8%;
          --maison-ink: ${T.ink};
          --maison-bone: ${T.bone};
          --maison-gold: ${T.gold};
          --maison-gold-bright: ${T.goldBright};
          --maison-gold-leaf: ${T.goldLeaf};
        }

        .ltx-stage {
          position: relative;
          isolation: isolate;
          width: 100%;
          height: 70vh;
          height: 70dvh;
          min-height: 560px;
          overflow: hidden;
          background: var(--maison-ink);
          color: var(--maison-bone);
          font-family: var(--font-fraunces, "Fraunces"), Georgia, serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .ltx-media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          z-index: 0;
          pointer-events: none;
          visibility: hidden;
        }
        .ltx-media.visible { visibility: visible; }

        .ltx-hero {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
        }

        .ltx-hero-title-wrap {
          position: absolute;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
          width: min(920px, calc(100vw - 48px));
          height: clamp(56px, 6.5vw, 96px);
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .ltx-headline {
          display: inline-flex;
          align-items: baseline;
          gap: 0.22em;
          white-space: nowrap;
          text-align: center;
          font-family: var(--font-fraunces, "Fraunces"), Georgia, serif;
          font-size: clamp(44px, 5.5vw, 82px);
          font-weight: 400;
          line-height: 0.94;
          letter-spacing: -0.02em;
          color: var(--maison-bone);
          text-shadow: 0 2px 30px rgba(0, 0, 0, 0.5);
        }
        .ltx-headline .word {
          display: inline-block;
          opacity: 0;
          transform: translateY(28px);
          filter: blur(10px);
          animation: word-in 900ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .ltx-headline .word:nth-child(1) { animation-delay: 0ms; }
        .ltx-headline .word:nth-child(2) { animation-delay: 90ms; }
        .ltx-headline .word:nth-child(3) { animation-delay: 180ms; }
        .ltx-headline .word.hero-serif {
          font-style: italic;
          font-weight: 400;
          color: var(--maison-gold-bright);
        }
        @keyframes word-in {
          0% { opacity: 0; transform: translateY(28px); filter: blur(10px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        .ltx-stage.title-hidden .ltx-hero-title-wrap,
        .ltx-stage.title-hidden .ltx-hero-sub-wrap {
          opacity: 0;
          filter: blur(12px);
          transform: translate(-50%, -10px);
          transition: opacity 700ms var(--retake-ease), filter 700ms var(--retake-ease), transform 700ms var(--retake-ease);
        }

        .ltx-hero-sub-wrap {
          position: absolute;
          top: 34%;
          left: 50%;
          transform: translateX(-50%);
          width: min(620px, calc(100vw - 48px));
          height: 3.2em;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          pointer-events: none;
          transition: opacity 700ms var(--retake-ease), filter 700ms var(--retake-ease), transform 700ms var(--retake-ease);
        }
        .ltx-subtitle {
          font-family: var(--font-instrument, "Instrument Sans"), sans-serif;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.6;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-align: center;
          color: rgba(232, 212, 160, 0.7);
          text-shadow: 0 1px 12px rgba(0, 0, 0, 0.4);
          opacity: 0;
          transform: translateY(14px);
          filter: blur(6px);
          animation: subtitle-in 850ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes subtitle-in {
          0% { opacity: 0; transform: translateY(14px); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        .ltx-controller {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%);
          width: min(880px, calc(100vw - 48px));
          height: 72px;
          z-index: 20;
        }
        .ltx-track {
          position: absolute;
          top: 4px;
          left: 0;
          width: 100%;
          height: 64px;
          border-radius: 999px;
          background: rgba(14, 10, 7, 0.65);
          border: 1px solid rgba(184, 147, 90, 0.3);
          backdrop-filter: blur(16px) saturate(120%);
          -webkit-backdrop-filter: blur(16px) saturate(120%);
          box-shadow: 0 14px 38px rgba(0, 0, 0, 0.3), inset 1px 1px 0 rgba(232, 212, 160, 0.1);
          transition: left 980ms var(--retake-slow-ease), width 980ms var(--retake-slow-ease), opacity 400ms linear 650ms;
          pointer-events: none;
        }
        .ltx-track.glass::before, .ltx-track.glass::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
        }
        .ltx-track.glass::before {
          background: radial-gradient(120% 150% at var(--glass-x, 24%) var(--glass-y, 8%), rgba(232, 212, 160, 0.15), rgba(232, 212, 160, 0) 53%), linear-gradient(115deg, rgba(232, 212, 160, 0.08), rgba(232, 212, 160, 0) 42%);
        }
        .ltx-track.glass::after {
          padding: 1px;
          background: conic-gradient(from 225deg, var(--maison-gold-bright), rgba(232, 212, 160, 0.35), var(--maison-bone), rgba(232, 212, 160, 0.35), var(--maison-gold-bright));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.2;
        }
        .ltx-capsule {
          position: absolute;
          top: -1px;
          left: var(--cap-left, -5px);
          width: var(--cap-width, calc(20% + 5px));
          height: 72px;
          border-radius: 999px;
          background: rgba(184, 147, 90, 0.12);
          border: 1px solid rgba(184, 147, 90, 0.5);
          backdrop-filter: blur(20px) saturate(140%);
          -webkit-backdrop-filter: blur(20px) saturate(140%);
          box-shadow: 0 11px 28px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(232, 212, 160, 0.2);
          transition: left 620ms var(--retake-ease), width 620ms var(--retake-ease), background 420ms var(--retake-ease);
          pointer-events: none;
          z-index: 1;
        }
        .ltx-capsule.glass::before, .ltx-capsule.glass::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
        }
        .ltx-capsule.glass::before {
          background: radial-gradient(120% 150% at var(--glass-x, 24%) var(--glass-y, 8%), rgba(232, 212, 160, 0.2), rgba(232, 212, 160, 0) 53%), linear-gradient(115deg, rgba(232, 212, 160, 0.1), rgba(232, 212, 160, 0) 42%);
        }
        .ltx-capsule.glass::after {
          padding: 1px;
          background: conic-gradient(from 225deg, var(--maison-gold-bright), rgba(232, 212, 160, 0.4), var(--maison-bone), rgba(232, 212, 160, 0.4), var(--maison-gold-bright));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.25;
        }
        .ltx-cells {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          align-items: center;
          z-index: 2;
        }
        .ltx-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 0 14px;
          font-family: var(--font-instrument, "Instrument Sans"), sans-serif;
          font-size: 13px;
          font-weight: 500;
          line-height: 1.15;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          white-space: nowrap;
          background: transparent;
          border: 0;
          border-radius: 999px;
          color: var(--maison-gold-leaf);
          cursor: pointer;
          transition: color 420ms var(--retake-ease), opacity 420ms var(--retake-ease), filter 420ms var(--retake-ease), transform 980ms var(--retake-slow-ease);
        }
        .ltx-cell.label {
          cursor: default;
          pointer-events: none;
          font-weight: 400;
          letter-spacing: 0.2em;
          color: rgba(232, 212, 160, 0.6);
        }
        .ltx-cell:disabled { cursor: default; }
        .ltx-cell.reset-label {
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-thickness: 1px;
          font-weight: 600;
          letter-spacing: 0.1em;
        }
        .ltx-cell.active-cell {
          color: var(--maison-bone);
          font-weight: 600;
        }
        .ltx-controller.collapsed .ltx-track {
          left: calc(50% - 96px);
          width: 192px;
          opacity: 0;
        }
        .ltx-controller.collapsed .ltx-capsule {
          left: calc(50% - 100px);
          width: 200px;
          background: rgba(184, 147, 90, 0.08);
          transition: left 980ms var(--retake-slow-ease), width 980ms var(--retake-slow-ease), background 420ms var(--retake-ease);
        }
        .ltx-controller.collapsed .ltx-cell:not(.active-cell) {
          opacity: 0;
          filter: blur(10px);
          transform: scale(0.94);
          pointer-events: none;
        }
        .ltx-controller.selected .ltx-track {
          opacity: 0;
          pointer-events: none;
        }
        .ltx-controller.selected .ltx-capsule {
          left: calc(50% - 100px);
          width: 200px;
          background: rgba(184, 147, 90, 0.15);
        }
        .ltx-controller.selected .ltx-cell:not(.active-cell) {
          opacity: 0;
          pointer-events: none;
          visibility: hidden;
        }
        .ltx-controller.selected .ltx-cell.active-cell {
          grid-column: 1 / -1;
          opacity: 1;
          filter: none;
          transform: none;
          pointer-events: auto;
          visibility: visible;
        }

        .ltx-navbar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: calc(22px + env(safe-area-inset-top)) 40px 22px;
        }
        .ltx-navbar .ltx-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          height: 24px;
          pointer-events: auto;
          text-decoration: none;
          color: var(--maison-gold-leaf);
          flex-shrink: 0;
        }
        .ltx-navbar .ltx-logo svg {
          height: 24px;
          width: auto;
          display: block;
        }
        .ltx-navbar .ltx-meta {
          display: flex;
          align-items: center;
          gap: clamp(24px, 2.5vw, 40px);
          margin-right: auto;
          font-family: var(--font-instrument, "Instrument Sans"), sans-serif;
          font-size: 13px;
          font-weight: 400;
          line-height: 1.2;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(232, 212, 160, 0.7);
        }
        .ltx-navbar .ltx-meta .meta-serif {
          font-family: var(--font-fraunces, "Fraunces"), Georgia, serif;
          font-style: italic;
          font-weight: 400;
          font-size: 14px;
          letter-spacing: -0.01em;
          text-transform: none;
          color: var(--maison-bone);
        }
        .ltx-navbar .ltx-nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .ltx-navbar .ltx-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid rgba(184, 147, 90, 0.4);
          background: rgba(184, 147, 90, 0.05);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--maison-gold-leaf);
          position: relative;
          transition: background 250ms, border-color 250ms, transform 200ms, color 250ms;
          cursor: pointer;
        }
        .ltx-navbar .ltx-icon-btn:hover {
          background: rgba(184, 147, 90, 0.15);
          border-color: var(--maison-gold-bright);
          color: var(--maison-bone);
        }
        .ltx-navbar .ltx-icon-btn .cart-count {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 999px;
          background: var(--maison-gold-bright);
          color: var(--maison-ink);
          font-size: 10px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0;
          box-shadow: 0 0 12px rgba(212, 180, 120, 0.4);
        }
        .ltx-navbar .ltx-try {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 38px;
          padding: 0 22px;
          border-radius: 999px;
          border: 1px solid rgba(184, 147, 90, 0.5);
          background: rgba(184, 147, 90, 0.05);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: var(--maison-gold-leaf);
          font-family: var(--font-instrument, "Instrument Sans"), sans-serif;
          font-size: 12px;
          font-weight: 500;
          text-decoration: none;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          white-space: nowrap;
          width: auto;
          flex-shrink: 0;
          transition: color 300ms, background 300ms, border-color 300ms;
        }
        .ltx-navbar .ltx-try:hover, .ltx-navbar .ltx-try:focus-visible {
          background: rgba(184, 147, 90, 0.15);
          color: var(--maison-bone);
          border-color: var(--maison-gold-bright);
        }

        .ltx-menu-panel {
          position: absolute;
          top: calc(74px + env(safe-area-inset-top));
          right: 40px;
          width: min(320px, calc(100vw - 32px));
          z-index: 40;
          border-radius: 12px;
          border: 1px solid rgba(184, 147, 90, 0.2);
          background: linear-gradient(180deg, rgba(14, 10, 7, 0.98), rgba(14, 10, 7, 0.99));
          backdrop-filter: blur(20px) saturate(140%);
          -webkit-backdrop-filter: blur(20px) saturate(140%);
          box-shadow: 0 26px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(232, 212, 160, 0.05);
          padding: 10px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px);
          transition: opacity 240ms ease, transform 280ms cubic-bezier(0.4, 0, 0.2, 1), visibility 280ms;
        }
        .ltx-menu-panel.open {
          opacity: 1;
          visibility: visible;
          transform: none;
        }
        .ltx-menu-panel a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border-radius: 8px;
          color: var(--maison-gold-leaf);
          text-decoration: none;
          font-family: var(--font-instrument, "Instrument Sans"), sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: background 200ms, color 200ms;
        }
        .ltx-menu-panel a:hover {
          background: rgba(184, 147, 90, 0.1);
          color: var(--maison-bone);
        }
        .ltx-menu-panel a .menu-arrow {
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 200ms, transform 200ms;
          color: var(--maison-gold-bright);
        }
        .ltx-menu-panel a:hover .menu-arrow {
          opacity: 1;
          transform: translateX(0);
        }
        .ltx-menu-panel .menu-sep {
          height: 1px;
          background: rgba(184, 147, 90, 0.15);
          margin: 6px 8px;
        }

        .ltx-sr {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .ltx-notice {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 40;
          font-size: 13px;
          color: var(--maison-gold-leaf);
          background: rgba(14, 10, 7, 0.85);
          border: 1px solid rgba(184, 147, 90, 0.4);
          border-radius: 999px;
          padding: 8px 18px;
          display: none;
          align-items: center;
          gap: 10px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .ltx-notice.visible { display: flex; }
        .ltx-notice button {
          background: rgba(184, 147, 90, 0.2);
          border: 1px solid rgba(184, 147, 90, 0.5);
          color: var(--maison-bone);
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 12px;
          font-family: inherit;
          cursor: pointer;
          transition: background 200ms;
        }
        .ltx-notice button:hover { background: rgba(184, 147, 90, 0.35); }

        @media (max-width: 900px) {
          .ltx-navbar { padding: calc(18px + env(safe-area-inset-top)) 20px 18px; }
          .ltx-navbar .ltx-meta { font-size: 11px; gap: 18px; }
          .ltx-navbar .ltx-meta .meta-serif { font-size: 12px; }
          .ltx-cell { font-size: clamp(14px, 2.4vw, 18px); }
          .ltx-menu-panel { right: 20px; }
        }

        @media (max-width: 700px) {
          .ltx-stage { height: 75dvh; min-height: 520px; }
          .ltx-navbar {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            gap: 0;
            column-gap: 8px;
            justify-content: initial;
            padding: calc(14px + env(safe-area-inset-top)) 14px 14px;
          }
          .ltx-navbar .ltx-logo { grid-column: 1; justify-self: start; }
          .ltx-navbar .ltx-logo svg { height: 21px; }
          .ltx-navbar .ltx-try {
            grid-column: 2;
            justify-self: center;
            height: 36px;
            padding: 0 18px;
            font-size: 11px;
            font-weight: 500;
            border-color: rgba(184, 147, 90, 0.55);
          }
          .ltx-navbar .ltx-nav-right { grid-column: 3; justify-self: end; gap: 8px; }
          .ltx-navbar .ltx-icon-btn { width: 38px; height: 38px; }
          .ltx-navbar .ltx-meta { display: none; }
          .ltx-menu-panel { right: 14px; top: calc(66px + env(safe-area-inset-top)); width: calc(100vw - 28px); }
          .ltx-hero-title-wrap { top: 16%; width: calc(100vw - 40px); height: clamp(90px, 22vw, 130px); }
          .ltx-headline { font-size: clamp(36px, 10.5vw, 52px); line-height: 0.98; letter-spacing: -0.02em; flex-wrap: wrap; justify-content: center; }
          .ltx-hero-sub-wrap { top: 34%; width: calc(100vw - 44px); }
          .ltx-subtitle { font-size: 11px; line-height: 1.55; }
          .ltx-controller { top: 52%; width: calc(100vw - 40px); height: 156px; }
          .ltx-track { top: 0; height: 156px; border-radius: 28px; }
          .ltx-cells { grid-template-columns: 1fr 1fr; grid-template-rows: 48px 54px 54px; }
          .ltx-cell.label { grid-column: 1 / -1; border-bottom: 1px solid rgba(184, 147, 90, 0.2); }
          .ltx-cell:nth-child(2), .ltx-cell:nth-child(3) { border-bottom: 1px solid rgba(184, 147, 90, 0.2); }
          .ltx-cell:nth-child(2), .ltx-cell:nth-child(4) { border-right: 1px solid rgba(184, 147, 90, 0.2); }
          .ltx-cell { font-size: 14px; border-radius: 0; }
          .ltx-capsule { opacity: 0; pointer-events: none; }
          .ltx-controller.collapsed .ltx-capsule, .ltx-controller.selected .ltx-capsule {
            opacity: 1;
            left: 50%;
            top: 4vh;
            top: 4dvh;
            width: 196px;
            height: 64px;
            transform: translate(-50%, -50%);
            border-radius: 999px;
            background: rgba(184, 147, 90, 0.15);
          }
          .ltx-controller.collapsed .ltx-track { opacity: 0; }
          .ltx-controller.selected .ltx-cell.active-cell { grid-column: 1 / -1; grid-row: 1 / -1; }
        }

        @media (max-width: 380px) {
          .ltx-navbar { padding-left: 12px; padding-right: 12px; }
          .ltx-navbar .ltx-try { height: 34px; padding: 0 14px; font-size: 10px; }
          .ltx-navbar .ltx-icon-btn { width: 34px; height: 34px; }
          .ltx-navbar .ltx-logo svg { height: 19px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ltx-capsule, .ltx-track, .ltx-cell, .ltx-headline, .ltx-subtitle, .ltx-try, .ltx-menu-panel {
            transition-duration: 1ms !important;
            transition-delay: 0ms !important;
            animation: none !important;
          }
          .ltx-headline .word, .ltx-subtitle { opacity: 1 !important; filter: none !important; transform: none !important; }
          .ltx-controller.collapsed .ltx-cell:not(.active-cell) { filter: none !important; }
        }
      `}</style>

      <div className="ltx-stage" ref={stageRef} id="stage">
        {Object.entries(VIDEO_SRCS).map(([id, src]) => (
          <video
            key={id}
            id={id}
            className="ltx-media"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            src={src}
            ref={(el) => { videoRefs.current[id] = el; }}
          />
        ))}

        <div className="ltx-hero">
          <div className="ltx-hero-title-wrap">
            <h1 className="ltx-headline" key={headlineIndex} aria-live="polite">
              <span className="word">{currentHeadline.a}</span>
              <span className="word">{currentHeadline.b}</span>
              <span className="word hero-serif">{currentHeadline.c}</span>
            </h1>
          </div>

          <div className="ltx-hero-sub-wrap">
            <p className="ltx-subtitle" key={subtitleIndex}>
              {currentSubtitle}
            </p>
          </div>
        </div>

        <div
          className="ltx-controller"
          ref={controllerRef}
          role="group"
          aria-label="Category selector"
          onPointerMove={onPointerMove}
          onPointerLeave={onControllerLeave}
        >
          <div className="ltx-track glass" ref={trackRef} />
          <div className="ltx-capsule glass" ref={capsuleRef} />
          <div className="ltx-cells">
            <div className="ltx-cell label" id="label-cell">
              Shop by category →
            </div>
            {BRANCH_KEYS.map((key, i) => {
              const st = btnStates[key];
              return (
                <button
                  key={key}
                  type="button"
                  className={`ltx-cell${st.active ? " active-cell" : ""}${st.reset ? " reset-label" : ""}`}
                  data-branch={key}
                  data-index={i + 1}
                  disabled={st.disabled}
                  aria-hidden={st.disabled ? true : undefined}
                  tabIndex={st.disabled ? -1 : 0}
                  onClick={(e) => onCellClick(key, e)}
                  onPointerEnter={() => onPointerEnter(i + 1)}
                  onFocus={() => onPointerEnter(i + 1)}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        <header className="ltx-navbar">
          <Link href="/" className="ltx-logo" aria-label="Maison home">
            <svg viewBox="0 0 75 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M6.4 6.8h7.2c3.6 0 5.6 1.7 5.6 4.4 0 1.8-.9 3.2-2.5 3.8 2 .5 3.2 2 3.2 4.1 0 3.1-2.2 5-6.1 5H6.4V6.8zm3 2.5v5h3.5c1.7 0 2.7-.9 2.7-2.5 0-1.6-1-2.5-2.7-2.5h-3.5zm0 7.6v4.7h4c1.8 0 2.9-1 2.9-2.4 0-1.5-1-2.3-2.9-2.3h-4z" fill="currentColor" />
              <path d="M22.2 6.8h6.1c5.2 0 8.5 3.4 8.5 8.6s-3.3 8.7-8.5 8.7h-6.1V6.8zm3 2.5v12.3h3c3.4 0 5.5-2.3 5.5-6.2 0-3.8-2.1-6.1-5.5-6.1h-3z" fill="currentColor" />
              <path d="M52.5 6.8h7.9c3.4 0 5.5 1.7 5.5 4.5 0 2-.9 3.4-2.6 4l3.6 8.8h-3.2l-3.2-8h-5v8h-3V6.8zm3 2.5v4.9h4.4c1.6 0 2.6-.9 2.6-2.5 0-1.5-1-2.4-2.6-2.4h-4.4z" fill="currentColor" />
            </svg>
          </Link>

          <div className="ltx-meta">
            <span>Maison is <span className="meta-serif">here.</span></span>
            <span>COD across <span className="meta-serif">BD.</span></span>
          </div>

          <Link href="/products" className="ltx-try">
            Explore Collection
          </Link>

          <div className="ltx-nav-right">
            <Link href="/cart" className="ltx-icon-btn" aria-label="Cart" title="Cart">
              <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>

            <button
              type="button"
              className="ltx-icon-btn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="ltx-menu-panel"
            >
              {menuOpen ? <X className="w-4 h-4" strokeWidth={1.5} /> : <Menu className="w-4 h-4" strokeWidth={1.5} />}
            </button>
          </div>
        </header>

        <nav id="ltx-menu-panel" className={`ltx-menu-panel${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
          <Link href="/products" onClick={() => setMenuOpen(false)}>
            <span>Products</span>
            <span className="menu-arrow">→</span>
          </Link>
          <Link href="/track" onClick={() => setMenuOpen(false)}>
            <span>Track Order</span>
            <span className="menu-arrow">→</span>
          </Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>
            <span>About</span>
            <span className="menu-arrow">→</span>
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            <span>Contact</span>
            <span className="menu-arrow">→</span>
          </Link>
          <Link href="/faq" onClick={() => setMenuOpen(false)}>
            <span>FAQ</span>
            <span className="menu-arrow">→</span>
          </Link>
          <div className="menu-sep" />
          <Link href="/cart" onClick={() => setMenuOpen(false)}>
            <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
            <span className="menu-arrow">→</span>
          </Link>
          <Link href="/admin" onClick={() => setMenuOpen(false)}>
            <span>Admin</span>
            <span className="menu-arrow">→</span>
          </Link>
        </nav>

        <div className="ltx-sr" ref={liveRef} aria-live="polite" aria-atomic="true" />
        <div className={`ltx-notice${noticeVisible ? " visible" : ""}`} ref={noticeRef} role="status">
          <span ref={noticeTextRef} />
          <button type="button" onClick={handleRetry}>Retry</button>
        </div>
      </div>
    </>
  );
}