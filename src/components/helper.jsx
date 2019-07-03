export const host = function () {
    let host = window.location.hostname;
    if (host === "13.251.49.54") {
      return "http://13.251.49.54:82";
    }else if(host === "13.250.127.183"){
      return "http://13.250.127.183:82";
    } else {
      return "http://localhost:3000";
    }
    return host;
  };