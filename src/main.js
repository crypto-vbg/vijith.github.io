// Entry module for the "Engineering at Altitude" portfolio.
// Plain vanilla JS (no React) so it bundles under the strict CSP (script-src 'self').
// Handles: scroll reveals, count-up stats, hover tilt, draggable stickers,
// background parallax, and the AI chat widget wired to /api/chat (SSE).
import { inject } from "@vercel/analytics";

if (import.meta.env.PROD) inject();

const root = document.getElementById("app-root");

/* ---------- scroll reveals ---------- */
function initReveals() {
  const els = root.querySelectorAll("[data-reveal]");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "none";
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  els.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition =
      "opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1)";
    io.observe(el);
  });
}

/* ---------- count-up stats ---------- */
function countUp(el) {
  const target = parseFloat(el.dataset.count);
  const dec = parseInt(el.dataset.dec || "0", 10);
  const suf = el.dataset.suffix || "";
  const pre = el.dataset.prefix || "";
  const dur = 1300;
  const t0 = performance.now();
  const tick = (now) => {
    let p = Math.min(1, (now - t0) / dur);
    p = 1 - Math.pow(1 - p, 3);
    el.textContent = pre + (target * p).toFixed(dec) + suf;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initCounters() {
  const cio = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          countUp(e.target);
          cio.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  root.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));
}

/* ---------- hover tilt ---------- */
function initTilt() {
  root.querySelectorAll("[data-tilt]").forEach((card) => {
    card.style.transition = "transform .25s ease, box-shadow .25s ease";
    card.style.willChange = "transform";
    card.addEventListener("pointermove", (ev) => {
      if (ev.pointerType === "touch") return;
      const r = card.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width - 0.5;
      const py = (ev.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-py * 5}deg) rotateY(${px * 5}deg) translateY(-4px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

/* ---------- draggable stickers ---------- */
function makeDraggable(el) {
  const rot = el.dataset.rot || "0deg";
  let ox = 0,
    oy = 0,
    sx = 0,
    sy = 0,
    dragging = false;
  const paint = () => {
    el.style.transform = `translate(${ox}px,${oy}px) rotate(${rot})`;
  };
  el.style.touchAction = "none";
  el.style.cursor = "grab";
  el.style.userSelect = "none";
  paint();
  el.addEventListener("pointerdown", (e) => {
    dragging = true;
    sx = e.clientX - ox;
    sy = e.clientY - oy;
    el.setPointerCapture(e.pointerId);
    el.style.cursor = "grabbing";
    el.style.zIndex = "60";
    el.style.transition = "none";
  });
  el.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    ox = e.clientX - sx;
    oy = e.clientY - sy;
    paint();
  });
  const end = () => {
    dragging = false;
    el.style.cursor = "grab";
  };
  el.addEventListener("pointerup", end);
  el.addEventListener("pointercancel", end);
}

function initStickers() {
  root.querySelectorAll("[data-drag]").forEach((el) => makeDraggable(el));
}

/* ---------- background parallax ---------- */
function initParallax() {
  const topo = root.querySelector("[data-bg-topo]");
  if (!topo) return;
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      topo.style.transform = `translate3d(0, ${(window.scrollY || 0) * 0.06}px, 0)`;
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- chat widget (wired to /api/chat SSE) ---------- */
const MSG_ANIM = ";animation:msgIn .34s cubic-bezier(.2,.7,.2,1) both";
const U_STYLE =
  "align-self:flex-end;max-width:82%;background:var(--accent);color:#fff;padding:9px 13px;border-radius:14px 14px 3px 14px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-break:break-word" +
  MSG_ANIM;
const B_STYLE =
  "align-self:flex-start;max-width:88%;background:var(--paper);border:1px solid var(--line);color:var(--ink);padding:9px 13px;border-radius:14px 14px 14px 3px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-break:break-word" +
  MSG_ANIM;
const TYPING_STYLE =
  "align-self:flex-start;display:flex;align-items:center;gap:5px;background:var(--paper);border:1px solid var(--line);padding:11px 14px;border-radius:14px 14px 14px 3px;animation:msgIn .3s cubic-bezier(.2,.7,.2,1) both";
const TYPING_HTML =
  '<span style="width:6px;height:6px;border-radius:50%;background:var(--ink-2);animation:dotBounce 1.2s ease-in-out infinite"></span>' +
  '<span style="width:6px;height:6px;border-radius:50%;background:var(--ink-2);animation:dotBounce 1.2s ease-in-out .18s infinite"></span>' +
  '<span style="width:6px;height:6px;border-radius:50%;background:var(--ink-2);animation:dotBounce 1.2s ease-in-out .36s infinite"></span>';
const MAX_RETRIES = 6;
const WELCOME =
  "Hi! I'm Vijith's AI assistant. Ask me anything about his work, projects, or skills.";

function initChat() {
  const fab = document.getElementById("chat-fab");
  const panel = document.getElementById("chat-panel");
  const closeBtn = document.getElementById("chat-close");
  const list = document.getElementById("chat-messages");
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send");
  if (!fab || !panel || !list || !input || !sendBtn) return;

  const messages = []; // { role, content }
  let busy = false;

  const scrollDown = () => {
    list.scrollTop = list.scrollHeight;
  };

  const addBubble = (role, text) => {
    const el = document.createElement("div");
    el.style.cssText = role === "user" ? U_STYLE : B_STYLE;
    el.textContent = text;
    list.appendChild(el);
    scrollDown();
    return el;
  };

  // Assistant "typing" indicator (three bouncing dots) that later converts
  // into a normal bubble once a reply (or status message) is ready.
  const addTyping = () => {
    const el = document.createElement("div");
    el.style.cssText = TYPING_STYLE;
    el.innerHTML = TYPING_HTML;
    list.appendChild(el);
    scrollDown();
    return el;
  };

  // seed welcome
  addBubble("assistant", WELCOME);

  const open = () => {
    panel.style.display = "flex";
    panel.style.animation = "chatPop .34s cubic-bezier(.2,.8,.2,1)";
    setTimeout(() => input.focus(), 60);
  };
  const close = () => {
    panel.style.display = "none";
  };
  const toggle = () => (panel.style.display === "flex" ? close() : open());

  fab.addEventListener("click", toggle);
  closeBtn.addEventListener("click", close);

  async function send() {
    const q = input.value.trim();
    if (!q || busy) return;
    input.value = "";
    busy = true;
    addBubble("user", q);
    messages.push({ role: "user", content: q });

    const bot = addTyping();
    let acc = "";
    let converted = false;
    // Convert the typing indicator into a normal text bubble (once), then set text.
    const showBot = (text) => {
      if (!converted) {
        bot.style.cssText = B_STYLE;
        converted = true;
      }
      bot.textContent = text;
      scrollDown();
    };

    try {
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
        });

        if (res.status === 429) {
          const info = await res.json().catch(() => ({}));
          if (attempt === MAX_RETRIES) {
            showBot(
              "I'm at capacity right now. Please try again in a moment — or reach Vijith on LinkedIn."
            );
            break;
          }
          const wait = Math.min(Math.max(info.retryAfter ?? 15, 3), 60);
          for (let s = wait; s > 0; s--) {
            showBot(`The assistant is busy — retrying in ${s}s…`);
            // eslint-disable-next-line no-await-in-loop
            await new Promise((r) => setTimeout(r, 1000));
          }
          continue; // retry
        }

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          showBot(err.error || "Something went wrong. Please try again.");
          break;
        }

        // ---- stream ----
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const raw = line.slice(5).trim();
            if (!raw || raw === "[DONE]") continue;
            try {
              const evt = JSON.parse(raw);
              if (evt.text) {
                acc += evt.text;
                showBot(acc);
              }
            } catch {
              /* ignore partial lines */
            }
          }
        }
        if (acc) {
          messages.push({ role: "assistant", content: acc });
        } else {
          showBot("I didn't manage to produce an answer — please try rephrasing.");
        }
        break;
      }
    } catch {
      showBot("Connection hiccup — please check your network and try again.");
    } finally {
      busy = false;
      scrollDown();
    }
  }

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  });
}

/* ---------- boot ---------- */
if (root) {
  initReveals();
  initCounters();
  initTilt();
  initStickers();
  initParallax();
  initChat();
}
