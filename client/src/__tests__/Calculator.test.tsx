import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Calculator } from '../components/apps/Calculator';
import React from 'react';

import '@testing-library/jest-dom';

vi.mock('../components/desktop/Welcome', () => {
  return {
    default: () => <div></div>
  };
});

describe('Basic input tests', () => {
  it('Renders calculator app', () => {
    render(<Calculator />);
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByRole('button', { name: i.toString() })).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '/' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '=' })).toBeInTheDocument();
  });

  it('Display updates when numbers are clicked', () => {
    render(<Calculator />);
    const display = screen.getByTestId('calculator-display');
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    expect(display).toHaveTextContent('123');
  });

  it('Basic calculations can be performed correctly', () => {
    render(<Calculator />);
    const display = screen.getByTestId('calculator-display');
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    expect(display).toHaveTextContent('4');
  });

  it('Clear button functions', () => {
    render(<Calculator />);
    const display = screen.getByTestId('calculator-display');
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    expect(display).toHaveTextContent('55');
    fireEvent.click(screen.getByRole('button', { name: 'C' }));
    expect(display).toHaveTextContent('0');
  });
});