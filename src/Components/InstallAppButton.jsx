import { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { usePwaInstall } from '../utils/pwa';

const variantClasses = {
  navbar:
    'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer',
  menu: 'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer',
  hero: 'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-emerald-600 hover:bg-white/80 transition-colors cursor-pointer',
};

const InstallAppButton = ({ variant = 'navbar' }) => {
  const { canInstall, isIos, promptInstall } = usePwaInstall();
  const [showIosHint, setShowIosHint] = useState(false);
  const rootRef = useRef(null);

  const isVisible = canInstall || isIos;

  useEffect(() => {
    if (!showIosHint) return undefined;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setShowIosHint(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [showIosHint]);

  if (!isVisible) return null;

  const onClick = async () => {
    if (canInstall) {
      await promptInstall();
      return;
    }
    setShowIosHint((open) => !open);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={onClick}
        className={variantClasses[variant] || variantClasses.navbar}
        aria-expanded={isIos ? showIosHint : undefined}
      >
        <Download className="w-4 h-4" />
        Install App
      </button>

      {showIosHint && (
        <div
          className={
            variant === 'menu'
              ? 'px-3 pb-3 text-xs leading-5 text-slate-500'
              : 'absolute right-0 mt-2 w-64 rounded-xl border border-slate-100 bg-white p-3 text-xs leading-5 text-slate-600 shadow-lg z-50'
          }
        >
          To install this app, use Share → Add to Home Screen.
        </div>
      )}
    </div>
  );
};

export default InstallAppButton;
