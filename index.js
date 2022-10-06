const express = require("express");
const cors = require("cors");
const app = express().use(express.json());
const { struct } = require("pb-util");
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

// Instantiates a session client
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: "./service_key.json", // path to your service account key file here
});

app.post("/", async (req, res) => {
  let { text } = req.body;
  let context;
  let intentResponse;
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

    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: languageCode,
        },
      },
    };

    if (contexts && contexts.length > 0) {
      request.queryParams = {
        contexts: contexts,
      };
    }

    const responses = await sessionClient.detectIntent(request);
    return responses[0];
  }

  try {
    let intentResponse = await detectIntent(
      projectId,
      sessionId,
      text,
      context,
      languageCode
    );
    console.log("Detected intent");
    let fulfillmentMessages = intentResponse.queryResult.fulfillmentMessages;
    let nestedQR = struct.decode(
      fulfillmentMessages.find(
        (item) => item.platform === "PLATFORM_UNSPECIFIED" && !!item.payload
      ).payload
    ).richContent[0];
    let nestedQR1 = nestedQR.find(
      (item) => item.type === "chips" && item.options.length > 0
    ).options;
    let quickReplies = nestedQR1.map((value) => value.text);

    intentResponse.queryResult["quickReplies"] = quickReplies;

    console.log(JSON.stringify("Fulfillment Text: ", fulfillmentMessages));
    console.log(
      `Fulfillment Text: ${JSON.stringify(
        intentResponse.queryResult.fulfillmentText
      )}`
    );
    res.json({ data: intentResponse.queryResult });
    // Use the context from this response for next queries
    context = intentResponse.queryResult.outputContexts;
  } catch (error) {
    res.json({ error: error.message });
  }
});
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(" server running on port: ", PORT);
});
