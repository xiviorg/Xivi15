
import { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { useDesktopStore } from '../../store/desktop';
import { nanoid } from 'nanoid';

export function Spotlight() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !(e.target as HTMLElement).matches('input, textarea')) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const store = useDesktopStore.getState();
    const existingWindow = store.windows.find(w => w.component === 'XiviAgent');
    const questionToAsk = query.trim();
    
    const windowId = existingWindow?.id || nanoid();
    
    if (!existingWindow) {
      store.addWindow({
        id: windowId,
        title: 'Xivi Agent',
        component: 'XiviAgent',
        position: {
          x: window.innerWidth / 2 - 300,
          y: window.innerHeight / 2 - 200,
          width: 600,
          height: 400,
        },
        initialQuery: '',
        timestamp: Date.now(),
        isMinimized: false,
        isMaximized: false,
      });
    } else if (existingWindow.isMinimized) {
      store.toggleMinimize(windowId);
    }
    
    store.setActiveWindow(windowId);
    
    // Small delay to ensure component is mounted
    setTimeout(async () => {
      const { eventBus } = await import('../../lib/eventBus');
      eventBus.emit('newQuestion', questionToAsk);
    }, 100);
    
    setQuery('');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[600px]" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center rounded-lg border bg-background shadow-xl">
            <div className="p-4">
              <Bot className="h-6 w-6" />
            </div>
            <input
              className="flex-1 bg-transparent p-4 text-lg outline-none"
              placeholder="Ask Xivi anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </form>
      </div>
      <div className="absolute inset-0 -z-10" onClick={() => setOpen(false)} />
    </div>
  );
}
