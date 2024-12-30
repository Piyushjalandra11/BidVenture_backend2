import fs from 'node:fs';
import path from 'node:path';
import { Router } from 'express';

const router = Router();
const routesFileName = 'routes.ts';

async function registerRoutes(currentDir = __dirname) {
  const files = fs.readdirSync(currentDir);

  for (const name of files) {
    const fullPath = path.join(currentDir, name);
    // console.log(`Checking: ${fullPath}`);

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const routesFilePath = path.join(fullPath, routesFileName);

      if (fs.existsSync(routesFilePath)) {
        const prefix = path
          .relative(__dirname, path.dirname(routesFilePath))
          .replace(/\\/g, '/');

        console.log(`Registering route: ${prefix} -> ${routesFilePath}`);

        try {
          const routeModule = await import(routesFilePath);
          router.use(`/${prefix}`, routeModule.default);
        } catch (error) {
          console.error(`Error importing routes from ${routesFilePath}:`, error);
        }
      }

      await registerRoutes(fullPath);
    } else {
      // console.log(`Skipping file: ${fullPath}`);
    }
  }
}


(async () => {
  await registerRoutes();
})();

export default router;
