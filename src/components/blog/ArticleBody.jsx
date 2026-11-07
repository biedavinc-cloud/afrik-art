// Liens de deux formes acceptées : [texte](https://…) saisi depuis l'éditeur,
// et URL brute détectée automatiquement.
const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+)/g;

function withLinks(text) {
  const nodes = [];
  let last = 0;
  let match;
  LINK_RE.lastIndex = 0;

  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const href = match[2] || match[3];
    const label = match[1] || href.replace(/^https?:\/\//, "").replace(/\/$/, "");
    nodes.push(
      <a
        key={match.index}
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="font-medium text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:decoration-primary"
      >
        {label}
      </a>
    );
    last = LINK_RE.lastIndex;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function parse(content) {
  const blocks = [];
  let list = null;

  (content || "").split("\n").forEach((line) => {
    const text = line.trim();
    if (!text) {
      list = null;
      return;
    }
    if (text.startsWith("- ")) {
      if (!list) {
        list = [];
        blocks.push({ type: "list", items: list });
      }
      list.push(text.slice(2));
      return;
    }
    list = null;
    if (text.startsWith("## ")) blocks.push({ type: "h2", text: text.slice(3) });
    else if (text.startsWith("> ")) blocks.push({ type: "quote", text: text.slice(2) });
    else blocks.push({ type: "p", text });
  });

  return blocks;
}

export default function ArticleBody({ content }) {
  const blocks = parse(content);

  return (
    <div className="article-body">
      {blocks.map((b, i) => {
        if (b.type === "h2")
          return (
            <div key={i} className="mt-12 first:mt-0">
              <span className="rule-gold block" />
              <h2 className="mt-4 font-heading text-[clamp(1.25rem,2vw,1.5rem)] font-semibold leading-snug tracking-tight">
                {b.text}
              </h2>
            </div>
          );

        if (b.type === "quote")
          return (
            <blockquote
              key={i}
              className="mt-7 border-l-2 border-accent pl-5 text-[17px] font-medium leading-[1.65] text-foreground/80"
            >
              {withLinks(b.text)}
            </blockquote>
          );

        if (b.type === "list")
          return (
            <ul key={i} className="mt-5 space-y-3">
              {b.items.map((item, j) => (
                <li key={j} className="flex gap-3 text-[15.5px] leading-[1.75] text-foreground/80">
                  <span className="mt-[11px] h-1 w-4 shrink-0 bg-accent" />
                  <span>{withLinks(item)}</span>
                </li>
              ))}
            </ul>
          );

        return (
          <p
            key={i}
            className={
              i === 0
                ? "mt-6 text-[17px] leading-[1.8] text-foreground/85 first-letter:float-left first-letter:mr-2 first-letter:font-heading first-letter:text-[3.1rem] first-letter:font-semibold first-letter:leading-[0.85] first-letter:text-foreground"
                : "mt-5 text-[16px] leading-[1.8] text-foreground/80"
            }
          >
            {withLinks(b.text)}
          </p>
        );
      })}
    </div>
  );
}