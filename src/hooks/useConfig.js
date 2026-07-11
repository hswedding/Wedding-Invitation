import { useEffect, useState } from 'react';
import { parseInvitation } from '../lib/config.js';

/** Parse the invitation config from the URL; re-read on history changes so the
 *  control panel can live-preview by calling history.replaceState + dispatch. */
export function useConfig() {
  const [config, setConfig] = useState(() =>
    typeof window !== 'undefined'
      ? parseInvitation(window.location.search, window.location.pathname)
      : parseInvitation()
  );

  useEffect(() => {
    const reread = () =>
      setConfig(parseInvitation(window.location.search, window.location.pathname));
    window.addEventListener('popstate', reread);
    window.addEventListener('urlchange', reread);
    return () => {
      window.removeEventListener('popstate', reread);
      window.removeEventListener('urlchange', reread);
    };
  }, []);

  return config;
}

/** Apply a query string to the address bar without reload and notify listeners.
 *  Always writes to the root path so the query fully replaces any /{slug}. */
export function applyQuery(query) {
  const url = `/${query}${window.location.hash}`;
  window.history.replaceState({}, '', url);
  window.dispatchEvent(new Event('urlchange'));
}
