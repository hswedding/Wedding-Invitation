import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap.js';
import Icon from '../components/Icons.jsx';

const SIDE_LABEL = {
  bride: 'Bride’s side',
  groom: 'Groom’s side',
  together: 'Both families',
};

/* Scene 4 — The Celebrations. Only the functions selected for this guest are
   rendered; each card carries a dress-code colour dot and a side badge. */
export default function Events({ events }) {
  const root = useRef(null);

  useGSAP(() => {
    gsap.from('.event-card', {
      scrollTrigger: { trigger: root.current, start: 'top 75%' },
      y: 28, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1,
    });
  }, { scope: root, dependencies: [events.length] });

  if (!events.length) return null;

  return (
    <section className="events section" id="events-section" ref={root}>
      <div className="section__inner">
        <p className="eyebrow">The Celebrations Unfold</p>
        <h2 className="display">Festivities</h2>

        <ul className="events__list">
          {events.map((e) => (
            <li className="event-card card" key={e.id}>
              <span className={`event-card__side event-card__side--${e.side}`}>
                {SIDE_LABEL[e.side]}
              </span>
              <div className="event-card__head">
                <span className="event-card__icon" aria-hidden="true">
                  <Icon name={e.icon} size={26} />
                </span>
                <div>
                  <h3 className="event-card__name">{e.name}</h3>
                  {e.nameDeva && <p className="event-card__deva" lang="hi">{e.nameDeva}</p>}
                </div>
              </div>

              <p className="event-card__blurb">{e.blurb}</p>

              <dl className="event-card__meta">
                <div>
                  <dt><Icon name="calendar" size={16} /> When</dt>
                  <dd>{e.dateLabel} · {e.timeLabel}</dd>
                </div>
                <div>
                  <dt><Icon name="location" size={16} /> Where</dt>
                  <dd>
                    {e.venue?.name}
                    {e.venue?.area ? `, ${e.venue.area}` : ''}
                  </dd>
                </div>
              </dl>

              <p className="event-card__dress">
                <span
                  className="event-card__dot"
                  style={{ background: e.dressCode.color }}
                  aria-hidden="true"
                />
                Dress code: {e.dressCode.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
