/// <reference types="chrome"/>

declare namespace chrome {
  export namespace runtime {
    export const onInstalled: {
      addListener(callback: () => void): void;
    };
  }

  export namespace management {
    export function getAll(callback: (extensions: chrome.management.ExtensionInfo[]) => void): void;
    export function setEnabled(id: string, enabled: boolean, callback?: () => void): void;
  }

  export namespace tabs {
    export function create(createProperties: { url: string }): void;
  }

  export namespace management {
    export interface ExtensionInfo {
      id: string;
      name: string;
      version?: string;
      enabled: boolean;
      description?: string;
      icons?: Array<{ url: string }>;
    }
  }
} 