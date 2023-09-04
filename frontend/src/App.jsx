import { ThemeProvider, createTheme } from "@mui/material";
import "./App.css";
import Router from "./routes";
import { ConfirmProvider } from "material-ui-confirm";
import { AsyncStorage } from "AsyncStorage";
import { ToastContainer } from "react-toastify";

const App = () => {
  const theme = createTheme({
    typography: {
      allVariants: {
        fontFamily: "Montserrat",
        textTransform: "none",
        fontSize: 14,
      },
    },
    palette: {
      secondary: {
        main: "#f7a399",
      },
    },
  });
  // window.onbeforeunload = async function () {
  //   AsyncStorage.getItem("token-admin").then((rs) => {
  //     if (rs) {
  //       AsyncStorage.setItem("token-admin", null);
  //     }
  //   });
  // };

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
      <ToastContainer
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;
