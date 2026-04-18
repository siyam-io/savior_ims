// Import Node.js modules using ES Module syntax
import fs from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';

// --- Constants and Configuration ---
const IGNORE_DIRS = [
    'node_modules', 
    '.git', 
    'dist', 
    'build', 
    '.expo', 
    '.next', 
    'coverage', 
    '.turbo', 
    '.vercel', 
    '.idea', 
    '.vscode', 
    'out', 
    'public/assets' // Optional: ignore if you have large static assets
];

const OUTPUT_FILE = path.join('output', 'combined_project_code.txt'); 

const IGNORE_FILES = [
    '.env', 
    '.env.local', 
    '.env.development', 
    '.env.production', 
    'package-lock.json', 
    'yarn.lock', 
    'pnpm-lock.yaml', 
    '.DS_Store', 
    'thumbs.db',
    'tsconfig.tsbuildinfo',
    'tsconfig.json',
    OUTPUT_FILE
];

const IGNORE_EXTENSIONS = [
    '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', 
    '.mp4', '.mov', '.avi', '.mp3', '.wav', 
    '.pdf', '.zip', '.tar', '.gz', 
    '.woff', '.woff2', '.ttf', '.eot'
];

/**
 * Recursively reads directory contents and combines them into a single output file.
 */
export function combineProjectFiles(targetDir = process.cwd(), outputFile = OUTPUT_FILE) {
    try {
        fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    } catch (e) {
        console.error("Error creating output directory:", e.message);
        return;
    }

    const stream = createWriteStream(outputFile, { flags: 'w' });

    const traverseDirectory = (currentPath) => {
        try {
            const items = fs.readdirSync(currentPath);

            for (const item of items) {
                const fullPath = path.join(currentPath, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    if (!IGNORE_DIRS.includes(item)) {
                        traverseDirectory(fullPath); 
                    }
                } else {
                    const ext = path.extname(item).toLowerCase();
                    
                    if (!IGNORE_FILES.includes(item) && !IGNORE_EXTENSIONS.includes(ext)) {
                        const relativePath = path.relative(targetDir, fullPath);
                        
                        stream.write("\n\n/*******************************************************\n");
                        stream.write(` * FILE: ${relativePath}\n`);
                        stream.write(" *******************************************************/\n\n");

                        try {
                            const content = fs.readFileSync(fullPath, 'utf-8');
                            stream.write(content);
                        } catch (err) {
                            stream.write(`\n// [ERROR] Failed to read file: ${err.message}\n`);
                        }
                    }
                }
            }
        } catch (readErr) {
            console.error(`[WARNING] Could not process directory ${currentPath}: ${readErr.message}`);
        }
    };

    console.log('⏳ Extraction started...');
    traverseDirectory(targetDir);
    
    stream.end();
    
    stream.on('finish', () => {
        console.log(`\n✅ Extraction complete. Code saved to '${outputFile}'.`);
    });
}

if (process.argv[1] && (process.argv[1].endsWith('extract.js') || process.argv[1].endsWith('extract.ts'))) {
    combineProjectFiles();
}