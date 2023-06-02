import { useEffect, useState } from "react";
import { AsyncStorage } from "AsyncStorage";
import { callNon } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  console.log("🚀 ~ file: Login.jsx:10 ~ Login ~ email:", email);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState();

  //functions
  const handleLogin = async () => {
    // handleCheckValid();
    if (handleCheckValid() === true) {
      const rs = callNon("api/login", "POST", { email, password });
      // console.log("🚀 ~ file: Login.jsx:16 ~ handleLogin ~ rs:", rs);
      rs.then((response) => {
        console.log("🚀 ~ file: Login.jsx:18 ~ rs.then ~ response:", response);
        if (response.status === 200) {
          AsyncStorage.setItem("token-admin", JSON.stringify(response)).then(
            () => {
              setMessage(response.message);
              setTimeout(() => {
                navigate("/");
              }, 2000);
            }
          );
        } else {
          setMessage(response.data.message);
        }
      });
    }
  };

  const handleCheckValid = () => {
    console.log("vao day");
    if (email === "" && password === "") {
      setMessage("Vui lòng điền đầy đủ thông tin đăng nhập");
      return false;
    } else if (email === "") {
      setMessage("Vui lòng điền Email");
      return false;
    } else if (password === "") {
      setMessage("Vui lòng nhập mật khẩu");
      return false;
    } else if (
      email &&
      !email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      setMessage("Email không hợp lệ");
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
    <div className="flex h-screen flex-col gap-5 px-10 py-8 sm:px-20 sm:py-16 md:px-64 md:py-16 items-center justify-center bg-[#FDFCFF]">
      <img
        src="https://wallpapers.com/images/hd/blackpink-cute-lisa-gummy-smile-w1lrgah8y5j0krsv.jpg"
        className="h-[150px] md:h-[200px] w-fit rounded-xl shadow-lg"
      />
      <h1 className="text-center font-extrabold text-transparent text-3xl md:text-5xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 p-5 w-full">
        Trang đăng nhập
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
        onClick={handleLogin}
        className="w-1/2 bg-violet-500 p-2 uppercase  text-white rounded shadow-md hover:opacity-80 duration-200 transition-all"
      >
        Đăng nhập
      </button>
      <small className="underline">
        <a href="#">Quên mật khẩu?</a>
      </small>
      <p>adminminhhieu@gmail.com</p>
      12345678
    </div>
  );
};

export default Login;