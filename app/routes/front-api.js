import { 
  router,
  publicRoutes 
} from '../helpers/publicRouteImporter.js';

(async () => {
  await publicRoutes();
})();

export default router;