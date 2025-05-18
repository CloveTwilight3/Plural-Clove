import { SystemMember } from './member';
import { saveSystem as saveToFile, loadSystem as loadFromFile } from '../utils/storage';

// System model represents the entire plural system
export interface System {
  id: string;           // Unique identifier for the system
  name: string;         // System name
  description?: string; // Optional system description
  tag?: string;         // Optional system tag (appended to member display names)
  avatar?: string;      // Optional system avatar URL
  created: Date;        // When this system was created
  members: Map<string, SystemMember>; // Map of system members
  ownerId: string;      // Discord user ID of the system owner
}

export type SystemCreate = Omit<System, 'id' | 'created' | 'members'>;

// In-memory storage for the system
let system: System | null = null;

// System storage functions
export function getSystem(): System | null {
  return system;
}

export function createSystem(data: SystemCreate): System {
  system = {
    ...data,
    id: generateId(),
    created: new Date(),
    members: new Map<string, SystemMember>()
  };
  
  // Save the new system to file
  saveSystem();
  
  return system;
}

export function addMember(member: SystemMember): void {
  if (!system) throw new Error('No system exists');
  system.members.set(member.id, member);
}

export function getMember(id: string): SystemMember | undefined {
  if (!system) return undefined;
  return system.members.get(id);
}

export function updateMember(id: string, data: Partial<SystemMember>): SystemMember | null {
  if (!system) return null;
  const member = system.members.get(id);
  if (!member) return null;
  
  const updatedMember = { ...member, ...data };
  system.members.set(id, updatedMember);
  
  // Save the system after updating a member
  saveSystem();
  
  return updatedMember;
}

export function deleteMember(id: string): boolean {
  if (!system) return false;
  const deleted = system.members.delete(id);
  
  if (deleted) {
    // Save the system after deleting a member
    saveSystem();
  }
  
  return deleted;
}

export function getAllMembers(): SystemMember[] {
  if (!system) return [];
  return Array.from(system.members.values());
}

// Helper function to generate a random ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Save the system to file
export function saveSystem(): void {
  if (!system) return;
  saveToFile(system);
}

// Load the system from file
export function loadSystem(ownerId: string): System | null {
  system = loadFromFile(ownerId);
  return system;
}