import React, { FC, useEffect, useState } from 'react';

interface MetricsProps {
  extensions?: Array<{ enabled: boolean }>;
}

const Metrics: FC<MetricsProps> = ({ extensions = [] }) => {
  const [localExtensions, setLocalExtensions] = useState(extensions);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.management) {
      chrome.management.getAll((extensions) => {
        setLocalExtensions(extensions);
      });
    }
  }, []);

  const total = localExtensions.length;
  const enabled = localExtensions.filter((ext) => ext.enabled).length;
  const disabled = total - enabled;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Total Extensions
        </h3>
        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {total}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Enabled
        </h3>
        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
          {enabled}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Disabled
        </h3>
        <p className="text-3xl font-bold text-red-600 dark:text-red-400">
          {disabled}
        </p>
      </div>
    </>
  );
};

export { Metrics }; 