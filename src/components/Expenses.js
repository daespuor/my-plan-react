import {
  Button,
  Grid,
  List,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useState } from "react";
import Expense from "./Expense";
import AddExpensesDialog from "./AddExpensesDialog";

const useStyles = makeStyles((theme) => ({
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up("lg")]: {
      padding: theme.spacing(2),
    },
  },
}));

const Expenses = () => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const toggleDialog = () => setOpen(!open);

  return (
    <Grid item xs={12} className={classes.list}>
      <Typography variant={isSmallScreen ? "h2" : "h3"}>Expenses</Typography>
      <List className={classes.list}>
        <Expense
          category={"Vacations"}
          icon={"beach_access"}
          value={200}
          date={"01/12/2020"}
        />
        <Expense
          category={"Legos"}
          icon={"games"}
          value={300}
          date={"01/04/2020"}
        />
        <Expense
          category={"Food"}
          icon={"fastfood"}
          value={200}
          date={"05/01/2020"}
        />
      </List>
      <Button
        size="large"
        variant="contained"
        color="primary"
        onClick={toggleDialog}
      >
        Add Item
      </Button>
      <AddExpensesDialog handleClose={toggleDialog} open={open} />
    </Grid>
  );
};

export default Expenses;
