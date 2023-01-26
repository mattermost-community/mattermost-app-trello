import express, { Router } from 'express';

import { getRoutes } from 'src/utils/router';

import * as cManifest from './manifest';
import * as cBindings from './bindings';
import * as cHelp from './help';
import * as cAdd from './add';
import * as cInstall from './install';
import * as cConfigure from './configure';
import * as cConnect from './connect';
import * as cSubscription from './subscription';
import * as cWebhook from './webhook';

const router: Router = express.Router();
const routes = getRoutes();

router.get(routes.manifest, cManifest.getManifest);
router.post(routes.bindings, cBindings.getBindings);
router.post(routes.install, cInstall.getInstall);

router.post(routes.help, cHelp.getHelp);

router.post(routes.add, cAdd.getAdd);
router.post(routes.formStepTwo, cAdd.formStepTwo);
router.post(routes.formStepOne, cAdd.formStepOne);

router.post(routes.getConnect, cConnect.getConnect);
router.post(routes.saveToken, cConnect.saveToken);
router.post(routes.getDisconnect, cConnect.getDisconnect);

router.post(routes.openTrelloConfigForm, cConfigure.openTrelloConfigForm);
router.post(routes.submitTrelloConfig, cConfigure.submitTrelloConfig);

router.post(routes.addWebhookSubscription, cSubscription.addWebhookSubscription);
router.post(routes.getWebhookSubscriptions, cSubscription.getWebhookSubscriptions);
router.post(routes.removeWebhookSubscription, cSubscription.removeWebhookSubscription);

router.post(routes.incomingWebhook, cWebhook.incomingWebhook);

const staticRouter = express.Router();
staticRouter.use(express.static('static'));
router.use('/static', staticRouter);

export default router;
