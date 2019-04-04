/* global Module */

/* Magic Mirror
 * Module: MMM-DieLosungen
 *
 * By yawnsde
 * MIT Licensed.
 */

Module.register("MMM-DieLosungen", {
	defaults: {
		updateInterval: 60000,
		delay: 600000,
		remoteFile: "http://localhost:8080/modules/MMM-DieLosungen/losungen.csv",
		initialLoadDelay: 0, // 0 milliseconds delay
		animationSpeed: 2000		
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var displayText = "losung";

		//Flag for check if module is loaded
		this.loaded = false;
		
		// Schedule update timer.
		this.updateData();
		setInterval(function() {
			self.updateDom();
		}, this.config.updateInterval);
	},

	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		setTimeout(function() {
			self.updateData();
		}, nextLoad);
	},

	getDom: function() {
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");
		// If this.dataRequest is not empty
		if (this.dataRequest) {

			
			var wrapperDataRequest = document.createElement("div");
			wrapperDataRequest.innerHTML = (this.displayText == "losung" ? this.dataRequest["Losungstext"] : this.dataRequest["Lehrtext"]);

			var labelDataRequest = document.createElement("label");
			labelDataRequest.innerHTML = (this.displayText == "losung" ? this.dataRequest["Losungsvers"] : this.dataRequest["Lehrtextvers"]);


			wrapper.appendChild(labelDataRequest);
			wrapper.appendChild(wrapperDataRequest);
			this.displayText = (this.displayText == "losung" ? "lehrtext" : "losung");			
		}

		return wrapper;
	},

	getScripts: function() {
		return ["moment.js"];
	},

	getStyles: function () {
		return [
			"MMM-DieLosungen.css",
		];
	},

	// Process Data that was read from the file.
	processData: function(data) {
		// convert our data from the file into an array
		var lines = data.replace(/\n+$/, "").split("\n");
		var singleline = "";
		var currentDate = moment().format('DD.MM.YYYY');
		
		for (var i = 1; i< lines.length; i++) {
			singleline = lines[i].split("\t");

			/* 	structure in csv file
				0 = Datum
				1 = Wtag
				2 = Sonntag
				3 = Losungsvers
				4 = Losungstext
				5 = Lehrtextvers
				6 = Lehrtext
			*/

			if (currentDate.localeCompare(singleline[0]) == 0) {
				this.dataRequest = [];
				this.dataRequest["Datum"] = singleline[0];
				this.dataRequest["Wtag"] = singleline[1];
				this.dataRequest["Sonntag"] = singleline[2];
				this.dataRequest["Losungsvers"] = singleline[3];
				this.dataRequest["Losungstext"] = singleline[4];
				this.dataRequest["Lehrtextvers"] = singleline[5];
				this.dataRequest["Lehrtext"] = singleline[6];
				break;
			}
			
		}

		this.loaded = true;
		this.updateDom(this.config.animationSpeed);
		this.scheduleUpdate();
	},

	// Read data from file.
	updateData: function() {
		var self = this;

		var xobj = new XMLHttpRequest();
		xobj.open("GET", this.config.remoteFile, true);
		xobj.onreadystatechange = function () {
			if (xobj.readyState == 4 && xobj.status == "200") {
				self.processData(xobj.response);
			}
		};
		xobj.send();

	}

});
