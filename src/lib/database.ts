import Dexie, { Table } from 'dexie';

export interface AnimalRecord {
  id?: number;
  imageUrl: string;
  breed: string;
  species: string;
  confidence: number;
  measurements: {
    bodyLength: number;
    heightAtWithers: number;
    chestWidth: number;
  };
  detectedAt: Date;
  synced: boolean;
  farmerId?: string;
}

export class LivestockDatabase extends Dexie {
  animals!: Table<AnimalRecord>;

  constructor() {
    super('LivestockDB');
    this.version(1).stores({
      animals: '++id, breed, species, detectedAt, synced'
    });
  }
}

export const db = new LivestockDatabase();