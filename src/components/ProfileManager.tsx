import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Fragment, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { useExtensionStore } from '../stores/extensionStore';
import { useProfileStore } from '../stores/profileStore';

export const ProfileManager = () => {
  const {
    profiles,
    currentProfileId,
    addProfile,
    updateProfile,
    deleteProfile,
    setCurrentProfile,
    importProfiles,
    exportProfiles,
  } = useProfileStore();
  const { extensions } = useExtensionStore();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<{ id: string; name: string } | null>(null);
  const [newProfileName, setNewProfileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const deleteDialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDeleteDialogOpen && e.key === 'Enter') {
        handleDeleteProfile();
      }
    };

    if (isDeleteDialogOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDeleteDialogOpen]);

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      const currentExtensions = extensions.map(ext => ({
        id: ext.id,
        enabled: ext.enabled,
      }));

      addProfile(newProfileName.trim(), currentExtensions);
      setNewProfileName('');
      setIsCreateDialogOpen(false);
      toast.success('Profile created successfully');
    }
  };

  const handleExportProfiles = () => {
    const profiles = exportProfiles();
    const blob = new Blob([JSON.stringify(profiles, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `ExtensionManager-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Profiles exported successfully');
  };

  const handleImportProfiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const importedProfiles = JSON.parse(e.target?.result as string);
        importProfiles(importedProfiles);
        toast.success('Profiles imported successfully');
      } catch (error) {
        toast.error('Failed to import profiles');
      }
    };
    reader.readAsText(file);
  };

  const handleRenameProfile = () => {
    if (selectedProfile && newProfileName.trim()) {
      updateProfile(selectedProfile.id, newProfileName.trim());
      setIsRenameDialogOpen(false);
      toast.success('Profile renamed successfully');
    }
  };

  const handleDeleteProfile = () => {
    if (selectedProfile) {
      deleteProfile(selectedProfile.id);
      setIsDeleteDialogOpen(false);
      toast.success('Profile deleted successfully');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Menu as="div" className="relative">
        <Menu.Button
          className={`inline-flex items-center gap-2 rounded-xl bg-zinc-50 dark:bg-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600 ${profiles.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={profiles.length === 0}
        >
          Profiles
          <ChevronDownIcon className="h-4 w-4" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-xl bg-zinc-50 dark:bg-zinc-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {profiles.length === 0 ? (
                <div className="px-4 py-2 text-zinc-400 text-sm">No profiles available</div>
              ) : (
                profiles.map(profile => (
                  <Menu.Item key={profile.id}>
                    {({ active }) => (
                      <div className="flex items-center justify-between px-4 py-2">
                        <button
                          className={`flex-1 text-left px-2 py-1.5 rounded-xl ${active ? 'bg-zinc-100 dark:bg-zinc-700' : ''} ${
                            currentProfileId === profile.id ? 'font-bold' : ''
                          } text-zinc-900 dark:text-zinc-100`}
                          onClick={() => setCurrentProfile(profile.id)}
                        >
                          {profile.name}
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedProfile({ id: profile.id, name: profile.name });
                              setNewProfileName(profile.name);
                              setIsRenameDialogOpen(true);
                            }}
                            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-600 rounded text-zinc-600 dark:text-zinc-400"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProfile({ id: profile.id, name: profile.name });
                              setIsDeleteDialogOpen(true);
                            }}
                            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-600 rounded text-zinc-600 dark:text-zinc-400"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                ))
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      <button
        onClick={() => {
          setNewProfileName('');
          setIsCreateDialogOpen(true);
        }}
        className="inline-flex items-center gap-2 rounded-xl bg-zinc-50 dark:bg-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600"
        title="Create a new profile"
      >
        <PlusIcon className="h-5 w-5" />
      </button>

      <button
        onClick={handleExportProfiles}
        className="inline-flex items-center gap-2 rounded-xl bg-zinc-50 dark:bg-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600"
        title="Export profiles"
      >
        <ArrowUpTrayIcon className="h-5 w-5" />
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-xl bg-zinc-50 dark:bg-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600"
        title="Import profiles"
      >
        <ArrowDownTrayIcon className="h-5 w-5" />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".json"
        onChange={e => {
          setIsImportDialogOpen(true);
          handleImportProfiles(e);
        }}
      />

      {/* Create Profile Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-xl bg-zinc-50 dark:bg-zinc-800 p-6">
            <Dialog.Title className="text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-100">
              Create New Profile
            </Dialog.Title>
            <div className="mt-2">
              <input
                type="text"
                value={newProfileName}
                onChange={e => setNewProfileName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newProfileName.trim()) {
                    handleCreateProfile();
                  }
                }}
                className="mt-1 block w-full rounded-xl border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-500 sm:text-sm px-4 py-2.5 min-w-[300px]"
                placeholder="Enter profile name"
                autoFocus
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="inline-flex justify-center rounded-xl border border-transparent bg-zinc-100 dark:bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setNewProfileName('');
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-xl border border-transparent bg-zinc-600 dark:bg-zinc-500 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-600 dark:hover:bg-zinc-400"
                onClick={handleCreateProfile}
              >
                Create
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Import Confirmation Dialog */}
      <Dialog
        open={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-zinc-50 dark:bg-zinc-800 p-6">
            <Dialog.Title className="text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-100">
              Import Profiles
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Are you sure you want to import profiles? Current profiles will be overwritten.
              </p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="inline-flex justify-center rounded-xl border border-transparent bg-zinc-100 dark:bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                onClick={() => setIsImportDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-xl border border-transparent bg-zinc-600 dark:bg-zinc-500 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-600 dark:hover:bg-zinc-400"
                onClick={() => setIsImportDialogOpen(false)}
              >
                Import
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog
        open={isRenameDialogOpen}
        onClose={() => setIsRenameDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-xl bg-zinc-50 dark:bg-zinc-800 p-6">
            <Dialog.Title className="text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-100">
              Rename Profile
            </Dialog.Title>
            <div className="mt-2">
              <input
                type="text"
                value={newProfileName}
                onChange={e => setNewProfileName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newProfileName.trim()) {
                    handleRenameProfile();
                  }
                }}
                className="mt-1 block w-full rounded-xl border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-500 sm:text-sm px-4 py-2.5 min-w-[300px]"
                placeholder="Enter new profile name"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="inline-flex justify-center rounded-xl border border-transparent bg-zinc-100 dark:bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                onClick={() => setIsRenameDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-xl border border-transparent bg-zinc-600 dark:bg-zinc-500 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-600 dark:hover:bg-zinc-400"
                onClick={handleRenameProfile}
              >
                Rename
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-zinc-50 dark:bg-zinc-800 p-6">
            <Dialog.Title className="text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-100">
              Delete Profile
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Are you sure you want to delete {selectedProfile?.name}?
              </p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="inline-flex justify-center rounded-xl border border-transparent bg-zinc-100 dark:bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-xl border border-transparent bg-red-600 dark:bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:hover:bg-red-400"
                onClick={handleDeleteProfile}
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};
