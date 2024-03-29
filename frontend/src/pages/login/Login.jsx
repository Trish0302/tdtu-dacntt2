import { useEffect, useState } from "react";
import { AsyncStorage } from "AsyncStorage";
import { callNon } from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import Logo from "../../../public/logo.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  console.log("🚀 ~ file: Login.jsx:10 ~ Login ~ email:", email);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);

  //functions
  const handleLogin = async (e) => {
    e.preventDefault();
    // handleCheckValid();
    setLoading(true);
    if (handleCheckValid() === true) {
      const rs = callNon("api/login", "POST", {
        email,
        password,
        type: "admin",
      });
      // console.log("🚀 ~ file: Login.jsx:16 ~ handleLogin ~ rs:", rs);
      rs.then((response) => {
        console.log("🚀 ~ file: Login.jsx:18 ~ rs.then ~ response:", response);
        if (response.status === 200) {
          AsyncStorage.setItem("token-admin", JSON.stringify(response)).then(
            () => {
              setLoading(false);
              setMessage(response.message);
              setTimeout(() => {
                navigate("/");
              }, 1000);
            }
          );
        } else {
          setLoading(false);
          setMessage(response.data.message);
        }
      });
    } else {
      setLoading(false);
    }
  };

  const handleCheckValid = () => {
    console.log("vao day");
    if (email === "" && password === "") {
      setMessage("Please fill full of fields");
      return false;
    } else if (email === "") {
      setMessage("Please enter e-mail");
      return false;
    } else if (password === "") {
      setMessage("Please enter password");
      return false;
    } else if (
      email &&
      !email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      setMessage("Invalid Email");
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    async function check() {
      const checkLogin = await AsyncStorage.getItem("token-admin");
      console.log(
        "🚀 ~ file: Login.jsx:24 ~ useEffect ~ checkLogin:",
        checkLogin
      );
      if (checkLogin === undefined || checkLogin === "null") {
        /* empty */
      } else {
        navigate("/");
      }
    }
    check();
  }, []);
  return (
    <form
      onSubmit={handleLogin}
      className="flex h-screen flex-col gap-5 px-10 py-8 sm:px-20 sm:py-16 md:px-64 md:py-16 items-center justify-center bg-[#FDFCFF]"
    >
      <img
        src={Logo}
        className="h-[150px] md:h-[200px] w-fit rounded-xl shadow-lg"
      />
      <h1 className="text-center font-extrabold text-transparent text-3xl md:text-5xl bg-clip-text bg-gradient-to-r from-[#6dd5ed] to-[#2193b0] p-5 w-full">
        Login to Dashboard
      </h1>
      <TextField
        label="Email"
        name="email"
        type="email"
        className="border w-full md:w-2/4"
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        className="border w-full md:w-2/4"
        onChange={(e) => setPassword(e.target.value)}
      />
      {message && (
        <small className="text-red-600 font-semibold">{message}</small>
      )}
      <button
        type="submit"
        onClick={handleLogin}
        className={` ${
          loading ? "opacity-75 select-none" : ""
        } w-1/2 bg-[#6dd5ed] p-2 uppercase  text-white rounded shadow-md hover:opacity-80 duration-200 transition-all`}
      >
        {loading ? (
          <CircularProgress className="text-sm" size="2rem" color="secondary" />
        ) : (
          "Login"
        )}
      </button>
      <small className="underline hover:text-[#2193b0]">
        <Link to="/register">Want to be our partner? Sign Up</Link>
      </small>
    </form>
  );
};

export default Login;
