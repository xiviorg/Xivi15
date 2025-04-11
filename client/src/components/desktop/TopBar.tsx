import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Maximize2 } from 'lucide-react';

export function TopBar() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-background/80 backdrop-blur-md border-b items-center px-2 z-[9999] hidden">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 ml-1"
        onClick={toggleFullscreen}
      >
        <Maximize2 className="h-4 w-4" />
      </Button>

      <div className="flex-1" />
    </div>
  );
}
