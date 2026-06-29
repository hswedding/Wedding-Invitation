import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap.js';
import { story } from '../data.js';
import Icon from '../components/Icons.jsx';

/* Scene 3 — Our Story. A vertical timeline whose beats reveal on scroll and
   whose connecting line draws as you progress. */
export default function Story() {
  const root = useRef(null);

  useGSAP(() => {
    gsap.from('.story__beat', {
      scrollTrigger: { trigger: '.story__line', start: 'top 75%' },
      y: 30, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.18,
    });
    gsap.from('.story__progress', {
      scrollTrigger: { trigger: '.story__line', start: 'top 80%', end: 'bottom 60%', scrub: true },
      scaleY: 0, transformOrigin: 'top', ease: 'none',
    });
  }, { scope: root });

  return (
    <section className="story section" id="main-content" ref={root}>
      <div className="section__inner">
        <p className="eyebrow">Forever Us</p>
        <h2 className="display">{story.title}</h2>
        <p className="story__intro">{story.intro}</p>

        <div className="story__line">
          <span className="story__progress" aria-hidden="true" />
          {story.beats.map((b) => (
            <article className="story__beat" key={b.year}>
              <span className="story__dot" aria-hidden="true">
                <Icon name="heart" size={14} />
              </span>
              <span className="story__year">{b.year}</span>
              <h3 className="serif-h story__heading">{b.heading}</h3>
              <p className="story__text">{b.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
