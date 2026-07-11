import { useEffect, useMemo, useState } from 'react';
import { events, presets, toggleableSections, config } from '../data.js';
import {
  parseInvitation, buildQuery, buildShareUrl, buildWhatsAppShare, orderedCouple,
} from '../lib/config.js';
import { applyQuery } from '../hooks/useConfig.js';
import Icon from '../components/Icons.jsx';

const SIDES = [
  { id: 'joint', label: 'Joint' },
  { id: 'bride', label: 'Bride' },
  { id: 'groom', label: 'Groom' },
];

/* Host control panel (opens at ?host). Pick a guest's functions, sections and
   side; it live-updates the page behind and builds a shareable link. Client-side
   only — obscure, not secured. */
export default function ControlPanel() {
  const init = useMemo(
    () => parseInvitation(window.location.search, window.location.pathname),
    []
  );
  const [state, setState] = useState({
    side: init.side,
    guestName: init.guestName,
    eventIds: init.eventIds,
    sections: {
      countdown: init.sections.countdown,
      venue: init.sections.venue,
      rsvp: init.sections.rsvp,
    },
  });
  const [copied, setCopied] = useState(false);

  // live-preview the page behind the panel (keep ?host so the panel stays open)
  useEffect(() => {
    const q = buildQuery(state);
    const sep = q ? '&' : '?';
    applyQuery(`${q}${sep}host`);
  }, [state]);

  const base = config.siteUrl || window.location.origin;
  const shareUrl = buildShareUrl(base, state);
  const names = orderedCouple(state.side).map((c) => c.first).join(' & ');
  const waHref = buildWhatsAppShare(shareUrl, state.guestName, names);

  const setSide = (side) => setState((s) => ({ ...s, side }));
  const applyPreset = (key) => {
    const p = presets[key];
    setState((s) => ({
      ...s,
      eventIds: [...p.ids],
      side: key === 'bride' ? 'bride' : key === 'groom' ? 'groom' : s.side,
    }));
  };
  const toggleEvent = (id) =>
    setState((s) => ({
      ...s,
      eventIds: s.eventIds.includes(id)
        ? s.eventIds.filter((x) => x !== id)
        : [...s.eventIds, id],
    }));
  const toggleSection = (id) =>
    setState((s) => ({ ...s, sections: { ...s.sections, [id]: !s.sections[id] } }));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked */ }
  };
  const close = () => {
    applyQuery(buildQuery(state)); // drop ?host
    window.dispatchEvent(new Event('urlchange'));
  };

  return (
    <div className="panel" role="dialog" aria-label="Invitation control panel">
      <header className="panel__bar">
        <h2 className="panel__title"><Icon name="sparkle" size={18} /> Invitation Builder</h2>
        <button type="button" className="panel__close" onClick={close} aria-label="Close builder">
          <Icon name="close" size={22} />
        </button>
      </header>

      <div className="panel__body">
        <p className="panel__hint">
          Choose what this guest sees, then copy or share the link. The preview
          updates live behind this panel.
        </p>

        {/* Guest name */}
        <label className="panel__field">
          <span>Guest name <small>(optional, personalises the greeting)</small></span>
          <input
            type="text" value={state.guestName}
            placeholder="e.g. Sharma Family"
            onChange={(e) => setState((s) => ({ ...s, guestName: e.target.value }))}
          />
        </label>

        {/* Side */}
        <div className="panel__group">
          <span className="panel__group-label">Hosting side</span>
          <div className="panel__seg">
            {SIDES.map((s) => (
              <button key={s.id} type="button"
                className={state.side === s.id ? 'is-on' : ''}
                aria-pressed={state.side === s.id}
                onClick={() => setSide(s.id)}>{s.label}</button>
            ))}
          </div>
        </div>

        {/* Presets */}
        <div className="panel__group">
          <span className="panel__group-label">Quick presets</span>
          <div className="panel__presets">
            {Object.entries(presets).map(([key, p]) => (
              <button key={key} type="button" className="panel__preset"
                onClick={() => applyPreset(key)}>{p.label}</button>
            ))}
          </div>
        </div>

        {/* Functions */}
        <div className="panel__group">
          <span className="panel__group-label">
            Functions ({state.eventIds.length}/{events.length})
          </span>
          <ul className="panel__checks">
            {events.map((e) => (
              <li key={e.id}>
                <label className={state.eventIds.includes(e.id) ? 'is-on' : ''}>
                  <input type="checkbox" checked={state.eventIds.includes(e.id)}
                    onChange={() => toggleEvent(e.id)} />
                  <span className="panel__check-dot" style={{ background: e.dressCode.color }} />
                  <span className="panel__check-name">{e.name}</span>
                  <small>{e.dateLabel} · {e.side}</small>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div className="panel__group">
          <span className="panel__group-label">Sections</span>
          <ul className="panel__checks panel__checks--inline">
            {toggleableSections.map((s) => (
              <li key={s.id}>
                <label className={state.sections[s.id] ? 'is-on' : ''}>
                  <input type="checkbox" checked={!!state.sections[s.id]}
                    onChange={() => toggleSection(s.id)} />
                  <span className="panel__check-name">{s.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Link */}
        <div className="panel__group">
          <span className="panel__group-label">Shareable link</span>
          <div className="panel__link">
            <input type="text" readOnly value={shareUrl} onFocus={(e) => e.target.select()} />
          </div>
          <div className="panel__actions">
            <button type="button" className="btn" onClick={copy}>
              <Icon name={copied ? 'check' : 'copy'} size={18} /> {copied ? 'Copied' : 'Copy'}
            </button>
            <a className="btn" href={shareUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="eye" size={18} /> Preview
            </a>
            <a className="btn btn--primary" href={waHref} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={18} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
