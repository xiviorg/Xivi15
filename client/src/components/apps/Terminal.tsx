
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Plus, X } from "lucide-react";
import { useDesktopStore } from "../../store/desktop";

interface TerminalTab {
  id: string;
  history: string[];
  input: string;
}

export function Terminal() {
  const [tabs, setTabs] = useState<TerminalTab[]>([{ id: '1', history: [], input: '' }]);
  const [activeTab, setActiveTab] = useState('1');
  const [isBSOD, setIsBSOD] = useState(false);
  const [isRainbow, setIsRainbow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommand = (cmd: string, tabId: string) => {
    const args = cmd.split(" ");
    const command = args[0];
    
    let output = "";
    switch (command) {
      case "ls":
        output = "\x1b[36mDesktop  Documents  Downloads  Music  Pictures  Videos\x1b[0m";
        break;
      case "echo":
        output = args.slice(1).join(" ");
        break;
      case "cat":
        output = "\x1b[31mError: No such file or directory\x1b[0m";
        break;
      case "sudo":
        output = "\x1b[31mError: Permission denied\x1b[0m";
        break;
      case "apt":
        output = "\x1b[33mError: Command not found. This is a simulated environment.\x1b[0m";
        break;
      case "pwd":
        output = "\x1b[32m/home/xivi-15-user\x1b[0m";
        break;
      case "whoami":
        output = "\x1b[32mxivi-15-user\x1b[0m";
        break;
      case "clear":
        setTabs(prev => prev.map(tab => 
          tab.id === tabId ? { ...tab, history: [] } : tab
        ));
        return;
      case "bsod":
        setIsBSOD(true);
        return;
      case "gay":
        setIsRainbow(prev => !prev);
        output = isRainbow ? "Gay mode disabled" : "Gay mode enabled";
        break;
      case "help":
        output = "\x1b[36mAvailable commands:\x1b[0m ls, echo, cat, sudo, apt, pwd, whoami, clear, help";
        break;
      default:
        output = `\x1b[31mCommand not found: ${command}\x1b[0m`;
    }
    
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, history: [...tab.history, `\x1b[90muser@xivi-15>\x1b[0m ${cmd}`, output] }
        : tab
    ));
  };

  const addTab = () => {
    const newTab = { id: String(tabs.length + 1), history: [], input: '' };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length > 1) {
      const newTabs = tabs.filter(tab => tab.id !== tabId);
      setTabs(newTabs);
      if (activeTab === tabId) {
        setActiveTab(newTabs[0].id);
      }
    }
  };

  const activeTerminal = tabs.find(tab => tab.id === activeTab) || tabs[0];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    inputRef.current?.focus();
  }, [tabs, activeTerminal.history]);

  if (isBSOD) {
    return (
      <div className="h-full bg-blue-600 text-white p-4 font-mono">
        <h1 className="text-xl mb-4">):</h1>
        <p>Terminal.exe ran into a problem and needs to restart.</p>
        <p className="mt-4">Error: TERMINAL_INITIATED_SHUTDOWN</p>
        <p className="mt-4">* Press any key to restart</p>
        <button
          className="absolute inset-0 w-full h-full opacity-0"
          onClick={() => setIsBSOD(false)}
        />
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col bg-zinc-900 text-zinc-100 font-mono ${isRainbow ? 'animate-rainbow' : ''}`}>
      <div className="flex items-center gap-2 p-2 bg-zinc-800">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="bg-zinc-900">
            {tabs.map(tab => (
              <div key={tab.id} className="flex items-center">
                <TabsTrigger value={tab.id} className="px-4 py-1.5">
                  Terminal {tab.id}
                </TabsTrigger>
                {tabs.length > 1 && (
                  <button 
                    onClick={() => closeTab(tab.id)}
                    className="ml-1 p-1 hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </TabsList>
        </Tabs>
        <button 
          onClick={addTab}
          className="p-1.5 hover:bg-zinc-700 rounded transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {activeTerminal.history.map((line, i) => (
          <div 
            key={i} 
            className="whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{ __html: line.replace(/\x1b\[([0-9;]*)m/g, (_, p1) => {
              const colors: Record<string, string> = {
                '31': 'text-red-400',
                '32': 'text-green-400',
                '33': 'text-yellow-400',
                '36': 'text-cyan-400',
                '90': 'text-zinc-500',
                '0': ''
              };
              return `<span class="${colors[p1] || ''}">`
            }) + '</span>' }}
          />
        ))}
        <div className="flex items-center mt-1">
          <span className="text-zinc-500">user@xivi-15&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={activeTerminal.input}
            onChange={(e) => setTabs(prev => prev.map(tab => 
              tab.id === activeTab ? { ...tab, input: e.target.value } : tab
            ))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && activeTerminal.input.trim()) {
                handleCommand(activeTerminal.input.trim(), activeTab);
                setTabs(prev => prev.map(tab => 
                  tab.id === activeTab ? { ...tab, input: '' } : tab
                ));
              }
            }}
            className="flex-1 bg-transparent border-none outline-none ml-2 text-zinc-100"
            autoFocus
          />
        </div>
      </ScrollArea>
    </div>
  );
}
