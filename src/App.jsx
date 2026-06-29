import { useEffect, useState } from 'react';
import { useConfig } from './hooks/useConfig.js';
import { selectedEvents } from './lib/config.js';
import { ScrollTrigger } from './lib/gsap.js';

import Envelope from './sections/Envelope.jsx';
import Hero from './sections/Hero.jsx';
import Countdown from './sections/Countdown.jsx';
import Story from './sections/Story.jsx';
import Events from './sections/Events.jsx';
import Venue from './sections/Venue.jsx';
import Rsvp from './sections/Rsvp.jsx';
import Footer from './sections/Footer.jsx';
import ControlPanel from './sections/ControlPanel.jsx';
import Petals from './components/Petals.jsx';
import MusicToggle from './components/MusicToggle.jsx';

export default function App() {
  const invite = useConfig();
  const events = selectedEvents(invite.eventIds);
  // Host preview skips the envelope so the page is visible behind the panel.
  const [opened, setOpened] = useState(invite.isHost);

  // Lock scroll behind the envelope; refresh scroll positions once revealed.
  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden';
    if (opened) {
      const t = setTimeout(() => ScrollTrigger.refresh(), 120);
      return () => clearTimeout(t);
    }
  }, [opened]);

  return (
    <>
      <Petals active={opened} />

      {!opened && <Envelope onOpen={() => setOpened(true)} />}

      <main className="page" aria-hidden={!opened}>
        <Hero invite={invite} />
        {invite.sections.countdown && <Countdown />}
        {invite.sections.story && <Story />}
        {invite.sections.events && events.length > 0 && <Events events={events} />}
        {invite.sections.venue && <Venue events={events} />}
        {invite.sections.rsvp && <Rsvp />}
        <Footer invite={invite} />
      </main>

      {opened && <MusicToggle started={opened} enabled={invite.music} />}
      {invite.isHost && <ControlPanel />}
    </>
  );
}
