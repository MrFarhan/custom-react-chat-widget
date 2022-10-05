const dev = "https://192.168.100.211:4000";
// const dev = "http://localhost:4000";
const prod = "https://192.168.100.211:4000";
export const URL =
  window.location.hostname.split(":")[0] === "localhost" ? dev : prod;
