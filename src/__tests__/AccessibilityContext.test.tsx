import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { AccessibilityProvider, useAccessibility } from '../contexts/AccessibilityContext';

// Test component that exposes context values
function TestConsumer() {
  const { highContrast, textScale, reducedMotion, toggleHighContrast, toggleReducedMotion, setTextScale } = useAccessibility();
  return (
    <div>
      <span data-testid="contrast">{String(highContrast)}</span>
      <span data-testid="scale">{textScale}</span>
      <span data-testid="motion">{String(reducedMotion)}</span>
      <button data-testid="toggle-contrast" onClick={toggleHighContrast}>Toggle Contrast</button>
      <button data-testid="toggle-motion" onClick={toggleReducedMotion}>Toggle Motion</button>
      <button data-testid="set-large" onClick={() => setTextScale('large')}>Set Large</button>
      <button data-testid="set-extra-large" onClick={() => setTextScale('extra-large')}>Set XL</button>
    </div>
  );
}

describe('AccessibilityContext', () => {
  beforeEach(() => {
    window.localStorage?.clear();
    document.documentElement.removeAttribute('data-accessibility');
    document.documentElement.removeAttribute('data-reduced-motion');
    document.documentElement.style.fontSize = '';
  });

  it('provides default accessibility values', () => {
    render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );

    expect(screen.getByTestId('contrast')).toHaveTextContent('false');
    expect(screen.getByTestId('scale')).toHaveTextContent('normal');
    expect(screen.getByTestId('motion')).toHaveTextContent('false');
  });

  it('toggles high contrast mode', () => {
    render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );

    fireEvent.click(screen.getByTestId('toggle-contrast'));
    expect(screen.getByTestId('contrast')).toHaveTextContent('true');
  });

  it('toggles reduced motion mode', () => {
    render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );

    fireEvent.click(screen.getByTestId('toggle-motion'));
    expect(screen.getByTestId('motion')).toHaveTextContent('true');
  });

  it('changes text scale', () => {
    render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );

    fireEvent.click(screen.getByTestId('set-large'));
    expect(screen.getByTestId('scale')).toHaveTextContent('large');

    fireEvent.click(screen.getByTestId('set-extra-large'));
    expect(screen.getByTestId('scale')).toHaveTextContent('extra-large');
  });

  it('applies high contrast data attribute to the document', () => {
    render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );

    fireEvent.click(screen.getByTestId('toggle-contrast'));
    expect(document.documentElement.getAttribute('data-accessibility')).toBe('high-contrast');
  });

  it('applies reduced motion data attribute to the document', () => {
    render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );

    fireEvent.click(screen.getByTestId('toggle-motion'));
    expect(document.documentElement.getAttribute('data-reduced-motion')).toBe('true');
  });

  it('changes root font size for text scaling', () => {
    render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );

    fireEvent.click(screen.getByTestId('set-large'));
    expect(document.documentElement.style.fontSize).toBe('18px');

    fireEvent.click(screen.getByTestId('set-extra-large'));
    expect(document.documentElement.style.fontSize).toBe('20px');
  });

  it('throws error when useAccessibility is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow('useAccessibility must be used within an AccessibilityProvider');
    consoleSpy.mockRestore();
  });

  it('handles localStorage failure gracefully', () => {
    const originalGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = () => { throw new Error('SecurityError'); };

    // Should not throw
    expect(() => {
      render(
        <AccessibilityProvider>
          <TestConsumer />
        </AccessibilityProvider>
      );
    }).not.toThrow();

    Storage.prototype.getItem = originalGetItem;
  });
});
