import { useState } from "react";
import { Window } from "../desktop/Window";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useDesktopStore } from "../../store/desktop";

export function Welcome() {
  const [showAgain, setShowAgain] = useState(true);
  const { windows, removeWindow } = useDesktopStore();

  const handleClose = () => {
    if (!showAgain) {
      localStorage.setItem("hideWelcome", "true");
    }
    const welcomeWindow = windows.find((w) => w.component === "Welcome");
    if (welcomeWindow) {
      removeWindow(welcomeWindow.id);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto space-y-4 text-center">
      <h1 className="text-2xl font-bold animate-fade-in">👋 Welcome to Xivi 15</h1>
      <h2 className="animate-slide-up">We are so glad to have you using Xivi 15!</h2>
      <h2 className="animate-slide-up">Released: Feb 13, 2025</h2>

      <div className="space-y-2 text-muted-foreground">
        <p className="font-medium">Here's some cool stuff you can do:</p>
        <ul className="list-none space-y-2 animate-fade-in">
          <li>- Use [ctrl + space] to ask the agent anything</li>
          <li>- Click the power icon in the top-left to access system options</li>
          <li>- Use the taskbar at the bottom to launch apps</li>
          <li>- Drag windows to move them around</li>
          <li>- Customize the UI to your liking in settings</li>
          <li>- Use the music app to play ad-free tunes!</li>
        </ul>
        <div className="mt-4 p-3 rounded-lg bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-500/30">
          We are aware of a recent File System issue and are working on it! This
          has minimal affection 😊
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Checkbox
          id="show-again"
          checked={!showAgain}
          onCheckedChange={(checked) => setShowAgain(!checked)}
          className="rounded-md"
        />
        <label htmlFor="show-again" className="text-sm">
          Don't show this again
        </label>
      </div>

      <Button 
        className="w-full max-w-xs rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce-light" 
        onClick={handleClose}
      >
        Get Started
      </Button>
    </div>
  );
}
