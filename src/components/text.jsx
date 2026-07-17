import Markdown from "./Chatbot/Markdown.jsx";

/** Renders a config title string; *starred* segments get the gradient accent. */
export function GradTitle({ text }) {
  return text.split("*").map((seg, i) =>
    i % 2 ? (
      <span className="grad-text" key={i}>
        {seg}
      </span>
    ) : (
      seg
    )
  );
}

/** Renders a config paragraph string with light Markdown (bold, links, bullets). */
export function RichText({ text }) {
  return <Markdown text={text} />;
}
