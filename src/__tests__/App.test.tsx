import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock child components to simplify App rendering
vi.mock('../components/LandingPageComponents/Hero', () => ({
  Hero: ({ onLaunchDashboard }: any) => (
    <div data-testid="hero-section">
      <h1>Hero Section</h1>
      <button onClick={onLaunchDashboard}>Launch Dashboard</button>
    </div>
  ),
}));

vi.mock('../components/LandingPageComponents/LiveSandbox', () => ({
  LiveSandbox: () => <div data-testid="live-sandbox">Sandbox</div>,
}));

vi.mock('../components/AuthModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose }: any) => isOpen ? (
    <div data-testid="auth-modal" role="dialog">
      <button onClick={onClose}>Close</button>
    </div>
  ) : null,
}));

// Import App AFTER mocks
import App from '../App';

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AccessibilityProvider>
          <App />
        </AccessibilityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

describe('App Component', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-accessibility');
    document.documentElement.removeAttribute('data-reduced-motion');
    document.documentElement.style.fontSize = '';
  });

  it('renders the landing page by default', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getAllByText('CROWDMIND').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders the global status bar with live mesh indicator', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByText('LIVE BRAIN GRID')).toBeInTheDocument();
    });
  });

  it('renders Plant Lusail operations label', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByText('PLANT LUSAIL OPERATIONS')).toBeInTheDocument();
    });
  });

  it('renders accessibility control buttons', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByTitle('Toggle High Contrast Mode')).toBeInTheDocument();
      expect(screen.getByTitle('Change Text Scale Size')).toBeInTheDocument();
      expect(screen.getByTitle('Toggle Reduced Motion Mode')).toBeInTheDocument();
    });
  });

  it('renders the Dashboard navigation button', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('renders the Access Gateway button when not logged in', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByText('Access Gateway')).toBeInTheDocument();
    });
  });

  it('renders footer with copyright information', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByText(/© 2026 Plant Lusail/)).toBeInTheDocument();
    });
  });

  it('renders feature cards section', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByText('Unified RAG Search')).toBeInTheDocument();
      expect(screen.getByText('Knowledge Graph Ontology')).toBeInTheDocument();
      expect(screen.getByText('Multi-Agent Incident RCA')).toBeInTheDocument();
    });
  });

  it('contrast toggle button works correctly', async () => {
    const user = userEvent.setup();
    renderApp();

    const contrastBtn = await screen.findByTitle('Toggle High Contrast Mode');
    await user.click(contrastBtn);

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-accessibility')).toBe('high-contrast');
    });
  });

  it('motion toggle button works correctly', async () => {
    const user = userEvent.setup();
    renderApp();

    const motionBtn = await screen.findByTitle('Toggle Reduced Motion Mode');
    await user.click(motionBtn);

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-reduced-motion')).toBe('true');
    });
  });

  it('includes a skip navigation link', async () => {
    renderApp();
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink.getAttribute('href')).toBe('#main-content');
  });

  it('has proper semantic landmarks', async () => {
    renderApp();
    await waitFor(() => {
      // Check for proper ARIA landmarks
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });

  it('has proper ARIA labels on accessibility controls', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByRole('toolbar', { name: /accessibility/i })).toBeInTheDocument();
    });
  });

  it('renders hero section', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });
  });

  it('renders live sandbox', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByTestId('live-sandbox')).toBeInTheDocument();
    });
  });
});
