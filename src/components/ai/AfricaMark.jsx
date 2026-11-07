// Silhouette stylisée du continent africain — signature visuelle de l'assistant.
// Dessinée en vectoriel : nette à toutes les tailles, teintée par `currentColor`.
export default function AfricaMark({ className = "", strokeWidth = 2.4, glow = false }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      aria-hidden="true"
      style={glow ? { filter: "drop-shadow(0 0 5px currentColor)" } : undefined}
    >
      <path
        d="M23 13 L31 11 41 10 47 15 56 17 63 15 66 22 70 29 76 30 83 33 90 36 84 42 78 47 74 55 71 64 66 73 60 80 52 90 47 88 44 80 41 72 38 64 33 58 30 52 24 50 19 46 14 40 9 34 6 27 11 22 16 17 20 15 Z"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M78 68 L81 74 80 82 77 86 75 80 76 72 Z"
        fill="currentColor"
        fillOpacity="0.35"
        stroke="currentColor"
        strokeWidth={strokeWidth * 0.7}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="56" cy="32" r="2" fill="currentColor" />
    </svg>
  );
}