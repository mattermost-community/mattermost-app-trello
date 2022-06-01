import express, {Router} from 'express';
import {Routes} from '../constant';
import * as cManifest from './manifest';
import * as cBindings from './bindings';
import * as cHelp from './help';
import * as cAdd from './add';
import * as cLink from './link';
import * as cInstall from './install';
import { fOpenTrelloConfigForm, fSubmitOrUpdateZendeskConfigSubmit } from './configure';

const router: Router = express.Router();

router.get(Routes.App.ManifestPath, cManifest.getManifest);
router.post(Routes.App.BindingsPath, cBindings.getBindings);
router.post(Routes.App.InstallPath, cInstall.getInstall);

// COMMANDS
router.post(`${Routes.App.BindingPathHelp}`, cHelp.getHelp);
router.post(`${Routes.App.BindingPathAdd}`, cAdd.getAdd);
router.post(`${Routes.App.BindingPathNew}`, cAdd.getAdd);
router.post(`${Routes.App.BindingPathLink}`, cLink.getLink);

// ACTIONS
//router.post(`${Routes.App.BoardSelectPath}`, cAdd.boardListSelect)
//router.post(`${Routes.App.ListSelectPath}`, cAdd.listSelect)
router.post(`${Routes.App.AddFormStepOnePath}`, cAdd.formStepOne)
router.post(`${Routes.App.AddFormStepTwoPath}`, cAdd.formStepTwo)
router.post(`${Routes.App.Forms}${Routes.App.BindingPathCreateCard}`, cAdd.getAdd);
router.post(`${Routes.App.Forms}${Routes.App.BindingPathCreateCard}${Routes.App.Submit}`, cAdd.formStepTwo);
router.post(`${Routes.App.Forms}${Routes.App.BindingPathCreateCard}${Routes.App.Form}`, cAdd.formStepOne);

// CONFIGURE TRELLO ACCOUNT
router.post(`${Routes.App.CallPathConfigOpenForm}`, fOpenTrelloConfigForm);
router.post(`${Routes.App.CallPathConfigSubmitOrUpdateForm}`, fSubmitOrUpdateZendeskConfigSubmit);

const staticRouter = express.Router();
staticRouter.use(express.static('static'));
router.use('/static', staticRouter);

export default router;
