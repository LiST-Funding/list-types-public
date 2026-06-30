# list-types-public

Shared TypeScript library for the SNF AI healthcare workflow management system.

Used by the backend (Node.js/Express) and frontend (Angular) to share consistent type definitions, utility functions, and domain logic across services.

## What's included

- **Facility Registry** — Multi-indexed data structure for facility lookups by ID, PCC name, and EHR system
- **Patient & User models** — Core domain types for patients, users, and roles
- **EHR integration types** — Enums and interfaces for AllScripts, Epic, Navi, and other EHR systems
- **List status management** — Status parsing and mapping across EHR systems
- **Excel / CSV / PDF utilities** — File processing helpers for data import/export
- **PCC integration types** — Types for PointClickCare API integration
- **Task scheduling types** — Shared job/task definitions

## Facility Registry — usage example

```typescript
import { RegionFacilityRegistry } from 'list-types-public';

const registry = new RegionFacilityRegistry(pccImports, facilitySettings, regionId);

// Look up by facility ID
const displayName = registry.getDisplayName(12);      // "Sunrise Care Center"
const pccName = registry.getPccName(12);              // "Sunrise_PCC"

// Look up by EHR system name
const facility = registry.findByEhrName('Epic', 'Epic Atlanta');
const facilityId = registry.getSiteId('Epic Atlanta', 'Epic');

// Look up by PCC name
const entry = registry.findByPccName('Atlanta Care');

// Get user-accessible facilities
const accessible = registry.getAccessible(userFacilityIds); // FacilityEntry[]
```
