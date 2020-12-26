import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import React from "react";
import { Link } from "@reach/router";
const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
}));
const Projection = ({ name, projectionId }) => {
  const classes = useStyles();
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar className={classes.avatar}>
          <MonetizationOnIcon />
        </Avatar>
      </ListItemAvatar>
      <Link
        to={`/projections/${projectionId}`}
        title={`projection-${projectionId}`}
        className={classes.link}
      >
        <ListItemText primary={name} />
      </Link>
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" title="delete">
          <DeleteIcon />
        </IconButton>
        <IconButton edge="end" aria-label="copy" title="copy">
          <FileCopyIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default Projection;
