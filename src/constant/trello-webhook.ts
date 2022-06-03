import { getManifestData } from "../api/manifest"

export const TrelloTranslationKeys = {
   CardMoved: 'action_move_card_from_list_to_list',
   CardCreated: 'action_create_card'
}

export const TrelloImagePath = (siteURL: string) => {
   return `${siteURL}/plugins/com.mattermost.apps/apps/${getManifestData().app_id}/static/${getManifestData().icon}`
}