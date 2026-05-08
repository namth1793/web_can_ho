import { createContext, useContext, useEffect, useState } from 'react';

const RefreshContext = createContext(0);

const API_BASE = import.meta.env.VITE_API_URL || '';

export function RefreshProvider({ children }) {
  const [signal, setSignal] = useState(0);

  useEffect(() => {
    const es = new EventSource(`${API_BASE}/api/events`);
    es.onmessage = () => setSignal(s => s + 1);
    es.onerror = () => {};
    return () => es.close();
  }, []);

  return <RefreshContext.Provider value={signal}>{children}</RefreshContext.Provider>;
}

export const useRefreshSignal = () => useContext(RefreshContext);
