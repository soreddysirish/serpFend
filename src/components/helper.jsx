import jwtDecode from "jwt-decode"
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
export const checkSession = function () {
  let token = localStorage.getItem("token")
  if (!token) {
    localStorage.removeItem("token")
    setTimeout(function () {
      if(!window.location.pathname.includes("/login")){
        window.location.href = "/login"
      }
    }, 800)
    return false
  }
  let jwtDecode_val = jwtDecode(token)
  let exp = jwtDecode_val["exp"]
  if (exp < new Date().getTime() / 1000) {
    localStorage.removeItem("token")
    setTimeout(function () {
      setTimeout(function () {
        if(!window.location.pathname.includes("/login")){
          window.location.href = "/login"
        }
        return false
      }, 1000)
      NotificationManager.error("session expired", "please login to continue", 1000)
    }, 1500)
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
