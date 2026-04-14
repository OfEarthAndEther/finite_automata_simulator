import { Moon, Sun, Leaf } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('soft-cream');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="flex bg-[var(--border-color)] p-1 rounded-full gap-1 shadow-inner">
      <button
        onClick={() => setTheme('slate-mist')}
        className={`p-2 rounded-full transition-all ${theme === 'slate-mist' ? 'bg-white shadow' : 'hover:bg-black/5'}`}
        title="Slate Mist"
      >
        <Moon size={16} className={theme === 'slate-mist' ? 'text-blue-500' : 'text-gray-500'} />
      </button>
      <button
        onClick={() => setTheme('soft-cream')}
        className={`p-2 rounded-full transition-all ${theme === 'soft-cream' ? 'bg-white shadow' : 'hover:bg-black/5'}`}
        title="Soft Cream"
      >
        <Sun size={16} className={theme === 'soft-cream' ? 'text-amber-500' : 'text-gray-500'} />
      </button>
      <button
        onClick={() => setTheme('mint-tint')}
        className={`p-2 rounded-full transition-all ${theme === 'mint-tint' ? 'bg-white shadow' : 'hover:bg-black/5'}`}
        title="Mint Tint"
      >
        <Leaf size={16} className={theme === 'mint-tint' ? 'text-emerald-500' : 'text-gray-500'} />
      </button>
    </div>
  );
}
