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

import { useExtensions } from '../hooks/useExtensions';
import { useProfileStore } from '../stores/profileStore';

/**
 * The component for managing profiles.
 * @returns
 */
export const ProfileManager = () => {
  const {
    profiles,
    addProfile,
    updateProfile,
    deleteProfile,
    setCurrentProfile,
    importProfiles,
    exportProfiles,
    initialize,
  } = useProfileStore();
  const { refreshExtensions, setIsManualRefresh } = useExtensions();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isOverwriteDialogOpen, setIsOverwriteDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<{ id: string; name: string } | null>(null);
  const [newProfileName, setNewProfileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Initialize profiles on mount
   */
  useEffect(() => {
    console.debug('[Extension Manager][ProfileManager] Initializing profiles');
    initialize();
  }, [initialize]);

  /**
   * Handle the delete profile event.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.debug('[ProfileManager] Key pressed:', e.key);
      if (isDeleteDialogOpen && e.key === 'Enter') {
        handleDeleteProfile();
      }
      if (isOverwriteDialogOpen && e.key === 'Enter') {
        console.debug('[ProfileManager] Enter pressed in overwrite dialog');
        e.preventDefault();
        e.stopPropagation();
        handleOverwriteProfile();
      }
    };

    if (isDeleteDialogOpen || isOverwriteDialogOpen) {
      console.debug('[ProfileManager] Adding keydown listener');
      document.addEventListener('keydown', handleKeyDown, true);
    }

    return () => {
      console.debug('[ProfileManager] Removing keydown listener');
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isDeleteDialogOpen, isOverwriteDialogOpen]);

  /**
   * Handle the create profile event.
   */
  const handleCreateProfile = async () => {
    if (newProfileName.trim()) {
      console.debug('[ProfileManager] Creating profile:', newProfileName.trim());
      const existingProfile = profiles.find(p => p.name === newProfileName.trim());
      if (existingProfile) {
        console.debug('[ProfileManager] Found existing profile:', existingProfile);
        setIsCreateDialogOpen(false);
        // Add a small delay to ensure the create dialog is closed before showing the overwrite dialog
        setTimeout(() => {
          setIsOverwriteDialogOpen(true);
          console.debug('[ProfileManager] Set overwrite dialog to true');
        }, 100);
        return;
      }

      /** Get the current extension states */
      const currentExtensions = await refreshExtensions();
      const extensionStates = currentExtensions.map(ext => ({
        id: ext.id,
        enabled: ext.enabled,
      }));

      addProfile(newProfileName.trim(), extensionStates);
      setNewProfileName('');
      setIsCreateDialogOpen(false);
      toast.success('Profile created successfully');
    }
  };

  /**
   * Handle the overwrite profile event.
   */
  const handleOverwriteProfile = async () => {
    if (newProfileName.trim()) {
      console.debug('[ProfileManager] Overwriting profile:', newProfileName.trim());
      /** Get the current extension states */
      const currentExtensions = await refreshExtensions();
      const extensionStates = currentExtensions.map(ext => ({
        id: ext.id,
        enabled: ext.enabled,
      }));

      addProfile(newProfileName.trim(), extensionStates);
      setNewProfileName('');
      setIsOverwriteDialogOpen(false);
      toast.success('Profile overwritten successfully');
    }
  };

  /**
   * Handle the export profiles event.
   */
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

  /**
   * Handle the import profiles event.
   */
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

  /**
   * Handle the rename profile event.
   */
  const handleRenameProfile = () => {
    if (selectedProfile && newProfileName.trim()) {
      updateProfile(selectedProfile.id, newProfileName.trim());
      setIsRenameDialogOpen(false);
      toast.success('Profile renamed successfully');
    }
  };

  /**
   * Handle the delete profile event.
   */
  const handleDeleteProfile = () => {
    if (selectedProfile) {
      deleteProfile(selectedProfile.id);
      setIsDeleteDialogOpen(false);
      toast.success('Profile deleted successfully');
    }
  };

  /**
   * Handle the profile select event.
   */
  const handleProfileSelect = async (profileId: string) => {
    try {
      console.debug('Switching to profile:', profileId);

      /** Set the manual refresh flag  */
      setIsManualRefresh(true);

      /** Apply the new profile */
      console.debug('Applying new profile');
      await setCurrentProfile(profileId);

      /** Refresh the extension states and update the UI */
      console.debug('Refreshing extension states');
      await refreshExtensions();

      toast.success('Profile activated successfully');
    } catch (error) {
      console.error('Failed to activate profile:', error);
      toast.error('Failed to activate profile');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Menu as="div" className="relative">
        <Menu.Button
          className={`inline-flex items-center gap-2 rounded-xl bg-white dark:bg-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-500 ${profiles.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={profiles.length === 0}
        >
          {profiles.length === 0 ? (
            'No Profile'
          ) : (
            <>
              Profiles
              <ChevronDownIcon className="h-4 w-4" />
            </>
          )}
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
          <Menu.Items className="absolute left-0 z-10 mt-2 w-80 origin-top-left rounded-xl bg-white dark:bg-zinc-700 shadow-xl shadow-zinc-400 dark:shadow-zinc-900 focus:outline-none">
            <div className="py-1">
              {profiles.length === 0 ? (
                <div className="px-4 py-2 text-zinc-400 text-sm">No profiles available</div>
              ) : (
                <>
                  {profiles.map((profile, index) => (
                    <Fragment key={profile.id}>
                      {index > 0 && (
                        <div className="mx-2 border-t border-zinc-200 dark:border-zinc-600" />
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <div className="flex items-center justify-between px-4 py-2">
                            <button
                              className={`flex-1 text-left px-2 py-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-500 text-zinc-900 dark:text-zinc-100`}
                              title={`Activate this profile`}
                              onClick={() => handleProfileSelect(profile.id)}
                            >
                              {profile.name}
                            </button>
                            <div className="flex gap-0">
                              <button
                                onClick={() => {
                                  setSelectedProfile({ id: profile.id, name: profile.name });
                                  setNewProfileName(profile.name);
                                  setIsRenameDialogOpen(true);
                                }}
                                className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-500 px-2 py-2 rounded-md text-zinc-900 dark:text-zinc-100"
                                title="Rename this profile"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedProfile({ id: profile.id, name: profile.name });
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-500 px-2 py-2 rounded-md text-zinc-900 dark:text-zinc-100"
                                title="Delete this profile"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    </Fragment>
                  ))}
                </>
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
        className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-500"
        title="Create a new profile"
      >
        <PlusIcon className="h-5 w-5" />
      </button>

      <button
        onClick={handleExportProfiles}
        className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-500"
        title="Export profiles"
      >
        <ArrowUpTrayIcon className="h-5 w-5" />
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-500"
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
        <div className="fixed inset-0 bg-black/30 dark:bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-xl bg-zinc-100 dark:bg-zinc-800 p-6">
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
                    e.preventDefault();
                    handleCreateProfile();
                  }
                }}
                className="mt-1 block w-full rounded-full bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-500 sm:text-sm px-4 py-2.5 min-w-[300px]"
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
                className="inline-flex justify-center rounded-xl border border-transparent bg-zinc-600 dark:bg-zinc-500 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:hover:bg-zinc-400"
                onClick={() => {
                  const existingProfile = profiles.find(p => p.name === newProfileName.trim());
                  if (existingProfile) {
                    setIsCreateDialogOpen(false);
                    setIsOverwriteDialogOpen(true);
                  } else {
                    handleCreateProfile();
                  }
                }}
              >
                Create
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Import Dialog */}
      <Dialog
        open={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 dark:bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-zinc-100 dark:bg-zinc-800 p-6">
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
                className="inline-flex justify-center rounded-xl border border-transparent bg-zinc-600 dark:bg-zinc-500 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:hover:bg-zinc-400"
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
        <div className="fixed inset-0 bg-black/30 dark:bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-xl bg-zinc-100 dark:bg-zinc-800 p-6">
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
                className="mt-1 block w-full rounded-full bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-500 sm:text-sm px-4 py-2.5 min-w-[300px]"
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
                className="inline-flex justify-center rounded-xl border border-transparent bg-zinc-600 dark:bg-zinc-500 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:hover:bg-zinc-400"
                onClick={handleRenameProfile}
              >
                Rename
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 dark:bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-zinc-100 dark:bg-zinc-800 p-6">
            <Dialog.Title className="text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-100">
              Delete Profile
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Are you sure you want to delete this profile? This action cannot be undone.
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
                className="inline-flex justify-center rounded-xl border border-transparent bg-zinc-600 dark:bg-zinc-500 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:hover:bg-zinc-400"
                onClick={handleDeleteProfile}
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Overwrite Confirmation Dialog */}
      <Transition.Root show={isOverwriteDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            console.debug('[ProfileManager] Closing overwrite dialog');
            setIsOverwriteDialogOpen(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 dark:bg-black/30" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-zinc-100 dark:bg-zinc-800 p-6">
                <Dialog.Title className="text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-100">
                  Overwrite Profile
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    A profile with the same name already exists. Do you want to overwrite it?
                  </p>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-xl border border-transparent bg-zinc-100 dark:bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                    onClick={() => {
                      console.debug('[ProfileManager] Cancel overwrite');
                      setIsOverwriteDialogOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-xl border border-transparent bg-zinc-600 dark:bg-zinc-500 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:hover:bg-zinc-400"
                    onClick={() => {
                      console.debug('[ProfileManager] Confirm overwrite');
                      handleOverwriteProfile();
                    }}
                  >
                    Overwrite
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};
