/**
 * The profile type.
 *
 * @property id - The id of the profile.
 * @property name - The name of the profile.
 * @property extensions - The extensions of the profile.
 * @property createdAt - The created at date of the profile.
 * @property updatedAt - The updated at date of the profile.
 */
export interface Profile {
  id: string;
  name: string;
  extensions: {
    id: string;
    enabled: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

/**
 * The profile state type.
 *
 * @property profiles - The profiles.
 */
export interface ProfileState {
  profiles: Profile[];
}
