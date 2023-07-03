import { ThemeProvider, createTheme } from "@mui/material";
import "./App.css";
import Router from "./routes";
import { ConfirmProvider } from "material-ui-confirm";

const App = () => {
  const theme = createTheme({
    typography: {
      allVariants: {
        fontFamily: "Montserrat",
        textTransform: "none",
        fontSize: 14,
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <ConfirmProvider
        defaultOptions={{
          title: "Are you sure you want to take this action?",
          confirmationText: "Confirm",
          cancellationText: "Cancel",
        }}
      >
        <Router />
      </ConfirmProvider>
    </ThemeProvider>
  );
};

export default App;
