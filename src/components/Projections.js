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
import AddProjectionDialog from "./AddProjectionDialog";
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

const Projections = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const toggleDialog = () => setOpen(!open);

  const classes = useStyles();
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
        <Projection name="January 2021" />
        <Projection name="Dicember 2020" />
        <Projection name="November 2020" />
      </List>
      <AddProjectionDialog open={open} handleClose={toggleDialog} />
    </Grid>
  );
};

export default Projections;
