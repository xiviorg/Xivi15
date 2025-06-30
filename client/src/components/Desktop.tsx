import React, { useEffect, useState } from "react";
import { SelectionBox } from "./desktop/SelectionBox";
import { TopBar } from "./desktop/TopBar";
import { useDesktopStore } from "../store/desktop";
import { Window } from "./desktop/Window";
import { Taskbar } from "./desktop/Taskbar";
import { Spotlight } from "./desktop/Spotlight";
import { TextEditor } from "./apps/TextEditor";
import { Calculator } from "./apps/Calculator";
import { FileExplorer } from "./apps/FileExplorer";
import { Settings } from "./apps/Settings";
import { Browser } from "./apps/Browser";

import { Welcome } from "./apps/Welcome";
import { TimerClock } from "./apps/TimerClock";
import { SystemInfo } from "./apps/SystemInfo";
import { Paint } from "./apps/Paint";
import { Todo } from "./apps/Todo";
import { Minesweeper } from "./apps/Minesweeper";
import { Tetris } from "./apps/Tetris";
import { Weather } from "./apps/Weather";
import { Snake } from "./apps/Snake";
import { WhackAMole } from "./apps/WhackAMole";
import { Minecraft } from "./apps/Minecraft";
import { Games } from "./apps/Games";
import { PDFViewer } from "./apps/PDFViewer";
import { BalloonsBullets } from "./apps/BalloonsBullets";
import { DodgeBrawl } from "./apps/DodgeBrawl";
import { DungeonFish } from "./apps/DungeonFish";
import { Folkware } from "./apps/Folkware";
import { SilentHeist } from "./apps/SilentHeist";
import { Snow } from "./apps/Snow";
import { WorstCaseScenario } from "./apps/WorstCaseScenario";
import { PhotoViewer } from "./apps/PhotoViewer";
import { MusicPlayer } from "./apps/MusicPlayer";
import { Terminal } from "./apps/Terminal";
import { XiviAgent } from "./apps/XiviAgent";
import { AppStore } from "./apps/AppStore";

const components: { [key: string]: React.ComponentType } = {
  XiviAgent,
  TextEditor,
  Calculator,
  FileExplorer,
  Settings,
  Browser,
  Weather,
  Welcome,
  TimerClock,
  SystemInfo,
  Paint,
  Todo,
  Minesweeper,
  Tetris,
  Snake,
  WhackAMole,
  Minecraft,
  Games,
  BalloonsBullets,
  DodgeBrawl,
  DungeonFish,
  Folkware,
  SilentHeist,
  Snow,
  WorstCaseScenario,
  PDFViewer,
  PhotoViewer,
  MusicPlayer,
  Terminal,
  AppStore,
};

const lightThemeBg = "/light-theme.jpg";
const darkThemeBg = "/dark-theme.jpg";

export function Desktop() {
  const { windows, theme, updateSettings } = useDesktopStore();
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionCurrent, setSelectionCurrent] = useState({ x: 0, y: 0 });

  const startSelection = (e: React.MouseEvent) => {
    if (
      e.button === 0 &&
      (e.target as HTMLElement).classList.contains("desktop-background")
    ) {
      setIsSelecting(true);
      const coords = { x: e.clientX, y: e.clientY };
      setSelectionStart(coords);
      setSelectionCurrent(coords);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else if (theme === "light") {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [theme]);

  return (
    <div
      className="h-screen w-screen overflow-hidden desktop-background"
      onMouseDown={(e) => startSelection(e)}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        backgroundColor:
          theme === "dark" ? "hsl(222.2 84% 4.9%)" : "hsl(0 0% 100%)",
        backgroundImage: `url(${theme === "dark" ? "/dark-theme.jpg" : "/light-theme.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition:
          "background-color 0.3s ease-in-out, background-image 0.3s ease-in-out",
      }}
      data-testid="desktop"
    >
      {windows.map((window) => {
        const Component = components[window.component];
        if (!Component) {
          console.warn(`Component ${window.component} not found`);
          return null;
        }
        return (
          <Window key={window.id} {...window}>
            <Component />
          </Window>
        );
      })}
      <TopBar />
      <Taskbar />
      <Spotlight />
      <SelectionBox
        isSelecting={isSelecting}
        setIsSelecting={setIsSelecting}
        start={selectionStart}
        current={selectionCurrent}
        setCurrent={setSelectionCurrent}
      />
    </div>
  );
}
