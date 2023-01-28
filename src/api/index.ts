import express, { Router } from 'express';

import { getRoutes } from '../utils/router';

import { requireSystemAdmin, requireUserOAuthConnected } from '../restapi/middleware';

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

router.post(routes.add, requireUserOAuthConnected, cAdd.getAdd);
router.post(routes.formStepTwo, requireUserOAuthConnected, cAdd.formStepTwo);
router.post(routes.formStepOne, requireUserOAuthConnected, cAdd.formStepOne);

router.post(routes.getConnect, requireUserOAuthConnected, cConnect.getConnect);
router.post(routes.saveToken, requireUserOAuthConnected, cConnect.saveToken);
router.post(routes.getDisconnect, requireUserOAuthConnected, cConnect.getDisconnect);

router.post(routes.openTrelloConfigForm, requireSystemAdmin, cConfigure.openTrelloConfigForm);
router.post(routes.submitTrelloConfig, requireSystemAdmin, cConfigure.submitTrelloConfig);

router.post(routes.addWebhookSubscription, requireUserOAuthConnected, cSubscription.addWebhookSubscription);
router.post(routes.getWebhookSubscriptions, requireUserOAuthConnected, cSubscription.getWebhookSubscriptions);
router.post(routes.removeWebhookSubscription, requireUserOAuthConnected, cSubscription.removeWebhookSubscription);

router.post(routes.incomingWebhook, cWebhook.incomingWebhook);

const staticRouter = express.Router();
staticRouter.use(express.static('static'));
router.use('/static', staticRouter);

export default router;
