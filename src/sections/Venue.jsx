import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap.js';
import Icon from '../components/Icons.jsx';

/* Scene 5 — The Venue. Shows each unique venue across the selected functions
   with a directions link, plus an embedded map for the primary one. */
export default function Venue({ events }) {
  const root = useRef(null);

  useGSAP(() => {
    gsap.from('.venue__card, .venue__map', {
      scrollTrigger: { trigger: root.current, start: 'top 78%' },
      y: 24, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12,
    });
  }, { scope: root });

  // unique venues, primary = the last (wedding) event's venue
  const seen = new Map();
  for (const e of events) {
    const key = e.venue?.name + '|' + e.venue?.area;
    if (!seen.has(key)) seen.set(key, { venue: e.venue, events: [] });
    seen.get(key).events.push(e.name);
  }
  const venues = [...seen.values()];
  if (!venues.length) return null;
  const primary = venues[venues.length - 1].venue;
  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    `${primary.name} ${primary.area || ''}`
  )}&output=embed`;

  return (
    <section className="venue section" id="venue-section" ref={root}>
      <div className="section__inner">
        <p className="eyebrow">Getting There</p>
        <h2 className="display">The Venue</h2>

        <div className="venue__cards">
          {venues.map(({ venue, events: ev }, i) => (
            <div className="venue__card card" key={i}>
              <h3 className="serif-h">{venue.name}</h3>
              {venue.area && <p className="venue__area">{venue.area}</p>}
              <p className="venue__for">{ev.join(' · ')}</p>
              <a
                className="btn btn--gold"
                href={venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="location" size={18} /> Get directions
              </a>
            </div>
          ))}
        </div>

        <div className="venue__map card">
          <iframe
            title={`Map to ${primary.name}`}
            src={embedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
