import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { System } from '../models/system';
import { SystemMember } from '../models/member';

// Define storage directory
const STORAGE_DIR = join(process.cwd(), 'data');
const SYSTEM_FILE = join(STORAGE_DIR, 'system.json');

// Create the storage directory if it doesn't exist
if (!existsSync(STORAGE_DIR)) {
  mkdirSync(STORAGE_DIR, { recursive: true });
}

// Interface for serializing the system
interface SerializedSystem {
  id: string;
  name: string;
  description?: string;
  tag?: string;
  avatar?: string;
  created: string;
  members: SystemMember[];
  ownerId: string;
}

/**
 * Save the system to a JSON file
 * @param system System to save
 */
export function saveSystem(system: System): void {
  try {
    if (!system) return;
    
    // Convert Map to array for serialization
    const serializedSystem: SerializedSystem = {
      ...system,
      created: system.created.toISOString(),
      members: Array.from(system.members.values())
    };
    
    writeFileSync(SYSTEM_FILE, JSON.stringify(serializedSystem, null, 2));
    console.log('System saved to file');
  } catch (error) {
    console.error('Error saving system:', error);
  }
}

/**
 * Load the system from a JSON file
 * @param ownerId Discord user ID of the system owner
 * @returns Loaded system or null if not found
 */
export function loadSystem(ownerId: string): System | null {
  try {
    if (!existsSync(SYSTEM_FILE)) {
      console.log('No system file found');
      return null;
    }
    
    const data = readFileSync(SYSTEM_FILE, 'utf8');
    const serializedSystem: SerializedSystem = JSON.parse(data);
    
    // Verify that the system belongs to the correct user
    if (serializedSystem.ownerId !== ownerId) {
      console.error('System belongs to a different user');
      return null;
    }
    
    // Convert array back to Map
    const members = new Map<string, SystemMember>();
    serializedSystem.members.forEach(member => {
      member.created = new Date(member.created);
      members.set(member.id, member);
    });
    
    const system: System = {
      ...serializedSystem,
      created: new Date(serializedSystem.created),
      members
    };
    
    console.log(`Loaded system "${system.name}" with ${system.members.size} members`);
    return system;
  } catch (error) {
    console.error('Error loading system:', error);
    return null;
  }
}