"use client";

import Link from "next/link";

// Catches a catalog read failure thrown by page.tsx. Deliberately distinct
// from not-found.tsx: a data-source failure must never look like "this game
// doesn't exist" (game-detail spec: "Catalog read failure is not treated as
// unknown game").
export default function GameDetailError({ reset }: { reset: () => void }) {
  return (
    <div
      className="fade-in"
      style={{
        maxWidth: 640,
        margin: "80px auto",
        padding: "0 24px",
        textAlign: "center",
      }}
    >
      <div className="pixel neon-magenta" style={{ fontSize: 22, marginBottom: 16 }}>
        ERROR AL CARGAR EL JUEGO
      </div>
      <p style={{ color: "var(--ink-dim)", marginBottom: 24 }}>
        No se pudo conectar con la bóveda. Inténtalo de nuevo en unos
        instantes.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button className="btn lg" onClick={reset} type="button">
          REINTENTAR
        </button>
        <Link className="btn ghost lg" href="/games">
          VOLVER AL VAULT
        </Link>
      </div>
    </div>
  );
}
