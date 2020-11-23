import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import React from "react";
import { render } from "react-dom";
import App from "./App";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

render(
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <App />
  </MuiPickersUtilsProvider>,
  document.getElementById("root")
);
