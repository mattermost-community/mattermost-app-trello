import fetch from 'node-fetch';
import config from '../config';

export const trelloApi = {
  getListByBoard: async (boardId: string) => {
    const response = await fetch(`${config.TRELLO.URL}boards/${boardId}/lists?key=${config.TRELLO.API_KEY}&token=${config.TRELLO.TOKEN}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    const data = await response.json();
  
    console.log(data);
    return data;
  },
  searchBoardByName: async (boardName: string) => {
    const response = await fetch(`${config.TRELLO.URL}search?modelTypes=boards&query=${boardName}&key=${config.TRELLO.API_KEY}&token=${config.TRELLO.TOKEN}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    const data = await response.json();
  
    console.log(data);
    return data;
  },
  sendCreateCardRequest: async (args: { listId: string; cardName: string }) => {
    const response = await fetch(`${config.TRELLO.URL}cards?idList=627adae68d4b706522205e7b&key=${config.TRELLO.API_KEY}&token=${config.TRELLO.TOKEN}&name=${args.cardName}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    const data = await response.json();
  
    console.log(data);
    return data;
  }
};