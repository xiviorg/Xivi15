
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

import { eventBus } from '../../lib/eventBus';

interface TimerClockProps {
  initialTimer?: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  startStopwatch?: boolean;
}

export function TimerClock({ initialTimer, startStopwatch }: TimerClockProps) {
  useEffect(() => {
    // Handle initial timer if provided
    if (initialTimer) {
      setHours(initialTimer.hours.toString());
      setMinutes(initialTimer.minutes.toString());
      setSeconds(initialTimer.seconds.toString());
      handleStart();
    }

    // Handle initial stopwatch if enabled
    if (startStopwatch) {
      setIsStopwatchActive(true);
    }

    const handleTimerCommand = (data: { hours?: number; minutes?: number; seconds?: number; type: 'timer' | 'stopwatch' }) => {
      if (data.type === 'timer' && data.hours !== undefined && data.minutes !== undefined && data.seconds !== undefined) {
        setHours(data.hours.toString());
        setMinutes(data.minutes.toString());
        setSeconds(data.seconds.toString());
        handleStart();
      } else if (data.type === 'stopwatch') {
        setIsStopwatchActive(true);
      }
    };

    eventBus.on('timerCommand', handleTimerCommand);
    return () => eventBus.off('timerCommand', handleTimerCommand);
  }, [initialTimer, startStopwatch]);
  // Timer state
  const [hours, setHours] = useState<string>(initialTimer?.hours.toString() || '');
  const [minutes, setMinutes] = useState<string>(initialTimer?.minutes.toString() || '');
  const [seconds, setSeconds] = useState<string>(initialTimer?.seconds.toString() || '');
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(!!initialTimer);

  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState<number>(0);
  const [stopwatchMs, setStopwatchMs] = useState<number>(0);
  const [isStopwatchActive, setIsStopwatchActive] = useState<boolean>(!!startStopwatch);

  // Clock state
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds(prev => prev - 1);
      }, 1000);
    } else if (totalSeconds === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, totalSeconds]);

  // Stopwatch effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isStopwatchActive) {
      const startTime = Date.now() - (stopwatchTime * 1000 + stopwatchMs);
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setStopwatchTime(Math.floor(elapsed / 1000));
        setStopwatchMs(elapsed % 1000);
      }, 10);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStopwatchActive]);

  // Clock effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
      setDate(now.toLocaleDateString());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: number) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = time % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const total = h * 3600 + m * 60 + s;
    if (total > 0) {
      setTotalSeconds(total);
      setIsActive(true);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTotalSeconds(0);
    setHours('');
    setMinutes('');
    setSeconds('');
  };

  return (
    <div className="p-4">
      <Tabs defaultValue="timer">
        <TabsList className="w-full">
          <TabsTrigger value="timer" className="flex-1">Timer</TabsTrigger>
          <TabsTrigger value="stopwatch" className="flex-1">Stopwatch</TabsTrigger>
          <TabsTrigger value="clock" className="flex-1">Clock</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timer" className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Hours"
              disabled={isActive}
              min="0"
            />
            <Input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="Minutes"
              disabled={isActive}
              min="0"
              max="59"
            />
            <Input
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
              placeholder="Seconds"
              disabled={isActive}
              min="0"
              max="59"
            />
          </div>
          <div className="text-4xl font-bold text-center">
            {formatTime(totalSeconds)}
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={handleStart}
              disabled={isActive || (!hours && !minutes && !seconds)}
            >
              Start
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="stopwatch" className="space-y-4">
          <div className="text-4xl font-bold text-center">
            {formatTime(stopwatchTime)}.{stopwatchMs.toString().padStart(3, '0')}
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => setIsStopwatchActive(!isStopwatchActive)}
            >
              {isStopwatchActive ? 'Pause' : 'Start'}
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => {
                setIsStopwatchActive(false);
                setStopwatchTime(0);
                setStopwatchMs(0);
              }}
            >
              Reset
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="clock" className="text-center space-y-4">
          <div className="text-4xl font-bold">{time}</div>
          <div className="text-xl text-muted-foreground">{date}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
