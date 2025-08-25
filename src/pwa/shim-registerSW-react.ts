type Setter = (v: boolean) => void;

export function useRegisterSW() {
  const pair = [false, (() => {}) as Setter] as [boolean, Setter];
  return {
    needRefresh: pair,
    offlineReady: pair,
    updateServiceWorker: (_reload?: boolean) => {},
  };
}
