/* Magic Mirror
 * Node Helper: MMM-KA
 *
 * By Stefan
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
//var request = require("request");
var moment = require("moment");
var fs = require("fs");
var path = require("path");
var filePath = path.join(__dirname, "losungen.csv");

var config = null;

module.exports = NodeHelper.create({

	getData: function() {
		var self = this;

		fs.readFile(filePath, {encoding: "utf-8"}, function(err, data) {
			if (!err) {
				console.log(data);
			} else {
				console.log(err);
			}
		});


/*
		request({
			url: this.config.remoteFile,
			method: "GET"
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body);
			}
		});
*/
	},
	// Override socketNotificationReceived method.

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function(notification, payload) {
		var self = this;
		if (notification === "CONFIG") {
			self.config = payload;
			//console.log("CONFIG PAYLOAD");
			self.getData();
		}
	},

	// Example function send notification test
	sendNotificationTest: function(payload) {
		this.sendSocketNotification("MMM-KA-NOTIFICATION_TEST", payload);
	}
});
