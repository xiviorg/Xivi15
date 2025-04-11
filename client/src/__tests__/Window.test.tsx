import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Window } from '../components/desktop/Window';
import { useDesktopStore } from '../store/desktop';
import React from 'react';

vi.mock('../store/desktop', () => {
  const closeWindowMock = vi.fn();
  const minimizeWindowMock = vi.fn();
  const maximizeWindowMock = vi.fn();
  const activateWindowMock = vi.fn();
  const setWindowPositionMock = vi.fn();
  
  return {
    useDesktopStore: () => ({
      windows: [],
      activeWindow: 'test-window-123',
      closeWindow: closeWindowMock,
      minimizeWindow: minimizeWindowMock,
      maximizeWindow: maximizeWindowMock,
      activateWindow: activateWindowMock,
      setWindowPosition: setWindowPositionMock,
    }),
    closeWindowMock,
    minimizeWindowMock,
    maximizeWindowMock,
  };
});

vi.mock('../components/desktop/Welcome', () => {
  return {
    default: () => <div></div>
  };
});

describe('Window rendering tests', () => {
  const mockWindow = {
    id: 'test-window-123',
    title: 'Test Window',
    component: 'TextEditor',
    zIndex: 10,
    isMaximized: false,
    isMinimized: false,
    props: {},
    children: <div>Mock Content</div>,
    position: { x: 100, y: 100, width: 500, height: 500 }
  };

  it('Check if window is rendered with the correct name', () => {
    render(<Window {...mockWindow} />);
    expect(screen.getByText('Test Window')).toBeInTheDocument();
  });

  it('Check if the styling and display is correct', () => {
    render(<Window {...mockWindow} />);
    const windowElement = screen.getByTestId('window-test-window-123') || screen.getByRole('dialog');
    expect(windowElement).toHaveStyle(`z-index: 10`);
  });

  it('Check if the maximized styles are applied correctly', () => {
    const maximizedWindow = {
      ...mockWindow,
      isMaximized: true
    };
    render(<Window {...maximizedWindow} />);
    
    const windowElement = screen.getByTestId('window-test-window-123') || screen.getByRole('dialog');
    expect(windowElement).toHaveClass(/!left-0/);
    expect(windowElement).toHaveClass(/!right-0/);
    expect(windowElement).toHaveClass(/!top-0/);
    expect(windowElement).toHaveClass(/!bottom-12/);
  });
});