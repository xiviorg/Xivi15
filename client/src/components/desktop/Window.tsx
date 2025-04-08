import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Maximize2, Minus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDesktopStore, type WindowPosition } from '@/store/desktop'
import { cn } from '@/lib/utils'

interface WindowProps {
  id: string
  title: string
  children: React.ReactNode
  position: WindowPosition
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
}

export function Window({ id, title, children, position, isMinimized, isMaximized, zIndex }: WindowProps) {
  const { setActiveWindow, updateWindowPosition, toggleMinimize, toggleMaximize, removeWindow } = useDesktopStore()
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const handleClose = () => {
    if (windowRef.current) {
      windowRef.current.classList.add('fade-out');
      windowRef.current.addEventListener('animationend', () => {
        removeWindow(id);
      }, { once: true });
      return;
    }
    removeWindow(id);
  }

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized && windowRef.current) {
        cancelAnimationFrame(animationFrameId);

        animationFrameId = requestAnimationFrame(() => {
          const rect = windowRef.current?.getBoundingClientRect();
          if (!rect) return;

          const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - rect.width));
          const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - rect.height));

          updateWindowPosition(id, {
            x: newX,
            y: newY
          });
        });
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset, id, updateWindowPosition, isMaximized])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current && !isMaximized) {
      setIsDragging(true)
      const rect = windowRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
    setActiveWindow(id)
  }

  const handleMinimize = () => {
    if (windowRef.current && !isMinimized) {
      windowRef.current.classList.add('fade-out');
      windowRef.current.addEventListener('animationend', () => {
        toggleMinimize(id);
      }, { once: true });
      return;
    }
    toggleMinimize(id);
  }

  if (isMinimized) {
    return null
  }

  const constrainedY = Math.min(
    Math.max(position?.y ?? 0, 8),
    window.innerHeight - (position?.height ?? 400) - 48
  )

  return (
    <Card
      ref={windowRef}
      className={cn(
        'absolute flex flex-col rounded-lg overflow-hidden bg-background/80 backdrop-blur-md border shadow-lg fade-in window-transition',
        isMaximized && 'fixed !left-0 !right-0 !top-0 !bottom-12'
      )}
      style={{
        left: position?.x ?? 100,
        top: position?.y ?? 44,
        width: isMaximized ? '100%' : (position?.width ?? 600),
        height: isMaximized ? 'calc(100% - 58px)' : (position?.height ?? 400), // Account for topbar and taskbar
        zIndex
      }}
      onClick={() => setActiveWindow(id)}
    >
      <div
        className="flex items-center justify-between px-4 bg-primary/10 cursor-move"
        onMouseDown={handleMouseDown}
        style={{
          height: 'var(--topbar-height)',
          userSelect: 'none'
        }}
      >
        <div className="font-medium">{title}</div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div>
              <Button variant="ghost" size="icon" onClick={handleMinimize} title="Minimize">
                <Minus className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Button variant="ghost" size="icon" onClick={() => toggleMaximize(id)} title="Maximize">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Button variant="ghost" size="icon" onClick={handleClose} title="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex-1 overflow-auto p-4"
        // Note to self: if commenting this broke something, then you need to make an implementation that works for custom apps too
        /*</Card>onWheel={(e) => {
          // Stop propagation only for non-game windows
          if (!['Tetris', 'Minesweeper'].includes(title)) {
            e.stopPropagation();
          }
        }}*/
      >
        {children}
      </div>
    </Card>
  )
}