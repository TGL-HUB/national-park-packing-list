import { useEffect, useState } from "react";
import { AuthError, getTrip, login } from "./api.js";
import TripApp from "./TripApp.jsx";

// Auth gate: tries to load the (protected) trip data. A 401 means we're not
// signed in, so we show the access-code screen. On success the trip data is
// handed to the app — it never ships in the public bundle.
export default function Gate() {
  const [status, setStatus] = useState("loading"); // 'loading' | 'locked' | 'ready'
  const [data, setData] = useState(null);

  async function loadTrip() {
    const trip = await getTrip();
    setData(trip);
    setStatus("ready");
  }

  useEffect(() => {
    loadTrip().catch((e) => {
      if (e instanceof AuthError) setStatus("locked");
      else setStatus("locked"); // network/other: still gate the UI
    });
  }, []);

  if (status === "loading") return <Splash>Loading…</Splash>;
  if (status === "ready") return <TripApp data={data} />;
  return <Lock onUnlocked={loadTrip} />;
}

function Splash({ children }) {
  return (
    <div style={wrap}>
      <div style={{ color: "white", opacity: 0.85, fontSize: 15 }}>{children}</div>
    </div>
  );
}

function Lock({ onUnlocked }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!code.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      const ok = await login(code.trim());
      if (!ok) {
        setError("That code didn't work. Try again.");
        setBusy(false);
        return;
      }
      await onUnlocked();
    } catch {
      setError("Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div style={wrap}>
      <form onSubmit={submit} style={cardStyle}>
        <div style={{ fontSize: 44, marginBottom: 6 }}>🐋 🔒</div>
        <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 900, color: "#0b3d4f" }}>Private trip</h1>
        <p style={{ margin: "0 0 18px", fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>
          This itinerary is just for the crew. Enter the access code you were given.
        </p>
        <input
          type="password"
          inputMode="text"
          autoComplete="off"
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Access code"
          style={input}
        />
        {error && <div style={{ color: "#dc2626", fontSize: 13, marginTop: 10, fontWeight: 600 }}>{error}</div>}
        <button type="submit" disabled={busy} style={{ ...button, opacity: busy ? 0.6 : 1 }}>
          {busy ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}

const wrap = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  background: "linear-gradient(135deg,#0b3d4f 0%,#10566b 45%,#1c7e7a 100%)",
  fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
};

const cardStyle = {
  background: "white",
  borderRadius: 20,
  padding: "32px 26px",
  width: "100%",
  maxWidth: 360,
  textAlign: "center",
  boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
};

const input = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 16px",
  fontSize: 16,
  borderRadius: 12,
  border: "1.5px solid #cbd5e1",
  outline: "none",
};

const button = {
  width: "100%",
  marginTop: 14,
  padding: "13px 16px",
  fontSize: 16,
  fontWeight: 800,
  color: "white",
  background: "#0b3d4f",
  border: "none",
  borderRadius: 12,
  cursor: "pointer",
};
