import fetch from 'node-fetch';

export const httpModule = {
  post: async (url: string, body?: any, token?: string) => {
    let headers = null;
    if (token) {
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    } else {
      headers = {
        'Content-Type': 'application/json',
      }
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })
    
    return await response.json();
  },
  get: async (url: string, token?: string) => {
    let headers = null;
    if (token) {
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    } else {
      headers = {
        'Content-Type': 'application/json',
      }
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    })
    
    return await response.json();
  },
}