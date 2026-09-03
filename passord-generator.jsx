import { useState, useCallback, useMemo, useRef } from "react";

/* ---------------- Ordlister ---------------- */
const WORD_CATEGORIES = {
  natur: {
    label: "Natur",
    words: ["Fjell","Skog","Elv","Hav","Sol","Måne","Stjerne","Himmel","Sky","Regn","Snø","Is","Frost","Vind","Storm","Torden","Lyn","Regnbue","Dugg","Skodde","Tåke","Bre","Fjord","Vidde","Dal","Ås","Berg","Klippe","Foss","Bekk","Innsjø","Tjern","Kilde","Kyst","Strand","Sand","Stein","Grus","Fjære","Bukt","Holme","Øy","Skjær","Odde","Nes","Vik","Tind","Skar","Morene","Myr","Mose","Lyng","Bjørk","Furu","Gran","Eik","Bøk","Selje","Rogn","Osp","Einer","Vier","Lund","Eng","Slette","Åker","Mark","Bølge","Tidevann","Strøm","Virvel","Nordlys","Midnattssol","Polarnatt","Vinter","Vår","Sommer","Høst","Lauvfall","Solnedgang","Soloppgang","Skumring","Demring","Måneskinn","Melkeveien","Komet","Meteor","Vulkan","Geysir","Grotte","Hule","Canyon","Ørken","Savanne","Jungel","Prærie","Tundra","Isbre","Snøfonn","Rasmark","Fjellrygg"]
  },
  dyr: {
    label: "Dyr",
    words: ["Ulv","Rev","Bjørn","Gaupe","Jerv","Elg","Hjort","Rådyr","Rein","Villsvin","Hare","Ekorn","Grevling","Oter","Mår","Rotte","Mus","Pinnsvin","Flaggermus","Hest","Ku","Sau","Geit","Gris","Katt","Hund","Kanin","Marsvin","Hamster","Falk","Ørn","Ugle","Kråke","Ravn","Måke","Svale","Spurv","Trost","Skjære","Stær","Gås","And","Svane","Tjeld","Lom","Skarv","Rype","Orrfugl","Storfugl","Tiur","Hane","Høne","Kalkun","Torsk","Laks","Ørret","Røye","Sild","Makrell","Krabbe","Hummer","Reke","Blåskjell","Østers","Kveite","Uer","Lange","Sei","Brosme","Hval","Sel","Nise","Spekkhogger","Delfin","Hai","Rokke","Tiger","Løve","Panter","Elefant","Sjiraff","Sebra","Flodhest","Neshorn","Ape","Papegøye","Struts","Pingvin","Kenguru","Koala","Krokodille","Slange","Øgle","Skilpadde","Frosk","Padde","Salamander","Edderkopp","Sommerfugl","Bille","Maur","Bie","Humle","Veps","Flue","Mygg"]
  },
  mat: {
    label: "Mat",
    words: ["Brød","Loff","Rundstykke","Lefse","Lompe","Smør","Ost","Brunost","Gulost","Melk","Rømme","Fløte","Yoghurt","Egg","Bacon","Pølse","Kjøttdeig","Karbonade","Kjøttkake","Fårikål","Pinnekjøtt","Lutefisk","Rakfisk","Gravlaks","Fiskekake","Fiskepudding","Kaviar","Poteter","Gulrot","Kålrot","Neper","Løk","Hvitløk","Purre","Kål","Blomkål","Brokkoli","Erter","Bønner","Mais","Ris","Pasta","Makaroni","Havregryn","Müsli","Knekkebrød","Kjeks","Kake","Bolle","Vaffel","Pannekake","Krem","Sjokolade","Karamell","Marsipan","Nøtter","Mandler","Rosiner","Eple","Pære","Plomme","Kirsebær","Bringebær","Jordbær","Blåbær","Tyttebær","Multer","Rips","Solbær","Banan","Appelsin","Sitron","Lime","Ananas","Mango","Melon","Drue","Fiken","Kaffe","Te","Kakao","Saft","Brus","Juice","Vin","Øl","Sider","Honning","Sukker","Salt","Pepper","Kanel","Kardemomme","Vaniljesukker","Safran","Muskat","Ingefær","Karve","Dill","Persille","Basilikum","Timian"]
  },
  farger: {
    label: "Farger",
    words: ["Rød","Blå","Grønn","Gul","Oransje","Rosa","Lilla","Fiolett","Turkis","Cyan","Magenta","Brun","Beige","Grå","Svart","Hvit","Sølv","Gull","Bronse","Kobber","Marineblå","Himmelblå","Havblå","Lyseblå","Mørkeblå","Skarlagen","Karmosin","Burgunder","Lyserosa","Oliven","Smaragd","Jade","Safirblå","Rubinrød","Ravgul","Kremhvit","Elfenben","Perlemor"]
  },
  objekter: {
    label: "Objekter",
    words: ["Bok","Penn","Blyant","Viskelær","Linjal","Passer","Saks","Lim","Tape","Papir","Konvolutt","Stempel","Kalender","Notatbok","Skrivebord","Stol","Sofa","Bord","Hylle","Skap","Seng","Pute","Teppe","Gardiner","Lampe","Lysestake","Speil","Bilderamme","Vase","Krukke","Skål","Tallerken","Kopp","Glass","Kanne","Gryte","Panne","Kjele","Ovn","Komfyr","Kjøleskap","Fryser","Vaskemaskin","Støvsuger","Strykejern","Klokke","Kalkulator","Telefon","Datamaskin","Skjerm","Tastatur","Skriver","Kamera","Radio","Høyttaler","Hodetelefoner","Lommelykt","Batteri","Nøkkel","Lås","Dør","Vindu","Trapp","Tak","Gulv","Vegg","Pipe","Bro","Vei","Sti","Gjerde","Port","Hage","Balkong","Terrasse","Garasje","Skur","Låve","Fjøs","Brønn","Sykkel","Bil","Motorsykkel","Buss","Tog","Fly","Skip","Båt","Kano","Kajakk","Ski","Skøyter","Slede","Ball","Racket","Nett","Vekt","Termometer","Kikkert","Kompass","Lykt","Ryggsekk"]
  },
  adjektiv: {
    label: "Adjektiv",
    words: ["Stor","Liten","Rask","Sakte","Sterk","Svak","Varm","Kald","Lys","Mørk","Glad","Trist","Snill","Sint","Klok","Modig","Rolig","Vill","Tam","Myk","Hard","Tung","Lett","Høy","Lav","Bred","Smal","Dyp","Grunn","Tykk","Tynn","Ny","Gammel","Ung","Frisk","Rik","Vakker","Ren","Tørr","Våt","Fri","Trygg","Stille","Skarp","Sløv","Hurtig","Treg","Klar","Uklar","Sunn","Enkel","Vanskelig","Morsom","Kjedelig"]
  }
};

const SEPARATORS = [
  { id: "none", label: "Ingen", value: "" },
  { id: "dash", label: "-", value: "-" },
  { id: "dot", label: ".", value: "." },
  { id: "underscore", label: "_", value: "_" },
];

const SPECIAL_CHARS = ["!", "?", "#", "%", "&", "*", "@", "+", "-", "_"];
const WORD_COLORS = ["#60a5fa", "#a78bfa", "#f472b6", "#2dd4bf", "#fbbf24"];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randDigit() { return Math.floor(Math.random() * 10); }

function applyCase(word, capitalize) {
  return capitalize ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase();
}

function pickWords(pool, count) {
  const chosen = [];
  let attempts = 0;
  while (chosen.length < count && attempts < count * 30) {
    const w = rand(pool);
    if (!chosen.includes(w) || pool.length < count) chosen.push(w);
    attempts++;
  }
  return chosen;
}

function buildPassword(settings) {
  const { numWords, numDigits, numSpecial, capitalize, separator, categories, specialChars } = settings;
  let pool = [];
  categories.forEach((cat) => { pool = pool.concat(WORD_CATEGORIES[cat].words); });
  if (pool.length === 0) pool = WORD_CATEGORIES.natur.words;

  const words = pickWords(pool, numWords).map((w) => applyCase(w, capitalize));
  const sepValue = SEPARATORS.find((s) => s.id === separator).value;

  const parts = [];
  words.forEach((w, i) => {
    if (i > 0 && sepValue) parts.push({ text: sepValue, color: "rgba(255,255,255,0.3)" });
    parts.push({ text: w, color: WORD_COLORS[i % WORD_COLORS.length] });
  });

  if (numDigits > 0) {
    const digits = Array.from({ length: numDigits }, randDigit).join("");
    parts.push({ text: digits, color: "#34d399" });
  }

  if (numSpecial > 0 && specialChars.length > 0) {
    const special = Array.from({ length: numSpecial }, () => rand(specialChars)).join("");
    parts.push({ text: special, color: "#fbbf24" });
  }

  return { full: parts.map((p) => p.text).join(""), parts };
}

function getStrength(pw) {
  const len = pw.length;
  if (len >= 16) return { label: "Sterk", color: "#34d399", width: "100%" };
  if (len >= 12) return { label: "God", color: "#60a5fa", width: "75%" };
  if (len >= 8) return { label: "OK", color: "#fbbf24", width: "50%" };
  return { label: "Svak", color: "#f87171", width: "25%" };
}

function CopyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  );
}
function RefreshIcon({ size = 22, strokeWidth = 2.2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function GearIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#shieldGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa"/>
          <stop offset="100%" stopColor="#a78bfa"/>
        </linearGradient>
      </defs>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4" stroke="url(#shieldGrad)" strokeWidth="2"/>
    </svg>
  );
}

function Chip({ selected, onClick, children, mono }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "8px 14px",
        borderRadius: "100px",
        background: selected ? "rgba(96,165,250,0.12)" : "rgba(255,255,255,0.04)",
        border: selected ? "1px solid rgba(96,165,250,0.4)" : "1px solid rgba(255,255,255,0.1)",
        color: selected ? "#93c5fd" : "rgba(255,255,255,0.5)",
        fontFamily: mono ? "'JetBrains Mono', monospace" : "'Outfit', sans-serif",
        fontSize: "13px",
        fontWeight: 500,
        cursor: "pointer",
        userSelect: "none",
        transition: "all 0.2s",
        minWidth: mono ? "42px" : undefined,
        textAlign: mono ? "center" : undefined,
      }}
    >
      {children}
    </div>
  );
}

export default function PassordGenerator() {
  const [settings, setSettings] = useState({
    numPasswords: 10,
    numWords: 2,
    numDigits: 2,
    numSpecial: 1,
    capitalize: true,
    separator: "none",
    categories: ["natur", "dyr"],
    specialChars: ["!"],
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [passwords, setPasswords] = useState(() =>
    Array.from({ length: 10 }, () => buildPassword({ ...settings }))
  );
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]);
  const timeoutRef = useRef(null);

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggleCategory = useCallback((key) => {
    setSettings((prev) => {
      const has = prev.categories.includes(key);
      if (has && prev.categories.length === 1) return prev;
      const categories = has ? prev.categories.filter((c) => c !== key) : [...prev.categories, key];
      return { ...prev, categories };
    });
  }, []);

  const toggleSpecialChar = useCallback((ch) => {
    setSettings((prev) => {
      const has = prev.specialChars.includes(ch);
      if (has && prev.specialChars.length === 1) return prev;
      const specialChars = has ? prev.specialChars.filter((c) => c !== ch) : [...prev.specialChars, ch];
      return { ...prev, specialChars };
    });
  }, []);

  const regenerateAll = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const newPws = Array.from({ length: settings.numPasswords }, () => buildPassword(settings));
      setPasswords(newPws);
      setIsGenerating(false);
      setCopiedIdx(null);
    }, 220);
  }, [settings]);

  const regenerateOne = useCallback((idx) => {
    setPasswords((prev) => {
      const next = [...prev];
      next[idx] = buildPassword(settings);
      return next;
    });
  }, [settings]);

  const copyToClipboard = useCallback((pw, idx) => {
    navigator.clipboard.writeText(pw).then(() => {
      setCopiedIdx(idx);
      setHistory((h) => [pw, ...h.filter((p) => p !== pw)].slice(0, 12));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopiedIdx(null), 2000);
    });
  }, []);

  const copyAll = useCallback(() => {
    navigator.clipboard.writeText(passwords.map((p) => p.full).join("\n"));
  }, [passwords]);

  const formatBadge = useMemo(() => {
    const items = [];
    for (let i = 0; i < settings.numWords; i++) {
      items.push({ text: "Ord", color: WORD_COLORS[i % WORD_COLORS.length] });
    }
    if (settings.numDigits > 0) items.push({ text: "0".repeat(settings.numDigits), color: "#34d399" });
    if (settings.numSpecial > 0) items.push({ text: "!".repeat(settings.numSpecial), color: "#fbbf24" });
    return items;
  }, [settings.numWords, settings.numDigits, settings.numSpecial]);

  const settingLabel = {
    color: "rgba(255,255,255,0.7)",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.02em",
    marginBottom: "10px",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
  };
  const settingValue = { color: "#60a5fa", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: "13px" };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29 0%, #1a1a3e 35%, #24243e 65%, #0f0c29 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "40px 16px 60px",
      fontFamily: "'Outfit', 'Segoe UI', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Ambient orbs */}
      <div style={{ position: "fixed", top: "-20%", left: "-10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-20%", right: "-10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(167,139,250,0.10) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "40%", right: "20%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(50px)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "28px", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: "12px" }}><ShieldIcon /></div>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800,
          background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #34d399 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          margin: "0 0 8px", letterSpacing: "-0.03em", lineHeight: 1.1,
        }}>PassordMaskin</h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "15px", fontWeight: 300, margin: 0, letterSpacing: "0.02em" }}>
          Sterke, minnevennlige passord — nå med innstillinger
        </p>
      </div>

      {/* Top bar: format badge + settings toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "20px", position: "relative", zIndex: 1, flexWrap: "wrap" }}>
        <div style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "100px", padding: "8px 18px", display: "flex", alignItems: "center", gap: "8px",
          backdropFilter: "blur(20px)", flexWrap: "wrap", justifyContent: "center",
        }}>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", fontWeight: 400 }}>Format:</span>
          {formatBadge.map((item, i) => (
            <code key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: item.color, fontWeight: 500 }}>{item.text}</code>
          ))}
        </div>
        <button
          onClick={() => setSettingsOpen((o) => !o)}
          style={{
            background: settingsOpen ? "rgba(96,165,250,0.08)" : "rgba(255,255,255,0.04)",
            border: settingsOpen ? "1px solid rgba(96,165,250,0.3)" : "1px solid rgba(255,255,255,0.08)",
            borderRadius: "100px", padding: "8px 18px",
            color: settingsOpen ? "#60a5fa" : "rgba(255,255,255,0.55)",
            fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 500,
            cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
            backdropFilter: "blur(20px)", transition: "all 0.2s",
          }}
        >
          <GearIcon /> Innstillinger
        </button>
      </div>

      {/* Settings panel */}
      {settingsOpen && (
        <div style={{
          width: "100%", maxWidth: "520px",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px", padding: "22px 22px 6px", marginBottom: "20px",
          backdropFilter: "blur(30px)", position: "relative", zIndex: 1,
        }}>
          {/* Antall passord */}
          <div style={{ marginBottom: "20px" }}>
            <div style={settingLabel}>Antall passord <span style={settingValue}>{settings.numPasswords}</span></div>
            <input type="range" min={1} max={50} value={settings.numPasswords}
              onChange={(e) => updateSettings({ numPasswords: parseInt(e.target.value, 10) })}
              style={{ width: "100%" }} />
          </div>

          {/* Antall ord */}
          <div style={{ marginBottom: "20px" }}>
            <div style={settingLabel}>Antall ord per passord <span style={settingValue}>{settings.numWords}</span></div>
            <input type="range" min={1} max={5} value={settings.numWords}
              onChange={(e) => updateSettings({ numWords: parseInt(e.target.value, 10) })}
              style={{ width: "100%" }} />
          </div>

          {/* Ordtyper */}
          <div style={{ marginBottom: "20px" }}>
            <div style={settingLabel}>Ordtyper</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {Object.entries(WORD_CATEGORIES).map(([key, cat]) => (
                <Chip key={key} selected={settings.categories.includes(key)} onClick={() => toggleCategory(key)}>
                  {cat.label} ({cat.words.length})
                </Chip>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", marginTop: "8px", lineHeight: 1.5 }}>
              Minst én ordtype må være valgt.
            </p>
          </div>

          {/* Skilletegn */}
          <div style={{ marginBottom: "20px" }}>
            <div style={settingLabel}>Skilletegn mellom ord</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {SEPARATORS.map((sep) => (
                <Chip key={sep.id} mono selected={settings.separator === sep.id} onClick={() => updateSettings({ separator: sep.id })}>
                  {sep.label}
                </Chip>
              ))}
            </div>
          </div>

          {/* Stor forbokstav */}
          <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ ...settingLabel, marginBottom: 0 }}>Stor forbokstav i hvert ord</div>
            <label style={{ position: "relative", width: "42px", height: "24px", flexShrink: 0, display: "inline-block" }}>
              <input type="checkbox" checked={settings.capitalize}
                onChange={(e) => updateSettings({ capitalize: e.target.checked })}
                style={{ opacity: 0, width: 0, height: 0 }} />
              <span onClick={() => updateSettings({ capitalize: !settings.capitalize })} style={{
                position: "absolute", inset: 0, borderRadius: "100px", cursor: "pointer",
                background: settings.capitalize ? "linear-gradient(135deg, #60a5fa, #a78bfa)" : "rgba(255,255,255,0.1)",
                transition: "0.2s",
              }}>
                <span style={{
                  position: "absolute", width: "18px", height: "18px", top: "3px",
                  left: settings.capitalize ? "21px" : "3px",
                  background: "#fff", borderRadius: "50%", transition: "0.2s",
                }} />
              </span>
            </label>
          </div>

          {/* Antall siffer */}
          <div style={{ marginBottom: "20px" }}>
            <div style={settingLabel}>Antall siffer <span style={settingValue}>{settings.numDigits}</span></div>
            <input type="range" min={0} max={6} value={settings.numDigits}
              onChange={(e) => updateSettings({ numDigits: parseInt(e.target.value, 10) })}
              style={{ width: "100%" }} />
          </div>

          {/* Spesialtegn */}
          <div style={{ marginBottom: "20px" }}>
            <div style={settingLabel}>Spesialtegn <span style={settingValue}>{settings.numSpecial}</span></div>
            <input type="range" min={0} max={4} value={settings.numSpecial}
              onChange={(e) => updateSettings({ numSpecial: parseInt(e.target.value, 10) })}
              style={{ width: "100%" }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
              {SPECIAL_CHARS.map((ch) => (
                <Chip key={ch} mono selected={settings.specialChars.includes(ch)} onClick={() => toggleSpecialChar(ch)}>
                  {ch}
                </Chip>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", marginTop: "8px", lineHeight: 1.5 }}>
              Velg hvilke tegn som kan brukes. Antall styrer hvor mange som legges til.
            </p>
          </div>
        </div>
      )}

      {/* Main glass card */}
      <div style={{
        width: "100%", maxWidth: "520px",
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px", padding: "8px", backdropFilter: "blur(40px)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxHeight: "560px", overflowY: "auto" }}>
          {passwords.map((pwObj, i) => {
            const pw = pwObj.full;
            const strength = getStrength(pw);
            const isCopied = copiedIdx === i;

            return (
              <div
                key={`${pw}-${i}`}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "14px 16px", borderRadius: "16px",
                  background: isCopied ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.02)",
                  border: isCopied ? "1px solid rgba(52,211,153,0.2)" : "1px solid transparent",
                  transition: "all 0.25s ease", cursor: "pointer",
                }}
                onClick={() => copyToClipboard(pw, i)}
              >
                <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "12px", fontWeight: 500, width: "22px", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>
                  {i + 1}
                </span>

                <div style={{
                  flex: 1, fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "clamp(14px, 3.2vw, 17px)", fontWeight: 500, letterSpacing: "0.01em",
                  opacity: isGenerating ? 0.3 : 1, transition: "opacity 0.2s",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {pwObj.parts.map((p, pi) => (
                    <span key={pi} style={{ color: p.color }}>{p.text}</span>
                  ))}
                </div>

                <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.06)", overflow: "hidden", flexShrink: 0 }}>
                  <div style={{ width: strength.width, height: "100%", borderRadius: "2px", background: strength.color, opacity: 0.7, transition: "width 0.3s ease" }} />
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); regenerateOne(i); }}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", padding: "4px", borderRadius: "8px", display: "flex", alignItems: "center", transition: "all 0.2s", flexShrink: 0 }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.2)"; e.currentTarget.style.background = "none"; }}
                  title="Generer nytt"
                >
                  <RefreshIcon size={14} strokeWidth={2.5} />
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); copyToClipboard(pw, i); }}
                  style={{ background: "none", border: "none", color: isCopied ? "#34d399" : "rgba(255,255,255,0.2)", cursor: "pointer", padding: "4px", borderRadius: "8px", display: "flex", alignItems: "center", transition: "all 0.2s", flexShrink: 0 }}
                  onMouseEnter={(e) => { if (!isCopied) { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; } }}
                  onMouseLeave={(e) => { if (!isCopied) { e.currentTarget.style.color = "rgba(255,255,255,0.2)"; e.currentTarget.style.background = "none"; } }}
                  title="Kopier"
                >
                  {isCopied ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={regenerateAll}
          style={{
            padding: "14px 36px", borderRadius: "16px", border: "1px solid rgba(96,165,250,0.2)",
            background: "rgba(96,165,250,0.08)", color: "#60a5fa", fontSize: "15px", fontWeight: 600,
            fontFamily: "'Outfit', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px",
            transition: "all 0.25s ease", backdropFilter: "blur(20px)", position: "relative", zIndex: 1,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(96,165,250,0.15)"; e.currentTarget.style.borderColor = "rgba(96,165,250,0.35)"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(96,165,250,0.15)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(96,165,250,0.08)"; e.currentTarget.style.borderColor = "rgba(96,165,250,0.2)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          <RefreshIcon /> Generer nye passord
        </button>
        <button
          onClick={copyAll}
          style={{
            padding: "14px 28px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.55)", fontSize: "15px", fontWeight: 600,
            fontFamily: "'Outfit', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px",
            transition: "all 0.25s ease", position: "relative", zIndex: 1,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
        >
          <CopyIcon /> Kopier alle
        </button>
      </div>

      {/* Tip */}
      <p style={{ marginTop: "22px", color: "rgba(255,255,255,0.2)", fontSize: "13px", fontWeight: 300, textAlign: "center", maxWidth: "420px", lineHeight: 1.6, position: "relative", zIndex: 1 }}>
        Klikk på et passord for å kopiere det. Åpne innstillinger for å styre antall ord, siffer, spesialtegn og ordtyper.
      </p>

      {/* History */}
      {history.length > 0 && (
        <div style={{ marginTop: "32px", width: "100%", maxWidth: "520px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>Nylig kopiert</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {history.map((h, i) => (
              <button
                key={`${h}-${i}`}
                onClick={() => navigator.clipboard.writeText(h)}
                style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "10px", padding: "6px 12px", color: "rgba(255,255,255,0.35)",
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
