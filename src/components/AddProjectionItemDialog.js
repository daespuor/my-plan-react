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
  minValue: 0,
  maxValue: 0,
};

const AddProjectionItemDialog = ({ open, handleClose }) => {
  const classes = useStyles();
  const [state, setState] = useFormState(initialState);
  const [icon, hasMaxValue] = useCategoryChange(state.category);

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
      aria-labelledby="add-projection-item-title"
    >
      <DialogTitle id="add-projection-item-title">
        Add Projection Item
      </DialogTitle>
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
            label="$ Minimum Value"
            id="min-value"
            name="minValue"
            value={state.minValue}
            onChange={handleInputChange}
          />
        </FormControl>
        {hasMaxValue && (
          <FormControl className={classes.formControl}>
            <TextField
              type="text"
              label="$ Maximum Value"
              id="max-value"
              name="maxValue"
              value={state.maxValue}
              onChange={handleInputChange}
            />
          </FormControl>
        )}
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

export default AddProjectionItemDialog;
