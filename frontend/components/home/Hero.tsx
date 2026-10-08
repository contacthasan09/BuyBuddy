"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const BASE =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/";

const SHOTS = [
  { v: "pay", url: `${BASE}hf_20260912_110422_0fc34393-7417-41b0-a200-43fd2b08a37f.png` },
  { v: "launch", url: `${BASE}hf_20260912_110423_ba46182e-43bc-43a8-9007-a8234acf442d.png` },
  { v: "shop", url: `${BASE}hf_20260912_110423_06cfbb84-6f96-48f6-be45-e03516510e48.png` },
  { v: "brand", url: `${BASE}hf_20260912_110422_634bf390-f171-4f5d-9151-0d2c86c26e7b.png` },
  { v: "frete", url: `${BASE}hf_20260912_110423_0cfe058d-db0e-4ee6-9708-7a297cc11a7a.png` },
  { v: "plain", t: "RITUAL REGIME", url: `${BASE}hf_20260912_110422_a90a35d7-ae20-4ce3-86d7-e3f6f658a6bc.png` },
  { v: "power", url: `${BASE}hf_20260912_110422_de267714-7647-4d9a-a0a9-55325683b2a2.png` },
  { v: "plain", t: "JUST ARRIVED", url: `${BASE}hf_20260912_110504_80eda275-e380-4ccb-b51f-332f25337079.png` },
  { v: "off", url: `${BASE}hf_20260912_110422_d6ba08f5-4ff8-4f09-8abe-93ee6bb0e34e.png` },
  { v: "plain", t: "STREETWEAR", url: `${BASE}hf_20260912_110423_87ec2115-3157-47ef-ac98-973f8ad6532d.png` },
];

const BROWSER_IMGS = {
  hero: {
    url: `${BASE}hf_20260912_110504_0316394c-37bd-432b-a1f2-ee46a461c22b.png`,
    alt: "Warm amber and ivory skincare collection in golden morning light",
  },
  p1: {
    url: `${BASE}hf_20260912_110423_3b5dcf24-cc07-4f3b-8423-b597fffcdbfb.png`,
    alt: "Vitamin C serum in amber glass",
  },
  p2: {
    url: `${BASE}hf_20260912_110504_50ec81be-8341-447f-a0c2-a5673a465447.png`,
    alt: "Nourishing lotion jar on soft linen",
  },
  p3: {
    url: `${BASE}hf_20260912_110504_fd208d72-9112-4cde-b509-8d273b470c6f.png`,
    alt: "Three-piece Sunset Renewal skincare kit",
  },
  p4: {
    url: `${BASE}hf_20260912_110504_9731544c-a83b-48c4-bacb-e31e4d4b9f42.png`,
    alt: "Lightweight facial sunscreen beside clear water",
  },
};

function creative(d: (typeof SHOTS)[0]) {
  const im = `<img alt="" src="${d.url}" />`;
  switch (d.v) {
    case "pay":
      return `
        <div class="fill" style="background:#efedea"></div>
        <div class="ph" style="top:112px;bottom:0">${im}</div>
        <svg class="ph" style="top:118px;bottom:0" viewBox="0 0 130 182" preserveAspectRatio="none">
          <g stroke="#e5202f" stroke-width="8" fill="none" opacity=".92" stroke-linecap="square">
            <path d="M2 42h30M14 30v96M4 100l26-16"/>
            <path d="M96 34v58M120 34v58M96 92q12 15 24 0"/>
            <path d="M92 108l14 34M126 108l-12 34"/>
          </g>
        </svg>
        <div class="cv" style="top:20px;text-align:right;font-size:3.4px;letter-spacing:.15em;color:#8d9298">METHOD OF CHECKOUTS</div>
        <div class="cv t-big" style="top:32px;font-size:14px;color:#16171b">Checkouts</div>
        <div class="cv t-big" style="top:47px;font-size:14px;color:#e5202f">Quick n simple</div>
        <div class="cv" style="top:76px;font-size:5.2px;font-weight:700;color:#16171b;line-height:1.7">
          <div><b class="dot"></b>SPEND VIA <b>ACH</b></div>
          <div style="margin-top:8px"><b class="dot sq"></b>OR AT MAX <b>12X</b><br><span style="margin-left:11px">ON CREDIT</span></div>
        </div>`;
    case "launch":
      return `
        <div class="fill" style="background:linear-gradient(168deg,#f9d9e5,#f3bdd2 55%,#e8a3c0)"></div>
        <div class="ph" style="top:100px;bottom:0">${im}<div class="fill" style="background:linear-gradient(180deg,rgba(249,217,229,.97),rgba(249,217,229,0) 30%)"></div></div>
        <div class="cv t-serif" style="top:36px;font-size:17px;color:#b03a63">COLLECTION</div>
        <div class="cv t-serif" style="top:55px;font-size:17px;color:#b03a63">EXCLUSIVE!</div>`;
    case "shop":
      return `
        <div class="fill" style="background:#fff"></div>
        <div class="ph" style="top:0;height:148px">${im}</div>
        <div class="cv" style="top:158px;font-size:5.4px;font-weight:700;letter-spacing:.09em;color:#16171b">REGIME AT DAWNS</div>
        <div class="cv" style="top:168px;font-size:4.2px;color:#7b8087">Cleanse · Serum · Moisturize</div>
        <div style="position:absolute;left:10px;top:180px;padding:4px 11px;border-radius:20px;background:#16171b;font-size:4.6px;font-weight:600;color:#fff;letter-spacing:.05em">Acquire today</div>`;
    case "brand":
      return `
        <div class="fill" style="background:linear-gradient(180deg,#0a2a4a,#0d3a63 50%,#08192b)"></div>
        <div class="ph" style="top:92px;bottom:0">${im}<div class="fill" style="background:linear-gradient(180deg,rgba(10,42,74,.98),rgba(10,42,74,0) 36%)"></div></div>
        <div class="cv" style="top:16px;font-size:4.2px;line-height:1.7;color:rgba(255,255,255,.82);width:74px">Formulas light, assessed hypoallergenically n designed with a new ritual — revealing since a starting moment.</div>
        <div style="position:absolute;right:10px;top:16px;font-size:5.4px;font-weight:600;color:#fff;opacity:.92">✳ BD Store</div>`;
    case "frete":
      return `
        <div class="fill" style="background:linear-gradient(158deg,#4a0c80 0%,#7a16a6 40%,#a81fc6 66%,#5c0e90 100%)"></div>
        <div class="ph" style="top:140px;bottom:0;opacity:.45;mix-blend-mode:screen">${im}</div>
        <div class="fill" style="background:radial-gradient(44% 16% at 50% 62%, rgba(255,255,255,.92), rgba(255,255,255,0) 72%)"></div>
        <div style="position:absolute;left:-6px;right:-6px;top:44px;height:13px;background:#ff2d8a;transform:rotate(-2.6deg);box-shadow:0 4px 12px rgba(255,45,138,.5)"></div>
        <div style="position:absolute;left:0;right:0;top:45.5px;transform:rotate(-2.6deg);text-align:center;font-size:5.6px;font-weight:700;letter-spacing:.05em;color:#fff">OBTAIN AT HOME AND</div>
        <div class="cv t-big" style="top:64px;font-size:24px;color:#fff;text-shadow:0 3px 0 rgba(84,9,124,.6)">Ships</div>
        <div class="cv t-big" style="top:87px;font-size:24px;color:#fff;text-shadow:0 3px 0 rgba(84,9,124,.6)">Free</div>
        <div class="cv t-big" style="top:113px;font-size:19px;color:#fff">+</div>`;
    case "power":
      return `
        <div class="ph phf">${im}</div>
        <div class="fill" style="background:linear-gradient(180deg,rgba(6,5,10,0) 34%,rgba(6,5,10,.55) 52%,rgba(6,5,10,.92) 72%)"></div>
        <div class="cv t-serif" style="top:132px;font-size:16px;color:#fff">BUILT TO</div>
        <div class="cv t-serif" style="top:150px;font-size:16px;color:#fff">LAST</div>
        <div class="cv" style="top:171px;font-size:4.4px;letter-spacing:.07em;color:rgba(255,255,255,.85)">quality you can feel</div>`;
    case "off":
      return `
        <div class="ph phf">${im}</div>
        <div class="fill" style="background:linear-gradient(180deg,rgba(3,9,20,0) 30%,rgba(3,9,20,.6) 48%,rgba(3,9,20,.95) 70%)"></div>
        <div class="cv t-big" style="top:126px;font-size:10px;color:#fff;opacity:.9">On sale · til</div>
        <div class="cv t-big" style="top:139px;font-size:22px;color:#3fe3ff;text-shadow:0 0 16px rgba(63,227,255,.5)">50% off</div>`;
    default:
      return `
        <div class="ph phf">${im}</div>
        <div class="fill" style="background:linear-gradient(180deg,rgba(4,8,16,0) 38%,rgba(4,8,16,.85) 68%)"></div>
        <div class="cv" style="top:150px;font-size:5.4px;font-weight:600;letter-spacing:.2em;color:#fff">${d.t || ""}</div>`;
  }
}

export default function Hero() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const phaseRef = useRef(-2);
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useRef(false);

  // ── Starfield ──────────────────────────────────────────────
  useEffect(() => {
    const makeStars = (n: number, blur: number, aMin: number, aMax: number) => {
      const parts: string[] = [];
      for (let i = 0; i < n; i++) {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const a = aMin + Math.random() * (aMax - aMin);
        parts.push(`${x}vw ${y}vh ${blur}px 0 rgba(255,255,255,${a.toFixed(3)})`);
      }
      return parts.join(",");
    };
    const a = document.getElementById("stA");
    const b = document.getElementById("stB");
    if (a) a.style.boxShadow = makeStars(150, 0, 0.05, 0.3);
    if (b) b.style.boxShadow = makeStars(18, 1.2, 0.35, 0.7);
  }, []);

  // ── Ring placement + animation ─────────────────────────────
  const placeCards = useCallback(() => {
    const R = 891;
    const step = 360 / 37;
    const cull = 42;
    const cards = cardsRef.current;
    for (let i = 0; i < 37; i++) {
      const el = cards[i];
      if (!el) continue;
      let a = ((i * step + phaseRef.current) % 360 + 540) % 360 - 180;
      if (Math.abs(a) > cull) {
        el.style.visibility = "hidden";
        continue;
      }
      el.style.visibility = "visible";
      const r = (a * Math.PI) / 180;
      const c = Math.cos(r);
      el.style.transform = `translate3d(${R * Math.sin(r)}px,0,${R * (1 - c)}px) rotateY(${-a}deg)`;
      el.style.filter = `brightness(${0.84 + 0.5 * (1 / c - 1)})`;
    }
  }, []);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ring = ringRef.current;
    if (!ring) return;
    cardsRef.current = [];
    for (let i = 0; i < 37; i++) {
      const d = SHOTS[i % 10];
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = creative(d) + '<div class="edge"></div>';
      const img = card.querySelector("img");
      if (img) {
        img.addEventListener("error", () => card.classList.add("broken"));
      }
      ring.appendChild(card);
      cardsRef.current.push(card);
    }
    placeCards();

    const tick = (t: number) => {
      if (!lastRef.current) lastRef.current = t;
      const dt = Math.min((t - lastRef.current) / 1000, 0.1);
      lastRef.current = t;
      if (!reducedMotion.current) {
        phaseRef.current -= 1.9 * dt;
        placeCards();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const onVis = () => {
      if (document.visibilityState === "visible") lastRef.current = 0;
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", onVis);
      cardsRef.current.forEach((c) => c.remove());
    };
  }, [placeCards]);

  // ── Type fitter + responsive scale ─────────────────────────
  useEffect(() => {
    const CW = 1172;
    const TAB_MAX = 1080;
    const TAB_MIN = 701;
    const DW_MIN = 920;

    const measureCtx = document.createElement("canvas").getContext("2d")!;
    const fontOf = (el: HTMLElement) => {
      const cs = getComputedStyle(el);
      return {
        css: `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`,
        size: parseFloat(cs.fontSize),
      };
    };
    const inkWidth = (el: HTMLElement, k: number, mobile: boolean) =>
      el.getBoundingClientRect().width / (mobile ? 1 : k);
    const capRatio = (el: HTMLElement) => {
      measureCtx.font = "100px " + getComputedStyle(el).fontFamily;
      const m = measureCtx.measureText("H");
      return ((m as any).actualBoundingBoxAscent || 70) / 100;
    };
    const fitBox = (
      el: HTMLElement,
      tw: number,
      tc: number,
      pre: string,
      k: number,
      mobile: boolean
    ) => {
      el.style.transform = pre;
      el.style.fontSize = "";
      const base = fontOf(el).size;
      const ratio = capRatio(el);
      el.style.fontSize = tc / ratio + "px";
      const w = inkWidth(el, k, mobile);
      el.style.transform = pre + ` scaleX(${tw / w})`;
    };
    const baseline = (el: HTMLElement, y: number) => {
      const { size } = fontOf(el);
      measureCtx.font = fontOf(el).css;
      const m = measureCtx.measureText("Hg");
      const A = (m as any).fontBoundingBoxAscent ?? size * 0.8;
      const D = (m as any).fontBoundingBoxDescent ?? size * 0.2;
      el.style.top = y - ((size - (A + D)) / 2 + A) + "px";
    };
    const centreLabel = (btn: HTMLElement, el: HTMLElement, capPx: number) => {
      const probe = document.createElement("i");
      probe.style.cssText =
        "position:absolute;left:0;top:0;width:0;height:0;visibility:hidden;font:inherit";
      el.appendChild(probe);
      const base = probe.getBoundingClientRect().top - btn.getBoundingClientRect().top;
      probe.remove();
      const btnH = btn.offsetHeight;
      const BIAS = 1.1;
      el.style.top = btnH / 2 - (base - capPx / 2) + BIAS + "px";
      el.style.position = "relative";
    };

    const layout = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = vw <= 700;
      const tablet = vw > 700 && vw <= 1080;
      const canvas = canvasRef.current;
      if (!canvas) return;

      let k = 1;
      let W = CW;
      let tboost = 1;
      let fill = 0;
      let stshift = 0;
      let sshift = 0;
      let rs = 1;

      if (mobile) {
        canvas.style.setProperty("--k", "1");
        canvas.style.removeProperty("--fill");
        ["h1a", "h1b", "sub1", "sub2", "badgeTxt", "wmName", "ctaLabel", "vpLabel"].forEach(
          (id) => {
            const el = document.getElementById(id);
            if (el) {
              el.style.fontSize = "";
              el.style.top = "";
              el.style.transform = "";
            }
          }
        );
        const links = document.getElementById("links");
        if (links) {
          links.style.transform = "";
          links.style.fontSize = "";
          Array.from(links.children).forEach((c) => {
            (c as HTMLElement).style.fontSize = "";
          });
        }
        placeCards();
        return;
      }

      if (tablet) {
        W = DW_MIN + ((vw - TAB_MIN) * (CW - DW_MIN)) / (TAB_MAX - TAB_MIN);
        if (vh > vw * 1.15) W = Math.min(W, 900);
        k = Math.min(vw / W, vh / 560);
        const ramp = Math.min(1, (TAB_MAX - vw) / 120);
        tboost = 1 + 0.14 * ramp;
        fill = Math.max(0, vh / k - 657);
        if (fill > 0) {
          const ss = Math.min(fill * 0.55, 420) * ramp;
          rs = 1 + Math.min(fill / 1100, 0.75) * ramp;
          const slack = 219.5 - 125 * rs + ss;
          stshift = Math.max(0, slack / 2 - 28) * ramp;
          fill -= ss;
          sshift = ss;
        }
      } else {
        k = Math.min(vw / CW, vh / 560);
      }

      canvas.style.setProperty("--k", String(k));
      canvas.style.setProperty("--fill", fill + "px");
      canvas.style.setProperty("--stshift", stshift + "px");
      canvas.style.setProperty("--sshift", sshift + "px");
      canvas.style.setProperty("--rs", String(rs));

      const T = tablet ? tboost : 1;

      const h1a = document.getElementById("h1a")!;
      const h1b = document.getElementById("h1b")!;
      const sub1 = document.getElementById("sub1")!;
      const sub2 = document.getElementById("sub2")!;
      const badgeTxt = document.getElementById("badgeTxt")!;
      const wmName = document.getElementById("wmName")!;
      const ctaLabel = document.getElementById("ctaLabel")!;
      const vpLabel = document.getElementById("vpLabel")!;
      const links = document.getElementById("links")!;

      fitBox(h1a, 563.5 * T, 37.2 * T, "translateX(-50%)", k, false);
      baseline(h1a, 204.5);
      fitBox(h1b, 197.5 * T, 37.2 * T, "translateX(-50%)", k, false);
      baseline(h1b, 258.5);
      fitBox(sub1, 389 * T, 8.4 * T, "translateX(-50%)", k, false);
      baseline(sub1, 300.5);
      fitBox(sub2, 311 * T, 8.4 * T, "translateX(-50%)", k, false);
      baseline(sub2, 316.5);
      fitBox(badgeTxt, 184 * T, 9.4 * T, "translate(2px,-1px)", k, false);
      fitBox(wmName, 51 * T, 11.4 * T, "", k, false);
      baseline(wmName, 38.5);
      fitBox(ctaLabel, 87 * T, 8.9 * T, "", k, false);
      centreLabel(ctaLabel.closest(".btn") as HTMLElement, ctaLabel, 8.9 * T);
      fitBox(vpLabel, 76 * T, 9.5 * T, "", k, false);
      centreLabel(vpLabel.closest(".btn") as HTMLElement, vpLabel, 9.5 * T);

      links.style.transform = "";
      if (tablet) {
        Array.from(links.children).forEach((c) => {
          (c as HTMLElement).style.fontSize = "";
        });
      } else {
        const first = links.children[0] as HTMLElement;
        const fs = 7.9 / capRatio(first);
        Array.from(links.children).forEach((c) => {
          (c as HTMLElement).style.fontSize = fs + "px";
        });
        const rowW = links.getBoundingClientRect().width / k;
        links.style.transform = `scaleX(${317 / rowW})`;
      }

      placeCards();
    };

    const resize = () => layout();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", resize);
    }
    resize();
    document.fonts.ready.then(layout);
    setTimeout(layout, 400);
    setTimeout(layout, 1400);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", resize);
      }
    };
  }, [placeCards]);

  // ── Entrance timeline ──────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.add("intro");
    const failsafe = setTimeout(() => {
      document.documentElement.classList.remove("intro");
    }, 4000);

    if (
      reducedMotion.current ||
      !("animate" in Element.prototype) ||
      !document.documentElement.classList.contains("intro")
    ) {
      document.documentElement.classList.remove("intro");
      return () => clearTimeout(failsafe);
    }

    const D = window.innerWidth <= 700 ? 0.66 : 1;
    const EXPO = "cubic-bezier(.16,1,.3,1)";
    const SOFT = "cubic-bezier(.22,.61,.36,1)";
    const Y = (px: number) => `0 ${px * D}px`;

    let n = 0;
    let last: Animation | null = null;

    const play = (
      el: Element | null,
      from: Keyframe,
      dur: number,
      delay: number,
      ease: string
    ) => {
      if (!el) return;
      const to: Keyframe = { opacity: 1 };
      if ("translate" in from) to.translate = "0 0";
      if ("scale" in from) to.scale = "1";
      if ("clipPath" in from) to.clipPath = "inset(-30% 0 -30% 0)";
      const a = (el as HTMLElement).animate([from, to], {
        duration: dur,
        delay,
        easing: ease,
        fill: "both",
      });
      a.id = "intro:" + n++;
      last = a;
    };

    const settle = () => {
      document.getAnimations().forEach((a) => {
        if (a.id?.startsWith("intro:")) a.cancel();
      });
      document.documentElement.classList.remove("intro");
    };

    play(document.querySelector(".nav"), { opacity: 0, translate: Y(-9) }, 620, 60, EXPO);
    play(document.querySelector(".mark"), { opacity: 0, translate: Y(6) }, 520, 150, SOFT);
    play(document.querySelector(".wm"), { opacity: 0, translate: Y(6) }, 520, 185, SOFT);
    document.querySelectorAll(".links a").forEach((a, i) => {
      play(a, { opacity: 0, translate: Y(6) }, 460, 215 + i * 45, SOFT);
    });
    play(document.querySelector(".burger"), { opacity: 0, translate: Y(6) }, 460, 300, SOFT);
    play(document.querySelector(".nav .btn"), { opacity: 0, translate: Y(6) }, 500, 400, SOFT);
    play(
      document.querySelector(".badge"),
      { opacity: 0, translate: Y(11), scale: 0.985 },
      560,
      270,
      EXPO
    );
    play(
      document.getElementById("h1a"),
      { opacity: 0, translate: Y(15), clipPath: "inset(100% 0 -30% 0)" },
      900,
      380,
      EXPO
    );
    play(
      document.getElementById("h1b"),
      { opacity: 0, translate: Y(15), clipPath: "inset(100% 0 -30% 0)" },
      900,
      470,
      EXPO
    );
    play(document.getElementById("sub1"), { opacity: 0, translate: Y(10) }, 620, 690, EXPO);
    play(document.getElementById("sub2"), { opacity: 0, translate: Y(10) }, 620, 745, EXPO);
    play(
      document.querySelector(".cta2"),
      { opacity: 0, translate: Y(13), scale: 0.985 },
      620,
      830,
      EXPO
    );
    play(
      document.querySelector(".ring"),
      { opacity: 0, translate: Y(18), scale: 0.99 },
      950,
      700,
      EXPO
    );
    play(document.querySelector(".browser"), { opacity: 0, translate: Y(26) }, 900, 900, EXPO);
    play(document.querySelector(".wa"), { opacity: 0, scale: 0.88 }, 500, 1260, EXPO);

    const finalAnimation = last as Animation | null;
    if (finalAnimation) {
      finalAnimation.finished.then(settle).catch(settle);
    } else {
      settle();
    }

    return () => {
      clearTimeout(failsafe);
      settle();
    };
  }, []);

  // ── Menu ───────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        document.querySelector<HTMLButtonElement>(".burger")?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      const nav = document.querySelector(".nav");
      if (menuOpen && nav && !nav.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1081px)");
    const close = () => setMenuOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    const isMobile = window.innerWidth <= 1080;
    if (menuOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <style jsx global>{`
        /* ── GLOBAL SHELL ── */
        *{margin:0;padding:0;box-sizing:border-box}
        html,body{height:100%;overflow:hidden;background:#020204}
        body{font-family:Poppins,Inter,system-ui,sans-serif;color:#fff;
          -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
          overscroll-behavior:none}
        a{text-decoration:none;color:inherit}
        img{max-width:100%;display:block}

        .stage{position:fixed;inset:0;overflow:hidden;background:#020204}
        .canvas{position:absolute;left:50%;top:0;width:1172px;height:657px;
          transform:translateX(-50%) scale(var(--k,1));transform-origin:50% 0}
        .canvas>*{position:absolute}
        .stack{position:absolute;inset:0;z-index:300}
        .stack>*{position:absolute}
        .navmenu{display:contents}
        .burger{display:none}

        .bg{position:absolute;inset:0;
          background:linear-gradient(180deg,rgba(25,127,255,0) 38%,rgba(25,127,255,.042) 54%,
            rgba(25,127,255,.052) 68%,rgba(25,127,255,.030) 100%),#020204}
        .stars{position:absolute;left:0;top:0;width:1px;height:1px;border-radius:50%;background:#fff}

        .badge{left:462px;top:95px;width:250px;height:39px;border-radius:12px;z-index:300;
          border:1px solid rgba(255,255,255,.115);
          background:linear-gradient(to top,
            rgba(190,225,255,.175) 0px,rgba(190,225,255,.128) 2px,rgba(190,225,255,.075) 4px,
            rgba(190,225,255,.026) 6px,rgba(255,255,255,.012) 9px,rgba(255,255,255,.012) 100%);
          -webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);
          box-shadow:inset 0 1px 0 rgba(255,255,255,.035)}
        .badge i{position:absolute;left:4px;top:4px;width:29px;height:29px;border-radius:8px;
          display:grid;place-items:center;
          background:linear-gradient(to top,
            #46afc8 0px,#35abc7 2px,#0b859d 4px,#026c84 6px,#004e66 8px,
            #053f58 10px,#012c3d 12px,#031a2a 14px,#061125 16px,#090f25 19px,
            #090c1c 23px,#060d16 29px);
          box-shadow:inset 1px 0 0 rgba(150,220,250,.40),
            inset -1px 0 0 rgba(150,220,250,.52),
            0 0 6px rgba(60,190,230,.20),0 3px 8px -5px rgba(90,220,255,.6)}
        .badge i svg{width:14px;height:16px;position:relative;top:-1px;left:0}
        .badge b{position:absolute;left:45px;transform-origin:0 50%;top:0;height:39px;
          display:flex;align-items:center;
          font-size:13px;font-weight:400;color:rgba(255,255,255,.94);white-space:nowrap;
          padding-top:1.5px}

        .btn{display:grid;place-items:center;color:#fff;position:relative;overflow:hidden;
          background:linear-gradient(to top,
            #9ad9ec 1px,#89dff0 2px,#79e0f1 3px,#61daef 4px,#3ec8e4 5px,
            #14a8c6 6px,#0596b3 7px,#038aa8 8px,#047796 9px,#006180 10px,
            #025066 12px,#0a4f5e 13px,#04465a 14px,#073746 16px,
            #0a2a37 18px,#0d212e 20px,#0f1824 24px,#0a121e 30px,
            #0a111d 34px,#0a111d 100%);
          box-shadow:
            inset 0 3px 3px -2px rgba(180,228,255,.10),
            inset 1px 0 0 rgba(255,255,255,.09),
            inset -1px 0 0 rgba(255,255,255,.09),
            var(--hair,0 1px 0 rgba(152,218,234,.38)),
            1px 0 0 rgba(152,218,234,.17),-1px 0 0 rgba(152,218,234,.17),
            0 0 8px rgba(60,190,235,.10),
            0 2px 5px -3px rgba(90,220,255,.45);
          transition:transform .25s,box-shadow .25s,filter .25s;
          -webkit-tap-highlight-color:transparent;cursor:pointer}
        .btn::before{content:"";position:absolute;left:22%;right:38%;top:0.8px;height:1.9px;z-index:1;
          filter:blur(.55px);
          background:linear-gradient(90deg,rgba(120,225,255,0) 0%,rgba(120,225,255,.58) 34%,
            rgba(160,240,255,.74) 50%,rgba(120,225,255,.58) 66%,rgba(120,225,255,0) 100%)}
        .btn::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:1;
          background:linear-gradient(90deg,rgba(200,245,255,.70),rgba(200,245,255,0) 13px),
                     linear-gradient(270deg,rgba(200,245,255,.70),rgba(200,245,255,0) 13px);
          -webkit-mask:linear-gradient(to top,#000 0,#000 6px,rgba(0,0,0,.40) 12px,
            rgba(0,0,0,.15) 18px,rgba(0,0,0,.09) 24px,rgba(0,0,0,.02) 30px,rgba(0,0,0,.02) 100%);
                  mask:linear-gradient(to top,#000 0,#000 6px,rgba(0,0,0,.40) 12px,
            rgba(0,0,0,.15) 18px,rgba(0,0,0,.09) 24px,rgba(0,0,0,.02) 30px,rgba(0,0,0,.02) 100%)}
        .btn span{position:relative;z-index:2;display:block;line-height:1;
          text-shadow:0 1px 2px rgba(0,20,30,.5)}
        .btn:hover{transform:translateY(-1px);filter:brightness(1.12);
          box-shadow:inset 0 1px 0 rgba(200,245,255,.6),inset 1px 0 0 rgba(170,225,255,.35),
                     inset -1px 0 0 rgba(170,225,255,.35),0 6px 22px rgba(20,180,225,.55)}
        .btn:active{transform:translateY(0);filter:brightness(1.05)}

        .nav .btn{position:absolute;left:530.7px;top:10.5px;width:125.5px;height:39.5px;
          border-radius:14px;font-size:14px;font-weight:500;letter-spacing:-.005em}
        .nav .btn span{margin-top:0}
        .cta2{position:absolute;left:526px;top:349px;width:121px;height:54.5px;
          --hair:0 0 0 transparent;border-radius:13px;font-size:17px;font-weight:500;
          letter-spacing:-.01em;z-index:300}
        .cta2::before{display:none}
        .cta2 span{margin-top:0}

        .nav{left:247px;top:3px;width:678px;height:64px;border-radius:32px;z-index:400;
          background:rgba(255,255,255,.008);
          border:1px solid rgba(255,255,255,.105);
          -webkit-backdrop-filter:blur(16px) saturate(140%);
          backdrop-filter:blur(16px) saturate(140%);
          box-shadow:inset 0 1px 0 rgba(255,255,255,.03)}
        .mark{position:absolute;left:21px;top:19px;width:24px;height:24px;
          filter:drop-shadow(0 0 6px rgba(60,224,255,.75))}
        .wm{position:absolute;left:50px;top:0;white-space:nowrap}
        .wm .kick{position:absolute;left:3px;top:20px;font-size:4.4px;font-weight:600;
          letter-spacing:.10em;color:#fff;opacity:.92;line-height:1}
        .wm .name{position:absolute;left:0;top:26px;transform-origin:0 50%;
          font-family:Poppins;font-weight:900;font-size:22px;line-height:1;
          letter-spacing:-.01em;color:#fff}
        .links{position:absolute;left:156px;top:0;height:62px;transform-origin:0 50%;
          display:flex;align-items:center;gap:24px}
        .links a{font-size:12.5px;font-weight:400;color:rgba(255,255,255,.92);
          white-space:nowrap;transition:opacity .25s}
        .links a:hover{opacity:.65}

        .h1{left:586px;transform:translateX(-50%);white-space:nowrap;line-height:1;
          font-family:Poppins;font-weight:900;font-size:54px;letter-spacing:-.004em;
          word-spacing:.175em;text-transform:uppercase;color:#fff;
          text-shadow:0 0 34px rgba(130,180,255,.22);z-index:300}
        .sub{left:586px;transform:translateX(-50%);white-space:nowrap;line-height:1;
          font-size:13.2px;color:#a9aeb5;z-index:300}
        .sub b{font-weight:600;color:#fff}
        .nb{white-space:nowrap}

        .showcase{position:absolute;left:0;top:0;width:1172px;height:0}
        .ring{position:absolute;left:0;top:0;width:1172px;height:657px;z-index:5;
          perspective:891px;perspective-origin:586px 918px;transform-style:preserve-3d;
          pointer-events:none}
        .card{position:absolute;left:586px;top:616px;width:130px;height:300px;
          margin:-150px 0 0 -65px;border-radius:12px;overflow:hidden;background:#0d1117;
          box-shadow:0 24px 46px rgba(0,0,0,.6),0 3px 8px rgba(0,0,0,.5);
          backface-visibility:hidden;will-change:transform}
        .card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .card .edge{position:absolute;inset:0;border-radius:12px;
          box-shadow:inset 0 0 0 1px rgba(255,255,255,.15),
                     inset 0 16px 30px rgba(255,255,255,.05)}
        .card.broken img{display:none}
        .cv{position:absolute;left:0;right:0;padding:0 10px}
        .fill{position:absolute;inset:0}
        .ph{position:absolute;left:0;right:0;overflow:hidden;
          background:linear-gradient(155deg,#2b3b50,#131c28 60%,#1d1526)}
        .phf{top:0;bottom:0}
        .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .dot{display:inline-block;width:4.5px;height:4.5px;background:#e5202f;
          margin-right:4px;transform:rotate(45deg) translateY(-1px)}
        .dot.sq{transform:none;width:6.5px;height:4.5px;border-radius:1px}
        .t-big{font-family:Poppins;font-weight:900;text-transform:uppercase;line-height:.96;
          letter-spacing:-.015em;white-space:nowrap;transform:scaleX(.875);
          transform-origin:left center}
        .t-serif{font-family:"Playfair Display",serif;line-height:1.02;letter-spacing:.01em;
          white-space:nowrap}

        .browser{position:absolute;left:165px;top:558px;width:842px;
          height:calc(99px + var(--fill,0px));
          border-radius:28px 28px 0 0;overflow:hidden;z-index:100;
          box-shadow:0 -14px 44px rgba(0,0,0,.55)}
        .browser::before{content:"";position:absolute;left:0;right:0;top:42px;bottom:0;
          background:rgba(20,20,26,.82);z-index:0}
        .bar{position:absolute;left:0;top:0;width:100%;height:42px;
          background:linear-gradient(180deg,rgba(20,24,48,.48),rgba(15,19,38,.58));
          -webkit-backdrop-filter:blur(6px) saturate(112%);backdrop-filter:blur(6px) saturate(112%)}
        .dots{position:absolute;left:27px;top:16px;display:flex;gap:2.6px}
        .dots i{width:7.6px;height:7.6px;border-radius:50%}
        .omni{position:absolute;left:246px;top:7px;width:336px;height:26px;border-radius:5px;
          background:rgba(9,13,26,.93);box-shadow:inset 0 0 0 1px rgba(255,255,255,.045);
          display:flex;align-items:center;justify-content:center;gap:6px}
        .omni svg{width:9px;height:9px;opacity:.72}
        .omni span{font-size:9.5px;color:rgba(255,255,255,.72);letter-spacing:.005em}
        .tools{position:absolute;right:27px;top:14px;display:flex;align-items:center;gap:4px;opacity:.9}
        .tools svg{width:11px;height:12px}
        .page{position:absolute;left:7px;right:6px;top:42px;bottom:0;background:#fff;
          color:#111;overflow:hidden;border-radius:10px 10px 0 0}
        .ann{position:absolute;left:0;top:0;width:100%;height:16px;background:#101210;
          display:grid;place-items:center;border-radius:10px 10px 0 0}
        .ann span{font-size:5px;letter-spacing:.06em;color:#cfcfcf}
        .ann u{position:absolute;font-size:6px;color:#9a9a9a;text-decoration:none}
        .shoplogo{position:absolute;left:50%;transform:translateX(-50%);top:24px;text-align:center}
        .shoplogo em{font-family:"Playfair Display",serif;font-style:normal;font-weight:600;
          font-size:15px;letter-spacing:.14em;line-height:1;display:block}
        .shoplogo i{font-style:normal;font-size:5px;letter-spacing:.3em;color:#3a3a3a;
          margin-top:3px;display:block}
        .shopicons{position:absolute;right:100px;top:33px;display:flex;gap:5px;opacity:.85}
        .shopicons svg{width:7px;height:7px}
        .pagebody{position:absolute;left:0;right:0;top:62px;bottom:0;background:#fff;overflow:hidden}
        .pghero{position:relative;margin:0 26px;height:158px;border-radius:7px;overflow:hidden;
          background:linear-gradient(120deg,#e8dcd4,#cbb6a8)}
        .pghero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .pghero .scrim{position:absolute;inset:0;
          background:linear-gradient(90deg,rgba(28,20,16,.62) 0%,rgba(28,20,16,.30) 46%,rgba(28,20,16,0) 72%)}
        .pghero .copy{position:absolute;left:22px;top:50%;transform:translateY(-50%);color:#fff}
        .pghero .copy u{font-size:4.6px;letter-spacing:.26em;text-transform:uppercase;opacity:.9;
          display:block;text-decoration:none}
        .pghero .copy em{font-family:"Playfair Display",serif;font-style:normal;font-weight:600;
          font-size:15px;line-height:1.12;margin-top:6px;display:block}
        .pghero .copy i{display:inline-block;margin-top:10px;padding:5px 13px;border-radius:20px;
          background:#fff;color:#17181c;font-size:5.2px;font-weight:600;letter-spacing:.06em;
          font-style:normal}
        .pgsec{display:flex;align-items:baseline;justify-content:space-between;margin:16px 26px 9px}
        .pgsec b{font-family:"Playfair Display",serif;font-weight:600;font-size:9px;color:#17181c}
        .pgsec u{font-size:4.6px;letter-spacing:.14em;color:#8a8a8a;text-transform:uppercase;
          text-decoration:none}
        .pggrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:0 26px}
        .pgcard .ph{position:relative;height:0;padding-bottom:104%;border-radius:6px;
          overflow:hidden;background:linear-gradient(150deg,#efe7e1,#ddcfc6)}
        .pgcard .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .pgcard .tag{position:absolute;left:6px;top:6px;padding:2px 5px;border-radius:3px;
          background:#17181c;color:#fff;font-size:3.8px;font-weight:600;letter-spacing:.1em}
        .pgcard b{display:block;margin-top:6px;font-size:5.4px;font-weight:600;color:#17181c;
          letter-spacing:.01em}
        .pgcard i{display:block;font-style:normal;margin-top:2px;font-size:4.6px;color:#8a8a8a}
        .pgcard s{display:block;margin-top:3px;font-size:5.6px;font-weight:700;color:#17181c;
          text-decoration:none}
        .pgcard s span{font-weight:400;color:#a08f86;text-decoration:line-through;
          margin-left:4px;font-size:4.6px}
        .pgstrip{display:flex;justify-content:space-between;margin:16px 26px 0;padding:9px 0;
          border-top:1px solid #eee6e0;border-bottom:1px solid #eee6e0}
        .pgstrip span{font-size:4.4px;letter-spacing:.12em;color:#7d7169;text-transform:uppercase}

        .wa{position:absolute;right:16px;bottom:24px;width:56px;height:56px;border-radius:50%;
          background:#25d366;display:grid;place-items:center;z-index:300;
          box-shadow:0 8px 20px rgba(0,0,0,.5)}
        .wa svg{width:31px;height:31px}
        .wa::after{content:"";position:absolute;inset:0;border-radius:50%;
          border:2px solid rgba(37,211,102,.5);animation:pulse 2.8s ease-out infinite}
        @keyframes pulse{0%{transform:scale(1);opacity:.75}70%{transform:scale(1.4);opacity:0}100%{opacity:0}}

        html.intro .nav{opacity:0;translate:0 -9px}
        html.intro .mark,html.intro .wm,html.intro .links a,html.intro .nav .btn,html.intro .burger{opacity:0;translate:0 6px}
        html.intro .badge{opacity:0;translate:0 11px;scale:.985}
        html.intro .h1{opacity:0;translate:0 15px;clip-path:inset(100% 0 -30% 0)}
        html.intro .sub{opacity:0;translate:0 10px}
        html.intro .cta2{opacity:0;translate:0 13px;scale:.985}
        html.intro .ring{opacity:0;translate:0 18px;scale:.99}
        html.intro .browser{opacity:0;translate:0 26px}
        html.intro .wa{opacity:0;scale:.88}
        @media (prefers-reduced-motion:reduce){
          html.intro .nav,html.intro .mark,html.intro .wm,html.intro .links a,
          html.intro .nav .btn,html.intro .burger,html.intro .badge,html.intro .h1,
          html.intro .sub,html.intro .cta2,html.intro .ring,html.intro .browser,html.intro .wa{
            opacity:1;translate:none;scale:none;clip-path:none}
          .wa::after{animation:none}
          .navmenu,.burger span{transition:none}
        }

        @media (max-width:1080px){
          .burger{display:grid;place-content:center;gap:4px;position:absolute;right:12px;top:11px;
            width:42px;height:42px;padding:0;border:0;border-radius:14px;background:transparent;
            cursor:pointer;-webkit-tap-highlight-color:transparent;z-index:2}
          .burger span{display:block;width:19px;height:1.6px;border-radius:2px;
            background:rgba(255,255,255,.92);
            transition:transform .28s cubic-bezier(.4,0,.2,1),opacity .18s}
          .burger:focus-visible{outline:2px solid rgba(120,225,255,.7);outline-offset:2px}
          .nav.open .burger span:nth-child(1){transform:translateY(5.6px) rotate(45deg)}
          .nav.open .burger span:nth-child(2){opacity:0}
          .nav.open .burger span:nth-child(3){transform:translateY(-5.6px) rotate(-45deg)}
          .navmenu{display:block;position:absolute;left:0;right:0;top:74px;padding:12px;
            border-radius:22px;border:1px solid rgba(255,255,255,.10);
            background:linear-gradient(180deg,rgba(11,15,22,.985),rgba(7,10,16,.99));
            -webkit-backdrop-filter:blur(18px) saturate(140%);backdrop-filter:blur(18px) saturate(140%);
            box-shadow:0 26px 60px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.05);
            opacity:0;visibility:hidden;transform:translateY(-8px);
            transition:opacity .24s ease,transform .28s cubic-bezier(.4,0,.2,1),visibility .28s}
          .nav.open .navmenu{opacity:1;visibility:visible;transform:none}
          .links{position:static;display:flex;flex-direction:column;align-items:stretch;
            height:auto;gap:2px;transform:none!important}
          .links a{font-size:15px;padding:11px 14px;border-radius:12px;color:rgba(255,255,255,.9);
            transition:background .2s,color .2s}
          .nav .btn{position:static;width:100%;height:46px;margin-top:10px;font-size:15px}
          .nav .btn span{margin-top:3px}
        }
        @media (hover:hover) and (max-width:1080px){
          .burger:hover span{background:#fff}
          .links a:hover{background:rgba(255,255,255,.055);color:#fff;opacity:1}
        }
        @media (min-width:701px) and (max-width:1080px){
          .nav{left:286px;width:620px}
          .badge{left:448px;width:277px}
          .stack{transform:translateY(var(--stshift,0px))}
          .showcase{transform:translateY(var(--sshift,0px))}
          .ring{transform:scale(var(--rs,1));transform-origin:586px 595px}
          .wa{width:58px;height:58px;right:22px;bottom:26px}
          .wa svg{width:32px;height:32px}
        }

        /* ═══════════════════════════════════════════════════
           MOBILE — full responsive re-layout
           ═══════════════════════════════════════════════════ */
        @media (max-width:700px){
          html,body{overflow:hidden;height:100%}
          .stage{height:100dvh}
          .canvas{
            position:relative;left:auto;top:auto;
            width:100%;height:100%;
            transform:none;
            display:flex;flex-direction:column;align-items:center;
            padding:max(0px, env(safe-area-inset-top)) 20px
                    max(0px, env(safe-area-inset-bottom));
            overflow:hidden;
          }
          .canvas>*{position:static}
          .stack{display:contents}

          .nav{
            position:relative;left:auto;top:auto;
            width:100%;max-width:500px;height:58px;
            margin-top:clamp(10px,1.5vh,15px);
            flex:0 0 auto;
          }
          .mark{left:16px;top:calc(50% - 13px);width:26px;height:26px}
          .wm{left:49px;top:0;height:100%}
          .wm .kick{top:calc(50% - 15px);font-size:5px;letter-spacing:.2em}
          .wm .name{top:calc(50% - 9px);font-size:18px;transform:scaleX(.88);
            transform-origin:left center}
          .burger{right:8px;top:7px;width:44px;height:44px}
          .navmenu{top:68px;padding:12px}
          .links a{font-size:16px;padding:12px 15px;border-radius:12px}
          .nav .btn{height:48px;margin-top:10px;font-size:16px}

          .badge{
            position:relative;left:auto;top:auto;
            margin-top:clamp(14px,2.2vh,22px);
            width:auto;max-width:calc(100% - 4px);height:36px;
            flex:0 0 auto;border-radius:18px;
          }
          .badge b{
            position:relative;left:auto;top:auto;height:36px;
            padding:0 15px 0 42px;font-size:12.5px;
          }
          .badge i{top:4px;left:4px;width:28px;height:28px}
          .badge i svg{width:13px;height:19px}

          .h1{
            position:relative;left:auto;top:auto;transform:none;
            white-space:normal;text-align:center;
            font-size:clamp(28px,8.2vw,38px);line-height:1.06;
            letter-spacing:-.01em;max-width:12ch;padding:0 4px;
          }
          .h1.l1{margin-top:clamp(12px,2vh,20px)}

          .sub{
            position:relative;left:auto;top:auto;transform:none;
            white-space:normal;text-align:center;
            font-size:clamp(13.5px,3.8vw,15.5px);line-height:1.5;
            max-width:min(340px, 88vw);padding:0 4px;
          }
          .sub.s1{margin-top:clamp(10px,1.6vh,14px)}
          .sub .nb{white-space:normal}

          .cta2{
            position:relative;left:auto;top:auto;
            margin-top:clamp(14px,2.2vh,22px);
            flex:0 0 auto;width:auto;min-width:158px;
            height:52px;padding:0 26px;font-size:16px;
          }

          .showcase{
            position:relative;left:auto;top:auto;
            flex:1 1 auto;width:100%;height:auto;
            min-height:200px;
            overflow:hidden;
            margin-top:clamp(6px,1vh,12px);
          }
          .ring{
            position:absolute;left:50%;margin-left:-586px;
            top:-446px;bottom:auto;
            width:1172px;height:657px;
            transform-origin:586px 466px;
            transform:scale(1.02);
          }
          .browser{
            position:absolute;left:50%;transform:translateX(-50%);
            top:212px;bottom:0;
            width:calc(100% + 40px);height:auto;
            border-radius:22px 22px 0 0;
          }
          .browser .bar{height:36px}
          .omni{left:50%;transform:translateX(-50%);width:58%;height:24px;top:6px}
          .omni span{font-size:9px}
          .dots{top:14px}
          .tools{display:none}
          .ann{height:15px}
          .ann span{font-size:6px}
          .page{top:36px}
          .pagebody{top:56px}
          .pghero{margin:0 18px;height:122px;border-radius:10px}
          .pghero .copy{left:18px}
          .pghero .copy u{font-size:7.5px;letter-spacing:.2em}
          .pghero .copy em{font-size:20px;margin-top:5px}
          .pghero .copy i{font-size:8.5px;padding:6px 13px;margin-top:8px}
          .pgsec{margin:16px 18px 10px}
          .pgsec b{font-size:14px}
          .pgsec u{font-size:8px}
          .pggrid{grid-template-columns:repeat(2,1fr);gap:14px;margin:0 18px}
          .pgcard .ph{border-radius:9px}
          .pgcard .tag{font-size:7px;padding:3px 7px;border-radius:4px}
          .pgcard b{font-size:10.5px;margin-top:7px}
          .pgcard i{font-size:8.5px}
          .pgcard s{font-size:11.5px;margin-top:4px}
          .pgcard s span{font-size:8.5px}
          .pgstrip{margin:16px 18px 0;flex-wrap:wrap;gap:5px 16px}
          .pgstrip span{font-size:8px}
          .wa{width:52px;height:52px;right:14px;bottom:calc(14px + env(safe-area-inset-bottom))}
          .wa svg{width:28px;height:28px}
        }

        /* Small phones */
        @media (max-width:380px){
          .canvas{padding-left:16px;padding-right:16px}
          .h1{font-size:clamp(24px,7.6vw,30px)}
          .sub{font-size:13px}
          .cta2{height:48px;min-width:140px;font-size:15px}
          .badge b{font-size:11.5px;padding-left:40px;padding-right:12px}
          .pghero{height:104px}
        }

        /* Short landscape phones — compress vertically */
        @media (max-height:520px) and (orientation:landscape){
          .canvas{flex-direction:row;flex-wrap:wrap;justify-content:center;
            align-items:flex-start;gap:16px;padding:10px 24px}
          .nav{width:60%;max-width:none;margin:0}
          .badge{margin-top:0}
          .h1{margin-top:0;font-size:clamp(20px,4vw,28px);max-width:14ch}
          .sub{max-width:60%}
          .cta2{margin-top:8px}
          .showcase{display:none}
          .wa{width:44px;height:44px;bottom:10px;right:10px}
          .wa svg{width:22px;height:22px}
        }
      `}</style>

      <div className="stage">
        <div className="bg" />
        <div id="stA" className="stars" />
        <div id="stB" className="stars" />

        <div className="canvas" ref={canvasRef}>
          {/* NAV */}
          <nav className={`nav${menuOpen ? " open" : ""}`}>
            <svg className="mark" viewBox="0 0 48 48">
              <defs>
                <linearGradient id="sw" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8ef4ff" />
                  <stop offset=".5" stopColor="#35d8ff" />
                  <stop offset="1" stopColor="#0a86d8" />
                </linearGradient>
                <linearGradient id="sw2" x1="40" y1="10" x2="10" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a6f7ff" />
                  <stop offset="1" stopColor="#0f9ae0" stopOpacity=".25" />
                </linearGradient>
              </defs>
              <g transform="rotate(-32 24 24)">
                <ellipse
                  cx="24"
                  cy="24"
                  rx="18.5"
                  ry="9.6"
                  stroke="url(#sw2)"
                  strokeWidth="3.1"
                  strokeLinecap="round"
                  strokeDasharray="58 30"
                  strokeDashoffset="14"
                  fill="none"
                />
                <circle cx="41.4" cy="20.6" r="3.1" fill="#bff6ff" />
              </g>
              <circle cx="24" cy="24" r="6.6" fill="url(#sw)" />
              <circle cx="24" cy="24" r="2.6" fill="#fff" />
            </svg>

            <div className="wm">
              <span className="kick">SHOP</span>
              <span className="name" id="wmName">
                BD STORE
              </span>
            </div>

            <button
              type="button"
              className="burger"
              aria-label="Opens menu"
              aria-expanded={menuOpen}
              aria-controls="navmenu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>

            <div className="navmenu" id="navmenu">
              <div className="links" id="links">
                <a href="/products">Shop</a>
                <a href="/track">Track</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
                <a href="/faq">FAQ</a>
              </div>
              <a href="/products" className="btn">
                <span id="ctaLabel">Shop Now</span>
              </a>
            </div>
          </nav>

          {/* STACK (badge + type + cta) */}
          <div className="stack">
            <div className="badge">
              <i>
                <svg
                  viewBox="5 1 14 22"
                  preserveAspectRatio="none"
                  fill="rgba(16,112,152,.72)"
                  stroke="rgba(190,236,255,.6)"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                >
                  <path d="M13.9 1.6 5.5 13.6a.7.7 0 0 0 .6 1.1h4.2l-1 7.7a.7.7 0 0 0 1.25.55l8.3-12.1a.7.7 0 0 0-.6-1.1h-4.2l1-7.7a.7.7 0 0 0-1.25-.55Z" />
                </svg>
              </i>
              <b id="badgeTxt">Cash on delivery across Bangladesh</b>
            </div>

            <div className="h1 l1" id="h1a">
              Quality products
            </div>
            <div className="h1" id="h1b">
              Delivered home
            </div>

            <div className="sub s1" id="sub1">
              <b>
                Fast delivery, <span className="nb">Cash on Delivery</span>
              </b>{" "}
              across Bangladesh,
            </div>
            <div className="sub" id="sub2">
              quality checked, easy 7-day returns.
            </div>

            <a href="/products" className="btn cta2">
              <span id="vpLabel">Shop now</span>
            </a>
          </div>

          {/* SHOWCASE + RING */}
          <div className="showcase">
            <div className="ring" ref={ringRef} />
          </div>

          {/* BROWSER MOCK */}
          <div className="browser">
            <div className="bar">
              <div className="dots">
                <i style={{ background: "#ee5c62" }} />
                <i style={{ background: "#f6b719" }} />
                <i style={{ background: "#12c02f" }} />
              </div>
              <div className="omni">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.8-3.8" />
                </svg>
                <span>bdstore.com/shop</span>
              </div>
              <div className="tools">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                  <path d="M12 16V4m0 0L8 8m4-4 4 4" />
                  <path d="M4 15v5h16v-5" />
                </svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6">
                  <path d="M12 3 3 8l9 5 9-5-9-5Z" fill="#fff" fillOpacity=".95" />
                  <path d="M3 13l9 5 9-5" opacity=".55" />
                </svg>
              </div>
            </div>

            <div className="page">
              <div className="ann">
                <u style={{ left: 20 }}>‹</u>
                <span>Free delivery over ৳2000</span>
                <u style={{ right: 20 }}>›</u>
              </div>
              <div className="shoplogo">
                <em>BD</em>
                <i>STORE</i>
              </div>
              <div className="shopicons">
                <svg viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.8-3.8" />
                </svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4.5 21c0-4.2 3.4-6.6 7.5-6.6s7.5 2.4 7.5 6.6" />
                </svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2">
                  <path d="M5.5 8h13l-1.2 12H6.7L5.5 8Z" />
                  <path d="M9 8V6.2A3 3 0 0 1 15 6.2V8" />
                </svg>
              </div>

              <div className="pagebody">
                <div className="pghero">
                  <img src={BROWSER_IMGS.hero.url} alt={BROWSER_IMGS.hero.alt} />
                  <div className="scrim" />
                  <div className="copy">
                    <u>New arrivals</u>
                    <em>
                      Shop the best
                      <br />
                      of BD Store.
                    </em>
                    <i>SHOP TODAY</i>
                  </div>
                </div>

                <div className="pgsec">
                  <b>Best sellers</b>
                  <u>see more</u>
                </div>

                <div className="pggrid">
                  <div className="pgcard">
                    <div className="ph">
                      <img src={BROWSER_IMGS.p1.url} alt={BROWSER_IMGS.p1.alt} />
                      <span className="tag">-24%</span>
                    </div>
                    <b>Car Vacuum</b>
                    <i>Cordless · 120W</i>
                    <s>
                      ৳ 999 <span>৳ 1299</span>
                    </s>
                  </div>
                  <div className="pgcard">
                    <div className="ph">
                      <img src={BROWSER_IMGS.p2.url} alt={BROWSER_IMGS.p2.alt} />
                    </div>
                    <b>LED Table Lamp</b>
                    <i>USB-C · 3 modes</i>
                    <s>৳ 799</s>
                  </div>
                  <div className="pgcard">
                    <div className="ph">
                      <img src={BROWSER_IMGS.p3.url} alt={BROWSER_IMGS.p3.alt} />
                      <span className="tag">SET</span>
                    </div>
                    <b>Home Kit</b>
                    <i>3 products</i>
                    <s>
                      ৳ 1799 <span>৳ 2399</span>
                    </s>
                  </div>
                  <div className="pgcard">
                    <div className="ph">
                      <img src={BROWSER_IMGS.p4.url} alt={BROWSER_IMGS.p4.alt} />
                      <span className="tag">JUST</span>
                    </div>
                    <b>Essentials Pack</b>
                    <i>Light · daily</i>
                    <s>৳ 749</s>
                  </div>
                </div>

                <div className="pgstrip">
                  <span>Free delivery over ৳2000</span>
                  <span>Cash on delivery</span>
                  <span>7-day returns</span>
                  <span>Quality checked</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <a href="https://wa.me/8801700000000" className="wa" aria-label="WhatsApp">
          <svg viewBox="0 0 32 32" fill="#fff">
            <path d="M16.004 3C9.377 3 4 8.377 4 15.004c0 2.652.86 5.11 2.325 7.11L4.67 27.33l5.39-1.41A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.623 28 15.004 28 8.377 22.63 3 16.004 3zm6.98 16.99c-.29.82-1.69 1.5-2.35 1.6-.6.09-1.36.13-2.2-.14-.5-.16-1.15-.38-1.98-.74-3.48-1.5-5.75-5-5.92-5.23-.17-.23-1.35-1.8-1.35-3.43 0-1.64.86-2.45 1.17-2.78.3-.33.66-.41.88-.41.22 0 .44 0 .63.01.2.01.47-.08.74.56.29.68.98 2.38 1.07 2.55.09.17.15.37.03.6-.12.23-.18.37-.35.57-.17.2-.36.44-.51.59-.17.17-.35.35-.15.69.2.33.89 1.47 1.91 2.38 1.31 1.17 2.41 1.53 2.75 1.7.34.17.54.14.74-.09.2-.23.85-.99 1.08-1.33.23-.34.46-.28.77-.17.31.11 1.98.93 2.32 1.1.34.17.57.25.65.39.08.14.08.82-.21 1.64z" />
          </svg>
        </a>
      </div>
    </>
  );
}