"use client";

import { IconButton, List, ListItem, ListItemButton, ListItemText, Drawer as MuiDrawer } from "@mui/material";
import { ChevronLeft, Menu } from "@mui/icons-material";
import { useState } from "react";

const Drawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Menu />
      </IconButton>
      <MuiDrawer open={isOpen} onClose={handleClose}>
        <div style={{ width: "250px", margin: 0, display: "flex", flexDirection: "column" }}>
          <span style={{ alignSelf: "flex-end", padding: "1rem 1rem 0 0" }}>
            <IconButton onClick={handleClose}>
              <ChevronLeft />
            </IconButton>
          </span>
          <List>
            <ListItem disableGutters>
              <ListItemButton>
                <ListItemText primary="Hi" />
              </ListItemButton>
            </ListItem>
          </List>
        </div>
      </MuiDrawer>
    </>
  );
};

export default Drawer;
