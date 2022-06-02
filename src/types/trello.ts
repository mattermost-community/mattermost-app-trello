export type TrelloWebhookResponse = {
   model: TrelloModel,
   action: TrelloAction
}

export type TrelloModel = {
   id: string,
   name: string,
   desc: string,
   descData: any,
   closed: boolean,
   idOrganization: string,
   idEnterprise: any,
   pinned: boolean,
   url: string,
   shortUrl: string,
   prefs: TMPref,
   labelNames: TMLabelNames
}

export type TrelloAction = {
   id: string,
   idMemberCreator: string,
   data: TAData,
   appCreator: any,
   type: string,
   date: string,
   limits: any,
   display: TADisplay,
   memberCreator: TAMemberCreator
}



export type TMPref = {
   permissionLevel: string,
   hideVotes: boolean,
   voting: string,
   comments: string,
   invitations: string,
   selfJoin: boolean,
   cardCovers: boolean,
   isTemplate: boolean,
   cardAging: string,
   calendarFeedEnabled: boolean,
   hiddenPluginBoardButtons: any[],
   switcherViews: any[],
   background: string,
   backgroundColor: any,
   backgroundImage: string,
   backgroundImageScaled: any[],
   backgroundTile: boolean,
   backgroundBrightness: string,
   backgroundBottomColor: string,
   backgroundTopColor: string,
   canBePublic: boolean,
   canBeEnterprise: boolean,
   canBeOrg: boolean,
   canBePrivate: boolean,
   canInvite: boolean
}

export type TMLabelNames = { [key: string]: any }

export type TAData = {
   card: TADCard,
   list: TADList,
   old: TADOld,
   board: TADBoard,
   listBefore: TADList,
   listAfter: TADList
}

export type TADCard = {
   idList: string,
   id: string,
   name: string,
   idShort: string,
   shortLink: string,
}

export type TADOld = { idList: string, }

export type TADBoard = {
   id: string,
   name: string,
   shortLink: string,
}

export type TADList = { id: string, name: string, }

export type TADisplay = {
   translationKey: string,
   entities: any[]
}

export type TAMemberCreator = {
   id: string,
   activityBlocked: boolean,
   avatarHash: string,
   avatarUrl: string,
   fullName: string,
   idMemberReferrer: any,
   initials: string,
   nonPublic: any,
   nonPublicAvailable: boolean,
   username: string,
}