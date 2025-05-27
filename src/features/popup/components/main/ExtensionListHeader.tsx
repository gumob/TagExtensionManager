import { DefaultBackgroundButton } from '@/components';
import { useExtensionContext } from '@/contexts';
import { ExtensionModel, TagModel } from '@/models';

/**
 * The props for the ExtensionListHeader component.
 *
 * @param tag - The tag to display.
 * @param extensions - The extensions to display.
 * @param extensionCount - The number of extensions.
 */
interface ExtensionListHeaderProps {
  tag: TagModel;
  extensions: ExtensionModel[];
}

/**
 * The ExtensionListHeader component.
 *
 * @param tag - The tag to display.
 * @param extensions - The extensions to display.
 * @returns The ExtensionListHeader component.
 */
export const ExtensionListHeader: React.FC<ExtensionListHeaderProps> = ({
  tag,
  extensions,
  // onToggle,
}: ExtensionListHeaderProps) => {
  /**
   * The use extension context.
   */
  const { toggleEnabled } = useExtensionContext();

  /**
   * The handle toggle.
   */
  const handleToggle = (enabled: boolean) => {
    /** Filter the unlocked extensions */
    const unlockedExtensions = extensions.filter(ext => !ext.locked);

    /** Toggle the extensions */
    unlockedExtensions.forEach(async ext => toggleEnabled(ext.id, enabled));
  };

  /**
   * The ExtensionListHeader component.
   *
   * @returns The ExtensionListHeader component.
   */
  return (
    <div className="flex items-center justify-between p-1">
      <div className="flex items-center gap-2">
        <h3 className="text-xs font-semibold">{tag.name}</h3>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex">
          <DefaultBackgroundButton
            onClick={() => handleToggle(true)}
            className={`ps-3 pe-2 py-1 text-2xs font-medium rounded-l-full mr-[1px]`}
          >
            Enable All
          </DefaultBackgroundButton>
          <DefaultBackgroundButton
            onClick={() => handleToggle(false)}
            className={`ps-2 pe-3 py-1 text-2xs font-medium rounded-r-full`}
          >
            Disable All
          </DefaultBackgroundButton>
        </div>
      </div>
    </div>
  );
};
