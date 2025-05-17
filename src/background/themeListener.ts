import { updateExtensionIcon } from '../utils/iconManager';

const THEME_KEY = 'extensionTheme';
const DEFAULT_THEME = 'dark';

export const initializeThemeListener = (): void => {
  console.debug('[Extension Manager] Initialize Theme Listner');

  // 現在の設定を取得
  chrome.storage.local.get([THEME_KEY], (result) => {
    // 設定がなければデフォルトのテーマを使用
    const currentTheme = result[THEME_KEY] || DEFAULT_THEME;
    const isDarkMode = currentTheme === 'dark';
    
    console.debug('[Extension Manager] Current theme:', isDarkMode ? 'dark' : 'light');
    updateExtensionIcon(isDarkMode);

    // 設定がなければ保存
    if (!result[THEME_KEY]) {
      chrome.storage.local.set({ [THEME_KEY]: DEFAULT_THEME });
    }
  });

  // テーマ変更の監視
  chrome.storage.onChanged.addListener((changes) => {
    if (changes[THEME_KEY]) {
      const isDarkMode = changes[THEME_KEY].newValue === 'dark';
      console.debug('[Extension Manager] Theme changed to:', isDarkMode ? 'dark' : 'light');
      updateExtensionIcon(isDarkMode);
    }
  });
};
