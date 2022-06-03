import { AppExpandLevels, AppFieldTypes, Routes, TrelloIcon } from "../constant";
import { AppCallRequest, AppForm, AppSelectOption } from "../types";
import { AppContext } from '../types/apps';
import { callSubscriptionList } from "./subscription-list";


export async function subscriptionRemoveForm(context: AppContext): Promise<AppForm> {
   const options: AppSelectOption[] = await callSubscriptionList(context);

   return {
      title: 'Subscribe channel to Trello board',
      icon: TrelloIcon,
      submit: {
         path: Routes.App.CallSubscriptionRemove,
         expand: {
            app: AppExpandLevels.EXPAND_SUMMARY,
            channel: AppExpandLevels.EXPAND_ALL,
            admin_access_token: AppExpandLevels.EXPAND_ALL,
            user: AppExpandLevels.EXPAND_SUMMARY,
         },
      },
      fields: [
         {
            name: "subscription",
            modal_label: 'Subscription',
            type: AppFieldTypes.STATIC_SELECT,
            options: options,
            is_required: true,
         }
      ]
   } as AppForm;
}

