// Couche décorative animée : halos de couleur, tracés de pinceau et particules.
// Purement visuelle (aria-hidden), elle ne modifie ni la mise en page ni le contenu.
export default function ArtisticBackdrop({ variant = "dark" }) {
  const dark = variant === "dark";

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <span
        className={
          dark
            ? "anim-aurora absolute -left-24 top-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(227,29,43,0.55),transparent_65%)] blur-3xl"
            : "anim-aurora absolute -left-24 top-[-10%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle_at_center,rgba(227,29,43,0.28),transparent_65%)] blur-3xl"
        }
      />
      <span
        className={
          dark
            ? "anim-aurora-slow absolute right-[-10%] top-[10%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(69,90,100,0.75),transparent_68%)] blur-3xl"
            : "anim-aurora-slow absolute right-[-10%] top-[10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(69,90,100,0.35),transparent_68%)] blur-3xl"
        }
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M-40 620 C 220 540, 360 700, 620 610 S 1040 470, 1240 560"
          stroke={dark ? "rgba(255,255,255,0.20)" : "rgba(29,29,29,0.14)"}
          strokeWidth="1.4"
          className="anim-stroke"
        />
        <path
          d="M-40 690 C 260 630, 420 760, 700 660 S 1060 560, 1240 640"
          stroke="rgba(227,29,43,0.45)"
          strokeWidth="1.6"
          className="anim-stroke anim-stroke-late"
        />
      </svg>

      {[
        { top: "22%", left: "14%", size: 5, delay: "0s" },
        { top: "38%", left: "72%", size: 3, delay: "1.4s" },
        { top: "64%", left: "28%", size: 4, delay: "2.6s" },
        { top: "18%", left: "52%", size: 3, delay: "3.4s" },
        { top: "76%", left: "82%", size: 5, delay: "0.8s" },
      ].map((p, i) => (
        <span
          key={i}
          className="anim-float absolute rounded-full bg-accent/70"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}