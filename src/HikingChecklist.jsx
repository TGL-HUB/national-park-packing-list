import { useEffect, useMemo, useRef, useState } from "react";
import { getList, putList } from "./api.js";

// ── The trip group. Edit this list to add/rename/remove people. ──────────────
const PEOPLE = ["Laura", "Jeff", "Kelley", "Doug", "Molly", "Julian", "Emma"];

const categories = [
  {
    id: "clothes",
    label: "Clothing",
    icon: "🧥",
    color: "#4A7C59",
    items: [
      { id: "c1", text: "Moisture-wicking base layer (top & bottom)" },
      { id: "c2", text: "Fleece or mid-layer jacket" },
      { id: "c3", text: "Waterproof/windproof shell jacket" },
      { id: "c4", text: "Waterproof rain pants" },
      { id: "c5", text: "Hiking pants (1–2 pairs)" },
      { id: "c6", text: "Quick-dry shorts" },
      { id: "c7", text: "Moisture-wicking t-shirts (3–4)" },
      { id: "c8", text: "Merino wool hiking socks (3–4 pairs)" },
      { id: "c9", text: "Lightweight liner socks" },
      { id: "c10", text: "Underwear (4–5 pairs, moisture-wicking)" },
      { id: "c11", text: "Warm beanie / wool hat" },
      { id: "c12", text: "Buff / neck gaiter" },
      { id: "c13", text: "Light gloves" },
      { id: "c14", text: "Casual clothes for evenings in Seattle" },
      { id: "c15", text: "Sleepwear / camp loungewear" },
      { id: "c16", text: "Broken-in waterproof hiking boots" },
      { id: "c17", text: "Camp shoes or sandals (Chacos/Crocs)" },
    ],
  },
  {
    id: "accessories",
    label: "Hiking Gear",
    icon: "🎒",
    color: "#7B6D3A",
    items: [
      { id: "a1", text: "Day hiking backpack (25–35L)" },
      { id: "a2", text: "Trekking poles" },
      { id: "a3", text: "Hydration bladder or water bottles (2L+)" },
      { id: "a4", text: "Water filter (Sawyer Squeeze or LifeStraw)" },
      { id: "a5", text: "Trail map + NPS printed maps (no cell service!)" },
      { id: "a6", text: "Compass" },
      { id: "a7", text: "Headlamp + extra batteries" },
      { id: "a8", text: "Sunglasses (UV protection)" },
      { id: "a9", text: "Wide-brim sun hat" },
      { id: "a10", text: "Gaiters (for muddy/snowy trail sections)" },
      { id: "a11", text: "Bear canister or Ursack (required in some zones)" },
      { id: "a12", text: "Trowel + Leave No Trace waste bags" },
      { id: "a13", text: "Emergency whistle" },
      { id: "a14", text: "Lightweight emergency space blanket" },
      { id: "a15", text: "Snacks: trail mix, bars, jerky, gummies" },
      { id: "a16", text: "Packable rain cover for backpack" },
      { id: "a17", text: "Duct tape (small roll — fixes everything)" },
      { id: "a18", text: "Ziploc bags (keep gear dry)" },
    ],
  },
  {
    id: "toiletries",
    label: "Toiletries & Medicine",
    icon: "💊",
    color: "#5B7EA6",
    items: [
      { id: "t1", text: "Sunscreen SPF 50+ (reapply on alpine terrain!)" },
      { id: "t2", text: "Insect repellent (DEET or Picaridin)" },
      { id: "t3", text: "Biodegradable soap & shampoo" },
      { id: "t4", text: "Toothbrush & toothpaste" },
      { id: "t5", text: "Deodorant" },
      { id: "t6", text: "Lip balm with SPF" },
      { id: "t7", text: "Body wipes (for no-shower days)" },
      { id: "t8", text: "Microfiber towel" },
      { id: "t9", text: "Hand sanitizer" },
      { id: "t10", text: "Ibuprofen / Tylenol (muscle aches & altitude)" },
      { id: "t11", text: "Benadryl (allergies / bug reactions)" },
      { id: "t12", text: "Blister kit: moleskin, KT tape, needle" },
      { id: "t13", text: "Ace bandage / ankle wrap" },
      { id: "t14", text: "Antacids (Tums / Pepto tablets)" },
      { id: "t15", text: "Electrolyte packets (Liquid IV / Nuun tabs)" },
      { id: "t16", text: "Personal prescription meds (extra supply)" },
      { id: "t17", text: "Antihistamine cream (bug bites / rashes)" },
      { id: "t18", text: "Band-aids & antiseptic wipes" },
      { id: "t19", text: "Altitude sickness tabs (Dramamine if needed)" },
    ],
  },
  {
    id: "tech",
    label: "Tech & Chargers",
    icon: "🔋",
    color: "#6B5FA6",
    items: [
      { id: "tc1", text: "Phone + charger cable" },
      { id: "tc2", text: "Portable power bank (20,000+ mAh for group)" },
      { id: "tc3", text: "GoPro or action camera + mounts" },
      { id: "tc4", text: "Camera SD cards (extra)" },
      { id: "tc5", text: "Satellite communicator (Garmin inReach / SPOT)" },
      { id: "tc6", text: "Offline maps downloaded (AllTrails, Gaia GPS)" },
      { id: "tc7", text: "Waterproof phone case / dry bag" },
      { id: "tc8", text: "Car charger + multi-USB adapter" },
      { id: "tc9", text: "Headphones / earbuds (for the drive)" },
      { id: "tc10", text: "Bluetooth speaker (for camp / Airbnb vibes)" },
      { id: "tc11", text: "Universal travel adapter (just in case)" },
    ],
  },
  {
    id: "fun",
    label: "Fun & Social",
    icon: "🎉",
    color: "#A65B5B",
    items: [
      { id: "f1", text: "Polaroid / instant camera + film packs" },
      { id: "f2", text: "Card or dice games (Unstable Unicorns, Yahtzee Travel)" },
      { id: "f3", text: "A group playlist curated before the trip 🎵" },
      { id: "f4", text: "Hammock (ultralight — stunning spots at both parks)" },
      { id: "f5", text: "Frisbee or spike ball for the campsite" },
      { id: "f6", text: "Journal or sketchbook" },
      { id: "f7", text: "Local beer / wine for the evening hangout" },
      { id: "f8", text: "Collapsible cups & bottle opener" },
      { id: "f9", text: "Rain ponchos (bright colors — fun + functional)" },
      { id: "f10", text: "Group flag or bandana for photos 📸" },
      { id: "f11", text: "Binoculars (wildlife spotting — Rainier has mountain goats!)" },
      { id: "f12", text: "Seattle restaurant list for when you're back in the city" },
    ],
  },
];

const EMPTY = { checked: {}, custom_items: [], removed_items: [] };
const PERSON_KEY = "rainier-active-person";

export default function HikingChecklist() {
  const [person, setPerson] = useState(
    () => localStorage.getItem(PERSON_KEY) || ""
  );
  const [data, setData] = useState(EMPTY);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newItemText, setNewItemText] = useState({}); // categoryId -> input value
  const saveTimer = useRef(null);
  const lastEditAt = useRef(0);

  // Load the selected person's list, then poll for updates from other devices.
  useEffect(() => {
    if (!person) {
      setData(EMPTY);
      return;
    }
    let cancelled = false;

    const load = async (showSpinner) => {
      if (showSpinner) setLoading(true);
      try {
        const row = await getList(person);
        if (cancelled) return;
        setData({
          checked: row.checked || {},
          custom_items: row.custom_items || [],
          removed_items: row.removed_items || [],
        });
      } catch {
        if (!cancelled) setData(EMPTY);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load(true);

    // Realtime is gone now that the database is locked down — poll instead, but
    // don't clobber an edit the user just made on this device.
    const id = setInterval(() => {
      if (Date.now() - lastEditAt.current > 3000) load(false);
    }, 15000);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [person]);

  // Persist a new state both locally (instant) and to Supabase (debounced).
  const persist = (next) => {
    setData(next);
    if (!person) return;
    lastEditAt.current = Date.now();
    setSaving(true);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await putList({
          person,
          checked: next.checked,
          custom_items: next.custom_items,
          removed_items: next.removed_items,
        });
      } finally {
        setSaving(false);
      }
    }, 400);
  };

  const choosePerson = (name) => {
    setPerson(name);
    if (name) localStorage.setItem(PERSON_KEY, name);
    else localStorage.removeItem(PERSON_KEY);
  };

  const toggle = (id) =>
    persist({ ...data, checked: { ...data.checked, [id]: !data.checked[id] } });

  const removeItem = (item) => {
    if (item.custom) {
      persist({
        ...data,
        custom_items: data.custom_items.filter((i) => i.id !== item.id),
        checked: omit(data.checked, item.id),
      });
    } else {
      persist({
        ...data,
        removed_items: [...data.removed_items, item.id],
        checked: omit(data.checked, item.id),
      });
    }
  };

  const addItem = (categoryId) => {
    const text = (newItemText[categoryId] || "").trim();
    if (!text) return;
    const id = `u_${categoryId}_${Date.now()}`;
    persist({
      ...data,
      custom_items: [...data.custom_items, { id, categoryId, text, custom: true }],
    });
    setNewItemText((p) => ({ ...p, [categoryId]: "" }));
  };

  // Build each category's visible items: base items minus removed, plus custom.
  const builtCategories = useMemo(() => {
    const removed = new Set(data.removed_items);
    return categories.map((cat) => {
      const base = cat.items
        .filter((i) => !removed.has(i.id))
        .map((i) => ({ ...i, custom: false }));
      const extra = data.custom_items.filter((i) => i.categoryId === cat.id);
      return { ...cat, items: [...base, ...extra] };
    });
  }, [data]);

  const allItems = builtCategories.flatMap((c) => c.items);
  const totalItems = allItems.length;
  const checkedCount = allItems.filter((i) => data.checked[i.id]).length;
  const progress = totalItems ? Math.round((checkedCount / totalItems) * 100) : 0;

  const displayCategories =
    activeTab === "all"
      ? builtCategories
      : builtCategories.filter((c) => c.id === activeTab);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0d1f14 0%, #1a2e1e 40%, #0e1a2b 100%)",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      padding: "0 0 80px 0",
    }}>
      {/* Header */}
      <div style={{
        padding: "48px 24px 32px",
        textAlign: "center",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ fontSize: 13, letterSpacing: "0.3em", color: "#8aab8a", textTransform: "uppercase", marginBottom: 12 }}>
          June 04 – 12th, 2026 · Pacific Northwest
        </div>
        <h1 style={{
          margin: 0,
          fontSize: "clamp(2rem, 6vw, 3.5rem)",
          color: "#e8f0e8",
          fontWeight: "normal",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
        }}>
          Seattle <span style={{ color: "#7bb87b", fontStyle: "italic" }}>National Park</span> Trip!
        </h1>
        <p style={{ color: "#6b8b6b", marginTop: 14, fontSize: 15, letterSpacing: "0.05em" }}>
          Seattle base · Hiking · Group adventure
        </p>

        {/* Person selector */}
        <div style={{ maxWidth: 400, margin: "28px auto 0", textAlign: "left" }}>
          <label style={{ display: "block", color: "#8aab8a", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
            Whose list?
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={person}
              onChange={(e) => choosePerson(e.target.value)}
              style={{
                width: "100%",
                appearance: "none",
                padding: "12px 16px",
                borderRadius: 10,
                border: "1.5px solid rgba(123,184,123,0.4)",
                background: "rgba(74,124,89,0.15)",
                color: "#e8f0e8",
                fontSize: 16,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              <option value="">— Select your name —</option>
              {PEOPLE.map((name) => (
                <option key={name} value={name} style={{ background: "#13241a" }}>
                  {name}
                </option>
              ))}
            </select>
            <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#7bb87b", pointerEvents: "none" }}>▾</span>
          </div>
          <div style={{ minHeight: 16, marginTop: 6, fontSize: 12, color: "#6b8b6b", textAlign: "right" }}>
            {saving ? "Saving…" : loading ? "Loading…" : person ? "Saved ✓" : ""}
          </div>
        </div>

        {/* Progress bar (only once a person is chosen) */}
        {person && (
          <div style={{ maxWidth: 400, margin: "8px auto 0" }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              color: "#8aab8a", fontSize: 13, marginBottom: 8, letterSpacing: "0.05em"
            }}>
              <span>{checkedCount} of {totalItems} packed</span>
              <span>{progress}%</span>
            </div>
            <div style={{
              height: 6, borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #4A7C59, #7bb87b)",
                borderRadius: 999,
                transition: "width 0.4s ease",
              }} />
            </div>
            {progress === 100 && (
              <div style={{ color: "#7bb87b", textAlign: "center", marginTop: 10, fontSize: 14 }}>
                ✓ {person}, you're ready to hit the trail!
              </div>
            )}
          </div>
        )}
      </div>

      {!person ? (
        <div style={{ maxWidth: 520, margin: "60px auto", padding: "0 24px", textAlign: "center", color: "#8aab8a", fontSize: 16, lineHeight: 1.7 }}>
          👋 Pick your name above to open your packing list.<br />
          Everything you check is saved automatically and syncs for the whole group.
        </div>
      ) : (
        <>
          {/* Category tabs */}
          <div style={{
            display: "flex", gap: 8,
            overflowX: "auto", padding: "20px 24px 0",
            scrollbarWidth: "none",
            maxWidth: 900, margin: "0 auto",
          }}>
            {[{ id: "all", label: "All", icon: "🗺️" }, ...categories].map((c) => {
              const isActive = activeTab === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveTab(c.id)}
                  style={{
                    flexShrink: 0,
                    padding: "8px 18px",
                    borderRadius: 999,
                    border: isActive ? `1.5px solid ${c.color || "#7bb87b"}` : "1.5px solid rgba(255,255,255,0.12)",
                    background: isActive ? `${c.color || "#4A7C59"}22` : "transparent",
                    color: isActive ? (c.color || "#7bb87b") : "#8aab8a",
                    fontSize: 13,
                    cursor: "pointer",
                    letterSpacing: "0.05em",
                    transition: "all 0.2s",
                    display: "flex", gap: 6, alignItems: "center",
                  }}
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>

          {/* Category sections */}
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 0" }}>
            {displayCategories.map((cat) => {
              const catChecked = cat.items.filter((i) => data.checked[i.id]).length;
              return (
                <div key={cat.id} style={{
                  marginBottom: 32,
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.07)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    padding: "20px 24px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 22 }}>{cat.icon}</span>
                      <div>
                        <div style={{
                          color: cat.color, fontSize: 11,
                          letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 2,
                        }}>
                          Category
                        </div>
                        <div style={{ color: "#e8f0e8", fontSize: 18, fontWeight: "normal" }}>
                          {cat.label}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      background: `${cat.color}22`,
                      border: `1px solid ${cat.color}44`,
                      color: cat.color,
                      borderRadius: 999,
                      padding: "4px 14px",
                      fontSize: 13,
                    }}>
                      {catChecked}/{cat.items.length}
                    </div>
                  </div>

                  <div style={{ padding: "8px 0" }}>
                    {cat.items.map((item) => {
                      const isDone = data.checked[item.id];
                      return (
                        <div
                          key={item.id}
                          style={{
                            display: "flex", alignItems: "center", gap: 14,
                            padding: "12px 24px",
                            transition: "background 0.15s",
                            background: isDone ? `${cat.color}0a` : "transparent",
                            borderBottom: "1px solid rgba(255,255,255,0.04)",
                          }}
                        >
                          <div
                            onClick={() => toggle(item.id)}
                            style={{
                              width: 20, height: 20,
                              borderRadius: 5,
                              border: isDone ? `2px solid ${cat.color}` : "2px solid rgba(255,255,255,0.2)",
                              background: isDone ? cat.color : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              flexShrink: 0,
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}>
                            {isDone && (
                              <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                                <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          <span
                            onClick={() => toggle(item.id)}
                            style={{
                              flex: 1,
                              color: isDone ? "#5a7a5a" : "#c8d8c8",
                              fontSize: 15,
                              textDecoration: isDone ? "line-through" : "none",
                              transition: "all 0.2s",
                              lineHeight: 1.4,
                              cursor: "pointer",
                            }}>
                            {item.text}
                            {item.custom && (
                              <span style={{ color: cat.color, fontSize: 11, marginLeft: 8, opacity: 0.8 }}>added</span>
                            )}
                          </span>
                          <button
                            onClick={() => removeItem(item)}
                            title="Remove from my list"
                            style={{
                              flexShrink: 0,
                              width: 26, height: 26,
                              borderRadius: 6,
                              border: "1px solid rgba(255,255,255,0.1)",
                              background: "transparent",
                              color: "#6b8b6b",
                              cursor: "pointer",
                              fontSize: 14,
                              lineHeight: 1,
                            }}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}

                    {/* Add-item row */}
                    <div style={{ display: "flex", gap: 8, padding: "14px 24px 6px" }}>
                      <input
                        value={newItemText[cat.id] || ""}
                        onChange={(e) => setNewItemText((p) => ({ ...p, [cat.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && addItem(cat.id)}
                        placeholder={`Add to ${cat.label}…`}
                        style={{
                          flex: 1,
                          padding: "10px 14px",
                          borderRadius: 10,
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(255,255,255,0.04)",
                          color: "#e8f0e8",
                          fontSize: 14,
                          fontFamily: "inherit",
                        }}
                      />
                      <button
                        onClick={() => addItem(cat.id)}
                        style={{
                          flexShrink: 0,
                          padding: "0 18px",
                          borderRadius: 10,
                          border: `1px solid ${cat.color}66`,
                          background: `${cat.color}22`,
                          color: cat.color,
                          fontSize: 14,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Footer tips */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <div style={{
          background: "rgba(74, 124, 89, 0.08)",
          border: "1px solid rgba(74, 124, 89, 0.25)",
          borderRadius: 16,
          padding: "20px 24px",
        }}>
          <div style={{ color: "#7bb87b", fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12 }}>
            Trail Notes
          </div>
          <div style={{ color: "#8aab8a", fontSize: 14, lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 6 }}>
            <span>🏔️ Mt. Rainier can have snow year-round — layers are non-negotiable</span>
            <span>🌧️ Olympic rainforest gets 12+ ft of rain/yr — waterproofing everything is key</span>
            <span>📡 Cell signal is basically non-existent on the trails — download maps offline</span>
            <span>🐻 Bear canisters are required in some Mt. Rainier wilderness zones</span>
            <span>🎫 Get your America the Beautiful pass ($80) — covers both parks entry</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function omit(obj, key) {
  const next = { ...obj };
  delete next[key];
  return next;
}
