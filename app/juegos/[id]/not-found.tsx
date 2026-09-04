import Link from "next/link";

export default function GameNotFound() {
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
        JUEGO NO ENCONTRADO
      </div>
      <p style={{ color: "var(--ink-dim)", marginBottom: 24 }}>
        Este cartucho no existe en la bóveda. Puede que se haya perdido en el
        vacío del espacio.
      </p>
      <Link className="btn lg" href="/">
        VOLVER AL VAULT
      </Link>
    </div>
  );
}
