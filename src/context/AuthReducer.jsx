export const initialState = {
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
  isError: false,
  loading: false,
  errorData: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        user: action.payload,
        loading: false,
        isError: false,
        errorData: null,
      };
    case 'LOADING':
      return {
        loading: true,
      };
    case 'LOGOUT':
      return {
        user: null,
        loading: false,
        isError: false,
        errorData: null,
      };
    case 'ERROR':
      return {
        user: null,
        loading: false,
        isError: true,
        errorData: action.payload,
      };

    default:
      return state;
  }
};
