# Mattermost/Trello Integration

* [Feature summary](#feature-summary)
* [Setting up](#setting-up)
  * [Installation](#installation)
  * [Configuration](#configuration)
* [Admin guide](#admin-guide)
  * [Slash commands](#slash-commands)
* [End user guide](#end-user-guide)
  * [Getting started](#getting-started)
  * [Using /trello commands](#using-trello-commands)
* [Development](#development)
  * [Manual installation](#manual-installation)
  * [Running the local development environment](#running-the-local-development-environment)
  * [Running the local development environment with docker](#running-the-local-development-environment-with-docker)

This application allows you to integrate Trello to your Mattermost instance, letting you know when a new card is created, as well as getting notified about card updates. Also, allows the user to create new cards without moving from the Mattermost window.

# Feature summary

**Trello to Mattermost Notifications:** Link your Mattermost channels with the Trello boards you want to see, so you and your team can get notifications about the creation and position update of each card.

**Manage card creation on Mattermost:** Create new cards from Mattermost (via modal or command), assigning the board and the list to which you want to add the card.

# Setting up

## Installation

Requirement Mattermost instance with the ``/apps install`` command enabled.

To install, as a super admin user role, execute command /apps install http TRELLO_API_URL in any channel. Trello command should be available after the configuration has been successfully installed. TRELLO_API_URL should be replaced with the URL where the Trello API instance is running. Example: /apps install http https://mattermost-trello-dev.ancient.mx/manifest.json

## Configuration

Configuration Step 1: Install the application in Mattermost Firstly, you need to install the app in your current Mattermost instance (refer to Installation), the /trello command should be available.
Step 2: Configure Trello workspace As a super admin role user, execute /trello configure command, which will open a modal were workspace, API key and API token will be asked (https://trello.com/app-key).
Step 3: Login as a Trello user After configuration has been stablished, command /trello account will be enabled. To be able to access to all commands, you should login to a Trello account and follow the link provided after /trello account login is executed, then,
paste in the modal the generated token.

 # Admin guide

## Slash commands

/trello configure: This command will enable all the other commands; it asks the administrator for an API key (which will be used to execute calls to Trello’s API) and a token.

# End user guide

## Getting started

## Using /trello commands

- /trello help: This command will show all current commands available for this application.
- /trello account login: Will display a new modal were a user token will be needed. It is required before any other action.
- /trello account logout: Will erase current user oauth token.
- /trello card create: Allow any user to create a new card in any board they want (boards are listed as they have access to them from Trello). Both, command and modal options are available.
- /trello subscription add: Creates a new subscription for notifications: choose a board and a channel and get notified of the updates in that board. You can subscribe more than one board per channel.
- /trello subscription list: Show the list of all subscriptions made in all of your channels.
- /trello subscription remove: Will allow you to remove a subscription. No more notifications from that board will be received.

# Development

## Manual installation

*  Download the latest repository release.

### Running the local development environment

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
