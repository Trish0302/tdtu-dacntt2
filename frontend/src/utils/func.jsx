import { useEffect, useState } from "react";

export function getSlugId(slug) {
  if (slug) {
    const arr = slug.split("-");
    return arr[arr.length - 1].split(".")[0];
  } else {
    return 0;
  }
}
export function cleanString(str) {
  if (str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    str = str.replace(/ + /g, " ");

    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      " "
    );
    str = str.trim();
  }
  return str;
}
export function friendly(str) {
  if (str) {
    str = cleanString(str);
    str = str.toLowerCase();
    str = str.replace(/    /g, "-");
    str = str.replace(/   /g, "-");
    str = str.replace(/  /g, "-");
    str = str.replace(/ /g, "-");
  }
  return str;
}
export function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}
export function dateToString(t) {
  var date = new Date(t);
  var strArray = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var dd = date.getDate();
  var m = strArray[date.getMonth()];
  var yyyy = date.getFullYear().toString().substr(-4);
  if (dd < 10) {
    dd = "0" + dd;
  }
  return dd + " " + m + " " + yyyy;
}
export function dateToInt(date) {
  return Date.parse(date) / 1000;
}
export function nowToInt() {
  value = new Date();
  return Date.parse(value) / 1000;
}
export function stringDateToInt(sDate) {
  from = sDate.split("/");
  d = new Date(from[2], from[1] - 1, from[0]);
  return Date.parse(d) / 1000;
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}
export function checkIsLength(value, len) {
  if (value.trim() == "") {
    return false;
  }
  if (value.length == len) {
    return true;
  } else {
    return false;
  }
}
export function checkIsMinLength(value, minLen) {
  if (value.trim() == "") {
    return false;
  }
  if (value.length >= minLen) {
    return true;
  } else {
    return false;
  }
}
export function checkIsMaxNum(value, maxNum) {
  if (value <= maxNum && checkIsNumber(value)) {
    return true;
  } else {
    return false;
  }
}
export function checkIsMinWords(value, minWords) {
  if (value.trim() == "") {
    return false;
  }
  if (value.split(" ").length >= minWords && value.trim() != "") {
    return true;
  } else {
    return false;
  }
}
export function checkIsEmail(value) {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (value != "" && re.test(String(value).toLowerCase()) == false) {
    if (value != "") return false;
    else return true;
  } else {
    return true;
  }
}
export function checkIsNumber(value) {
  var re = /^[0-9.]*$/;
  if (value != "" && re.test(value) == false) {
    if (value != "") return false;
    else return true;
  } else {
    return true;
  }
}
export const checkFormatNumberVN = (phone) => {
  const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

  return phone.match(regexPhoneNumber) ? true : false;
};
export function renderCategory(param) {
  switch (param) {
    case 1:
      return <div className="btn-yellow lexend f7 category">Backend</div>;
    case 2:
      return <div className="btn-green lexend f7 category">Frontend</div>;
    case 3:
      return <div className="btn-red lexend f7 category">FullStack</div>;
    case 4:
      return <div className="btn-blue lexend f7 category">Mobile</div>;
    case 5:
      return <div className="btn-yellow lexend f7 category">DevOps</div>;
    case 6:
      return <div className="btn-yellow lexend f7 category">Product</div>;
    case 7:
      return <div className="btn-green lexend f7 category">Engineering</div>;
    case 8:
      return <div className="btn-red lexend f7 category">Loyalty</div>;
    case 9:
      return <div className="btn-blue lexend f7 category">IT Services</div>;
    case 10:
      return <div className="btn-purple lexend f7 category">Data</div>;
    default:
      return <div className="btn-purple lexend f7 category">Other</div>;
  }
}
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
