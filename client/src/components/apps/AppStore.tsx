import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDesktopStore } from "@/store/desktop";
import { getAppIcon } from "@/lib/appIcons";

export function AppStore() {
  const { addWindow } = useDesktopStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [apps, setApps] = useState<Record<string, { id: string; icon: string; title: string; description: string; category: string; downloadurl: string }>>({});
  const [repos, setRepos] = useState<string[]>([]);

  const filteredApps = Object.values(apps).filter(app =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const storedApps = localStorage.getItem("apps");
    if (storedApps) {
      setApps(JSON.parse(storedApps));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("apps", JSON.stringify(apps));
  }, [apps]);

  const handleInstall = async (app: { title: string; downloadurl: string }) => {
    try {
      const response = await fetch(app.downloadurl);
      const contentLength = response.headers.get("content-length");
      if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
        throw new Error("File is too large to download.");
      }
      const code = await response.text();
      const component = new Function('React', 'require', `return ${code}`)(React, require);

      addWindow({
        id: nanoid(),
        title: app.title,
        component: component.default || component,
        position: {
          x: 50 + Math.random() * 100,
          y: 50 + Math.random() * 100,
          width: 600,
          height: 400,
        },
        isMinimized: false,
        isMaximized: false,
      });
    } catch (error: any) {
      console.error("Failed to load component:", error);
      alert(error.message);
    }
  };

  const handleUninstall = (appId: string) => {
    setApps((apps) => {
      const newApps = { ...apps };
      delete newApps[appId];
      return newApps;
    });
  };

  useEffect(() => {
    for (const repo of repos) {
      fetch(repo)
        .then(response => response.json())
        .then(data => {
          for (const file of data) {
            if (file.type === "file") {
              fetch(file.download_url)
                .then(response => response.json())
                .then(app => {
                  setApps(apps => ({
                    ...apps,
                    [app.id]: app
                  }));
                })
                .catch(error => console.error("Failed to fetch app:", error));
            }
          }
        })
        .catch(error => {
          console.error("Failed to fetch repo:", error);
        }
      )
    }
  }, [repos]);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">App Store</h2>
      <input
        type="text"
        placeholder="Search apps..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="grid grid-cols-2 gap-4">
        {filteredApps.map((app) => {
            const Icon = () => {
              if (app.icon.startsWith("http")) {
                return <img src={app.icon} alt={`${app.title} icon`} className="h-6 w-6" />;
              } else {
                const AppIcon = getAppIcon(app.icon);
                return <AppIcon className="h-6 w-6" />;
              }
            };
            return (
            <Card key={app.id} className="p-4 space-y-2">
              <div className="flex items-center space-x-2">
              <Icon />
              <span className="font-semibold">{app.title}</span>
              </div>
              <p className="text-sm text-gray-600">{app.description}</p>
              {apps[app.id] ? (
                <Button onClick={() => handleUninstall(app.id)}>Uninstall</Button>
              ) : (
                <Button onClick={() => handleInstall(app)}>Install</Button>
              )}
            </Card>
            );
        })}
      </div>
    </div>
  );
}