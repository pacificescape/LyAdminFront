import getUserGroups from "../../Api/getUserGroups";
import getGroup from "../../Api/getGroup"; //
import getUser from "../../Api/getUser";
import getGroupMembers from "../../Api/getGroupMembers"; //

import deepPurple from "@material-ui/core/colors/deepPurple";

const INITIALIZE_APP = "INITIALIZE_APP";

const SET_CURRENT_GROUP_ID = "SET_CURRENT_GROUP_ID";
const SET_GROUP_MEMBERS = "SET_GROUP_MEMBERS";
const SET_USER = "SET_USER";

const TOGGLE_IS_AUTH = "TOGGLE_IS_AUTH";
const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";
const TOGGLE_IS_INITIALIZING = "TOGGLE_IS_INITIALIZING";
const TOGGLE_IS_ERROR = "TOGGLE_IS_ERROR";
const TOGGLE_IS_CHANGING_SETTINGS = "TOGGLE_IS_CHANGING_SETTINGS";

const initialSettings = {
  users: {},
  groupmembers: {},
};

type InitialSettingsType = {
  users: Record<string, any>;
  groupmembers: Record<string, any>;
};

export default (state: InitialSettingsType = initialSettings, action: any) => {
  switch (action.type) {
    case SET_GROUP_MEMBERS: {
      let newmembers = { empty: false };
      newmembers = { ...newmembers, ...action.members, ...state.groupmembers };
      return { ...state, groupmembers: newmembers };
    }
    case SET_USER: {
      let newusers = { empty: false };
      newusers = {
        ...newusers,
        ...action.users,
        ...state.users[action.groupId],
      };
      return {
        ...state,
        users: { ...state.users, [action.groupId]: newusers },
      };
    }
    default:
      return state;
  }
};

export const setGroupMembers = (members: object) => ({
  type: SET_GROUP_MEMBERS,
  members,
});
export const setUser = (users: object, groupId: string) => ({
  type: SET_USER,
  users,
  groupId,
});

type ToggleIsInitializedType = {
  type: typeof INITIALIZE_APP;
  isInitialized: boolean;
};
export const toggleIsInitialized = (
  isInitialized: boolean
): ToggleIsInitializedType => ({ type: INITIALIZE_APP, isInitialized });

type ToggleiIsInitializingType = {
  type: typeof TOGGLE_IS_INITIALIZING;
  initializing: boolean;
};
export const toggleiIsInitializing = (
  initializing: boolean
): ToggleiIsInitializingType => ({
  type: TOGGLE_IS_INITIALIZING,
  initializing,
});

type toggleIsAuthType = { type: typeof TOGGLE_IS_AUTH; isAuth: boolean };
export const toggleIsAuth = (isAuth: boolean): toggleIsAuthType => ({
  type: TOGGLE_IS_AUTH,
  isAuth,
});

type ToggleIsFetchingType = {
  type: typeof TOGGLE_IS_FETCHING;
  isFetching: boolean;
  method: string;
};
export const toggleIsFetching = (
  isFetching: boolean,
  method: string
): ToggleIsFetchingType => ({ type: TOGGLE_IS_FETCHING, isFetching, method });

type ToggleIsErrorType = { type: typeof TOGGLE_IS_ERROR; isError: boolean };
export const toggleIsError = (isError: boolean): ToggleIsErrorType => ({
  type: TOGGLE_IS_ERROR,
  isError,
});

type ToggleisChangingSettingsType = {
  type: typeof TOGGLE_IS_CHANGING_SETTINGS;
  isChanging: boolean;
};
export const toggleisChangingSettings = (
  isChanging: boolean
): ToggleisChangingSettingsType => ({
  type: TOGGLE_IS_CHANGING_SETTINGS,
  isChanging,
});

type UserType = {
  username: string | null;
  first_name: string;
  telegram_id: number;
  avatar: string | null;
};

type GroupMemberType = {
  banan: {
    num: number;
    sum: number;
    stack: number;
    time: string;
  };
  stats: {
    messagesCount: number;
    textTotal: number;
  };
  score: number;
  telegram_id: number;
};

export const getUserThunk = (
  userIds: Array<GroupMemberType>,
  groupId: string
) => (dispatch: any) => {
  dispatch(toggleIsFetching(true, "getUser"));

  let grabUsers = Promise.all(
    userIds.map((userId) => {
      return getUser(userId.telegram_id).then((res) => {
        if (!res.ok) {
          dispatch(toggleIsError(true));
          return;
        }
        return res.result;
      });
    })
  );

  let usersObj: Record<string, any> = {};

  grabUsers.then((users) => {
    users.forEach((user: UserType) => {
      usersObj[user.telegram_id] = user;
    });
    dispatch(setUser(usersObj, groupId));
    dispatch(toggleIsFetching(false, "getUser"));
  });
};

export const getGroupMembersThunk = (groupId: string) => (dispatch: any) => {
  dispatch(toggleIsFetching(true, "getGroupMembers"));

  getGroupMembers(groupId)
    .then((res) => {
      if (!res.ok) {
        dispatch(toggleIsError(true));
        return;
      }

      let members = res.result;
      dispatch(setGroupMembers({ [groupId]: members }));
      dispatch(toggleIsFetching(false, "getGroupMembers"));
    })
    .catch((err) => {
      dispatch(toggleIsError(true));
      console.log("getUserGroups thunk failed", err);
    });
};
