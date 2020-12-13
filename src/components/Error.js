import {
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React from "react";
import ErrorImage from "../assets/images/error.svg";

const useStyles = makeStyles((theme) => ({
  error: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up("lg")]: {
      padding: theme.spacing(2),
    },
    textAlign: "center",
  },
  img: {
    width: "200px",
  },
}));

const Error = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Grid item xs={12} className={classes.error}>
      <img src={ErrorImage} alt="imagen error" className={classes.img} />
      <Typography variant={isSmallScreen ? "h2" : "h3"}>Error</Typography>
      <p>
        Opps!! Parece que ocurió un error. Por favor intenta de nuevo más tarde!
      </p>
    </Grid>
  );
};

export default Error;
