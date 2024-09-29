// Import the express module
const express = require("express");
var bodyParser = require("body-parser");
const serverless = require("serverless-http");
const notification = require("../Firebase-notification-new/fcm");

express.application.group = express.Router.group = function (path, configure) {
  app.use(bodyParser.json({ strict: false }));
  var router = express.Router();
  this.use(path, router);
  configure(router);
  return router;
};

// Initialize the app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Define a route for GET requests to the root URL
app.get("/", (req, res) => {
  res.send("Hello, Node.js API!");
});

// Define a POST route
app.post("/data", (req, res) => {
  const data = req.body;
  res.send(`You sent: ${JSON.stringify(data)}`);
});

// Define another route (optional)
app.get("/status", (req, res) => {
  res.json({ status: "API is running fine!" });
});

app.group("/", function (fcm_noti) {
  fcm_noti.route("/trigger_notification").post(notification.trigger_notif);
});

// Set up the server to listen on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports.handler = serverless(app);

// https://firebase.google.com/docs/cloud-messaging/migrate-v1 -> doc for deprication
// https://firebase.google.com/docs/cloud-messaging/send-message -> how to send requests
// https://console.firebase.google.com/project/fir-demo-project/settings/general/android:com.labpixies.flood -> demo project
// https://firebase.google.com/docs/admin/setup#add-sdk -> SDK installation setup for firebase-admin
// https://firebase.google.com/docs/cloud-messaging/send-message#send_using_the_fcm_v1_http_api -> server resp
