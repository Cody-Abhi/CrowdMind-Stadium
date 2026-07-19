import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type TextScale = 'normal' | 'large' | 'extra-large';

interface AccessibilityContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('accessibility-contrast') === 'true';
  });

  const [textScale, setTextScaleState] = useState<TextScale>(() => {
    return (localStorage.getItem('accessibility-scale') as TextScale) || 'normal';
  });

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return localStorage.getItem('accessibility-motion') === 'true';
  });

  // Toggle High Contrast
  const toggleHighContrast = () => {
    setHighContrast(prev => {
      const next = !prev;
      localStorage.setItem('accessibility-contrast', String(next));
      return next;
    });
  };

  // Set Text Scale
  const setTextScale = (scale: TextScale) => {
    setTextScaleState(scale);
    localStorage.setItem('accessibility-scale', scale);
  };

  // Toggle Reduced Motion
  const toggleReducedMotion = () => {
    setReducedMotion(prev => {
      const next = !prev;
      localStorage.setItem('accessibility-motion', String(next));
      return next;
    });
  };

  // Apply attributes to Document Element
  useEffect(() => {
    const root = document.documentElement;

    // Apply contrast attribute
    if (highContrast) {
      root.setAttribute('data-accessibility', 'high-contrast');
    } else {
      root.removeAttribute('data-accessibility');
    }

    // Apply text scale styles (Tailwind rem units respond to root font-size)
    if (textScale === 'large') {
      root.style.fontSize = '18px';
    } else if (textScale === 'extra-large') {
      root.style.fontSize = '20px';
    } else {
      root.style.fontSize = '16px';
    }

    // Apply reduced motion attribute
    if (reducedMotion) {
      root.setAttribute('data-reduced-motion', 'true');
    } else {
      root.removeAttribute('data-reduced-motion');
    }
  }, [highContrast, textScale, reducedMotion]);

  return (
    <AccessibilityContext.Provider value={{
      highContrast,
      toggleHighContrast,
      textScale,
      setTextScale,
      reducedMotion,
      toggleReducedMotion
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
