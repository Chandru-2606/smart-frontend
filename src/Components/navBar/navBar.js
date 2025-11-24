import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Collapse } from "@mui/material";
import { ArrowDropDownCircleOutlined } from "@mui/icons-material";
import Appbar from "./appBar";
import logo from '../../Images/logo.png'


export default function Navbar({ data }) {
  const drawWidth = 240;
  const [mobileViewOpen, setMobileViewOpen] = useState(false);
  const [open, setOpen] = useState({});
  const [activeItem, setActiveItem] = useState("");
  const location = useLocation();
  useEffect(() => {
    // Set the active item based on the current location
    data.forEach((item) => {
      if (item.link === location.pathname) {
        setActiveItem(item.name);
      }
    });
  }, [location, data]);

  const handleToggle = () => {
    setMobileViewOpen(!mobileViewOpen);
  };

  const handleSubMenuToggle = (name) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [name]: !prevOpen[name],
    }));
  };

  const handleItemClick = (name) => {
    setActiveItem(name);
    if(mobileViewOpen){
      setMobileViewOpen(false);
    }
  };

  const responsiveDrawer = (
    <Box sx={{ backgroundColor: 'primary.main', height: '100%', color: 'white' }}>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <img
          src={logo}
          style={{ maxWidth: '100%', height: 'auto', width: '50%' }}
          alt="logo"
        />
      </Box>
      <List>
        {data.map((item, index) => (
          <div key={index}>
            <Link
              to={item.link || "#"}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton
                sx={{
                  m: 1,
                  borderRadius: 1,
                  backgroundColor: activeItem === item.name ? 'primary.dark' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
                onClick={() => {
                  if (item.children) {
                    handleSubMenuToggle(item.name);
                  }
                  handleItemClick(item.name);
                }}
              >
                <ListItemIcon sx={{ color: "white" }}>
                  {React.cloneElement(item.icon)}
                </ListItemIcon>
                <ListItemText primary={item.name} />
                {item.children && (
                  <IconButton
                    edge="end"
                    size="small"
                  >
                    <ArrowDropDownCircleOutlined htmlColor="white" />
                  </IconButton>
                )}
              </ListItemButton>
            </Link>
            {item.children && (
              <Collapse in={open[item.name]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child, childIndex) => (
                    <Link
                      to={child.link}
                      key={childIndex}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <ListItemButton
                        sx={{
                          pl: 4,
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          },
                        }}
                        onClick={() => handleItemClick(child.name)}
                      >
                        <ListItemIcon sx={{ color: "white" }}>
                          {React.cloneElement(child.icon)}
                        </ListItemIcon>
                        <ListItemText primary={child.name} />
                      </ListItemButton>
                    </Link>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{
          width: { sm: drawWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileViewOpen}
          onClose={handleToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawWidth },
          }}
        >
          {responsiveDrawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawWidth },
          }}
          open
        >
          {responsiveDrawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{
        flexGrow: 1,
        width: { sm: `calc(100% - ${drawWidth}px)` },
      }}>
        <Appbar handleToggle={handleToggle} />
        <Box sx={{ mt: 1 }}>
          <Outlet />

        </Box>
      </Box>
    </Box>
  );
}
