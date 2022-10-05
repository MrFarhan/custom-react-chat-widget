const dev = "http://192.168.100.211:4000";
const prod = "https://spera-bot-production.up.railway.app/";
export const URL =
  window.location.hostname.split(":")[0] === "localhost" ? dev : prod;
