import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";
import React from "react";
import { useFormError } from "../useFormError";
import useFormState from "../useFormState";
import months from "../utils/months";
import getYears from "../utils/years";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: "80%",
  },
}));

const INITIAL_YEAR = 2018;
const FINAL_YEAR = 2040;

const initialState = {
  month: "",
  year: "",
};

const AddProjectionDialog = ({ open, handleClose, addProjection }) => {
  const classes = useStyles();
  const [state, setState] = useFormState(initialState);
  const [stateError, sendFormErrors, cleanErrors] = useFormError();
  const handleInputChange = (event) => {
    setState({
      [event.target.name]: event.target.value,
    });
  };

  const getErrorMessages = () => {
    let messages = null;
    if (state.month === "" || state.month === 0) {
      messages = {
        month: "Debes escoger un mes de la lista",
      };
    }
    if (state.year === "" || state.year === 0) {
      messages = {
        ...messages,
        year: "Debes escoger un año de la lista",
      };
    }
    return messages;
  };

  const handleSubmit = () => {
    const errorMessages = getErrorMessages();
    if (errorMessages) {
      return sendFormErrors(errorMessages);
    }
    const projection = {
      username: "Test",
      month: state.month,
      year: state.year,
      createdAt: new Date(),
    };
    cleanForm();
    addProjection(projection);
  };

  const cleanForm = () => {
    setState(initialState);
    cleanErrors();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={cleanForm}
      fullWidth={true}
      aria-labelledby="add-projection-title"
    >
      <DialogTitle id="add-projection-title">Add Projection</DialogTitle>
      <DialogContent>
        <FormControl
          className={classes.formControl}
          error={!!stateError.errorMessages?.month}
        >
          <InputLabel id="months-select-label">Months</InputLabel>
          <Select
            labelId="months-select-label"
            id="months-select"
            name="month"
            value={state.month}
            onChange={handleInputChange}
            error={!!stateError.errorMessages?.month}
          >
            {months.map((month, index) => {
              return (
                <MenuItem value={index + 1} key={month}>
                  {month}
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText>{stateError.errorMessages?.month}</FormHelperText>
        </FormControl>
        <FormControl
          className={classes.formControl}
          error={!!stateError.errorMessages?.year}
        >
          <InputLabel id="years-select-label">Years</InputLabel>
          <Select
            labelId="years-select-label"
            id="years-select"
            name="year"
            value={state.year}
            onChange={handleInputChange}
            error={!!stateError.errorMessages?.year}
          >
            {getYears(INITIAL_YEAR, FINAL_YEAR).map((year) => {
              return (
                <MenuItem value={year.toString().toLowerCase()} key={year}>
                  {year}
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText>{stateError.errorMessages?.year}</FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={cleanForm} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProjectionDialog;
