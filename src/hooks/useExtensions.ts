import { Extension } from '@/types/extension';
import { getAllExtensions } from '@/utils/extensionUtils';
import { useCallback, useEffect, useMemo, useState } from 'react';

const findOptimalIcon = (icons: chrome.management.IconInfo[] | undefined): string => {
  if (!icons || icons.length === 0) return '';

  // 48pxのアイコンを探す
  let targetSize = 48;
  while (targetSize > 0) {
    const icon = icons.find(icon => icon.size === targetSize);
    if (icon) return icon.url;
    targetSize -= 2;
  }

  // 適切なサイズが見つからない場合は最初のアイコンを使用
  return icons[0].url;
};

export const useExtensions = () => {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isManualRefresh, setIsManualRefresh] = useState(false);

  const refreshExtensions = useCallback(async () => {
    try {
      setIsLoading(true);
      const updatedExtensions = await getAllExtensions();
      console.debug('Refreshing extensions state:', updatedExtensions);
      setExtensions(updatedExtensions);
      return updatedExtensions;
    } catch (error) {
      console.error('Failed to refresh extensions:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 拡張機能の状態変更を監視
  useEffect(() => {
    // 初期状態の取得
    refreshExtensions();

    // 拡張機能の状態変更を監視
    const handleExtensionStateChange = () => {
      // 手動更新の場合は自動更新をスキップ
      if (isManualRefresh) {
        setIsManualRefresh(false);
        return;
      }
      refreshExtensions();
    };

    // イベントリスナーの登録
    chrome.management.onEnabled.addListener(handleExtensionStateChange);
    chrome.management.onDisabled.addListener(handleExtensionStateChange);
    chrome.management.onInstalled.addListener(handleExtensionStateChange);
    chrome.management.onUninstalled.addListener(handleExtensionStateChange);

    // クリーンアップ
    return () => {
      chrome.management.onEnabled.removeListener(handleExtensionStateChange);
      chrome.management.onDisabled.removeListener(handleExtensionStateChange);
      chrome.management.onInstalled.removeListener(handleExtensionStateChange);
      chrome.management.onUninstalled.removeListener(handleExtensionStateChange);
    };
  }, [refreshExtensions, isManualRefresh]);

  const filteredExtensions = useMemo(
    () => extensions.filter(ext => ext.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [extensions, searchQuery]
  );

  const getCurrentExtensionStates = useCallback(() => {
    return extensions.map(ext => ({
      id: ext.id,
      enabled: ext.enabled,
    }));
  }, [extensions]);

  return {
    extensions,
    filteredExtensions,
    searchQuery,
    setSearchQuery,
    isLoading,
    refreshExtensions,
    getCurrentExtensionStates,
    setIsManualRefresh,
  };
};
