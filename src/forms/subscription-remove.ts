import { AppExpandLevels, AppFieldTypes, Routes, TrelloIcon } from "../constant";
import { SubscriptionRemoveForm } from "../constant/forms";
import { AppCallRequest, AppForm, AppSelectOption } from "../types";
import { AppContext } from '../types/apps';
import { callSubscriptionList } from "./subscription-list";

export async function subscriptionRemoveForm(context: AppContext): Promise<AppForm> {
   const options: AppSelectOption[] = await callSubscriptionList(context);

   return {
      title: 'Unsubscribe from Trello board notifications',
      icon: TrelloIcon,
      submit: {
         path: Routes.App.CallSubscriptionRemove,
         expand: {
            app: AppExpandLevels.EXPAND_SUMMARY,
            channel: AppExpandLevels.EXPAND_ALL,
            admin_access_token: AppExpandLevels.EXPAND_ALL,
            user: AppExpandLevels.EXPAND_SUMMARY,
         },
         call: {
            path: Routes.App.CallSubscriptionListAppOpts
         }
      },
      fields: [
         {
            name: SubscriptionRemoveForm.SUBSCRIPTION,
            modal_label: 'Subscription',
            type: AppFieldTypes.DYNAMIC_SELECT,
            refresh: true,
            options: options,
            is_required: true,
         }
      ]
   } as AppForm;
}

