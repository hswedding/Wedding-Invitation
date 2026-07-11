import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap.js';
import { couple, wedding, families } from '../data.js';
import ScratchCard from '../components/ScratchCard.jsx';
import Icon from '../components/Icons.jsx';

/* Scene 1 — Save the Date. Opens with the Ganesha invocation (Indian fusion),
   the couple's names, and a scratch card hiding the wedding date. */
export default function Hero({ invite }) {
  const root = useRef(null);
  const family = families[invite.side] || families.joint;

  useGSAP(() => {
    gsap.from('.hero__reveal', {
      y: 26, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.15,
    });
  }, { scope: root });

  return (
    <header className="hero section" id="hero" ref={root}>
      <div className="section__inner hero__inner">
        <p className="hero__invocation hero__reveal" lang="sa">॥ श्री गणेशाय नमः ॥</p>

        {invite.guestName && (
          <p className="hero__guest hero__reveal">Dear {invite.guestName},</p>
        )}

        <h1 className="hero__names hero__reveal">
          <span>{couple.groom.first}</span>
          <span className="hero__amp">&amp;</span>
          <span>{couple.bride.first}</span>
        </h1>

        <p className="hero__line hero__reveal">{family.inviteLine}</p>

        <div className="hero__reveal">
          <ScratchCard prompt={wedding.scratchPrompt}>
            <div className="hero__date">
              <span className="hero__date-day">{wedding.dayLabel}</span>
              <span className="hero__date-main">{wedding.dateLabel}</span>
            </div>
          </ScratchCard>
        </div>
      </div>
    </header>
  );
}
