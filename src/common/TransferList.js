import React, { useEffect } from "react";
import {
  TextField,
  Button,
  Divider,
  Checkbox,
  ListItemIcon,
  ListItemText,
  ListItem,
  CardHeader,
  Card,
  List,
  Grid,
} from "@mui/material";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function TransferList({
  itemsLeft,
  itemsRight,
  titleLeft,
  titleRight,
  handleChange,
  showSearch,
  subObject,
  loading,
}) {
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);
  const [leftSearch, setLeftSearch] = React.useState("");
  const [rightSearch, setRightSearch] = React.useState("");

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  useEffect(() => {
    if (itemsLeft && itemsRight)
      setLeft(
        itemsLeft.filter(
          ({ id: id1 }) => !itemsRight.some(({ id: id2 }) => id1 === id2)
        )
      );
    if (itemsRight) {
      setRight(itemsRight);
    }
  }, [itemsLeft, itemsRight]);

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    handleChange(right.concat(leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
    handleChange(not(right, rightChecked));
  };

  const customList = (title, items, search, setSearch) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        style={{ padding: "0px" }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{ "aria-label": "all items selected" }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} селектирани`}
      />
      {showSearch && (
        <TextField
          fullWidth
          style={{ marginTop: "5px", marginBottom: "5px" }}
          label="Пребарај"
          value={search ? search : ""}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          variant="outlined"
          disabled={loading}
        />
      )}
      <Divider />
      <List
        sx={{
          width: 200,
          height: 230,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items
          .filter((x) => x[subObject]?.includes(search))
          .map((value) => {
            const labelId = `transfer-list-all-item-${value}-label`;

            return (
              <ListItem
                key={value.id}
                role="listitem"
                button
                style={{ padding: "0px" }}
                onClick={handleToggle(value)}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                    disabled={loading}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={value[subObject]} />
              </ListItem>
            );
          })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item md={5}>
        {customList(titleLeft, left, leftSearch, setLeftSearch)}
      </Grid>
      <Grid item md={2}>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            sx={{ my: 0.5 }}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{ my: 0.5 }}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item md={5}>
        {customList(titleRight, right, rightSearch, setRightSearch)}
      </Grid>
    </Grid>
  );
}
