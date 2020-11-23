import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";
import React from "react";
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

const AddProjectionDialog = ({ open, handleClose }) => {
  const classes = useStyles();
  const [state, setState] = useFormState(initialState);

  const handleInputChange = (event) => {
    setState({
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      aria-labelledby="add-projection-title"
    >
      <DialogTitle id="add-projection-title">Add Projection</DialogTitle>
      <DialogContent>
        <FormControl className={classes.formControl}>
          <InputLabel id="months-select-label">Months</InputLabel>
          <Select
            labelId="months-select-label"
            id="months-select"
            name="month"
            value={state.month}
            onChange={handleInputChange}
          >
            {months.map((month) => {
              return (
                <MenuItem value={month.toString().toLowerCase()} key={month}>
                  {month}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="years-select-label">Years</InputLabel>
          <Select
            labelId="years-select-label"
            id="years-select"
            name="year"
            value={state.year}
            onChange={handleInputChange}
          >
            {getYears(INITIAL_YEAR, FINAL_YEAR).map((year) => {
              return (
                <MenuItem value={year.toString().toLowerCase()} key={year}>
                  {year}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClose} color="primary">
          Subscribe
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProjectionDialog;
