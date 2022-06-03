import express, {Router} from 'express';
import {Routes} from '../constant';
import * as cManifest from './manifest';
import * as cBindings from './bindings';
import * as cHelp from './help';
import * as cAdd from './add';
import * as cInstall from './install';
import * as cConfigure from './configure';
import * as cLogin from './login';
import * as cSubscription from './subscription';
import * as cWebhook from './webhook';

const router: Router = express.Router();

router.get(Routes.App.ManifestPath, cManifest.getManifest);
router.post(Routes.App.BindingsPath, cBindings.getBindings);
router.post(Routes.App.InstallPath, cInstall.getInstall);

router.post(`${Routes.App.BindingPathHelp}`, cHelp.getHelp);
router.post(`${Routes.App.BindingPathAdd}`, cAdd.getAdd);
router.post(`${Routes.App.BindingPathNew}`, cAdd.getAdd);

router.post(`${Routes.App.AddFormStepOnePath}`, cAdd.formStepOne)
router.post(`${Routes.App.AddFormStepTwoPath}`, cAdd.formStepTwo)
router.post(`${Routes.App.Forms}${Routes.App.BindingPathCreateCard}`, cAdd.getAdd);
router.post(`${Routes.App.Forms}${Routes.App.BindingPathCreateCard}${Routes.App.Submit}`, cAdd.formStepTwo);
router.post(`${Routes.App.Forms}${Routes.App.BindingPathCreateCard}${Routes.App.Form}`, cAdd.formStepOne);
router.post(`${Routes.App.BindingPathLogin}`, cLogin.getLogin);
router.post(`${Routes.App.BindingPathLogin}${Routes.App.Submit}`, cLogin.saveToken)

router.post(`${Routes.App.CallPathConfigOpenForm}`, cConfigure.openTrelloConfigForm);
router.post(`${Routes.App.CallPathConfigSubmitOrUpdateForm}`, cConfigure.submitTrelloConfig);


// SUBCRIPTIONS
router.post(`${Routes.App.CallSubscriptionAdd}`, cSubscription.addWebhookSubscription);
router.post(`${Routes.App.CallSubscriptionList}`, cSubscription.getWebhookSubscriptions);
router.post(`${Routes.App.CallSubscriptionRemove}`, cSubscription.removeWebhookSubscription);
router.post(`${Routes.App.CallSubscriptionListAppOpts}`, cSubscription.getkSubscriptionsAppOpts);

// TRELLO -> MATTERMOST WEBHOOK
router.post(`${Routes.App.CallReceiveNotification}/context:context/secret:whSecret/model:idModel`, cWebhook.createWebohookNotification); // TEST
router.get(`${Routes.App.CallReceiveNotification}/context:context/secret:whSecret/model:idModel`, cWebhook.createWebohookNotification);

router.post(`${Routes.App.CallPathIncomingWebhookPath}`, cWebhook.incomingWebhook);

const staticRouter = express.Router();
staticRouter.use(express.static('static'));
router.use('/static', staticRouter);

export default router;
