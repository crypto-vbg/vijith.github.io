import React from "react";

// Minimal, XSS-safe Markdown renderer (React elements only, no innerHTML).
// Supports: ``` code fences, `inline code`, **bold**, *italic*, [links](url),
// bare URLs, headings, and bullet/numbered lists. Tolerant of partial
// (streaming) input.

const INLINE_RE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\n]+\*)|(\[[^\]]+\]\((?:https?:\/\/|mailto:)[^)\s]+\))|((?:https?:\/\/)[^\s<>)\]]+)/g;

function renderInline(text, keyBase) {
  const parts = [];
  let last = 0;
  let m;
  let i = 0;
  INLINE_RE.lastIndex = 0;
  while ((m = INLINE_RE.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyBase}-${i++}`;
    if (m[1]) {
      parts.push(<code key={key}>{tok.slice(1, -1)}</code>);
    } else if (m[2]) {
      parts.push(<strong key={key}>{renderInline(tok.slice(2, -2), key)}</strong>);
    } else if (m[3]) {
      parts.push(<em key={key}>{tok.slice(1, -1)}</em>);
    } else if (m[4]) {
      const label = tok.slice(1, tok.indexOf("]"));
      const url = tok.slice(tok.indexOf("](") + 2, -1);
      parts.push(
        <a key={key} href={url} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      );
    } else if (m[5]) {
      parts.push(
        <a key={key} href={tok} target="_blank" rel="noopener noreferrer">
          {tok}
        </a>
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function renderTextBlock(block, keyBase) {
  const lines = block.split("\n");
  const out = [];
  let list = null; // { ordered, items }
  let para = [];
  let k = 0;

  const flushPara = () => {
    if (para.length) {
      out.push(<p key={`${keyBase}-p${k++}`}>{renderInline(para.join(" "), `${keyBase}-p${k}`)}</p>);
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      const Tag = list.ordered ? "ol" : "ul";
      out.push(
        <Tag key={`${keyBase}-l${k++}`}>
          {list.items.map((item, j) => (
            <li key={j}>{renderInline(item, `${keyBase}-li${k}-${j}`)}</li>
          ))}
        </Tag>
      );
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*[-*•]\s+(.*)/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.*)/);
    const heading = line.match(/^(#{1,4})\s+(.*)/);
    if (bullet || ordered) {
      flushPara();
      const isOrdered = Boolean(ordered);
      if (!list || list.ordered !== isOrdered) {
        flushList();
        list = { ordered: isOrdered, items: [] };
      }
      list.items.push((bullet || ordered)[1]);
    } else if (heading) {
      flushPara();
      flushList();
      out.push(<h4 key={`${keyBase}-h${k++}`}>{renderInline(heading[2], `${keyBase}-h${k}`)}</h4>);
    } else if (!line.trim()) {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flushPara();
  flushList();
  return out;
}

export default function Markdown({ text }) {
  const segments = String(text ?? "").split(/```/);
  return (
    <>
      {segments.map((seg, i) => {
        if (i % 2 === 1) {
          // code fence — first line may be a language tag
          const nl = seg.indexOf("\n");
          const code = nl >= 0 ? seg.slice(nl + 1) : seg;
          return (
            <pre key={i}>
              <code>{code.replace(/\n$/, "")}</code>
            </pre>
          );
        }
        return <React.Fragment key={i}>{renderTextBlock(seg, `s${i}`)}</React.Fragment>;
      })}
    </>
  );
}
