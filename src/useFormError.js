const { useReducer } = require("react");

const initialStateError = {
  error: false,
  errorMessages: null,
};

const reducerError = (state = initialStateError, action) => {
  const { type } = action;
  if (type === "ERROR_HAPPENED") {
    return {
      error: true,
      errorMessages: {
        ...action.payload,
      },
    };
  }
  if (type === "ERROR_CLEANED") {
    return initialStateError;
  }

  return state;
};

export const useFormError = () => {
  const [state, dispatch] = useReducer(reducerError, initialStateError);

  const sendFormErrors = (errorMessages) => {
    if (errorMessages) {
      dispatch({
        type: "ERROR_HAPPENED",
        payload: errorMessages,
      });
    }
  };

  const cleanErrors = () => {
    dispatch({
      type: "ERROR_CLEANED",
    });
  };

  return [state, sendFormErrors, cleanErrors];
};
