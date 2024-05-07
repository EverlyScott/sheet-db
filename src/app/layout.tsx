import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme";
import { NextLayout } from "@/types";
import Drawer from "@/components/drawer";
import { Box, List, ListItem, ListItemText, Toolbar } from "@mui/material";
import AppBar from "@/components/appBar";

const RootLayout: NextLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <AppBar />
            <Box component="main" sx={{ p: 3 }}>
              <Toolbar />
              {children}
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
