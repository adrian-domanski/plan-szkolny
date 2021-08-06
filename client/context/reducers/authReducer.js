export const initState = {
  isAuth: false,
  user: null,
  token: null,
  isLoading: false,
};

export const authReducer = (state, action) => {
  const domain =
    process.env.NODE_ENV !== 'production'
      ? 'localhost'
      : 'plan-szkolny.kodario.pl';
  switch (action.type) {
    case 'UPDATE_TOKEN':
      const nowDate = new Date();
      nowDate.setDate(nowDate.getDate() + 3);
      document.cookie = `token=${
        action.payload
      }; domain=${domain}; path=/; expires=${nowDate.toUTCString()}`;
      break;
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: true,
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      const now = new Date();
      now.setDate(now.getDate() + 3);
      document.cookie = `token=${
        action.payload.token
      }; domain=${domain}; path=/; expires=${now.toUTCString()}`;
      return {
        ...state,
        isAuth: action.payload.user.confirmed,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuth: true,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
      };
    case 'LOGOUT_SUCCESS':
    case 'REGISTER_ERROR':
    case 'LOGIN_ERROR':
    case 'AUTH_ERROR':
      document.cookie = `token=""; domain=${domain}; path=/; expires=${new Date().toUTCString()}`;
      return {
        ...state,
        isAuth: false,
        user: null,
        token: null,
        isLoading: false,
      };
    default:
      return state;
  }
};
