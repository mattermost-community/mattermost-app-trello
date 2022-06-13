require('dotenv').config('../')

export default {
    APP: {
        PORT: Number(process.env.PORT) || 4002,
        HOST: process.env.HOST || 'https://ee70-201-160-204-97.ngrok.io'
    },
    TRELLO: {
        URL: 'https://api.trello.com/1/'
    }
}
