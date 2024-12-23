import fs from 'node:fs';
import path from 'node:path';
import { Router } from 'express';

const router = Router();

const routesFileName = 'routes.ts';

function registerRoutes(currentDir = __dirname) {
  const files = fs.readdirSync(currentDir);

  for (const name of files) {
    const fullPath = path.join(currentDir, name);

    if (fs.statSync(fullPath).isDirectory()) {
      const routesFilePath = path.join(fullPath, routesFileName);

      if (fs.existsSync(routesFilePath)) {
        const prefix = path
          .relative(__dirname, path.dirname(routesFilePath))
          .replace(/\\/g, '/'); // Normalize slashes for Windows

        console.log(`Registering route: ${prefix} -> ${routesFilePath}`);
        router.use(`/${prefix}`, require(routesFilePath).default);
      }

      // Recursively register subdirectories
      registerRoutes(fullPath);
    }
  }
}

registerRoutes();

export default router;
