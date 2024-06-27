"use client";
import { createTheme } from "@mui/material";
import { blue, pink } from "@mui/material/colors";

export const theme = createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "contained" },
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
          }),
        },
      ],
    },
  },
});
