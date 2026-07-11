import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { useConfig } from './hooks/useConfig.js';
import { selectedEvents } from './lib/config.js';
import { gsap, ScrollTrigger } from './lib/gsap.js';
import { useReducedMotion } from './hooks/useReducedMotion.js';

import Envelope from './sections/Envelope.jsx';
import Hero from './sections/Hero.jsx';
import Countdown from './sections/Countdown.jsx';
import EventFilms from './sections/EventFilms.jsx';
import Venue from './sections/Venue.jsx';
import Rsvp from './sections/Rsvp.jsx';
import Footer from './sections/Footer.jsx';
import ControlPanel from './sections/ControlPanel.jsx';
import Petals from './components/Petals.jsx';
import Icon from './components/Icons.jsx';

export default function App() {
  const invite = useConfig();
  const events = selectedEvents(invite.eventIds);
  const reduced = useReducedMotion();
  // Host preview skips the envelope so the page is visible behind the panel.
  const [opened, setOpened] = useState(invite.isHost);
  // App-wide sound for the invitation films (videos autoplay muted).
  const [soundOn, setSoundOn] = useState(false);

  // Lock scroll behind the envelope; refresh scroll positions once revealed.
  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden';
    if (opened) {
      const t = setTimeout(() => ScrollTrigger.refresh(), 120);
      return () => clearTimeout(t);
    }
  }, [opened]);

  // Buttery smooth scrolling (Lenis) synced with GSAP ScrollTrigger.
  useEffect(() => {
    if (!opened || reduced) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, anchors: true });
    window.__lenis = lenis; // programmatic scrolls must go through lenis.scrollTo
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [opened, reduced]);

  return (
    <>
      <Petals active={opened} />

      {!opened && <Envelope onOpen={() => setOpened(true)} />}

      <main className="page" id="main-content" aria-hidden={!opened}>
        <Hero invite={invite} />
        {invite.sections.countdown && <Countdown />}
        <EventFilms events={events} soundOn={soundOn} />
        {invite.sections.venue && <Venue events={events} />}
        {invite.sections.rsvp && <Rsvp />}
        <Footer invite={invite} />
      </main>

      {opened && (
        <button
          type="button"
          className="music-toggle"
          onClick={() => setSoundOn((s) => !s)}
          aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
          aria-pressed={soundOn}
        >
          <Icon name={soundOn ? 'speaker' : 'speakerOff'} size={20} />
        </button>
      )}
      {invite.isHost && <ControlPanel />}
    </>
  );
}
