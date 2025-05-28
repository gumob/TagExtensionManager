/// <reference types="chrome"/>

/**
 * The offscreen namespace.
 */
declare namespace chrome.offscreen {
  /**
   * The reason type.
   */
  type Reason = 'AUDIO_PLAYBACK' | 'BLOBS' | 'CLIPBOARD' | 'DOM_PARSER' | 'DOM_SCRAPING' | 'IFRAME_SCRIPTING' | 'TESTING' | 'WORKERS';

  /**
   * The create document options type.
   */
  interface CreateDocumentOptions {
    url: string;
    reasons: Reason[];
    justification: string;
  }

  /**
   * The create document function.
   */
  function createDocument(options: CreateDocumentOptions): Promise<void>;

  /**
   * The has document function.
   */
  function hasDocument(): Promise<boolean>;
  function closeDocument(): Promise<void>;
}
