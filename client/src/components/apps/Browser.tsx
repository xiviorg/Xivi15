
import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Globe, Plus, X, ArrowLeft, ArrowRight, RotateCw } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = {
  id: string
  url: string
  title: string
  key: number
}

export function Browser() {
  const [tabs, setTabs] = useState<Tab[]>([{ id: '1', url: '/ric', title: 'New Tab', key: 1 }])
  const [activeTab, setActiveTab] = useState('1')
  const [urlInput, setUrlInput] = useState('/ric')
  const iframeRefs = useRef<{ [key: string]: HTMLIFrameElement | null }>({})

  const currentTab = tabs.find(tab => tab.id === activeTab)

  const addTab = () => {
    const newTab = {
      id: Math.random().toString(36).substr(2, 9),
      url: '/ric',
      title: 'New Tab',
      key: Date.now()
    }
    setTabs([...tabs, newTab])
    setActiveTab(newTab.id)
    setUrlInput('/ric')
  }

  const removeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newTabs = tabs.filter(tab => tab.id !== tabId)
    if (newTabs.length === 0) {
      const newTab = { id: Math.random().toString(36).substr(2, 9), url: '/ric', title: 'New Tab', key: Date.now() }
      setTabs([newTab])
      setActiveTab(newTab.id)
    } else if (activeTab === tabId) {
      setActiveTab(newTabs[newTabs.length - 1].id)
      setUrlInput(newTabs[newTabs.length - 1].url)
    }
    setTabs(newTabs.length === 0 ? [{ id: '1', url: '/ric', title: 'New Tab', key: Date.now() }] : newTabs)
  }

  const navigate = (url: string) => {
    if (!url) return
    const processedUrl = url.startsWith('http') || url.startsWith('/') ? url : 'https://' + url
    setTabs(tabs => tabs.map(tab =>
      tab.id === activeTab ? { ...tab, url: processedUrl, key: Date.now() } : tab
    ))
    setUrlInput(processedUrl)
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(urlInput)
  }

  const handleBack = () => {
    const iframe = iframeRefs.current[activeTab]
    if (iframe) {
      try {
        iframe.contentWindow?.history.back()
      } catch (error) {
        console.error('Cannot access iframe history:', error)
      }
    }
  }

  const handleForward = () => {
    const iframe = iframeRefs.current[activeTab]
    if (iframe) {
      try {
        iframe.contentWindow?.history.forward()
      } catch (error) {
        console.error('Cannot access iframe history:', error)
      }
    }
  }

  const handleReload = () => {
    const iframe = iframeRefs.current[activeTab]
    if (iframe) {
      iframe.src = iframe.src
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <Tabs value={activeTab} className="flex-1 flex flex-col" onValueChange={setActiveTab}>
        <div className="flex items-center border-b">
          <TabsList className="flex-1 justify-start h-10 bg-transparent">
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "flex items-center gap-2 px-4 data-[state=active]:bg-background",
                  tab.id === activeTab ? "border-b-2 border-primary" : ""
                )}
              >
                <Globe className="h-4 w-4" />
                <span className="max-w-[100px] truncate">{tab.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-2 hover:bg-destructive/20"
                  onClick={(e) => removeTab(tab.id, e)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </TabsTrigger>
            ))}
          </TabsList>
          <Button variant="ghost" size="icon" className="h-10 w-10" onClick={addTab}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 p-2 border-b">
          <Button variant="ghost" size="icon" onClick={handleReload}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleForward}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <form onSubmit={handleUrlSubmit} className="flex-1">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter URL or search with DuckDuckGo"
              className="h-9"
            />
          </form>
        </div>

        <div className="flex-1 relative">
          {tabs.map(tab => (
            <div
              key={tab.key}
              className={cn(
                "absolute inset-0 w-full h-full",
                tab.id === activeTab ? "block" : "hidden"
              )}
            >
              <iframe
                ref={el => iframeRefs.current[tab.id] = el}
                src={tab.url}
                className="w-full h-full"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                onLoad={() => {
                  const iframe = iframeRefs.current[tab.id]
                  if (iframe?.contentDocument?.title) {
                    setTabs(tabs => tabs.map(t =>
                      t.id === tab.id ? { ...t, title: iframe.contentDocument?.title || t.title } : t
                    ))
                  }
                }}
              />
            </div>
          ))}
        </div>
      </Tabs>
    </div>
  )
}
