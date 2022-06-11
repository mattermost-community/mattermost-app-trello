require('dotenv').config('../')

export default {
    APP: {
        PORT: Number(process.env.PORT) || 4002,
        HOST: process.env.HOST || 'https://107c-201-160-204-97.ngrok.io'
    },
    TRELLO: {
        URL: 'https://api.trello.com/1/'
    },
    MATTERMOST: {
        URL: process.env.MATTERMOST_SERVER_URL || 'http://[::1]:8066',
        USE: process.env.MATTERMOST_USE === 'true'
    }
}
