import { Extension } from '@/types/extension';
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
    <div className="flex flex-row w-full gap-[1px]">
      <div className="flex-1 px-3 py-2 rounded-s-xl bg-zinc-100 dark:bg-zinc-700">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-zinc-900 dark:text-white">Total</h3>
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{total}</p>
        </div>
      </div>

      <div className="flex-1 px-3 py-2 rounded-none bg-zinc-100 dark:bg-zinc-700">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-zinc-900 dark:text-white">Enabled</h3>
          <p className="text-xs font-bold text-green-600 dark:text-green-400">{enabled}</p>
        </div>
      </div>

      <div className="flex-1 px-3 py-2 rounded-r-xl bg-zinc-100 dark:bg-zinc-700">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-zinc-900 dark:text-white">Disabled</h3>
          <p className="text-xs font-bold text-red-600 dark:text-red-400">{disabled}</p>
        </div>
      </div>
    </div>
  );
};

export { Metrics };
