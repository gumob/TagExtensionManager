import { Extension } from '@/types/extension';
import { getAllExtensions } from '@/utils/extensionUtils';
import React, { FC, useEffect, useState } from 'react';

interface MetricsProps {
  extensions?: Extension[];
}

const Metrics: FC<MetricsProps> = ({ extensions = [] }) => {
  const [localExtensions, setLocalExtensions] = useState(extensions);

  useEffect(() => {
    setLocalExtensions(extensions);
  }, [extensions]);

  const total = localExtensions.length;
  const enabled = localExtensions.filter(ext => ext.enabled).length;
  const disabled = total - enabled;

  return (
    <div className="flex flex-row w-full gap-2">
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-2">
        <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-1">Total</h3>
        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{total}</p>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-2">
        <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-1">Enabled</h3>
        <p className="text-lg font-bold text-green-600 dark:text-green-400">{enabled}</p>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-2">
        <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-1">Disabled</h3>
        <p className="text-lg font-bold text-red-600 dark:text-red-400">{disabled}</p>
      </div>
    </div>
  );
};

export { Metrics };
