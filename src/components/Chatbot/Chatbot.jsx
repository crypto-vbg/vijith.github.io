import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Markdown from "./Markdown.jsx";
import MorphFab from "./MorphFab.jsx";
import AiTextLoading from "./AiTextLoading.jsx";
import { SITE } from "../../site.config.js";
import {
  Monogram,
  CloseIcon,
  ResetIcon,
  SendIcon,
  StopIcon,
  HourglassIcon,
} from "../Icons.jsx";
import "./chatbot.css";

const SUGGESTED = SITE.chatbot.suggestedQuestions;
const QUEUE_MESSAGES = SITE.chatbot.queueMessages;

const STATUS_META = {
  available: { color: "var(--green)", label: "Available", hint: "Responses are immediate" },
  busy: { color: "var(--amber)", label: "Busy", hint: "Short queue · ~30–60s waits possible" },
  high: { color: "var(--red)", label: "High Demand", hint: "Longer waits · queue active" },
  unknown: { color: "var(--faint)", label: "Checking…", hint: "Fetching availability" },
};

const STORAGE_KEY = "vijith-chat-history";
const MAX_RETRIES = 6;

function loadHistory() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("unknown");
  const [messages, setMessages] = useState(loadHistory);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false); // request in flight (incl. queued)
  const [queue, setQueue] = useState(null); // { position, total, remaining }
  const [queueMsgIdx, setQueueMsgIdx] = useState(0);
  const scrollRef = useRef(null);
  const abortRef = useRef(null);

  // ----- persistence -----
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      /* storage full/unavailable — history just won't persist */
    }
  }, [messages]);

  // ----- open via nav/hero buttons -----
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-chatbot", onOpen);
    return () => window.removeEventListener("open-chatbot", onOpen);
  }, []);

  // ----- availability polling while open -----
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const check = async () => {
      try {
        const res = await fetch("/api/chat");
        const data = await res.json();
        if (!cancelled) setStatus(data.status ?? "unknown");
      } catch {
        if (!cancelled) setStatus("unknown");
      }
    };
    check();
    const iv = setInterval(check, 30_000);
    return () => {
      cancelled = true;
      clearInterval(iv);
    };
  }, [open]);

  // ----- autoscroll -----
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, queue, busy]);

  // ----- rotating queue copy -----
  useEffect(() => {
    if (!queue) return;
    const iv = setInterval(() => setQueueMsgIdx((i) => (i + 1) % QUEUE_MESSAGES.length), 4000);
    return () => clearInterval(iv);
  }, [queue]);

  const send = useCallback(
    async (text) => {
      const content = text.trim();
      if (!content || busy) return;
      setInput("");
      setBusy(true);
      setQueue(null);

      const history = [...messages, { role: "user", content }];
      setMessages([...history, { role: "assistant", content: "", streaming: true }]);

      const controller = new AbortController();
      abortRef.current = controller;

      const fail = (msg) => {
        setMessages([
          ...history,
          { role: "assistant", content: msg, error: true },
        ]);
      };

      try {
        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: history.map(({ role, content }) => ({ role, content })),
            }),
            signal: controller.signal,
          });

          if (res.status === 429) {
            if (attempt === MAX_RETRIES) {
              fail(SITE.chatbot.capacityMessage);
              return;
            }
            const info = await res.json().catch(() => ({}));
            const wait = Math.min(Math.max(info.retryAfter ?? 15, 3), 60);
            setStatus("high");
            // visible countdown, second by second
            for (let s = wait; s > 0; s--) {
              setQueue({
                position: info.queuePosition ?? 1,
                total: wait,
                remaining: s,
              });
              await new Promise((r) => setTimeout(r, 1000));
              if (controller.signal.aborted) return;
            }
            setQueue(null);
            continue; // retry
          }

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            fail(err.error || "Something went wrong. Please try again.");
            return;
          }

          // ----- stream -----
          setQueue(null);
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let acc = "";
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
                  setMessages([
                    ...history,
                    { role: "assistant", content: acc, streaming: true },
                  ]);
                }
              } catch {
                /* ignore partial lines */
              }
            }
          }
          if (acc) {
            setMessages([...history, { role: "assistant", content: acc }]);
          } else {
            fail("I didn't manage to produce an answer — please try rephrasing.");
          }
          return;
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          fail("Connection hiccup — please check your network and try again.");
        }
      } finally {
        setBusy(false);
        setQueue(null);
        abortRef.current = null;
      }
    },
    [busy, messages]
  );

  const stop = () => abortRef.current?.abort();
  const clearChat = () => {
    stop();
    setMessages([]);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const meta = STATUS_META[status] ?? STATUS_META.unknown;
  const showSuggestions = messages.length === 0 && !busy;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="cb-panel"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* header */}
            <div className="cb-header">
              <div className="cb-avatar">
                <Monogram size={30} />
              </div>
              <div className="cb-headtext">
                <b>{SITE.chatbot.title}</b>
                <span className="cb-status" title={meta.hint}>
                  <i className="cb-dot" style={{ "--dot": meta.color }} /> {meta.label} ·{" "}
                  {meta.hint}
                </span>
              </div>
              <button className="cb-iconbtn" title="Clear conversation" onClick={clearChat}>
                <ResetIcon size={15} />
              </button>
              <button className="cb-iconbtn" title="Close" onClick={() => setOpen(false)}>
                <CloseIcon size={15} />
              </button>
            </div>

            {/* messages */}
            <div className="cb-body" ref={scrollRef}>
              <div className="cb-msg assistant">
                <div className="cb-bubble">
                  <Markdown text={SITE.chatbot.welcome} />
                </div>
              </div>

              {messages.map((m, i) => (
                <div className={`cb-msg ${m.role} ${m.error ? "error" : ""}`} key={i}>
                  <div className="cb-bubble">
                    {m.role === "assistant" ? <Markdown text={m.content} /> : m.content}
                    {m.streaming && !m.content && <AiTextLoading />}
                  </div>
                </div>
              ))}

              {queue && (
                <div className="cb-queue">
                  <div className="cb-queue-head">
                    <span>
                      <HourglassIcon size={13} className="cb-hourglass" /> Queue position{" "}
                      <b>#{queue.position}</b>
                    </span>
                    <span>~{queue.remaining}s</span>
                  </div>
                  <div className="cb-progress">
                    <div
                      className="cb-progress-fill"
                      style={{ width: `${((queue.total - queue.remaining) / queue.total) * 100}%` }}
                    />
                  </div>
                  <span className="cb-queue-msg">{QUEUE_MESSAGES[queueMsgIdx]}</span>
                </div>
              )}

              {showSuggestions && (
                <div className="cb-suggestions">
                  {SUGGESTED.map((q) => (
                    <button key={q} onClick={() => send(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* input */}
            <div className="cb-inputrow">
              <textarea
                rows={1}
                value={input}
                placeholder={SITE.chatbot.placeholder}
                maxLength={1000}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
              />
              {busy ? (
                <button className="cb-send stop" onClick={stop} title="Stop">
                  <StopIcon size={16} />
                </button>
              ) : (
                <button
                  className="cb-send"
                  onClick={() => send(input)}
                  disabled={!input.trim()}
                  title="Send"
                >
                  <SendIcon size={17} />
                </button>
              )}
            </div>
            <div className="cb-footnote">{SITE.chatbot.footnote}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`cb-fab ${open ? "open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label={open ? "Close chat" : "Chat with Vijith's AI assistant"}
      >
        <MorphFab open={open} size={34} />
        {!open && <span className="cb-fab-ring" />}
      </motion.button>
    </>
  );
}
