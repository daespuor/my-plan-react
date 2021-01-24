import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import { ShowChart as ShowChartIcon } from "@material-ui/icons";
import { Link } from "@reach/router";
import { List, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const NavItems = ({ isLoggedIn }) => {
  const classes = useStyles();
  return (
    <List>
      <Link to="/" className={classes.link}>
        <ListItem button>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
      </Link>
      {isLoggedIn && (
        <Link to="/projections" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <ShowChartIcon />
            </ListItemIcon>
            <ListItemText primary="Proyecciones" />
          </ListItem>
        </Link>
      )}
      {/* <Link to="/expenses" className={classes.link}>
        <ListItem button>
          <ListItemIcon>
            <MoneyIcon />
          </ListItemIcon>
          <ListItemText primary="Expenses" />
        </ListItem>
      </Link> */}
    </List>
  );
};

export default NavItems;
