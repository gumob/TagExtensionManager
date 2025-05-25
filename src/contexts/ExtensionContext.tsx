import React, { createContext, useContext } from 'react';

import { useExtensions } from '@/hooks';

interface ExtensionContextType {
  extensions: ReturnType<typeof useExtensions>;
}

const ExtensionContext = createContext<ExtensionContextType | undefined>(undefined);

export const ExtensionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const extensions = useExtensions();

  return <ExtensionContext.Provider value={{ extensions }}>{children}</ExtensionContext.Provider>;
};

export const useExtensionContext = () => {
  const context = useContext(ExtensionContext);
  if (context === undefined) {
    throw new Error('useExtensionContext must be used within an ExtensionProvider');
  }
  return context;
};
