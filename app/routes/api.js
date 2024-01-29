import { 
  router,
  privateRoutes
} from '../helpers/routeImporter.js';

//await privateRoutes();

(async () => {
  await privateRoutes();
})();

export default router;