import { useReducer } from "react";

const reducer = (previousState, updatedState) => {
  return { ...previousState, ...updatedState };
};

const useFormState = (initialState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setState = (updatedState) => dispatch(updatedState);

  return [state, setState];
};

export default useFormState;
