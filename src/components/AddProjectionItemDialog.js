import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Icon,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import React from "react";
import useCategoryChange from "../useCategoryChange";
import { useFormError } from "../useFormError";
import useFormState from "../useFormState";
import categories from "../utils/categories";
import CurrencyFormat from "react-currency-format";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: "80%",
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const initialState = {
  category: "",
  minValue: 0,
  maxValue: 0,
};

const AddProjectionItemDialog = ({
  open,
  handleClose,
  addProjectionItem,
  projectionId,
}) => {
  const classes = useStyles();
  const [state, setState] = useFormState(initialState);
  const [stateError, sendFormErrors, cleanErrors] = useFormError();
  const [icon, hasMaxValue] = useCategoryChange(state.category);

  const handleInputChange = (event) => {
    setState({
      [event.target.name]: event.target.value,
    });
  };

  const getErrorMessages = () => {
    let messages = null;
    if (state.minValue === "" || state.minValue === 0) {
      messages = {
        minValue: "Debes asignar un valor mínimo",
      };
    }
    if (state.category === "") {
      messages = {
        ...messages,
        category: "Debes escoger una categoría",
      };
    }
    if (isNaN(state.minValue)) {
      messages = {
        minValue: "El valor mínimo debe ser un numero válido",
      };
    }
    if (isNaN(state.maxValue)) {
      messages = {
        maxValue: "El valor máximo debe ser un numero válido",
      };
    }
    if (state.maxValue !== 0 && state.maxValue < state.minValue) {
      messages = {
        maxValue: "El valor máximo debe ser mayor que el valor mínimo",
      };
    }
    return messages;
  };

  const handleSubmit = () => {
    const errorMessages = getErrorMessages();
    if (errorMessages) {
      return sendFormErrors(errorMessages);
    }
    const projectionItem = {
      category: state.category,
      minValue: state.minValue,
      maxValue: state.maxValue ? state.maxValue : state.minValue,
      projectionRef: projectionId,
      createdAt: new Date(),
    };
    cleanForm();
    addProjectionItem(projectionItem);
  };

  const cleanForm = () => {
    setState(initialState);
    cleanErrors();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      aria-labelledby="add-projection-item-title"
    >
      <DialogTitle id="add-projection-item-title">
        Añadir Item Proyección
      </DialogTitle>
      <DialogContent>
        <Avatar className={classes.avatar}>
          <Icon>{icon}</Icon>
        </Avatar>
        <FormControl
          className={classes.formControl}
          error={!!stateError.errorMessages?.category}
        >
          <InputLabel id="category-select-label">Categoria</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            name="category"
            value={state.category}
            onChange={handleInputChange}
            error={!!stateError.errorMessages?.category}
          >
            {categories.map((category) => {
              return (
                <MenuItem value={category.name} key={category.name}>
                  {category.label}
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText>{stateError.errorMessages?.category}</FormHelperText>
        </FormControl>
        <FormControl
          className={classes.formControl}
          error={!!stateError.errorMessages?.minValue}
        >
          <CurrencyFormat
            value={state.minValue}
            customInput={TextField}
            label="Valor mínimo"
            thousandSeparator={true}
            prefix={"$"}
            onValueChange={(values) => {
              const { value } = values;
              setState({
                minValue: value,
              });
            }}
          />
          <FormHelperText>{stateError.errorMessages?.minValue}</FormHelperText>
        </FormControl>
        {hasMaxValue && (
          <FormControl
            className={classes.formControl}
            error={!!stateError.errorMessages?.maxValue}
          >
            <CurrencyFormat
              value={state.maxValue}
              customInput={TextField}
              label="Valor máximo"
              thousandSeparator={true}
              prefix={"$"}
              onValueChange={(values) => {
                const { value } = values;
                setState({
                  maxValue: value,
                });
              }}
            />
            <FormHelperText>
              {stateError.errorMessages?.maxValue}
            </FormHelperText>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProjectionItemDialog;
