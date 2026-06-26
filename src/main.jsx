import React, { useEffect, useMemo, useState, useRef } from "react";
import { ShamayimToggleSwitch } from "./components/ui/switch";
import { TimelineContent } from "./components/ui/timeline-animation";
import { AwardBadge } from "./components/ui/award-badge";
import { createRoot } from "react-dom/client";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  BookOpen,
  CalendarDays,
  Check,
  Clipboard,
  Download,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Flame,
  Layers3,
  Lock,
  LogOut,
  Mail,
  Menu,
  Play,
  Plus,
  ReceiptIndianRupee,
  Save,
  Trash2,
  Trophy,
  Upload,
  Users,
  Video,
  WandSparkles,
  X,
  ZoomIn,
  ZoomOut,
  Zap
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import "./styles.css";

const FaultyTerminal = React.lazy(() => import("./components/ui/FaultyTerminal"));
const LatexDocument = React.lazy(() => import("./components/LatexDocument"));
const assetBase = "/ibis-assets/hero-section-morphing-images/";
const chapterAssetVersion = "20260626-webp";

const chapterSeed = [
  ["Electric Charges and Fields", "ch01_electric_charges_and_fields_48837919.png"],
  ["Electrostatic Potential and Capacitance", "ch02_electrostatic_potential_and_capacitance_390148e1.png"],
  ["Current Electricity", "ch03_current_electricity_820757da.png"],
  ["Moving Charges and Magnetism", "ch04_moving_charges_and_magnetism_473c230b.png"],
  ["Magnetism and Matter", "ch05_magnetism_and_matter_1537fa81.png"],
  ["Electromagnetic Induction", "ch06_electromagnetic_induction_4e4d7cfe.png"],
  ["Alternating Current", "ch07_alternating_current_f6a9a19c.png"],
  ["Electromagnetic Waves", "ch08_electromagnetic_waves_51e1e7f1.png"],
  ["Ray Optics and Optical Instruments", "ch09_ray_optics_44fe5bb9.png"],
  ["Wave Optics", "ch10_wave_optics_ac864eca.png"],
  ["Dual Nature of Radiation and Matter", "ch11_dual_nature_radiation_matter_b49ee0da.png"],
  ["Atoms", "ch12_atoms_1bc9a982.png"],
  ["Nuclei", "ch13_nuclei_497a4db2.png"],
  ["Semiconductor Electronics", "ch14_semiconductors_9a28fd51.png"]
];

const topicNames = {
  1: ["Coulomb's Law", "Electric Field Lines", "Gauss Law"],
  2: ["Potential Energy", "Capacitors", "Dielectrics"],
  3: ["Drift Velocity", "Kirchhoff Rules", "Wheatstone Bridge"],
  4: ["Lorentz Force", "Biot Savart Law", "Ampere's Circuital Law"],
  5: ["Bar Magnets", "Earth's Magnetism", "Magnetic Materials"],
  6: ["Faraday's Law", "Lenz's Law", "AC Generator"],
  7: ["RMS Values", "LCR Circuits", "Power Factor"],
  8: ["Displacement Current", "EM Spectrum", "Wave Propagation"],
  9: ["Refraction", "Lens Maker Formula", "Optical Instruments"],
  10: ["Huygens Principle", "Interference", "Diffraction"],
  11: ["Photoelectric Effect", "de Broglie Waves", "Matter Waves"],
  12: ["Bohr Model", "Hydrogen Spectrum", "Energy Levels"],
  13: ["Nuclear Size", "Binding Energy", "Radioactivity"],
  14: ["Energy Bands", "PN Junction", "Logic Gates"]
};

const buildTopic = (chapterId, topic, index) => ({
  id: `${chapterId}-${index + 1}`,
  name: topic,
  isFree: chapterId <= 2 && index < 1,
  videos: [
    {
      id: `v-${chapterId}-${index}-1`,
      label: "Concept Core",
      title: `${topic}: board-first explanation`,
      url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      duration: `${18 + index * 4} min`
    },
    {
      id: `v-${chapterId}-${index}-2`,
      label: "Numerical Sprint",
      title: `Solving ${topic} in CBSE format`,
      url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      duration: `${13 + index * 3} min`
    }
  ],
  examples: index % 2 === 0 ? [
    {
      id: `e-${chapterId}-${index}-1`,
      label: "Worked Example",
      title: `${topic}: one exam-style derivation`,
      url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "11 min"
    }
  ] : [],
  notes: [
    {
      id: `n-${chapterId}-${index}-1`,
      title: `${topic} formula sheet`,
      type: "latex",
      content: "\\section*{Key Relation}\\[ E = \\frac{kq}{r^2} \\]\\nAlways write direction, unit, and final substitution."
    }
  ],
  testReady: false
});

const initialChapters = chapterSeed.map(([name, image], index) => ({
  id: index + 1,
  name,
  image: `${assetBase}${image.replace(".png", ".webp")}?v=${chapterAssetVersion}`,
  progress: [82, 66, 58, 41, 37, 29, 22, 18, 53, 47, 33, 24, 19, 14][index],
  topics: topicNames[index + 1].map((topic, topicIndex) => buildTopic(index + 1, topic, topicIndex))
}));

const initialStudents = [
  ["Aarav Bhatia", "48 min", "86%", "91", "2 min ago"],
  ["Kavya Rao", "31 min", "72%", "84", "11 min ago"],
  ["Meera Shah", "1h 08m", "93%", "96", "18 min ago"],
  ["Kabir Mehta", "18 min", "51%", "76", "35 min ago"],
  ["Riya Sharma", "56 min", "79%", "88", "43 min ago"]
];

const initialBatches = [
  { id: "b1", school: "St. Xavier's School", name: "Batch A 2026", code: "IBIS-26A", count: 18 },
  { id: "b2", school: "Delhi Public School", name: "Board Intensive", code: "IBIS-DPS", count: 12 },
  { id: "b3", school: "Ibis Online", name: "Weekend Cohort", code: "IBIS-WKD", count: 25 }
];

function getYouTubeId(url = "") {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{6,})/);
  return match?.[1] || "dQw4w9WgXcQ";
}

function getYouTubeThumbnail(url) {
  return `https://img.youtube.com/vi/${getYouTubeId(url)}/maxresdefault.jpg`;
}

function getYouTubeEmbed(url) {
  return `https://www.youtube.com/embed/${getYouTubeId(url)}?autoplay=1&rel=0`;
}

const AnimatedMeshBackground = () => (
  <div className="mesh-bg-container">
    <div className="mesh-blob blob-clay" />
    <div className="mesh-blob blob-gold" />
    <div className="mesh-blob blob-sage" />
    <div className="mesh-blob blob-coral" />
  </div>
);

const isMobileOrTablet = typeof navigator !== "undefined" && (
  /Mobi|Android|iPhone|iPad|Macintosh/i.test(navigator.userAgent) && 
  (navigator.maxTouchPoints > 0 || (navigator.userAgent.includes("Macintosh") && "ontouchend" in document))
);

function ScaleRotateWrapper({ children, needsScale, isPortrait, isEmbedded }) {
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(720);
  const [forceRotate, setForceRotate] = useState(false);

  useEffect(() => {
    if (isEmbedded || !needsScale) return;

    const handleResize = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const designW = 1280;

      if (isPortrait && !forceRotate) {
        setScale(1);
        setHeight(720);
        return;
      }

      const availW = (isPortrait && forceRotate) ? H : W;
      const availH = (isPortrait && forceRotate) ? W : H;

      // Scale based strictly on width to fill the screen width 100% on mobile/tablets
      const newScale = (isMobileOrTablet || isPortrait) ? (availW / designW) : Math.min(availW / designW, 1);
      setScale(newScale);

      // Calculate dynamic height to match the device aspect ratio exactly, avoiding letterboxing
      const calculatedHeight = availH / newScale;
      setHeight(calculatedHeight);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [forceRotate, isEmbedded, needsScale, isPortrait]);

  if (isEmbedded) {
    return <div className="embedded-content-frame">{children}</div>;
  }

  if (!needsScale) {
    return <>{children}</>;
  }

  if (isPortrait && !forceRotate) {
    return (
      <div className="portrait-lock-screen">
        <div className="portrait-lock-card">
          <div className="portrait-lock-logo">
            <img src="/ibis-assets/logo.webp?v=20260626" alt="Ibis Physics" />
          </div>
          <h2>Landscape Mode Recommended</h2>
          <p>
            This portal is optimized for desktop and landscape widescreen viewing to provide a premium interactive simulation experience.
          </p>
          <button 
            type="button" 
            className="portrait-rotate-btn" 
            onClick={() => setForceRotate(true)}
          >
            Enter Landscape View
          </button>
        </div>
      </div>
    );
  }

  const iframeUrl = window.location.origin + window.location.pathname + "?embedded=true";

  const containerStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "1280px",
    height: `${height}px`,
    transform: `translate(-50%, -50%) ${isPortrait && forceRotate ? "rotate(90deg)" : ""} scale(${scale})`,
    transformOrigin: "center center",
    border: "none",
    overflow: "hidden",
    boxShadow: "0 24px 70px rgba(0, 0, 0, 0.45)",
    borderRadius: "24px",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };

  return (
    <div className="global-scale-viewport">
      {isPortrait && forceRotate && (
        <button 
          type="button" 
          className="exit-rotation-btn" 
          onClick={() => setForceRotate(false)}
        >
          Exit Widescreen
        </button>
      )}
      <iframe 
        src={iframeUrl} 
        style={containerStyle} 
        title="Ibis Portal Widescreen View" 
        scrolling="no"
      />
    </div>
  );
}


function App() {
  const [screen, setScreen] = useState("landing");
  const [pricingSource, setPricingSource] = useState("signup");
  const [chapters, setChapters] = useState(initialChapters);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [topicIndex, setTopicIndex] = useState(0);
  const [tab, setTab] = useState("content");
  const [adminTab, setAdminTab] = useState("videos");
  const [batchOpen, setBatchOpen] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const [access, setAccess] = useState("trial");
  const [legalPage, setLegalPage] = useState("privacy");
  const [isPortrait, setIsPortrait] = useState(false);
  const [needsScale, setNeedsScale] = useState(false);
  
  const isEmbedded = useMemo(() => {
    return new URLSearchParams(window.location.search).get("embedded") === "true";
  }, []);

  useEffect(() => {
    if (isEmbedded) return;
    const handleResize = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      setIsPortrait(H > W);
      setNeedsScale(isMobileOrTablet || H > W || W < 1280 || H < 720);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [isEmbedded]);

  const activeChapter = chapters[chapterIndex] || chapters[0];

  const switchChapter = (direction) => {
    setChapterIndex((current) => (current + direction + chapters.length) % chapters.length);
    setTopicIndex(0);
  };

  useEffect(() => {
    if (screen !== "landing") return undefined;
    const id = window.setInterval(() => switchChapter(1), 5000);
    return () => window.clearInterval(id);
  }, [screen, chapterIndex, chapters.length]);

  const enterPortal = (mode) => {
    setAccess(mode);
    setPaywall(false);
    setScreen("student");
  };

  const openChapter = () => {
    const freeTopicAvailable = activeChapter.topics.some((topic) => topic.isFree);
    if (access !== "full" && !freeTopicAvailable) {
      setPaywall(true);
      return;
    }
    setTopicIndex(0);
    setTab("content");
    setScreen("chapter");
  };

  const showBackground = isEmbedded || !needsScale;

  return (
    <main>
      {showBackground && <AnimatedMeshBackground />}
      <ScaleRotateWrapper
        needsScale={needsScale}
        isPortrait={isPortrait}
        isEmbedded={isEmbedded}
      >
        {screen === "landing" && (
          <Landing
            chapters={chapters}
            chapterIndex={chapterIndex}
            setChapterIndex={setChapterIndex}
            onTrial={() => enterPortal("trial")}
            onStart={() => { setPricingSource("signup"); setScreen("signup"); }}
            onAdmin={() => setScreen("admin")}
            onWhyIbis={() => setScreen("why-ibis")}
            onPricing={() => { setPricingSource("landing"); setScreen("checkout"); }}
          />
        )}

        {screen === "why-ibis" && (
          <WhyIbisView onBack={() => setScreen("landing")} />
        )}

        {screen === "student" && (
          <StudentPortal
            access={access}
            chapters={chapters}
            chapterIndex={chapterIndex}
            setChapterIndex={setChapterIndex}
            switchChapter={switchChapter}
            openChapter={openChapter}
            onBatch={() => setBatchOpen(true)}
            onLogout={() => setScreen("landing")}
            showPaywall={paywall}
            onPay={() => { setPricingSource("signup"); setScreen("signup"); }}
            onClosePaywall={() => setPaywall(false)}
          />
        )}

        {screen === "chapter" && (
          <ChapterView
            chapter={activeChapter}
            access={access}
            topicIndex={topicIndex}
            setTopicIndex={setTopicIndex}
            tab={tab}
            setTab={setTab}
            onBack={() => setScreen("student")}
            onPay={() => { setPricingSource("signup"); setScreen("signup"); }}
          />
        )}

        {screen === "admin" && (
          <AdminPanel
            chapters={chapters}
            setChapters={setChapters}
            chapterIndex={chapterIndex}
            setChapterIndex={setChapterIndex}
            topicIndex={topicIndex}
            setTopicIndex={setTopicIndex}
            activeTab={adminTab}
            setActiveTab={setAdminTab}
            onBatch={() => setScreen("batches")}
            onLogout={() => setScreen("landing")}
          />
        )}

        {screen === "batches" && <BatchControl onBack={() => setScreen("admin")} />}
        {screen === "signup" && (
          <Signup
            onBack={() => setScreen("landing")}
            onPay={() => { setPricingSource("signup"); setScreen("checkout"); }}
            onLogin={() => enterPortal("full")}
            onLegal={(page) => {
              setLegalPage(page);
              setScreen("legal");
            }}
          />
        )}
        {screen === "legal" && <LegalInfoPage page={legalPage} onBack={() => setScreen("signup")} />}
        {screen === "checkout" && <Checkout onBack={() => setScreen(pricingSource === "landing" ? "landing" : "signup")} onDone={() => enterPortal("full")} />}
        {batchOpen && <BatchModal onClose={() => setBatchOpen(false)} />}
      </ScaleRotateWrapper>
    </main>
  );
}

function Brand({ admin = false, compact = false }) {
  return (
    <div className={`brand ${compact ? "compact" : ""}`}>
      <img className="brand-logo" src="/ibis-assets/logo.webp?v=20260626" alt="Ibis Physics" decoding="async" />
      <span>
        {admin && <small>Admin Control</small>}
      </span>
    </div>
  );
}

function Button({ children, variant = "secondary", className = "", ...props }) {
  return (
    <button className={`btn ${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

function GlassButton({ className = "", children, size = "default", contentClassName = "", onClick, ...props }) {
  const handleWrapperClick = (e) => {
    const button = e.currentTarget.querySelector("button");
    if (button && !button.contains(e.target)) {
      button.click();
    }
  };

  const sizeClass = size === "sm" ? "glass-btn-size-sm" : size === "lg" ? "glass-btn-size-lg" : size === "icon" ? "glass-btn-size-icon" : "glass-btn-size-default";

  return (
    <div className={`glass-button-wrap cursor-pointer rounded-full relative ${className}`} onClick={handleWrapperClick}>
      <button className="glass-button relative z-10" onClick={onClick} {...props}>
        <span className={`glass-button-text relative block select-none tracking-tighter ${sizeClass} ${contentClassName}`}>{children}</span>
      </button>
      <div className="glass-button-shadow rounded-full pointer-events-none"></div>
    </div>
  );
}


function Pill({ children, tone = "neutral" }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

// 1. Text Reveal Hover Effect (splits letters and transitions them)
const TextReveal = React.memo(function TextReveal({
  text,
  as: Component = "span",
  className = "",
  style = {},
  fontSize = "inherit",
  staggerDelay = 20,
  duration = 250,
  easing = "ease-in-out",
  color = "inherit",
  hoverColor = "#db7a59", // brand clay/coral
  direction = "up",
  onClick,
}) {
  const [hovered, setHovered] = useState(false);

  const chars = useMemo(() => {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), (s) => s.segment);
    }
    return [...text];
  }, [text]);

  const sign = direction === "up" ? 1 : -1;

  const rootProps = {
    className: `inline-block relative no-underline font-extrabold tracking-tight overflow-hidden cursor-pointer select-none ${className}`.trim(),
    style: {
      fontSize,
      color: hovered ? hoverColor : color,
      transition: "color 0.35s ease",
      lineHeight: 1.1,
      ...style,
    },
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onClick,
    "aria-label": text,
  };

  return (
    <Component {...rootProps}>
      <span
        className="inline-flex overflow-hidden relative"
        style={{ height: "1.1em" }}
        aria-hidden="true"
      >
        {chars.map((char, i) => (
          <span
            key={i}
            className="inline-block relative will-change-transform"
            style={{
              textShadow: `0 ${sign}em currentColor`,
              transition: `transform ${duration}ms ${easing}`,
              transitionDelay: `${i * staggerDelay}ms`,
              transform: hovered ? `translateY(${-sign}em)` : "translateY(0)",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </Component>
  );
});

// 2. Shiny Button with conic gradient border
function ShinyButton({ children, onClick, className = "", ...props }) {
  return (
    <button className={`shiny-cta ${className}`} onClick={onClick} {...props}>
      <span>{children}</span>
    </button>
  );
}

// 3. Animated Layer Button with SVG path morphing
function AnimatedLayerButton({ children, hoverText, onClick, className = "", ...props }) {
  return (
    <button className={`animated-layer-btn ${hoverText ? "has-hover-label" : ""} ${className}`} onClick={onClick} {...props}>
      <svg
        viewBox="0 0 1095.66 1095.63"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path fill="#242021" d="M1298,749.62c.4,300.41-243,548-548.1,547.9C446.23,1297.4,201.92,1051.2,202.29,749c.37-301.52,244.49-547.41,548.34-547.12C1055.43,202.18,1298.25,449.6,1298,749.62Z" transform="translate(-202.29 -201.89)"/>
        <path fill="#d37150" d="M1285.89,749.79c-.25,297.07-241.24,535.86-536.12,535.66-296.34-.21-537-241.72-535.29-539,1.68-293.16,240.83-534.18,539.15-532.37C1046.8,215.84,1285.62,453.88,1285.89,749.79Z" transform="translate(-202.29 -201.89)"/>
        <path fill="#fefefe" d="M1195.29,749.56c.54,244.73-198.67,446.2-446.87,445.33C503.27,1194,304,994.53,304.93,748c.91-244.52,199.12-443.08,444.39-443.49C997.43,304,1195.74,505.59,1195.29,749.56Z" transform="translate(-202.29 -201.89)"/>
        <path fill="#db7a59" d="M1097.23,749.87c.22,190.31-154.42,347.43-348,346.92-192-.5-346.48-156.44-346.17-347.7C403.33,558,558.18,402,751.08,402.55,944.62,403.09,1097.69,560.56,1097.23,749.87Z" transform="translate(-202.29 -201.89)"/>
      </svg>
      <span className="animated-layer-label">
        <span className="label-default">{children}</span>
        {hoverText && <span className="label-hover">{hoverText}</span>}
      </span>
    </button>
  );
}

// 4. Gradient Blob Glass Card wrapper
function GradientBlobCard({ children, className = "", onClick }) {
  const rootProps = {
    className: `blob-card ${className}`,
    onClick
  };
  
  if (onClick) {
    rootProps.style = { cursor: "pointer" };
  }

  return (
    <div {...rootProps}>
      <div className="blob-container">
        <div className="blob-bg blob-1" />
        <div className="blob-bg blob-2" />
      </div>
      <div className="blob-glass" />
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

function ReflectiveTiltFrame({ children, className = "", featured = false }) {
  const frameRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMove = (event) => {
    const node = frameRef.current;
    if (!node) return;
    const { clientX, clientY } = event;
    if (rafRef.current) return;

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = 0;
      const rect = node.getBoundingClientRect();
      const relX = (clientX - rect.left) / rect.width - 0.5;
      const relY = (clientY - rect.top) / rect.height - 0.5;
      const rotateX = (-relY * 0.16).toFixed(4);
      const rotateY = (relX * 0.16).toFixed(4);
      const rotateZ = (relX * 0.035).toFixed(4);
      node.style.transform = `perspective(900px) matrix3d(1, 0, ${rotateY}, 0, ${rotateZ}, 1, ${rotateX}, 0, ${-rotateY}, ${-rotateX}, 1, 0, 0, 0, 0, 1)`;
      node.style.setProperty("--glare-x", `${Math.round((clientX - rect.left) / rect.width * 100)}%`);
      node.style.setProperty("--glare-y", `${Math.round((clientY - rect.top) / rect.height * 100)}%`);
      node.style.setProperty("--glare-opacity", "1");
    });
  };

  const handleLeave = () => {
    const node = frameRef.current;
    if (!node) return;
    node.style.transform = "perspective(900px) matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)";
    node.style.setProperty("--glare-opacity", "0");
  };

  return (
    <div
      ref={frameRef}
      className={`reflective-plan-frame ${featured ? "featured" : ""} ${className}`}
      onMouseMove={handleMove}
      onMouseEnter={() => frameRef.current?.style.setProperty("--glare-opacity", "1")}
      onMouseLeave={handleLeave}
      style={{
        transform: "perspective(900px) matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
        "--glare-x": "50%",
        "--glare-y": "18%",
        "--glare-opacity": 0
      }}
    >
      <div className="reflective-plan-card">
        <span className="pricing-reflect pricing-reflect-1" />
        <span className="pricing-reflect pricing-reflect-2" />
        <span className="pricing-reflect pricing-reflect-3" />
        <span className="pricing-reflect pricing-reflect-4" />
        <span className="pricing-reflect pricing-reflect-5" />
        <div className="reflective-plan-content">
          {children}
        </div>
      </div>
    </div>
  );
}

function ChapterImage({ chapter, className = "" }) {
  return (
    <img
      className={`chapter-image ${className}`}
      src={chapter.image}
      alt={`${chapter.name} thumbnail`}
      loading="lazy"
      decoding="async"
      draggable="false"
    />
  );
}

const stackPositionStyles = [
  { scale: 1, y: 12, opacity: 1 },
  { scale: 0.95, y: -16, opacity: 0.75 },
  { scale: 0.9, y: -44, opacity: 0.5 }
];

function ChapterCardStack({
  chapters,
  activeIndex,
  setActiveIndex,
  className = "",
  mode = "hero",
  onOpen,
  locked = false
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const visibleCards = [0, 1, 2].map((offset) => {
    const chapter = chapters[(activeIndex + offset) % chapters.length];
    return { chapter, stackIndex: offset };
  });

  const changeChapter = (nextIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((nextIndex + chapters.length) % chapters.length);
    window.setTimeout(() => setIsAnimating(false), 850);
  };

  const animateNext = () => {
    changeChapter(activeIndex + 1);
  };

  return (
    <section className={`chapter-card-stack ${mode} ${className}`} aria-label="Animated chapter stack">
      <div className="stack-stage">
        <AnimatePresence initial={false}>
          {visibleCards.map(({ chapter, stackIndex }) => (
            <motion.div
              key={chapter.id}
              initial={stackIndex === 2 ? { y: -16, scale: 0.9 } : false}
              animate={stackPositionStyles[stackIndex]}
              exit={{ y: 340, scale: 1, zIndex: 10 }}
              transition={{
                type: "spring",
                duration: 1,
                bounce: 0,
              }}
              style={{
                zIndex: stackIndex === 0 && isAnimating ? 10 : 3 - stackIndex,
                left: "50%",
                x: "-50%",
                bottom: 0,
              }}
              className="animated-chapter-card"
            >
              <div className="flex-card-stack-inner">
                <div className="card-stack-image-wrap">
                  <img
                    src={chapter.image}
                    alt={chapter.name}
                    className="card-stack-image"
                    loading={stackIndex === 0 ? "eager" : "lazy"}
                    decoding="async"
                    draggable="false"
                  />
                  {locked && stackIndex === 0 && <span className="lock-chip"><Lock size={15} /> Premium</span>}
                </div>
                <div className="card-stack-info-row">
                  <div className="card-stack-text-col">
                    <span className="card-stack-chapter-label">
                      Chapter {chapter.id} {mode === "student" ? ` · ${chapter.progress}% complete` : " · Board Course"}
                    </span>
                    <span className="card-stack-chapter-title">{chapter.name}</span>
                  </div>
                  <button 
                    className="card-stack-action-btn"
                    onClick={stackIndex === 0 ? (onOpen || animateNext) : () => changeChapter(activeIndex + stackIndex)}
                  >
                    <span>Read</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="square"
                    >
                      <path d="M9.5 18L15.5 12L9.5 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="stack-controls">
        <GlassButton size="icon" aria-label="Previous chapter" disabled={isAnimating} onClick={() => changeChapter(activeIndex - 1)}><ArrowLeft size={18} /></GlassButton>
        <div className="dots">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              className={index === activeIndex ? "active" : ""}
              aria-label={`Show ${chapter.name}`}
              disabled={isAnimating}
              onClick={() => changeChapter(index)}
            />
          ))}
        </div>
        <GlassButton size="icon" aria-label="Next chapter" disabled={isAnimating} onClick={animateNext}><ArrowRight size={18} /></GlassButton>
      </div>
    </section>
  );
}
function TesplePill() {
  const hostRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      const el = hostRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <a
      href="https://tesple.in"
      target="_blank"
      rel="noopener noreferrer"
      ref={hostRef}
      className="yc-pill-wrapper"
      style={{
        "--mx": "50%",
        "--my": "50%",
        textDecoration: "none"
      }}
    >
      <div className="yc-pill-glow-container" aria-hidden="true">
        <div className="yc-pill-glow" />
      </div>
      <div className="yc-pill-glass">
        <div className="yc-pill-content">
          <span className="yc-monogram-wrap" aria-hidden="true">
            <img src="/ibis-assets/tesple.png?v=1" alt="Tesple Logo" className="yc-monogram-img" />
          </span>
          <span className="yc-pill-text">
            Backed by Tesple
          </span>
        </div>
      </div>
    </a>
  );
}

function RockerSwitch({ checked, onChange }) {
  return (
    <ShamayimToggleSwitch
      defaultState={checked}
      onChange={onChange}
    />
  );
}

function WhyIbisView({ onBack }) {
  const containerRef = useRef(null);
  const whyIbisHeroRef = useRef(null);

  const handleMouseMove = (event) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    container.style.setProperty("--mouse-x", `${x}px`);
    container.style.setProperty("--mouse-y", `${y}px`);
  };

  const revealVariants = {
    visible: (i) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 1.5,
        duration: 0.7,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: 40,
      opacity: 0,
    },
  };

  const textVariants = {
    visible: (i) => ({
      filter: "blur(0px)",
      opacity: 1,
      transition: {
        delay: i * 0.3,
        duration: 0.7,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      opacity: 0,
    },
  };

  return (
    <section className="why-ibis-screen" ref={whyIbisHeroRef}>
      {/* Floating Logo Top-Left */}
      <div style={{ position: "absolute", top: "24px", left: "24px", zIndex: 50 }}>
        <Brand compact={true} />
      </div>

      {/* Floating Top-Right Actions */}
      <div style={{ position: "absolute", top: "24px", right: "24px", zIndex: 50, display: "flex", alignItems: "center", gap: "16px" }}>
        <RockerSwitch checked={true} onChange={(val) => { if (!val) onBack(); }} />
        <TesplePill />
        <Button className="icon-btn subtle" style={{ visibility: "hidden" }} aria-hidden="true"><Menu size={18} /></Button>
      </div>

      <div className="why-ibis-split-layout">
        {/* Left Content Section */}
        <div className="why-ibis-text-content">
          <div className="why-ibis-glass-card">
            <TimelineContent
              as="div"
              animationNum={0}
              timelineRef={whyIbisHeroRef}
              customVariants={revealVariants}
              className="why-ibis-intro"
            >
              <div className="why-ibis-title-heading">
                Hey, it's <span>Ganesh</span>—your teacher who's gonna make physics <i>easy</i> for you.
              </div>

              <div className="why-ibis-story-copy">
                We are{" "}
                <span className="glass-badge-reflect glass-badge-blue">rebuilding</span>{" "}
                physics learning to be <strong className="glass-badge-reflect glass-badge-cream">zero noise</strong> and{" "}
                <span className="why-soft-emphasis glass-badge-reflect glass-badge-teal">board optimized</span>. My mission is to build boardroom confidence
                and make complex concepts{" "}
                <TimelineContent
                  as="span"
                  animationNum={2}
                  timelineRef={whyIbisHeroRef}
                  customVariants={textVariants}
                  className="why-micro-chip"
                >
                  click
                </TimelineContent>{" "}
                for you. Through step-by-step{" "}
                <span className="glass-badge-reflect glass-badge-gold">visual patterns</span>, intuitive derivations, and hand-tailored{" "}
                <span className="glass-badge-reflect glass-badge-purple">study tracks</span>,
                we turn intimidating equations into natural reflexes. Every class is engineered to spark curiosity,
                reduce{" "}
                <span className="glass-badge-reflect glass-badge-pink">exam anxiety</span>, and make top-tier mentoring accessible.
              </div>
            </TimelineContent>

            <div style={{ marginTop: "32px" }}>
              <TimelineContent
                as="div"
                animationNum={4}
                timelineRef={whyIbisHeroRef}
                customVariants={textVariants}
                style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-start" }}
              >
                <AwardBadge type="cbse-coaching" variant="transparent" />
                <AwardBadge type="harvard-leadership" variant="transparent" />
              </TimelineContent>
            </div>
          </div>
        </div>

        {/* Right Portrait Section */}
        <div className="why-ibis-portrait-side">
          <div
            ref={containerRef}
            className="why-ibis-portrait-container-full"
            onMouseMove={handleMouseMove}
          >
            <img
              src="/ibis-assets/ganesh1.webp?v=20260626"
              alt="Ganesh sketch portrait"
              className="mentor-img-base-full"
              loading="lazy"
              decoding="async"
              draggable="false"
            />
            <img
              src="/ibis-assets/ganesh2.webp?v=20260626"
              alt="Ganesh original portrait"
              className="mentor-img-reveal-full"
              loading="lazy"
              decoding="async"
              draggable="false"
            />
            <div className="reveal-lens-cursor-large" />
          </div>
        </div>
      </div>
    </section>
  );
}

function PortalBadge() {
  const badgeRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMove = (event) => {
    const node = badgeRef.current;
    if (!node) return;
    const { clientX, clientY } = event;
    if (rafRef.current) return;

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = 0;
      const rect = node.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      node.style.transform = `perspective(700px) rotateX(${-y * 7}deg) rotateY(${x * 8}deg) scale(0.99)`;
      node.style.setProperty("--badge-overlay", `${(Math.abs(x) + Math.abs(y)) * 48}deg`);
      node.style.setProperty("--mx", `${((clientX - rect.left) / rect.width) * 100}%`);
      node.style.setProperty("--my", `${((clientY - rect.top) / rect.height) * 100}%`);
    });
  };

  const handleLeave = () => {
    const node = badgeRef.current;
    if (!node) return;
    node.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
    node.style.setProperty("--badge-overlay", "0deg");
    node.style.setProperty("--mx", "50%");
    node.style.setProperty("--my", "50%");
  };

  return (
    <div
      ref={badgeRef}
      className="portal-award-badge"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform: "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)",
        "--badge-overlay": "0deg",
        "--mx": "50%",
        "--my": "50%"
      }}
      aria-label="12th Physics Portal"
    >
      <span className="portal-badge-sheen" aria-hidden="true" />
      <span className="portal-badge-mark" aria-hidden="true">
        <svg viewBox="0 0 36 36" role="presentation" focusable="false">
          <path
            d="M14.963 9.075c.787-3-.188-5.887-.188-5.887S12.488 5.175 11.7 8.175c-.787 3 .188 5.887.188 5.887s2.25-1.987 3.075-4.987m-4.5 1.987c.787 3-.188 5.888-.188 5.888S7.988 14.962 7.2 11.962c-.787-3 .188-5.887.188-5.887s2.287 1.987 3.075 4.987m.862 10.388s-.6-2.962-2.775-5.175C6.337 14.1 3.375 13.5 3.375 13.5s.6 2.962 2.775 5.175c2.213 2.175 5.175 2.775 5.175 2.775m3.3 3.413s-1.988-2.288-4.988-3.075-5.887.187-5.887.187 1.987 2.287 4.988 3.075c3 .787 5.887-.188 5.887-.188Zm6.75 0s1.988-2.288 4.988-3.075c3-.826 5.887.187 5.887.187s-1.988 2.287-4.988 3.075c-3 .787-5.887-.188-5.887-.188ZM32.625 13.5s-2.963.6-5.175 2.775c-2.213 2.213-2.775 5.175-2.775 5.175s2.962-.6 5.175-2.775c2.175-2.213 2.775-5.175 2.775-5.175M28.65 6.075s.975 2.887.188 5.887c-.826 3-3.076 4.988-3.076 4.988s-.974-2.888-.187-5.888c.788-3 3.075-4.987 3.075-4.987m-4.5 7.987s.975-2.887.188-5.887c-.788-3-3.076-4.988-3.076-4.988s-.974 2.888-.187 5.888c.788 3 3.075 4.988 3.075 4.988ZM18 26.1c.975-.225 3.113-.6 5.325 0 3 .788 5.063 3.038 5.063 3.038s-2.888.975-5.888.187a13 13 0 0 1-1.425-.525c.563.788 1.125 1.425 2.288 1.913l-.863 2.062c-2.063-.862-2.925-2.137-3.675-3.262-.262-.375-.525-.713-.787-1.05-.26.293-.465.586-.686.903l-.102.147-.048.068c-.775 1.108-1.643 2.35-3.627 3.194l-.862-2.062c1.162-.488 1.725-1.125 2.287-1.913-.45.225-.938.375-1.425.525-3 .788-5.887-.187-5.887-.187s1.987-2.288 4.987-3.075c2.212-.563 4.35-.188 5.325.037"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="portal-badge-title">12th Physics Portal</span>
      <span className="portal-badge-hologram" aria-hidden="true" />
    </div>
  );
}

function Landing({ chapters, chapterIndex, setChapterIndex, onTrial, onStart, onAdmin, onWhyIbis, onPricing }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const studentFeatures = [
    {
      icon: <BookOpen size={20} />,
      title: "Curated videos",
      copy: "Only the lessons you actually need, arranged chapter by chapter."
    },
    {
      icon: <FileText size={20} />,
      title: "Easy concepts",
      copy: "Understand the idea first, then formulas and numericals feel natural."
    },
    {
      icon: <CalendarDays size={20} />,
      title: "Track + test",
      copy: "See progress, study rhythm, and practice tests in one place."
    },
    {
      icon: <Trophy size={20} />,
      title: "Ace physics",
      copy: "Build board confidence with a style that feels clear, sharp, and premium."
    }
  ];

  return (
    <section className="landing-screen" style={{ position: "relative" }}>
      <svg className="liquid-glass-filter" aria-hidden="true">
        <defs>
          <filter id="landing-liquid-glass" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.045" numOctaves="2" seed="7" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="1.8" result="blurredNoise" />
            <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="22" xChannelSelector="R" yChannelSelector="B" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="0.35" result="softened" />
            <feComposite in="softened" in2="softened" operator="over" />
          </filter>
        </defs>
      </svg>

      <PortalBadge />

      {/* Floating Logo Top-Left */}
      <div style={{ position: "absolute", top: "24px", left: "24px", zIndex: 50 }}>
        <Brand compact={true} />
      </div>

      {/* Floating Top-Right Actions */}
      <div style={{ position: "absolute", top: "24px", right: "24px", zIndex: 100, display: "flex", alignItems: "center", gap: "16px" }}>
        <RockerSwitch checked={false} onChange={(val) => { if (val) onWhyIbis(); }} />
        <TesplePill />
        <div className="glass-dropdown-wrapper">
          <Button className="icon-btn subtle" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu size={18} />
          </Button>
          {menuOpen && (
            <>
              <div 
                style={{ position: "fixed", inset: 0, zIndex: 99, cursor: "default" }} 
                onClick={() => setMenuOpen(false)} 
              />
              <div className="glass-dropdown-menu" style={{ zIndex: 100 }}>
                <button 
                  className="glass-dropdown-item" 
                  onClick={() => { setMenuOpen(false); onPricing(); }}
                >
                  Pricing
                </button>
                <button 
                  className="glass-dropdown-item" 
                  onClick={() => { setMenuOpen(false); onAdmin(); }}
                >
                  Admin
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="landing-grid" style={{ position: "relative", zIndex: 1 }}>
        <section className="hero-copy">
          <h1 className="hero-editorial-title" aria-label="Physics that finally clicks">
            <span className="title-line line-one">
              <span className="hero-doodle hero-doodle-burst" aria-hidden="true" />
              <span className="ink-word">Physics</span>
            </span>
            <span className="title-line line-two">
              <span className="sun-word">that</span>
              <span className="ink-word">finally</span>
              <span className="hero-doodle hero-doodle-triangle" aria-hidden="true" />
            </span>
            <span className="title-line line-three">
              <span className="ink-word">clicks</span>
              <span className="hero-doodle hero-doodle-underline" aria-hidden="true" />
            </span>
          </h1>
          <div className="hero-actions hero-actions-polished">
            <AnimatedLayerButton className="hero-trial-layer-btn" hoverText="Try" onClick={onTrial}>Free trial</AnimatedLayerButton>
            <ShinyButton className="hero-start-shiny" onClick={onStart}>Start learning</ShinyButton>
          </div>
        </section>

        <section className="hero-subject-showcase">
          <div className="subject-card">
            <img
              src="/ibis-assets/herosubject.webp?v=20260626"
              alt="Physics Subject Illustration"
              className="subject-image"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </section>
      </div>

      <section className="landing-feature-rail" aria-label="Student features">
        {studentFeatures.map((feature) => (
          <article
            className="landing-feature-card"
            key={feature.title}
          >
            <span className="landing-feature-glass-shadow" aria-hidden="true" />
            <span className="landing-feature-glass" aria-hidden="true" />
            <span className="landing-feature-icon">{feature.icon}</span>
            <strong>{feature.title}</strong>
            <p>{feature.copy}</p>
          </article>
        ))}
      </section>
    </section>
  );
}

function Proof({ value, label }) {
  return (
    <span>
      <strong>{value}</strong>
      <small>{label}</small>
    </span>
  );
}

function Feature({ icon, title, copy }) {
  return (
    <div className="glass-card" style={{ width: "100%", height: "100%", padding: "20px", borderRadius: "20px" }}>
      <article style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", gap: "16px", width: "100%" }}>
        <span style={{ display: "grid", placeItems: "center", width: "42px", height: "42px", borderRadius: "12px", color: "var(--paper-soft)", background: "linear-gradient(135deg, var(--clay-dark), var(--clay))", boxShadow: "0 4px 12px rgba(219, 122, 89, 0.2)" }}>{icon}</span>
        <div style={{ display: "grid", gap: "3px" }}>
          <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "var(--ink)", fontFamily: "var(--display-accent)" }}>{title}</h3>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.86rem", lineHeight: "1.4" }}>{copy}</p>
        </div>
      </article>
    </div>
  );
}

function StudentChapterShowcase({
  access,
  chapters,
  activeIndex,
  setActiveIndex,
  onOpen
}) {
  const [direction, setDirection] = useState(0);
  const wheelLockRef = useRef(0);
  const activeChapter = chapters[activeIndex] || chapters[0];
  const activeLocked = access !== "full" && !activeChapter.topics.some((topic) => topic.isFree);
  const directionClass = direction < 0 ? "from-previous" : "from-next";

  const moveChapter = (step) => {
    if (!chapters.length) return;
    setDirection(step);
    setActiveIndex((current) => (current + step + chapters.length) % chapters.length);
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const now = Date.now();
    if (now - wheelLockRef.current < 560 || Math.abs(event.deltaY) < 16) return;
    wheelLockRef.current = now;
    moveChapter(event.deltaY > 0 ? 1 : -1);
  };

  const progressDots = chapters.map((item, index) => (
    <button
      key={item.id}
      type="button"
      className={index === activeIndex ? "active" : ""}
      aria-label={`Show chapter ${index + 1}: ${item.name}`}
      onClick={() => {
        setDirection(index > activeIndex ? 1 : -1);
        setActiveIndex(index);
      }}
    />
  ));

  return (
    <section className="student-chapter-showcase" onWheel={handleWheel}>
      <div className="student-showcase-main">
        <div className="student-showcase-top">
          <div>
            <span>Chapter {activeIndex + 1} of {chapters.length}</span>
            <strong>{activeChapter.progress}% complete</strong>
          </div>
          <Pill tone={access === "full" ? "accent" : "warning"}>{access === "full" ? "full access" : "trial access"}</Pill>
        </div>

        <div className="student-deck-stage" aria-live="polite">
          <article
            key={activeChapter.id}
            className={`student-feature-chapter-card ${directionClass} ${activeLocked ? "locked" : ""}`}
          >
            <img
              className="student-feature-image"
              src={activeChapter.image}
              alt={`${activeChapter.name} thumbnail`}
              loading="eager"
              decoding="async"
              draggable={false}
            />
            <div className="student-feature-scrim" />
            {activeLocked && (
              <span className="student-feature-lock"><Lock size={15} /> Full access</span>
            )}
            <div className="student-feature-copy">
              <span>Chapter {activeChapter.id} · {activeChapter.progress}% complete</span>
              <h2>{activeChapter.name}</h2>
              <p>{activeChapter.topics.slice(0, 3).map((topic) => topic.name).join(" · ")}</p>
            </div>
            <GlassButton type="button" size="default" className="student-feature-read" contentClassName="student-feature-read-text" onClick={onOpen}>
              <span>{activeLocked ? "Unlock" : "Read"}</span>
              <ArrowRight size={18} />
            </GlassButton>
          </article>
        </div>

        <div className="student-showcase-footer">
          <div className="student-chapter-dots">{progressDots}</div>
          <GlassButton type="button" size="default" className="student-open-glass" contentClassName="student-open-glass-text" onClick={onOpen}>
            {activeLocked ? <Lock size={17} /> : <ArrowRight size={17} />}
            <span>{activeLocked ? "Unlock selected chapter" : "Open selected chapter"}</span>
          </GlassButton>
        </div>
      </div>

      <div className="student-deck-controls" aria-label="Chapter navigation">
        <GlassButton type="button" size="icon" aria-label="Previous chapter" onClick={() => moveChapter(-1)}>
          <ArrowUp size={19} />
        </GlassButton>
        <span>{String(activeIndex + 1).padStart(2, "0")}</span>
        <GlassButton type="button" size="icon" aria-label="Next chapter" onClick={() => moveChapter(1)}>
          <ArrowDown size={19} />
        </GlassButton>
      </div>
    </section>
  );
}

function StudentPortal({
  access,
  chapters,
  chapterIndex,
  setChapterIndex,
  switchChapter,
  openChapter,
  onBatch,
  onLogout,
  showPaywall,
  onPay,
  onClosePaywall
}) {
  const chapter = chapters[chapterIndex];

  const [statsOpen, setStatsOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  return (
    <section className="app-shell">
      <header className="topbar portal-bar">
        <strong className="student-name">Riya Sharma</strong>
        <Button variant="ghost" onClick={onBatch}><Clipboard size={16} /> Enter batch code</Button>
        <Button onClick={onLogout}><LogOut size={16} /> Log out</Button>
      </header>

      <div className="portal-grid">
        <aside className="student-side">
          <GradientBlobCard onClick={() => setLeaderboardOpen(true)} className="achievement-card">
            <div className="metric-card" style={{ background: "transparent", border: "none", boxHighlight: "none", boxShadow: "none", padding: "16px", cursor: "pointer", display: "grid", gap: "10px", width: "100%" }}>
              <Trophy />
              <span>Current rank</span>
              <strong style={{ fontFamily: "var(--display-accent)" }}>#12</strong>
              <small>3 badges earned · tap for leaderboard</small>
              <div className="mini-leaderboard">
                <b>#1 Meera</b>
                <b>#2 Aarav</b>
                <b>#12 You</b>
              </div>
            </div>
          </GradientBlobCard>
          
          <GradientBlobCard onClick={() => setStatsOpen(true)} className="stat-card">
            <CalendarCard isNested={true} />
          </GradientBlobCard>
        </aside>

        <section className="chapter-switcher">
          <StudentChapterShowcase
            access={access}
            chapters={chapters}
            activeIndex={chapterIndex}
            setActiveIndex={setChapterIndex}
            onOpen={openChapter}
          />
        </section>
      </div>

      {showPaywall && <Paywall onPay={onPay} onClose={onClosePaywall} />}
      {statsOpen && <StatsModal onClose={() => setStatsOpen(false)} chapters={chapters} />}
      {leaderboardOpen && <LeaderboardModal onClose={() => setLeaderboardOpen(false)} />}
    </section>
  );
}

const studyDataByDay = {
  2: { type: "hot", minutes: 90, lessons: 2, tests: 1 },
  3: { type: "warm", minutes: 30, lessons: 1, tests: 0 },
  4: { type: "hot", minutes: 75, lessons: 2, tests: 0 },
  8: { type: "hot", minutes: 120, lessons: 3, tests: 1 },
  9: { type: "warm", minutes: 45, lessons: 1, tests: 0 },
  10: { type: "warm", minutes: 35, lessons: 1, tests: 0 },
  12: { type: "hot", minutes: 110, lessons: 2, tests: 1 },
  15: { type: "hot", minutes: 80, lessons: 2, tests: 0 },
  16: { type: "hot", minutes: 95, lessons: 2, tests: 1 },
  17: { type: "warm", minutes: 40, lessons: 1, tests: 0 },
  22: { type: "hot", minutes: 105, lessons: 3, tests: 0 },
  23: { type: "hot", minutes: 90, lessons: 2, tests: 1 },
  24: { type: "hot", minutes: 130, lessons: 4, tests: 1 }
};

function getCalendarDays(year, month) {
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    days.push(d);
  }
  return days;
}

function getStudyCalendar(baseDate = new Date()) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const today = baseDate.getDate();
  const monthName = baseDate.toLocaleString("en-IN", { month: "long" });
  const days = getCalendarDays(year, month);
  const activeDays = Object.keys(studyDataByDay).filter((day) => Number(day) <= new Date(year, month + 1, 0).getDate()).length;
  const totalMinutes = Object.values(studyDataByDay).reduce((sum, day) => sum + day.minutes, 0);
  return { year, month, today, monthName, days, activeDays, totalMinutes };
}

function CalendarCard({ onClick, isNested = false }) {
  const { year, today, monthName, days, activeDays } = getStudyCalendar();
  
  const Tag = isNested ? "div" : "button";
  const extraProps = isNested ? {} : { onClick };

  return (
    <Tag 
      className="metric-card calendar-card" 
      style={isNested ? { background: "transparent", border: "none", boxShadow: "none", padding: "14px 16px 16px" } : {}} 
      {...extraProps}
    >
      <div className="card-header-row">
        <CalendarDays />
        <span>Study rhythm</span>
      </div>
      <div className="calendar-header-title">
        <strong>{monthName} {year}</strong>
        <span className="streak-badge"><Flame size={12} /> 3 day streak</span>
      </div>
      <div className="calendar-grid-wrapper">
        <div className="weekdays-row">
          <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
        </div>
        <div className="calendar-days-grid">
          {days.map((day, idx) => {
            if (day === null) return <span key={`empty-${idx}`} className="day-cell empty" />;
            const isToday = day === today;
            const data = studyDataByDay[day];
            let cellClass = "";
            if (data) cellClass += ` ${data.type}`;
            if (isToday) cellClass += " today";
            return (
              <span key={`day-${day}`} className={`day-cell${cellClass}`}>
                {day}
                {isToday && <span className="today-dot" />}
              </span>
            );
          })}
        </div>
      </div>
      <span className="calendar-card-footer">
        {activeDays} active days this month · open calendar
      </span>
    </Tag>
  );
}

function StatsModal({ onClose, chapters }) {
  const { year, today, monthName, days, totalMinutes } = getStudyCalendar();
  const [selectedDay, setSelectedDay] = useState(today);
  const selectedData = studyDataByDay[selectedDay];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal wide-modal" onClick={(e) => e.stopPropagation()}>
        <Button className="icon-btn close-btn" aria-label="Close modal" onClick={onClose}><X size={16} /></Button>
        <div>
          <Pill tone="accent">Study Progress & Metrics</Pill>
          <h2 style={{ marginTop: "6px", marginBottom: "4px" }}>Study Rhythm & Progress Dashboard</h2>
        </div>
        
        <div className="stats-dashboard-grid">
          <div className="stats-left">
            <h3 className="modal-section-title">{monthName} {year} Calendar</h3>
            <div className="large-calendar-grid">
              <div className="weekdays-row" style={{ marginBottom: "6px" }}>
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>
              <div className="large-calendar-days">
                {days.map((day, idx) => {
                  if (day === null) return <span key={`empty-${idx}`} className="day-cell empty" />;
                  const isToday = day === today;
                  const data = studyDataByDay[day];
                  let cellClass = "";
                  if (data) cellClass += ` ${data.type}`;
                  if (isToday) cellClass += " today";
                  if (selectedDay === day) cellClass += " active-selected";
                  return (
                    <button 
                      key={`day-${day}`} 
                      className={`day-cell${cellClass}`}
                      onClick={() => setSelectedDay(day)}
                      style={selectedDay === day ? { borderColor: "var(--clay-dark)", borderWidth: "2px" } : {}}
                    >
                      {day}
                      {isToday && <span className="today-dot" />}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="calendar-legend">
              <div className="legend-item">
                <span className="legend-color none" />
                <span>No study</span>
              </div>
              <div className="legend-item">
                <span className="legend-color warm" />
                <span>Active study (0 - 60m)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color hot" />
                <span>Deep focus (60m+)</span>
              </div>
            </div>

            <div className="detail-bubble">
              <strong>{monthName} {selectedDay}, {year}</strong>
              {selectedData ? (
                <span>
                  Studied for <strong>{selectedData.minutes} minutes</strong>. Covered <strong>{selectedData.lessons} lessons</strong> and completed <strong>{selectedData.tests} practice tests</strong>.
                </span>
              ) : (
                <span>No study recorded for this day. Rest and recovery.</span>
              )}
            </div>
          </div>
          
          <div className="stats-right">
            <h3 className="modal-section-title">Performance Summary</h3>
            <div className="stats-summary-grid">
              <div className="stat-bubble">
                <span>Current Streak</span>
                <strong>3 Days</strong>
              </div>
              <div className="stat-bubble">
                <span>Max Streak</span>
                <strong>14 Days</strong>
              </div>
              <div className="stat-bubble">
                <span>Total Study Time</span>
                <strong>{(totalMinutes / 60).toFixed(1)} Hours</strong>
              </div>
              <div className="stat-bubble">
                <span>Worked Examples</span>
                <strong>32 Solved</strong>
              </div>
            </div>

            <h3 className="modal-section-title" style={{ marginTop: "8px" }}>Syllabus Coverage</h3>
            <div className="chapter-progress-list">
              {chapters.slice(0, 5).map((ch) => (
                <div key={ch.id} className="chapter-progress-item">
                  <div className="chapter-progress-header">
                    <span>Ch {ch.id}: {ch.name}</span>
                    <strong>{ch.progress}%</strong>
                  </div>
                  <div className="progress-line">
                    <i style={{ width: `${ch.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeaderboardModal({ onClose }) {
  const cohort = [
    { rank: 1, name: "Meera Shah", studyTime: "14h 22m", accuracy: "93%", score: "96", badges: 5, active: "18m ago" },
    { rank: 2, name: "Aarav Bhatia", studyTime: "12h 45m", accuracy: "86%", score: "91", badges: 4, active: "2m ago" },
    { rank: 3, name: "Dev Patel", studyTime: "11h 10m", accuracy: "89%", score: "89", badges: 4, active: "1h ago" },
    { rank: 4, name: "Kavya Rao", studyTime: "10h 30m", accuracy: "72%", score: "84", badges: 3, active: "11m ago" },
    { rank: 5, name: "Ananya Iyer", studyTime: "9h 55m", accuracy: "81%", score: "85", badges: 3, active: "Just now" },
    { rank: 6, name: "Kabir Mehta", studyTime: "8h 15m", accuracy: "51%", score: "76", badges: 2, active: "35m ago" },
    { rank: 7, name: "Ishaan Dubey", studyTime: "7h 40m", accuracy: "78%", score: "79", badges: 2, active: "2h ago" },
    { rank: 12, name: "Riya Sharma", studyTime: "5h 20m", accuracy: "79%", score: "88", badges: 3, active: "2m ago", isMe: true }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal wide-modal" style={{ maxWidth: "680px" }} onClick={(e) => e.stopPropagation()}>
        <Button className="icon-btn close-btn" aria-label="Close modal" onClick={onClose}><X size={16} /></Button>
        <div>
          <Pill tone="accent">Cohort Leaderboard</Pill>
          <h2 style={{ marginTop: "6px", marginBottom: "4px" }}>Board Intensive Rankings</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", margin: 0 }}>
            Compare your study time, board accuracy, and total tests solved against your batch.
          </p>
        </div>
        
        <div className="leaderboard-list">
          {cohort.map((student) => {
            const initials = student.name.split(" ").map(p => p[0]).join("");
            return (
              <div key={student.rank} className={`leaderboard-item${student.isMe ? " me" : ""}`}>
                <span className="leaderboard-rank">#{student.rank}</span>
                <span className="leaderboard-avatar">{initials}</span>
                <div className="leaderboard-info">
                  <span className="leaderboard-name">{student.name} {student.isMe && "(You)"}</span>
                  <span className="leaderboard-meta">Active {student.active} · {student.badges} badges</span>
                </div>
                <div className="leaderboard-stats">
                  <div>
                    <div style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)", fontWeight: 800 }}>Study Time</div>
                    <div style={{ fontWeight: 700 }}>{student.studyTime}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)", fontWeight: 800 }}>Accuracy</div>
                    <div style={{ fontWeight: 700 }}>{student.accuracy}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--muted)", fontWeight: 800 }}>Board Score</div>
                    <div className="leaderboard-score">{student.score}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ActivityRings() {
  const rings = [
    { value: 74, color: "#c95f42", label: "Progress" },
    { value: 62, color: "#d7a154", label: "Practice" },
    { value: 41, color: "#4f6f5e", label: "Tests" }
  ];

  return (
    <div className="activity-rings" aria-label="Study activity rings">
      <svg viewBox="0 0 120 120" role="img">
        {rings.map((ring, index) => {
          const radius = 49 - index * 13;
          const circumference = 2 * Math.PI * radius;
          const dash = (ring.value / 100) * circumference;
          return (
            <g key={ring.label}>
              <circle className="ring-track" cx="60" cy="60" r={radius} />
              <circle
                className="ring-fill"
                cx="60"
                cy="60"
                r={radius}
                stroke={ring.color}
                strokeDasharray={`${dash} ${circumference - dash}`}
              />
            </g>
          );
        })}
      </svg>
      <span>
        <b>3-ring pace</b>
        <small>Lessons · practice · tests</small>
      </span>
    </div>
  );
}

function Paywall({ onPay, onClose }) {
  return (
    <div className="overlay">
      <section className="modal paywall">
        <Pill tone="warning">Premium chapter</Pill>
        <h2>Unlock every lesson in the syllabus deck.</h2>
        <p>The trial shows the real portal with selected free topics. Continue with Full Access to open all chapters, notes, and worked examples.</p>
        <div className="modal-actions">
          <Button onClick={onClose}>Keep browsing</Button>
          <Button variant="primary" onClick={onPay}>Sign up and pay</Button>
        </div>
      </section>
    </div>
  );
}

function BatchModal({ onClose }) {
  const [code, setCode] = useState("");

  return (
    <div className="overlay">
      <section className="modal">
        <Button className="icon-btn close-btn" aria-label="Close" onClick={onClose}><X size={16} /></Button>
        <h2>Enter Batch Code</h2>
        <p>Link your account to a teacher-controlled school batch.</p>
        <input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="IBIS-26A" />
        <div className="modal-actions">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onClose}><Check size={16} /> Link batch</Button>
        </div>
      </section>
    </div>
  );
}

function ChapterView({ chapter, access, topicIndex, setTopicIndex, tab, setTab, onBack, onPay }) {
  const availableTopics = access === "full" ? chapter.topics : chapter.topics.filter((topic) => topic.isFree);
  const topic = availableTopics[topicIndex] || availableTopics[0] || chapter.topics[0];

  return (
    <section className="learning-shell">
      <header className="chapter-top">
        <Button className="icon-btn" aria-label="Back" onClick={onBack}><ArrowLeft size={18} /></Button>
        <ChapterImage chapter={chapter} className="tiny-cover" />
        <strong>{chapter.name}</strong>
        <Pill tone={access === "full" ? "accent" : "warning"}>{access === "full" ? "full access" : "free topics only"}</Pill>
      </header>
      <nav className="tabs" aria-label="Chapter tabs">
        {["content", "notes", "test"].map((item) => (
          <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
            {item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </nav>

      <div className="chapter-layout">
        <aside className="topic-list">
          <h3>Topics</h3>
          {chapter.topics.map((item) => {
            const locked = access !== "full" && !item.isFree;
            const visibleIndex = availableTopics.findIndex((topicItem) => topicItem.id === item.id);
            return (
              <button
                key={item.id}
                className={item.id === topic?.id ? "active" : ""}
                onClick={() => (locked ? onPay() : setTopicIndex(visibleIndex))}
              >
                <span>{item.name}</span>
                <small>{locked ? "Premium locked" : `${item.videos.length} videos · ${item.notes.length} notes`}</small>
              </button>
            );
          })}
        </aside>
        <section className="topic-content">
          {tab === "content" && <ContentTab topic={topic} />}
          {tab === "notes" && <NotesTab topic={topic} />}
          {tab === "test" && <TestTab />}
        </section>
      </div>
    </section>
  );
}

function ContentTab({ topic }) {
  return (
    <>
      <div className="section-title">
        <h2>{topic.name}</h2>
        <Pill>{topic.videos.length} videos</Pill>
      </div>
      <div className="stack">
        {topic.videos.map((video) => <VideoCard key={video.id} video={video} />)}
      </div>
      {topic.examples.length > 0 && (
        <>
          <div className="section-title divided">
            <h2>Worked Examples</h2>
            <Pill>{topic.examples.length} added</Pill>
          </div>
          <div className="stack">
            {topic.examples.map((video) => <VideoCard key={video.id} video={video} faint />)}
          </div>
        </>
      )}
    </>
  );
}

function VideoCard({ video, faint = false }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button 
        initial={{ scale: 1 }}
        whileTap={{ scale: 0.98 }}
        className={`video-card ${faint ? "faint" : ""} group`} 
        onClick={() => setOpen(true)}
        style={{ cursor: "pointer" }}
      >
        <span className="play-thumb">
          <img src={getYouTubeThumbnail(video.url)} alt="" className="transition-transform duration-300 group-hover:scale-105" />
          <i><Play size={14} className="fill-current" style={{ marginLeft: "1.5px" }} /></i>
        </span>
        <span>
          <strong>{video.label}</strong>
          <small>{video.title}</small>
        </span>
        <em>{video.duration}</em>
      </motion.button>
      
      <AnimatePresence>
        {open && <VideoModal video={video} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function VideoModal({ video, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <motion.div 
      className="overlay video-overlay" 
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section 
        className="video-modal" 
        onClick={(event) => event.stopPropagation()}
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.82, opacity: 0 }}
        transition={{ type: "spring", duration: 0.45, bounce: 0.08 }}
      >
        <Button className="icon-btn close-btn" aria-label="Close video" onClick={onClose}><X size={16} /></Button>
        <iframe
          src={getYouTubeEmbed(video.url)}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
        <div>
          <strong>{video.label}</strong>
          <span>{video.title}</span>
        </div>
      </motion.section>
    </motion.div>
  );
}

function NotesTab({ topic }) {
  const note = topic.notes[0];
  if (!note) {
    return (
      <div className="empty-state">
        <FileText size={36} />
        <h2>Notes coming soon</h2>
        <p>The mentor has not attached notes for this topic yet.</p>
      </div>
    );
  }

  return (
    <div className="pdf-panel">
      {note.type === "latex" ? (
        <React.Suspense fallback={<LatexFallback />}>
          <LatexDocument title={note.title} source={note.content} />
        </React.Suspense>
      ) : (
        <>
          <div className="pdf-toolbar">
            <Button className="icon-btn" aria-label="Previous page"><ArrowLeft size={16} /></Button>
            <span>{note.title} · uploaded PDF</span>
            <Button className="icon-btn" aria-label="Next page"><ArrowRight size={16} /></Button>
            <div className="toolbar-end">
              <Button className="icon-btn" aria-label="Zoom in"><ZoomIn size={16} /></Button>
              <Button className="icon-btn" aria-label="Zoom out"><ZoomOut size={16} /></Button>
              <Button className="icon-btn" aria-label="Download"><Download size={16} /></Button>
            </div>
          </div>
          <article className="pdf-page">
            <h2>{topic.name}</h2>
            <p>{note.content}</p>
          </article>
        </>
      )}
    </div>
  );
}

function LatexFallback({ compact = false }) {
  return (
    <section className={`latex-document ${compact ? "compact" : ""}`} aria-busy="true">
      <div className="pdf-toolbar">
        <span>Loading notes preview...</span>
      </div>
      <article className="latex-page">
        <p>Preparing LaTeX renderer.</p>
      </article>
    </section>
  );
}

function TestTab() {
  return (
    <div className="empty-state">
      <Award size={36} />
      <h2>Not enough content covered yet</h2>
      <p>Check back soon. Test management is planned for a future update.</p>
    </div>
  );
}

function AdminPanel({
  chapters,
  setChapters,
  chapterIndex,
  setChapterIndex,
  topicIndex,
  setTopicIndex,
  activeTab,
  setActiveTab,
  onBatch,
  onLogout
}) {
  const chapter = chapters[chapterIndex] || chapters[0];
  const topic = chapter?.topics[topicIndex] || chapter?.topics[0];
  const [newChapter, setNewChapter] = useState("");
  const [newTopic, setNewTopic] = useState("");

  const updateChapter = (chapterId, updater) => {
    setChapters((items) => items.map((item) => item.id === chapterId ? updater(item) : item));
  };

  const addChapter = () => {
    const name = newChapter.trim();
    if (!name) return;
    const image = chapters[chapters.length % initialChapters.length].image;
    setChapters((items) => [...items, { id: Date.now(), name, image, progress: 0, topics: [] }]);
    setNewChapter("");
  };

  const deleteChapter = (id) => {
    setChapters((items) => items.filter((item) => item.id !== id));
    setChapterIndex(0);
    setTopicIndex(0);
  };

  const moveChapter = (index, direction) => {
    setChapters((items) => reorder(items, index, direction));
    setChapterIndex((value) => Math.max(0, Math.min(chapters.length - 1, value + direction)));
  };

  const addTopic = () => {
    const name = newTopic.trim();
    if (!name) return;
    updateChapter(chapter.id, (item) => ({
      ...item,
      topics: [...item.topics, buildTopic(item.id, name, item.topics.length)]
    }));
    setNewTopic("");
  };

  const updateTopic = (topicId, updater) => {
    updateChapter(chapter.id, (item) => ({
      ...item,
      topics: item.topics.map((topicItem) => topicItem.id === topicId ? updater(topicItem) : topicItem)
    }));
  };

  const deleteTopic = (topicId) => {
    updateChapter(chapter.id, (item) => ({
      ...item,
      topics: item.topics.filter((topicItem) => topicItem.id !== topicId)
    }));
    setTopicIndex(0);
  };

  const moveTopic = (index, direction) => {
    updateChapter(chapter.id, (item) => ({ ...item, topics: reorder(item.topics, index, direction) }));
    setTopicIndex(Math.max(0, Math.min(chapter.topics.length - 1, topicIndex + direction)));
  };

  return (
    <section className="admin-shell">
      <header className="topbar admin-bar">
        <Brand admin />
        <div className="top-actions">
          <Button variant="primary" onClick={onBatch}><Users size={16} /> Full control</Button>
          <Button onClick={onLogout}><LogOut size={16} /> Log out</Button>
        </div>
      </header>

      <div className="admin-grid">
        <AdminColumn title="Chapters" badge={`${chapters.length} total`}>
          {chapters.map((item, index) => (
            <AdminRow
              key={item.id}
              active={index === chapterIndex}
              image={item.image}
              title={item.name}
              subtitle={`${item.topics.length} topics`}
              onSelect={() => { setChapterIndex(index); setTopicIndex(0); }}
              onRename={(name) => updateChapter(item.id, (chapterItem) => ({ ...chapterItem, name }))}
              onUp={() => moveChapter(index, -1)}
              onDown={() => moveChapter(index, 1)}
              onDelete={() => deleteChapter(item.id)}
            />
          ))}
          <div className="inline-add">
            <input value={newChapter} onChange={(event) => setNewChapter(event.target.value)} placeholder="New chapter name" />
            <Button variant="ghost" onClick={addChapter}><Plus size={16} /> Add chapter</Button>
          </div>
        </AdminColumn>

        <AdminColumn title="Topics" badge={chapter?.name}>
          {chapter?.topics.map((item, index) => (
            <AdminRow
              key={item.id}
              active={index === topicIndex}
              title={item.name}
              subtitle={item.isFree ? "free trial topic" : "student-visible"}
              onSelect={() => setTopicIndex(index)}
              onRename={(name) => updateTopic(item.id, (topicItem) => ({ ...topicItem, name }))}
              onUp={() => moveTopic(index, -1)}
              onDown={() => moveTopic(index, 1)}
              onDelete={() => deleteTopic(item.id)}
            />
          ))}
          <div className="inline-add">
            <input value={newTopic} onChange={(event) => setNewTopic(event.target.value)} placeholder="New topic name" />
            <Button variant="ghost" onClick={addTopic}><Plus size={16} /> Add topic</Button>
          </div>
        </AdminColumn>

        <section className="editor-panel">
          <div className="editor-heading">
            <span>
              <small>Topic editor</small>
              <strong>{topic?.name || "Select a topic"}</strong>
            </span>
            <Pill tone="accent">live local changes</Pill>
          </div>
          <nav className="tabs compact">
            {["videos", "worked", "notes", "test"].map((item) => (
              <button
                key={item}
                className={activeTab === item ? "active" : ""}
                disabled={item === "test"}
                onClick={() => setActiveTab(item)}
              >
                {item === "worked" ? "Worked examples" : item === "test" ? "Test · future" : item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </nav>
          {topic && activeTab === "notes" && <AdminNotes topic={topic} updateTopic={updateTopic} />}
          {topic && activeTab !== "notes" && <AdminVideos type={activeTab} topic={topic} updateTopic={updateTopic} />}
        </section>
      </div>
    </section>
  );
}

function reorder(items, index, direction) {
  const next = [...items];
  const target = index + direction;
  if (target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function AdminColumn({ title, badge, children }) {
  return (
    <section className="admin-column">
      <div className="admin-column-head">
        <h2>{title}</h2>
        {badge && <small>{badge}</small>}
      </div>
      {children}
    </section>
  );
}

function AdminRow({ title, subtitle, image, active, onSelect, onRename, onUp, onDown, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);

  useEffect(() => setDraft(title), [title]);

  return (
    <article className={`admin-row ${active ? "active" : ""}`} title={title}>
      {image && <img src={image} alt="" loading="lazy" decoding="async" />}
      <button className="row-main" onClick={onSelect}>
        {editing ? (
          <input
            value={draft}
            autoFocus
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => { onRename(draft.trim() || title); setEditing(false); }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onRename(draft.trim() || title);
                setEditing(false);
              }
            }}
          />
        ) : (
          <>
            <strong>{title}</strong>
            <small>{subtitle}</small>
          </>
        )}
      </button>
      <div className="row-actions">
        <button aria-label="Move up" onClick={onUp}><ArrowUp size={14} /></button>
        <button aria-label="Move down" onClick={onDown}><ArrowDown size={14} /></button>
        <button aria-label="Edit" onClick={() => setEditing(true)}><Edit3 size={14} /></button>
        <button aria-label="Delete" onClick={onDelete}><Trash2 size={14} /></button>
      </div>
    </article>
  );
}

function AdminVideos({ type, topic, updateTopic }) {
  const field = type === "worked" ? "examples" : "videos";
  const label = type === "worked" ? "worked example" : "video";
  const [url, setUrl] = useState("");

  const updateMedia = (id, patch) => {
    updateTopic(topic.id, (topicItem) => ({
      ...topicItem,
      [field]: topicItem[field].map((item) => item.id === id ? { ...item, ...patch } : item)
    }));
  };

  const addMedia = () => {
    if (!url.trim()) return;
    updateTopic(topic.id, (topicItem) => ({
      ...topicItem,
      [field]: [
        ...topicItem[field],
        {
          id: `${field}-${Date.now()}`,
          label: label === "video" ? "New lesson" : "New worked example",
          title: "Editable title field",
          url,
          duration: "10 min"
        }
      ]
    }));
    setUrl("");
  };

  const removeMedia = (id) => {
    updateTopic(topic.id, (topicItem) => ({ ...topicItem, [field]: topicItem[field].filter((item) => item.id !== id) }));
  };

  const moveMedia = (index, direction) => {
    updateTopic(topic.id, (topicItem) => ({ ...topicItem, [field]: reorder(topicItem[field], index, direction) }));
  };

  return (
    <div className="editor-body">
      <div className="input-row">
        <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder={`Paste YouTube link for a ${label}...`} />
        <Button variant="primary" onClick={addMedia}>Add</Button>
      </div>
      {topic[field].map((item, index) => (
        <article className="editable-card" key={item.id}>
          <span className="thumb">
            <img src={getYouTubeThumbnail(item.url)} alt="" />
            <i><Video size={14} /></i>
          </span>
          <input value={item.label} onChange={(event) => updateMedia(item.id, { label: event.target.value })} />
          <input value={item.title} onChange={(event) => updateMedia(item.id, { title: event.target.value })} />
          <button aria-label="Move up" onClick={() => moveMedia(index, -1)}><ArrowUp size={14} /></button>
          <button aria-label="Move down" onClick={() => moveMedia(index, 1)}><ArrowDown size={14} /></button>
          <button aria-label="Delete" onClick={() => removeMedia(item.id)}><Trash2 size={14} /></button>
        </article>
      ))}
    </div>
  );
}

function UploadIllustration() {
  return (
    <span className="upload-illustration" aria-hidden="true">
      <Upload size={22} />
      <i />
      <i />
    </span>
  );
}

function AdminNotes({ topic, updateTopic }) {
  const [latex, setLatex] = useState(topic.notes[0]?.content || "\\[ F = qE \\]");
  const [dragging, setDragging] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("PDF only · multiple files supported");
  const publishedLatex = topic.notes.find((note) => note.type === "latex");

  useEffect(() => {
    setLatex(publishedLatex?.content || "\\section*{New Notes}\\nType your LaTeX here.\\n\\[ F = qE \\]");
  }, [topic.id]);

  const addPdfFiles = (files) => {
    if (!files.length) return;
    setUploadMessage(`${files.length} file${files.length > 1 ? "s" : ""} added locally`);
    updateTopic(topic.id, (topicItem) => ({
      ...topicItem,
      notes: [
        ...topicItem.notes,
        ...files.map((file) => ({ id: `pdf-${Date.now()}-${file.name}`, title: file.name, type: "pdf", content: "Uploaded PDF preview" }))
      ]
    }));
  };

  const addPdf = (event) => {
    addPdfFiles(Array.from(event.target.files || []));
  };

  const publishLatex = () => {
    updateTopic(topic.id, (topicItem) => ({
      ...topicItem,
      notes: [
        { id: `latex-${Date.now()}`, title: `${topicItem.name} LaTeX notes`, type: "latex", content: latex },
        ...topicItem.notes.filter((note) => note.type !== "latex")
      ]
    }));
  };

  const deleteNote = (noteId) => {
    updateTopic(topic.id, (topicItem) => ({ ...topicItem, notes: topicItem.notes.filter((note) => note.id !== noteId) }));
  };

  return (
    <div className="notes-editor">
      <section>
        <h3>Option A · Upload PDF</h3>
        <label
          className={`upload-box ${dragging ? "dragging" : ""}`}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            addPdfFiles(Array.from(event.dataTransfer.files || []).filter((file) => file.type === "application/pdf"));
          }}
        >
          <UploadIllustration />
          <span>Drop notes PDFs or choose files</span>
          <small>{uploadMessage}</small>
          <input type="file" accept="application/pdf" multiple onChange={addPdf} />
        </label>
      </section>
      <section>
        <h3>Option B · Paste LaTeX</h3>
        <textarea value={latex} onChange={(event) => setLatex(event.target.value)} />
        <Button variant="primary" onClick={publishLatex}><Save size={16} /> Publish to students</Button>
      </section>
      <article className="latex-preview">
        <strong>Live preview</strong>
        <React.Suspense fallback={<LatexFallback compact />}>
          <LatexDocument title={`${topic.name} preview`} source={latex} compact />
        </React.Suspense>
      </article>
      <div className="note-list">
        {topic.notes.map((note) => (
          <article key={note.id}>
            <FileText size={16} />
            <span>{note.title}</span>
            <Button className="icon-btn" aria-label="Delete note" onClick={() => deleteNote(note.id)}><Trash2 size={14} /></Button>
          </article>
        ))}
      </div>
    </div>
  );
}

function BatchControl({ onBack }) {
  const [batches, setBatches] = useState(initialBatches);
  const [selected, setSelected] = useState(0);
  const [school, setSchool] = useState("");
  const [batchName, setBatchName] = useState("");
  const [expandedStudent, setExpandedStudent] = useState(null);

  const createBatch = () => {
    if (!school.trim() || !batchName.trim()) return;
    const code = `IBIS-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setBatches((items) => [...items, { id: code, school, name: batchName, code, count: 0 }]);
    setSelected(batches.length);
    setSchool("");
    setBatchName("");
  };

  const activeBatch = batches[selected];

  return (
    <section className="batch-shell">
      <header className="topbar">
        <Button className="icon-btn" aria-label="Back" onClick={onBack}><ArrowLeft size={18} /></Button>
        <strong>Batch & Student Control</strong>
      </header>
      <div className="batch-grid">
        <aside className="batch-side">
          <article className="metric-card compact-card">
            <Users />
            <span>Total students</span>
            <strong>{batches.reduce((sum, item) => sum + item.count, 0)}</strong>
            <small>Recent signup: Riya Sharma · 2 min ago</small>
          </article>
          <article className="activity-card">
            <h3>Live activity</h3>
            <p>Arjun joined Batch A</p>
            <p>Kavya completed Magnetism</p>
            <p>Meera scored 96 in quiz</p>
          </article>
          <h3>Batch containers</h3>
          {batches.map((batch, index) => (
            <button className={`batch-row ${index === selected ? "active" : ""}`} key={batch.id} onClick={() => setSelected(index)}>
              <strong>{batch.school} · {batch.name}</strong>
              <small>{batch.count} students · code {batch.code}</small>
            </button>
          ))}
          <div className="create-batch">
            <input value={school} onChange={(event) => setSchool(event.target.value)} placeholder="School name" />
            <input value={batchName} onChange={(event) => setBatchName(event.target.value)} placeholder="Batch name / year" />
            <Button variant="ghost" onClick={createBatch}><Plus size={16} /> Create batch</Button>
          </div>
        </aside>

        <section className="student-table">
          <div className="table-head">
            <h2>{activeBatch.name} · {activeBatch.school}</h2>
            <Pill>{activeBatch.count} students</Pill>
          </div>
          {initialStudents.map((student, index) => (
            <StudentRow
              key={student[0]}
              student={student}
              expanded={expandedStudent === index}
              onClick={() => setExpandedStudent(expandedStudent === index ? null : index)}
            />
          ))}
        </section>
      </div>
    </section>
  );
}

function StudentRow({ student, expanded, onClick }) {
  const initials = student[0].split(" ").map((part) => part[0]).join("");
  return (
    <article className={`student-row ${expanded ? "expanded" : ""}`} onClick={onClick}>
      <span className="avatar">{initials}</span>
      <strong>{student[0]}</strong>
      <span>{student[1]}</span>
      <span>{student[2]}</span>
      <span>{student[3]}</span>
      <small>{student[4]}</small>
      {expanded && <p>Chapter detail: Electric Charges 92%, Current Electricity 78%, Ray Optics 54%.</p>}
    </article>
  );
}

function Pupil({ size = 12, maxDistance = 5, pupilColor = "black", forceLookX, forceLookY }) {
  const pupilPosition = {
    x: forceLookX ?? 0,
    y: forceLookY ?? 0
  };

  return (
    <div
      className="signup-pupil"
      data-max-distance={maxDistance}
      data-force-look={forceLookX !== undefined && forceLookY !== undefined ? "true" : undefined}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`
      }}
    />
  );
}

function EyeBall({
  size = 48,
  pupilSize = 16,
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "black",
  isBlinking = false,
  forceLookX,
  forceLookY
}) {
  const pupilPosition = {
    x: forceLookX ?? 0,
    y: forceLookY ?? 0
  };

  return (
    <div
      className="signup-eye-ball"
      data-max-distance={maxDistance}
      style={{
        width: `${size}px`,
        height: isBlinking ? "2px" : `${size}px`,
        backgroundColor: eyeColor
      }}
    >
      {!isBlinking && (
        <div
          className="signup-pupil"
          data-force-look={forceLookX !== undefined && forceLookY !== undefined ? "true" : undefined}
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`
          }}
        />
      )}
    </div>
  );
}

function updateSignupPupils(root, clientX, clientY) {
  if (!root) return;

  root.querySelectorAll(".signup-pupil").forEach((pupil) => {
    if (pupil.dataset.forceLook === "true") return;
    const trackingBox = pupil.closest(".signup-eye-ball") || pupil.parentElement;
    if (!trackingBox) return;

    const rect = trackingBox.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const maxDistance = Number(pupil.dataset.maxDistance || trackingBox.dataset.maxDistance || 5);
    const distance = Math.min(Math.hypot(deltaX, deltaY), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);

    pupil.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
  });
}

function SignupCharacters({ password, showPassword, isTyping }) {
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);
  const stageRef = useRef(null);
  const purpleRef = useRef(null);
  const blackRef = useRef(null);
  const yellowRef = useRef(null);
  const orangeRef = useRef(null);
  const purpleEyesRef = useRef(null);
  const blackEyesRef = useRef(null);
  const orangeEyesRef = useRef(null);
  const yellowEyesRef = useRef(null);
  const yellowMouthRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const passwordVisible = password.length > 0 && showPassword;
  const passwordHidden = password.length > 0 && !showPassword;

  useEffect(() => {
    const getPosition = (ref, clientX, clientY) => {
      if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 3;
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;

      return {
        faceX: Math.max(-15, Math.min(15, deltaX / 20)),
        faceY: Math.max(-10, Math.min(10, deltaY / 30)),
        bodySkew: Math.max(-6, Math.min(6, -deltaX / 120))
      };
    };

    const setEyes = (node, left, top) => {
      if (!node) return;
      node.style.left = `${left}px`;
      node.style.top = `${top}px`;
    };

    const applyMotion = () => {
      const { x, y } = pointerRef.current;
      const purplePos = getPosition(purpleRef, x, y);
      const blackPos = getPosition(blackRef, x, y);
      const yellowPos = getPosition(yellowRef, x, y);
      const orangePos = getPosition(orangeRef, x, y);

      if (purpleRef.current) {
        purpleRef.current.style.height = (isTyping || passwordHidden) ? "440px" : "400px";
        purpleRef.current.style.transform = passwordVisible
          ? "skewX(0deg)"
          : (isTyping || passwordHidden)
            ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)`
            : `skewX(${purplePos.bodySkew || 0}deg)`;
      }

      if (blackRef.current) {
        blackRef.current.style.transform = passwordVisible
          ? "skewX(0deg)"
          : isLookingAtEachOther
            ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
            : (isTyping || passwordHidden)
              ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)`
              : `skewX(${blackPos.bodySkew || 0}deg)`;
      }

      if (orangeRef.current) {
        orangeRef.current.style.transform = passwordVisible ? "skewX(0deg)" : `skewX(${orangePos.bodySkew || 0}deg)`;
      }

      if (yellowRef.current) {
        yellowRef.current.style.transform = passwordVisible ? "skewX(0deg)" : `skewX(${yellowPos.bodySkew || 0}deg)`;
      }

      setEyes(purpleEyesRef.current, passwordVisible ? 20 : isLookingAtEachOther ? 55 : 45 + purplePos.faceX, passwordVisible ? 35 : isLookingAtEachOther ? 65 : 40 + purplePos.faceY);
      setEyes(blackEyesRef.current, passwordVisible ? 10 : isLookingAtEachOther ? 32 : 26 + blackPos.faceX, passwordVisible ? 28 : isLookingAtEachOther ? 12 : 32 + blackPos.faceY);
      setEyes(orangeEyesRef.current, passwordVisible ? 50 : 82 + orangePos.faceX, passwordVisible ? 85 : 90 + orangePos.faceY);
      setEyes(yellowEyesRef.current, passwordVisible ? 20 : 52 + yellowPos.faceX, passwordVisible ? 35 : 40 + yellowPos.faceY);

      if (yellowMouthRef.current) {
        yellowMouthRef.current.style.left = `${passwordVisible ? 10 : 40 + yellowPos.faceX}px`;
        yellowMouthRef.current.style.top = `${passwordVisible ? 88 : 88 + yellowPos.faceY}px`;
      }

      updateSignupPupils(stageRef.current, x, y);
    };

    const scheduleMotion = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        applyMotion();
      });
    };

    if (!pointerRef.current.x && !pointerRef.current.y) {
      pointerRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }

    const handleMouseMove = (event) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      scheduleMotion();
    };

    applyMotion();
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [passwordVisible, passwordHidden, isTyping, isLookingAtEachOther, isPurplePeeking, isPurpleBlinking, isBlackBlinking]);

  useEffect(() => {
    const scheduleBlink = () => {
      const blinkTimeout = window.setTimeout(() => {
        setIsPurpleBlinking(true);
        window.setTimeout(() => {
          setIsPurpleBlinking(false);
          scheduleBlink();
        }, 150);
      }, Math.random() * 4000 + 3000);

      return blinkTimeout;
    };

    const timeout = scheduleBlink();
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const scheduleBlink = () => {
      const blinkTimeout = window.setTimeout(() => {
        setIsBlackBlinking(true);
        window.setTimeout(() => {
          setIsBlackBlinking(false);
          scheduleBlink();
        }, 150);
      }, Math.random() * 4000 + 3000);

      return blinkTimeout;
    };

    const timeout = scheduleBlink();
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isTyping) {
      setIsLookingAtEachOther(false);
      return undefined;
    }

    setIsLookingAtEachOther(true);
    const timer = window.setTimeout(() => setIsLookingAtEachOther(false), 800);
    return () => window.clearTimeout(timer);
  }, [isTyping]);

  useEffect(() => {
    if (!(password.length > 0 && showPassword)) {
      setIsPurplePeeking(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setIsPurplePeeking(true);
      window.setTimeout(() => setIsPurplePeeking(false), 800);
    }, Math.random() * 3000 + 2000);

    return () => window.clearTimeout(timer);
  }, [password, showPassword, isPurplePeeking]);

  return (
    <div ref={stageRef} className="signup-character-stage">
      <div
        ref={purpleRef}
        className="signup-character signup-purple"
        style={{
          height: (isTyping || passwordHidden) ? "440px" : "400px",
          transform: passwordVisible ? "skewX(0deg)" : (isTyping || passwordHidden) ? "skewX(-12deg) translateX(40px)" : "skewX(0deg)"
        }}
      >
        <div
          ref={purpleEyesRef}
          className="signup-eyes signup-purple-eyes"
          style={{
            left: passwordVisible ? "20px" : isLookingAtEachOther ? "55px" : "45px",
            top: passwordVisible ? "35px" : isLookingAtEachOther ? "65px" : "40px"
          }}
        >
          <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isPurpleBlinking} forceLookX={passwordVisible ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined} forceLookY={passwordVisible ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
          <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isPurpleBlinking} forceLookX={passwordVisible ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined} forceLookY={passwordVisible ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
        </div>
      </div>

      <div
        ref={blackRef}
        className="signup-character signup-black"
        style={{
          transform: passwordVisible
            ? "skewX(0deg)"
            : isLookingAtEachOther
              ? "skewX(10deg) translateX(20px)"
              : (isTyping || passwordHidden)
                ? "skewX(0deg)"
                : "skewX(0deg)"
        }}
      >
        <div
          ref={blackEyesRef}
          className="signup-eyes signup-black-eyes"
          style={{
            left: passwordVisible ? "10px" : isLookingAtEachOther ? "32px" : "26px",
            top: passwordVisible ? "28px" : isLookingAtEachOther ? "12px" : "32px"
          }}
        >
          <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isBlackBlinking} forceLookX={passwordVisible ? -4 : isLookingAtEachOther ? 0 : undefined} forceLookY={passwordVisible ? -4 : isLookingAtEachOther ? -4 : undefined} />
          <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isBlackBlinking} forceLookX={passwordVisible ? -4 : isLookingAtEachOther ? 0 : undefined} forceLookY={passwordVisible ? -4 : isLookingAtEachOther ? -4 : undefined} />
        </div>
      </div>

      <div
        ref={orangeRef}
        className="signup-character signup-orange"
        style={{ transform: "skewX(0deg)" }}
      >
        <div
          ref={orangeEyesRef}
          className="signup-eyes signup-orange-eyes"
          style={{
            left: passwordVisible ? "50px" : "82px",
            top: passwordVisible ? "85px" : "90px"
          }}
        >
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={passwordVisible ? -5 : undefined} forceLookY={passwordVisible ? -4 : undefined} />
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={passwordVisible ? -5 : undefined} forceLookY={passwordVisible ? -4 : undefined} />
        </div>
      </div>

      <div
        ref={yellowRef}
        className="signup-character signup-yellow"
        style={{ transform: "skewX(0deg)" }}
      >
        <div
          ref={yellowEyesRef}
          className="signup-eyes signup-yellow-eyes"
          style={{
            left: passwordVisible ? "20px" : "52px",
            top: passwordVisible ? "35px" : "40px"
          }}
        >
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={passwordVisible ? -5 : undefined} forceLookY={passwordVisible ? -4 : undefined} />
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={passwordVisible ? -5 : undefined} forceLookY={passwordVisible ? -4 : undefined} />
        </div>
        <div
          ref={yellowMouthRef}
          className="signup-yellow-mouth"
          style={{
            left: passwordVisible ? "10px" : "40px",
            top: "88px"
          }}
        />
      </div>
    </div>
  );
}

function Signup({ onBack, onPay, onLogin, onLegal }) {
  const [authMode, setAuthMode] = useState("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isTyping = studentName.length > 0 || email.length > 0 || password.length > 0;
  const isLogin = authMode === "login";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    setIsLoading(false);
    if (isLogin) {
      onLogin();
    } else {
      onPay();
    }
  };

  const switchMode = (mode) => {
    setAuthMode(mode);
    setShowPassword(false);
  };

  return (
    <section className="signup-screen">
      <div className="auth-terminal-bg" aria-hidden="true">
        <React.Suspense fallback={<span className="auth-terminal-fallback" />}>
          <FaultyTerminal
            scale={1.5}
            gridMul={[2, 1]}
            digitSize={1.2}
            timeScale={0.5}
            scanlineIntensity={0.5}
            glitchAmount={1}
            flickerAmount={1}
            noiseAmp={1}
            chromaticAberration={0}
            dither={0}
            curvature={0.1}
            tint="#9b3f24"
            mouseStrength={0.5}
            brightness={0.72}
            transparent
          />
        </React.Suspense>
      </div>
      <div className="signup-shell">
        <div className="signup-visual-panel">
          <div className="signup-visual-top">
            <Brand compact />
          </div>

          <div className="signup-character-wrap">
            <SignupCharacters password={password} showPassword={showPassword} isTyping={isTyping} />
          </div>

          <div className="signup-panel-footer">
            <button type="button" onClick={() => onLegal("privacy")}>Privacy Policy</button>
            <button type="button" onClick={() => onLegal("terms")}>Terms of Service</button>
            <button type="button" onClick={() => onLegal("contact")}>Contact</button>
          </div>
        </div>

        <div className="signup-form-panel">
          <form className="signup-form-card" onSubmit={handleSubmit}>
            <Button type="button" className="icon-btn signup-back-btn" aria-label="Back" onClick={onBack}>
              <ArrowLeft size={18} />
            </Button>

            <div className="auth-mode-tabs" aria-label="Choose account action">
              <div className={`auth-mode-tabs-slider ${isLogin ? "is-login" : "is-signup"}`} />
              <button type="button" className={!isLogin ? "active" : ""} onClick={() => switchMode("signup")}>Sign up</button>
              <button type="button" className={isLogin ? "active" : ""} onClick={() => switchMode("login")}>Login</button>
            </div>

            <div className="signup-form-heading">
              <span className="auth-kicker">{isLogin ? "Student access" : "Create student account"}</span>
              <h1>{isLogin ? "Welcome back to Ibis" : "Start learning with Ibis"}</h1>
              <p>
                {isLogin
                  ? "Login to reopen your classes, progress, tests, and teacher updates."
                  : "Create your portal account, then choose the plan or batch access that fits you."}
              </p>
            </div>

            {!isLogin && (
              <label className="signup-field">
                <span>Student name</span>
                <div className="signup-glass-input">
                  <Users size={18} />
                  <input
                    required
                    type="text"
                    placeholder="Your name"
                    value={studentName}
                    onChange={(event) => setStudentName(event.target.value)}
                  />
                </div>
              </label>
            )}

            <label className="signup-field">
              <span>Email</span>
              <div className="signup-glass-input">
                <Mail size={18} />
                <input
                  required
                  type="email"
                  placeholder="anna@gmail.com"
                  value={email}
                  autoComplete="off"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </label>

            <label className="signup-field">
              <span>Password</span>
              <div className="signup-glass-input signup-password-wrap">
                <Lock size={18} />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((current) => !current)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </label>

            <div className="signup-options">
              <label>
                <input type="checkbox" />
                <span>Remember for 30 days</span>
              </label>
              {isLogin ? <button type="button">Forgot password?</button> : <span className="signup-secure-note"><Lock size={13} /> Secure checkout next</span>}
            </div>

            <GlassButton type="submit" size="default" className="auth-cta-glass" contentClassName="auth-cta-glass-text" disabled={isLoading}>
              <span>{isLoading ? (isLogin ? "Logging in..." : "Creating account...") : (isLogin ? "Login to portal" : "Continue to plans")}</span>
              <ArrowRight size={18} />
            </GlassButton>

            <button type="button" className="auth-switch-copy" onClick={() => switchMode(isLogin ? "signup" : "login")}>
              {isLogin ? "New to Ibis? Create a student account" : "Already have an account? Login"}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}

function LegalInfoPage({ page, onBack }) {
  const [activePage, setActivePage] = useState(page);
  const content = {
    privacy: {
      title: "Privacy Policy",
      eyebrow: "Student data, handled with restraint",
      summary: "Ibis Physics collects only the details needed to run your learning portal, plan access, progress tracking, batch support, and payment flow.",
      paragraphs: [
        "Your name, email, batch details, teacher code, and payment status are used only to identify your account and keep your learning access accurate.",
        "Progress signals such as lessons opened, tests attempted, notes viewed, and study history help the portal make your preparation clearer and more personal.",
        "We do not sell student data or turn private progress into public ranking. Access stays limited to the student, mentor, and support workflows that genuinely need it."
      ],
      promise: "The principle is simple: keep the portal useful, keep the data minimal, and keep every student’s academic trail private."
    },
    terms: {
      title: "Terms of Service",
      eyebrow: "Clear rules for a focused classroom",
      summary: "By using Ibis Physics, you agree to use the lessons, notes, tests, and portal tools for your own preparation and assigned batch access.",
      paragraphs: [
        "Your account is personal to you. Sharing credentials, batch codes, paid lessons, notes, or recorded material can lead to paused or removed access.",
        "Some checkout and portal flows may be demos while the platform is being built. Final payments should happen only through verified Ibis Physics channels.",
        "All lessons, PDFs, videos, tests, and study tracks are created for enrolled students. They are learning material, not content for redistribution."
      ],
      promise: "The goal is a serious learning space: respectful use, honest access, and no noise around the work that matters."
    },
    contact: {
      title: "Contact",
      eyebrow: "Support that knows the classroom",
      summary: "For batch access, payment help, account recovery, or study guidance, contact Ibis Physics using the same email connected to your portal.",
      paragraphs: [
        "For account or payment help, send your name, registered email, and batch name if you have one. That gives support enough context to respond properly.",
        "For a lesson, test, or notes issue, mention the chapter and the action you were trying to complete. Clear context helps us fix the right thing faster.",
        "For parent or school enquiries, include the student’s class details and a callback number so the response can stay practical and specific."
      ],
      promise: "Support is designed to be direct and practical, so students get back to physics instead of chasing portal confusion."
    }
  };
  const active = content[activePage] || content.privacy;

  return (
    <section className={`legal-screen legal-${activePage}`}>
      <div className="legal-layout">
        <header className="legal-topbar">
          <Button type="button" className="legal-back-btn" aria-label="Back to signup" onClick={onBack}>
            <ArrowLeft size={18} />
            <span>Back to signup</span>
          </Button>
          <Brand compact />
          <nav className="legal-actions" aria-label="Legal sections">
            <button type="button" className={activePage === "privacy" ? "active" : ""} onClick={() => setActivePage("privacy")}>Privacy</button>
            <button type="button" className={activePage === "terms" ? "active" : ""} onClick={() => setActivePage("terms")}>Terms</button>
            <button type="button" className={activePage === "contact" ? "active" : ""} onClick={() => setActivePage("contact")}>Contact</button>
          </nav>
        </header>

        <div className="legal-hero" key={activePage}>
          <div className="legal-title-block">
            <h1>{active.title}</h1>
            <p>{active.summary}</p>
          </div>

          <div className="legal-prose">
            {active.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="legal-closing">
            <Check size={18} />
            <p>{active.promise}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const LightCheckIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="8" fill="#201611" />
    <path
      d="M5.5 8.5L7 10L11 6"
      stroke="white"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DarkCheckIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="7.5" stroke="rgba(250, 248, 245, 0.4)" />
    <path
      d="M5.5 8.5L7 10L11 6"
      stroke="white"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ToggleSwitch = ({ enabled, onChange, isDark = false, label }) => {
  return (
    <div className="pricing-stolen-toggle-container">
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`pricing-stolen-toggle-btn ${enabled ? 'enabled' : 'disabled'} ${
          isDark
            ? enabled
              ? "dark-enabled"
              : "dark-disabled"
            : enabled
            ? "light-enabled"
            : "light-disabled"
        }`}
        aria-pressed={enabled}
        aria-label={label}
      >
        <span
          className={`pricing-stolen-toggle-thumb ${
            isDark
              ? enabled
                ? "dark-enabled-thumb"
                : "dark-disabled-thumb"
              : enabled
              ? "light-enabled-thumb"
              : "light-disabled-thumb"
          }`}
        />
      </button>
      <span className="pricing-stolen-toggle-label">{label}</span>
    </div>
  );
};

const AcademicHatIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
);

function Checkout({ onBack }) {
  const [starterFast, setStarterFast] = useState(false);
  const [proFast, setProFast] = useState(false);

  // Price calculations
  const starterPrice = starterFast ? 2499 + 499 : 2499;
  const proPrice = proFast ? 14999 + 1999 : 14999;

  const starterFeatures = [
    { text: "1 Chapter Access", enabled: true },
    { text: "Core Physics Lessons", enabled: true },
    { text: "Active Doubt Support", enabled: true },
    { text: "Basic Practice", enabled: true },
    { text: "Progression Tracking", enabled: false },
    { text: "Rewards & Badges", enabled: false },
    { text: "Leaderboard & Ranking", enabled: false },
  ];

  const proFeatures = [
    { text: "Full Access (All Chapters)", enabled: true },
    { text: "Core Physics Lessons", enabled: true },
    { text: "Active Doubt Support", enabled: true },
    { text: "Basic Practice", enabled: true },
    { text: "Progression Tracking", enabled: true },
    { text: "Rewards & Badges", enabled: true },
    { text: "Leaderboard & Ranking", enabled: true },
  ];

  return (
    <section className="checkout-flow">
      {/* Top Bar Navigation & Logo */}
      <div className="checkout-top-bar">
        <Button 
          className="icon-btn pricing-back" 
          aria-label="Back" 
          onClick={onBack}
        >
          <ArrowLeft size={18} />
        </Button>
        <Brand compact />
      </div>

      <div className="checkout-content-wrapper">
        {/* Main Page Title */}
        <div className="pricing-heading">
          <h1>
            Choose Your <span>Perfect</span> Plan
          </h1>
          <p>
            Select the perfect access level to master physics with interactive simulations and structured learning.
          </p>
        </div>

      {/* Cards Grid */}
      <div className="pricing-stolen-grid">
        {/* Starter Card (1-Month Access) */}
        <div className="pricing-stolen-card-light">
          <div className="pricing-stolen-inner-light">
            <div className="pricing-stolen-header">
              <div className="pricing-stolen-title-area">
                <h2>1-Month</h2>
                <p>Perfect for trying out Ibis Portal chapters.</p>
              </div>
              <span className="pricing-stolen-badge">
                Most Flexible
              </span>
            </div>

            <div className="pricing-stolen-price-area">
              <span className="pricing-stolen-price">₹{starterPrice.toLocaleString('en-IN')}</span>
              <span className="pricing-stolen-period">/month</span>
            </div>

            <button className="pricing-stolen-btn pricing-stolen-btn-light">
              Get Started
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="pricing-stolen-bottom-light">
            <div className="pricing-stolen-features">
              {starterFeatures.map((feature, idx) => (
                <div 
                  key={idx} 
                  className={`pricing-stolen-feature-item ${feature.enabled ? "" : "disabled"}`}
                >
                  {feature.enabled ? (
                    <LightCheckIcon className="flex-shrink-0" />
                  ) : (
                    <Lock size={14} className="flex-shrink-0" style={{ color: "rgba(32, 22, 17, 0.4)" }} />
                  )}
                  <span className="pricing-stolen-feature-text">{feature.text}</span>
                </div>
              ))}
            </div>
            <ToggleSwitch 
              enabled={starterFast} 
              onChange={setStarterFast} 
              label="Mentor doubt chat (+₹499)" 
            />
          </div>
        </div>

        {/* Pro Card (12-Month Access) */}
        <div className="pricing-stolen-card-dark">
          <div className="pricing-stolen-inner-dark">
            <div className="pricing-stolen-header">
              <div className="pricing-stolen-title-area">
                <h2>12-Month</h2>
                <p>Unlock complete access to the full platform.</p>
              </div>
              <span className="pricing-stolen-badge">
                Best Value
              </span>
            </div>

            <div className="pricing-stolen-price-area">
              <span className="pricing-stolen-price">₹{proPrice.toLocaleString('en-IN')}</span>
              <span className="pricing-stolen-period">/year</span>
            </div>

            <button className="pricing-stolen-btn pricing-stolen-btn-dark">
              Enroll Now
              <AcademicHatIcon />
            </button>
          </div>

          <div className="pricing-stolen-bottom-dark">
            <div className="pricing-stolen-features">
              {proFeatures.map((feature, idx) => (
                <div 
                  key={idx} 
                  className={`pricing-stolen-feature-item ${feature.enabled ? "" : "disabled"}`}
                >
                  {feature.enabled ? (
                    <DarkCheckIcon className="flex-shrink-0" />
                  ) : (
                    <Lock size={14} className="flex-shrink-0" style={{ color: "rgba(250, 248, 245, 0.4)" }} />
                  )}
                  <span className="pricing-stolen-feature-text">{feature.text}</span>
                </div>
              ))}
            </div>
            <ToggleSwitch 
              enabled={proFast} 
              onChange={setProFast} 
              isDark 
              label="Printed prep books (+₹1,999)" 
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);
}

createRoot(document.getElementById("root")).render(<App />);
