import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type WindowPosition = {
  x: number
  y: number
  width: number
  height: number
}

export type AppWindow = {
  id: string
  title: string
  component: string
  position: WindowPosition
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  props?: Record<string, any>;
  initialQuery?: string
  timestamp?: number
  menuitems?: {
    label: string
    onClick: () => void
  }[]
}

export type PinnedApp = {
  title: string
  component: string
}

interface DesktopState {
  windows: AppWindow[]
  activeWindowId: string | null
  maxZIndex: number
  pinnedApps: PinnedApp[]
  theme: 'light' | 'dark' | 'system'
  taskbarMode: 'normal' | 'centeredapps' | 'allcentered'
  blurEffects: boolean
  animations: boolean
  notifications: boolean
  topbarHeight: number
  addWindow: (window: Omit<AppWindow, 'zIndex'>) => void
  removeWindow: (id: string) => void
  setActiveWindow: (id: string) => void
  updateWindowPosition: (id: string, position: Partial<WindowPosition>) => void
  toggleMinimize: (id: string) => void
  toggleMaximize: (id: string) => void
  togglePinApp: (app: PinnedApp) => void
  updateSettings: (settings: Partial<Pick<DesktopState, 'theme' | 'blurEffects' | 'animations' | 'notifications' | 'taskbarMode' | 'topbarHeight'>>) => void
}

const initialState: Omit<DesktopState, 'addWindow' | 'removeWindow' | 'setActiveWindow' | 'updateWindowPosition' | 'toggleMinimize' | 'toggleMaximize' | 'togglePinApp' | 'updateSettings'> = {
  windows: [],
  activeWindowId: null,
  maxZIndex: 0,
  pinnedApps: [
    { title: 'Files', component: 'FileExplorer' },
    { title: 'Web Browser', component: 'Browser' },
    { title: 'Text Editor', component: 'TextEditor' },
    { title: 'Settings', component: 'Settings' }
  ],
  theme: 'dark',
  taskbarMode: 'normal',
  blurEffects: true,
  animations: true,
  notifications: true,
  topbarHeight: 40,
}

export const useDesktopStore = create<DesktopState, [["zustand/persist", unknown]]>(
  persist(
    (set, get) => {
      if (typeof document !== 'undefined') {
        const storedState = JSON.parse(localStorage.getItem('desktop-store') || '{}');
        const topbarHeight = storedState.state?.topbarHeight || initialState.topbarHeight;
        document.documentElement.style.setProperty('--topbar-height', `${topbarHeight}px`);
      }
      
      return {
        ...initialState,
        
        addWindow: (window) => set((state) => {
          const maxCurrentZIndex = Math.max(0, ...state.windows.map(w => w.zIndex))
          const newZIndex = maxCurrentZIndex + 1
          return {
            windows: state.windows.map(w => ({...w, zIndex: w.zIndex < maxCurrentZIndex ? w.zIndex : w.zIndex - 1})).concat({
              ...window,
              zIndex: newZIndex
            }),
            activeWindowId: window.id,
            maxZIndex: newZIndex
          }
        }),
        
        removeWindow: (id) => set((state) => ({
          windows: state.windows.filter(w => w.id !== id),
          activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
        })),
        
        setActiveWindow: (id) => set((state) => {
          const newZIndex = state.maxZIndex + 1
          return {
            windows: state.windows.map(w => 
              w.id === id ? { ...w, zIndex: newZIndex } : w
            ),
            activeWindowId: id,
            maxZIndex: newZIndex
          }
        }),
        
        updateWindowPosition: (id, position) => set((state) => ({
          windows: state.windows.map(w =>
            w.id === id ? { ...w, position: { ...w.position, ...position } } : w
          )
        })),
        
        toggleMinimize: (id) => set((state) => ({
          windows: state.windows.map(w =>
            w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
          )
        })),
        
        toggleMaximize: (id) => set((state) => ({
          windows: state.windows.map(w =>
            w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
          )
        })),

        togglePinApp: (app) => set((state) => {
          const isPinned = state.pinnedApps.some(
            pinned => pinned.component === app.component
          )
          return {
            pinnedApps: isPinned
              ? state.pinnedApps.filter(pinned => pinned.component !== app.component)
              : [...state.pinnedApps, app]
          }
        }),

        updateSettings: (settings) => set((state) => ({
          ...state,
          ...settings
        }))
      }
    },
    {
      name: 'desktop-store',
      version: 1,
      storage: createJSONStorage(() => localStorage)
    }
  )
)
