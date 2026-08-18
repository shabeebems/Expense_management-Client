import { useCallback, useEffect, useState } from 'react';

let deferredPrompt = null;
const listeners = new Set();

const isStandaloneDisplay = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.matchMedia('(display-mode: fullscreen)').matches ||
  window.matchMedia('(display-mode: minimal-ui)').matches ||
  window.navigator.standalone === true;

const isIosDevice = () => {
  const userAgent = window.navigator.userAgent || '';
  const iOS = /iPhone|iPad|iPod/i.test(userAgent);
  const iPadOs = window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1;
  return iOS || iPadOs;
};

const getSnapshot = () => {
  const isInstalled = isStandaloneDisplay();
  return {
    canInstall: Boolean(deferredPrompt) && !isInstalled,
    isInstalled,
    isIos: isIosDevice() && !isInstalled,
  };
};

const notify = () => {
  const snapshot = getSnapshot();
  listeners.forEach((listener) => listener(snapshot));
};

export const initPwaInstall = () => {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    notify();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notify();
  });

  const standaloneQuery = window.matchMedia('(display-mode: standalone)');
  if (standaloneQuery.addEventListener) {
    standaloneQuery.addEventListener('change', notify);
  }
};

export const promptAppInstall = async () => {
  if (!deferredPrompt) return 'unavailable';

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  notify();
  return outcome;
};

export const usePwaInstall = () => {
  const [state, setState] = useState(getSnapshot);

  useEffect(() => {
    listeners.add(setState);
    setState(getSnapshot());
    return () => listeners.delete(setState);
  }, []);

  const promptInstall = useCallback(() => promptAppInstall(), []);

  return { ...state, promptInstall };
};

export const registerServiceWorker = () => {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration must never block the app.
    });
  });
};
