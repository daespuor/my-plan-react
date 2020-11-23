import {
  Avatar,
  Icon,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const getValueText = (minValue, maxValue) => {
  let result = `$${minValue}`;
  if (maxValue) {
    result = `${result} - $${maxValue}`;
  }
  return result;
};

const ProjectionItem = ({ category, minValue, maxValue, icon }) => {
  const classes = useStyles();
  const valueText = getValueText(minValue, maxValue);
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar className={classes.avatar}>
          <Icon>{icon || "emoji_emotions"}</Icon>
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={category} secondary={valueText} />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" title="delete">
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default ProjectionItem;
