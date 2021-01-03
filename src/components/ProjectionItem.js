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
import React, { useState } from "react";
import { currencyFormatter } from "../utils/format";
import ConfirmDialog from "./ConfirmDialog";

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const getValueText = (minValue, maxValue) => {
  let result = `${currencyFormatter.format(minValue)}`;
  if (maxValue) {
    result = `${currencyFormatter.format(
      minValue
    )} - ${currencyFormatter.format(maxValue)}`;
  }
  return result;
};

const ProjectionItem = ({
  category,
  minValue,
  maxValue,
  icon,
  onDelete,
  id,
}) => {
  const classes = useStyles();
  const valueText = getValueText(minValue, maxValue);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const toggleDeleteDialog = () => setDeleteOpen(!deleteOpen);
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar className={classes.avatar}>
          <Icon>{icon || "emoji_emotions"}</Icon>
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={category} secondary={valueText} />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="delete"
          title="delete"
          onClick={toggleDeleteDialog}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
      <ConfirmDialog
        open={deleteOpen}
        handleClose={toggleDeleteDialog}
        handleAgree={() => onDelete(id)}
      />
    </ListItem>
  );
};

export default ProjectionItem;
