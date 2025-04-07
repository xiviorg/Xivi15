import { useState, useEffect } from "react";

declare global {
  interface BatteryManager {
    level: number;
    charging: boolean;
    addEventListener: (type: string, listener: () => void) => void;
  }
  interface Navigator {
    getBattery?: () => Promise<BatteryManager>;
  }
}

const Battery = () => {
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  useEffect(() => {
    if ("getBattery" in navigator) {
      navigator.getBattery?.().then((battery) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);
        battery.addEventListener("levelchange", () =>
          setBatteryLevel(Math.round(battery.level * 100))
        );
        battery.addEventListener("chargingchange", () =>
          setIsCharging(battery.charging)
        );
      });
    }
  }, []);

  const getBatteryColor = (): string => {
    if (batteryLevel >= 75) return "bg-green-500";
    if (batteryLevel >= 50) return "bg-yellow-400";
    if (batteryLevel >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div
        className="w-2.5 h-5 border border-white flex items-end overflow-hidden"
        style={{ borderRadius: "3px" }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className={`${getBatteryColor()} w-full`} style={{ height: `${batteryLevel}%` }}></div>
      </div>
      {isHovering && (
        <div className="tooltip absolute bottom-[110%] left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10">
          {batteryLevel}% {isCharging ? "(Charging)" : ""}
        </div>
      )}
    </div>
  );
};

export default Battery;
