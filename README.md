# Mattermost/Trello Integration

This application allows you to integrate Trello to your 
Mattermost instance, letting you know when a new 
card is created, as well as getting notified about card 
updates. 
Also, allows the user to create new cards without 
moving from the Mattermost window.

## Manual Installation
*  Download latest versionDownload the latest repository release.

* It is necessary to have at least the version of node 12 installed

*  Install libraries move project directory an execute npm install to download all dependency libraries

*  Update the environment configuration file. The .env file must be modified or added to set the environment variables, it must be in the root of the repository.

```
PROJECT=mattermost-trello-app
PORT=4002
HOST=https://mattermost-trello-dev.ancient.mx
MATTERMOST_SERVER_URL=https://mattermost-dev.ancient.mx
```

Variable definition

PROJECT: in case of executing the project with docker using the .build.sh this variable will be used for the name of the container

PORT: port number on which the trello integration is listening

HOST: Trello api usage url

MATTERMOST_SERVER_URL: This variable should only be configured for development environments, since errors occur in some computers when consuming the mattermost api.
If you don't work locally, you don't need to configure it

* Finally, the ./build.sh file must be executed to create the api container and expose it locally or on the server, depending on the case required. In the same way, the api can be started locally by executing the npm run dev command, this will start a daemon that will be aware of any change in the code.


