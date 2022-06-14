# Mattermost/Trello Integration

This application allows you to integrate Trello to your 
Mattermost instance, letting you know when a new 
card is created, as well as getting notified about card 
updates. 
Also, allows the user to create new cards without 
moving from the Mattermost window.

## Manual Installation
*  Download the latest repository release.

### Running local development environment

* It is necessary to have installed at least node version 12 and maximum version 18.
On the next page you can download the latest lts version of node for the required operating system https://nodejs.org/es/download/

*  Install libraries, move project directory and execute npm install to download all dependency libraries

```
$ npm install
```

*  Update the environment configuration file. The .env file must be modified or added to set the environment variables, it must be in the root of the repository.

```
file: .env

PROJECT=mattermost-trello-app
PORT=4002
HOST=https://mattermost-trello-dev.ancient.mx
```

Variable definition

PROJECT: in case of executing the project with docker using the .build.sh this variable will be used for the name of the container

PORT: port number on which the trello integration is listening

HOST: Trello api usage url

* Finally, the project must be executed.

```
$ npm run dev
```

### Running the local development environment with docker

* It is necessary to have docker installed, on the following page you can find the necessary steps to install docker in the operating system that requires it

https://docs.docker.com/engine/install/ubuntu/ - Ubuntu
https://docs.docker.com/desktop/mac/install/ - Mac
https://docs.docker.com/desktop/windows/install/ - Windows

* Once you have docker installed, the next step would be to run the ./build.sh file to create the api container and expose it locally or on the server, depending on the case required.

```
$ ./build
```

When the container is created correctly, the api will be running at the url http://127.0.0.1:4002
in such a way that the installation can be carried out in Mattermost.
