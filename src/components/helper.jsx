export const host = function () {
  var host = window.location.hostname;
  if (host == "13.250.127.183") {
    return "http://13.250.127.183:5001";
  } else {
    return "http://localhost:3000";
  }
};