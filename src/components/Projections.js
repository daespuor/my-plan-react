import {
  Button,
  Grid,
  LinearProgress,
  List,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Redirect } from "@reach/router";
import React, { useEffect, useReducer, useState } from "react";
import { BASE_URL } from "../utils/api";
import months from "../utils/months";
import AddProjectionDialog from "./AddProjectionDialog";
import CustomAlert from "./CustomAlert";
import Projection from "./Projection";

const useStyles = makeStyles((theme) => ({
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up("lg")]: {
      padding: theme.spacing(2),
    },
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const LOADING_PROJECTIONS = "LOADING_PROJECTIONS";
const ERROR_PROJECTIONS = "ERROR_PROJECTIONS";
const SUCCESS_PROJECTIONS = "SUCCESS_PROJECTIONS";
const SUCCESS_SAVE = "SUCCESS_SAVE";
const ERROR_SAVE = "ERROR_SAVE";

const initialState = {
  loading: false,
  error: null,
  projections: null,
};

const initialFormState = {
  success: false,
  error: false,
  message: null,
};

const reducer = (state = initialState, action) => {
  const { type } = action;
  if (type == LOADING_PROJECTIONS) {
    return {
      ...state,
      loading: true,
    };
  }
  if (type == SUCCESS_PROJECTIONS) {
    return {
      ...state,
      loading: false,
      projections: action.payload.projections,
    };
  }
  if (type == ERROR_PROJECTIONS) {
    return {
      ...state,
      loading: false,
      error: action.payload.error,
    };
  }
};

const reducerForm = (state = initialFormState, action) => {
  const { type } = action;
  if (type == SUCCESS_SAVE) {
    return {
      error: null,
      success: true,
      message: "Proyección guardada con éxito!",
    };
  }
  if (type == ERROR_SAVE) {
    return {
      success: false,
      error: true,
      message: action.payload.error,
    };
  }

  return state;
};

const useProjections = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadProjections = () => {
    dispatch({ type: LOADING_PROJECTIONS });
    fetch(`${BASE_URL}/get-projections?username=Test`)
      .then((response) => response.json())
      .then((response) => {
        dispatch({
          type: SUCCESS_PROJECTIONS,
          payload: { projections: response },
        });
      })
      .catch((error) =>
        dispatch({ type: ERROR_PROJECTIONS, payload: { error } })
      );
  };

  useEffect(() => {
    loadProjections();
  }, []);

  return [state, loadProjections];
};

const useAddProjection = (toggleAlert, loadProjections) => {
  const [state, dispatch] = useReducer(reducerForm, initialFormState);
  const { message, error } = state;
  const addProjection = (projection) => {
    fetch(`${BASE_URL}/add-projections`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projection,
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
    if (message) {
      toggleAlert();
      if (!error) {
        loadProjections();
      }
    }
  }, [message, error]);

  return [state, addProjection];
};

const Projections = () => {
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const toggleDialog = () => setOpen(!open);
  const toggleAlert = () => setOpenAlert(!openAlert);
  const [state, loadProjections] = useProjections();
  const classes = useStyles();
  const [stateAddProjection, addProjection] = useAddProjection(
    toggleAlert,
    loadProjections
  );
  const { projections, loading, error } = state;

  if (error) {
    return <Redirect to="/error" />;
  }

  return (
    <Grid item xs={12} className={classes.list}>
      <Typography variant={isSmallScreen ? "h2" : "h3"}>Projections</Typography>
      <Button
        size="large"
        variant="contained"
        color="primary"
        onClick={toggleDialog}
        className={classes.button}
      >
        Add Projection
      </Button>
      <List className={classes.list}>
        {loading && <LinearProgress color="secondary" />}
        {projections &&
          projections.map((projection) => {
            const name = `${months[projection.month - 1]} ${projection.year}`;
            return <Projection name={name} key={name} />;
          })}
      </List>
      <AddProjectionDialog
        open={open}
        handleClose={toggleDialog}
        addProjection={addProjection}
      />
      <CustomAlert
        open={openAlert}
        handleClose={toggleAlert}
        severity={stateAddProjection.success ? "success" : "error"}
      >
        {stateAddProjection.message}
      </CustomAlert>
    </Grid>
  );
};

export default Projections;
