import { useState, useCallback, useEffect, useRef } from "react";

const NORSKE_ORD = [
  "Glass","Eske","Bade","Boks","Fjell","Skog","Elv","Hav","Sol","Ild",
  "Storm","Regn","Furu","Gran","Ulv","Rev","Falk","Torsk","Laks","Krabbe",
  "Hval","Sel","Rein","Elg","Hest","Sau","Geit","Katt","Hund","Mus",
  "Penn","Stol","Bord","Lampe","Vindu","Tak","Gulv","Vegg","Trapp","Hytte",
  "Ski","Spark","Slede","Sykkel","Bil","Buss","Tog","Fly","Skip","Bro",
  "Vei","Sti","Berg","Topp","Dal","Bekk","Foss","Tjern","Bukt","Holme",
  "Strand","Sand","Stein","Mose","Lyng","Rose","Tulip","Korn","Rug","Havre",
  "Bygg","Hvete","Eple","Plomme","Ost","Melk","Kaffe","Kakao","Safran","Kanel",
  "Pepper","Salt","Sukker","Honning","Vaffel","Bolle","Kake","Lefse","Brunost","Vin",
  "Krone","Flagg","Troll","Nisse","Hulder","Draug","Fjord","Vidde","Bre","Morene",
  "Aurora","Nordlys","Midnatt","Sommer","Vinter","Frost","Hagl","Flamme","Gnist","Damp",
  "Aske","Kull","Jern","Kobber","Gull","Perle","Diamant","Safir","Rubin","Krystall",
  "Marmor","Granitt","Skifer","Tegl","Betong","Planke","Stav","Bolt","Spiker","Hammer",
  "Sag","Kniv","Plog","Rive","Spade","Kurv","Sekk","Pose","Kasse","Flaske",
  "Kopp","Panne","Ovn","Kjede","Ring","Medalje","Pokal","Tavle","Kritt","Svamp",
  "Blyant","Linjal","Passer","Atlas","Kart","Kompass","Kikkert","Lupe","Prisme","Linse",
  "Speil","Ramme","Lerret","Pensel","Maling","Tusj","Blekk","Papir","Pakke","Tau",
  "Seil","Anker","Motor","Propell","Ratt","Pedal","Bremse","Hjul","Dekk","Felg",
  "Ventil","Pumpe","Slange","Kran","Tank","Stige","Bjelke","Klokke","Rute","Blink",
  "Pilot","Laser","Radar","Sonar","Signal","Kabler","Tiger","Panter","Drage","Viktig"
];

function getRandomWord() {
  return NORSKE_ORD[Math.floor(Math.random() * NORSKE_ORD.length)];
}

function generatePassword() {
  let w1 = getRandomWord();
  let w2 = getRandomWord();
  while (w2 === w1) w2 = getRandomWord();
  const digits = String(Math.floor(Math.random() * 90) + 10);
  return `${w1}${w2}${digits}!`;
}

function CopyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
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

export default function PassordGenerator() {
  const [passwords, setPasswords] = useState(() =>
    Array.from({ length: 5 }, generatePassword)
  );
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]);
  const timeoutRef = useRef(null);

  const regenerateAll = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const newPws = Array.from({ length: 5 }, generatePassword);
      setPasswords(newPws);
      setIsGenerating(false);
    }, 300);
  }, []);

  const regenerateOne = useCallback((idx) => {
    setPasswords((prev) => {
      const next = [...prev];
      next[idx] = generatePassword();
      return next;
    });
  }, []);

  const copyToClipboard = useCallback((pw, idx) => {
    navigator.clipboard.writeText(pw).then(() => {
      setCopiedIdx(idx);
      setHistory((h) => [pw, ...h.filter((p) => p !== pw)].slice(0, 10));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopiedIdx(null), 2000);
    });
  }, []);

  const getStrength = (pw) => {
    const len = pw.length;
    if (len >= 16) return { label: "Sterk", color: "#34d399", width: "100%" };
    if (len >= 12) return { label: "God", color: "#60a5fa", width: "75%" };
    return { label: "OK", color: "#fbbf24", width: "50%" };
  };

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
      <div style={{
        position: "fixed", top: "-20%", left: "-10%", width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none",
      }}/>
      <div style={{
        position: "fixed", bottom: "-20%", right: "-10%", width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(167,139,250,0.10) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none",
      }}/>
      <div style={{
        position: "fixed", top: "40%", right: "20%", width: "300px", height: "300px",
        background: "radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(50px)", pointerEvents: "none",
      }}/>

      {/* Header */}
      <div style={{
        textAlign: "center", marginBottom: "36px", position: "relative", zIndex: 1,
      }}>
        <div style={{ marginBottom: "12px" }}>
          <ShieldIcon />
        </div>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 42px)",
          fontWeight: 800,
          background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #34d399 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: "0 0 8px",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
        }}>
          PassordMaskin
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.45)",
          fontSize: "15px",
          fontWeight: 300,
          margin: 0,
          letterSpacing: "0.02em",
        }}>
          Sterke, minnevennlige passord på norsk
        </p>
      </div>

      {/* Format badge */}
      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "100px",
        padding: "8px 20px",
        marginBottom: "28px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        backdropFilter: "blur(20px)",
        position: "relative",
        zIndex: 1,
      }}>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", fontWeight: 400 }}>Format:</span>
        <code style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "13px",
          color: "#60a5fa",
          fontWeight: 500,
        }}>Ord</code>
        <code style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "13px",
          color: "#a78bfa",
          fontWeight: 500,
        }}>Ord</code>
        <code style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "13px",
          color: "#34d399",
          fontWeight: 500,
        }}>00</code>
        <code style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "13px",
          color: "#fbbf24",
          fontWeight: 500,
        }}>!</code>
      </div>

      {/* Main glass card */}
      <div style={{
        width: "100%",
        maxWidth: "520px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px",
        padding: "8px",
        backdropFilter: "blur(40px)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Password list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {passwords.map((pw, i) => {
            const strength = getStrength(pw);
            const isCopied = copiedIdx === i;
            // Parse the password for color coding
            const match = pw.match(/^([A-ZÆØÅa-zæøå]+?)([A-ZÆØÅa-zæøå]+?)(\d{2})(!)/);
            const parts = match
              ? [
                  { text: match[1], color: "#60a5fa" },
                  { text: match[2], color: "#a78bfa" },
                  { text: match[3], color: "#34d399" },
                  { text: match[4], color: "#fbbf24" },
                ]
              : [{ text: pw, color: "#e2e8f0" }];

            // Better split: find where second capital letter starts
            const letters = pw.replace(/[\d!]+$/, "");
            let splitIdx = 0;
            for (let j = 1; j < letters.length; j++) {
              if (letters[j] === letters[j].toUpperCase() && letters[j] !== letters[j].toLowerCase()) {
                splitIdx = j;
                break;
              }
            }
            const word1 = letters.slice(0, splitIdx);
            const word2 = letters.slice(splitIdx);
            const rest = pw.slice(letters.length);
            const digits = rest.replace("!", "");
            const colorParts = [
              { text: word1, color: "#60a5fa" },
              { text: word2, color: "#a78bfa" },
              { text: digits, color: "#34d399" },
              { text: "!", color: "#fbbf24" },
            ];

            return (
              <div
                key={`${pw}-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 16px",
                  borderRadius: "16px",
                  background: isCopied
                    ? "rgba(52,211,153,0.08)"
                    : "rgba(255,255,255,0.02)",
                  border: isCopied
                    ? "1px solid rgba(52,211,153,0.2)"
                    : "1px solid transparent",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                }}
                onClick={() => copyToClipboard(pw, i)}
                onMouseEnter={(e) => {
                  if (!isCopied) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCopied) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    e.currentTarget.style.border = "1px solid transparent";
                  }
                }}
              >
                {/* Number */}
                <span style={{
                  color: "rgba(255,255,255,0.15)",
                  fontSize: "12px",
                  fontWeight: 500,
                  width: "18px",
                  textAlign: "center",
                  fontFamily: "'JetBrains Mono', monospace",
                }}>{i + 1}</span>

                {/* Password with colors */}
                <div style={{
                  flex: 1,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "clamp(15px, 3.5vw, 18px)",
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                  opacity: isGenerating ? 0.3 : 1,
                  transition: "opacity 0.2s",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {colorParts.map((p, pi) => (
                    <span key={pi} style={{ color: p.color }}>{p.text}</span>
                  ))}
                </div>

                {/* Strength indicator */}
                <div style={{
                  width: "40px",
                  height: "4px",
                  borderRadius: "2px",
                  background: "rgba(255,255,255,0.06)",
                  overflow: "hidden",
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: strength.width,
                    height: "100%",
                    borderRadius: "2px",
                    background: strength.color,
                    opacity: 0.7,
                    transition: "width 0.3s ease",
                  }}/>
                </div>

                {/* Refresh single */}
                <button
                  onClick={(e) => { e.stopPropagation(); regenerateOne(i); }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.2)",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.2)";
                    e.currentTarget.style.background = "none";
                  }}
                  title="Generer nytt"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10"/>
                    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
                  </svg>
                </button>

                {/* Copy indicator */}
                <button
                  onClick={(e) => { e.stopPropagation(); copyToClipboard(pw, i); }}
                  style={{
                    background: "none",
                    border: "none",
                    color: isCopied ? "#34d399" : "rgba(255,255,255,0.2)",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!isCopied) {
                      e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCopied) {
                      e.currentTarget.style.color = "rgba(255,255,255,0.2)";
                      e.currentTarget.style.background = "none";
                    }
                  }}
                  title="Kopier"
                >
                  {isCopied ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <CopyIcon />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={regenerateAll}
        style={{
          marginTop: "24px",
          padding: "14px 36px",
          borderRadius: "16px",
          border: "1px solid rgba(96,165,250,0.2)",
          background: "rgba(96,165,250,0.08)",
          color: "#60a5fa",
          fontSize: "15px",
          fontWeight: 600,
          fontFamily: "'Outfit', sans-serif",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          transition: "all 0.25s ease",
          backdropFilter: "blur(20px)",
          position: "relative",
          zIndex: 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(96,165,250,0.15)";
          e.currentTarget.style.borderColor = "rgba(96,165,250,0.35)";
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(96,165,250,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(96,165,250,0.08)";
          e.currentTarget.style.borderColor = "rgba(96,165,250,0.2)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <RefreshIcon />
        Generer nye passord
      </button>

      {/* Tip */}
      <p style={{
        marginTop: "24px",
        color: "rgba(255,255,255,0.2)",
        fontSize: "13px",
        fontWeight: 300,
        textAlign: "center",
        maxWidth: "400px",
        lineHeight: 1.6,
        position: "relative",
        zIndex: 1,
      }}>
        Klikk på et passord for å kopiere det. Hvert passord kombinerer to norske ord, to siffer og et utropstegn.
      </p>

      {/* History */}
      {history.length > 0 && (
        <div style={{
          marginTop: "32px",
          width: "100%",
          maxWidth: "520px",
          position: "relative",
          zIndex: 1,
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
          }}>
            <span style={{
              color: "rgba(255,255,255,0.2)",
              fontSize: "12px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}>Nylig kopiert</span>
            <div style={{
              flex: 1,
              height: "1px",
              background: "rgba(255,255,255,0.05)",
            }}/>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {history.map((h, i) => (
              <button
                key={`${h}-${i}`}
                onClick={() => copyToClipboard(h, `h-${i}`)}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "10px",
                  padding: "6px 12px",
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                }}
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
