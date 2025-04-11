
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { 
  Palette, 
  Eraser, 
  Download, 
  Square, 
  Circle, 
  Minus, 
  Pencil 
} from 'lucide-react';

type Shape = 'pencil' | 'line' | 'rectangle' | 'circle' | 'eraser';

export function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [shape, setShape] = useState<Shape>('pencil');
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const saveSnapshot = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }
  };

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    startPos.current = { x, y };
    saveSnapshot();

    ctx.beginPath();
    ctx.strokeStyle = shape === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = brushSize;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (snapshot) {
      ctx.putImageData(snapshot, 0, 0);
    }

    ctx.strokeStyle = shape === 'eraser' ? '#ffffff' : color;
    ctx.fillStyle = color;

    switch (shape) {
      case 'pencil':
      case 'eraser':
        ctx.lineTo(x, y);
        ctx.stroke();
        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(startPos.current.x, startPos.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        break;
      case 'rectangle':
        const width = x - startPos.current.x;
        const height = y - startPos.current.y;
        ctx.strokeRect(startPos.current.x, startPos.current.y, width, height);
        break;
      case 'circle':
        ctx.beginPath();
        const radius = Math.sqrt(
          Math.pow(x - startPos.current.x, 2) + Math.pow(y - startPos.current.y, 2)
        );
        ctx.arc(startPos.current.x, startPos.current.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="h-full flex flex-col p-2">
      <div className="flex gap-2 mb-2 flex-wrap">
        <Input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12"
        />
        <Input
          type="number"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          min="1"
          max="50"
          className="w-20"
        />
        <Button
          variant={shape === 'pencil' ? "secondary" : "ghost"}
          onClick={() => setShape('pencil')}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant={shape === 'eraser' ? "secondary" : "ghost"}
          onClick={() => setShape('eraser')}
        >
          <Eraser className="h-4 w-4" />
        </Button>
        <Button
          variant={shape === 'line' ? "secondary" : "ghost"}
          onClick={() => setShape('line')}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant={shape === 'rectangle' ? "secondary" : "ghost"}
          onClick={() => setShape('rectangle')}
        >
          <Square className="h-4 w-4" />
        </Button>
        <Button
          variant={shape === 'circle' ? "secondary" : "ghost"}
          onClick={() => setShape('circle')}
        >
          <Circle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" onClick={downloadCanvas}>
          <Download className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }}
        >
          Clear
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        className="flex-1 border rounded-md bg-white cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
}
