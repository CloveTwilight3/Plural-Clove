// System member model represents an individual identity within a plural system
export interface SystemMember {
  id: string;           // Unique identifier for the member
  name: string;         // Display name
  displayName?: string; // Optional alternative display name
  pronouns?: string;    // Optional pronouns
  avatar?: string;      // Optional avatar URL
  color?: string;       // Optional color (hex code)
  description?: string; // Optional description/bio
  birthdate?: string;   // Optional birthdate
  created: Date;        // When this member was created
  prefix?: string;      // Optional message prefix for auto-proxying
  suffix?: string;      // Optional message suffix for auto-proxying
}

export type SystemMemberCreate = Omit<SystemMember, 'id' | 'created'>;