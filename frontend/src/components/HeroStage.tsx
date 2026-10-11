import { useEffect, useState } from "react";
import { brand } from "../brand";
import { NeuroHero } from "./NeuroHero";

export function HeroStage() {
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(brand.heroVideo, { method: "HEAD" })
      .then((r) => {
        if (!cancelled && r.ok) setHasVideo(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="hero-media hero-stage" aria-label="Neurology coverage preview">
      {hasVideo ? (
        <video src={brand.heroVideo} autoPlay muted loop playsInline />
      ) : (
        <NeuroHero />
      )}
    </div>
  );
}
