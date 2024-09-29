const FCM = require("fcm-node");

var trigger_notif = function () {
  var serverKey = require("../Firebase-notification-new/test.json"); //put the generated private key path here

  var fcm = new FCM(serverKey);

  var message = {
    message: {
      token: "cBpjMB3HnksOr7fZ-zVp-5:APA9....",
      notification: {
        title: "xyz-title",
        body: ".....",
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
    json: true,
  };

  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!");
      console.log("Something has gone wrong!", err);
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};

module.exports = {
  trigger_notif: trigger_notif,
};
