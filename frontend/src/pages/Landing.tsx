import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { brand, FAQ, PARTNER_LOGOS } from "../brand";
import { RelayMark } from "../components/RelayMark";
import { GetStarted } from "../components/GetStarted";
import { NeuralScene } from "../components/NeuralScene";
import { ThemeToggle } from "../theme";

function CycleWords() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setI((n) => (n + 1) % brand.cycle.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, [reduce]);

  const word = brand.cycle[reduce ? 0 : i];

  return (
    <h1 aria-live="polite" className="cycle-heading">
      <span className="sr-only">Detect. Decide. Act.</span>
      <span aria-hidden className="cycle-word">
        <AnimatePresence mode="wait">
          <motion.span
            key={word}
            initial={reduce ? false : { y: "80%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: "-80%", opacity: 0 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "block" }}
          >
            {word}
          </motion.span>
        </AnimatePresence>
      </span>
    </h1>
  );
}

function HeroMedia() {
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
    <div className="hero-media" aria-label="Product preview">
      {hasVideo ? (
        <video src={brand.heroVideo} autoPlay muted loop playsInline />
      ) : (
        <NeuralScene />
      )}
    </div>
  );
}

function CapabilityCards() {
  return (
    <section className="cap-section" aria-labelledby="cap-title">
      <h2 id="cap-title">{brand.capabilityHeadline}</h2>
      <p className="lede">{brand.capabilityLede}</p>
      <div className="cap-grid">
        <article className="cap-card">
          <div className="cap-visual">
            <div className="cap-snippet snippet-bins" aria-hidden>
              <div className="snippet-bin"><div className="t">6:20</div><div className="n">4/3</div></div>
              <div className="snippet-bin"><div className="t">6:35</div><div className="n">3/3</div></div>
              <div className="snippet-bin caution"><div className="t">6:50</div><div className="n">2/3</div></div>
              <div className="snippet-bin critical"><div className="t">7:05</div><div className="n">1/3</div></div>
            </div>
          </div>
          <div className="cap-body">
            <h3>Detect</h3>
            <p>Rank coverage risk across the next 90 minutes. Surface the gap before the consult waits.</p>
          </div>
        </article>
        <article className="cap-card">
          <div className="cap-visual">
            <div className="cap-snippet" aria-hidden>
              <div className="snippet-rules">
                <div className="snippet-rule pass"><span>Credentialed</span><strong>Pass</strong></div>
                <div className="snippet-rule pass"><span>Rest window</span><strong>Pass</strong></div>
                <div className="snippet-rule fail"><span>7-day hours</span><strong>Fail</strong></div>
              </div>
              <div className="snippet-trap">Split-shift trap guarded</div>
            </div>
          </div>
          <div className="cap-body">
            <h3>Decide</h3>
            <p>Explainable eligibility first. Human approval before any offer leaves the desk.</p>
          </div>
        </article>
        <article className="cap-card">
          <div className="cap-visual">
            <div className="cap-snippet snippet-steps" aria-hidden>
              <span className="snippet-step done">1. Propose</span>
              <span className="snippet-step on">2. Approve</span>
              <span className="snippet-step">3. Send</span>
              <span className="snippet-step">4. Respond</span>
            </div>
          </div>
          <div className="cap-body">
            <h3>Act</h3>
            <p>Approve once. Relay runs the offer loop until capacity is restored, then stops.</p>
          </div>
        </article>
      </div>
    </section>
  );
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section className="faq-section" aria-labelledby="faq-title">
      <div className="faq-left">
        <h2 id="faq-title">{brand.faqTitle}</h2>
        <p>{brand.faqTouch}</p>
      </div>
      <div className="faq-right">
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <div className="faq-item" key={item.q}>
              <button
                type="button"
                className="faq-q"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} aria-hidden>
                  ▾
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    key="a"
                    className="faq-a"
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p>{item.a}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MissionStrip() {
  return (
    <section className="mission-strip" aria-labelledby="mission-title">
      <p className="mission-pill">{brand.pill}</p>
      <h2 id="mission-title">{brand.missionHeadline}</h2>
      <p>{brand.missionBody}</p>
    </section>
  );
}

function PartnerMarquee() {
  const marks = [...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS];
  return (
    <section className="partner-marquee-section" aria-label={brand.partnersHeader}>
      <p className="partner-label">{brand.partnersHeader}</p>
      <div className="logo-marquee-wrap">
        <div className="logo-marquee partner-marquee">
          {marks.map((m, idx) => (
            <img key={`${m.alt}-${idx}`} src={m.src} alt="" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { y: 28, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <div className="slash-landing slash-entrance landing-atmosphere">
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="slash-nav-bar">
        <div className="slash-nav">
          <RelayMark size="nav" />
          <div className="slash-nav-actions">
            <GetStarted />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main">
        <section className="slash-hero">
          <div className="slash-hero-copy">
            <motion.div {...rise(0.15)}><CycleWords /></motion.div>
            <motion.p className="slogan" {...rise(0.28)}>{brand.slogan}</motion.p>
            <motion.div className="cta-row" {...rise(0.4)}>
              <Link to="/app" className="btn btn-primary btn-nav">{brand.ctaPrimary}</Link>
            </motion.div>
          </div>
          <HeroMedia />
        </section>

        <CapabilityCards />
        <FaqSection />
        <MissionStrip />
      </main>

      <footer className="slash-footer collab-footer">
        <div className="footer-left">
          <RelayMark size="sm" href={null} />
          <p>{brand.disclaimer}</p>
        </div>
        <div className="collab-block">
          <p className="collab-label">{brand.collabHeader}</p>
          <div className="brand-row color-logos">
            {PARTNER_LOGOS.map((m) => (
              <img key={m.alt} src={m.src} alt={m.alt} />
            ))}
          </div>
        </div>
      </footer>

      <PartnerMarquee />
    </div>
  );
}