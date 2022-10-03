const express = require("express");
const cors = require("cors");
const app = express().use(express.json());
const util = require("util");
const fs = require("fs");
app.use(cors());
/**
 * TODO(developer): UPDATE these variables before running the sample.
 */
// projectId: ID of the GCP project where Dialogflow agent is deployed
const projectId = "abcd";
// sessionId: String representing a random number or hashed user identifier
const sessionId = "123456";
// queries: A set of sequential queries to be send to Dialogflow agent for Intent Detection

// languageCode: Indicates the language Dialogflow agent should use to detect intents
const languageCode = "en";

// Imports the Dialogflow library
const dialogflow = require("@google-cloud/dialogflow");
// The encoding of the audio file, e.g. 'AUDIO_ENCODING_LINEAR_16'
const encoding = "AUDIO_ENCODING_LINEAR_16";

// The sample rate of the audio file in hertz, e.g. 16000
const sampleRateHertz = 48000;

// Instantiates a session client
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: "./service_key.json", // path to your service account key file here
});
app.post("/", async (req, res) => {
  // const readFile = util.promisify(fs.readFile);
  // const inputAudio1 = await readFile("./recordingsHi.wav");

  // console.log("input audio : ", inputAudio1);
  let { text, inputAudio } = req.body;
  const queries = [text];
  async function detectIntent(
    projectId,
    sessionId,
    query,
    contexts,
    languageCode
  ) {
    // The path to identify the agent that owns the created intent.
    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    );
    console.log("inputAudio1", req.body.body.text);
    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: req.body.body.text,
          // The language used by the client (en-US)
          languageCode: "en-US",
        },
      },
    };
    // const request = {
    //   session: sessionPath,
    //   queryInput: {
    //     audioConfig: {
    //       audioEncoding: encoding,
    //       sampleRateHertz: sampleRateHertz,
    //       languageCode: languageCode,
    //     },
    //   },
    //   inputAudio: "blob:http://localhost:3000/f165463b-d231-4a5a-9d0d-ff528a8af77f",
    // };

    if (contexts && contexts.length > 0) {
      request.queryParams = {
        contexts: contexts,
      };
    }

    const responses = await sessionClient.detectIntent(request);
    return responses[0];
  }

  async function executeQueries(projectId, sessionId, queries, languageCode) {
    // Keeping the context across queries let's us simulate an ongoing conversation with the bot
    let context;
    let intentResponse;
    for (const query of queries) {
      try {
        console.log(`Sending Query: ${query}`);
        intentResponse = await detectIntent(
          projectId,
          sessionId,
          query,
          context,
          languageCode
        );
        console.log("Detected intent");
        console.log(
          `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
        );
        res.json({ data: intentResponse.queryResult });
        // Use the context from this response for next queries
        context = intentResponse.queryResult.outputContexts;
      } catch (error) {
        res.json({ error: error.message });
      }
    }
  }
  executeQueries(projectId, sessionId, queries, languageCode);
});
const PORT = 4001 || process.env.PORT;

app.listen(PORT, () => {
  console.log(" server running", PORT);
});
