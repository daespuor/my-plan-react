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
import React, { useState } from "react";
import ProjectionItem from "./ProjectionItem";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { navigate } from "@reach/router";
import AddProjectionItemDialog from "./AddProjectionItemDialog";

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

const ProjectionItems = () => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const toggleDialog = () => setOpen(!open);

  const goToProjections = () => navigate("/projections");

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
        Projection 1 Items
      </Typography>
      <List className={classes.list}>
        <ProjectionItem category={"Vacations"} minValue={100} maxValue={200} />
        <ProjectionItem category={"Food"} minValue={100} maxValue={200} />
        <ProjectionItem category={"Legos"} minValue={100} maxValue={200} />
      </List>
      <Button
        size="large"
        variant="contained"
        color="primary"
        onClick={toggleDialog}
      >
        Add Item
      </Button>
      <AddProjectionItemDialog handleClose={toggleDialog} open={open} />
    </Grid>
  );
};

export default ProjectionItems;
