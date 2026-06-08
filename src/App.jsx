import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const CONFERENCES = [
  { id: 1, name: "ETHGlobal New York", date: "Jun 12–14", location: "New York City, USA", url: "https://ethglobal.com/events/newyork2026", type: "Hackathon", highlight: false, emoji: "🗽", region: "North America" },
  { id: 2, name: "ctrl/shift 2026", date: "Jun 13–15", location: "Naples, Italy", url: "https://www.ctrlshift.events/", type: "Conference", highlight: true, emoji: "🇮🇹", region: "Europe" },
  { id: 3, name: "DappCon Berlin", date: "Jun 16–17", location: "Berlin, Germany", url: "https://dappcon.io", type: "Conference", highlight: false, emoji: "🇩🇪", region: "Europe" },
  { id: 4, name: "ETHis", date: "Jul 2–3", location: "Munich, Germany", url: "https://www.ethis.xyz/", type: "Conference", highlight: false, emoji: "🍺", region: "Europe" },
  { id: 5, name: "Pragma Lisbon", date: "Jul 23", location: "Lisbon, Portugal", url: "https://ethglobal.com/events/pragma-lisbon2026", type: "Conference", highlight: false, emoji: "🇵🇹", region: "Europe" },
  { id: 6, name: "SBC Conference", date: "Jul 27–29", location: "Stanford, USA", url: "https://www.sbc-conference.com/2026/", type: "Conference", highlight: false, emoji: "🎓", region: "North America" },
  { id: 7, name: "ETH Enugu Conf '26", date: "Aug 17–22", location: "Enugu, Nigeria", url: "https://x.com/Eth_Enugu", type: "Conference", highlight: true, emoji: "🇳🇬", region: "Africa" },
  { id: 8, name: "ETH Belgrade 2026", date: "Aug 26–27", location: "Belgrade, Serbia", url: "https://ethbelgrade.rs/", type: "Conference", highlight: true, emoji: "🇷🇸", region: "Europe" },
  { id: 9, name: "Web3Lagos Conference", date: "Aug 28–30", location: "Lagos, Nigeria", url: "https://event.web3bridge.com/", type: "Conference", highlight: true, emoji: "🌍", region: "Africa" },
  { id: 10, name: "ETHSafari", date: "Sep 1–6", location: "Kenya", url: "https://ethsafari.xyz/", type: "Conference", highlight: true, emoji: "🦁", region: "Africa" },
  { id: 11, name: "ETHTaipei", date: "Sep 11–15", location: "Taipei, Taiwan", url: "https://ethtaipei.org/", type: "Conference", highlight: true, emoji: "🇹🇼", region: "Asia" },
  { id: 12, name: "European Blockchain Convention", date: "Sep 16–17", location: "Barcelona, Spain", url: "https://eblockchainconvention.com/", type: "Conference", highlight: false, emoji: "🇪🇸", region: "Europe" },
  { id: 13, name: "ETHSofia", date: "Sep 24", location: "Sofia, Bulgaria", url: "https://www.ethsofia.com/", type: "Conference", highlight: true, emoji: "🇧🇬", region: "Europe" },
  { id: 14, name: "Devcon India", date: "Nov 3–6", location: "Mumbai, India", url: "https://devcon.org/en/", type: "Conference", highlight: false, emoji: "🇮🇳", major: true, region: "Asia" },
];

const COMMUNITIES = [
  { name: "ETH Belgium", short: "BE", lat: 50.85, lng: 4.35, x: "ETHBelgiumHQ", home: true, color: "#d4a853" },
  { name: "ETH Cluj", short: "CJ", lat: 46.77, lng: 23.6, x: "ethcluj", color: "#c4b5fd" },
  { name: "ETH Nigeria", short: "NG", lat: 6.5, lng: 3.4, x: "EthNigeria", color: "#34d399" },
  { name: "ETH Mexico", short: "MX", lat: 19.4, lng: -99.1, x: "ethereum_mexico", color: "#f87171" },
  { name: "ETH Brasil", short: "BR", lat: -23.5, lng: -46.6, x: "Ethereum_Brasil", color: "#34d399" },
  { name: "ETH Mumbai", short: "MB", lat: 19.08, lng: 72.88, x: "ethmumbai", color: "#fb923c" },
  { name: "ETH Prague", short: "PR", lat: 50.08, lng: 14.44, x: "EthPrague", color: "#c4b5fd" },
  { name: "ETH Bucharest", short: "BU", lat: 44.43, lng: 26.1, x: "ethbucharest", color: "#c4b5fd" },
  { name: "ETH Accra", short: "AC", lat: 5.6, lng: -0.19, x: "ETHAccra", color: "#34d399" },
  { name: "ETH Denver", short: "DV", lat: 39.74, lng: -105.0, x: "EthereumDenver", color: "#60a5fa" },
  { name: "ETH Seoul", short: "SE", lat: 37.57, lng: 126.98, x: "ethseoul", color: "#fb923c" },
  { name: "ETH Vietnam", short: "VN", lat: 10.82, lng: 106.63, x: "eth_vietnam", color: "#fb923c" },
  { name: "ETH Zurich", short: "ZH", lat: 47.37, lng: 8.54, x: "ETHZurich_", color: "#c4b5fd" },
  { name: "ETH Kathmandu", short: "KT", lat: 27.7, lng: 85.32, x: "ethkathmandu", color: "#fb923c" },
  { name: "ETH Kenya", short: "KE", lat: -1.29, lng: 36.82, x: "ETHKenya_", color: "#34d399" },
  { name: "ETH Argentina", short: "AR", lat: -34.6, lng: -58.38, x: "EthArgentina", color: "#60a5fa" },
  { name: "ETH Taipei", short: "TP", lat: 25.03, lng: 121.57, x: "EthTaipei", color: "#fb923c" },
  { name: "ETH Sofia", short: "SF", lat: 42.7, lng: 23.32, x: "EthSofiaBG", color: "#c4b5fd" },
  { name: "ETH Belgrade", short: "BG", lat: 44.79, lng: 20.46, x: "ethbelgrade", color: "#c4b5fd" },
  { name: "ETH Enugu", short: "EN", lat: 6.44, lng: 7.5, x: "Eth_Enugu", color: "#34d399" },
  { name: "ETH Latam", short: "LA", lat: 4.71, lng: -74.07, x: "ethlatam", color: "#60a5fa" },
  { name: "ETH Safari", short: "SA", lat: -3.0, lng: 37.35, x: "ETHSafari", color: "#34d399" },
  { name: "ETH Rome", short: "RM", lat: 41.9, lng: 12.5, x: "ETHRome", color: "#c4b5fd" },
  { name: "ETH Riyadh", short: "RY", lat: 24.71, lng: 46.68, x: "EthRiyadh", color: "#fb923c" },
];

// Simplified ETH Belgium diamond logo as SVG paths
function EthBelgiumDiamond({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="20 32 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M115.892 111.994L70.292 176.433L24.6582 111.994L70.2754 35.7227L115.892 111.994Z" fill="#EEE9E6" stroke="white" strokeWidth="0.5" />
      <path d="M70.2038 50.5195L36.3477 107.401L70.2038 127.794L104.053 107.401L70.2038 50.5195Z" fill="#F3C414" />
      <path d="M70.2031 127.794L104.052 107.401L70.2031 50.5195" fill="#FF1800" />
      <path d="M70.1222 135.926L35.8242 115.222L70.2327 163.834L104.641 115.222L70.1222 135.926Z" fill="#1a1a2e" />
    </svg>
  );
}

function Globe({ communities, onCommunityTap, visited }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const rotRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const countriesRef = useRef([]);
  const visitedRef = useRef(new Set());

  useEffect(() => {
    visitedRef.current = visited || new Set();
  }, [visited]);
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 });
  const pinchRef = useRef({ active: false, dist: 0 });
  const autoRef = useRef(true);
  const idleTimer = useRef(null);
  const pointsRef = useRef([]);
  const sizeRef = useRef(320);
  const resumeAuto = useCallback(() => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => { autoRef.current = true; }, 2500);
  }, []);

  useEffect(() => {
    // Fetch simplified landmass data
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then(res => res.json())
      .then(data => {
        // Simple conversion from TopoJSON or fetching GeoJSON directly
        // For simplicity and speed, let's fetch a GeoJSON version
        return fetch("https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/110m/cultural/ne_110m_admin_0_countries.json");
      })
      .then(res => res.json())
      .then(data => {
        countriesRef.current = data.features;
      })
      .catch(err => console.error("Failed to load map data", err));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(window.innerWidth - 32, 380);
    sizeRef.current = size;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2;

    function drawFrame() {
      const zoom = zoomRef.current;
      const radius = size * 0.36 * zoom;
      ctx.clearRect(0, 0, size, size);

      if (autoRef.current) rotRef.current.y += 0.004;

      const rotX = rotRef.current.x;
      const rotY = rotRef.current.y;
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

      // atmosphere glow
      const atmo = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.3);
      atmo.addColorStop(0, "rgba(99, 60, 200, 0.08)");
      atmo.addColorStop(0.7, "rgba(99, 60, 200, 0.04)");
      atmo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = atmo;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // globe body
      const bodyGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius);
      bodyGrad.addColorStop(0, "rgba(25, 15, 60, 0.92)");
      bodyGrad.addColorStop(1, "rgba(8, 4, 30, 0.96)");
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // landmasses
      if (countriesRef.current.length > 0) {
        ctx.fillStyle = "rgba(139, 92, 246, 0.12)";
        ctx.strokeStyle = "rgba(139, 92, 246, 0.25)";
        ctx.lineWidth = 0.5;

        countriesRef.current.forEach(feature => {
          const coords = feature.geometry.coordinates;
          const type = feature.geometry.type;

          const drawPolygon = (polygon) => {
            ctx.beginPath();
            let started = false;
            polygon.forEach(([lng, lat]) => {
              const latR = (lat * Math.PI) / 180;
              const lngR = (lng * Math.PI) / 180;
              let x0 = radius * Math.cos(latR) * Math.cos(lngR);
              let y0 = radius * Math.sin(latR);
              let z0 = radius * Math.cos(latR) * Math.sin(lngR);

              let rx = x0 * cosY - z0 * sinY;
              let rz = x0 * sinY + z0 * cosY;
              let ry = y0 * cosX - rz * sinX;
              let rz2 = y0 * sinX + rz * cosX;

              if (rz2 > -radius * 0.1) {
                if (!started) {
                  ctx.moveTo(cx + rx, cy - ry);
                  started = true;
                } else {
                  ctx.lineTo(cx + rx, cy - ry);
                }
              } else {
                started = false;
              }
            });
            ctx.fill();
            ctx.stroke();
          };

          if (type === "Polygon") {
            coords.forEach(drawPolygon);
          } else if (type === "MultiPolygon") {
            coords.forEach(poly => poly.forEach(drawPolygon));
          }
        });
      }

      // edge ring
      ctx.strokeStyle = "rgba(139, 92, 246, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // grid — longitude
      ctx.strokeStyle = `rgba(139, 92, 246, ${0.06 * Math.min(zoom, 1.5)})`;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI;
        ctx.beginPath();
        for (let j = 0; j <= 64; j++) {
          const phi = (j / 64) * Math.PI * 2;
          let px = radius * Math.cos(phi) * Math.cos(ang);
          let py = radius * Math.sin(phi);
          let pz = radius * Math.cos(phi) * Math.sin(ang);
          // rotate
          let ry = px * cosY - pz * sinY;
          let rz = px * sinY + pz * cosY;
          let ry2 = py * cosX - rz * sinX;
          let rz2 = py * sinX + rz * cosX;
          if (rz2 < 0) { ctx.moveTo(cx + ry, cy - ry2); continue; }
          ctx.lineTo(cx + ry, cy - ry2);
        }
        ctx.stroke();
      }

      // grid — latitude
      for (let i = 1; i < 6; i++) {
        const phi = (i / 6) * Math.PI;
        const r = radius * Math.sin(phi);
        const baseY = radius * Math.cos(phi);
        ctx.beginPath();
        let started = false;
        for (let j = 0; j <= 64; j++) {
          const ang = (j / 64) * Math.PI * 2;
          let px = r * Math.cos(ang);
          let pz = r * Math.sin(ang);
          let ry = px * cosY - pz * sinY;
          let rz = px * sinY + pz * cosY;
          let ry2 = baseY * cosX - rz * sinX;
          let rz2 = baseY * sinX + rz * cosX;
          if (rz2 < 0) { started = false; continue; }
          if (!started) { ctx.moveTo(cx + ry, cy - ry2); started = true; }
          else ctx.lineTo(cx + ry, cy - ry2);
        }
        ctx.stroke();
      }

      // community dots
      const pts = communities.map((c) => {
        const latR = (c.lat * Math.PI) / 180;
        const lngR = (c.lng * Math.PI) / 180;
        let x0 = radius * Math.cos(latR) * Math.cos(lngR);
        let y0 = radius * Math.sin(latR);
        let z0 = radius * Math.cos(latR) * Math.sin(lngR);
        // rotate Y then X
        let rx = x0 * cosY - z0 * sinY;
        let rz = x0 * sinY + z0 * cosY;
        let ry = y0 * cosX - rz * sinX;
        let rz2 = y0 * sinX + rz * cosX;
        const visited = visitedRef.current.has(c.id);
        return { ...c, sx: cx + rx, sy: cy - ry, sz: rz2, visible: rz2 > -radius * 0.05, visited };
      });

      pts.sort((a, b) => a.sz - b.sz);
      pointsRef.current = pts;

      pts.forEach((p) => {
        if (!p.visible) return;
        const depth = (p.sz + radius) / (2 * radius);
        const opacity = 0.25 + 0.75 * depth;
        const isHome = p.home;
        const isVisited = p.visited;
        const dotR = isHome ? (3.5 + zoom * 2.5) : (2 + zoom * 2);
        let col = p.color || "#c4b5fd";
        if (isVisited) col = "#34d399";

        // outer glow
        const glow = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, dotR * 4);
        glow.addColorStop(0, isHome ? `rgba(212, 168, 83, ${opacity * 0.35})` : col.replace(")", `, ${opacity * 0.2})`).replace("rgb", "rgba"));
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, dotR * 4, 0, Math.PI * 2);
        ctx.fill();

        // dot
        if (isHome) {
          // ETH diamond shape for home
          const d = dotR * 1.3;
          ctx.fillStyle = `rgba(212, 168, 83, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(p.sx, p.sy - d * 1.5);
          ctx.lineTo(p.sx + d, p.sy);
          ctx.lineTo(p.sx, p.sy + d * 1.5);
          ctx.lineTo(p.sx - d, p.sy);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = `rgba(255, 220, 130, ${opacity * 0.6})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        } else {
          ctx.fillStyle = col.includes("rgba") ? col : col;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, dotR, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        // labels — show when zoomed or front-facing
        const showLabel = zoom > 1.15 ? opacity > 0.4 : opacity > 0.72;
        if (showLabel) {
          const fontSize = isHome ? Math.max(9, 8 * zoom) : Math.max(8, 7 * zoom);
          ctx.fillStyle = `rgba(255,255,255,${opacity * (isHome ? 0.95 : 0.7)})`;
          ctx.font = `${isHome ? "bold " : ""}${fontSize}px -apple-system, system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(p.name, p.sx, p.sy - dotR - 4 * zoom);
        }
      });

      // zoom indicator
      if (zoom !== 1) {
        ctx.fillStyle = "rgba(200, 180, 255, 0.3)";
        ctx.font = "10px system-ui";
        ctx.textAlign = "right";
        ctx.fillText(`${zoom.toFixed(1)}x`, size - 12, size - 10);
      }

      animRef.current = requestAnimationFrame(drawFrame);
    }

    // Event handlers
    function getTouchDist(e) {
      const t = e.touches;
      return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    }

    function onPointerDown(e) {
      autoRef.current = false;
      const x = e.clientX ?? e.touches?.[0]?.clientX;
      const y = e.clientY ?? e.touches?.[0]?.clientY;
      if (e.touches?.length === 2) {
        pinchRef.current = { active: true, dist: getTouchDist(e) };
        return;
      }
      dragRef.current = { active: true, lastX: x, lastY: y };
    }

    function onPointerMove(e) {
      if (e.touches?.length === 2 && pinchRef.current.active) {
        const newDist = getTouchDist(e);
        const scale = newDist / pinchRef.current.dist;
        zoomRef.current = Math.max(0.6, Math.min(3, zoomRef.current * scale));
        pinchRef.current.dist = newDist;
        return;
      }
      if (!dragRef.current.active) return;
      const x = e.clientX ?? e.touches?.[0]?.clientX;
      const y = e.clientY ?? e.touches?.[0]?.clientY;
      const dx = x - dragRef.current.lastX;
      const dy = y - dragRef.current.lastY;
      rotRef.current.y += dx * 0.006;
      rotRef.current.x += dy * 0.006;
      rotRef.current.x = Math.max(-1.2, Math.min(1.2, rotRef.current.x));
      dragRef.current.lastX = x;
      dragRef.current.lastY = y;
    }

    function onPointerUp(e) {
      dragRef.current.active = false;
      pinchRef.current.active = false;
      resumeAuto();
    }

    function onWheel(e) {
      e.preventDefault();
      autoRef.current = false;
      zoomRef.current = Math.max(0.6, Math.min(3, zoomRef.current - e.deltaY * 0.002));
      resumeAuto();
    }

    function onTap(e) {
      if (e.touches?.length > 1) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX ?? e.changedTouches?.[0]?.clientX) - rect.left;
      const y = (e.clientY ?? e.changedTouches?.[0]?.clientY) - rect.top;
      const hit = pointsRef.current.find((p) => p.visible && Math.hypot(p.sx - x, p.sy - y) < 18);
      if (hit && onCommunityTap) onCommunityTap(hit);
    }

    canvas.addEventListener("mousedown", onPointerDown);
    canvas.addEventListener("mousemove", onPointerMove);
    canvas.addEventListener("mouseup", onPointerUp);
    canvas.addEventListener("mouseleave", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("touchstart", onPointerDown, { passive: true });
    canvas.addEventListener("touchmove", onPointerMove, { passive: true });
    canvas.addEventListener("touchend", onPointerUp);
    canvas.addEventListener("click", onTap);

    drawFrame();
    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("mousedown", onPointerDown);
      canvas.removeEventListener("mousemove", onPointerMove);
      canvas.removeEventListener("mouseup", onPointerUp);
      canvas.removeEventListener("mouseleave", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("touchstart", onPointerDown);
      canvas.removeEventListener("touchmove", onPointerMove);
      canvas.removeEventListener("touchend", onPointerUp);
      canvas.removeEventListener("click", onTap);
    };
  }, [communities, onCommunityTap, resumeAuto]);

  return <canvas ref={canvasRef} style={{ display: "block", margin: "0 auto", touchAction: "none", cursor: "grab" }} />;
}

function StarField() {
  const stars = useMemo(() => Array.from({ length: 90 }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 100,
    size: Math.random() * 2 + 0.5, delay: Math.random() * 5, dur: 2 + Math.random() * 3,
  })), []);
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {stars.map((s) => (
        <div key={s.id} style={{
          position: "absolute", left: s.left + "%", top: s.top + "%",
          width: s.size, height: s.size, borderRadius: "50%", background: "white",
          animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

function ConferenceCard({ conf, index, saved, onSave, onVisit, isVisited }) {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)",
      transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.04}s`,
      padding: "1.5px", borderRadius: 16, marginBottom: 14,
      background: conf.highlight ? "linear-gradient(135deg, #d4a853, #b8860b, #d4a853, #f0d78c)"
        : conf.major ? "linear-gradient(135deg, #8b5cf6, #6d28d9, #8b5cf6)"
          : "rgba(139, 92, 246, 0.18)",
    }}>
      <div style={{
        background: "linear-gradient(135deg, rgba(15, 8, 40, 0.97), rgba(25, 12, 55, 0.95))",
        borderRadius: 15, padding: "16px 18px", position: "relative", overflow: "hidden",
      }}>

        {conf.major && !conf.highlight && (
          <div style={{
            position: "absolute", top: 0, right: 0,
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            color: "white", fontSize: 9, fontWeight: 700, letterSpacing: 1,
            padding: "4px 12px 4px 16px", borderRadius: "0 0 0 12px",
            textTransform: "uppercase", fontFamily: "system-ui",
          }}>flagship ✦</div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 28, lineHeight: 1, marginBottom: 6 }}>{conf.emoji}</div>
            <h3 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 19, fontWeight: 700, color: "white", margin: "0 0 6px", lineHeight: 1.2,
            }}>{conf.name}</h3>
            <div style={{ fontFamily: "system-ui", fontSize: 13, color: "rgba(200, 170, 255, 0.8)", marginBottom: 3, fontWeight: 500 }}>{conf.date}</div>
            <div style={{ fontFamily: "system-ui", fontSize: 12, color: "rgba(255, 255, 255, 0.45)" }}>{conf.location}</div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onSave(conf.id); }} style={{
            background: saved ? "rgba(212, 168, 83, 0.2)" : "rgba(255,255,255,0.06)",
            border: saved ? "1px solid rgba(212, 168, 83, 0.4)" : "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", transition: "all 0.2s", fontSize: 17, flexShrink: 0, marginTop: 4,
            color: saved ? "#d4a853" : "rgba(255,255,255,0.4)",
          }}>{saved ? "★" : "☆"}</button>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <a href={conf.url} target="_blank" rel="noopener noreferrer" style={{
            flex: 1,
            background: conf.highlight ? "linear-gradient(135deg, rgba(212, 168, 83, 0.12), rgba(212, 168, 83, 0.06))" : "rgba(139, 92, 246, 0.1)",
            border: conf.highlight ? "1px solid rgba(212, 168, 83, 0.2)" : "1px solid rgba(139, 92, 246, 0.15)",
            borderRadius: 10, padding: "10px 0", textAlign: "center", textDecoration: "none",
            color: conf.highlight ? "#d4a853" : "#c4b5fd",
            fontSize: 13, fontWeight: 600, fontFamily: "system-ui", letterSpacing: 0.5,
          }}>Learn more →</a>
          <button onClick={() => onVisit(conf.id)} style={{
            flex: 1,
            background: isVisited(conf.id) ? "linear-gradient(135deg, #34d39920, #34d39910)" : "rgba(255,255,255,0.05)",
            border: isVisited(conf.id) ? "1px solid #34d39940" : "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, padding: "10px 0", textAlign: "center",
            color: isVisited(conf.id) ? "#34d399" : "rgba(255,255,255,0.4)",
            fontSize: 13, fontWeight: 600, fontFamily: "system-ui", cursor: "pointer",
          }}>
            {isVisited(conf.id) ? "✓ Stamped" : "Stamp Passport"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CommunityPill({ community }) {
  const isHome = community.home;
  return (
    <a href={`https://x.com/${community.x}`} target="_blank" rel="noopener noreferrer" style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "8px 14px", borderRadius: 20,
      background: isHome ? "linear-gradient(135deg, rgba(212, 168, 83, 0.2), rgba(212, 168, 83, 0.1))" : "rgba(139, 92, 246, 0.08)",
      border: isHome ? "1px solid rgba(212, 168, 83, 0.4)" : "1px solid rgba(139, 92, 246, 0.15)",
      textDecoration: "none",
      color: isHome ? "#d4a853" : "rgba(200, 180, 255, 0.8)",
      fontSize: 12, fontWeight: 600, fontFamily: "system-ui",
      whiteSpace: "nowrap", flexShrink: 0,
    }}>
      {isHome ? <EthBelgiumDiamond size={14} /> : (
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: community.color || "#8b5cf6",
          boxShadow: `0 0 6px ${community.color || "#8b5cf6"}40`,
        }} />
      )}
      {community.name}
    </a>
  );
}

function Stamp({ id, size = 100, stamped = false }) {
  const colors = ["#d4a853", "#8b5cf6", "#34d399", "#f87171", "#60a5fa", "#fb923c"];
  const color = colors[id % colors.length];

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      border: `2px dashed ${stamped ? color : "rgba(255,255,255,0.1)"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", opacity: stamped ? 1 : 0.3,
      transform: stamped ? "rotate(-10deg)" : "none",
      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      background: stamped ? `${color}10` : "transparent",
    }}>
      <div style={{
        fontSize: size * 0.4, filter: stamped ? "none" : "grayscale(100%)",
      }}>🎟️</div>
      {stamped && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: `4px solid ${color}40`, margin: 4,
        }} />
      )}
      <div style={{
        position: "absolute", bottom: -15, left: "50%", transform: "translateX(-50%)",
        fontSize: 10, color: stamped ? color : "rgba(255,255,255,0.2)",
        fontWeight: 700, whiteSpace: "nowrap", letterSpacing: 1, textTransform: "uppercase",
      }}>
        {stamped ? "STAMPED" : "LOCKED"}
      </div>
    </div>
  );
}

function PassportView({ visited }) {
  const visitedConfs = CONFERENCES.filter(c => visited.has(c.id));

  return (
    <div style={{ padding: "80px 20px 100px", animation: "fadeUp 0.6s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, marginBottom: 8 }}>Digital Passport</h2>
        <p style={{ color: "rgba(200, 180, 255, 0.5)", fontSize: 14 }}>Collect stamps from the events you've attended</p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: "40px 20px", maxWidth: 600, margin: "0 auto",
      }}>
        {CONFERENCES.map(c => (
          <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Stamp id={c.id} size={80} stamped={visited.has(c.id)} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{c.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{c.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const MOCK_LEADERBOARD = [
  { name: "Vitalik.eth", count: 12, avatar: "🐼" },
  { name: "Aya Miyaguchi", count: 10, avatar: "🌟" },
  { name: "Tim Beiko", count: 9, avatar: "⚡" },
  { name: "Glen Weyl", count: 7, avatar: "🎓" },
  { name: "Skylar Weaver", count: 6, avatar: "🌈" },
];

function LeaderboardView({ visitedCount }) {
  const sortedBoard = [...MOCK_LEADERBOARD, { name: "You", count: visitedCount, avatar: "👤", current: true }]
    .sort((a, b) => b.count - a.count);

  return (
    <div style={{ padding: "80px 20px 100px", animation: "fadeUp 0.6s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, marginBottom: 8 }}>Global Leaderboard</h2>
        <p style={{ color: "rgba(200, 180, 255, 0.5)", fontSize: 14 }}>The world's most active ETH explorers</p>
      </div>

      <div style={{ maxWidth: 400, margin: "0 auto", background: "rgba(139, 92, 246, 0.05)", borderRadius: 24, border: "1px solid rgba(139, 92, 246, 0.1)", overflow: "hidden" }}>
        {sortedBoard.map((entry, i) => (
          <div key={entry.name} style={{
            display: "flex", alignItems: "center", gap: 16, padding: "16px 20px",
            background: entry.current ? "rgba(212, 168, 83, 0.15)" : "transparent",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: i < 3 ? "#d4a853" : "rgba(255,255,255,0.3)", width: 24 }}>{i + 1}</div>
            <div style={{ fontSize: 24 }}>{entry.avatar}</div>
            <div style={{ flex: 1, fontWeight: 600, color: entry.current ? "#d4a853" : "white" }}>{entry.name}</div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>{entry.count}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>stamps</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommunityPopup({ community, onClose }) {
  if (!community) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "linear-gradient(135deg, #150d3a, #0d0830)",
        border: community.home ? "1px solid rgba(212, 168, 83, 0.4)" : "1px solid rgba(139, 92, 246, 0.3)",
        borderRadius: 20, padding: 24, maxWidth: 300, width: "100%", textAlign: "center",
      }}>
        {community.home ? <EthBelgiumDiamond size={48} /> : (
          <div style={{
            width: 48, height: 48, borderRadius: "50%", margin: "0 auto 12px",
            background: `${community.color}20`, border: `2px solid ${community.color}60`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, color: community.color, fontFamily: "system-ui",
          }}>{community.short}</div>
        )}
        <h3 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 22, fontWeight: 700, color: "white", margin: community.home ? "12px 0 6px" : "0 0 6px",
        }}>{community.name}</h3>
        <p style={{ fontFamily: "system-ui", fontSize: 13, color: "rgba(200, 180, 255, 0.5)", margin: "0 0 16px" }}>
          Local Ethereum community
        </p>
        <a href={`https://x.com/${community.x}`} target="_blank" rel="noopener noreferrer" style={{
          display: "inline-block", padding: "10px 24px", borderRadius: 12,
          background: community.home ? "linear-gradient(135deg, #d4a853, #b8860b)" : "rgba(139, 92, 246, 0.2)",
          border: community.home ? "none" : "1px solid rgba(139, 92, 246, 0.3)",
          color: community.home ? "#0a0a1a" : "#c4b5fd",
          textDecoration: "none", fontSize: 13, fontWeight: 700, fontFamily: "system-ui",
        }}>Follow @{community.x}</a>
      </div>
    </div>
  );
}

export default function App() {
  const [saved, setSaved] = useState(() => {
    try {
      const s = localStorage.getItem("saved_confs");
      return s ? new Set(JSON.parse(s)) : new Set();
    } catch (e) { return new Set(); }
  });
  const [visited, setVisited] = useState(() => {
    try {
      const v = localStorage.getItem("visited_confs");
      return v ? new Set(JSON.parse(v)) : new Set();
    } catch (e) { return new Set(); }
  });
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [view, setView] = useState("explore"); // explore, passport, leaderboard

  useEffect(() => {
    localStorage.setItem("saved_confs", JSON.stringify([...saved]));
  }, [saved]);

  useEffect(() => {
    localStorage.setItem("visited_confs", JSON.stringify([...visited]));
  }, [visited]);

  const toggleSave = useCallback((id) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleVisit = useCallback((id) => {
    setVisited((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const displayConferences = showSavedOnly ? CONFERENCES.filter((c) => saved.has(c.id)) : CONFERENCES;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #050318 0%, #0d0830 30%, #130b38 60%, #0d0830 100%)",
      color: "white", position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050318; }
        @keyframes twinkle { 0%, 100% { opacity: 0.15; } 50% { opacity: 1; } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 12px rgba(212,168,83,0.15); } 50% { box-shadow: 0 0 24px rgba(212,168,83,0.3); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .cscroll::-webkit-scrollbar { display: none; }
        .cscroll { -ms-overflow-style: none; scrollbar-width: none; }
        a:active { opacity: 0.7; }
        button:active { transform: scale(0.95); }
      `}</style>

      <StarField />
      <CommunityPopup community={selectedCommunity} onClose={() => setSelectedCommunity(null)} />

      {/* Sticky header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "linear-gradient(180deg, rgba(5, 3, 24, 0.96) 0%, rgba(5, 3, 24, 0.85) 100%)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(139, 92, 246, 0.08)",
        padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <a href="https://x.com/ETHBelgiumHQ" target="_blank" rel="noopener noreferrer"
          style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <EthBelgiumDiamond size={28} />
          <div>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 13, fontWeight: 700, color: "white", lineHeight: 1.1,
            }}>ETH Embassy</div>
            <div style={{
              fontSize: 9, color: "rgba(212, 168, 83, 0.65)",
              fontFamily: "system-ui", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase",
            }}>by ETH Belgium</div>
          </div>
        </a>
        {saved.size > 0 && view === "explore" && (
          <button onClick={() => setShowSavedOnly((p) => !p)} style={{
            background: showSavedOnly ? "rgba(212, 168, 83, 0.2)" : "rgba(255,255,255,0.06)",
            border: showSavedOnly ? "1px solid rgba(212, 168, 83, 0.4)" : "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: "5px 12px",
            color: showSavedOnly ? "#d4a853" : "rgba(255,255,255,0.5)",
            fontSize: 12, fontWeight: 600, fontFamily: "system-ui", cursor: "pointer",
          }}>★ {saved.size}</button>
        )}
        {view !== "explore" && (
          <button onClick={() => setView("explore")} style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: "5px 12px", color: "white", fontSize: 12, fontWeight: 600,
            fontFamily: "system-ui", cursor: "pointer",
          }}>← Back</button>
        )}
      </div>

      {/* Hero */}
      <div style={{ padding: "28px 20px 0", textAlign: "center", position: "relative", zIndex: 1, display: view === "explore" ? "block" : "none" }}>
        <div style={{
          fontFamily: "system-ui", fontSize: 10, fontWeight: 600,
          color: "rgba(212, 168, 83, 0.6)", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 14,
        }}>ETHConf NYC · June 8, 2026</div>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 46, fontWeight: 900, lineHeight: 0.92, margin: "0 0 10px",
          background: "linear-gradient(180deg, #ffffff 10%, rgba(200, 170, 255, 0.75) 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>WORLD<br />WIDE<br />ETH</h1>
        <p style={{
          fontFamily: "system-ui", fontSize: 14, lineHeight: 1.6,
          color: "rgba(200, 180, 255, 0.55)", maxWidth: 300, margin: "0 auto",
        }}>
          go somewhere you've never been. attend a conference. meet the local community. make friends you'll keep running into for years.
        </p>
      </div>

      {/* Globe */}
      <div style={{ padding: "20px 16px 8px", position: "relative", zIndex: 1, display: view === "explore" ? "block" : "none" }}>
        <Globe communities={COMMUNITIES} onCommunityTap={setSelectedCommunity} visited={visited} />
        <div style={{
          textAlign: "center", marginTop: 6,
          fontFamily: "system-ui", fontSize: 11, color: "rgba(200, 180, 255, 0.3)",
        }}>drag to explore · pinch to zoom · tap a community</div>
      </div>

      {/* View Switcher Overlay (Mobile-friendly) */}
      <div style={{
        position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
        background: "rgba(10, 5, 30, 0.85)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(139, 92, 246, 0.2)", borderRadius: 30,
        padding: "6px", display: "flex", gap: 4, zIndex: 100,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}>
        {["explore", "passport", "leaderboard"].map((v) => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "8px 18px", borderRadius: 24, border: "none",
            background: view === v ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "transparent",
            color: view === v ? "white" : "rgba(255,255,255,0.5)",
            fontSize: 12, fontWeight: 700, textTransform: "capitalize",
            fontFamily: "system-ui", cursor: "pointer", transition: "all 0.2s",
          }}>{v}</button>
        ))}
      </div>

      {/* Narrative */}
      <div style={{
        padding: "16px 24px 28px", textAlign: "center", position: "relative", zIndex: 1,
        maxWidth: 380, margin: "0 auto", display: view === "explore" ? "block" : "none"
      }}>
        <p style={{
          fontFamily: "system-ui", fontSize: 13, lineHeight: 1.7,
          color: "rgba(200, 180, 255, 0.45)",
        }}>
          every dot on this globe is a group of people building ethereum where they live. when you travel to a conference, you're not just attending talks, you're walking into a city that already has a community waiting for you. that's the point.
        </p>
      </div>

      {/* Communities scroll */}
      <div style={{ padding: "0 0 24px", position: "relative", zIndex: 1, display: view === "explore" ? "block" : "none" }}>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 17, fontWeight: 700, padding: "0 20px 10px", color: "rgba(255,255,255,0.85)",
        }}>ETH Communities</h2>
        <div className="cscroll" style={{
          display: "flex", gap: 8, overflowX: "auto", padding: "0 20px 4px",
        }}>
          {[...COMMUNITIES].sort((a, b) => (b.home ? 1 : 0) - (a.home ? 1 : 0)).map((c) => (
            <CommunityPill key={c.name} community={c} />
          ))}
        </div>
      </div>

      {/* Conferences */}
      <div style={{ padding: "0 16px 40px", position: "relative", zIndex: 1, display: view === "explore" ? "block" : "none" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14, padding: "0 4px" }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 17, fontWeight: 700, color: "rgba(255,255,255,0.85)",
          }}>{showSavedOnly ? "Your saved events" : "Upcoming conferences"}</h2>
          <span style={{ fontFamily: "system-ui", fontSize: 11, color: "rgba(200, 180, 255, 0.35)" }}>
            {displayConferences.length}
          </span>
        </div>
        {showSavedOnly && displayConferences.length === 0 && (
          <div style={{
            textAlign: "center", padding: "36px 20px",
            color: "rgba(200, 180, 255, 0.35)", fontFamily: "system-ui", fontSize: 13,
          }}>nothing saved yet — tap ☆ on any event</div>
        )}
        {displayConferences.map((conf, i) => (
          <ConferenceCard
            key={conf.id}
            conf={conf}
            index={i}
            saved={saved.has(conf.id)}
            onSave={toggleSave}
            onVisit={toggleVisit}
            isVisited={(id) => visited.has(id)}
          />
        ))}
      </div>

      {view === "passport" && <PassportView visited={visited} />}
      {view === "leaderboard" && <LeaderboardView visitedCount={visited.size} />}

      {/* Source credit */}
      <div style={{ textAlign: "center", padding: "0 20px 16px", position: "relative", zIndex: 1 }}>
        <a href="https://ethstars.xyz/" target="_blank" rel="noopener noreferrer" style={{
          fontFamily: "system-ui", fontSize: 10, color: "rgba(200, 180, 255, 0.25)", textDecoration: "none",
        }}>conferences from ethereum.org · curated by ETHStars</a>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid rgba(139, 92, 246, 0.08)",
        padding: "28px 20px 48px", textAlign: "center", position: "relative", zIndex: 1,
      }}>
        <a href="https://x.com/ETHBelgiumHQ" target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", textDecoration: "none", gap: 10 }}>
          <div style={{ animation: "pulseGlow 3s ease-in-out infinite", borderRadius: 16 }}>
            <EthBelgiumDiamond size={44} />
          </div>
          <div>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 17, fontWeight: 700, color: "white",
            }}>ETH Embassy</div>
            <div style={{
              fontFamily: "system-ui", fontSize: 10,
              color: "rgba(212, 168, 83, 0.55)", fontWeight: 500,
              letterSpacing: 1, textTransform: "uppercase", marginTop: 3,
            }}>by ETH Belgium · @ETHBelgiumHQ</div>
          </div>
        </a>
        <div style={{
          marginTop: 18, fontFamily: "system-ui", fontSize: 10,
          color: "rgba(200, 180, 255, 0.2)", lineHeight: 1.7,
        }}>
          ethereum is global because the people are<br />
          ETHConf NYC 2026
        </div>
      </div>
    </div>
  );
}
