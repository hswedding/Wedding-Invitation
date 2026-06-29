import { couple, families } from '../data.js';
import { buildWhatsAppShare } from '../lib/config.js';
import Icon from '../components/Icons.jsx';

/* Footer — gratitude, family contacts, hashtag, and a WhatsApp share CTA. */
export default function Footer({ invite }) {
  const family = families[invite.side] || families.joint;
  const names = `${couple.groom.first} & ${couple.bride.first}`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareHref = buildWhatsAppShare(shareUrl, invite.guestName, names);

  return (
    <footer className="footer section" id="footer-section">
      <div className="section__inner">
        <Icon name="lotus" size={30} className="footer__crest" />
        <h2 className="display footer__thanks">Thank You</h2>
        <p className="footer__names">{names}</p>
        <p className="footer__sign">{family.sign}</p>

        <div className="divider" aria-hidden="true"><Icon name="sparkle" size={16} /></div>

        <ul className="footer__contacts">
          {family.contacts.map((c) => (
            <li key={c.phone}>
              <a href={`tel:${c.phone}`}>{c.name}</a>
            </li>
          ))}
        </ul>

        <a className="btn btn--primary footer__share" href={shareHref}
          target="_blank" rel="noopener noreferrer">
          <Icon name="whatsapp" size={18} /> Share this invitation
        </a>

        <p className="footer__hashtag">{couple.hashtag}</p>
      </div>
    </footer>
  );
}
