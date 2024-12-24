import fs from 'node:fs';
import path from 'node:path';
import { Router } from 'express';

const router = Router();
const routesFileName = 'routes.ts';

async function registerRoutes(currentDir = __dirname) {
  // Read all files and directories in the current directory
  const files = fs.readdirSync(currentDir);

  for (const name of files) {
    const fullPath = path.join(currentDir, name);
    console.log(`Checking: ${fullPath}`);  // Log the current path being checked

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // If it is a directory, check if it contains a routes.ts file
      const routesFilePath = path.join(fullPath, routesFileName);

      if (fs.existsSync(routesFilePath)) {
        // If routes.ts exists in the directory, register it
        const prefix = path
          .relative(__dirname, path.dirname(routesFilePath))
          .replace(/\\/g, '/'); // Normalize slashes for Windows

        console.log(`Registering route: ${prefix} -> ${routesFilePath}`);
        
        try {
          // Dynamically import the routes file
          const routeModule = await import(routesFilePath);
          router.use(`/${prefix}`, routeModule.default);
        } catch (error) {
          console.error(`Error importing routes from ${routesFilePath}:`, error);
        }
      }

      // Recursively register subdirectories
      await registerRoutes(fullPath);
    } else {
      // Log files that are not directories (if needed)
      console.log(`Skipping file: ${fullPath}`);
    }
  }
}

// Call registerRoutes inside an async wrapper to ensure it's executed correctly
(async () => {
  await registerRoutes();
})();

export default router;
