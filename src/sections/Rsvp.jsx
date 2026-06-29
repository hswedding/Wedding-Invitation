import { useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import PhoneInput from 'react-phone-number-input';
import { gsap, useGSAP } from '../lib/gsap.js';
import { config, foodPreferences } from '../data.js';
import { buildRsvpWhatsApp } from '../lib/config.js';
import SongSearch from '../components/SongSearch.jsx';
import Icon from '../components/Icons.jsx';

/* Scene 6 — RSVP. Validates client-side, fires confetti + a sound, then opens a
   pre-filled WhatsApp message to the hosts (no backend). */
export default function Rsvp() {
  const root = useRef(null);
  const [form, setForm] = useState({
    name: '', phone: '', party: 1, food: '', song: '', message: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success

  useGSAP(() => {
    gsap.from('.rsvp__panel', {
      scrollTrigger: { trigger: root.current, start: 'top 80%' },
      y: 28, autoAlpha: 0, duration: 0.8, ease: 'power3.out',
    });
  }, { scope: root });

  const set = (k) => (v) =>
    setForm((f) => ({ ...f, [k]: v?.target ? v.target.value : v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please tell us your name.';
    if (!form.phone || form.phone.length < 8) e.phone = 'Add a valid phone number.';
    if (!form.food) e.food = 'Pick a meal preference.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const celebrate = () => {
    const fire = (ratio, opts) =>
      confetti({ ...opts, origin: { y: 0.7 }, particleCount: Math.floor(180 * ratio),
        colors: ['#d4af37', '#e2b4b1', '#f7dcda', '#8a4f4c', '#e8ce73'] });
    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.35, { spread: 60 });
    fire(0.2, { spread: 100, decay: 0.91, scalar: 0.9 });
    try { new Audio(config.yaySfx).play().catch(() => {}); } catch { /* optional */ }
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    const url = buildRsvpWhatsApp(config.rsvpWhatsApp, form);
    setTimeout(() => {
      setStatus('success');
      celebrate();
      window.open(url, '_blank', 'noopener');
    }, 700);
  };

  return (
    <section className="rsvp section" id="rsvp-section" ref={root}>
      <div className="section__inner">
        <p className="eyebrow">Will You Join Us?</p>
        <h2 className="display">RSVP</h2>
        <p className="rsvp__lead">
          Kindly respond so we can celebrate with you. Your reply opens WhatsApp,
          pre-filled — just press send.
        </p>

        {status === 'success' ? (
          <div className="rsvp__panel rsvp__success card" role="status">
            <span className="rsvp__check"><Icon name="check" size={40} /></span>
            <h3 className="serif-h">Thank you, {form.name.split(' ')[0]}!</h3>
            <p>If WhatsApp didn’t open, tap below to send your RSVP.</p>
            <a className="btn btn--primary" href={buildRsvpWhatsApp(config.rsvpWhatsApp, form)}
              target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={18} /> Send on WhatsApp
            </a>
          </div>
        ) : (
          <form className="rsvp__panel card" onSubmit={onSubmit} noValidate>
            <Field id="name" label="Your name" error={errors.name} required>
              <input id="name" className="field__input" type="text" autoComplete="name"
                value={form.name} onChange={set('name')} />
            </Field>

            <div className={`field ${errors.phone ? 'field--error' : ''}`}>
              <label className="field__label" htmlFor="phone">Phone <span aria-hidden>*</span></label>
              <PhoneInput
                id="phone" international defaultCountry="IN" value={form.phone}
                onChange={(v) => set('phone')(v || '')} className="rsvp__phone" />
              {errors.phone && <p className="field__err" role="alert">{errors.phone}</p>}
            </div>

            <Field id="party" label="Number of guests">
              <input id="party" className="field__input" type="number" inputMode="numeric"
                min="1" max="20" value={form.party} onChange={set('party')} />
            </Field>

            <fieldset className={`field ${errors.food ? 'field--error' : ''}`}>
              <legend className="field__label">Meal preference <span aria-hidden>*</span></legend>
              <div className="rsvp__chips" role="radiogroup" aria-label="Meal preference">
                {foodPreferences.map((f) => (
                  <label key={f} className={`chip ${form.food === f ? 'chip--on' : ''}`}>
                    <input type="radio" name="food" value={f}
                      checked={form.food === f} onChange={set('food')} />
                    {f}
                  </label>
                ))}
              </div>
              {errors.food && <p className="field__err" role="alert">{errors.food}</p>}
            </fieldset>

            {config.enableSongRequest && (
              <Field id="song" label="A song for the dance floor">
                <SongSearch value={form.song} onChange={set('song')} />
              </Field>
            )}

            <Field id="message" label="Marriage advice / a message for us">
              <textarea id="message" className="field__input" rows="3"
                value={form.message} onChange={set('message')} />
            </Field>

            <button type="submit" className="btn btn--primary rsvp__submit"
              disabled={status === 'sending'}>
              {status === 'sending'
                ? 'Sending…'
                : <><Icon name="whatsapp" size={18} /> Send RSVP</>}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ id, label, error, required, children }) {
  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label} {required && <span aria-hidden>*</span>}
      </label>
      {children}
      {error && <p className="field__err" role="alert">{error}</p>}
    </div>
  );
}
