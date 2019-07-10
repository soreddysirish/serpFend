export const host = function () {
  let host = window.location.hostname;
  if (host === "13.250.127.183") {
    return "http://13.250.127.183:5001";
  } else {
    return "http://localhost:3000";
  }
  return host;
};