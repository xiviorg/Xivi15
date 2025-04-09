import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useDesktopStore } from "@/store/desktop";
import { ContextMenu } from "./ContextMenu";
import { nanoid } from "nanoid";
import { AppWindow, Bot, Cloud, Layout, Bomb, Scissors, Hammer, Calendar, Image as ImageIcon, Monitor, Timer, Globe, FileText, Calculator, Folder, Settings, Gamepad2, File, Music, Terminal } from "lucide-react";
import { getAppIcon } from "@/lib/appIcons";
import { apps } from '@/lib/apps';

interface StartMenuProps {
  onClose: () => void;
}

const appsList = Object.values(apps);

const categories = [
  "Internet",
  "Productivity",
  "Media",
  "System",
  "Utilities",
  "Games",
  "Entertainment",
  "Development",
  "Communication",
  "Office",
];

export function StartMenu({ onClose }: StartMenuProps) {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.start-menu') && !target.closest('.start-btn')) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  const { addWindow } = useDesktopStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    appId: string;
    appComponent: string;
    appTitle: string;
  } | null>(null);

  const filteredApps = appsList.filter(app => 
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAppClick = (app: (typeof appsList)[0]) => {
    const randomX = Math.max(50, Math.floor(Math.random() * (window.innerWidth - 600)));
    const randomY = Math.max(50, Math.floor(Math.random() * (window.innerHeight - 400)));
    
    addWindow({
      id: nanoid(),
      title: app.title,
      component: app.component,
      position: {
        x: randomX,
        y: randomY,
        width: 600,
        height: 400,
      },
      isMinimized: false,
      isMaximized: false,
    });
    onClose();
  };

  const handleRightClick = (e: React.MouseEvent, app: (typeof appsList)[0]) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      appId: app.id,
      appComponent: app.component,
      appTitle: app.title,
    });
  };

  return (
    <>
      <Card className={`start-menu fixed bottom-12 w-[420px] h-[450px] p-4 bg-background/80 backdrop-blur-md z-[9000] menu-transition ${
        useDesktopStore().taskbarMode === 'allcentered' ? 'left-1/2 -translate-x-1/2' : 'left-2'
      }`}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1 border border-border/40 rounded-md focus:outline-none focus:ring-1 focus:ring-border/60 bg-background/60"
          />
        </div>
        <div className="grid grid-cols-2 gap-6 overflow-y-auto h-[calc(100%-60px)]">
          {categories.map((category) => {
            const categoryApps = filteredApps.filter(
              (app) => app.category === category,
            );
            if (categoryApps.length === 0) return null;

            return (
              <div key={category} className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground border-b pb-1">
                  {category}
                </h3>
                <div className="grid grid-cols-1 gap-1.5">
                  {categoryApps.map((app) => {
                    const Icon = getAppIcon(app.component);
                    return (
                      <Button
                        key={app.id}
                        variant="ghost"
                        size="sm"
                        className="justify-start h-8 px-2 hover:bg-accent"
                        onClick={() => handleAppClick(app)}
                        onContextMenu={(e) => handleRightClick(e, app)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        <span className="text-sm">{app.title}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {contextMenu && (
        <ContextMenu {...contextMenu} onClose={() => setContextMenu(null)} />
      )}
    </>
  );
}