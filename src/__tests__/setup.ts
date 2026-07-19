import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Firebase
vi.mock('../firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
  },
  db: {},
  googleProvider: {},
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn((auth, cb) => {
    cb(null);
    return vi.fn();
  }),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false })),
  collection: vi.fn(),
  onSnapshot: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  getDocs: vi.fn(),
  where: vi.fn(),
}));

// Mock motion/react
vi.mock('motion/react', () => {
  const React = require('react');
  
  const motionProxy = new Proxy(
    {},
    {
      get: (_target: any, prop: string) => {
        const tags = ['div', 'button', 'span', 'section', 'nav', 'header', 'footer', 'p', 'h1', 'h2', 'h3', 'ul', 'li', 'a', 'img', 'article', 'aside', 'main', 'form', 'input', 'label', 'path', 'svg'];
        if (tags.includes(prop)) {
          return React.forwardRef(({ children, initial, animate, exit, whileHover, whileTap, whileInView, transition, variants, layout, layoutId, ...domProps }: any, ref: any) => {
            return React.createElement(prop, { ...domProps, ref }, children);
          });
        }
        return undefined;
      },
    }
  );

  return {
    motion: motionProxy,
    AnimatePresence: ({ children }: any) => children,
    useMotionValue: () => ({ get: () => 0, set: vi.fn() }),
    useTransform: () => ({ get: () => 0 }),
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useInView: () => true,
  };
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});
