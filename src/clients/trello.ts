import axios, { AxiosResponse } from 'axios';
import queryString from "query-string";
import config from '../config';
import {Routes} from '../constant';
import {SearchResponse, WebhookCreate} from "../types/trello";

export interface TrelloOptions {
  apiKey: string;
  token: string;
  workspace: string;
}

export class TrelloClient {
  private readonly config: TrelloOptions;

  constructor(
    config: TrelloOptions
  ) { this.config = config; }

  public getListByBoard(boardId: string): Promise<any> {
    const queryParams: string = queryString.stringify({
      key: this.config.apiKey,
      token: this.config.token
    });
    const url: string = `${config.TRELLO.URL}boards/${boardId}/lists?${queryParams}`;
    
    return axios.get(url)
        .then((response:  AxiosResponse<any>) => response.data);
  }

  public searchBoardByName(boardName: string): Promise<SearchResponse> {
    const queryParams: string = queryString.stringify({
      key: this.config.apiKey,
      token: this.config.token,
      query: boardName,
      modelTypes: 'boards'
    });
    const url: string = `${config.TRELLO.URL}search?${queryParams}`;
    
    return axios.get(url)
        .then((response:  AxiosResponse<any>) => response.data);
  }

  public searchBoardsInOrganization(): Promise<any> {
    const queryParams: string = queryString.stringify({
      key: this.config.apiKey,
      token: this.config.token
    });
    const url: string = `${config.TRELLO.URL}organizations/${this.config.workspace}/boards?${queryParams}`;
    
    return axios.get(url)
        .then((response:  AxiosResponse<any>) => response.data);
  }

  public sendCreateCardRequest(listId: string, cardName: string): Promise<any> {
    const queryParams: string = queryString.stringify({
      key: this.config.apiKey,
      token: this.config.token,
      name: cardName,
      idList: listId
    });
    const url: string = `${config.TRELLO.URL}cards?${queryParams}`;
    
    return axios.post(url)
        .then((response:  AxiosResponse<any>) => response.data);
  }

  public validateToken(): Promise<any> {
    const queryParams: string = queryString.stringify({
      key: this.config.apiKey,
      token: this.config.token
    });
    const verifyURL = `${config.TRELLO.URL}${Routes.TP.getMembers}?${queryParams}`;

    return axios.get(verifyURL)
        .then((response: AxiosResponse<any>) => response.data);
  }

  public createTrelloWebhook(payload: WebhookCreate): Promise<any> {
    const queryParams: string = queryString.stringify({
      key: this.config.apiKey,
      token: this.config.token,
      callbackURL: payload.callbackURL,
      idModel: payload.idModel,
      description: payload.description
    });
    const url: string = `${config.TRELLO.URL}${Routes.TP.webhooks}?${queryParams}`;
    console.log('url', url);
    return axios.post(url)
      .then((response: AxiosResponse<any>) => response.data);
  }
}
