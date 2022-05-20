import express, {Router} from 'express';
import {Routes} from '../constant';
import * as cManifest from './manifest';
import * as cBindings from './bindings';
import * as cHelp from './help';
import * as cAdd from './add';

const router: Router = express.Router();

router.get(Routes.App.ManifestPath, cManifest.getManifest);
router.post(Routes.App.BindingsPath, cBindings.getBindings);

router.post(`${Routes.App.BindingPathHelp}`, cHelp.getHelp);
router.post(`${Routes.App.BindingPathAdd}`, cAdd.getAdd);
router.post(`${Routes.App.BindingPathNew}`, cAdd.getAdd);
router.post('/board_select', cAdd.boardListSelect)
router.post('/list_select', cAdd.listSelect)

router.post('/', (req, res) => {
  console.log(req)
  res.json('test')
})

const staticRouter = express.Router();
staticRouter.use(express.static('static'));
router.use('/static', staticRouter);

export default router;
