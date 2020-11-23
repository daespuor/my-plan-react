import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Icon,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import React from "react";
import useCategoryChange from "../useCategoryChange";
import useFormState from "../useFormState";
import categories from "../utils/categories";

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
  value: 0,
  date: new Date(),
};

const AddExpensesDialog = ({ open, handleClose }) => {
  const classes = useStyles();
  const [state, setState] = useFormState(initialState);
  const [icon] = useCategoryChange(state.category);

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
      aria-labelledby="add-expense-title"
    >
      <DialogTitle id="add-expense-title">Add Expense</DialogTitle>
      <DialogContent>
        <Avatar className={classes.avatar}>
          <Icon>{icon}</Icon>
        </Avatar>
        <FormControl className={classes.formControl}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            name="category"
            value={state.category}
            onChange={handleInputChange}
          >
            {categories.map((category) => {
              return (
                <MenuItem value={category.name} key={category.name}>
                  {category.label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            type="text"
            label="$ Value"
            id="value"
            name="value"
            value={state.value}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date picker inline"
            value={state.date}
            onChange={(date) => setState({ date })}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
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

export default AddExpensesDialog;
