import React, { useState } from "react";
import { Link, makeStyles } from "@material-ui/core";
import { useSpring, animated, useTransition } from "react-spring";
import WarningIcon from "@material-ui/icons/Warning";

const useStyle = makeStyles((theme) => ({
  modal: {
    width: "350px",
    minHeight: "50px",
    top: "70px",
    left: "auto",
    right: "20px",
    color: "#ffffff",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    margin: "0 0 15px",
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    position: "fixed",
    justifyContent: "space-between",
    borderRadius: "12px",
    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.65)",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    right: "0",
  },
  wrapper: {
    position: "relative",
    width: "100%",
    zIndex: "2",
  },
  content: {
    width: "70%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const BeatifulAlert = ({ children, toggleOpen, open }) => {
  const classes = useStyle();
  const transitions = useTransition(open, null, {
    from: { position: "absolute", opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });
  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <animated.div style={props} className={classes.wrapper} key={key}>
          <div className={classes.modal}>
            <div className={classes.content}>
              <WarningIcon style={{ marginRight: "10px" }} />
              {children}
            </div>
            <Link style={{ color: "white" }} href="#" onClick={toggleOpen}>
              CERRAR
            </Link>
          </div>
        </animated.div>
      )
  );
};

export default BeatifulAlert;
