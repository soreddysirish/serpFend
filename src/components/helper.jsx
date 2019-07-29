import jwtDecode from "jwt-decode"
export const checkSession = function () {
  let token = localStorage.getItem("token")
  if(!token){
    localStorage.removeItem("token")
    return false
  }
  let jwtDecode_val = jwtDecode(token)
  let exp = jwtDecode_val["exp"]
  if (exp < new Date().getTime() / 1000) {
    localStorage.removeItem("token")
    return false
  }
  return true
}

export const host = function () {
  var host = window.location.hostname;
  let url = ''
  if (host == "13.250.127.183") {
    url = "http://13.250.127.183:5001";
  } else {
    url = "http://localhost:3000";
  }
  return url;
};
