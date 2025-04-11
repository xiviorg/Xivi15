import { useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Pin, Trash } from 'lucide-react'
import { useDesktopStore } from '../../store/desktop'

interface ContextMenuProps {
  x: number
  y: number
  appId: string
  appComponent: string
  appTitle: string
  onClose: () => void
}

export function ContextMenu({ x, y, appId, appComponent, appTitle, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const { togglePinApp, removeWindow } = useDesktopStore()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <Card 
      ref={menuRef}
      className="fixed min-w-[160px] z-[9999] bg-background/80 backdrop-blur-md"
      style={{ 
        left: Math.min(x, window.innerWidth - 200),
        top: Math.min(y, window.innerHeight - 150),
        maxHeight: 'calc(100vh - 20px)',
        overflow: 'auto'
      }}
    >
      <div className="p-1">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            togglePinApp({ component: appComponent, title: appTitle })
            onClose()
          }}
        >
          <Pin className="h-4 w-4 mr-2" />
          Toggle Pin
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={() => {
            removeWindow(appId)
            onClose()
          }}
        >
          <Trash className="h-4 w-4 mr-2" />
          Close
        </Button>
      </div>
    </Card>
  )
}
