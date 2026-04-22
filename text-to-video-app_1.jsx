import { useState, useRef, useEffect, useCallback } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);
const icons = {
  video: "M15 10l4.553-2.069A1 1 0 0121 8.876V15.124a1 1 0 01-1.447.895L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z",
  text: "M4 6h16M4 12h8M4 18h16",
  wand: "M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M3 21l9-9M12.2 6.2L11 5",
  play: "M5 3l14 9-14 9V3z",
  pause: "M6 4h4v16H6zM14 4h4v16h-4z",
  scissors: "M6 3a3 3 0 110 6 3 3 0 010-6zM6 15a3 3 0 110 6 3 3 0 010-6zM20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12",
  music: "M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM21 16a3 3 0 11-6 0 3 3 0 016 0z",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  plus: "M12 5v14M5 12h14",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  image: "M21 15l-5-5L5 20M3 3h18v18H3V3zM9 10a1 1 0 110-2 1 1 0 010 2",
  mic: "M12 1a3 3 0 013 3v8a3 3 0 01-6 0V4a3 3 0 013-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 110 6 3 3 0 010-6z",
  sun: "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 110 14A7 7 0 0112 5z",
  moon: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
  film: "M2 2h20v20H2V2zM7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5",
  sparkle: "M12 3l2.09 6.26L21 9l-5 4.87L17.18 21 12 17.77 6.82 21 8 13.87 3 9l6.91-.74L12 3z",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  share: "M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  chevronRight: "M9 18l6-6-6-6",
  chevronLeft: "M15 18l-6-6 6-6",
  layout: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  type: "M4 7V4h16v3M9 20h6M12 4v16",
  volume: "M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const VOICES = [
  { id: "aria", name: "Aria", gender: "Female", lang: "English", style: "Professional" },
  { id: "nova", name: "Nova", gender: "Female", lang: "English", style: "Warm" },
  { id: "echo", name: "Echo", gender: "Male", lang: "English", style: "Deep" },
  { id: "onyx", name: "Onyx", gender: "Male", lang: "English", style: "Authoritative" },
  { id: "shimmer", name: "Shimmer", gender: "Female", lang: "English", style: "Energetic" },
];
const TEMPLATES = [
  { id: "youtube", name: "YouTube", ratio: "16:9", color: "#ff0000", icon: "▶" },
  { id: "reel", name: "Reels", ratio: "9:16", color: "#e91e8c", icon: "◻" },
  { id: "square", name: "Square", ratio: "1:1", color: "#4f46e5", icon: "■" },
  { id: "ads", name: "Ads", ratio: "4:5", color: "#f59e0b", icon: "◆" },
];
const TRANSITIONS = ["Fade", "Slide", "Zoom", "Wipe", "Dissolve", "Flash"];
const MUSIC_TRACKS = [
  { id: 1, name: "Ambient Dreams", genre: "Ambient", bpm: 80 },
  { id: 2, name: "Corporate Drive", genre: "Corporate", bpm: 120 },
  { id: 3, name: "Upbeat Energy", genre: "Pop", bpm: 140 },
  { id: 4, name: "Cinematic Epic", genre: "Cinematic", bpm: 90 },
  { id: 5, name: "Lo-fi Chill", genre: "Lo-fi", bpm: 70 },
];

// ─── Scene colors (for mock visuals) ─────────────────────────────────────────
const SCENE_GRADIENTS = [
  "linear-gradient(135deg,#1a1a2e,#16213e)",
  "linear-gradient(135deg,#0f3460,#533483)",
  "linear-gradient(135deg,#1b1b2f,#2c2c54)",
  "linear-gradient(135deg,#162447,#1f4068)",
  "linear-gradient(135deg,#1a0533,#3a0ca3)",
  "linear-gradient(135deg,#10002b,#240046)",
];

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [tab, setTab] = useState("create"); // create | editor | export
  const [script, setScript] = useState("");
  const [scenes, setScenes] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStep, setGenStep] = useState("");
  const [activeScene, setActiveScene] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0]);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [selectedTransition, setSelectedTransition] = useState("Fade");
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [musicVolume, setMusicVolume] = useState(40);
  const [voiceVolume, setVoiceVolume] = useState(80);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [bgType, setBgType] = useState("gradient");
  const [playing, setPlaying] = useState(false);
  const [exportQuality, setExportQuality] = useState("1080p");
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [overlayText, setOverlayText] = useState("");
  const [showOverlayPanel, setShowOverlayPanel] = useState(false);
  const fileRef = useRef();

  const bg = dark
    ? { bg: "#080b14", surface: "#0d1117", card: "#111827", border: "#1f2937", text: "#f3f4f6", sub: "#9ca3af", accent: "#6366f1" }
    : { bg: "#f8fafc", surface: "#ffffff", card: "#f1f5f9", border: "#e2e8f0", text: "#0f172a", sub: "#64748b", accent: "#4f46e5" };

  // Parse script into scenes
  const parseScenes = (text) => {
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 10);
    return paragraphs.map((p, i) => ({
      id: i,
      text: p.trim(),
      title: `Scene ${i + 1}`,
      gradient: SCENE_GRADIENTS[i % SCENE_GRADIENTS.length],
      duration: Math.max(3, Math.ceil(p.split(" ").length / 2.5)),
      transition: selectedTransition,
      overlay: "",
      imagePrompt: p.trim().slice(0, 60) + "...",
      voiceText: p.trim(),
      trimStart: 0,
      trimEnd: null,
    }));
  };

  const handleGenerate = async () => {
    if (!script.trim()) return;
    setGenerating(true);
    setGenProgress(0);
    const steps = [
      [10, "Analyzing script…"],
      [25, "Breaking into scenes…"],
      [45, "Generating visuals…"],
      [60, "Synthesizing voice…"],
      [75, "Creating subtitles…"],
      [88, "Adding transitions…"],
      [95, "Compositing scenes…"],
      [100, "Video ready!"],
    ];
    for (const [p, s] of steps) {
      await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
      setGenProgress(p); setGenStep(s);
    }
    const newScenes = parseScenes(script);
    setScenes(newScenes);
    setActiveScene(0);
    setGenerating(false);
    setTab("editor");
  };

  const handleAiSuggest = async () => {
    if (!script.trim()) return;
    setLoadingSuggestion(true);
    setAiSuggestion("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a professional video script writer. Improve scripts for engagement, clarity, and visual storytelling. Return ONLY the improved script, no commentary.",
          messages: [{ role: "user", content: `Improve this video script for maximum engagement and visual impact. Keep a similar length:\n\n${script}` }],
        }),
      });
      const data = await res.json();
      const improved = data.content?.find(b => b.type === "text")?.text || "";
      setAiSuggestion(improved);
    } catch (e) {
      setAiSuggestion("Could not fetch suggestion. Please try again.");
    }
    setLoadingSuggestion(false);
  };

  const handleExport = async () => {
    setExporting(true); setExportDone(false);
    await new Promise(r => setTimeout(r, 3000));
    setExporting(false); setExportDone(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setScript(ev.target.result);
    reader.readAsText(file);
  };

  const updateScene = (id, key, val) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, [key]: val } : s));
  };
  const deleteScene = (id) => {
    const next = scenes.filter(s => s.id !== id);
    setScenes(next);
    if (activeScene >= next.length) setActiveScene(Math.max(0, next.length - 1));
  };

  const totalDuration = scenes.reduce((a, s) => a + s.duration, 0);

  return (
    <div style={{ background: bg.bg, color: bg.text, minHeight: "100vh", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", transition: "all 0.3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 3px; }
        .btn { cursor: pointer; border: none; outline: none; font-family: inherit; transition: all .2s; }
        .btn:active { transform: scale(.97); }
        .fade-in { animation: fadeIn .4s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.5; } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .scene-card:hover { transform: translateY(-2px); }
        .scene-card { transition: transform .2s, box-shadow .2s; }
        input[type=range] { -webkit-appearance:none; height:4px; border-radius:2px; outline:none; cursor:pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:#6366f1; cursor:pointer; }
        textarea { resize:none; font-family:inherit; }
      `}</style>

      {/* ── Header ── */}
      <header style={{ background: bg.surface, borderBottom: `1px solid ${bg.border}`, padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", borderRadius: 10, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={icons.video} size={16} className="" />
          </div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>
            VidCraft <span style={{ color: "#6366f1" }}>AI</span>
          </span>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: bg.card, borderRadius: 10, padding: 4 }}>
          {[["create", icons.wand, "Create"], ["editor", icons.film, "Editor"], ["export", icons.download, "Export"]].map(([id, ic, label]) => (
            <button key={id} className="btn" onClick={() => setTab(id)}
              style={{ padding: "6px 16px", borderRadius: 7, fontSize: 13, fontWeight: 500, background: tab === id ? bg.accent : "transparent", color: tab === id ? "#fff" : bg.sub, display: "flex", alignItems: "center", gap: 6 }}>
              <Icon d={ic} size={14} /> {label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {scenes.length > 0 && (
            <span style={{ fontSize: 12, color: bg.sub, background: bg.card, padding: "4px 10px", borderRadius: 20 }}>
              {scenes.length} scenes · {totalDuration}s
            </span>
          )}
          <button className="btn" onClick={() => setDark(!dark)}
            style={{ background: bg.card, border: `1px solid ${bg.border}`, borderRadius: 8, padding: "6px 10px", color: bg.text, display: "flex", alignItems: "center" }}>
            <Icon d={dark ? icons.sun : icons.moon} size={16} />
          </button>
        </div>
      </header>

      {/* ── Create Tab ── */}
      {tab === "create" && (
        <div className="fade-in" style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#6366f120,#a855f720)", border: "1px solid #6366f140", borderRadius: 20, padding: "6px 16px", marginBottom: 16 }}>
              <Icon d={icons.sparkle} size={14} style={{ color: "#a855f7" }} />
              <span style={{ fontSize: 12, color: "#a855f7", fontWeight: 600 }}>AI-Powered Video Generation</span>
            </div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.15, letterSpacing: -1, marginBottom: 12 }}>
              Turn Text into<br /><span style={{ background: "linear-gradient(90deg,#6366f1,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Stunning Videos</span>
            </h1>
            <p style={{ color: bg.sub, fontSize: 16 }}>Write your script, choose your style, and let AI do the rest.</p>
          </div>

          {/* Template picker */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {TEMPLATES.map(t => (
              <button key={t.id} className="btn" onClick={() => setSelectedTemplate(t)}
                style={{ padding: "8px 18px", borderRadius: 10, border: `2px solid ${selectedTemplate.id === t.id ? t.color : bg.border}`, background: selectedTemplate.id === t.id ? t.color + "20" : bg.surface, color: bg.text, fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>{t.icon}</span> {t.name} <span style={{ color: bg.sub, fontSize: 11 }}>{t.ratio}</span>
              </button>
            ))}
          </div>

          {/* Script input */}
          <div style={{ background: bg.surface, border: `1px solid ${bg.border}`, borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${bg.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon d={icons.type} size={14} /> Script Editor
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" onClick={() => fileRef.current?.click()}
                  style={{ fontSize: 12, color: bg.sub, background: bg.card, border: `1px solid ${bg.border}`, borderRadius: 7, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon d={icons.upload} size={12} /> Upload .txt
                </button>
                <input ref={fileRef} type="file" accept=".txt" style={{ display: "none" }} onChange={handleFileUpload} />
                <button className="btn" onClick={handleAiSuggest} disabled={loadingSuggestion || !script.trim()}
                  style={{ fontSize: 12, color: "#a855f7", background: "#a855f710", border: "1px solid #a855f730", borderRadius: 7, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5, opacity: !script.trim() ? 0.5 : 1 }}>
                  {loadingSuggestion ? <span className="spin" style={{ width: 12, height: 12, border: "2px solid #a855f7", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block" }} /> : <Icon d={icons.sparkle} size={12} />}
                  {loadingSuggestion ? "Improving…" : "AI Improve"}
                </button>
              </div>
            </div>
            <textarea value={script} onChange={e => setScript(e.target.value)}
              placeholder={"Write your video script here…\n\nSeparate scenes with blank lines.\n\nExample:\nWelcome to our product showcase. Today we'll explore features that will transform your workflow.\n\nFirst, let's look at the dashboard. It provides a real-time overview of all your key metrics.\n\nOur AI engine processes data in milliseconds, giving you insights before competitors even see the problem."}
              style={{ width: "100%", minHeight: 240, background: "transparent", border: "none", padding: "18px", color: bg.text, fontSize: 15, lineHeight: 1.7, outline: "none" }} />
            <div style={{ padding: "10px 18px", borderTop: `1px solid ${bg.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: bg.sub }}>{script.trim().split(/\s+/).filter(Boolean).length} words · {script.split(/\n\n+/).filter(p => p.trim().length > 10).length} scenes</span>
              <span style={{ fontSize: 12, color: bg.sub }}>Each paragraph = one scene</span>
            </div>
          </div>

          {/* AI Suggestion */}
          {aiSuggestion && (
            <div className="fade-in" style={{ background: "#a855f710", border: "1px solid #a855f730", borderRadius: 12, padding: 18, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#a855f7", display: "flex", alignItems: "center", gap: 6 }}><Icon d={icons.sparkle} size={14} /> AI Improved Script</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn" onClick={() => { setScript(aiSuggestion); setAiSuggestion(""); }}
                    style={{ fontSize: 12, color: "#fff", background: "#a855f7", borderRadius: 7, padding: "4px 12px" }}>Use This</button>
                  <button className="btn" onClick={() => setAiSuggestion("")}
                    style={{ fontSize: 12, color: bg.sub, background: bg.card, border: `1px solid ${bg.border}`, borderRadius: 7, padding: "4px 10px" }}>Dismiss</button>
                </div>
              </div>
              <p style={{ fontSize: 14, color: bg.sub, lineHeight: 1.6, maxHeight: 120, overflow: "auto" }}>{aiSuggestion}</p>
            </div>
          )}

          {/* Voice & settings row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div style={{ background: bg.surface, border: `1px solid ${bg.border}`, borderRadius: 12, padding: 16 }}>
              <p style={{ fontSize: 12, color: bg.sub, marginBottom: 10, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><Icon d={icons.mic} size={12} /> VOICE</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {VOICES.map(v => (
                  <button key={v.id} className="btn" onClick={() => setSelectedVoice(v)}
                    style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${selectedVoice.id === v.id ? bg.accent : bg.border}`, background: selectedVoice.id === v.id ? bg.accent + "20" : "transparent", color: bg.text, fontSize: 13, textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span><b>{v.name}</b> · {v.gender}</span>
                    <span style={{ fontSize: 11, color: bg.sub }}>{v.style}</span>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: bg.surface, border: `1px solid ${bg.border}`, borderRadius: 12, padding: 16 }}>
              <p style={{ fontSize: 12, color: bg.sub, marginBottom: 10, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><Icon d={icons.music} size={12} /> BACKGROUND MUSIC</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {MUSIC_TRACKS.map(t => (
                  <button key={t.id} className="btn" onClick={() => setSelectedMusic(selectedMusic?.id === t.id ? null : t)}
                    style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${selectedMusic?.id === t.id ? bg.accent : bg.border}`, background: selectedMusic?.id === t.id ? bg.accent + "20" : "transparent", color: bg.text, fontSize: 13, textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{t.name}</span>
                    <span style={{ fontSize: 11, color: bg.sub }}>{t.genre} · {t.bpm}bpm</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate button */}
          {generating ? (
            <div style={{ background: bg.surface, border: `1px solid ${bg.border}`, borderRadius: 16, padding: 30, textAlign: "center" }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, border: "3px solid #6366f130", borderTopColor: "#6366f1", borderRadius: "50%", margin: "0 auto 12px", animation: "spin 1s linear infinite" }} />
                <p style={{ fontWeight: 600, marginBottom: 4 }}>{genStep}</p>
                <p style={{ fontSize: 13, color: bg.sub }}>{genProgress}% complete</p>
              </div>
              <div style={{ background: bg.card, borderRadius: 99, height: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "linear-gradient(90deg,#6366f1,#a855f7)", width: `${genProgress}%`, borderRadius: 99, transition: "width .4s ease" }} />
              </div>
            </div>
          ) : (
            <button className="btn" onClick={handleGenerate} disabled={!script.trim()}
              style={{ width: "100%", padding: "16px", background: script.trim() ? "linear-gradient(135deg,#6366f1,#a855f7)" : bg.card, color: "#fff", borderRadius: 14, fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: !script.trim() ? 0.6 : 1, cursor: !script.trim() ? "not-allowed" : "pointer" }}>
              <Icon d={icons.zap} size={20} /> Generate Video with AI
            </button>
          )}
        </div>
      )}

      {/* ── Editor Tab ── */}
      {tab === "editor" && (
        <div className="fade-in" style={{ display: "flex", height: "calc(100vh - 60px)" }}>

          {/* Scenes sidebar */}
          <aside style={{ width: 220, background: bg.surface, borderRight: `1px solid ${bg.border}`, overflowY: "auto", flexShrink: 0 }}>
            <div style={{ padding: "12px", borderBottom: `1px solid ${bg.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: bg.sub }}>SCENES ({scenes.length})</span>
              <button className="btn" onClick={() => setScenes(prev => [...prev, { id: Date.now(), text: "New scene text…", title: `Scene ${prev.length + 1}`, gradient: SCENE_GRADIENTS[prev.length % SCENE_GRADIENTS.length], duration: 5, transition: "Fade", overlay: "", duration: 5 }])}
                style={{ background: bg.accent, color: "#fff", border: "none", borderRadius: 6, padding: "3px 8px", fontSize: 12 }}>
                <Icon d={icons.plus} size={12} />
              </button>
            </div>
            {scenes.length === 0 ? (
              <div style={{ padding: 20, textAlign: "center", color: bg.sub, fontSize: 13 }}>
                <Icon d={icons.film} size={32} /><br />No scenes yet.<br />Generate a video first.
              </div>
            ) : scenes.map((scene, i) => (
              <div key={scene.id} className="scene-card" onClick={() => setActiveScene(i)}
                style={{ margin: "8px 8px 0", borderRadius: 10, overflow: "hidden", cursor: "pointer", border: `2px solid ${activeScene === i ? bg.accent : "transparent"}` }}>
                <div style={{ height: 80, background: scene.gradient, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <span style={{ color: "#fff", fontSize: 22, opacity: .4 }}>🎬</span>
                  <span style={{ position: "absolute", top: 4, left: 6, fontSize: 10, color: "#fff", background: "#0006", borderRadius: 4, padding: "1px 5px" }}>{scene.title}</span>
                  <span style={{ position: "absolute", bottom: 4, right: 6, fontSize: 10, color: "#fff", background: "#0006", borderRadius: 4, padding: "1px 5px" }}>{scene.duration}s</span>
                  <button className="btn" onClick={e => { e.stopPropagation(); deleteScene(scene.id); }}
                    style={{ position: "absolute", top: 4, right: 4, background: "#e11d4890", border: "none", color: "#fff", borderRadius: 4, padding: "1px 5px", fontSize: 10, opacity: 0, transition: ".2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}>✕</button>
                </div>
                <div style={{ background: bg.card, padding: "6px 8px" }}>
                  <p style={{ fontSize: 10, color: bg.sub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{scene.text.slice(0, 50)}</p>
                </div>
              </div>
            ))}
            <div style={{ height: 16 }} />
          </aside>

          {/* Main preview area */}
          <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Preview */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: bg.bg, padding: 24, overflow: "hidden" }}>
              {scenes.length === 0 ? (
                <div style={{ textAlign: "center", color: bg.sub }}>
                  <Icon d={icons.film} size={48} /><br /><br />
                  <p style={{ fontSize: 16, fontWeight: 500 }}>No scenes to preview</p>
                  <p style={{ fontSize: 13, marginTop: 6 }}>Go to Create tab to generate your video</p>
                </div>
              ) : (
                <div style={{ position: "relative", maxWidth: 640, width: "100%", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px #0008" }}>
                  {scenes[activeScene] && (
                    <>
                      <div style={{ position: "absolute", inset: 0, background: scenes[activeScene].gradient }} />
                      {/* Overlay text */}
                      {scenes[activeScene].overlay && (
                        <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, textAlign: "center" }}>
                          <span style={{ background: "#000a", color: "#fff", padding: "6px 16px", borderRadius: 6, fontSize: 18, fontWeight: 600 }}>{scenes[activeScene].overlay}</span>
                        </div>
                      )}
                      {/* Subtitles */}
                      <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, textAlign: "center" }}>
                        <span style={{ background: "#000c", color: "#fff", padding: "4px 12px", borderRadius: 4, fontSize: 14, lineHeight: 1.5, display: "inline-block", maxWidth: "80%" }}>
                          {scenes[activeScene].text.slice(0, 80)}{scenes[activeScene].text.length > 80 ? "…" : ""}
                        </span>
                      </div>
                      {/* Scene indicator */}
                      <div style={{ position: "absolute", top: 12, left: 12, background: "#0008", color: "#fff", padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>
                        {scenes[activeScene].title} · {scenes[activeScene].duration}s
                      </div>
                      {/* Play overlay */}
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <button className="btn" onClick={() => setPlaying(!playing)}
                          style={{ background: "#fff2", backdropFilter: "blur(8px)", border: "2px solid #fff4", borderRadius: "50%", width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                          <Icon d={playing ? icons.pause : icons.play} size={24} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Timeline */}
            {scenes.length > 0 && (
              <div style={{ height: 80, background: bg.surface, borderTop: `1px solid ${bg.border}`, padding: "12px 16px", overflowX: "auto" }}>
                <div style={{ display: "flex", gap: 4, alignItems: "stretch", height: "100%" }}>
                  {scenes.map((scene, i) => (
                    <div key={scene.id} onClick={() => setActiveScene(i)}
                      style={{ flexShrink: 0, width: scene.duration * 20, minWidth: 60, borderRadius: 6, overflow: "hidden", cursor: "pointer", border: `2px solid ${activeScene === i ? "#6366f1" : "transparent"}`, background: scene.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 500, position: "relative" }}>
                      <span style={{ background: "#0006", padding: "1px 5px", borderRadius: 3 }}>{scene.duration}s</span>
                      {i < scenes.length - 1 && (
                        <div style={{ position: "absolute", right: -6, top: "50%", transform: "translateY(-50%)", background: bg.surface, color: bg.sub, fontSize: 10, zIndex: 2, padding: "1px 2px", borderRadius: 3 }}>
                          {scene.transition?.slice(0, 1)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Right panel */}
          {scenes.length > 0 && scenes[activeScene] && (
            <aside style={{ width: 280, background: bg.surface, borderLeft: `1px solid ${bg.border}`, overflowY: "auto", padding: "16px" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: bg.sub, marginBottom: 12 }}>SCENE SETTINGS</p>

              {/* Scene text */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: bg.sub, display: "block", marginBottom: 6 }}>Script Text</label>
                <textarea value={scenes[activeScene].text} onChange={e => updateScene(scenes[activeScene].id, "text", e.target.value)}
                  style={{ width: "100%", background: bg.card, border: `1px solid ${bg.border}`, borderRadius: 8, padding: 10, color: bg.text, fontSize: 13, lineHeight: 1.5, minHeight: 80, outline: "none" }} />
              </div>

              {/* Duration */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: bg.sub, display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  Duration <b style={{ color: bg.text }}>{scenes[activeScene].duration}s</b>
                </label>
                <input type="range" min={2} max={30} value={scenes[activeScene].duration}
                  onChange={e => updateScene(scenes[activeScene].id, "duration", +e.target.value)}
                  style={{ width: "100%", accentColor: bg.accent }} />
              </div>

              {/* Transition */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: bg.sub, display: "block", marginBottom: 6 }}>Transition</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {TRANSITIONS.map(t => (
                    <button key={t} className="btn" onClick={() => updateScene(scenes[activeScene].id, "transition", t)}
                      style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, border: `1px solid ${scenes[activeScene].transition === t ? bg.accent : bg.border}`, background: scenes[activeScene].transition === t ? bg.accent + "20" : "transparent", color: bg.text }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Overlay text */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: bg.sub, display: "block", marginBottom: 6 }}>Overlay Text</label>
                <input value={scenes[activeScene].overlay || ""} onChange={e => updateScene(scenes[activeScene].id, "overlay", e.target.value)}
                  placeholder="Add title overlay…"
                  style={{ width: "100%", background: bg.card, border: `1px solid ${bg.border}`, borderRadius: 8, padding: "8px 10px", color: bg.text, fontSize: 13, outline: "none" }} />
              </div>

              {/* BG gradient picker */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: bg.sub, display: "block", marginBottom: 6 }}>Background</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {SCENE_GRADIENTS.map((g, i) => (
                    <button key={i} className="btn" onClick={() => updateScene(scenes[activeScene].id, "gradient", g)}
                      style={{ width: 30, height: 30, borderRadius: 6, background: g, border: scenes[activeScene].gradient === g ? "2px solid #fff" : "2px solid transparent" }} />
                  ))}
                </div>
              </div>

              <hr style={{ border: `none`, borderTop: `1px solid ${bg.border}`, margin: "16px 0" }} />

              {/* Voice controls */}
              <p style={{ fontSize: 12, fontWeight: 700, color: bg.sub, marginBottom: 12 }}>VOICE & AUDIO</p>
              {[["Voice Volume", voiceVolume, setVoiceVolume], ["Music Volume", musicVolume, setMusicVolume]].map(([label, val, set]) => (
                <div key={label} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: bg.sub, display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    {label} <b style={{ color: bg.text }}>{val}%</b>
                  </label>
                  <input type="range" min={0} max={100} value={val} onChange={e => set(+e.target.value)}
                    style={{ width: "100%", accentColor: bg.accent }} />
                </div>
              ))}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: bg.sub, display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  Voice Speed <b style={{ color: bg.text }}>{voiceSpeed.toFixed(1)}x</b>
                </label>
                <input type="range" min={0.5} max={2} step={0.1} value={voiceSpeed} onChange={e => setVoiceSpeed(+e.target.value)}
                  style={{ width: "100%", accentColor: bg.accent }} />
              </div>

              <div style={{ marginTop: 8 }}>
                <p style={{ fontSize: 12, color: bg.sub, marginBottom: 6 }}>Voice: <b style={{ color: bg.text }}>{selectedVoice.name}</b> · {selectedVoice.style}</p>
                {selectedMusic && <p style={{ fontSize: 12, color: bg.sub }}>Music: <b style={{ color: bg.text }}>{selectedMusic.name}</b></p>}
              </div>
            </aside>
          )}
        </div>
      )}

      {/* ── Export Tab ── */}
      {tab === "export" && (
        <div className="fade-in" style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>Export Video</h2>
          <p style={{ color: bg.sub, marginBottom: 32 }}>Render and download your project</p>

          {scenes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: bg.surface, border: `1px solid ${bg.border}`, borderRadius: 16, color: bg.sub }}>
              <Icon d={icons.film} size={48} /><br /><br />
              <p style={{ fontWeight: 500 }}>No video to export</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>Create and edit your video first</p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div style={{ background: bg.surface, border: `1px solid ${bg.border}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: bg.sub, marginBottom: 16 }}>PROJECT SUMMARY</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  {[["Scenes", scenes.length], ["Duration", `${totalDuration}s`], ["Template", selectedTemplate.name], ["Voice", selectedVoice.name], ["Music", selectedMusic?.name || "None"], ["Transitions", selectedTransition]].map(([k, v]) => (
                    <div key={k} style={{ background: bg.card, borderRadius: 10, padding: 12 }}>
                      <p style={{ fontSize: 11, color: bg.sub }}>{k}</p>
                      <p style={{ fontWeight: 600, marginTop: 2 }}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div style={{ background: bg.surface, border: `1px solid ${bg.border}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: bg.sub, marginBottom: 16 }}>EXPORT QUALITY</p>
                <div style={{ display: "flex", gap: 10 }}>
                  {["480p", "720p", "1080p"].map(q => (
                    <button key={q} className="btn" onClick={() => setExportQuality(q)}
                      style={{ flex: 1, padding: "12px", borderRadius: 10, border: `2px solid ${exportQuality === q ? bg.accent : bg.border}`, background: exportQuality === q ? bg.accent + "20" : bg.card, color: bg.text, fontWeight: 600 }}>
                      {q}
                      <p style={{ fontSize: 11, color: bg.sub, fontWeight: 400, marginTop: 2 }}>
                        {q === "480p" ? "~20MB" : q === "720p" ? "~50MB" : "~120MB"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Export button */}
              {exporting ? (
                <div style={{ background: bg.surface, border: `1px solid ${bg.border}`, borderRadius: 16, padding: 30, textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, border: "3px solid #6366f130", borderTopColor: "#6366f1", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
                  <p style={{ fontWeight: 600 }}>Rendering video…</p>
                  <p style={{ fontSize: 13, color: bg.sub, marginTop: 4 }}>This may take a moment</p>
                </div>
              ) : exportDone ? (
                <div className="fade-in" style={{ background: "#10b98120", border: "1px solid #10b98140", borderRadius: 16, padding: 30, textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                  <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Video Ready!</p>
                  <p style={{ color: bg.sub, fontSize: 14, marginBottom: 20 }}>{exportQuality} · {totalDuration}s · {selectedTemplate.name}</p>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                    <button className="btn" onClick={() => setExportDone(false)}
                      style={{ padding: "10px 24px", background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "#fff", borderRadius: 10, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon d={icons.download} size={16} /> Download MP4
                    </button>
                    <button className="btn" style={{ padding: "10px 24px", background: bg.card, border: `1px solid ${bg.border}`, color: bg.text, borderRadius: 10, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon d={icons.share} size={16} /> Share
                    </button>
                  </div>
                </div>
              ) : (
                <button className="btn" onClick={handleExport}
                  style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "#fff", borderRadius: 14, fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <Icon d={icons.zap} size={20} /> Render & Export ({exportQuality})
                </button>
              )}

              {/* Social share */}
              {!exporting && !exportDone && (
                <div style={{ marginTop: 16, background: bg.surface, border: `1px solid ${bg.border}`, borderRadius: 12, padding: 16 }}>
                  <p style={{ fontSize: 12, color: bg.sub, marginBottom: 12, fontWeight: 600 }}>SHARE DIRECTLY</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[["YouTube", "#ff0000"], ["Instagram", "#e91e8c"], ["TikTok", "#010101"], ["LinkedIn", "#0077b5"], ["Twitter/X", "#1da1f2"]].map(([name, color]) => (
                      <button key={name} className="btn"
                        style={{ flex: 1, padding: "8px 4px", borderRadius: 8, background: color + "20", border: `1px solid ${color}40`, color: bg.text, fontSize: 11, fontWeight: 500 }}>
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
