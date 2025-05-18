/// <reference types="chrome"/>

declare namespace chrome.offscreen {
  type Reason = 'AUDIO_PLAYBACK' | 'BLOBS' | 'CLIPBOARD' | 'DOM_PARSER' | 'DOM_SCRAPING' | 'IFRAME_SCRIPTING' | 'TESTING' | 'WORKERS';

  interface CreateDocumentOptions {
    url: string;
    reasons: Reason[];
    justification: string;
  }

  function createDocument(options: CreateDocumentOptions): Promise<void>;
  function hasDocument(): Promise<boolean>;
  function closeDocument(): Promise<void>;
} 