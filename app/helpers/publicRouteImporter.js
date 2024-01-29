// routeImporter.js
import express from 'express';
import readDirectory from './readdir.js';
import {
  ROUTE_PATH_PUBLIC
} from '../config/route.js';

const router = express.Router();

/**
 * Import and configure public routes.
 *
 * This function reads the list of routes from the public directory, imports them, and configures
 * them for use as public routes.
 */
const publicRoutes = async () => {
  const routesName = await readDirectory(ROUTE_PATH_PUBLIC);
  //console.log(routesName);
  await importRoutes(routesName, 'public');
};

/**
 * Import and configure routes based on their type : public.
 *
 * This function imports route modules dynamically and configures them for use as public routes based on the specified type.
 * 
 *
 * @param {Array<string>} routes - An array of route names to import and configure.
 * @param {string} type - The type of routes ('public').
 */

const importRoutes = async (routes, type) => {
  //console.log('routes', routes);
  for (const route of routes) {
    const routeModule = await import(`../routes/${type}/${route}.js`);
    if(type=='private')
    {
      //apply auth middleware
      //router.use(`/${route}`, authMiddleware, routeModule.default);
    }
    else
    {
      //this is public routes
      router.use(`/${route}`, routeModule.default);
    }
  }
};

export {
  router,
  publicRoutes
};