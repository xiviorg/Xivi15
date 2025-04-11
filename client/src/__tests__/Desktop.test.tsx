import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Desktop } from '../components/Desktop';
import React from 'react';

vi.mock('../store/desktop', () => {
  return {
    useDesktopStore: () => ({
      windows: [],
      activeWindow: null,
      openWindow: vi.fn(),
      closeWindow: vi.fn(),
      minimizeWindow: vi.fn(),
      maximizeWindow: vi.fn(),
      activateWindow: vi.fn(),
      setWindowPosition: vi.fn(),
      setWindowSize: vi.fn(),
      draggingWindow: null,
      setDraggingWindow: vi.fn(),
    })
  };
});

vi.mock('../components/desktop/Welcome', () => {
  return {
    default: () => <div></div>
  };
});

describe('Desktop rendering tests', () => {
  it('Renders desktop in general', () => {
    render(<Desktop />);
    expect(screen.getByTestId('desktop')).toBeInTheDocument();
  });

  it('Renders the desktop with the taskbar and start button', () => {
    render(<Desktop />);
    expect(screen.getByTestId('start-button')).toBeInTheDocument();
  });
});