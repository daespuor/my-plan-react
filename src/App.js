import React from "react";
import { Router } from "@reach/router";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Charts from "./components/Charts";
import Projections from "./components/Projections";
import ProjectionItems from "./components/ProjectionItems";
import Expenses from "./components/Expenses";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Error from "./components/Error";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <NavBar />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Router>
            <Charts path="/" />
            <ProjectionItems path="/projections/:id" />
            <Projections path="/projections" />
            <Expenses path="/expenses" />
            <Error path="/error" />
          </Router>
          <Footer />
        </Container>
      </main>
    </div>
  );
}
