import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * This script automatically generates and maintains the "exports" and "typesVersions"
 * fields in package.json based on the structure of the 'src' directory.
 *
 * It scans for subdirectories of 'src' that contain an index.ts file and constructs appropriate
 * export paths to ensure correct distribution and type definitions for consumers of the package.
 * 
 * Run this file to keep package.json in sync with your current module surface area.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const PACKAGE_JSON_PATH = path.join(ROOT_DIR, 'package.json');

// Directories to exclude from exports (internal only)
const EXCLUDED_DIRS = ['test'];

/**
 * Recursively finds all directories containing an index.ts file
 * @param {string} dir - Directory to scan
 * @param {string} prefix - Current path prefix relative to src
 * @returns {string[]} - Array of export paths
 */
function findExportPaths(dir, prefix = '') {
  const exportPaths = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      
      // Skip excluded directories
      if (EXCLUDED_DIRS.includes(entry.name)) continue;
      
      const subPath = path.join(dir, entry.name);
      const indexPath = path.join(subPath, 'index.ts');
      const exportPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      
      // If this directory has an index.ts, add it as an export path
      if (fs.existsSync(indexPath)) {
        exportPaths.push(exportPath);
      }
      
      // Recursively scan subdirectories
      const nestedPaths = findExportPaths(subPath, exportPath);
      exportPaths.push(...nestedPaths);
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }
  
  return exportPaths;
}

/**
 * Generates the exports and typesVersions fields for package.json
 * @param {string[]} exportPaths - Array of export paths
 * @returns {{ exports: object, typesVersions: object }}
 */
function generateExportsConfig(exportPaths) {
  const exports = {
    '.': {
      types: './dist/index.d.ts',
      default: './dist/index.js'
    }
  };
  
  const typesVersions = {
    '*': {}
  };
  
  for (const exportPath of exportPaths) {
    exports[`./${exportPath}`] = {
      types: `./dist/${exportPath}/index.d.ts`,
      default: `./dist/${exportPath}/index.js`
    };
    
    typesVersions['*'][exportPath] = [`./dist/${exportPath}/index.d.ts`];
  }
  
  return { exports, typesVersions };
}

/**
 * Main function to generate and update package.json exports
 */
function main() {
  console.log('Scanning for export paths...');
  
  const exportPaths = findExportPaths(SRC_DIR);
  console.log(`Found ${exportPaths.length} export paths:`);
  exportPaths.forEach(p => console.log(`  - ${p}`));
  
  const { exports, typesVersions } = generateExportsConfig(exportPaths);
  
  // Read current package.json
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
  
  // Update exports and typesVersions
  pkg.exports = exports;
  pkg.typesVersions = typesVersions;
  
  // Write updated package.json
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(pkg, null, 2) + '\n');
  
  console.log('Successfully updated package.json exports!');
}

main();
