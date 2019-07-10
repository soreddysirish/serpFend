export const host = function () {
  var host = window.location.hostname;
  let url = ''
  if (host == "13.250.127.183") {
    url = "http://13.250.127.183:5001";
  } else {
    url= "http://localhost:3000";
  }
  return url;
};