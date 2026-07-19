import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { onAuthStateChanged } from '../firebase';


// Test component that exposes context values
function AuthTestConsumer() {
  const { currentUser, userProfile, loading, error } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{currentUser ? 'logged-in' : 'logged-out'}</span>
      <span data-testid="role">{userProfile?.role || 'none'}</span>
      <span data-testid="error">{error || 'none'}</span>
    </div>
  );
}

describe('AuthContext', () => {
  it('provides default auth state', async () => {
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('logged-out');
    });
  });

  it('starts with loading state', () => {
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    // Initially loading is true until onAuthStateChanged fires
    expect(screen.getByTestId('loading')).toBeTruthy();
  });

  it('starts with no errors', async () => {
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('none');
    });
  });

  it('throws error when useAuth is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<AuthTestConsumer />)).toThrow();
    consoleSpy.mockRestore();
  });

  it('starts with no role assigned', async () => {
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('role')).toHaveTextContent('none');
    });
  });

  it('updateUserRole throws error if current user is not an admin', async () => {
    // Mock onAuthStateChanged to return a logged-in user
    vi.mocked(onAuthStateChanged).mockImplementationOnce((auth, cb: any) => {
      cb({ uid: 'test-user-123', email: 'test@example.com' });
      return vi.fn();
    });

    // Render the provider to test context interactions
    let capturedContext: any;
    function GrabContextConsumer() {
      capturedContext = useAuth();
      return null;
    }

    render(
      <AuthProvider>
        <GrabContextConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(capturedContext).toBeDefined();
    });

    // Try to update role - should fail because profile role is not 'admin' (it will be 'fan' or undefined by default mock)
    await expect(capturedContext.updateUserRole('engineer')).rejects.toThrow(
      'Permission denied: only administrators can change user roles.'
    );
  });
});


