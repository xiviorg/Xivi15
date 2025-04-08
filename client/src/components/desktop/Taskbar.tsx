import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Power, Maximize2 } from 'lucide-react';
import { useDesktopStore } from '@/store/desktop';
import { StartMenu } from './StartMenu';
import { ContextMenu } from './ContextMenu';
import { nanoid } from 'nanoid';
import { AppWindow, Layout } from 'lucide-react';
import { appIcons, getAppIcon } from '@/lib/appIcons';
import Battery from '@/components/ui/battery';

export function Taskbar() {
  const { windows, activeWindowId, pinnedApps, setActiveWindow, toggleMinimize, addWindow, taskbarMode } = useDesktopStore();
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    appId: string;
    appComponent: string;
    appTitle: string;
  } | null>(null);
  const [dateTime, setDateTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDateTime(now.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRightClick = (e: React.MouseEvent, appId: string, appComponent: string, appTitle: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      appId,
      appComponent,
      appTitle,
    });
  };

  const handlePinnedAppClick = (app: { component: string; title: string }) => {
    const existingWindow = windows.find((w) => w.component === app.component);
    if (existingWindow) {
      if (activeWindowId === existingWindow.id) {
        toggleMinimize(existingWindow.id);
      } else {
        setActiveWindow(existingWindow.id);
      }
    } else {
      addWindow({
        id: nanoid(),
        title: app.title,
        component: app.component,
        position: {
          x: 50 + Math.random() * 100,
          y: 50 + Math.random() * 100,
          width: app.component === 'Browser' ? 800 : 600,
          height: app.component === 'Browser' ? 600 : 400,
        },
        isMinimized: false,
        isMaximized: false,
      });
    }
  };

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-background/80 backdrop-blur-md border-t flex items-center px-2 z-[9999]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 mr-2">
              <Power className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="menu-transition">
            <DropdownMenuItem onClick={handleRestart}>Restart</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                document.body.classList.add('fade-out');
                setTimeout(() => {
                  window.close();
                }, 300);
              }}
            >
              Shut Down
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {taskbarMode !== 'allcentered' && (
          <Button
            variant={showStartMenu ? 'secondary' : 'ghost'}
            size="icon"
            className="mr-2"
            onClick={() => setShowStartMenu(!showStartMenu)}
          >
            <Layout className="h-5 w-5" />
          </Button>
        )}

        <div
          className={`flex-1 flex items-center space-x-1 taskbar-content ${
            taskbarMode === 'centeredapps' || taskbarMode === 'allcentered'
              ? 'justify-center'
              : ''
          }`}
        >
          {taskbarMode === 'allcentered' && (
            <Button
              variant={showStartMenu ? 'secondary' : 'ghost'}
              size="icon"
              className="mr-2"
              onClick={() => setShowStartMenu(!showStartMenu)}
            >
              <Layout className="h-5 w-5" />
            </Button>
          )}
          {pinnedApps.map((app) => {
            const Icon = getAppIcon(app.component);
            if (!Icon || !app.component || !app.title) {
              return null;
            }
            return (
              <Button
                key={app.component}
                variant="ghost"
                size="icon"
                className="h-8 w-8 taskbar-button"
                onClick={() => handlePinnedAppClick(app)}
                onContextMenu={(e) =>
                  handleRightClick(e, '', app.component, app.title)
                }
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
          <div className="w-px h-6 bg-border mx-2" />
          {windows.map((window) => {
            const Icon = appIcons[window.component] || AppWindow;
            return (
              <Button
                key={window.id}
                data-window-id={window.id}
                variant={activeWindowId === window.id ? 'secondary' : 'ghost'}
                className="h-8 px-2 text-sm"
                onClick={() => {
                  if (activeWindowId === window.id) {
                    toggleMinimize(window.id);
                  } else {
                    setActiveWindow(window.id);
                  }
                }}
                onContextMenu={(e) =>
                  handleRightClick(
                    e,
                    window.id,
                    window.component,
                    window.title
                  )
                }
              >
                <Icon className="h-4 w-4 mr-2" />
                {window.title}
              </Button>
            );
          })}
        </div>

        <div className="absolute right-40 text-sm pointer-events-none select-none">
          <Battery />
        </div>

        <div className="absolute right-2 text-sm pointer-events-none select-none">
          {dateTime}
        </div>
      </div>

      {showStartMenu && <StartMenu onClose={() => setShowStartMenu(false)} />}
      {contextMenu && (
        <ContextMenu {...contextMenu} onClose={() => setContextMenu(null)} />
      )}
    </>
  );
}
