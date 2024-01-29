// routeImporter.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import readDirectory from './readdir.js';
import {
  ROUTE_PATH_PRIVATE
} from '../config/route.js';

const router = express.Router();

/**
 * Import and configure routes based on their type (private or public).
 *
 * This function imports route modules dynamically and configures them for use as either private
 * or public routes based on the specified type. For private routes, it applies an authentication
 * middleware.
 *
 * @param {Array<string>} routes - An array of route names to import and configure.
 * @param {string} type - The type of routes ('private' or 'public').
 */

const importRoutes = async (routes, type) => {
  //console.log('routes', routes);
  for (const route of routes) {
    const routeModule = await import(`../routes/${type}/${route}.js`);
    if(type=='private')
    {
      //apply auth middleware
      router.use(`/${route}`, authMiddleware, routeModule.default);
    }
    else
    {
      //this is public routes
      //router.use(`/${route}`, routeModule.default);
    }
  }
};

/**
 * Import and configure private routes.
 *
 * This function reads the list of routes from the private directory, imports them, and configures
 * them for use as private routes by applying an authentication middleware.
 */
const privateRoutes = async () => {
  const routesName = await readDirectory(ROUTE_PATH_PRIVATE);
  //console.log(routesName);
  await importRoutes(routesName, 'private');
};

export {
  router,
  privateRoutes
};