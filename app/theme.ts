"use client";
import { createTheme } from "@mui/material";
import { green, grey, pink, red } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: {
      dark: "#1F719D",
      main: pink[500],
    },
    background: {
      default: pink[200],
      paper: "white",
    },
    text: {
      primary: "#fff",
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: ({ theme }) => ({
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontWeight: 600,
            fontSize: "0.875rem",
            lineHeight: 1.5,
            backgroundColor: pink[500],
            padding: "8px 16px",
            borderRadius: "8px",
            color: "white",
            transition: "all 150ms ease",
            cursor: "pointer",
            border: `1px solid ${pink[500]}`,
            boxShadow: `0 2px 1px ${
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.5)"
                : "rgba(45, 45, 60, 0.2)"
            }, inset 0 1.5px 1px ${pink[400]}, inset 0 -2px 1px ${pink[600]}`,
            "&:hover": {
              backgroundColor: pink[600],
            },
            textTransform: "none",
          }),
        },
        {
          props: { variant: "contained", color: "error" },
          style: ({ theme }) => ({
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontWeight: 600,
            fontSize: "0.875rem",
            lineHeight: 1.5,
            backgroundColor: red[500],
            padding: "8px 16px",
            borderRadius: "8px",
            color: "white",
            transition: "all 150ms ease",
            cursor: "pointer",
            border: `1px solid ${red[500]}`,
            boxShadow: `0 2px 1px ${
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.5)"
                : "rgba(45, 45, 60, 0.2)"
            }, inset 0 1.5px 1px ${red[400]}, inset 0 -2px 1px ${red[600]}`,
            "&:hover": {
              backgroundColor: red[600],
            },
            textTransform: "none",
          }),
        },
        {
          props: { variant: "contained", color: "success" },
          style: ({ theme }) => ({
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontWeight: 600,
            fontSize: "0.875rem",
            lineHeight: 1.5,
            backgroundColor: green[500],
            padding: "8px 16px",
            borderRadius: "8px",
            color: "white",
            transition: "all 150ms ease",
            cursor: "pointer",
            border: `1px solid ${green[500]}`,
            boxShadow: `0 2px 1px ${
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.5)"
                : "rgba(45, 45, 60, 0.2)"
            }, inset 0 1.5px 1px ${green[400]}, inset 0 -2px 1px ${green[600]}`,
            "&:hover": {
              backgroundColor: green[600],
            },
            textTransform: "none",
          }),
        },
      ],
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiTypography: {
      defaultProps: {
        color: grey[900],
      },
    },
  },
});
