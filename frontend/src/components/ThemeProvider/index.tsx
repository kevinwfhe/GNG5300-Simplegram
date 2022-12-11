import { ThemeProvider as PolarisThemeProvider } from '@shopify/polaris';
import { ThemeProviderProps } from '@shopify/polaris/build/ts/latest/src/components/ThemeProvider';
import React, { createContext, useState, useMemo } from 'react';

export const ColorSchemeContext = createContext({
  switchColorScheme: (scheme: string) => {},
  scheme: '',
});

export function ThemeProvider({
  theme,
  children,
  ...providerProps
}: ThemeProviderProps) {
  // Only deal with dark or light themecolor, ignore inverse.
  const defaultColorScheme = theme?.colorScheme === 'light' ? 'light' : 'dark';
  const [scheme, setScheme] = useState<'light' | 'dark'>(defaultColorScheme);
  const switchColorScheme = useMemo(
    () => ({
      switchColorScheme: () =>
        setScheme((prevState) => (prevState === 'light' ? 'dark' : 'light')),
      scheme,
    }),
    [scheme],
  );
  return (
    <ColorSchemeContext.Provider value={switchColorScheme}>
      <PolarisThemeProvider
        theme={{
          ...theme,
          colorScheme: scheme, // override colorScheme.
        }}
        {...providerProps} // pass through the other props
      >
        {children}
      </PolarisThemeProvider>
    </ColorSchemeContext.Provider>
  );
}
