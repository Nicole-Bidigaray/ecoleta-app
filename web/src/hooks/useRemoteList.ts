import { useEffect, useState } from 'react';

// Abort obsolete requests on navigation, UF changes and StrictMode's effect replay.
export function useRemoteList<T>(load: (signal: AbortSignal) => Promise<T[]>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setData([]);
    setLoading(true);
    setFailed(false);
    load(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setData(result);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [load, attempt]);

  return { data, loading, failed, retry: () => setAttempt((value) => value + 1) };
}
