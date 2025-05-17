import { useState, useEffect } from 'react';
import { Extension } from '@/types/extension';
import { getAllExtensions } from '@/utils/extensionUtils';

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

  useEffect(() => {
    getAllExtensions().then(setExtensions);
  }, []);

  const filteredExtensions = extensions.filter((ext) =>
    ext.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    extensions,
    filteredExtensions,
    searchQuery,
    setSearchQuery,
  };
}; 