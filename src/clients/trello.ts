import axios, { AxiosResponse } from 'axios';
import { getHTTPPath } from '../api/manifest';
import config from '../config';
import { Routes } from '../constant';
import { TrelloWebhook } from '../types/trello';
import { tryPromiseWithMessage } from '../utils';

export interface TrelloOptions {
  apiKey: string;
  token: string;
  workspace: string;
}

export class TrelloClient {
  private readonly config: TrelloOptions;

  constructor(
    config: TrelloOptions
  ) {
    this.config = config;
  }

  private getKeyAndTokenUrlParams(): string {
    return `key=${this.config.apiKey}&token=${this.config.token}`
  }

  public getListByBoard(boardId: string): Promise<any> {
    const url: string = `${config.TRELLO.URL}boards/${boardId}/lists?${this.getKeyAndTokenUrlParams()}`;
    
    return axios.get(url).then((response:  AxiosResponse<any>) => response.data);
  }

  public searchBoardByName(boardName: string): Promise<any> {
    const url: string = `${config.TRELLO.URL}search?modelTypes=boards&query=${boardName}&${this.getKeyAndTokenUrlParams()}`;
    
    return axios.get(url).then((response:  AxiosResponse<any>) => response.data);
  }

  public searchBoardsInOrganization(): Promise<any> {
    const url: string = `${config.TRELLO.URL}organizations/${this.config.workspace}/boards?${this.getKeyAndTokenUrlParams()}`;
    
    return axios.get(url).then((response:  AxiosResponse<any>) => response.data);
  }

  public sendCreateCardRequest(listId: string, cardName: string): Promise<any> {
    const url: string = `${config.TRELLO.URL}cards?idList=${listId}&name=${cardName}&${this.getKeyAndTokenUrlParams()}`;
    
    return axios.post(url).then((response:  AxiosResponse<any>) => response.data);
  }

  public validateToken(data: TrelloOptions): Promise<any> {
    const verifyURL = `${config.TRELLO.URL}${Routes.TP.getMembers}?key=${data.apiKey}&token=${data.token}`;
    return axios.get(verifyURL).then((response: AxiosResponse<any>) => response.data);
  }

  public createTrelloWebhook(callbackURL: string, idModel: string): Promise<any> {
    const url: string = `${config.TRELLO.URL}${Routes.TP.webhooks}?callbackURL=${callbackURL}&idModel=${idModel}&${this.getKeyAndTokenUrlParams()}`;
    return axios.post(url)
      .then((response: AxiosResponse<any>) => response.data);
  }

  public getTrelloActiveWebhooks(): Promise<TrelloWebhook[]> {
    const token = this.config.token;
    const url: string = `${config.TRELLO.URL}${Routes.TP.tokens}/${token}/${Routes.TP.webhooks}?${this.getKeyAndTokenUrlParams()}`;
    return axios.get(url)
      .then((response: AxiosResponse<TrelloWebhook[]>) => response.data);
  }
}
