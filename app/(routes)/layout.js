"use client";

import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import "../../styles/globals.css";
import theme from "../../theme";
import { Providers } from "./providers";
import Tabs from "../(core)/components/Tabs";

export default function RootLayout({ children, ...props }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Tabs />
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
