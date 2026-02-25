// --- Input Interfaces (plain objects, no Mongoose dependency) ---

export interface FacilityPccImportInput {
  fac_id: number;
  name: string;
  regionId: number;
}

export interface FacilitySettingsInput {
  facilityId: number;
  displayName: string;
  ehrNames: Record<string, string>;
  ownerActive: boolean;
  referralActive: boolean;
  reportsActive: boolean;
  assistedLiving: boolean;
  regionId: number;
}

// --- Output Interface ---

export interface FacilityEntry {
  id: number;
  displayName: string;
  pccName: string;
  regionId: number;
  ehrNames: Record<string, string>;
  ownerActive: boolean;
  referralActive: boolean;
  reportsActive: boolean;
  assistedLiving: boolean;
}

// --- FacilityRegistry Class ---

export class FacilityRegistry {
  private facilitiesById: Map<number, FacilityEntry> = new Map();
  private pccNameIndex: Map<string, FacilityEntry> = new Map(); // pccName → entry
  private ehrReverseIndex: Map<string, Map<string, FacilityEntry>> = new Map(); // ehrType → (ehrName → entry)
  private ehrTypes: string[] = [];

  constructor(
    pccImports: FacilityPccImportInput[],
    facilitySettings: FacilitySettingsInput[]
  ) {
    const pccByFacId = new Map<number, FacilityPccImportInput>();
    for (const pcc of pccImports) {
      pccByFacId.set(pcc.fac_id, pcc);
    }

    const ehrTypesSet = new Set<string>();

    for (const settings of facilitySettings) {
      const pcc = pccByFacId.get(settings.facilityId);

      const entry: FacilityEntry = {
        id: settings.facilityId,
        displayName: settings.displayName || pcc?.name || '',
        pccName: pcc?.name || '',
        regionId: settings.regionId,
        ehrNames: settings.ehrNames || {},
        ownerActive: settings.ownerActive,
        referralActive: settings.referralActive,
        reportsActive: settings.reportsActive,
        assistedLiving: settings.assistedLiving,
      };

      this.facilitiesById.set(entry.id, entry);
      if (entry.pccName) {
        this.pccNameIndex.set(entry.pccName, entry);
      }

      // Build reverse EHR index and collect EHR types
      for (const [ehrType, ehrName] of Object.entries(entry.ehrNames)) {
        ehrTypesSet.add(ehrType);
        if (!this.ehrReverseIndex.has(ehrType)) {
          this.ehrReverseIndex.set(ehrType, new Map());
        }
        this.ehrReverseIndex.get(ehrType)!.set(ehrName, entry);
      }
    }

    this.ehrTypes = Array.from(ehrTypesSet);
  }

  getById(facilityId: number): FacilityEntry | undefined {
    return this.facilitiesById.get(facilityId);
  }

  // --- Core ID-Based Methods ---

  getDisplayName(facilityId: number): string {
    return this.facilitiesById.get(facilityId)?.displayName || '';
  }

  getPccName(facilityId: number): string {
    return this.facilitiesById.get(facilityId)?.pccName || '';
  }

  exists(facilityId: number): boolean {
    return this.facilitiesById.has(facilityId);
  }

  getAllIds(): number[] {
    return Array.from(this.facilitiesById.keys());
  }

  getAccessible(userFacilityIds: number[] | 'all', includeArchived = false): FacilityEntry[] {
    const all = Array.from(this.facilitiesById.values());
    const filtered = includeArchived ? all : all.filter(f => f.ownerActive);

    if (userFacilityIds === 'all') {
      return filtered;
    }

    const allowedSet = new Set(userFacilityIds);
    return filtered.filter(f => allowedSet.has(f.id));
  }

  // --- EHR Integration Methods (for external systems) ---

  getEhrTypes(): string[] {
    return this.ehrTypes;
  }

  findByPccName(pccName: string): FacilityEntry | undefined {
    return this.pccNameIndex.get(pccName);
  }

  findByEhrName(ehrType: string, ehrName: string): FacilityEntry | undefined {
    return this.ehrReverseIndex.get(ehrType)?.get(ehrName);
  }

  getSiteName(ehrType: string, ehrName: string): string {
    // Convert EHR-specific facility name to canonical PCC name
    const entry = this.findByEhrName(ehrType, ehrName);
    return entry?.pccName || ehrName;
  }

}
