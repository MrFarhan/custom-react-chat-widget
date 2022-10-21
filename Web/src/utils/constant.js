import { keyframes } from "@emotion/react";

const dev = "http://192.168.100.211:4000";
const prod = "https://us-central1-speraelectriccom.cloudfunctions.net/speraelectriccom";

export const URL =
  window.location.hostname.split(":")[0] === "localhost" ||
  window.location.hostname.includes("192")
    ? dev
    : prod;

const animationKeyframes = keyframes`
  0% { transform: scale(1) rotate(0); border-radius: 10%; }
  25% { transform: scale(1.2) rotate(0); border-radius: 12%; }
  50% { transform: scale(1.2) border-radius: 20%; }
  75% { transform: scale(1)  border-radius: 30%; }
  100% { transform: scale(1) rotate(0); border-radius: 40%; }
`;

export const customAnimation = `${animationKeyframes} 2s ease-in-out infinite`;

export const initialMessage = {
  from: "computer",
  text: "Hi there ! Please select from below options",
  type: "text",
  isInitialMessage: true,
  quickReplies: [
    "Our Services",
    "Estimates / Quotes",
    "Our Company",
    "Resources",
    "Contact Us",
    "Location",
    "Service Requests",
  ],
};
