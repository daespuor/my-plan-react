import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  makeStyles,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useEffect, useReducer, useState } from "react";
import { navigate, Redirect } from "@reach/router";
import { BASE_URL } from "../utils/api";
import CustomAlert from "./CustomAlert";
// eslint-disable-next-line import/no-unresolved
import { useIdentityContext } from "react-netlify-identity";
import CurrencyFormat from "react-currency-format";
import useFormState from "../useFormState";
import { useFormError } from "../useFormError";

const ERROR_DELETE = "ERROR_DELETE";
const SUCCESS_SAVE = "SUCCESS_SAVE";
const ERROR_SAVE = "ERROR_SAVE";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up("lg")]: {
      padding: theme.spacing(2),
    },
  },
  content: {
    width: "80%",
    margin: "20px auto",
  },
  field: {
    width: "100%",
    paddingTop: "20px",
    margin: "10px auto",
    borderTop: "dashed 1px rgba(0, 0, 0, 0.3)",
  },
  formControl: {
    marginRight: "10px",
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const initialState = {
  income: 0.0,
  debtQuota: 0.0,
  debtTotal: 0.0,
  saving: 0.0,
};

const initialFormState = {
  success: false,
  error: false,
  message: null,
};

const reducerForm = (state = initialFormState, action) => {
  const { type } = action;
  if (type == SUCCESS_SAVE) {
    return {
      error: null,
      success: true,
      message: "Item guardado con éxito!",
    };
  }
  if (type == ERROR_SAVE || type === ERROR_DELETE) {
    return {
      success: false,
      error: true,
      message: action.payload.error,
    };
  }

  return state;
};

const useParameters = (username, token) => {
  const [parameters, setParameters] = useState(null);
  const [error, setError] = useState(false);
  const getParameters = () => {
    fetch(`${BASE_URL}/get-parameter?username=${username}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setParameters(response);
      })
      .catch((error) => setError(true));
  };

  useEffect(() => getParameters(), []);

  return [parameters, error];
};

const useModifyParameters = (toggleAlert, token) => {
  const [state, dispatch] = useReducer(reducerForm, initialFormState);
  const addParameter = (parameter) => {
    fetch(`${BASE_URL}/add-parameter`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        parameter,
      }),
    })
      .then((response) => {
        if (response.status == "200") {
          dispatch({ type: SUCCESS_SAVE });
        } else {
          dispatch({
            type: ERROR_SAVE,
            payload: { error: response.statusText },
          });
        }
      })
      .catch((error) => dispatch({ type: ERROR_SAVE, payload: { error } }));
  };

  useEffect(() => {
    const { message } = state;
    if (message) {
      toggleAlert();
    }
  }, [state]);

  return [state, addParameter];
};

const Account = () => {
  const [openAlert, setOpenAlert] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const identity = useIdentityContext();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [stateError, sendFormErrors] = useFormError();
  const toggleAlert = () => setOpenAlert(!openAlert);
  const token =
    identity &&
    identity.user &&
    identity.user.token &&
    identity.user.token.access_token;
  const email = identity && identity.user && identity.user.email;
  const [parameters, error] = useParameters(email, token);
  const [stateForm, addParameter] = useModifyParameters(
    toggleAlert,
    token,
    email
  );
  const [state, setState] = useFormState(initialState);

  const isLoggedIn = identity && identity.isLoggedIn;

  useEffect(() => {
    if (parameters) {
      setState({
        income: parameters.income?.value || initialState.income,
        debtQuota: parameters.debt?.value || initialState.debtQuota,
        debtTotal: parameters.debt?.total || initialState.debtTotal,
        saving: parameters.saving?.value || initialState.saving,
      });
    }
  }, [parameters]);

  if (!isLoggedIn) {
    return <Redirect noThrow={true} to="/" />;
  }

  const getErrorMessages = (type) => {
    let messages = null;
    if (state.income < 0 && type === "income") {
      messages = {
        income: "Debes asignar un valor mayor que cero",
      };
    }
    if (type === "debt") {
      if (state.debtQuota < 0) {
        messages = {
          ...messages,
          debtQuota: "Debes asignar un valor mayor que cero",
        };
      }
      if (state.debtTotal < 0) {
        messages = {
          ...messages,
          debtTotal: "Debes asignar un valor mayor que cero",
        };
      }
      if (Number(state.debtQuota) > Number(state.debtTotal)) {
        messages = {
          ...messages,
          debtQuota:
            "El valor de la cuota no puede ser mayor que el valor total de la deuda",
        };
      }
    }
    if (state.saving < 0 && type === "saving") {
      messages = {
        ...messages,
        saving: "Debes asignar un valor mayor que cero",
      };
    }
    return messages;
  };

  const handleSubmit = (type) => {
    const errorMessages = getErrorMessages(type);
    if (errorMessages) {
      return sendFormErrors(errorMessages);
    }
    const date = new Date();
    let parameter = {
      timestamp: date.getTime(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      username: email,
      name: type,
    };
    if (type === "income") {
      parameter = {
        ...parameter,
        value: state.income,
      };
    } else if (type === "debt") {
      parameter = {
        ...parameter,
        value: state.debtQuota,
        total: state.debtTotal,
      };
    } else if (type === "saving") {
      parameter = {
        ...parameter,
        value: state.saving,
      };
    }
    addParameter(parameter);
  };

  if (error) {
    return <Redirect noThrow={true} to="/error" />;
  }

  return (
    <Grid item xs={12} className={classes.wrapper}>
      <Typography variant={isSmallScreen ? "h2" : "h3"}>Cuenta</Typography>
      <Grid container className={classes.content}>
        <div className={classes.field}>
          <FormControl
            className={classes.formControl}
            error={!!stateError.errorMessages?.income}
          >
            <CurrencyFormat
              value={state.income}
              customInput={TextField}
              label="Ingresos mensuales"
              thousandSeparator={true}
              prefix={"$"}
              onValueChange={(values) => {
                const { value } = values;
                setState({ income: value });
              }}
              error={!!stateError.errorMessages?.income}
            />
            <FormHelperText>{stateError.errorMessages?.income}</FormHelperText>
          </FormControl>
          <Button onClick={() => handleSubmit("income")} color="secondary">
            Guardar
          </Button>
        </div>
        <div className={classes.field}>
          <FormControl
            className={classes.formControl}
            error={!!stateError.errorMessages?.debtQuota}
          >
            <CurrencyFormat
              value={state.debtQuota}
              customInput={TextField}
              label="Pago mensual"
              thousandSeparator={true}
              prefix={"$"}
              onValueChange={(values) => {
                const { value } = values;
                setState({ debtQuota: value });
              }}
              error={!!stateError.errorMessages?.debtQuota}
            />
            <FormHelperText>
              {stateError.errorMessages?.debtQuota}
            </FormHelperText>
          </FormControl>
          <FormControl
            className={classes.formControl}
            error={!!stateError.errorMessages?.debtTotal}
          >
            <CurrencyFormat
              value={state.debtTotal}
              customInput={TextField}
              label="Total Deudas"
              thousandSeparator={true}
              prefix={"$"}
              onValueChange={(values) => {
                const { value } = values;
                setState({ debtTotal: value });
              }}
              error={!!stateError.errorMessages?.debtTotal}
            />
            <FormHelperText>
              {stateError.errorMessages?.debtTotal}
            </FormHelperText>
          </FormControl>
          <Button onClick={() => handleSubmit("debt")} color="secondary">
            Guardar
          </Button>
        </div>
        <div className={classes.field}>
          <FormControl
            className={classes.formControl}
            error={!!stateError.errorMessages?.saving}
          >
            <CurrencyFormat
              value={state.saving}
              customInput={TextField}
              label="Ahorros mensuales"
              thousandSeparator={true}
              prefix={"$"}
              onValueChange={(values) => {
                const { value } = values;
                setState({ saving: value });
              }}
              error={!!stateError.errorMessages?.saving}
            />
            <FormHelperText>{stateError.errorMessages?.saving}</FormHelperText>
          </FormControl>
          <Button onClick={() => handleSubmit("saving")} color="secondary">
            Guardar
          </Button>
        </div>
      </Grid>
      <CustomAlert
        open={openAlert}
        handleClose={toggleAlert}
        severity={stateForm.success ? "success" : "error"}
      >
        {stateForm.message}
      </CustomAlert>
    </Grid>
  );
};

export default Account;
