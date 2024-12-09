// File which contains enum types

export enum NOTIFY {
    CHANGE_THEME,
    CHANGE_COLOR,
    CHANGE_BUTTONS,

    SUCCESS_LOGIN,
    SUCCESS_REGISTER,
    SUCCESS_LOGOUT,

    ERROR,
    ERROR_LOGIN,
    ERROR_REGISTER,
    ERROR_TIMEOUT,

    RESET,

    SNEAKY_PASSWORD, // deleting 'disabled' from HTML Submit Button w/ insufficient password

    SAVE_PERSON,
    SAVE_RELATIONSHIP,
    SAVE_COORDS,
    SAVE_MILESTONE,
    SAVING,

    ADD_PERSON,
    ADD_RELATIONSHIP,
    ADD_MILESTONE,

    DELETE,
    DELETE_PERSON,
    DELETE_RELATIONSHIP,
    DELETE_MILESTONE,
}

export default NOTIFY;