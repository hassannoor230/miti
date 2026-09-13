'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';
import { FALLBACK_SETTINGS } from './fallback-data';

const SettingsContext = createContext(FALLBACK_SETTINGS);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);

  useEffect(() => {
    let live = true;
    api.settings
      .get()
      .then((res) => {
        if (live && res && res.data) setSettings({ ...FALLBACK_SETTINGS, ...res.data });
      })
      .catch(() => {
        /* keep fallback — site still renders with real verified data */
      });
    return () => {
      live = false;
    };
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
