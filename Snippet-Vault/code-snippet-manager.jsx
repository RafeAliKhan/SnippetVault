import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Plus, Search, Copy, Check, Trash2, Pencil } from "lucide-react";


const LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "c", label: "C" },
  { id: "cpp", label: "C++" },
  { id: "csharp", label: "C#" },
  { id: "go", label: "Go" },
  { id: "ruby", label: "Ruby" },
  { id: "php", label: "PHP" },
  { id: "sql", label: "SQL" },
  { id: "bash", label: "Bash" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "json", label: "JSON" },
  { id: "plaintext", label: "Plain text" },
];

const LANG_LABEL = Object.fromEntries(LANGUAGES.map((l) => [l.id, l.label]));

const LANG_COLOR = {
  javascript: "#D9A93D",
  typescript: "#5B8CA6",
  python: "#6FA36B",
  java: "#B5703C",
  c: "#8C8267",
  cpp: "#8C6A9E",
  csharp: "#6A8E9E",
  go: "#4FA8A0",
  ruby: "#C1594F",
  php: "#7A8CC4",
  sql: "#C79A4B",
  bash: "#7FA37A",
  html: "#C1704F",
  css: "#6E8CA0",
  json: "#B0A16E",
  plaintext: "#8A8A82",
};

function strPat(q) {
  return `${q}(?:[^${q}\\\\]|\\\\.)*${q}`;
}

const PY_TRIPLE = `'''[\\s\\S]*?'''|"""[\\s\\S]*?"""`;
const C_COMMENT = `//.*|/\\*[\\s\\S]*?\\*/`;

const LANG_CONFIGS = {
  javascript: {
    comment: C_COMMENT,
    string: `${strPat('"')}|${strPat("'")}|${strPat("`")}`,
    keyword: `\\b(?:const|let|var|function|return|if|else|for|while|switch|case|break|continue|class|extends|new|this|import|export|from|default|async|await|try|catch|finally|throw|typeof|instanceof|in|of|null|undefined|true|false|do|delete|void|yield|static|get|set)\\b`,
  },
  typescript: {
    comment: C_COMMENT,
    string: `${strPat('"')}|${strPat("'")}|${strPat("`")}`,
    keyword: `\\b(?:const|let|var|function|return|if|else|for|while|switch|case|break|continue|class|extends|implements|interface|type|enum|namespace|new|this|import|export|from|default|async|await|try|catch|finally|throw|typeof|instanceof|in|of|null|undefined|true|false|public|private|protected|readonly|static|as)\\b`,
  },
  python: {
    comment: `#.*`,
    string: `${PY_TRIPLE}|${strPat('"')}|${strPat("'")}`,
    keyword: `\\b(?:def|return|if|elif|else|for|while|break|continue|class|import|from|as|try|except|finally|raise|with|lambda|pass|yield|global|nonlocal|in|is|not|and|or|None|True|False|self|async|await)\\b`,
  },
  java: {
    comment: C_COMMENT,
    string: `${strPat('"')}|${strPat("'")}`,
    keyword: `\\b(?:public|private|protected|class|interface|extends|implements|static|final|void|new|return|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|throws|import|package|this|super|null|true|false|int|double|float|long|boolean|char|String|enum)\\b`,
  },
  c: {
    comment: C_COMMENT,
    string: `${strPat('"')}|${strPat("'")}`,
    keyword: `\\b(?:int|char|float|double|void|long|short|unsigned|signed|struct|union|enum|typedef|return|if|else|for|while|do|switch|case|break|continue|goto|static|const|sizeof|include|define|NULL)\\b`,
  },
  cpp: {
    comment: C_COMMENT,
    string: `${strPat('"')}|${strPat("'")}`,
    keyword: `\\b(?:int|char|float|double|void|long|short|unsigned|signed|struct|union|enum|typedef|return|if|else|for|while|do|switch|case|break|continue|class|public|private|protected|namespace|using|new|delete|template|virtual|friend|operator|try|catch|throw|nullptr|true|false|this|std|const|static|include)\\b`,
  },
  csharp: {
    comment: C_COMMENT,
    string: `${strPat('"')}`,
    keyword: `\\b(?:public|private|protected|class|interface|static|void|new|return|if|else|for|foreach|while|switch|case|break|continue|try|catch|finally|throw|using|namespace|this|null|true|false|int|double|float|long|bool|char|string|var|in|is|as)\\b`,
  },
  go: {
    comment: C_COMMENT,
    string: `${strPat('"')}|${strPat("`")}`,
    keyword: `\\b(?:func|package|import|var|const|type|struct|interface|return|if|else|for|range|switch|case|break|continue|go|chan|defer|select|map|true|false|nil)\\b`,
  },
  ruby: {
    comment: `#.*`,
    string: `${strPat('"')}|${strPat("'")}`,
    keyword: `\\b(?:def|end|class|module|if|elsif|else|unless|while|until|for|in|do|begin|rescue|ensure|raise|require|attr_accessor|puts|nil|true|false|self|return)\\b`,
  },
  php: {
    comment: `//.*|#.*|/\\*[\\s\\S]*?\\*/`,
    string: `${strPat('"')}|${strPat("'")}`,
    keyword: `\\b(?:function|return|if|else|elseif|foreach|for|while|switch|case|break|continue|class|public|private|protected|static|new|echo|print|require|include|namespace|use|true|false|null)\\b`,
  },
  sql: {
    comment: `--.*`,
    string: strPat("'"),
    keyword: `\\b(?:[Ss][Ee][Ll][Ee][Cc][Tt]|[Ff][Rr][Oo][Mm]|[Ww][Hh][Ee][Rr][Ee]|[Ii][Nn][Ss][Ee][Rr][Tt]|[Ii][Nn][Tt][Oo]|[Vv][Aa][Ll][Uu][Ee][Ss]|[Uu][Pp][Dd][Aa][Tt][Ee]|[Ss][Ee][Tt]|[Dd][Ee][Ll][Ee][Tt][Ee]|[Jj][Oo][Ii][Nn]|[Ll][Ee][Ff][Tt]|[Rr][Ii][Gg][Hh][Tt]|[Ii][Nn][Nn][Ee][Rr]|[Oo][Nn]|[Gg][Rr][Oo][Uu][Pp]|[Bb][Yy]|[Oo][Rr][Dd][Ee][Rr]|[Aa][Ss]|[Aa][Nn][Dd]|[Oo][Rr]|[Nn][Oo][Tt]|[Nn][Uu][Ll][Ll]|[Cc][Rr][Ee][Aa][Tt][Ee]|[Tt][Aa][Bb][Ll][Ee]|[Dd][Ii][Ss][Tt][Ii][Nn][Cc][Tt]|[Ll][Ii][Mm][Ii][Tt])\\b`,
  },
  bash: {
    comment: `#.*`,
    string: `${strPat('"')}|${strPat("'")}`,
    keyword: `\\b(?:if|then|else|elif|fi|for|in|do|done|while|until|case|esac|function|echo|export|local|return|exit|true|false)\\b`,
  },
  html: {
    comment: `<!--[\\s\\S]*?-->`,
    string: `${strPat('"')}|${strPat("'")}`,
    tag: true,
  },
  css: {
    comment: `/\\*[\\s\\S]*?\\*/`,
    string: `${strPat('"')}|${strPat("'")}`,
    cssProp: true,
  },
  json: {
    string: strPat('"'),
    keyword: `\\b(?:true|false|null)\\b`,
  },
  plaintext: {},
};

function getTokenRegex(lang) {
  const cfg = LANG_CONFIGS[lang];
  if (!cfg) return null;
  const groups = [];
  if (cfg.comment) groups.push(`(?<comment>${cfg.comment})`);
  if (cfg.string) groups.push(`(?<string>${cfg.string})`);
  if (cfg.tag) groups.push(`(?<tag><\\/?[a-zA-Z][\\w-]*)`);
  let kw = cfg.keyword || "";
  if (cfg.cssProp) kw = kw ? `${kw}|[a-zA-Z-]+(?=\\s*:)` : `[a-zA-Z-]+(?=\\s*:)`;
  if (kw) groups.push(`(?<keyword>${kw})`);
  groups.push(`(?<number>\\b\\d+\\.?\\d*\\b)`);
  if (groups.length <= 1) return null;
  return new RegExp(groups.join("|"), "g");
}

function highlightCode(code, lang) {
  const re = getTokenRegex(lang);
  if (!re) return [{ text: code, type: "plain" }];
  const tokens = [];
  let last = 0;
  let m;
  while ((m = re.exec(code)) !== null) {
    if (m.index > last) tokens.push({ text: code.slice(last, m.index), type: "plain" });
    const type = m.groups.comment !== undefined
      ? "comment"
      : m.groups.string !== undefined
      ? "string"
      : m.groups.tag !== undefined
      ? "tag"
      : m.groups.keyword !== undefined
      ? "keyword"
      : "number";
    tokens.push({ text: m[0], type });
    last = re.lastIndex;
    if (m[0].length === 0) re.lastIndex += 1;
  }
  if (last < code.length) tokens.push({ text: code.slice(last), type: "plain" });
  return tokens;
}

function tokensToLines(tokens) {
  const lines = [[]];
  for (const tok of tokens) {
    const parts = tok.text.split("\n");
    parts.forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ text: part, type: tok.type });
    });
  }
  return lines;
}


function uid() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

function makeExample() {
  const now = new Date().toISOString();
  return {
    id: uid(),
    title: "Debounce a function",
    language: "javascript",
    code:
      "function debounce(fn, wait) {\n" +
      "  let t;\n" +
      "  return (...args) => {\n" +
      "    clearTimeout(t);\n" +
      "    t = setTimeout(() => fn(...args), wait);\n" +
      "  };\n" +
      "}\n\n" +
      "// usage\n" +
      "const onResize = debounce(() => {\n" +
      "  console.log(\"resized\");\n" +
      "}, 200);\n" +
      "window.addEventListener(\"resize\", onResize);",
    notes:
      "Delays running fn until wait ms have passed since the last call. Good for resize, scroll, or search-input handlers. This is just an example — edit or delete it any time.",
    tags: ["javascript", "example", "performance"],
    createdAt: now,
    updatedAt: now,
  };
}

function CodeBlock({ code, language }) {
  const lines = useMemo(() => tokensToLines(highlightCode(code, language)), [code, language]);
  return (
    <pre className="sd-code">
      <code>
        {lines.map((line, i) => (
          <div className="sd-code-line" key={i}>
            <span className="sd-code-gutter">{i + 1}</span>
            <span className="sd-code-text">
              {line.length === 0
                ? "\u00A0"
                : line.map((tok, j) => (
                    <span key={j} className={tok.type !== "plain" ? `sd-tok-${tok.type}` : undefined}>
                      {tok.text}
                    </span>
                  ))}
            </span>
          </div>
        ))}
      </code>
    </pre>
  );
}

function ConfirmButton({ onConfirm, label, confirmLabel, className }) {
  const [confirming, setConfirming] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      timerRef.current = setTimeout(() => setConfirming(false), 3000);
      return;
    }
    clearTimeout(timerRef.current);
    setConfirming(false);
    onConfirm();
  };

  return (
    <button
      type="button"
      className={`${className || ""} ${confirming ? "sd-btn-confirming" : ""}`}
      onClick={handleClick}
      onBlur={() => setConfirming(false)}
    >
      {confirming ? confirmLabel : label}
    </button>
  );
}

function SnippetForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [language, setLanguage] = useState(initial?.language || "javascript");
  const [code, setCode] = useState(initial?.code || "");
  const [notes, setNotes] = useState(initial?.notes || "");
  const [tagsInput, setTagsInput] = useState((initial?.tags || []).join(", "));
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleCodeKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.target;
      const { selectionStart, selectionEnd, value } = el;
      const next = `${value.slice(0, selectionStart)}  ${value.slice(selectionEnd)}`;
      setCode(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = selectionStart + 2;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    onSave({ title: title.trim(), language, code, notes, tags });
  };

  return (
    <form className="sd-form" onSubmit={handleSubmit}>
      <label className="sd-field">
        <span>Title</span>
        <input
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Binary search"
          required
        />
      </label>
      <label className="sd-field">
        <span>Language</span>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {LANGUAGES.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
      </label>
      <label className="sd-field">
        <span>Code</span>
        <textarea
          className="sd-code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleCodeKeyDown}
          placeholder="Paste or write your snippet…"
          rows={10}
          required
          spellCheck={false}
        />
      </label>
      <label className="sd-field">
        <span>Notes</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What does this do? When would you reach for it?"
          rows={4}
        />
      </label>
      <label className="sd-field">
        <span>Tags</span>
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="comma, separated, tags"
        />
      </label>
      <div className="sd-form-actions">
        <button type="button" className="sd-btn sd-btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="sd-btn sd-btn-primary">
          Save snippet
        </button>
      </div>
    </form>
  );
}

/* for styling*/
const CSS = `
.sd-app {
  --bg: #1E2B27;
  --bg-well: #17211D;
  --paper: #F1E9D8;
  --ink: #2A241D;
  --ink-soft: #6B6152;
  --chalk: #F1E9D8;
  --chalk-soft: rgba(241,233,216,0.6);
  --accent: #D9A93D;
  --accent-ink: #241C0C;
  --danger: #B5533C;
  --line: rgba(241,233,216,0.14);
  --line-paper: rgba(42,36,29,0.14);
  --tok-comment: #7E9382;
  --tok-string: #8FB3C4;
  --tok-keyword: #E3B15C;
  --tok-number: #C97D68;

  font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: var(--bg);
  color: var(--chalk);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
}
.sd-app * { box-sizing: border-box; }
.sd-app button { font-family: inherit; cursor: pointer; }
.sd-app input, .sd-app textarea, .sd-app select { font-family: inherit; color: var(--ink); }
.sd-app :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.sd-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--line);
  background: var(--bg-well);
  flex-wrap: wrap;
}
.sd-brand {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: -0.02em;
  color: var(--chalk);
  white-space: nowrap;
}
.sd-search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(241,233,216,0.08);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 7px 10px;
  color: var(--chalk-soft);
  max-width: 420px;
}
.sd-search input {
  flex: 1;
  background: none;
  border: none;
  color: var(--chalk);
  font-size: 13px;
}
.sd-search input::placeholder { color: var(--chalk-soft); }
.sd-search input:focus { outline: none; }

.sd-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 4px;
  border: 1px solid transparent;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease, transform 0.12s ease;
}
.sd-btn-primary { background: var(--accent); color: var(--accent-ink); }
.sd-btn-primary:hover { background: #e6b658; }
.sd-btn-ghost { background: transparent; border-color: var(--line); color: var(--chalk); }
.sd-btn-ghost:hover { background: rgba(241,233,216,0.08); }
.sd-btn-danger { background: transparent; border-color: rgba(181,83,60,0.45); color: var(--danger); }
.sd-btn-danger:hover { background: rgba(181,83,60,0.12); }
.sd-btn-small { font-size: 11.5px; padding: 5px 8px; color: var(--chalk-soft); }
.sd-btn-confirming { background: var(--danger) !important; border-color: var(--danger) !important; color: #fff !important; }

.sd-banner { padding: 8px 20px; font-size: 12.5px; background: rgba(217,169,61,0.15); color: var(--chalk); border-bottom: 1px solid var(--line); }
.sd-banner-warn { background: rgba(181,83,60,0.18); }

.sd-body { flex: 1; display: flex; min-height: 0; }

.sd-sidebar { width: 280px; flex-shrink: 0; background: var(--bg-well); border-right: 1px solid var(--line); overflow-y: auto; padding: 12px; }
.sd-sidebar-footer { margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--line); text-align: center; }

.sd-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.sd-list-item {
  width: 100%;
  text-align: left;
  background: var(--paper);
  border: 1px solid var(--line-paper);
  border-left: 4px solid var(--lang-color, #9a9284);
  border-radius: 4px;
  padding: 9px 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.sd-list-item:hover { transform: translateY(-1px); box-shadow: 0 3px 8px rgba(0,0,0,0.25); }
.sd-list-item-active { outline: 2px solid var(--accent); outline-offset: -2px; }
.sd-list-title { font-weight: 700; font-size: 13.5px; color: var(--ink); }
.sd-list-preview {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 11.5px;
  color: var(--ink-soft);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sd-list-meta { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--ink-soft); }
.sd-lang-dot { width: 7px; height: 7px; border-radius: 999px; background: var(--lang-color, #9a9284); display: inline-block; flex-shrink: 0; }

.sd-main { flex: 1; overflow-y: auto; padding: 24px; }
.sd-card { background: var(--paper); color: var(--ink); border-radius: 6px; padding: 22px 26px 28px; max-width: 780px; box-shadow: 0 8px 24px rgba(0,0,0,0.28); }
.sd-card-title { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 19px; font-weight: 700; margin: 0 0 4px; letter-spacing: -0.01em; }
.sd-card-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 18px; flex-wrap: wrap; }
.sd-card-sub { display: flex; align-items: center; gap: 12px; margin-top: 6px; flex-wrap: wrap; }
.sd-updated { font-size: 12px; color: var(--ink-soft); }
.sd-card-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.sd-card-actions .sd-btn-ghost { border-color: var(--line-paper); color: var(--ink); }
.sd-card-actions .sd-btn-ghost:hover { background: rgba(42,36,29,0.06); }

.sd-pill { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: var(--ink); background: rgba(42,36,29,0.06); border-radius: 999px; padding: 3px 10px 3px 8px; }

.sd-code { background: var(--bg-well); color: var(--chalk); border-radius: 5px; padding: 14px 0; overflow-x: auto; margin: 0 0 18px; font-size: 12.5px; line-height: 1.6; }
.sd-code code { display: block; }
.sd-code-line { display: flex; }
.sd-code-gutter { flex-shrink: 0; width: 34px; text-align: right; padding-right: 12px; color: rgba(241,233,216,0.32); user-select: none; font-family: ui-monospace, Menlo, Consolas, monospace; }
.sd-code-text { white-space: pre; font-family: ui-monospace, Menlo, Consolas, monospace; padding-right: 16px; }
.sd-tok-comment { color: var(--tok-comment); font-style: italic; }
.sd-tok-string { color: var(--tok-string); }
.sd-tok-keyword { color: var(--tok-keyword); }
.sd-tok-number { color: var(--tok-number); }
.sd-tok-tag { color: var(--tok-keyword); }

.sd-notes h3 { font-size: 12px; color: var(--ink-soft); margin: 0 0 6px; font-weight: 700; }
.sd-notes p { margin: 0; white-space: pre-wrap; line-height: 1.55; font-size: 13.5px; }

.sd-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px; }
.sd-tag { font-size: 11.5px; background: rgba(42,36,29,0.08); color: var(--ink-soft); padding: 3px 9px; border-radius: 999px; }

.sd-form { display: flex; flex-direction: column; gap: 14px; }
.sd-field { display: flex; flex-direction: column; gap: 5px; font-size: 12.5px; font-weight: 600; color: var(--ink-soft); }
.sd-field input, .sd-field select, .sd-field textarea { border: 1px solid var(--line-paper); border-radius: 4px; padding: 8px 10px; font-size: 13.5px; background: #fff; color: var(--ink); }
.sd-field textarea { resize: vertical; }
.sd-code-input { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 12.5px; }
.sd-form-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }

.sd-empty { color: var(--chalk-soft); font-size: 13px; padding: 24px 12px; text-align: center; }
.sd-empty-main { padding: 60px 20px; }

@media (max-width: 720px) {
  .sd-body { flex-direction: column; }
  .sd-sidebar { width: 100%; max-height: 260px; border-right: none; border-bottom: 1px solid var(--line); }
  .sd-search { order: 3; max-width: none; width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .sd-app * { transition: none !important; }
}
`;

export default function SnippetDrawer() {
  const hasStorage = typeof window !== "undefined" && !!window.storage;
  const [snippets, setSnippets] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState("view"); // view | edit | new
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!hasStorage) {
        setLoaded(true);
        return;
      }
      try {
        const res = await window.storage.get("snippets", false);
        if (cancelled) return;
        const list = res && res.value ? JSON.parse(res.value) : [];
        if (list.length === 0) {
          const seed = [makeExample()];
          setSnippets(seed);
          setSelectedId(seed[0].id);
          window.storage.set("snippets", JSON.stringify(seed), false).catch(() => {});
        } else {
          setSnippets(list);
          setSelectedId(list[0].id);
        }
      } catch {
        if (cancelled) return;
        const seed = [makeExample()];
        setSnippets(seed);
        setSelectedId(seed[0].id);
        try {
          await window.storage.set("snippets", JSON.stringify(seed), false);
        } catch {
          /* first run seeding is best-effort */
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [hasStorage]);

  const persist = useCallback(
    async (list) => {
      if (!hasStorage) return;
      try {
        const result = await window.storage.set("snippets", JSON.stringify(list), false);
        setSaveError(result ? null : "Couldn't save your changes. They'll last for this session.");
      } catch {
        setSaveError("Couldn't save your changes. They'll last for this session.");
      }
    },
    [hasStorage]
  );

  const mutate = useCallback(
    (updater) => {
      setSnippets((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const selected = snippets.find((s) => s.id === selectedId) || null;

  const filtered = useMemo(() => {
    const sorted = [...snippets].sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (LANG_LABEL[s.language] || "").toLowerCase().includes(q) ||
        (s.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        s.code.toLowerCase().includes(q) ||
        (s.notes || "").toLowerCase().includes(q)
    );
  }, [snippets, query]);

  function startNew() {
    setMode("new");
  }
  function startEdit() {
    if (selected) setMode("edit");
  }
  function cancelForm() {
    setMode("view");
  }

  function saveNew(data) {
    const now = new Date().toISOString();
    const snippet = { id: uid(), createdAt: now, updatedAt: now, ...data };
    mutate((prev) => [snippet, ...prev]);
    setSelectedId(snippet.id);
    setMode("view");
  }

  function saveEdit(data) {
    if (!selected) return;
    const targetId = selected.id;
    mutate((prev) => prev.map((s) => (s.id === targetId ? { ...s, ...data, updatedAt: new Date().toISOString() } : s)));
    setMode("view");
  }

  function removeSnippet(id) {
    mutate((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      const next = prev.filter((s) => s.id !== id);
      const fallback = next[Math.min(idx, next.length - 1)];
      setSelectedId(fallback ? fallback.id : null);
      return next;
    });
    setMode("view");
  }

  function clearAll() {
    mutate(() => []);
    setSelectedId(null);
    setMode("view");
  }

  function copyCode() {
    if (!selected || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(selected.code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="sd-app">
        <header className="sd-header">
          <div className="sd-brand">snippet drawer</div>
          <div className="sd-search">
            <Search size={15} strokeWidth={2} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, tag, language, code…"
              aria-label="Search snippets"
            />
          </div>
          <button className="sd-btn sd-btn-primary" onClick={startNew}>
            <Plus size={15} strokeWidth={2.25} /> New snippet
          </button>
        </header>

        {!hasStorage && (
          <div className="sd-banner">Storage isn't available here, so snippets will only last for this session.</div>
        )}
        {hasStorage && saveError && <div className="sd-banner sd-banner-warn">{saveError}</div>}

        <div className="sd-body">
          <aside className="sd-sidebar">
            {!loaded ? (
              <div className="sd-empty">Loading your snippets…</div>
            ) : filtered.length === 0 ? (
              <div className="sd-empty">
                {snippets.length === 0 ? "No snippets yet. Add your first one." : "Nothing matches that search."}
              </div>
            ) : (
              <ul className="sd-list">
                {filtered.map((s) => (
                  <li key={s.id}>
                    <button
                      className={`sd-list-item ${s.id === selectedId && mode !== "new" ? "sd-list-item-active" : ""}`}
                      style={{ "--lang-color": LANG_COLOR[s.language] || "#9a9284" }}
                      onClick={() => {
                        setSelectedId(s.id);
                        setMode("view");
                      }}
                    >
                      <span className="sd-list-title">{s.title}</span>
                      <span className="sd-list-preview">
                        {(s.code.split("\n").find((l) => l.trim()) || "").trim().slice(0, 60)}
                      </span>
                      <span className="sd-list-meta">
                        <span className="sd-lang-dot" />
                        {LANG_LABEL[s.language] || s.language}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {loaded && snippets.length > 0 && (
              <div className="sd-sidebar-footer">
                <ConfirmButton
                  className="sd-btn sd-btn-ghost sd-btn-small"
                  label="Clear all snippets"
                  confirmLabel="Confirm clear all?"
                  onConfirm={clearAll}
                />
              </div>
            )}
          </aside>

          <main className="sd-main">
            {mode === "new" ? (
              <div className="sd-card">
                <h2 className="sd-card-title">New snippet</h2>
                <SnippetForm onSave={saveNew} onCancel={cancelForm} />
              </div>
            ) : mode === "edit" && selected ? (
              <div className="sd-card">
                <h2 className="sd-card-title">Edit snippet</h2>
                <SnippetForm initial={selected} onSave={saveEdit} onCancel={cancelForm} />
              </div>
            ) : selected ? (
              <div className="sd-card">
                <div className="sd-card-head">
                  <div>
                    <h2 className="sd-card-title">{selected.title}</h2>
                    <div className="sd-card-sub">
                      <span className="sd-pill" style={{ "--lang-color": LANG_COLOR[selected.language] || "#9a9284" }}>
                        <span className="sd-lang-dot" /> {LANG_LABEL[selected.language] || selected.language}
                      </span>
                      <span className="sd-updated">Updated {formatDate(selected.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="sd-card-actions">
                    <button className="sd-btn sd-btn-ghost" onClick={copyCode}>
                      {copied ? (
                        <>
                          <Check size={14} /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy
                        </>
                      )}
                    </button>
                    <button className="sd-btn sd-btn-ghost" onClick={startEdit}>
                      <Pencil size={14} /> Edit
                    </button>
                    <ConfirmButton
                      className="sd-btn sd-btn-danger"
                      label={
                        <>
                          <Trash2 size={14} /> Delete
                        </>
                      }
                      confirmLabel="Confirm delete?"
                      onConfirm={() => removeSnippet(selected.id)}
                    />
                  </div>
                </div>

                <CodeBlock code={selected.code} language={selected.language} />

                {selected.notes && (
                  <div className="sd-notes">
                    <h3>Notes</h3>
                    <p>{selected.notes}</p>
                  </div>
                )}

                {selected.tags && selected.tags.length > 0 && (
                  <div className="sd-tags">
                    {selected.tags.map((t) => (
                      <span key={t} className="sd-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="sd-empty sd-empty-main">{loaded ? "Select a snippet, or add a new one." : "Loading…"}</div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
