import {
  Button,
  Grid,
  IconButton,
  List,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useEffect, useReducer, useState } from "react";
import ProjectionItem from "./ProjectionItem";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { navigate, Redirect } from "@reach/router";
import AddProjectionItemDialog from "./AddProjectionItemDialog";
import { BASE_URL } from "../utils/api";
import months from "../utils/months";
import CustomAlert from "./CustomAlert";
import categories from "../utils/categories";
import { currencyFormatter } from "../utils/format";
// eslint-disable-next-line import/no-unresolved
import { useIdentityContext } from "react-netlify-identity";
import BeatifulAlert from "./BeatifulAlert";
import LoadingOverlay from "./LoadingOverlay";

const LOADING_PROJECTION_ITEMS = "LOADING_PROJECTION_ITEMS";
const ERROR_PROJECTION_ITEMS = "ERROR_PROJECTION_ITEMS";
const SUCCESS_PROJECTION_ITEMS = "SUCCESS_PROJECTION_ITEMS";
const ERROR_DELETE = "ERROR_DELETE";
const SUCCESS_DELETE = "SUCCESS_DELETE";
const ERROR_PROJECTION = "ERROR_PROJECTION";
const SUCCESS_PROJECTION = "SUCCESS_PROJECTION";
const LOADING_PROJECTION = "LOADING_PROJECTION";
const SUCCESS_SAVE = "SUCCESS_SAVE";
const ERROR_SAVE = "ERROR_SAVE";

const useStyles = makeStyles((theme) => ({
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up("lg")]: {
      padding: theme.spacing(2),
    },
  },
  titles: {
    display: "flex",
    justifyContent: "space-between",
    margin: "20px 0",
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const initialState = {
  loading: false,
  error: null,
  projectionItems: [],
  totalMaxValue: 0,
  totalMinValue: 0,
  projection: null,
};

const initialFormState = {
  success: false,
  error: false,
  message: null,
};

const reducer = (state = initialState, action) => {
  const { type } = action;
  if (type == LOADING_PROJECTION_ITEMS || type == LOADING_PROJECTION) {
    return {
      ...state,
      loading: true,
    };
  }
  if (type === SUCCESS_PROJECTION_ITEMS) {
    const { projectionItems } = action.payload;
    let totalMinValue = 0,
      totalMaxValue = 0;
    if (projectionItems.length > 0) {
      totalMinValue = projectionItems
        .map((item) => Number(item.minValue))
        .reduce((total, value) => total + value, 0);
      totalMaxValue = projectionItems
        .map((item) => Number(item.maxValue))
        .reduce((total, value) => total + value, 0);
    }
    return {
      ...state,
      loading: false,
      projectionItems,
      totalMinValue,
      totalMaxValue,
    };
  }
  if (type == SUCCESS_PROJECTION) {
    return {
      ...state,
      loading: false,
      projection: action.payload.projection,
    };
  }
  if (type == ERROR_PROJECTION_ITEMS || type == ERROR_PROJECTION) {
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
      message: "Item guardado con éxito!",
    };
  }
  if (type === SUCCESS_DELETE) {
    return {
      error: null,
      success: true,
      message: "Item eliminado con éxito!",
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
  const [parameters, setParameters] = useState({});
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

const useProjectionItems = (projectionId, token) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadProjectionItems = () => {
    dispatch({ type: LOADING_PROJECTION_ITEMS });
    fetch(`${BASE_URL}/get-projection-items?projectionId=${projectionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        dispatch({
          type: SUCCESS_PROJECTION_ITEMS,
          payload: {
            projectionItems: response,
          },
        });
      })
      .catch((error) =>
        dispatch({ type: ERROR_PROJECTION_ITEMS, payload: { error } })
      );
  };

  const loadProjection = () => {
    dispatch({ type: LOADING_PROJECTION });
    fetch(`${BASE_URL}/get-projection?projectionId=${projectionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        dispatch({
          type: SUCCESS_PROJECTION,
          payload: { projection: response },
        });
      })
      .catch((error) =>
        dispatch({ type: ERROR_PROJECTION, payload: { error } })
      );
  };

  useEffect(() => {
    loadProjectionItems();
    loadProjection();
  }, []);

  return [state, loadProjectionItems];
};

const useModifyProjectionItem = (toggleAlert, loadProjectionItems, token) => {
  const [state, dispatch] = useReducer(reducerForm, initialFormState);
  const addProjectionItem = (projectionItem) => {
    fetch(`${BASE_URL}/add-projection-items`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        projectionItem,
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

  const deleteProjectionItem = (projectionItemId) => {
    fetch(
      `${BASE_URL}/delete-projection-items?projectionItemId=${projectionItemId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (response.status == "200") {
          dispatch({ type: SUCCESS_DELETE });
        } else {
          dispatch({
            type: ERROR_DELETE,
            payload: { error: response.statusText },
          });
        }
      })
      .catch((error) => dispatch({ type: ERROR_DELETE, payload: { error } }));
  };

  useEffect(() => {
    const { message, error } = state;
    if (message) {
      toggleAlert();
      if (!error) {
        loadProjectionItems();
      }
    }
  }, [state]);

  return [state, addProjectionItem, deleteProjectionItem];
};

const ProjectionItems = ({ id }) => {
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const toggleDialog = () => setOpen(!open);
  const toggleAlert = () => setOpenAlert(!openAlert);
  const identity = useIdentityContext();
  const token =
    identity &&
    identity.user &&
    identity.user.token &&
    identity.user.token.access_token;
  const email = identity && identity.user && identity.user.email;
  const [state, loadProjectionItems] = useProjectionItems(id, token);
  const [
    stateAddProjectionItem,
    addProjectionItem,
    deleteProjectionItem,
  ] = useModifyProjectionItem(toggleAlert, loadProjectionItems, token);
  const [parameters] = useParameters(email, token);
  const [moneyWarning, setMoneyWarning] = useState(false);
  const { income, debt, saving } = parameters;
  const goToProjections = () => navigate("/projections");
  const toggleMoneyWarning = () => setMoneyWarning(!moneyWarning);
  const {
    projectionItems,
    error,
    loading,
    projection,
    totalMaxValue,
    totalMinValue,
  } = state;
  const name = projection
    ? `${months[projection.month - 1]} ${projection.year}`
    : "";

  const isLoggedIn = identity && identity.isLoggedIn;

  const totalMessage =
    totalMinValue !== totalMaxValue
      ? `${currencyFormatter.format(
          totalMinValue
        )} - ${currencyFormatter.format(totalMaxValue)}`
      : currencyFormatter.format(totalMinValue);
  const valueRoof =
    Number(income?.value) -
    Number(saving?.value) -
    Number(debt?.value) -
    totalMaxValue;

  useEffect(() => {
    if (valueRoof <= 0) {
      toggleMoneyWarning();
    }
  }, [valueRoof]);

  if (!isLoggedIn) {
    return <Redirect noThrow={true} to="/" />;
  }

  if (error) {
    return <Redirect noThrow={true} to="/error" />;
  }
  return (
    <>
      <BeatifulAlert toggleOpen={toggleMoneyWarning} open={moneyWarning}>
        Has alcanzado el limite planeado! Procura ajustar tu planeación
      </BeatifulAlert>
      <Grid item xs={12} className={classes.list}>
        <IconButton
          edge="end"
          aria-label="go-projections"
          title="go-projections"
          onClick={goToProjections}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant={isSmallScreen ? "h2" : "h3"}>
          Proyección {name}
        </Typography>
        <Grid item xs={12} className={classes.titles}>
          <Typography variant="h6">Total {totalMessage}</Typography>
          {!Number.isNaN(valueRoof) && (
            <Typography
              variant="h6"
              color={valueRoof > 0 ? "primary" : "secondary"}
            >
              {`${currencyFormatter.format(valueRoof)} Dinero disponible`}
            </Typography>
          )}
        </Grid>
        <Button
          size="large"
          variant="contained"
          color="primary"
          onClick={toggleDialog}
          className={classes.button}
        >
          Añadir Item
        </Button>
        <List className={classes.list}>
          {loading && <LoadingOverlay />}
          {projectionItems.length &&
            projectionItems.map((projectionItem) => {
              const { id } = projectionItem.ref["@ref"];
              const { category, minValue, maxValue } = projectionItem;
              const categoryElement = categories.find(
                (c) => c.name === category
              );
              const { icon, label } = categoryElement;
              return (
                <ProjectionItem
                  category={label}
                  minValue={minValue}
                  maxValue={maxValue}
                  icon={icon}
                  key={id}
                  id={id}
                  onDelete={deleteProjectionItem}
                />
              );
            })}
        </List>
        <AddProjectionItemDialog
          handleClose={toggleDialog}
          open={open}
          addProjectionItem={addProjectionItem}
          projectionId={id}
        />
        <CustomAlert
          open={openAlert}
          handleClose={toggleAlert}
          severity={stateAddProjectionItem.success ? "success" : "error"}
        >
          {stateAddProjectionItem.message}
        </CustomAlert>
      </Grid>
    </>
  );
};

export default ProjectionItems;
