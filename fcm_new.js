// npm install firebase-admin --save
// To generate a private key file for your service account:

// In the Firebase console, open Settings > Service Accounts.

// Click Generate New Private Key, then confirm by clicking Generate Key.

// Securely store the JSON file containing the key.

const admin = require("firebase-admin");
const JSON = require("JSON");
const google = require("googleapis");
const axios = require("axios");
var serverKey_json = require("../Firebase-notification-new/test.json"); //put the generated private key path here

// #method 1
let request_body = {
  token: "mobile_token", //device token of the mobile
  notification: {
    title: "existing titile",
    body: "existing body",
  },
  data: {
    your_existing_data: "",
    test: JSON.stringify({ test: { test_1: "hi" } }), //nested json
  },
  apns: {
    payload: {
      aps: {
        badge: 0,
        sound: "default",
      },
    },
  },
};

if (!admin?.apps?.length) {
  // check if the app is already initialized
  admin.initializeApp({
    credential: admin.credential.cert(serverKey_json),
    projectId: serverKey_json.project_id,
  });
}

let response = admin.messaging().send(request_body);
console.log(response);

// #method 2
function getAccessToken(serverKey_json) {
  try {
    // 0Auth method
    return new Promise(function (resolve, reject) {
      // const key = require('../json/google-services.json');
      // const SCOPES = process.env.FCM_SCOPES;
      const SCOPES = "https://www.googleapis.com/auth/firebase.messaging";
      const FCM_CLIENT_NAME = serverKey_json.client_email;
      const FCM_PRIVATE_KEY = serverKey_json.private_key;
      const jwtClient = new google.auth.JWT(
        FCM_CLIENT_NAME,
        null,
        FCM_PRIVATE_KEY,
        SCOPES,
        null
      );
      jwtClient.authorize(function (err, tokens) {
        if (err) {
          console.log("🚀 ~ jwtClient.authorize ~ err:", err);
          resolve(null);
        }
        resolve(tokens.access_token);
      });
    });
  } catch (err) {
    console.log("🚀 ~ getAccessToken ~ err:------------------>", err);
    resolve(null);
  }
}
let token = getAccessToken(serverKey_json);

// let url = process.env.FIREBASE_NOTI_URL.replace("###project_id###", project_id);
let url =
  "https://fcm.googleapis.com/v1/projects/###project_id###/messages:send".replace(
    "###project_id###",
    serverKey_json.project_id
  );
let formRequest = {
  message: {
    token: "mobile_token", //device token of the mobile
    notification: {
      title: "existing titile",
      body: "existing body",
    },
    data: {},
    apns: {
      payload: {
        aps: {
          badge: 0,
          sound: "default",
        },
      },
    },
  },
};

axios
  .post(url, formRequest)
  .then((response) => {
    console.log("Response:", response.data);
  })
  .catch((error) => {
    console.error("Error making POST request:", error);
  });
