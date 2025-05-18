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

export interface ProfileState {
  profiles: Profile[];
  currentProfileId: string | null;
}
