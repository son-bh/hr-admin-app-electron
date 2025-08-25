import { useEffect, useState, useCallback } from 'react';

type UpdState =
  | { state: 'idle' }
  | { state: 'checking' }
  | { state: 'available'; info: any }
  | { state: 'not-available'; info?: any }
  | { state: 'downloading'; progress: { percent: number } }
  | { state: 'downloaded'; info: any }
  | { state: 'error'; message: string };

export function useAutoUpdater() {
  const [status, setStatus] = useState<UpdState>({ state: 'idle' });

  useEffect(() => {
    if (!window.electronAPI) return;
    const off = window.electronAPI.onStatus(p => {
      if (p?.state === 'downloading' && p.progress?.percent != null) {
        setStatus({
          state: 'downloading',
          progress: { percent: p.progress.percent },
        });
      } else {
        setStatus(p);
      }
    });
    return off;
  }, []);

  const check = useCallback(() => window.electronAPI?.check(), []);
  const download = useCallback(() => window.electronAPI?.download(), []);
  const install = useCallback(() => window.electronAPI?.install(), []);

  return { status, check, download, install };
}
