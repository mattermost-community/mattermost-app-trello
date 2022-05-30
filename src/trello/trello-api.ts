import config from '../config';
import { httpModule } from '../http/http-module';

export const trelloApi = {
  getListByBoard: async (boardId: string) => {
    return await httpModule.get(`${config.TRELLO.URL}boards/${boardId}/lists?key=${config.TRELLO.API_KEY}&token=${config.TRELLO.TOKEN}`);
  },
  searchBoardByName: async (boardName: string) => {
    return await httpModule.get(`${config.TRELLO.URL}search?modelTypes=boards&query=${boardName}&key=${config.TRELLO.API_KEY}&token=${config.TRELLO.TOKEN}`);
  },
  searchBoardsInOrganization: async () => {
    return await httpModule.get(`${config.TRELLO.URL}organizations/60c99e3ff7a1801bb8ac7f36/boards?key=${config.TRELLO.API_KEY}&token=${config.TRELLO.TOKEN}`)
  },
  sendCreateCardRequest: async (args: { listId: string; cardName: string }) => {
    return await httpModule.post(`${config.TRELLO.URL}cards?idList=${args.listId}&name=${args.cardName}&key=${config.TRELLO.API_KEY}&token=${config.TRELLO.TOKEN}`);
  }
};