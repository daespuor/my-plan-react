import React from "react";
// eslint-disable-next-line import/no-unresolved
import { useIdentityContext } from "react-netlify-identity";
import { Typography } from "@material-ui/core";

/*const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));*/

const Charts = () => {
  //const classes = useStyles();
  //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const identity = useIdentityContext();
  const name =
    identity &&
    identity.user &&
    identity.user.user_metadata &&
    identity.user.user_metadata.full_name;
  return (
    <>
      {name ? (
        <Typography variant="h2">Bienvenid@ {name}!</Typography>
      ) : (
        <Typography variant="h2">Ingresa al sitio por favor!</Typography>
      )}
      {/* <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}>
            <Chart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}>
            <Deposits />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Orders />
          </Paper>
        </Grid>
      </Grid> */}
    </>
  );
};

export default Charts;
