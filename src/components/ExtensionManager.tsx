import { ExtensionList } from '@/components/ExtensionList';
import { Metrics } from '@/components/Metrics';
import { ProfileManager } from '@/components/ProfileManager';
import { SearchBar } from '@/components/SearchBar';
import { useExtensions } from '@/hooks/useExtensions';
import React, { useCallback } from 'react';

export const ExtensionManager: React.FC = () => {
  const { extensions, filteredExtensions, setSearchQuery, refreshExtensions, setIsManualRefresh } =
    useExtensions();

  const handleExtensionStateChange = useCallback(
    async (id: string, enabled: boolean) => {
      try {
        // 手動更新フラグを設定
        setIsManualRefresh(true);

        // Chrome APIを使用して拡張機能の状態を更新
        await new Promise<void>((resolve, reject) => {
          chrome.management.setEnabled(id, enabled, () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve();
            }
          });
        });

        // 状態更新後に拡張機能の状態を再取得
        await refreshExtensions();
      } catch (error) {
        console.error('Failed to update extension state:', error);
        // エラーが発生した場合は状態を再取得
        await refreshExtensions();
      }
    },
    [refreshExtensions, setIsManualRefresh]
  );

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <div className="container mx-auto flex flex-col h-full">
        <div className="flex-none px-4 pt-4 pb-0">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-lg font-bold text-zinc-900 dark:text-white">Extension Manager</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3">
            <Metrics extensions={extensions} />
          </div>

          <div className="mb-3">
            <ProfileManager />
          </div>

          <div className="mb-3">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="h-full">
            <ExtensionList
              extensions={filteredExtensions}
              onExtensionStateChange={handleExtensionStateChange}
            />
          </div>
        </div>
      </div>
    </main>
  );
};
