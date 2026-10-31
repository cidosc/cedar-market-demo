var tt = Object.defineProperty;
var st = (t, e, s) => e in t ? tt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s;
var h = (t, e, s) => st(t, typeof e != "symbol" ? e + "" : e, s);
const E = (t, e = 3) => parseFloat(t.toFixed(e)), X = (t, e = 0, s = 100) => Math.min(Math.max(t, e), s), U = (t, e, s, i, n) => E(i + (n - i) * (t - e) / (s - e)), le = () => typeof performance != "undefined" ? performance.now() : Date.now(), Oe = typeof requestAnimationFrame != "undefined" ? (t) => requestAnimationFrame(t) : (t) => setTimeout(() => t(le()), 16.666666666666668), q = /* @__PURE__ */ new Set(), De = (t) => {
  q.forEach((e) => {
    e(t) || q.delete(e);
  }), q.size !== 0 && Oe(De);
}, it = (t) => (q.size === 0 && Oe(De), q.add(t), {
  abort: () => {
    q.delete(t);
  }
});
class ge {
  constructor(e) {
    h(this, "fns", /* @__PURE__ */ new Set());
    h(this, "getCurrent");
    this.getCurrent = e;
  }
  subscribe(e) {
    return this.fns.add(e), e(this.getCurrent()), () => {
      this.fns.delete(e);
    };
  }
  emit(e) {
    for (const s of this.fns)
      s(e);
  }
  get size() {
    return this.fns.size;
  }
  clear() {
    this.fns.clear();
  }
}
const nt = 2, rt = (t) => Math.max(0, Math.min(t, nt)), Ee = (t, e, s, i, n) => {
  const r = n - i, o = (i - s) / (t.dt || 1 / 60), c = e.stiffness * r, l = e.damping * o, a = (c - l) * t.invMass, d = (o + a) * t.dt;
  return Math.abs(d) < e.precision && Math.abs(r) < e.precision ? n : (t.settled = !1, i + d);
}, at = (t, e) => {
  var i, n, r, o;
  const s = (i = t.axes) == null ? void 0 : i[e];
  return s ? {
    stiffness: (n = s.stiffness) != null ? n : t.stiffness,
    damping: (r = s.damping) != null ? r : t.damping,
    precision: (o = s.precision) != null ? o : t.precision
  } : t;
}, ot = (t, e, s, i) => {
  var l, a, d;
  if (typeof s == "number")
    return Ee(t, t, e, s, i);
  const n = s, r = e, o = i, c = {};
  for (const m in n) {
    const f = (l = n[m]) != null ? l : 0;
    c[m] = Ee(t, at(t, m), (a = r[m]) != null ? a : f, f, (d = o[m]) != null ? d : f);
  }
  return c;
};
class G {
  constructor(e, s = {}) {
    h(this, "stiffness");
    h(this, "damping");
    h(this, "precision");
    h(this, "axes");
    h(this, "value");
    h(this, "lastValue");
    h(this, "targetValue");
    h(this, "invMass", 1);
    h(this, "invMassRecoveryRate", 0);
    h(this, "cancelTask", !1);
    h(this, "task", null);
    h(this, "lastTime", 0);
    h(this, "settlePromise", null);
    h(this, "settleResolve", null);
    h(this, "subscribers", new ge(() => this.value));
    var i, n, r;
    this.value = e, this.lastValue = e, this.targetValue = e, this.stiffness = (i = s.stiffness) != null ? i : 0.15, this.damping = (n = s.damping) != null ? n : 0.8, this.precision = (r = s.precision) != null ? r : 0.01, this.axes = s.axes;
  }
  get current() {
    return this.value;
  }
  /** Whether the spring is at rest (no animation task is running). */
  get settled() {
    return this.task === null;
  }
  subscribe(e) {
    return this.subscribers.subscribe(e);
  }
  notify() {
    this.subscribers.emit(this.value);
  }
  set(e, s = {}) {
    if (this.targetValue = e, s.hard || this.stiffness >= 1 && this.damping >= 1)
      return this.cancelTask = !0, this.task && (this.task.abort(), this.task = null), this.lastTime = le(), this.lastValue = e, this.value = e, this.notify(), this.resolveSettle(), Promise.resolve();
    if (s.soft) {
      const i = s.soft === !0 ? 0.5 : s.soft;
      this.invMassRecoveryRate = 1 / (i * 60), this.invMass = 0;
    }
    return this.task || (this.lastTime = le(), this.cancelTask = !1, this.task = it((i) => {
      if (this.cancelTask)
        return this.cancelTask = !1, this.task = null, !1;
      this.invMass = Math.min(this.invMass + this.invMassRecoveryRate, 1);
      const n = {
        invMass: this.invMass,
        stiffness: this.stiffness,
        damping: this.damping,
        precision: this.precision,
        axes: this.axes,
        settled: !0,
        dt: rt((i - this.lastTime) * 60 / 1e3)
      }, r = ot(n, this.lastValue, this.value, this.targetValue);
      return this.lastTime = i, this.lastValue = this.value, this.value = r, this.notify(), n.settled && (this.task = null, this.resolveSettle()), !n.settled;
    })), this.settlePromise || (this.settlePromise = new Promise((i) => {
      this.settleResolve = i;
    })), this.settlePromise;
  }
  resolveSettle() {
    const e = this.settleResolve;
    this.settlePromise = null, this.settleResolve = null, e == null || e();
  }
  destroy() {
    var e;
    this.cancelTask = !0, (e = this.task) == null || e.abort(), this.task = null, this.resolveSettle(), this.subscribers.clear();
  }
}
const v = {
  root: "holo-card",
  translater: "holo-card__translater",
  rotator: "holo-card__rotator",
  front: "holo-card__front",
  back: "holo-card__back",
  image: "holo-card__image",
  content: "holo-card__content",
  layers: "holo-card__layers",
  layer: "holo-card__layer",
  overlay: "holo-card__overlay",
  shine: "holo-card__shine",
  glare: "holo-card__glare",
  interactive: "holo-card--interactive",
  active: "holo-card--active",
  interacting: "holo-card--interacting",
  masked: "holo-card--masked",
  maskCard: "holo-card--mask-card",
  depth: "holo-card--depth",
  customGlare: "holo-card--custom-glare",
  overlayInteractive: "holo-card__overlay--interactive"
}, ct = () => {
  if (typeof document == "undefined")
    throw new Error("@kongyo2/cards-css: a DOM document is required to build a holo card element.");
  return document;
}, he = (t, e) => {
  if (e)
    for (const [s, i] of Object.entries(e)) {
      const n = s.startsWith("--") ? s : `--${s}`;
      t.style.setProperty(n, typeof i == "number" ? String(i) : i);
    }
}, lt = /[\\"\n\r\f]/g, Z = (t) => `url("${t.replace(lt, (e) => `\\${e}`)}")`, Fe = (t) => {
  var s;
  if (!t)
    return null;
  const e = typeof t == "string" ? { image: t } : t;
  return e.image ? {
    image: e.image,
    size: e.size,
    position: e.position,
    repeat: e.repeat,
    mode: (s = e.mode) != null ? s : "shine"
  } : null;
}, Be = (t, e) => {
  const s = e ? e.split(/\s+/).filter(Boolean) : [];
  s.length > 0 && t.classList.add(...s);
}, de = (t, e) => typeof e == "function" ? e(t) : e, Ge = (t, e) => {
  var i, n;
  const s = t.createElement("div");
  return s.className = v.layer, Be(s, e.className), typeof e.blend == "string" && s.style.setProperty("--layer-blend", e.blend), typeof e.opacity == "number" && s.style.setProperty("--layer-opacity", String(e.opacity)), typeof e.parallax == "number" && s.style.setProperty("--layer-parallax", String(e.parallax)), e.mask && (s.style.setProperty("--layer-mask", Z(e.mask)), s.classList.add(`${v.layer}--masked`)), e.image && (s.style.setProperty("--layer-image", Z(e.image)), s.style.setProperty("--layer-size", (i = e.size) != null ? i : "cover"), s.style.setProperty("--layer-position", (n = e.position) != null ? n : "center")), he(s, e.vars), e.content && s.appendChild(de(t, e.content)), s;
}, ht = (t) => {
  var a, d, m, f;
  const e = ct(), s = e.createElement("div");
  s.className = v.root, Be(s, t.className), s.dataset.effect = (a = t.effect) != null ? a : "none";
  const i = Fe(t.mask);
  i && (s.classList.add(v.masked), i.mode === "card" && s.classList.add(v.maskCard));
  const n = e.createElement("div");
  n.className = v.translater;
  const r = e.createElement("div");
  if (r.className = v.rotator, t.back) {
    const g = e.createElement("img");
    g.className = v.back, g.src = t.back, g.alt = (d = t.backAlt) != null ? d : "", g.loading = "lazy", r.appendChild(g);
  }
  const o = e.createElement("div");
  if (o.className = v.front, t.image) {
    const g = e.createElement("img");
    g.className = v.image, g.src = t.image, g.alt = (m = t.imageAlt) != null ? m : "", g.loading = "lazy", o.appendChild(g);
  }
  if (t.content) {
    const g = e.createElement("div");
    g.className = v.content, g.appendChild(de(e, t.content)), o.appendChild(g);
  }
  if ((f = t.layers) != null && f.length) {
    const g = e.createElement("div");
    g.className = v.layers;
    for (const w of t.layers)
      g.appendChild(Ge(e, w));
    o.appendChild(g);
  }
  const c = e.createElement("div");
  c.className = v.shine;
  const l = e.createElement("div");
  if (l.className = v.glare, o.appendChild(c), o.appendChild(l), t.overlay) {
    const g = e.createElement("div");
    g.className = v.overlay, t.overlayInteractive && g.classList.add(v.overlayInteractive), g.appendChild(de(e, t.overlay)), o.appendChild(g);
  }
  return r.appendChild(o), n.appendChild(r), s.appendChild(n), s;
};
let Y = null;
const Ve = new ge(() => Y), C = () => Y, z = (t) => {
  t !== Y && (Y = t, Ve.emit(Y));
}, dt = (t) => Ve.subscribe(t), te = (t) => {
  var e, s, i;
  return t ? { alpha: (e = t.alpha) != null ? e : 0, beta: (s = t.beta) != null ? s : 0, gamma: (i = t.gamma) != null ? i : 0 } : { alpha: 0, beta: 0, gamma: 0 };
};
let ue = !0, j = te();
const ie = () => {
  ue = !0, j = te();
}, Ue = (t) => {
  const e = te(t);
  return {
    absolute: e,
    relative: {
      alpha: e.alpha - j.alpha,
      beta: e.beta - j.beta,
      gamma: e.gamma - j.gamma
    }
  };
}, fe = new ge(() => Ue());
let J = !1;
const we = (t) => {
  ue && (ue = !1, j = te(t)), fe.emit(Ue(t));
}, ut = (t) => {
  const e = fe.subscribe(t);
  return !J && typeof window != "undefined" && (J = !0, window.addEventListener("deviceorientation", we, !0)), () => {
    e(), fe.size === 0 && J && typeof window != "undefined" && (J = !1, window.removeEventListener("deviceorientation", we, !0));
  };
}, ft = 2654435769, ye = (t) => {
  let e = t >>> 0;
  return () => {
    e = e + 1831565813 | 0;
    let s = Math.imul(e ^ e >>> 15, 1 | e);
    return s = s + Math.imul(s ^ s >>> 7, 61 | s) ^ s, ((s ^ s >>> 14) >>> 0) / 4294967296;
  };
}, pt = (t) => `data:image/svg+xml,${t.replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim().replace(/%/g, "%25").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/#/g, "%23").replace(/&/g, "%26").replace(/"/g, "'").replace(/\n/g, "%0A")}`, ve = (t, e, s, i) => pt(`<svg xmlns='http://www.w3.org/2000/svg' width='${t}' height='${e}' viewBox='0 0 ${t} ${e}'>` + (s ? `<defs>${s}</defs>` : "") + i + "</svg>"), mt = (t, e) => {
  const s = e[Math.floor(t() * e.length)];
  return s != null ? s : e[0];
}, D = (t, e, s) => e + t() * (s - e), ee = (t, e, s, i, n, r = {}) => {
  var c;
  const o = r.filter ? ` filter='url(${r.filter})'` : "";
  return `<circle cx='${t.toFixed(1)}' cy='${e.toFixed(1)}' r='${s.toFixed((c = r.rDigits) != null ? c : 2)}' fill='${i}' opacity='${n.toFixed(2)}'${o}/>`;
}, pe = (t, e, s, i) => `<filter id='${t}' x='${s}' y='${s}' width='${i}' height='${i}'><feGaussianBlur stdDeviation='${e}'/></filter>`, qe = (t, e = 32) => {
  const s = Math.min(e, Math.max(1, Math.round(e * t))), i = [];
  for (let n = 0; n < e - s; n += 1)
    i.push("0");
  for (let n = 0; n < s; n += 1)
    i.push("1");
  return i.join(" ");
}, Xe = (t, e, s, i = !0) => {
  let n = "", r = "";
  const o = i ? "stitch" : "noStitch";
  return s.forEach((c, l) => {
    const a = `${t}${l}`;
    n += `<filter id='${a}' x='0%' y='0%' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='${c.freq}' numOctaves='1' seed='${(e + l * 37) % 9973}' stitchTiles='${o}' result='n'/><feColorMatrix in='n' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0' result='a'/><feComponentTransfer in='a' result='m'><feFuncA type='discrete' tableValues='${qe(c.keep)}'/></feComponentTransfer><feComposite in='SourceGraphic' in2='m' operator='in'/></filter>`, r += `<rect width='100%' height='100%' fill='${c.color}' filter='url(#${a})' opacity='${c.opacity}'/>`;
  }), { defs: n, body: r };
}, ze = (t, e, s, i, n, r, o, c) => {
  let l = "";
  for (let a = 0; a < i; a += 1)
    l += ee(t() * e, t() * s, D(t, o[0], o[1]), mt(t, n), D(t, c[0], c[1]), { rDigits: 1 });
  return `<g filter='url(${r})'>${l}</g>`;
}, Ye = (t, e, s, i, n) => {
  let r = "";
  for (let o = 0; o < i; o += 1) {
    const c = t() * e, l = t() * s, a = D(t, 1.1, 2.6);
    r += ee(c, l, a * 2.6, "#ffffff", 0.14, { rDigits: 1, filter: n }) + ee(c, l, a, "#ffffff", D(t, 0.75, 1));
  }
  return r;
}, gt = (t, e, s, i, n) => {
  let r = "";
  for (let o = 0; o < i; o += 1) {
    const c = t() * e, l = t() * s, a = D(t, 14, 30), d = 26 + Math.floor(t() * 22);
    for (let m = 0; m < d; m += 1) {
      const f = t() * Math.PI * 2, g = a * D(t, 0.78, 1.28);
      r += ee(c + Math.cos(f) * g, l + Math.sin(f) * g * 1.05, D(t, 0.5, 1.5), n, D(t, 0.4, 0.9));
    }
  }
  return r;
}, H = 512, W = 716, yt = (t) => pe("blur", 2.6, "-30%", "160%") + pe("glow", 2.4, "-200%", "500%") + t, vt = (t) => ve(200, 200, `<filter id='grain' x='0%' y='0%' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='${t % 9973}' stitchTiles='stitch' result='n'/><feColorMatrix in='n' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0' result='a'/><feComponentTransfer in='a' result='m'><feFuncA type='discrete' tableValues='${qe(0.28)}'/></feComponentTransfer><feFlood flood-color='#ffffff' result='w'/><feComposite in='w' in2='m' operator='in'/></filter>`, "<rect width='100%' height='100%' fill='#000000'/><rect width='100%' height='100%' filter='url(#grain)' opacity='0.4'/>"), bt = (t) => {
  const { defs: e, body: s } = Xe("gl", t, [
    { freq: 0.82, keep: 0.42, color: "#8f8f8f", opacity: 0.85 },
    { freq: 0.7, keep: 0.22, color: "#dcdcdc", opacity: 1 },
    { freq: 0.6, keep: 0.08, color: "#ffffff", opacity: 1 }
  ]), i = ye(t + 99), n = Ye(i, 240, 240, 16, "#glow");
  return ve(240, 240, `${pe("glow", 1.5, "-200%", "500%")}${e}`, `<rect width='100%' height='100%' fill='#050505'/>${s}${n}`);
}, be = (t, e, s, i) => {
  const n = ye(e), { defs: r, body: o } = Xe(t, e, s, !1);
  return ve(H, W, yt(r), i(n, o));
}, St = (t) => be("csb", t, [
  { freq: 0.85, keep: 0.32, color: "#97a3c8", opacity: 0.8 },
  { freq: 0.72, keep: 0.13, color: "#ffffff", opacity: 0.95 },
  { freq: 0.76, keep: 0.05, color: "#9fb6ff", opacity: 0.85 },
  { freq: 0.78, keep: 0.04, color: "#ffc2d8", opacity: 0.8 }
], (e, s) => {
  const i = ze(e, H, W, 26, ["#465777", "#6d6088", "#9a7790", "#aab3cc", "#566f9e"], "#blur", [5, 14], [0.18, 0.4]), n = Ye(e, H, W, 24, "#glow");
  return `<rect width='100%' height='100%' fill='#04030c'/>${i}${s}${n}`;
}), Et = (t) => be("csm", t, [
  { freq: 0.66, keep: 0.2, color: "#241a4e", opacity: 0.95 },
  { freq: 0.58, keep: 0.11, color: "#4a2168", opacity: 0.9 },
  { freq: 0.52, keep: 0.055, color: "#7a1f6b", opacity: 0.85 },
  { freq: 0.5, keep: 0.03, color: "#c87a3a", opacity: 0.85 }
], (e, s) => `${ze(e, H, W, 16, ["#241a4e", "#3a2168", "#1a1430"], "#blur", [7, 18], [0.45, 0.8])}${s}`), wt = (t) => be("cst", t, [
  { freq: 0.62, keep: 0.06, color: "#6a6a76", opacity: 0.85 },
  { freq: 0.52, keep: 0.035, color: "#42424c", opacity: 0.9 }
], (e, s) => {
  const i = gt(e, H, W, 7, "#54545f");
  return `${s}${i}`;
}), Tt = (t = {}) => {
  var s;
  const e = (s = t.seed) != null ? s : ft;
  return {
    grain: vt(e),
    glitter: bt(e + 1),
    cosmosBottom: St(e + 2),
    cosmosMiddle: Et(e + 3),
    cosmosTop: wt(e + 4)
  };
}, Te = {
  grain: "--hc-grain",
  glitter: "--hc-glitter",
  cosmosBottom: "--hc-cosmos-bottom",
  cosmosMiddle: "--hc-cosmos-middle",
  cosmosTop: "--hc-cosmos-top"
}, Pt = (t) => {
  const e = {};
  for (const s of Object.keys(Te))
    e[Te[s]] = `url("${t[s]}")`;
  return e;
}, xt = {
  rainbow: {
    sunpillars: [
      "hsl(2, 100%, 73%)",
      "hsl(53, 100%, 69%)",
      "hsl(93, 100%, 69%)",
      "hsl(176, 100%, 76%)",
      "hsl(228, 100%, 74%)",
      "hsl(283, 100%, 73%)"
    ],
    spectrum: ["#f80e35", "#eedf10", "#21e985", "#0dbde9", "#c929f1"],
    cosmos: [
      "hsl(53, 65%, 60%)",
      "hsl(93, 56%, 50%)",
      "hsl(176, 54%, 49%)",
      "hsl(228, 59%, 55%)",
      "hsl(283, 60%, 55%)",
      "hsl(326, 59%, 51%)"
    ]
  },
  gold: {
    sunpillars: [
      "hsl(45, 100%, 80%)",
      "hsl(38, 100%, 68%)",
      "hsl(50, 100%, 78%)",
      "hsl(33, 95%, 62%)",
      "hsl(48, 100%, 85%)",
      "hsl(40, 100%, 70%)"
    ],
    spectrum: ["#8c5a12", "#ffd24a", "#fff0b0", "#e0962a", "#6b3f06"],
    cosmos: [
      "hsl(45, 80%, 65%)",
      "hsl(40, 75%, 58%)",
      "hsl(36, 70%, 52%)",
      "hsl(50, 85%, 70%)",
      "hsl(33, 65%, 48%)",
      "hsl(28, 70%, 55%)"
    ],
    edge: "hsl(45, 100%, 78%)",
    glow: "hsl(45, 100%, 80%)"
  },
  aurora: {
    sunpillars: [
      "hsl(150, 90%, 72%)",
      "hsl(170, 85%, 68%)",
      "hsl(190, 90%, 72%)",
      "hsl(260, 85%, 78%)",
      "hsl(140, 80%, 70%)",
      "hsl(200, 90%, 74%)"
    ],
    spectrum: ["#10b981", "#34d399", "#a7f3d0", "#22d3ee", "#8b5cf6"],
    cosmos: [
      "hsl(160, 60%, 55%)",
      "hsl(180, 55%, 50%)",
      "hsl(200, 60%, 55%)",
      "hsl(260, 55%, 58%)",
      "hsl(150, 55%, 52%)",
      "hsl(290, 50%, 55%)"
    ],
    edge: "hsl(160, 90%, 80%)",
    glow: "hsl(170, 100%, 85%)"
  },
  ruby: {
    sunpillars: [
      "hsl(350, 100%, 75%)",
      "hsl(330, 100%, 72%)",
      "hsl(10, 100%, 72%)",
      "hsl(300, 90%, 72%)",
      "hsl(355, 100%, 80%)",
      "hsl(20, 100%, 70%)"
    ],
    spectrum: ["#e11d48", "#fb7185", "#fecdd3", "#f43f5e", "#9f1239"],
    cosmos: [
      "hsl(350, 65%, 58%)",
      "hsl(330, 60%, 55%)",
      "hsl(10, 65%, 58%)",
      "hsl(300, 55%, 55%)",
      "hsl(355, 60%, 52%)",
      "hsl(20, 60%, 55%)"
    ],
    edge: "hsl(350, 100%, 82%)",
    glow: "hsl(345, 100%, 85%)"
  },
  sapphire: {
    sunpillars: [
      "hsl(210, 100%, 75%)",
      "hsl(190, 100%, 72%)",
      "hsl(230, 100%, 76%)",
      "hsl(170, 90%, 70%)",
      "hsl(250, 90%, 78%)",
      "hsl(200, 100%, 74%)"
    ],
    spectrum: ["#1d4ed8", "#3b82f6", "#bfdbfe", "#06b6d4", "#4338ca"],
    cosmos: [
      "hsl(210, 65%, 58%)",
      "hsl(190, 60%, 55%)",
      "hsl(230, 60%, 58%)",
      "hsl(170, 55%, 52%)",
      "hsl(250, 55%, 58%)",
      "hsl(200, 60%, 55%)"
    ],
    edge: "hsl(205, 100%, 80%)",
    glow: "hsl(200, 100%, 85%)"
  },
  mono: {
    sunpillars: [
      "hsl(0, 0%, 92%)",
      "hsl(0, 0%, 82%)",
      "hsl(0, 0%, 96%)",
      "hsl(0, 0%, 78%)",
      "hsl(0, 0%, 88%)",
      "hsl(0, 0%, 84%)"
    ],
    spectrum: ["#9ca3af", "#e5e7eb", "#ffffff", "#d1d5db", "#6b7280"],
    cosmos: [
      "hsl(0, 0%, 75%)",
      "hsl(0, 0%, 68%)",
      "hsl(0, 0%, 82%)",
      "hsl(0, 0%, 62%)",
      "hsl(0, 0%, 78%)",
      "hsl(0, 0%, 70%)"
    ],
    edge: "hsl(0, 0%, 90%)",
    glow: "hsl(0, 0%, 92%)"
  }
}, kt = (t) => {
  const s = { ...t.preset ? xt[t.preset] : void 0, ...t };
  return delete s.preset, s;
}, je = ["--red", "--yellow", "--green", "--blue", "--violet"], At = [
  "--sunpillar-1",
  "--sunpillar-2",
  "--sunpillar-3",
  "--sunpillar-4",
  "--sunpillar-5",
  "--sunpillar-6",
  ...je,
  "--cosmos-clr-1",
  "--cosmos-clr-2",
  "--cosmos-clr-3",
  "--cosmos-clr-4",
  "--cosmos-clr-5",
  "--cosmos-clr-6",
  "--card-edge",
  "--card-back",
  "--card-glow"
], He = (t, e) => t[e % t.length], Pe = (t, e, s, i) => {
  if (i.length !== 0)
    for (let n = 0; n < s; n += 1)
      t[`${e}${n + 1}`] = He(i, n);
}, Ct = (t) => {
  const e = kt(t), s = {};
  e.sunpillars && Pe(s, "--sunpillar-", 6, e.sunpillars);
  const i = e.spectrum;
  return i && i.length > 0 && je.forEach((n, r) => {
    s[n] = He(i, r);
  }), e.cosmos && Pe(s, "--cosmos-clr-", 6, e.cosmos), e.edge && (s["--card-edge"] = e.edge), e.back && (s["--card-back"] = e.back), e.glow && (s["--card-glow"] = e.glow), s;
}, xe = (t) => typeof requestAnimationFrame != "undefined" ? requestAnimationFrame(t) : setTimeout(t, 16), ke = (t) => {
  typeof cancelAnimationFrame != "undefined" ? cancelAnimationFrame(t) : clearTimeout(t);
}, N = (t) => (t !== null && clearTimeout(t), null), Ae = (t) => (t !== null && clearInterval(t), null), Rt = () => typeof matchMedia != "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches, _t = (t) => {
  const e = t.tagName;
  return e === "BUTTON" || e === "INPUT" || e === "SUMMARY" || e === "A" && t.hasAttribute("href");
}, Lt = { stiffness: 0.066, damping: 0.25 }, Mt = { stiffness: 0.033, damping: 0.45 }, It = 0.01, $t = 0.06, Q = 50 / 3.5, Nt = 0.01, Ot = (t, e) => {
  if (!t)
    return e;
  if (!e)
    return t;
  const s = { ...t };
  for (const i of Object.keys(e))
    s[i] = { ...t[i], ...e[i] };
  return s;
}, R = (t, e) => {
  var r, o, c;
  const s = {
    stiffness: (r = e == null ? void 0 : e.stiffness) != null ? r : t.stiffness,
    damping: (o = e == null ? void 0 : e.damping) != null ? o : t.damping
  }, i = (c = e == null ? void 0 : e.precision) != null ? c : t.precision;
  i !== void 0 && (s.precision = i);
  const n = Ot(t.axes, e == null ? void 0 : e.axes);
  return n !== void 0 && (s.axes = n), s;
}, O = (t, e) => {
  var s;
  t.stiffness = e.stiffness, t.damping = e.damping, t.precision = (s = e.precision) != null ? s : Nt, t.axes = e.axes;
}, ne = (t, e) => typeof t == "number" ? `${t}${e}` : t, Dt = (t) => {
  var s, i, n, r, o, c;
  const e = t && typeof t == "object" ? t : {};
  return {
    delay: (s = e.delay) != null ? s : 2e3,
    duration: (i = e.duration) != null ? i : 4e3,
    loop: (n = e.loop) != null ? n : !1,
    speed: (r = e.speed) != null ? r : 0.05,
    intensity: (o = e.intensity) != null ? o : 25,
    respectReducedMotion: (c = e.respectReducedMotion) != null ? c : !0,
    dynamics: R({ stiffness: 0.02, damping: 0.5 }, e.spring)
  };
}, We = 16, Ke = 18, Ce = (t) => {
  var i, n, r, o, c, l;
  const e = t && typeof t == "object" ? t : {};
  return {
    enabled: typeof t == "boolean" ? t : (i = e.enabled) != null ? i : !0,
    rangeX: (n = e.rangeX) != null ? n : We,
    rangeY: (r = e.rangeY) != null ? r : Ke,
    sensitivity: (o = e.sensitivity) != null ? o : 1,
    invertX: (c = e.invertX) != null ? c : !1,
    invertY: (l = e.invertY) != null ? l : !1
  };
}, Ft = (t) => {
  var s, i, n, r;
  const e = t && typeof t == "object" ? t : {};
  return {
    enabled: !!t,
    strength: (s = e.strength) != null ? s : 14,
    perspective: (i = e.perspective) != null ? i : 600,
    shadow: (n = e.shadow) != null ? n : 0.35,
    layerScale: (r = e.layerScale) != null ? r : 1
  };
}, Bt = ["hsla(0, 0%, 100%, 0.8) 10%", "hsla(0, 0%, 100%, 0.65) 20%", "hsla(0, 0%, 0%, 0.5) 90%"], Gt = (t) => {
  var r, o, c;
  if (t.image)
    return t.image;
  if (t.shape === void 0 && t.extent === void 0 && t.size === void 0 && t.stops === void 0)
    return;
  const e = t.size ? t.size.trim().split(/\s+/) : [], s = (r = t.shape) != null ? r : e.length > 1 ? "ellipse" : "circle", i = t.size ? `${s} ${t.size}` : `${(o = t.extent) != null ? o : "farthest-corner"} ${s}`, n = ((c = t.stops) != null && c.length ? t.stops : Bt).join(", ");
  return `radial-gradient(${i} at var(--pointer-x) var(--pointer-y), ${n})`;
}, Vt = ["--hc-depth", "--card-perspective", "--hc-depth-shadow", "--hc-depth-layer-scale"], Ut = [
  "--pointer-x",
  "--pointer-y",
  "--pointer-from-center",
  "--pointer-from-top",
  "--pointer-from-left",
  "--pointer-dx",
  "--pointer-dy",
  "--card-opacity",
  "--rotate-x",
  "--rotate-y",
  "--tilt-x",
  "--tilt-y",
  "--background-x",
  "--background-y",
  "--card-scale",
  "--translate-x",
  "--translate-y"
];
class qt {
  constructor(e, s = {}) {
    h(this, "element");
    h(this, "rotator");
    h(this, "frontElement");
    h(this, "layersElement", null);
    h(this, "options");
    h(this, "gyroConfig");
    h(this, "springRotate");
    h(this, "springGlare");
    h(this, "springBackground");
    h(this, "springPointer");
    h(this, "springRotateDelta");
    h(this, "springTranslate");
    h(this, "springScale");
    h(this, "allSprings");
    h(this, "liveRotate");
    h(this, "liveGlare");
    h(this, "liveBackground");
    h(this, "livePointer");
    h(this, "snapDynamics");
    h(this, "tiltFactorX");
    h(this, "tiltFactorY");
    h(this, "tiltScaleX");
    h(this, "tiltScaleY");
    h(this, "parallax");
    h(this, "glareRange");
    h(this, "returnDelay");
    h(this, "showcaseConfig");
    h(this, "isInteracting", !1);
    h(this, "wasActive", !1);
    h(this, "manageAriaPressed", !1);
    h(this, "firstPop", !0);
    h(this, "isVisible", typeof document != "undefined" ? document.visibilityState === "visible" : !0);
    h(this, "destroyed", !1);
    h(this, "renderScheduled", !1);
    h(this, "interactRaf", null);
    h(this, "pendingUpdate", null);
    h(this, "repositionTimer", null);
    h(this, "endTimer", null);
    h(this, "showcaseStart", null);
    h(this, "showcaseEnd", null);
    h(this, "showcaseInterval", null);
    h(this, "showcaseRunning");
    h(this, "cleanups", []);
    h(this, "unsubscribeOrientation", null);
    var d, m, f, g, w, T, x, P, k, _, L, S, A, I, V, F, M, B;
    this.element = e;
    const i = e.querySelector(`.${v.rotator}`);
    if (!i)
      throw new Error("@kongyo2/cards-css: holo card element is missing its .holo-card__rotator child.");
    this.rotator = i, this.frontElement = e.querySelector(`.${v.front}`), this.layersElement = e.querySelector(`.${v.layers}`), this.options = {
      interactive: (d = s.interactive) != null ? d : !0,
      activateOnClick: (m = s.activateOnClick) != null ? m : !1,
      showcase: (f = s.showcase) != null ? f : !1
    }, this.gyroConfig = Ce(s.gyroscope), this.showcaseRunning = !!s.showcase, this.showcaseConfig = Dt(s.showcase);
    const n = (g = s.physics) != null ? g : {}, r = (T = (w = n.maxTiltX) != null ? w : n.maxTilt) != null ? T : Q, o = (P = (x = n.maxTiltY) != null ? x : n.maxTilt) != null ? P : Q;
    this.tiltFactorX = r / 50, this.tiltFactorY = o / 50, this.tiltScaleX = r / Q, this.tiltScaleY = o / Q, this.parallax = (k = n.parallax) != null ? k : 1, this.glareRange = (_ = n.glareRange) != null ? _ : 1, this.returnDelay = (L = n.returnDelay) != null ? L : 500;
    const c = R(Lt, n.interactSpring), l = R(Mt, n.popoverSpring);
    this.snapDynamics = R({ stiffness: It, damping: $t }, n.snapSpring), this.liveRotate = R(c, (S = n.springs) == null ? void 0 : S.rotate), this.liveGlare = R(c, (A = n.springs) == null ? void 0 : A.glare), this.liveBackground = R(c, (I = n.springs) == null ? void 0 : I.background), this.livePointer = c, this.springRotate = new G({ x: 0, y: 0 }, this.liveRotate), this.springGlare = new G({ x: 50, y: 50, o: 0 }, this.liveGlare), this.springBackground = new G({ x: 50, y: 50 }, this.liveBackground), this.springPointer = new G({ x: 50, y: 50 }, this.livePointer), this.springRotateDelta = new G({ x: 0, y: 0 }, R(l, (V = n.springs) == null ? void 0 : V.rotateDelta)), this.springTranslate = new G({ x: 0, y: 0 }, R(l, (F = n.springs) == null ? void 0 : F.translate)), this.springScale = new G(1, R(l, (M = n.springs) == null ? void 0 : M.scale)), this.allSprings = [
      this.springRotate,
      this.springGlare,
      this.springBackground,
      this.springPointer,
      this.springRotateDelta,
      this.springTranslate,
      this.springScale
    ], s.effect ? e.dataset.effect = s.effect : e.dataset.effect || (e.dataset.effect = "none"), this.applyPalette(s.palette), s.glow && e.style.setProperty("--card-glow", s.glow), typeof s.aspectRatio == "number" && e.style.setProperty("--card-aspect", String(s.aspectRatio));
    const a = Fe(s.mask);
    if (a != null && a.image && (e.style.setProperty("--mask", Z(a.image)), a.size && e.style.setProperty("--mask-size", a.size), a.position && e.style.setProperty("--mask-position", a.position), a.repeat && e.style.setProperty("--mask-repeat", a.repeat), e.classList.add(v.masked), a.mode === "card" && e.classList.add(v.maskCard)), s.foil && e.style.setProperty("--foil", Z(s.foil)), this.applyVisual(s.visual), this.applyGlare(s.glare), this.applyDepth(s.depth), he(e, s.vars), !this.layersElement && ((B = s.layers) != null && B.length) && this.frontElement)
      for (const y of s.layers)
        this.addLayer(y);
    this.applyStaticStyles(s.textureSeed);
    for (const y of this.allSprings)
      this.cleanups.push(y.subscribe(() => this.scheduleRender()));
    if (this.applyStyles(), this.options.interactive && this.enableInteractive(), this.cleanups.push(dt(() => this.onActiveChange())), typeof document != "undefined") {
      const y = () => this.onVisibilityChange();
      document.addEventListener("visibilitychange", y), this.cleanups.push(() => document.removeEventListener("visibilitychange", y));
    }
    this.options.showcase && this.startShowcase();
  }
  applyVisual(e) {
    if (!e)
      return;
    const s = this.element.style, i = (n, r) => {
      typeof r == "number" && s.setProperty(n, String(r));
    };
    i("--hc-brightness", e.brightness), i("--hc-contrast", e.contrast), i("--hc-saturate", e.saturate), i("--hc-glare-opacity", e.glareOpacity), i("--hc-shine-opacity", e.shineOpacity), e.lineSpace !== void 0 && s.setProperty("--space", ne(e.lineSpace, "%")), e.lineAngle !== void 0 && s.setProperty("--angle", ne(e.lineAngle, "deg")), e.glitterSize !== void 0 && s.setProperty("--glittersize", ne(e.glitterSize, "%")), e.imageFit !== void 0 && s.setProperty("--imgsize", e.imageFit);
  }
  applyPalette(e) {
    if (!e)
      return;
    const s = this.element.style, i = Ct(e);
    for (const n of At)
      s.removeProperty(n);
    for (const [n, r] of Object.entries(i))
      s.setProperty(n, r);
  }
  applyGlare(e) {
    if (!e)
      return;
    const s = this.element.style;
    s.removeProperty("--glare-image"), s.removeProperty("--glare-blend"), this.element.classList.remove(v.customGlare), typeof e.opacity == "number" && s.setProperty("--hc-glare-opacity", String(e.opacity)), e.blend !== void 0 && s.setProperty("--glare-blend", e.blend);
    const i = Gt(e);
    i !== void 0 && (s.setProperty("--glare-image", i), this.element.classList.add(v.customGlare));
  }
  applyDepth(e) {
    const s = this.element.style, i = Ft(e);
    if (!i.enabled) {
      this.element.classList.remove(v.depth);
      for (const n of Vt)
        s.removeProperty(n);
      return;
    }
    this.element.classList.add(v.depth), s.setProperty("--hc-depth", `${i.strength}px`), s.setProperty("--card-perspective", `${i.perspective}px`), s.setProperty("--hc-depth-shadow", String(i.shadow)), s.setProperty("--hc-depth-layer-scale", String(i.layerScale));
  }
  applyStaticStyles(e) {
    const s = typeof e == "number" ? ye(e) : Math.random, i = s(), n = s(), r = Math.floor(i * 734), o = Math.floor(n * 1280);
    if (this.element.style.setProperty("--seedx", String(i)), this.element.style.setProperty("--seedy", String(n)), this.element.style.setProperty("--cosmosbg", `${r}px ${o}px`), typeof e == "number") {
      const c = Pt(Tt({ seed: e }));
      for (const [l, a] of Object.entries(c))
        this.element.style.setProperty(l, a);
    }
  }
  enableInteractive() {
    this.element.classList.add(v.interactive);
    const e = (n) => this.interact(n), s = () => this.interactEnd(), i = () => this.interactEnd(0);
    if (this.rotator.addEventListener("pointermove", e), this.rotator.addEventListener("pointerleave", s), this.rotator.addEventListener("pointercancel", i), this.cleanups.push(() => this.rotator.removeEventListener("pointermove", e)), this.cleanups.push(() => this.rotator.removeEventListener("pointerleave", s)), this.cleanups.push(() => this.rotator.removeEventListener("pointercancel", i)), this.options.activateOnClick) {
      const n = () => this.toggleActive(), r = (a) => {
        const d = a.relatedTarget;
        d instanceof Node && this.element.contains(d) || this.active && this.deactivate();
      };
      this.rotator.addEventListener("click", n), this.rotator.addEventListener("focusout", r), this.cleanups.push(() => this.rotator.removeEventListener("click", n)), this.cleanups.push(() => this.rotator.removeEventListener("focusout", r)), this.rotator.tabIndex < 0 && (this.rotator.tabIndex = 0, this.cleanups.push(() => this.rotator.removeAttribute("tabindex")));
      const o = _t(this.rotator);
      if ((!o || this.rotator.tagName === "BUTTON") && !this.rotator.hasAttribute("aria-pressed") && (this.manageAriaPressed = !0, this.rotator.setAttribute("aria-pressed", "false"), this.cleanups.push(() => {
        this.rotator.removeAttribute("aria-pressed"), this.manageAriaPressed = !1;
      })), !o) {
        this.rotator.hasAttribute("role") || (this.rotator.setAttribute("role", "button"), this.cleanups.push(() => this.rotator.removeAttribute("role")));
        const a = (m) => {
          m.target === this.rotator && (m.key === " " ? m.preventDefault() : m.key === "Enter" && !m.repeat && (m.preventDefault(), this.toggleActive()));
        }, d = (m) => {
          m.target === this.rotator && m.key === " " && (m.preventDefault(), this.toggleActive());
        };
        this.rotator.addEventListener("keydown", a), this.rotator.addEventListener("keyup", d), this.cleanups.push(() => this.rotator.removeEventListener("keydown", a)), this.cleanups.push(() => this.rotator.removeEventListener("keyup", d));
      }
      const c = this.element.querySelector(`.${v.overlayInteractive}`);
      if (c) {
        const a = (d) => d.stopPropagation();
        c.addEventListener("click", a), this.cleanups.push(() => c.removeEventListener("click", a));
      }
      const l = () => this.reposition();
      window.addEventListener("scroll", l, { passive: !0 }), window.addEventListener("resize", l, { passive: !0 }), this.cleanups.push(() => window.removeEventListener("scroll", l)), this.cleanups.push(() => window.removeEventListener("resize", l));
    }
  }
  parallaxBackground(e, s) {
    return { x: E(50 + (e - 50) * this.parallax), y: E(50 + (s - 50) * this.parallax) };
  }
  rangeGlare(e, s, i) {
    return { x: E(50 + (e - 50) * this.glareRange), y: E(50 + (s - 50) * this.glareRange), o: i };
  }
  interact(e) {
    if (this.endShowcase(), !this.isVisible) {
      this.setInteracting(!1);
      return;
    }
    const s = C();
    if (s && s !== this) {
      this.setInteracting(!1);
      return;
    }
    const i = this.rotator.getBoundingClientRect();
    if (i.width <= 0 || i.height <= 0)
      return;
    this.setInteracting(!0), this.endTimer = N(this.endTimer);
    const n = { x: e.clientX - i.left, y: e.clientY - i.top }, r = {
      x: X(E(100 / i.width * n.x)),
      y: X(E(100 / i.height * n.y))
    }, o = { x: r.x - 50, y: r.y - 50 };
    this.pendingUpdate = {
      background: this.parallaxBackground(U(r.x, 0, 100, 37, 63), U(r.y, 0, 100, 33, 67)),
      rotate: { x: E(-(o.x * this.tiltFactorX)), y: E(o.y * this.tiltFactorY) },
      glare: this.rangeGlare(E(r.x), E(r.y), 1),
      pointer: { x: E(r.x), y: E(r.y) }
    }, this.interactRaf === null && (this.interactRaf = xe(() => {
      if (this.pendingUpdate) {
        const c = this.pendingUpdate;
        this.updateSprings(c.background, c.rotate, c.glare, c.pointer), this.pendingUpdate = null;
      }
      this.interactRaf = null;
    }));
  }
  interactEnd(e = this.returnDelay) {
    this.interactRaf !== null && (ke(this.interactRaf), this.interactRaf = null), this.pendingUpdate = null, this.endTimer = N(this.endTimer), this.endTimer = setTimeout(() => {
      this.setInteracting(!1), this.setGroupDynamics(this.snapDynamics), this.springRotate.set({ x: 0, y: 0 }, { soft: 1 }), this.springGlare.set({ x: 50, y: 50, o: 0 }, { soft: 1 }), this.springBackground.set({ x: 50, y: 50 }, { soft: 1 }), this.springPointer.set({ x: 50, y: 50 }, { soft: 1 });
    }, e);
  }
  setGroupDynamics(e) {
    O(this.springRotate, e), O(this.springGlare, e), O(this.springBackground, e), O(this.springPointer, e);
  }
  applyLiveDynamics() {
    O(this.springRotate, this.liveRotate), O(this.springGlare, this.liveGlare), O(this.springBackground, this.liveBackground), O(this.springPointer, this.livePointer);
  }
  settle(e) {
    this.springScale.set(1, e), this.springTranslate.set({ x: 0, y: 0 }, e), this.springRotateDelta.set({ x: 0, y: 0 }, e);
  }
  updateSprings(e, s, i, n) {
    this.applyLiveDynamics(), this.springBackground.set(e), this.springRotate.set(s), this.springGlare.set(i), this.springPointer.set(n);
  }
  setInteracting(e) {
    this.isInteracting = e, this.element.classList.toggle(v.interacting, e);
  }
  get interacting() {
    return this.isInteracting;
  }
  scheduleRender() {
    this.renderScheduled || (this.renderScheduled = !0, xe(() => {
      this.renderScheduled = !1, this.destroyed || this.applyStyles();
    }));
  }
  clearRenderVars() {
    const e = this.element.style;
    for (const s of Ut)
      e.removeProperty(s);
  }
  applyStyles() {
    if (!this.options.interactive && !this.isInteracting && !this.active && this.allSprings.every((d) => d.settled)) {
      this.clearRenderVars();
      return;
    }
    const e = this.springGlare.current, s = this.springRotate.current, i = this.springRotateDelta.current, n = this.springBackground.current, r = this.springPointer.current, o = this.springTranslate.current, c = this.springScale.current, l = X(Math.sqrt((e.y - 50) * (e.y - 50) + (e.x - 50) * (e.x - 50)) / 50, 0, 1), a = this.element.style;
    a.setProperty("--pointer-x", `${e.x}%`), a.setProperty("--pointer-y", `${e.y}%`), a.setProperty("--pointer-from-center", String(l)), a.setProperty("--pointer-from-top", String(e.y / 100)), a.setProperty("--pointer-from-left", String(e.x / 100)), a.setProperty("--pointer-dx", String(E((r.x - 50) / 50))), a.setProperty("--pointer-dy", String(E((r.y - 50) / 50))), a.setProperty("--card-opacity", String(e.o)), a.setProperty("--rotate-x", `${s.x + i.x}deg`), a.setProperty("--rotate-y", `${s.y + i.y}deg`), a.setProperty("--tilt-x", String(E(s.x + i.x))), a.setProperty("--tilt-y", String(E(s.y + i.y))), a.setProperty("--background-x", `${n.x}%`), a.setProperty("--background-y", `${n.y}%`), a.setProperty("--card-scale", String(c)), a.setProperty("--translate-x", `${o.x}px`), a.setProperty("--translate-y", `${o.y}px`);
  }
  onActiveChange() {
    const e = C() === this;
    e !== this.wasActive && (this.wasActive = e, this.manageAriaPressed && this.rotator.setAttribute("aria-pressed", String(e)), e ? (this.popover(), this.element.classList.add(v.active), this.element.style.setProperty("--card-active", "1"), this.gyroConfig.enabled && this.startGyroscope()) : (this.retreat(), this.element.classList.remove(v.active), this.element.style.setProperty("--card-active", "0"), this.stopGyroscope()));
  }
  popover() {
    const e = this.element.getBoundingClientRect();
    let s = 100;
    const i = window.innerWidth / e.width * 0.9, n = window.innerHeight / e.height * 0.9, r = 1.75;
    this.setCenter(), this.firstPop && (s = 1e3, this.springRotateDelta.set({ x: 360, y: 0 })), this.firstPop = !1, this.springScale.set(Math.min(i, n, r)), this.interactEnd(s);
  }
  retreat() {
    this.settle({ soft: !0 }), this.interactEnd(100);
  }
  reset() {
    this.interactEnd(0), this.settle({ hard: !0 }), this.springRotate.set({ x: 0, y: 0 }, { hard: !0 });
  }
  setCenter() {
    const e = this.element.getBoundingClientRect(), s = document.documentElement;
    this.springTranslate.set({
      x: E(s.clientWidth / 2 - e.x - e.width / 2),
      y: E(s.clientHeight / 2 - e.y - e.height / 2)
    });
  }
  reposition() {
    this.repositionTimer = N(this.repositionTimer), this.repositionTimer = setTimeout(() => {
      C() === this && this.setCenter();
    }, 300);
  }
  startGyroscope() {
    this.unsubscribeOrientation || (this.unsubscribeOrientation = ut((e) => this.orientate(e)));
  }
  stopGyroscope() {
    this.unsubscribeOrientation && (this.unsubscribeOrientation(), this.unsubscribeOrientation = null);
  }
  orientate(e) {
    if (C() !== this)
      return;
    const s = this.gyroConfig, i = { x: s.rangeX, y: s.rangeY }, n = s.invertX ? -1 : 1, r = s.invertY ? -1 : 1, o = {
      x: X(e.relative.gamma * s.sensitivity * n, -i.x, i.x),
      y: X(e.relative.beta * s.sensitivity * r, -i.y, i.y)
    }, c = i.x === 0 ? 0 : o.x / i.x, l = i.y === 0 ? 0 : o.y / i.y, a = U(c, -1, 1, 0, 100), d = U(l, -1, 1, 0, 100);
    this.setInteracting(!0), this.updateSprings(this.parallaxBackground(U(c, -1, 1, 37, 63), U(l, -1, 1, 33, 67)), {
      x: E(c * We * -1 * this.tiltScaleX),
      y: E(l * Ke * this.tiltScaleY)
    }, this.rangeGlare(a, d, 1), { x: a, y: d });
  }
  onVisibilityChange() {
    this.isVisible = document.visibilityState === "visible", this.endShowcase(), this.active ? this.interactEnd(0) : this.reset();
  }
  startShowcase() {
    if (!this.isVisible)
      return;
    const e = this.showcaseConfig;
    if (e.respectReducedMotion && Rt())
      return;
    const s = e.intensity;
    let i = 0;
    this.showcaseStart = setTimeout(() => {
      if (this.endTimer = N(this.endTimer), this.setInteracting(!0), this.setGroupDynamics(e.dynamics), !this.isVisible) {
        this.setInteracting(!1);
        return;
      }
      this.showcaseInterval = setInterval(() => {
        i += e.speed, this.springRotate.set({ x: Math.sin(i) * s, y: Math.cos(i) * s }), this.springGlare.set({
          x: 50 + Math.sin(i) * s * 2.2,
          y: 50 + Math.cos(i) * s * 2.2,
          o: 0.8
        }), this.springBackground.set({
          x: 50 + Math.sin(i) * s * 0.8,
          y: 50 + Math.cos(i) * s * 0.8
        }), this.springPointer.set({ x: 50 + Math.sin(i) * s * 1.6, y: 50 + Math.cos(i) * s * 1.6 });
      }, 20), e.loop || (this.showcaseEnd = setTimeout(() => {
        this.showcaseInterval = Ae(this.showcaseInterval), this.interactEnd(0);
      }, e.duration));
    }, e.delay);
  }
  endShowcase() {
    this.showcaseRunning && (this.showcaseEnd = N(this.showcaseEnd), this.showcaseStart = N(this.showcaseStart), this.showcaseInterval = Ae(this.showcaseInterval), this.showcaseRunning = !1);
  }
  toggleActive() {
    C() === this ? z(null) : (this.endShowcase(), ie(), z(this));
  }
  activate() {
    C() !== this && (this.endShowcase(), ie(), z(this));
  }
  deactivate() {
    this.interactEnd(), C() === this && z(null);
  }
  setEffect(e) {
    this.element.dataset.effect = e != null ? e : "none";
  }
  /** The `.holo-card__front` element, for appending custom content at runtime. */
  get front() {
    return this.frontElement;
  }
  /** Apply CSS custom properties to the root element (for content linkage). */
  setVars(e) {
    he(this.element, e);
  }
  /** Update fine-grained visual controls at runtime. */
  setVisual(e) {
    this.applyVisual(e);
  }
  /**
   * Swap the foil colour palette / theme at runtime. This is a full replacement:
   * any palette variable not present in `palette` reverts to its default.
   */
  setPalette(e) {
    this.applyPalette(e);
  }
  /**
   * Update the dynamic glare (reflected light) at runtime. The image / shape /
   * blend are replaced wholesale — omit them to return to the effect's built-in
   * glare. `opacity` is shared with `visual.glareOpacity` and only changes when
   * provided.
   */
  setGlare(e) {
    this.applyGlare(e);
  }
  /** Toggle or tune the foil 3D depth / extrusion at runtime. */
  setDepth(e) {
    this.applyDepth(e);
  }
  /** Update the gyroscope physical-behaviour tuning at runtime. */
  setGyroscope(e) {
    const s = this.gyroConfig.enabled;
    this.gyroConfig = Ce(e), C() === this && (this.gyroConfig.enabled ? (s || ie(), this.startGyroscope()) : (this.stopGyroscope(), this.interactEnd(0)));
  }
  /**
   * Insert an extra layer between the artwork and the foil at runtime, returning
   * the created element. Requires the card to have a `.holo-card__front`.
   */
  addLayer(e) {
    const s = this.frontElement;
    if (!s)
      throw new Error("@kongyo2/cards-css: cannot add a layer — the card has no .holo-card__front element.");
    const i = s.ownerDocument, n = Ge(i, e);
    if (!this.layersElement) {
      const r = i.createElement("div");
      r.className = v.layers;
      const o = s.querySelector(`.${v.shine}`);
      s.insertBefore(r, o), this.layersElement = r;
    }
    return this.layersElement.appendChild(n), n;
  }
  get active() {
    return C() === this;
  }
  destroy() {
    if (!this.destroyed) {
      this.destroyed = !0, this.endShowcase(), this.stopGyroscope();
      for (const e of this.cleanups)
        e();
      this.cleanups.length = 0, C() === this && z(null), this.repositionTimer = N(this.repositionTimer), this.endTimer = N(this.endTimer), this.interactRaf !== null && (ke(this.interactRaf), this.interactRaf = null), this.pendingUpdate = null;
      for (const e of this.allSprings)
        e.destroy();
      this.clearRenderVars(), this.element.style.removeProperty("--card-active"), this.element.classList.remove(v.interactive, v.interacting, v.active);
    }
  }
}
const Xt = (t) => {
  const e = ht(t);
  return new qt(e, t);
}, zt = ["normal", "holographic", "glitter", "silver"], Yt = {
  // 普通卡保持克制：只有轻微光泽，不叠加任何箔层。
  normal: {
    effect: "none",
    shineOpacity: 0.48,
    glareOpacity: 0.36,
    brightness: 1,
    contrast: 1,
    saturate: 1,
    needsSeed: !1
  },
  // 镭射：随倾斜显示彩色反光。底层 foil 用 color-dodge，原值会把高光打到削波（实测 24–27% 过曝），
  // 因此降低反光层不透明度与亮度、压一点对比度，保留色彩而不冲白卡面。
  holographic: {
    effect: "holo",
    shineOpacity: 0.48,
    glareOpacity: 0.24,
    brightness: 0.86,
    contrast: 0.9,
    saturate: 1.05,
    needsSeed: !1
  },
  // 碎闪：细腻颗粒反射。原值平均亮度比原图高 10–18，为全部效果中最易“发灰发白”的一档。
  glitter: {
    effect: "glitter",
    shineOpacity: 0.34,
    glareOpacity: 0.2,
    brightness: 0.72,
    contrast: 0.95,
    saturate: 0.95,
    needsSeed: !0
  },
  // 银色：金属光泽。底层 metal 层的自身渐变偏暗，在浅色卡面上会把卡面压暗 36–48，
  // 在深色卡面上又会提亮 32–37；这里降不透明度 + 提高亮度，把两侧摆动收小。
  silver: {
    effect: "metal",
    shineOpacity: 0.18,
    glareOpacity: 0.12,
    brightness: 1,
    contrast: 0.95,
    saturate: 0.9,
    needsSeed: !1
  }
}, re = (t) => Math.min(1, Math.max(0, t));
function Re(t, e) {
  const s = Yt[t], i = 0.35 + 0.65 * re(e);
  return {
    effect: s.effect,
    shineOpacity: re(s.shineOpacity * i),
    glareOpacity: re(s.glareOpacity * i),
    brightness: s.brightness,
    contrast: s.contrast,
    saturate: s.saturate,
    needsSeed: s.needsSeed,
    useSilverImage: t === "silver"
  };
}
function Je(t) {
  let e = 2166136261;
  for (let s = 0; s < t.length; s += 1)
    e ^= t.charCodeAt(s), e = Math.imul(e, 16777619);
  return Math.abs(e) % 1e5 + 1;
}
function jt(t) {
  return typeof t == "string" && zt.includes(t);
}
const Ht = 0.9, me = 1;
function Qe(t) {
  return typeof t != "number" || !Number.isFinite(t) ? me : Math.min(me, Math.max(Ht, t));
}
function se(t) {
  if (typeof window == "undefined" || typeof window.matchMedia != "function")
    return null;
  try {
    return window.matchMedia(t);
  } catch {
    return null;
  }
}
function Wt() {
  const t = se("(hover: hover) and (pointer: fine)");
  return t ? t.matches : !0;
}
function Kt() {
  if (typeof navigator != "undefined") {
    const e = navigator.maxTouchPoints;
    if (typeof e == "number" && e > 0)
      return !0;
  }
  const t = se("(any-pointer: coarse)");
  return t ? t.matches : !1;
}
function _e() {
  const t = se("(prefers-reduced-motion: reduce)");
  return t ? t.matches : !1;
}
function Jt(t) {
  const e = se("(prefers-reduced-motion: reduce)");
  if (!e)
    return () => {
    };
  const s = (n) => t(n.matches);
  if (typeof e.addEventListener == "function")
    return e.addEventListener("change", s), () => e.removeEventListener("change", s);
  const i = e;
  return typeof i.addListener == "function" ? (i.addListener(s), () => {
    var n;
    return (n = i.removeListener) == null ? void 0 : n.call(i, s);
  }) : () => {
  };
}
const Qt = 160, Zt = 10, Le = "data-bc-touch-tilt";
function es(t, e = {}) {
  var _, L;
  const s = (_ = e.longPressMs) != null ? _ : Qt, i = (L = e.moveTolerancePx) != null ? L : Zt, n = () => e.enabled ? e.enabled() : !0;
  let r = null, o = 0, c = 0, l = !1, a = null;
  const d = () => {
    a !== null && (clearTimeout(a), a = null);
  }, m = (S) => {
    var A;
    S !== l && (l = S, S ? t.setAttribute(Le, "true") : t.removeAttribute(Le), (A = e.onEngageChange) == null || A.call(e, S));
  }, f = () => {
    d(), r = null, m(!1);
  }, g = (S) => S.pointerType === "touch" && r !== null && S.pointerId === r, w = (S) => {
    S.pointerType !== "touch" || !n() || r !== null || (r = S.pointerId, o = S.clientX, c = S.clientY, d(), a = setTimeout(() => {
      a = null, r !== null && n() && m(!0);
    }, s));
  }, T = (S) => {
    if (g(S) && !l) {
      if (a !== null) {
        const A = S.clientX - o, I = S.clientY - c;
        Math.hypot(A, I) > i && d();
      }
      S.stopPropagation();
    }
  }, x = (S) => {
    l && S.preventDefault();
  }, P = (S) => {
    g(S) && f();
  }, k = () => {
    (r !== null || l) && f();
  };
  return t.addEventListener("pointerdown", w), t.addEventListener("pointermove", T, !0), t.addEventListener("touchmove", x, { passive: !1 }), window.addEventListener("pointerup", P), window.addEventListener("pointercancel", P), window.addEventListener("blur", k), document.addEventListener("visibilitychange", k), () => {
    t.removeEventListener("pointerdown", w), t.removeEventListener("pointermove", T, !0), t.removeEventListener("touchmove", x), window.removeEventListener("pointerup", P), window.removeEventListener("pointercancel", P), window.removeEventListener("blur", k), document.removeEventListener("visibilitychange", k), d(), r = null, m(!1);
  };
}
function ts(t, e = {}) {
  const s = Qe(e.pressScale), i = t.style;
  let n = !1;
  const r = () => s < me && (e.enabled ? e.enabled() : !0), o = (d) => {
    var m;
    d !== n && (n = d, d ? (i.setProperty("--bc-press", String(s)), t.setAttribute("data-bc-dragging", "true")) : (i.setProperty("--bc-press", "1"), t.removeAttribute("data-bc-dragging")), (m = e.onPressChange) == null || m.call(e, d));
  }, c = () => {
    n && o(!1);
  }, l = (d) => {
    d.pointerType === "mouse" && (typeof d.button == "number" && d.button !== 0 || r() && o(!0));
  }, a = () => {
    c();
  };
  return t.addEventListener("pointerdown", l), window.addEventListener("pointerup", c), window.addEventListener("pointercancel", c), window.addEventListener("blur", c), document.addEventListener("visibilitychange", a), i.setProperty("--bc-press", "1"), () => {
    t.removeEventListener("pointerdown", l), window.removeEventListener("pointerup", c), window.removeEventListener("pointercancel", c), window.removeEventListener("blur", c), document.removeEventListener("visibilitychange", a), n = !1, i.setProperty("--bc-press", "1"), t.removeAttribute("data-bc-dragging");
  };
}
const ss = 7, is = 20, ns = 1.586, rs = 1, as = 3, os = 0.98, cs = 1, ls = "flat", hs = 140, ds = 0.05, us = 0.32, Me = ["--rotate-x", "--rotate-y"], fs = "bc-card__holo", ae = (t, e, s, i) => {
  const n = typeof t == "number" && Number.isFinite(t) ? t : i;
  return Math.min(s, Math.max(e, n));
}, oe = (t, e) => e.useSilverImage && t.silverImage ? t.silverImage : t.image, Ie = (t, e) => {
  var s;
  return e.useSilverImage && t.silverImage && (s = t.silverImageAlt) != null ? s : t.imageAlt;
};
function $e(t) {
  var l, a, d, m, f, g;
  const e = jt(t.effect) ? t.effect : "normal", s = typeof t.image == "string" ? t.image : "", i = typeof t.silverImage == "string" ? t.silverImage : void 0, n = typeof t.silverImageAlt == "string" ? t.silverImageAlt : void 0, o = e === "silver" && !!i && i != null ? i : s, c = typeof t.textureSeed == "number" && Number.isFinite(t.textureSeed);
  return {
    image: s,
    imageAlt: (l = t.imageAlt) != null ? l : "",
    silverImage: i,
    silverImageAlt: n,
    effect: e,
    maxTilt: ae(t.maxTilt, 0, is, ss),
    interactive: (a = t.interactive) != null ? a : !0,
    shine: (d = t.shine) != null ? d : !0,
    intensity: ae(t.intensity, 0, 1, cs),
    // 质感：默认平面风（轻投影）；只有显式传 "physical" 才用较重的实体感。
    surface: t.surface === "physical" ? "physical" : ls,
    pressScale: Qe((m = t.pressScale) != null ? m : os),
    dragTilt: (f = t.dragTilt) != null ? f : !0,
    // 触屏默认开启「长按后拖动倾斜」（快速滑动仍归页面滚动，见 pointer-feedback.ts）。
    touchTilt: t.touchTilt === "off" ? "off" : "on",
    aspectRatio: ae(t.aspectRatio, rs, as, ns),
    respectReducedMotion: (g = t.respectReducedMotion) != null ? g : !0,
    imageFit: t.imageFit === "cover" ? "cover" : "contain",
    textureSeed: c ? t.textureSeed : Je(o),
    className: t.className
  };
}
function ce(t, e) {
  return t.interactive && (Wt() || t.touchTilt === "on") && !(e && t.respectReducedMotion);
}
function ps(t) {
  const e = {}, s = e;
  for (const i of Object.keys(t)) {
    const n = t[i];
    n !== void 0 && (s[i] = n);
  }
  return e;
}
function ms(t) {
  let e = $e(t), s = Re(e.effect, e.intensity), i = typeof t.textureSeed == "number" && Number.isFinite(t.textureSeed), n = _e(), r = n && e.respectReducedMotion, o = ce(e, n), c = !1, l = null, a = null, d = null, m = [];
  const f = document.createElement("div");
  f.className = "bc-card", f.dataset.bcEffect = e.effect, f.dataset.bcSurface = e.surface, f.style.setProperty("--bc-aspect", String(e.aspectRatio)), f.style.setProperty("--bc-press", "1"), g(e.className), w();
  function g(u) {
    for (const p of m)
      f.classList.remove(p);
    if (m = [], !!u)
      for (const p of u.split(/\s+/).filter(Boolean))
        p === "bc-card" || m.includes(p) || (f.classList.add(p), m.push(p));
  }
  function w() {
    f.dataset.bcReducedMotion = r ? "true" : "false", f.dataset.bcPress = e.pressScale >= 1 ? "off" : "on", f.dataset.bcTouch = Kt() ? "true" : "false";
  }
  function T() {
    return {
      imageFit: e.imageFit,
      shineOpacity: s.shineOpacity,
      glareOpacity: e.shine ? s.glareOpacity : 0,
      brightness: s.brightness,
      contrast: s.contrast,
      saturate: s.saturate
    };
  }
  function x() {
    return Xt({
      image: oe(e, s),
      imageAlt: Ie(e, s),
      effect: s.effect,
      // 底层 `--card-aspect` 就是 CSS aspect-ratio 的「宽 / 高」，
      // 因此横版银行卡直接传 1.586（而非 1/1.586）。
      aspectRatio: e.aspectRatio,
      interactive: o,
      gyroscope: !1,
      activateOnClick: !1,
      showcase: !1,
      textureSeed: s.needsSeed ? e.textureSeed : void 0,
      visual: T(),
      physics: {
        maxTilt: e.maxTilt,
        returnDelay: hs,
        // 默认回正过于松弛（k=0.01 / c=0.06），这里调成轻微欠阻尼：平滑但不拖沓。
        snapSpring: { stiffness: ds, damping: us }
      },
      className: fs
    });
  }
  function P() {
    const u = l, p = x();
    u && (u.destroy(), u.element.remove()), l = p, f.appendChild(p.element);
  }
  function k(u) {
    const p = l;
    if (!p)
      return;
    const b = p.element.querySelector(".holo-card__rotator");
    if (b) {
      if (u) {
        for (const $ of Me) {
          const K = p.element.style.getPropertyValue($);
          K && b.style.setProperty($, K);
        }
        return;
      }
      for (const $ of Me)
        b.style.removeProperty($);
    }
  }
  function _() {
    a == null || a(), a = null;
    const u = e.pressScale < 1 && !r, p = !e.dragTilt && !r;
    f.style.setProperty("--bc-press", "1"), f.removeAttribute("data-bc-dragging"), !(!u && !p) && (a = ts(f, {
      // `1` 表示不缩放，仅用于在需要时触发按压状态以钉住倾角。
      pressScale: u ? e.pressScale : 1,
      enabled: () => !c && !r,
      onPressChange: (b) => {
        p && k(b);
      }
    }));
  }
  function L() {
    d == null || d(), d = null, f.removeAttribute("data-bc-touch-tilt"), o && e.touchTilt === "on" && e.dragTilt !== !1 && !r && (d = es(f, {
      enabled: () => !c && !r,
      onEngageChange: (p) => {
        p && e.pressScale < 1 ? (f.style.setProperty("--bc-press", String(e.pressScale)), f.setAttribute("data-bc-dragging", "true")) : (f.style.setProperty("--bc-press", "1"), f.removeAttribute("data-bc-dragging"));
      }
    }));
  }
  function S() {
    _(), L();
  }
  function A() {
    if (!l)
      return;
    const u = l.element.querySelector("img.holo-card__image");
    u && (u.src = oe(e, s), u.alt = Ie(e, s));
  }
  const I = Jt((u) => {
    if (c)
      return;
    n = u;
    const p = u && e.respectReducedMotion, b = ce(e, n);
    r = p, w(), S(), b !== o && (o = b, P());
  });
  function V(u) {
    if (c)
      throw new Error("[bc] createBankCard: cannot mount a destroyed card.");
    const p = typeof u == "string" ? document.querySelector(u) : u;
    if (!p)
      throw new Error(`[bc] createBankCard: mount target not found: "${String(u)}".`);
    return f.parentElement !== p && p.appendChild(f), y;
  }
  function F(u) {
    if (c)
      return y;
    const p = ps(u);
    if (Object.keys(p).length === 0)
      return y;
    p.textureSeed !== void 0 && (i = !0);
    const b = e, $ = s, K = o, et = r;
    e = $e({ ...b, ...p }), s = Re(e.effect, e.intensity), !i && (e.image !== b.image || e.silverImage !== b.silverImage || s.useSilverImage !== $.useSilverImage) && (e = { ...e, textureSeed: Je(oe(e, s)) }), n = _e(), r = n && e.respectReducedMotion, o = ce(e, n);
    const Se = e.interactive !== b.interactive || e.touchTilt !== b.touchTilt || e.maxTilt !== b.maxTilt || e.aspectRatio !== b.aspectRatio || o !== K;
    return g(e.className), f.dataset.bcEffect = e.effect, f.dataset.bcSurface = e.surface, f.style.setProperty("--bc-aspect", String(e.aspectRatio)), w(), (Se || e.pressScale !== b.pressScale || e.dragTilt !== b.dragTilt || r !== et) && S(), Se ? P() : l && (e.effect !== b.effect || e.intensity !== b.intensity || e.shine !== b.shine ? (l.setEffect(s.effect), l.setVisual(T())) : e.imageFit !== b.imageFit && l.setVisual(T()), A()), y;
  }
  function M(u) {
    return F({ effect: u });
  }
  function B() {
    c || (c = !0, a == null || a(), a = null, d == null || d(), d = null, I(), l && (l.destroy(), l = null), f.remove());
  }
  P(), S();
  const y = {
    get element() {
      return f;
    },
    get options() {
      return e;
    },
    get destroyed() {
      return c;
    },
    mount: V,
    update: F,
    setEffect: M,
    destroy: B
  };
  return y;
}
const Es = ["flat", "physical"], gs = ["in-stock", "low-stock", "out-of-stock"], ys = "data-bc-action-id", vs = `button[${ys}]`;
function Ze(t) {
  return typeof t == "string" && gs.includes(t) ? t : "in-stock";
}
const bs = (t) => t !== void 0 && Ze(t.state) === "out-of-stock";
function Ne(t) {
  var s, i;
  const e = {
    image: t.image,
    imageAlt: (s = t.imageAlt) != null ? s : "",
    silverImage: (i = t.silverImage) != null ? i : ""
  };
  return t.effect && (e.effect = t.effect), e;
}
function ws(t) {
  var B;
  let e = t.product, s = { ...(B = t.card) != null ? B : {} }, i = t.onAction, n = !1, r = [];
  const o = document.createElement("div");
  o.className = "bc-showcase", P(t.className);
  const c = document.createElement("div");
  c.className = "bc-showcase__media";
  const l = document.createElement("div");
  l.className = "bc-showcase__info";
  const a = document.createElement("h3");
  a.className = "bc-showcase__name";
  const d = document.createElement("p");
  d.className = "bc-showcase__desc";
  const m = document.createElement("div");
  m.className = "bc-showcase__price";
  const f = document.createElement("span");
  f.className = "bc-showcase__price-value";
  const g = document.createElement("span");
  g.className = "bc-showcase__price-compare", m.append(f, g);
  const w = document.createElement("div");
  w.className = "bc-showcase__stock";
  const T = document.createElement("div");
  T.className = "bc-showcase__actions", T.addEventListener("click", A), l.append(a, d, m, w, T), o.append(c, l);
  const x = ms({ ...k(), image: e.image });
  c.appendChild(x.element);
  function P(y) {
    for (const u of r)
      o.classList.remove(u);
    if (r = [], !!y)
      for (const u of y.split(/\s+/).filter(Boolean))
        u === "bc-showcase" || r.includes(u) || (o.classList.add(u), r.push(u));
  }
  function k() {
    return { ...Ne(e), ...s };
  }
  function _(y, u) {
    const p = document.createElement("button");
    return p.type = "button", p.className = y.variant === "primary" ? "bc-btn bc-btn--primary" : "bc-btn bc-btn--secondary", p.textContent = y.label, p.dataset.bcActionId = y.id, p.disabled = y.disabled === !0 || u, p;
  }
  function L() {
    var b;
    const y = (b = e.actions) != null ? b : [], u = bs(e.stock), p = y.map(($) => _($, u));
    T.replaceChildren(...p), T.hidden = p.length === 0;
  }
  function S() {
    var p, b;
    a.textContent = e.name;
    const y = (p = e.description) != null ? p : "";
    d.textContent = y, d.hidden = y.length === 0, f.textContent = e.price;
    const u = (b = e.compareAtPrice) != null ? b : "";
    g.textContent = u, g.hidden = u.length === 0, e.stock ? (w.textContent = e.stock.label, w.dataset.bcStockState = Ze(e.stock.state), w.hidden = !1) : (w.textContent = "", delete w.dataset.bcStockState, w.hidden = !0), L();
  }
  function A(y) {
    if (n)
      return;
    const u = y.target;
    if (!(u instanceof Element))
      return;
    const p = u.closest(vs);
    if (!(p instanceof HTMLButtonElement) || p.disabled || !T.contains(p))
      return;
    const b = p.dataset.bcActionId;
    b && (i == null || i(b, e));
  }
  function I(y) {
    if (n)
      throw new Error("[bc] createProductShowcase: cannot mount a destroyed showcase.");
    const u = typeof y == "string" ? document.querySelector(y) : y;
    if (!u)
      throw new Error(`[bc] createProductShowcase: mount target not found: "${String(y)}".`);
    return o.parentElement !== u && u.appendChild(o), M;
  }
  function V(y) {
    if (n)
      return M;
    if (y.onAction !== void 0 && (i = y.onAction), y.className !== void 0 && P(y.className), y.product) {
      e = y.product;
      const u = Ne(e), p = { ...s };
      for (const b of Object.keys(u))
        delete p[b];
      s = p, S();
    }
    return y.card && (s = { ...s, ...y.card }), x.update(k()), M;
  }
  function F() {
    n || (n = !0, T.removeEventListener("click", A), x.destroy(), o.remove());
  }
  S();
  const M = {
    get element() {
      return o;
    },
    get card() {
      return x;
    },
    get destroyed() {
      return n;
    },
    mount: I,
    update: V,
    destroy: F
  };
  return M;
}
const Ts = "bc", Ps = "0.1.0";
export {
  zt as BANK_CARD_EFFECTS,
  Es as BANK_CARD_SURFACES,
  Ts as NAMESPACE,
  Ps as VERSION,
  ms as createBankCard,
  ws as createProductShowcase,
  jt as isBankCardEffect,
  Re as resolveEffectPlan,
  Je as seedFromImage
};
