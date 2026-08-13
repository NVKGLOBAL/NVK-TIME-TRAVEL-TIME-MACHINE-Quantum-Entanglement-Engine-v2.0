

import Dexie, { type Table } from 'dexie';
// FIX: import all required types
import type { IDriftInterpretationDB, IGlyphHistory, IRitualFrame, DriftCommentary } from './types';

// Define the database
export class CodexDriftDB extends Dexie {
  interpretations!: Table<IDriftInterpretationDB, number>; // number is for auto-incrementing primary key
  glyphs!: Table<IGlyphHistory, string>; // string is for glyph Id (GlyphMutationNode.id) primary key
  rituals!: Table<IRitualFrame, string>; // string is for ritual id primary key
  driftCommentaries!: Table<DriftCommentary, number>; // Added table for commentaries

  constructor() {
    super('CodexDriftDatabase');
    // FIX: Removed version 1 definition and combined into version 2 to correctly set up the schema with driftCommentaries.
    (this as Dexie).version(2).stores({
      interpretations: '++id, glyphId, glyphSymbol, timestamp, entropy, driftScore, ritualContext, version', 
      glyphs: '&id, symbol, lastInterpreted, driftVolatility', // 'id' is primary key (GlyphMutationNode.id)
      rituals: '&id, timestamp, entropyLevel',
      driftCommentaries: '++id, linkedDriftId, agent, timestamp', // New table schema
    }).upgrade(tx => {
      // Migration logic (if any) from version 1 to 2 would go here.
      // Since version 1 didn't have driftCommentaries, no data migration is needed for this specific table.
      console.log("Upgrading database to version 2: Added driftCommentaries table.");
    });
    // Dexie automatically opens the database when it's instantiated and versioned.
    // An explicit .open() call here can sometimes cause issues if not handled carefully,
    // especially with hot reloading or multiple instantiations.
    // Let's rely on Dexie's default behavior.
    // If connection issues arise, we might need to re-add and manage the .open() call more explicitly.
    (this as Dexie).open().catch(err => {
        console.error(`Failed to open Dexie database: ${err}`);
    });
  }
  
  async logDrift(interpretation: IDriftInterpretationDB): Promise<number | undefined> {
    if (!interpretation.glyphId || !interpretation.glyphSymbol) {
        console.error("logDrift: glyphId and glyphSymbol are required.", interpretation);
        return undefined;
    }
    try {
      return await (this as Dexie).transaction('rw', this.interpretations, this.glyphs, async () => {
        const interpretationId = await this.interpretations.add(interpretation as any); // Cast to any to handle Dexie's Addon types
        
        let glyph = await this.glyphs.get(interpretation.glyphId);
        if (!glyph) {
          glyph = {
            id: interpretation.glyphId,
            symbol: interpretation.glyphSymbol,
            entropyHistory: [interpretation.entropy],
            lastInterpreted: new Date(),
            driftVolatility: 0
          };
          await this.glyphs.add(glyph);
        } else {
          const newHistory = [...glyph.entropyHistory, interpretation.entropy].slice(-50); // Keep last 50
          const driftScores = await this.interpretations
            .where('glyphId').equals(interpretation.glyphId)
            .limit(50) // Consider recent scores for volatility
            .toArray()
            .then(items => items.map(i => i.driftScore));
            
          await this.glyphs.update(glyph.id, {
            entropyHistory: newHistory,
            lastInterpreted: new Date(),
            driftVolatility: this.calculateStdDev(driftScores)
          });
        }
        return interpretationId;
      });
    } catch (error) {
        console.error("Error in logDrift transaction:", error, "Interpretation:", interpretation);
        return undefined;
    }
  }
  
  private calculateStdDev(values: number[]): number {
    if (values.length < 2) return 0;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(
      values.map(v => Math.pow(v - avg, 2)).reduce((a, b) => a + b, 0) / values.length
    );
  }

  async getGlyphHistory(glyphNodeId: string): Promise<IDriftInterpretationDB[]> {
    return this.interpretations
      .where('glyphId')
      .equals(glyphNodeId)
      .sortBy('timestamp');
  }

  // Method to add drift commentary
  async addDriftCommentary(commentary: Omit<DriftCommentary, 'id'>): Promise<number> {
    return this.driftCommentaries.add(commentary as DriftCommentary);
  }

  // Method to get commentaries for a drift interpretation
  async getCommentariesForDrift(driftId: number): Promise<DriftCommentary[]> {
    return this.driftCommentaries.where('linkedDriftId').equals(driftId).sortBy('timestamp');
  }
}

// Create a singleton instance of the database
export const driftDB = new CodexDriftDB();
// The explicit open call was here. Dexie's constructor and versioning methods typically handle opening.
// If the database doesn't open correctly or if there are issues with it being ready,
// an explicit `driftDB.open().catch(...)` might be needed here, but it's generally
// preferred to let Dexie manage this as part of its initialization.
// The constructor now includes this.open()