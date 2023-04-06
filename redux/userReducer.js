const initialState = {
    uid: '',
    name: '',
    username: '',
    dateOfBirth: '',
    profilePicture: ''
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_NAME':
            return { ...state, name: action.payload };
        case 'UPDATE_USERNAME':
            return { ...state, username: action.payload };
        case 'UPDATE_DATE_OF_BIRTH':
            return { ...state, dateOfBirth: action.payload };
        case 'UPDATE_PROFILE_PICTURE':
            return { ...state, profilePicture: action.payload };
        case 'UPDATE_UID':
            return { ...state, uid: action.payload };
        default:
            return state;
    }
};

export default userReducer;