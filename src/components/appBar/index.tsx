import { AppBar as MuiAppBar, Paper, TextField, Toolbar, Typography } from "@mui/material";
import Drawer from "../drawer";
import SearchBar from "../searchBar";
import UserDisplay from "../userDisplay";

const AppBar: React.FC = () => {
  return (
    <MuiAppBar component="nav">
      <Toolbar>
        <span style={{ marginRight: "1rem" }}>
          <Drawer />
        </span>
        <Typography variant="h6" component="div">
          SheetDB
        </Typography>
        <SearchBar />
        <UserDisplay />
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
