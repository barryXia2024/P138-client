import { ConnectionState, Conversation } from "@/p138-react-common/OpenIM";

export enum BaseEventTypes {
  LOGIN = "BASE:LOGIN",
  LOGOUT = "BASE:LOGOUT",
  LOGIN_FAILED = "BASE:LOGIN_FAILED",
  NEW_MESSAGE = "BASE:NEW_MESSAGE",
  NETWORK_CHANGE = "BASE:NETWORK_CHANGE",
}

export enum IMEventTypes {
  SDK_INITED = "IM:SDK_INITED",
  SDK_INIT_FAILED = "IM:SDK_INIT_FAILED",
  LOGIN = "IM:LOGIN",
  LOGOUT = "IM:LOGOUT",
  LOGIN_FAILED = "IM:LOGIN_FAILED",
  LOGOUT_FAILED = "IM:LOGOUT_FAILED",
  TOKEN_EXPIRED = "IM:TOKEN_EXPIRED",
  CONNECTION_STATE_CHANGED = "IM:CONNECTION_STATE_CHANGED",
  CONVERSATIONS_CHANGED = "IM:CONVERSATIONS_CHANGED",
  CONVERSATIONS_REFRESHED = "IM:CONVERSATIONS_REFRESHED",
}

export const EventTypes = {
  ...BaseEventTypes,
  ...IMEventTypes,
};
export type BaseEvents = {
  [BaseEventTypes.LOGIN]: ServerCoreAuth.UserSignInResult;
  [BaseEventTypes.LOGOUT]: void;
  [BaseEventTypes.LOGIN_FAILED]: BasicTypes.ErrorDetails;
  [BaseEventTypes.NEW_MESSAGE]: { from: string; content: string };
  [BaseEventTypes.NETWORK_CHANGE]: { isConnected: boolean };
};

export type IMEvents = {
  [IMEventTypes.SDK_INITED]: void;
  [IMEventTypes.SDK_INIT_FAILED]: Error;
  [IMEventTypes.LOGIN]:void;
  [IMEventTypes.LOGOUT]: void;
  [IMEventTypes.LOGIN_FAILED]: Error;
  [IMEventTypes.LOGOUT_FAILED]: Error;
  [IMEventTypes.TOKEN_EXPIRED]: Error;
  [IMEventTypes.CONNECTION_STATE_CHANGED]: ConnectionState;
  [IMEventTypes.CONVERSATIONS_CHANGED]: Conversation[];
  [IMEventTypes.CONVERSATIONS_REFRESHED]: Conversation[];
};


export type AppEvents = BaseEvents & IMEvents;
