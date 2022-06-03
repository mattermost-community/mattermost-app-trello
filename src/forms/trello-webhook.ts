import { TrelloTranslationKeys } from "../constant/trello-webhook";
import { TrelloWebhookResponse } from "../types/trello";
import { h5 } from "../utils/markdown";

export const trelloWebhookResponse = (action: TrelloWebhookResponse) => {
   switch (action.action.display.translationKey) {
      case TrelloTranslationKeys.CardCreated:
         return CardCreated(action);
      case TrelloTranslationKeys.CardMoved:
         return CardMoved(action);
      default:
         break;
   }
}

const CardCreated = (response: TrelloWebhookResponse) => {
   const action = response.action;
   const cardModel = response.model;
   return  {
      text: h5(`Card created "${action.data.card.name}"  ("${action.data.board.name}" Board)`),
      attachments: [
         {
            //author_icon: action.memberCreator.avatarUrl,
            author_name: action.memberCreator.fullName,
            title: `Board "${action.data.board.name}"`,
            title_link: cardModel.url,
            text: `Card "${action.data.card.name}" was created (in "${action.data.list.name}" list)`,
         }
      ]
   }
}

const CardMoved = (response: TrelloWebhookResponse) => {
   const action = response.action;
   const cardModel = response.model;

   return {
      text: h5(`Card moved "${action.data.card.name}"  ("${action.data.board.name}" Board)`),
      attachments: [
         {
            //author_icon: action.memberCreator.avatarUrl,
            author_name: action.memberCreator.fullName,
            title: `Board "${action.data.board.name}"`,
            title_link: cardModel.url,
            text: `Card "${action.data.card.name}" was moved (from "${action.data.listBefore.name}" list to "${action.data.listAfter.name}" list)`,
         }
      ]
   }
}
