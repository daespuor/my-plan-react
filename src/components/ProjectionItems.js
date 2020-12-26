import {
  Button,
  Grid,
  IconButton,
  LinearProgress,
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

const LOADING_PROJECTION_ITEMS = "LOADING_PROJECTION_ITEMS";
const ERROR_PROJECTION_ITEMS = "ERROR_PROJECTION_ITEMS";
const SUCCESS_PROJECTION_ITEMS = "SUCCESS_PROJECTION_ITEMS";
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
  button: {
    margin: theme.spacing(1),
  },
}));

const initialState = {
  loading: false,
  error: null,
  projectionItems: [],
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
  if (type == SUCCESS_PROJECTION_ITEMS) {
    return {
      ...state,
      loading: false,
      projectionItems: action.payload.projectionItems,
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
  if (type == ERROR_SAVE) {
    return {
      success: false,
      error: true,
      message: action.payload.error,
    };
  }

  return state;
};

const useProjectionItems = (projectionId) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadProjectionItems = () => {
    dispatch({ type: LOADING_PROJECTION_ITEMS });
    fetch(`${BASE_URL}/get-projection-items?projectionId=${projectionId}`)
      .then((response) => response.json())
      .then((response) => {
        dispatch({
          type: SUCCESS_PROJECTION_ITEMS,
          payload: { projectionItems: response },
        });
      })
      .catch((error) =>
        dispatch({ type: ERROR_PROJECTION_ITEMS, payload: { error } })
      );
  };

  const loadProjection = () => {
    dispatch({ type: LOADING_PROJECTION });
    fetch(`${BASE_URL}/get-projection?projectionId=${projectionId}`)
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

const useAddProjectionItem = (toggleAlert, loadProjectionItems) => {
  const [state, dispatch] = useReducer(reducerForm, initialFormState);
  const { message, error } = state;
  const addProjectionItem = (projectionItem) => {
    fetch(`${BASE_URL}/add-projection-items`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
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

  useEffect(() => {
    if (message) {
      toggleAlert();
      if (!error) {
        loadProjectionItems();
      }
    }
  }, [message, error]);

  return [state, addProjectionItem];
};

const ProjectionItems = ({ id }) => {
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const toggleDialog = () => setOpen(!open);
  const toggleAlert = () => setOpenAlert(!openAlert);
  const [state, loadProjectionItems] = useProjectionItems(id);
  const [stateAddProjectionItem, addProjectionItem] = useAddProjectionItem(
    toggleAlert,
    loadProjectionItems
  );
  const goToProjections = () => navigate("/projections");
  const { projectionItems, error, loading, projection } = state;
  const name = projection
    ? `${months[projection.month - 1]} ${projection.year}`
    : "";

  if (error) {
    return <Redirect to="/error" />;
  }

  return (
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
        Projection {name} Items
      </Typography>
      <Button
        size="large"
        variant="contained"
        color="primary"
        onClick={toggleDialog}
        className={classes.button}
      >
        Add Item
      </Button>
      <List className={classes.list}>
        {loading && <LinearProgress color="secondary" />}
        {projectionItems.length &&
          projectionItems.map((projectionItem) => {
            const { id } = projectionItem.ref["@ref"];
            const { category, minValue, maxValue } = projectionItem;
            const categoryElement = categories.find((c) => c.name === category);
            const { icon, label } = categoryElement;
            return (
              <ProjectionItem
                category={label}
                minValue={minValue}
                maxValue={maxValue}
                icon={icon}
                key={id}
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
  );
};

export default ProjectionItems;
