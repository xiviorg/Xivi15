import { useEffect, useState } from "react";
import { Card } from "../ui/card";

interface SystemInfoType {
  repository: string;
  commit: string;
  version: string;
}

export function SystemInfo() {
  const [systemInfo, setSystemInfo] = useState<SystemInfoType>({
    repository: "",
    commit: "",
    version: "",
  });

  useEffect(() => {
    const fetchSystemInfo = async () => {
      const response = await fetch("/api/sysinfo");
      const data = await response.json();
      setSystemInfo(data);
    };
    fetchSystemInfo();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">System Information</h2>
      <Card className="p-4 space-y-2">
        <div>
            <span className="font-semibold">Repository: </span>{(() => {
              let shortrepo = systemInfo.repository;
              if (shortrepo.includes("github.com")) {
                shortrepo = shortrepo.replace("https://github.com/", "").replace(".git", "").trim();
              }
              return shortrepo ? (
                <a href={systemInfo.repository} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  {shortrepo}
                </a>
              ) : "Loading...";
            })()}
        </div>
        <div>
          <span className="font-semibold">Commit: </span>{systemInfo.commit.length > 8 ? systemInfo.commit.substring(0, 8) : systemInfo.commit || "Loading..."}
        </div>
        <div>
          <span className="font-semibold">Xivi Version: </span>{systemInfo.version || "Loading..."}
        </div>
        <div>
          <span className="font-semibold">Devs: </span>
            <a href="https://github.com/imwuffle" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">wuffle</a>,{" "}
            <a href="https://github.com/willoo0" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">willo</a> &{" "}
            <a href="https://github.com/LunarN0v4" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">k (LunarN0v4)</a>
        </div>
      </Card>
    </div>
  );
}
