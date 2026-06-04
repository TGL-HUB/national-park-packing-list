import { useEffect, useMemo, useRef, useState } from "react";
import { TRIP, CREW, LOGISTICS, RESERVATIONS, DAYS as DEFAULT_DAYS, FUN_FACTS } from "./tripData.js";
import { supabase } from "./supabase.js";
import HikingChecklist from "./HikingChecklist.jsx";

// The shared itinerary lives in one reserved row of the existing person_lists
// table (the days array is stored in its `custom_items` jsonb column). This
// reuses the table's working RLS + realtime, so edits sync live to the whole
// team with no extra schema. Swap to a dedicated table later if desired.
const ITINERARY_KEY = "__itinerary__";

// ── tiny style helpers ───────────────────────────────────────────────────────
const card = {
  background: "rgba(255,255,255,0.9)",
  borderRadius: 18,
  boxShadow: "0 10px 30px rgba(11,61,79,0.10)",
  border: "1px solid rgba(11,61,79,0.06)",
};

// Give every stop a stable id (for React keys + expand/edit tracking). Existing
// ids are preserved; new/legacy stops get a deterministic one.
function withIds(days) {
  return (days || []).map((d) => ({
    ...d,
    stops: (d.stops || []).map((s, i) => (s.id ? s : { ...s, id: `d${d.n}-s${i}` })),
  }));
}

function uid() {
  return "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function mapsLink(s) {
  const q = s.coords ? `${s.coords[0]},${s.coords[1]}` : encodeURIComponent(`${s.name}, Washington`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

// Stop names/notes are team-editable and stored in a publicly-writable table,
// then rendered as raw HTML inside Leaflet popups. Escape them to prevent any
// stored HTML/script injection from reaching other viewers' browsers.
function esc(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function useCountdown(targetISO) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);
  const target = new Date(targetISO + "T00:00:00");
  const ms = target - now;
  const days = Math.ceil(ms / 86400000);
  return { days, started: ms <= 0 };
}

// ── Interactive Leaflet map ──────────────────────────────────────────────────
function TripMap({ activeDay, allDays }) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (!window.L || mapRef.current || !elRef.current) return;
    const L = window.L;
    const map = L.map(elRef.current, {
      scrollWheelZoom: false,
      keyboard: false, // prevents Leaflet from focus-scrolling the page to the map on load
    }).setView([47.5, -122.6], 7);
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 18,
      }
    ).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
  }, []);

  useEffect(() => {
    const L = window.L;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!L || !map || !layer) return;
    layer.clearLayers();

    const days = activeDay ? [activeDay] : allDays;
    const bounds = [];

    const base = L.marker(TRIP.base.coords, {
      icon: L.divIcon({
        className: "",
        html: `<div style="font-size:26px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">🏡</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      }),
    }).bindPopup(`<b>Home Base</b><br>${esc(TRIP.base.name)}`);
    base.addTo(layer);
    bounds.push(TRIP.base.coords);

    (days || []).forEach((d) => {
      d.stops.forEach((s) => {
        if (!s.coords) return;
        bounds.push(s.coords);
        L.marker(s.coords, {
          icon: L.divIcon({
            className: "",
            html: `<div style="display:flex;flex-direction:column;align-items:center">
                <div style="font-size:24px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">${s.pin || "📍"}</div>
              </div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 28],
          }),
        })
          .bindPopup(
            `<b>${esc(s.name)}</b><br><span style="color:#0b3d4f">${esc(s.time)}</span> · Day ${esc(d.n)}<br>${esc(s.note || "")}`
          )
          .addTo(layer);
      });

      if (activeDay) {
        const line = d.stops.filter((s) => s.coords).map((s) => s.coords);
        if (line.length > 1) {
          L.polyline(line, { color: d.color, weight: 3, opacity: 0.7, dashArray: "6 8" }).addTo(layer);
        }
      }
    });

    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: activeDay ? 11 : 8 });
    }
    setTimeout(() => map.invalidateSize(), 100);
  }, [activeDay, allDays]);

  return (
    <div ref={elRef} style={{ height: 380, width: "100%", borderRadius: 18, overflow: "hidden", zIndex: 0 }} />
  );
}

// ── Fun-fact shuffler ────────────────────────────────────────────────────────
function FunFact() {
  const [i, setI] = useState(0);
  const next = () => setI((p) => (p + 1 + Math.floor(Math.random() * (FUN_FACTS.length - 1))) % FUN_FACTS.length);
  const f = FUN_FACTS[i];
  return (
    <div
      style={{ ...card, padding: "20px 22px", background: "linear-gradient(135deg,#0b3d4f 0%,#13627a 100%)", color: "#eafaff", cursor: "pointer", userSelect: "none" }}
      onClick={next}
      title="Tap for another fact"
    >
      <div style={{ fontSize: 12, letterSpacing: 1.5, opacity: 0.7, textTransform: "uppercase", marginBottom: 8 }}>
        Did you know? <span style={{ float: "right" }}>tap for more →</span>
      </div>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ fontSize: 38, lineHeight: 1 }}>{f.icon}</div>
        <div style={{ fontSize: 16, lineHeight: 1.45 }}>{f.text}</div>
      </div>
    </div>
  );
}

// ── A single stop: VIEW mode (tap to expand details) ─────────────────────────
function StopView({ stop, day, open, onToggle }) {
  const hasMore = !!(stop.info || stop.note || stop.coords);
  return (
    <div style={{ position: "relative", paddingBottom: 12 }}>
      <div
        style={{
          position: "absolute",
          left: -17,
          top: 3,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "white",
          border: `3px solid ${day.color}`,
        }}
      />
      <div
        onClick={hasMore ? onToggle : undefined}
        style={{
          cursor: hasMore ? "pointer" : "default",
          borderRadius: 10,
          padding: "4px 8px",
          margin: "-4px -8px",
          background: open ? `${day.color}0d` : "transparent",
          transition: "background .15s",
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: day.color, minWidth: 52 }}>{stop.time}</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#0b3d4f", flex: 1 }}>
            {stop.pin ? stop.pin + " " : ""}
            {stop.name}
          </span>
          {hasMore && (
            <span style={{ fontSize: 13, color: day.color, transform: open ? "rotate(90deg)" : "none", transition: "transform .2s" }}>›</span>
          )}
        </div>
        {stop.note && <div style={{ fontSize: 13, color: "#64748b", marginLeft: 62, marginTop: 1 }}>{stop.note}</div>}
      </div>

      {open && (
        <div style={{ marginLeft: 62, marginTop: 8, marginRight: 4, padding: "12px 14px", background: "white", border: `1px solid ${day.color}26`, borderRadius: 12, boxShadow: "0 6px 16px rgba(11,61,79,0.07)" }}>
          {stop.info?.blurb && <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.5 }}>{stop.info.blurb}</div>}
          {stop.info?.facts?.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: day.color, marginBottom: 6 }}>
                ✨ Fun facts
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 5 }}>
                {stop.info.facts.map((fa, k) => (
                  <li key={k} style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.45 }}>{fa}</li>
                ))}
              </ul>
            </div>
          )}
          {!stop.info && stop.note && <div style={{ fontSize: 14, color: "#334155" }}>{stop.note}</div>}
          <a
            href={mapsLink(stop)}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ display: "inline-block", marginTop: 12, fontSize: 13, fontWeight: 700, color: day.color, textDecoration: "none" }}
          >
            📍 Open in Google Maps ↗
          </a>
        </div>
      )}
    </div>
  );
}

// ── A single stop: EDIT mode (inline fields + controls) ──────────────────────
function StopEdit({ stop, day, idx, count, onChange, onDelete, onMove }) {
  const field = {
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    padding: "6px 8px",
    fontSize: 14,
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
  };
  return (
    <div style={{ position: "relative", paddingBottom: 12 }}>
      <div style={{ position: "absolute", left: -17, top: 8, width: 12, height: 12, borderRadius: "50%", background: "white", border: `3px solid ${day.color}` }} />
      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ ...field, width: 86, fontWeight: 700, color: day.color }} value={stop.time} placeholder="time" onChange={(e) => onChange({ ...stop, time: e.target.value })} />
          <input style={{ ...field, fontWeight: 700 }} value={stop.name} placeholder="Stop name" onChange={(e) => onChange({ ...stop, name: e.target.value })} />
        </div>
        <input style={{ ...field, marginTop: 8, color: "#475569" }} value={stop.note || ""} placeholder="Notes (optional)" onChange={(e) => onChange({ ...stop, note: e.target.value })} />
        <div style={{ display: "flex", gap: 6, marginTop: 8, justifyContent: "flex-end" }}>
          <button onClick={() => onMove(-1)} disabled={idx === 0} title="Move up" style={iconBtn(idx === 0)}>↑</button>
          <button onClick={() => onMove(1)} disabled={idx === count - 1} title="Move down" style={iconBtn(idx === count - 1)}>↓</button>
          <button onClick={onDelete} title="Delete stop" style={{ ...iconBtn(false), color: "#dc2626", borderColor: "#fecaca" }}>🗑 Delete</button>
        </div>
      </div>
    </div>
  );
}

function iconBtn(disabled) {
  return {
    border: "1px solid #cbd5e1",
    background: "white",
    borderRadius: 8,
    padding: "5px 10px",
    fontSize: 13,
    fontWeight: 700,
    color: disabled ? "#cbd5e1" : "#475569",
    cursor: disabled ? "default" : "pointer",
  };
}

// ── A single expandable day card ─────────────────────────────────────────────
function DayCard({ day, open, onToggle, isActive, editMode, openStop, setOpenStop, ops }) {
  return (
    <div style={{ ...card, overflow: "hidden", outline: isActive ? `3px solid ${day.color}` : "none", transition: "outline 0.2s" }}>
      <button
        onClick={onToggle}
        style={{ width: "100%", textAlign: "left", border: "none", background: "transparent", cursor: "pointer", padding: "16px 18px", display: "flex", gap: 14, alignItems: "center" }}
      >
        <div style={{ minWidth: 46, height: 46, borderRadius: 12, background: day.color, color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontWeight: 800, lineHeight: 1 }}>
          <div style={{ fontSize: 10, opacity: 0.85 }}>DAY</div>
          <div style={{ fontSize: 20 }}>{day.n}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{day.date}</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#0b3d4f" }}>{day.title}</div>
          {day.badge && (
            <span style={{ display: "inline-block", marginTop: 4, fontSize: 12, fontWeight: 700, color: day.color, background: `${day.color}1a`, padding: "2px 9px", borderRadius: 999 }}>
              {day.badge}
            </span>
          )}
        </div>
        <div style={{ fontSize: 20, color: day.color, transform: open ? "rotate(90deg)" : "none", transition: "transform .2s" }}>›</div>
      </button>

      {open && (
        <div style={{ padding: "0 18px 18px 18px" }}>
          <div style={{ fontSize: 14, color: "#475569", marginBottom: 14, fontStyle: "italic" }}>{day.summary}</div>
          <div style={{ position: "relative", paddingLeft: 18 }}>
            <div style={{ position: "absolute", left: 5, top: 6, bottom: 6, width: 2, background: `${day.color}33` }} />
            {day.stops.map((s, idx) =>
              editMode ? (
                <StopEdit
                  key={s.id}
                  stop={s}
                  day={day}
                  idx={idx}
                  count={day.stops.length}
                  onChange={(next) => ops.updateStop(day.n, s.id, next)}
                  onDelete={() => ops.deleteStop(day.n, s.id)}
                  onMove={(dir) => ops.moveStop(day.n, s.id, dir)}
                />
              ) : (
                <StopView
                  key={s.id}
                  stop={s}
                  day={day}
                  open={openStop === s.id}
                  onToggle={() => setOpenStop(openStop === s.id ? null : s.id)}
                />
              )
            )}
          </div>

          {editMode && (
            <button
              onClick={() => ops.addStop(day.n)}
              style={{ marginTop: 4, marginLeft: 18, border: `2px dashed ${day.color}66`, background: "transparent", color: day.color, borderRadius: 10, padding: "8px 14px", fontWeight: 800, fontSize: 13, cursor: "pointer" }}
            >
              + Add a stop
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main app ─────────────────────────────────────────────────────────────────
export default function TripApp() {
  const [tab, setTab] = useState("trip"); // 'trip' | 'pack'
  const [openDay, setOpenDay] = useState(2);
  const [openStop, setOpenStop] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [days, setDays] = useState(() => withIds(DEFAULT_DAYS));
  const [sync, setSync] = useState("idle"); // 'idle'|'saving'|'synced'|'offline'
  const { days: countdown, started } = useCountdown(TRIP.startDate);

  const saveTimer = useRef();
  const lastEditAt = useRef(0);

  // Always open at the top (don't let the browser restore a prior scroll).
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  // Load the shared itinerary + subscribe to live edits from the team.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("person_lists")
        .select("custom_items")
        .eq("person", ITINERARY_KEY)
        .maybeSingle();
      if (cancelled) return;
      if (!error && data && Array.isArray(data.custom_items) && data.custom_items.length) {
        setDays(withIds(data.custom_items));
      } else if (!error) {
        // Seed the shared baseline from the default plan (best-effort).
        const seeded = withIds(DEFAULT_DAYS);
        supabase
          .from("person_lists")
          .upsert(
            { person: ITINERARY_KEY, custom_items: seeded, checked: {}, removed_items: [], updated_at: new Date().toISOString() },
            { onConflict: "person" }
          );
      }
    })();

    const channel = supabase
      .channel("itinerary")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "person_lists", filter: `person=eq.${ITINERARY_KEY}` },
        (payload) => {
          // Ignore remote echoes while actively editing to avoid clobbering keystrokes.
          if (Date.now() - lastEditAt.current < 1500) return;
          const row = payload.new;
          if (row && Array.isArray(row.custom_items)) setDays(withIds(row.custom_items));
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  // Save edits locally (instant) + to Supabase (debounced) so the team syncs.
  const persistDays = (next) => {
    setDays(next);
    lastEditAt.current = Date.now();
    setSync("saving");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const { error } = await supabase.from("person_lists").upsert(
        { person: ITINERARY_KEY, custom_items: next, checked: {}, removed_items: [], updated_at: new Date().toISOString() },
        { onConflict: "person" }
      );
      setSync(error ? "offline" : "synced");
    }, 600);
  };

  // ── itinerary edit operations ──
  const ops = useMemo(
    () => ({
      updateStop: (dayN, stopId, next) =>
        persistDays(days.map((d) => (d.n !== dayN ? d : { ...d, stops: d.stops.map((s) => (s.id === stopId ? next : s)) }))),
      deleteStop: (dayN, stopId) =>
        persistDays(days.map((d) => (d.n !== dayN ? d : { ...d, stops: d.stops.filter((s) => s.id !== stopId) }))),
      addStop: (dayN) =>
        persistDays(days.map((d) => (d.n !== dayN ? d : { ...d, stops: [...d.stops, { id: uid(), time: "", name: "New stop", note: "" }] }))),
      moveStop: (dayN, stopId, dir) =>
        persistDays(
          days.map((d) => {
            if (d.n !== dayN) return d;
            const i = d.stops.findIndex((s) => s.id === stopId);
            const j = i + dir;
            if (i < 0 || j < 0 || j >= d.stops.length) return d;
            const stops = [...d.stops];
            [stops[i], stops[j]] = [stops[j], stops[i]];
            return { ...d, stops };
          })
        ),
      reset: () => persistDays(withIds(DEFAULT_DAYS)),
    }),
    [days]
  );

  const activeDay = useMemo(() => days.find((d) => d.n === openDay) || null, [days, openDay]);

  const syncLabel = { idle: "", saving: "Saving…", synced: "✓ Synced to the team", offline: "⚠ Saved on this device only" }[sync];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#e6f3f7 0%,#eef6f1 60%,#f6f4ee 100%)", fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif", color: "#0b3d4f" }}>
      {/* hero */}
      <header style={{ background: "linear-gradient(135deg,#0b3d4f 0%,#10566b 45%,#1c7e7a 100%)", color: "white", padding: "34px 20px 30px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ fontSize: 40, letterSpacing: 6, marginBottom: 6 }}>🐋 🦭 🏔️ 🌲</div>
        <div style={{ fontSize: 13, letterSpacing: 3, opacity: 0.8, textTransform: "uppercase" }}>{TRIP.tagline}</div>
        <h1 style={{ margin: "6px 0 2px", fontSize: 44, fontWeight: 900, letterSpacing: -1 }}>{TRIP.title}</h1>
        <div style={{ fontSize: 16, opacity: 0.9 }}>Seattle &amp; the National Parks · June 4–12, 2026</div>
        <div style={{ marginTop: 18, display: "inline-flex", gap: 10, alignItems: "center", background: "rgba(255,255,255,0.14)", padding: "8px 18px", borderRadius: 999, fontWeight: 700 }}>
          {started ? "✨ The adventure is ON!" : `🗓️ ${countdown} ${countdown === 1 ? "day" : "days"} to go!`}
        </div>
      </header>

      {/* tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "16px 12px 4px", position: "sticky", top: 0, zIndex: 500, background: "linear-gradient(180deg,#e6f3f7,#e6f3f7cc)", backdropFilter: "blur(6px)" }}>
        {[
          { id: "trip", label: "🗺️ Itinerary" },
          { id: "pack", label: "🎒 Packing List" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{ border: "none", cursor: "pointer", padding: "10px 20px", borderRadius: 999, fontSize: 15, fontWeight: 800, background: tab === t.id ? "#0b3d4f" : "white", color: tab === t.id ? "white" : "#0b3d4f", boxShadow: "0 4px 12px rgba(11,61,79,0.12)" }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "pack" ? (
        <HikingChecklist />
      ) : (
        <main style={{ maxWidth: 820, margin: "0 auto", padding: "12px 16px 60px" }}>
          {/* map */}
          <section style={{ ...card, padding: 12, marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "2px 6px 10px" }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>🗺️ Where we're roaming</h2>
              <button
                onClick={() => setOpenDay(null)}
                style={{ border: "1px solid #0b3d4f33", background: openDay ? "white" : "#0b3d4f", color: openDay ? "#0b3d4f" : "white", borderRadius: 999, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
              >
                Show all stops
              </button>
            </div>
            <TripMap activeDay={activeDay} allDays={days} />
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 8, textAlign: "center" }}>
              {activeDay ? `Showing Day ${activeDay.n} · ${activeDay.title} — tap a pin for details` : "Tap a day below to trace its route"}
            </div>
          </section>

          {/* fun fact */}
          <section style={{ marginTop: 16 }}>
            <FunFact />
          </section>

          {/* crew */}
          <section style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: 18, margin: "0 4px 10px" }}>👋 The Crew</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {CREW.map((c) => (
                <div key={c.name} style={{ ...card, padding: "14px 16px", display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ fontSize: 30 }}>{c.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{c.name}</div>
                    <div style={{ fontSize: 13, color: "#475569" }}>
                      <b style={{ color: "#2b7a4b" }}>In:</b> {c.arrive} &nbsp;·&nbsp; <b style={{ color: "#c2456b" }}>Out:</b> {c.depart}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{c.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* days */}
          <section style={{ marginTop: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 4px 10px", flexWrap: "wrap", gap: 8 }}>
              <h2 style={{ fontSize: 18, margin: 0 }}>📅 Day by Day</h2>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {editMode && syncLabel && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: sync === "offline" ? "#b45309" : "#2b7a4b" }}>{syncLabel}</span>
                )}
                <button
                  onClick={() => {
                    setEditMode((v) => !v);
                    setOpenStop(null);
                  }}
                  style={{ border: "1px solid #0b3d4f33", background: editMode ? "#0b3d4f" : "white", color: editMode ? "white" : "#0b3d4f", borderRadius: 999, padding: "6px 14px", fontSize: 13, fontWeight: 800, cursor: "pointer" }}
                >
                  {editMode ? "✓ Done" : "✏️ Edit plan"}
                </button>
              </div>
            </div>

            {editMode && (
              <div style={{ ...card, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: "#475569", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span>✏️ Open a day to add, edit, reorder, or remove stops. Changes sync to everyone.</span>
                <button
                  onClick={() => {
                    if (window.confirm("Reset the whole itinerary back to the original plan for everyone?")) ops.reset();
                  }}
                  style={{ border: "1px solid #fecaca", background: "white", color: "#dc2626", borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  ↺ Reset to original
                </button>
              </div>
            )}

            <div style={{ display: "grid", gap: 10 }}>
              {days.map((d) => (
                <DayCard
                  key={d.n}
                  day={d}
                  open={openDay === d.n}
                  isActive={openDay === d.n}
                  onToggle={() => setOpenDay(openDay === d.n ? null : d.n)}
                  editMode={editMode}
                  openStop={openStop}
                  setOpenStop={setOpenStop}
                  ops={ops}
                />
              ))}
            </div>
          </section>

          {/* reservations */}
          <section style={{ marginTop: 22 }}>
            <h2 style={{ fontSize: 18, margin: "0 4px 10px" }}>🍽️ Dinner Reservations</h2>
            <div style={{ ...card, padding: "6px 4px" }}>
              {RESERVATIONS.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderBottom: i < RESERVATIONS.length - 1 ? "1px solid #0b3d4f0f" : "none" }}>
                  <div style={{ minWidth: 66, fontSize: 12, fontWeight: 800, color: "#0b3d4f" }}>{r.day}</div>
                  <div style={{ minWidth: 60, fontSize: 13, fontWeight: 700, color: "#c2456b" }}>{r.time}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.place}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{r.where}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>party of {r.party}</div>
                </div>
              ))}
            </div>
          </section>

          {/* logistics */}
          <section style={{ marginTop: 22 }}>
            <h2 style={{ fontSize: 18, margin: "0 4px 10px" }}>🚙 Good to Know</h2>
            <div style={{ display: "grid", gap: 8 }}>
              {LOGISTICS.map((l, i) => (
                <div key={i} style={{ ...card, padding: "12px 14px", display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ fontSize: 22 }}>{l.icon}</div>
                  <div>
                    <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{l.label}</div>
                    <div style={{ fontSize: 14, color: "#0b3d4f" }}>{l.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer style={{ textAlign: "center", marginTop: 36, color: "#94a3b8", fontSize: 13 }}>
            Made with 🐋 for the crew · Coastal 65th 2026
          </footer>
        </main>
      )}
    </div>
  );
}
