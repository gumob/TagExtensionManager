import { initializeThemeListener } from './themeListener';

/** Background script for extension management */
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension Manager installed');

  /** Initialize theme listener */
  initializeThemeListener();
});

// Listen for extension state changes
chrome.management.onEnabled.addListener((extension) => {
  console.log(`Extension enabled: ${extension.name}`);
});

chrome.management.onDisabled.addListener((extension) => {
  console.log(`Extension disabled: ${extension.name}`);
});
