import { useEffect, useRef, useState } from 'react';

/* "A song for the dance floor" — search-as-you-type against the iTunes Search
   API (the only outbound fetch, like the reference). Degrades to a plain text
   field if the request fails. Value is the chosen "Track — Artist" string. */
export default function SongSearch({ value, onChange, id = 'song' }) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!query || query.length < 2) { setResults([]); return; }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const url =
          `https://itunes.apple.com/search?term=${encodeURIComponent(query)}` +
          `&entity=song&limit=6`;
        const res = await fetch(url, { signal: ctrl.signal });
        const data = await res.json();
        setResults(data.results || []);
        setOpen(true);
      } catch {
        setResults([]); // offline / blocked → free-text only
      }
    }, 320);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [query]);

  useEffect(() => {
    const onDoc = (e) => { if (!boxRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', onDoc);
    return () => document.removeEventListener('pointerdown', onDoc);
  }, []);

  const pick = (song) => {
    const label = `${song.trackName} — ${song.artistName}`;
    setQuery(label);
    setResults([]);
    setOpen(false);
    onChange?.(label);
  };

  return (
    <div className="songsearch" ref={boxRef}>
      <input
        id={id}
        type="text"
        className="field__input"
        placeholder="Search a song…"
        value={query}
        autoComplete="off"
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-controls={`${id}-list`}
        onChange={(e) => { setQuery(e.target.value); onChange?.(e.target.value); }}
        onFocus={() => results.length && setOpen(true)}
      />
      {open && results.length > 0 && (
        <ul className="songsearch__list" id={`${id}-list`} role="listbox">
          {results.map((s) => (
            <li key={s.trackId} role="option" aria-selected="false">
              <button type="button" onClick={() => pick(s)}>
                {s.artworkUrl60 && (
                  <img src={s.artworkUrl60} alt="" width="36" height="36" loading="lazy" />
                )}
                <span>
                  <strong>{s.trackName}</strong>
                  <small>{s.artistName}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
