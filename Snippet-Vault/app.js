const { useState, useEffect, useCallback, useMemo, useRef } = React;
function IconPlus({ size = 15, strokeWidth = 2 }) {
  return /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "5", x2: "12", y2: "19" }), /* @__PURE__ */ React.createElement("line", { x1: "5", y1: "12", x2: "19", y2: "12" }));
}
function IconSearch({ size = 15 }) {
  return /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "7" }), /* @__PURE__ */ React.createElement("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" }));
}
function IconCopy({ size = 14 }) {
  return /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("rect", { x: "9", y: "9", width: "12", height: "12", rx: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" }));
}
function IconCheck({ size = 14 }) {
  return /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("polyline", { points: "20 6 9 17 4 12" }));
}
function IconTrash({ size = 14 }) {
  return /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ React.createElement("path", { d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" }), /* @__PURE__ */ React.createElement("path", { d: "M10 11v6" }), /* @__PURE__ */ React.createElement("path", { d: "M14 11v6" }), /* @__PURE__ */ React.createElement("path", { d: "M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" }));
}
function IconPencil({ size = 14 }) {
  return /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M12 20h9" }), /* @__PURE__ */ React.createElement("path", { d: "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" }));
}
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
  { id: "plaintext", label: "Plain text" }
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
  plaintext: "#8A8A82"
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
    keyword: `\\b(?:const|let|var|function|return|if|else|for|while|switch|case|break|continue|class|extends|new|this|import|export|from|default|async|await|try|catch|finally|throw|typeof|instanceof|in|of|null|undefined|true|false|do|delete|void|yield|static|get|set)\\b`
  },
  typescript: {
    comment: C_COMMENT,
    string: `${strPat('"')}|${strPat("'")}|${strPat("`")}`,
    keyword: `\\b(?:const|let|var|function|return|if|else|for|while|switch|case|break|continue|class|extends|implements|interface|type|enum|namespace|new|this|import|export|from|default|async|await|try|catch|finally|throw|typeof|instanceof|in|of|null|undefined|true|false|public|private|protected|readonly|static|as)\\b`
  },
  python: {
    comment: `#.*`,
    string: `${PY_TRIPLE}|${strPat('"')}|${strPat("'")}`,
    keyword: `\\b(?:def|return|if|elif|else|for|while|break|continue|class|import|from|as|try|except|finally|raise|with|lambda|pass|yield|global|nonlocal|in|is|not|and|or|None|True|False|self|async|await)\\b`
  },
  java: {
    comment: C_COMMENT,
    string: `${strPat('"')}|${strPat("'")}`,
    keyword: `\\b(?:public|private|protected|class|interface|extends|implements|static|final|void|new|return|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|throws|import|package|this|super|null|true|false|int|double|float|long|boolean|char|String|enum)\\b`
  },
  c: {
    comment: C_COMMENT,
    string: `${strPat('"')}|${strPat("'")}`,
    keyword: `\\b(?:int|char|float|double|void|long|short|unsigned|signed|struct|union|enum|typedef|return|if|else|for|while|do|switch|case|break|continue|goto|static|const|sizeof|include|define|NULL)\\b`
  },
  cpp: {
    comment: C_COMMENT,
    string: `${strPat('"')}|${strPat("'")}`,
    keyword: `\\b(?:int|char|float|double|void|long|short|unsigned|signed|struct|union|enum|typedef|return|if|else|for|while|do|switch|case|break|continue|class|public|private|protected|namespace|using|new|delete|template|virtual|friend|operator|try|catch|throw|nullptr|true|false|this|std|const|static|include)\\b`
  },
  csharp: {
    comment: C_COMMENT,
    string: strPat('"'),
    keyword: `\\b(?:public|private|protected|class|interface|static|void|new|return|if|else|for|foreach|while|switch|case|break|continue|try|catch|finally|throw|using|namespace|this|null|true|false|int|double|float|long|bool|char|string|var|in|is|as)\\b`
  },
  go: {
    comment: C_COMMENT,
    string: `${strPat('"')}|${strPat("`")}`,
    keyword: `\\b(?:func|package|import|var|const|type|struct|interface|return|if|else|for|range|switch|case|break|continue|go|chan|defer|select|map|true|false|nil)\\b`
  },
  ruby: {
    comment: `#.*`,
    string: `${strPat('"')}|${strPat("'")}`,
    keyword: `\\b(?:def|end|class|module|if|elsif|else|unless|while|until|for|in|do|begin|rescue|ensure|raise|require|attr_accessor|puts|nil|true|false|self|return)\\b`
  },
  php: {
    comment: `//.*|#.*|/\\*[\\s\\S]*?\\*/`,
    string: `${strPat('"')}|${strPat("'")}`,
    keyword: `\\b(?:function|return|if|else|elseif|foreach|for|while|switch|case|break|continue|class|public|private|protected|static|new|echo|print|require|include|namespace|use|true|false|null)\\b`
  },
  sql: {
    comment: `--.*`,
    string: strPat("'"),
    keyword: `\\b(?:[Ss][Ee][Ll][Ee][Cc][Tt]|[Ff][Rr][Oo][Mm]|[Ww][Hh][Ee][Rr][Ee]|[Ii][Nn][Ss][Ee][Rr][Tt]|[Ii][Nn][Tt][Oo]|[Vv][Aa][Ll][Uu][Ee][Ss]|[Uu][Pp][Dd][Aa][Tt][Ee]|[Ss][Ee][Tt]|[Dd][Ee][Ll][Ee][Tt][Ee]|[Jj][Oo][Ii][Nn]|[Ll][Ee][Ff][Tt]|[Rr][Ii][Gg][Hh][Tt]|[Ii][Nn][Nn][Ee][Rr]|[Oo][Nn]|[Gg][Rr][Oo][Uu][Pp]|[Bb][Yy]|[Oo][Rr][Dd][Ee][Rr]|[Aa][Ss]|[Aa][Nn][Dd]|[Oo][Rr]|[Nn][Oo][Tt]|[Nn][Uu][Ll][Ll]|[Cc][Rr][Ee][Aa][Tt][Ee]|[Tt][Aa][Bb][Ll][Ee]|[Dd][Ii][Ss][Tt][Ii][Nn][Cc][Tt]|[Ll][Ii][Mm][Ii][Tt])\\b`
  },
  bash: {
    comment: `#.*`,
    string: `${strPat('"')}|${strPat("'")}`,
    keyword: `\\b(?:if|then|else|elif|fi|for|in|do|done|while|until|case|esac|function|echo|export|local|return|exit|true|false)\\b`
  },
  html: {
    comment: `<!--[\\s\\S]*?-->`,
    string: `${strPat('"')}|${strPat("'")}`,
    tag: true
  },
  css: {
    comment: `/\\*[\\s\\S]*?\\*/`,
    string: `${strPat('"')}|${strPat("'")}`,
    cssProp: true
  },
  json: {
    string: strPat('"'),
    keyword: `\\b(?:true|false|null)\\b`
  },
  plaintext: {}
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
    const type = m.groups.comment !== void 0 ? "comment" : m.groups.string !== void 0 ? "string" : m.groups.tag !== void 0 ? "tag" : m.groups.keyword !== void 0 ? "keyword" : "number";
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
const STORAGE_KEY = "snippet-drawer:snippets";
function loadSnippets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
  }
  return null;
}
function saveSnippets(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    return false;
  }
}
let _initialCache = null;
function getInitialSnippets() {
  if (_initialCache) return _initialCache;
  let list = loadSnippets();
  if (!list || list.length === 0) {
    list = [makeExample()];
    saveSnippets(list);
  }
  _initialCache = list;
  return list;
}
function uid() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(void 0, { month: "short", day: "numeric" });
  } catch (e) {
    return "";
  }
}
function makeExample() {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return {
    id: uid(),
    title: "Debounce a function",
    language: "javascript",
    code: 'function debounce(fn, wait) {\n  let t;\n  return (...args) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...args), wait);\n  };\n}\n\n// usage\nconst onResize = debounce(() => {\n  console.log("resized");\n}, 200);\nwindow.addEventListener("resize", onResize);',
    notes: "Delays running fn until wait ms have passed since the last call. Good for resize, scroll, or search-input handlers. This is just an example \u2014 edit or delete it any time.",
    tags: ["javascript", "example", "performance"],
    createdAt: now,
    updatedAt: now
  };
}
function CodeBlock({ code, language }) {
  const lines = useMemo(() => tokensToLines(highlightCode(code, language)), [code, language]);
  return /* @__PURE__ */ React.createElement("pre", { className: "sd-code" }, /* @__PURE__ */ React.createElement("code", null, lines.map((line, i) => /* @__PURE__ */ React.createElement("div", { className: "sd-code-line", key: i }, /* @__PURE__ */ React.createElement("span", { className: "sd-code-gutter" }, i + 1), /* @__PURE__ */ React.createElement("span", { className: "sd-code-text" }, line.length === 0 ? "\xA0" : line.map((tok, j) => /* @__PURE__ */ React.createElement("span", { key: j, className: tok.type !== "plain" ? `sd-tok-${tok.type}` : void 0 }, tok.text)))))));
}
function ConfirmButton({ onConfirm, label, confirmLabel, className }) {
  const [confirming, setConfirming] = useState(false);
  const timerRef = useRef(null);
  useEffect(() => () => clearTimeout(timerRef.current), []);
  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      timerRef.current = setTimeout(() => setConfirming(false), 3e3);
      return;
    }
    clearTimeout(timerRef.current);
    setConfirming(false);
    onConfirm();
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: `${className || ""} ${confirming ? "sd-btn-confirming" : ""}`,
      onClick: handleClick,
      onBlur: () => setConfirming(false)
    },
    confirming ? confirmLabel : label
  );
}
function SnippetForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState((initial == null ? void 0 : initial.title) || "");
  const [language, setLanguage] = useState((initial == null ? void 0 : initial.language) || "javascript");
  const [code, setCode] = useState((initial == null ? void 0 : initial.code) || "");
  const [notes, setNotes] = useState((initial == null ? void 0 : initial.notes) || "");
  const [tagsInput, setTagsInput] = useState(((initial == null ? void 0 : initial.tags) || []).join(", "));
  const titleRef = useRef(null);
  useEffect(() => {
    var _a;
    (_a = titleRef.current) == null ? void 0 : _a.focus();
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
  return /* @__PURE__ */ React.createElement("form", { className: "sd-form", onSubmit: handleSubmit }, /* @__PURE__ */ React.createElement("label", { className: "sd-field" }, /* @__PURE__ */ React.createElement("span", null, "Title"), /* @__PURE__ */ React.createElement(
    "input",
    {
      ref: titleRef,
      value: title,
      onChange: (e) => setTitle(e.target.value),
      placeholder: "e.g. Binary search",
      required: true
    }
  )), /* @__PURE__ */ React.createElement("label", { className: "sd-field" }, /* @__PURE__ */ React.createElement("span", null, "Language"), /* @__PURE__ */ React.createElement("select", { value: language, onChange: (e) => setLanguage(e.target.value) }, LANGUAGES.map((l) => /* @__PURE__ */ React.createElement("option", { key: l.id, value: l.id }, l.label)))), /* @__PURE__ */ React.createElement("label", { className: "sd-field" }, /* @__PURE__ */ React.createElement("span", null, "Code"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "sd-code-input",
      value: code,
      onChange: (e) => setCode(e.target.value),
      onKeyDown: handleCodeKeyDown,
      placeholder: "Paste or write your snippet\u2026",
      rows: 10,
      required: true,
      spellCheck: false
    }
  )), /* @__PURE__ */ React.createElement("label", { className: "sd-field" }, /* @__PURE__ */ React.createElement("span", null, "Notes"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      value: notes,
      onChange: (e) => setNotes(e.target.value),
      placeholder: "What does this do? When would you reach for it?",
      rows: 4
    }
  )), /* @__PURE__ */ React.createElement("label", { className: "sd-field" }, /* @__PURE__ */ React.createElement("span", null, "Tags"), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: tagsInput,
      onChange: (e) => setTagsInput(e.target.value),
      placeholder: "comma, separated, tags"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "sd-form-actions" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "sd-btn sd-btn-ghost", onClick: onCancel }, "Cancel"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "sd-btn sd-btn-primary" }, "Save snippet")));
}
function SnippetDrawer() {
  const [snippets, setSnippets] = useState(() => getInitialSnippets());
  const [selectedId, setSelectedId] = useState(() => {
    var _a, _b;
    return (_b = (_a = getInitialSnippets()[0]) == null ? void 0 : _a.id) != null ? _b : null;
  });
  const [mode, setMode] = useState("view");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const persist = useCallback((list) => {
    const ok = saveSnippets(list);
    setSaveError(ok ? null : "Couldn't save \u2014 your browser may be blocking storage.");
  }, []);
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
      (s) => s.title.toLowerCase().includes(q) || (LANG_LABEL[s.language] || "").toLowerCase().includes(q) || (s.tags || []).some((t) => t.toLowerCase().includes(q)) || s.code.toLowerCase().includes(q) || (s.notes || "").toLowerCase().includes(q)
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
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const snippet = { id: uid(), createdAt: now, updatedAt: now, ...data };
    mutate((prev) => [snippet, ...prev]);
    setSelectedId(snippet.id);
    setMode("view");
  }
  function saveEdit(data) {
    if (!selected) return;
    const targetId = selected.id;
    mutate((prev) => prev.map((s) => s.id === targetId ? { ...s, ...data, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } : s));
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
    navigator.clipboard.writeText(selected.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {
    });
  }
  return /* @__PURE__ */ React.createElement("div", { className: "sd-app" }, /* @__PURE__ */ React.createElement("header", { className: "sd-header" }, /* @__PURE__ */ React.createElement("div", { className: "sd-brand" }, "snippet drawer"), /* @__PURE__ */ React.createElement("div", { className: "sd-search" }, /* @__PURE__ */ React.createElement(IconSearch, { size: 15 }), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: query,
      onChange: (e) => setQuery(e.target.value),
      placeholder: "Search title, tag, language, code\u2026",
      "aria-label": "Search snippets"
    }
  )), /* @__PURE__ */ React.createElement("button", { className: "sd-btn sd-btn-primary", onClick: startNew }, /* @__PURE__ */ React.createElement(IconPlus, { size: 15, strokeWidth: 2.25 }), " New snippet")), saveError && /* @__PURE__ */ React.createElement("div", { className: "sd-banner sd-banner-warn" }, saveError), /* @__PURE__ */ React.createElement("div", { className: "sd-body" }, /* @__PURE__ */ React.createElement("aside", { className: "sd-sidebar" }, filtered.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "sd-empty" }, snippets.length === 0 ? "No snippets yet. Add your first one." : "Nothing matches that search.") : /* @__PURE__ */ React.createElement("ul", { className: "sd-list" }, filtered.map((s) => /* @__PURE__ */ React.createElement("li", { key: s.id }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: `sd-list-item ${s.id === selectedId && mode !== "new" ? "sd-list-item-active" : ""}`,
      style: { "--lang-color": LANG_COLOR[s.language] || "#9a9284" },
      onClick: () => {
        setSelectedId(s.id);
        setMode("view");
      }
    },
    /* @__PURE__ */ React.createElement("span", { className: "sd-list-title" }, s.title),
    /* @__PURE__ */ React.createElement("span", { className: "sd-list-preview" }, (s.code.split("\n").find((l) => l.trim()) || "").trim().slice(0, 60)),
    /* @__PURE__ */ React.createElement("span", { className: "sd-list-meta" }, /* @__PURE__ */ React.createElement("span", { className: "sd-lang-dot" }), LANG_LABEL[s.language] || s.language)
  )))), snippets.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "sd-sidebar-footer" }, /* @__PURE__ */ React.createElement(
    ConfirmButton,
    {
      className: "sd-btn sd-btn-ghost sd-btn-small",
      label: "Clear all snippets",
      confirmLabel: "Confirm clear all?",
      onConfirm: clearAll
    }
  ))), /* @__PURE__ */ React.createElement("main", { className: "sd-main" }, mode === "new" ? /* @__PURE__ */ React.createElement("div", { className: "sd-card" }, /* @__PURE__ */ React.createElement("h2", { className: "sd-card-title" }, "New snippet"), /* @__PURE__ */ React.createElement(SnippetForm, { onSave: saveNew, onCancel: cancelForm })) : mode === "edit" && selected ? /* @__PURE__ */ React.createElement("div", { className: "sd-card" }, /* @__PURE__ */ React.createElement("h2", { className: "sd-card-title" }, "Edit snippet"), /* @__PURE__ */ React.createElement(SnippetForm, { initial: selected, onSave: saveEdit, onCancel: cancelForm })) : selected ? /* @__PURE__ */ React.createElement("div", { className: "sd-card" }, /* @__PURE__ */ React.createElement("div", { className: "sd-card-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "sd-card-title" }, selected.title), /* @__PURE__ */ React.createElement("div", { className: "sd-card-sub" }, /* @__PURE__ */ React.createElement("span", { className: "sd-pill", style: { "--lang-color": LANG_COLOR[selected.language] || "#9a9284" } }, /* @__PURE__ */ React.createElement("span", { className: "sd-lang-dot" }), " ", LANG_LABEL[selected.language] || selected.language), /* @__PURE__ */ React.createElement("span", { className: "sd-updated" }, "Updated ", formatDate(selected.updatedAt)))), /* @__PURE__ */ React.createElement("div", { className: "sd-card-actions" }, /* @__PURE__ */ React.createElement("button", { className: "sd-btn sd-btn-ghost", onClick: copyCode }, copied ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IconCheck, { size: 14 }), " Copied") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IconCopy, { size: 14 }), " Copy")), /* @__PURE__ */ React.createElement("button", { className: "sd-btn sd-btn-ghost", onClick: startEdit }, /* @__PURE__ */ React.createElement(IconPencil, { size: 14 }), " Edit"), /* @__PURE__ */ React.createElement(
    ConfirmButton,
    {
      className: "sd-btn sd-btn-danger",
      label: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IconTrash, { size: 14 }), " Delete"),
      confirmLabel: "Confirm delete?",
      onConfirm: () => removeSnippet(selected.id)
    }
  ))), /* @__PURE__ */ React.createElement(CodeBlock, { code: selected.code, language: selected.language }), selected.notes && /* @__PURE__ */ React.createElement("div", { className: "sd-notes" }, /* @__PURE__ */ React.createElement("h3", null, "Notes"), /* @__PURE__ */ React.createElement("p", null, selected.notes)), selected.tags && selected.tags.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "sd-tags" }, selected.tags.map((t) => /* @__PURE__ */ React.createElement("span", { key: t, className: "sd-tag" }, t)))) : /* @__PURE__ */ React.createElement("div", { className: "sd-empty sd-empty-main" }, "Select a snippet, or add a new one."))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(SnippetDrawer, null));
