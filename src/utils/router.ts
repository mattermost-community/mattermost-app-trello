import { Routes } from 'src/constant';

import { routesJoin } from './utils';

export function getRoutes() {
    return {
        manifest: Routes.App.ManifestPath,
        bindings: Routes.App.BindingsPath,
        install: Routes.App.InstallPath,
        help: Routes.App.BindingPathHelp,
        add: routesJoin([Routes.App.Forms, Routes.App.BindingPathCreateCard]),
        formStepTwo: routesJoin([Routes.App.Forms, Routes.App.BindingPathCreateCard, Routes.App.Submit]),
        formStepOne: routesJoin([Routes.App.Forms, Routes.App.BindingPathCreateCard, Routes.App.Form]),
        getConnect: Routes.App.BindingPathConnect,
        saveToken: routesJoin([Routes.App.BindingPathConnect, Routes.App.Submit]),
        getDisconnect: Routes.App.BindingPathDisconnect,
        openTrelloConfigForm: Routes.App.CallPathConfigOpenForm,
        submitTrelloConfig: Routes.App.CallPathConfigSubmitOrUpdateForm,
        addWebhookSubscription: Routes.App.CallSubscriptionAdd,
        getWebhookSubscriptions: Routes.App.CallSubscriptionList,
        removeWebhookSubscription: Routes.App.CallSubscriptionRemove,
        incomingWebhook: Routes.App.CallPathIncomingWebhookPath,
    };
}