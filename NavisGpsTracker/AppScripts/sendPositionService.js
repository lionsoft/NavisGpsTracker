var SendPositionService;
(function (SendPositionService) {
    "use strict";

    SendPositionService.SERVER_URL;

    var timeLastSubmit;

    function SubmitToServer(forcedSubmit) {
        if (!HasConnection())
            return;

        /*
        var userPasscode = document.getElementById('userPasscode').value;
        var numOfUsers = document.getElementById('numOfUsers').value;
        numOfUsers = (numOfUsers == "") ? 1 : numOfUsers;
        */
        if (Gps.Position) {
            if (((new Date().getTime() / 1000) - timeLastSubmit) > 59 || forcedSubmit) {
                timeLastSubmit = new Date().getTime() / 1000;

                $.ajax({
                    url: SendPositionService.SERVER_URL,
                    contentType: "application/json",
                    type: "GET",
                    data: {
                        "passcode": "" /* userPasscode */ ,
                        "deviceId": 0 /* app.deviceId */ ,
                        "marker": JSON.stringify({
                            "numOfUsers": 0 /* numOfUsers */ ,
                            "lat": Gps.Position.coords.latitude,
                            "lng": Gps.Position.coords.longitude,
                            "accuracy": Gps.Position.coords.accuracy,
                            "heading": Gps.Position.coords.heading
                        })
                    },
                    timeout: 10000,
                    success: serverSuccess,
                    error: serverError
                });
            }
        } else {
            navigator.notification.alert("No position available to submit.", null, "Navis Gps Tracker");
        }
    }
    SendPositionService.SubmitToServer = SubmitToServer;
    ;

    function HasConnection() {
        var networkState = navigator.connection.type;
        return !networkState || networkState !== Connection.NONE;
    }
    SendPositionService.HasConnection = HasConnection;
    ;

    function serverSuccess(response) {
        /*
        var responseObj = $.parseJSON(response);
        var serverResponse = document.getElementById('serverResponse');
        serverResponse.innerHTML = "auto-submit: " + responseObj.message + ": "
        + app.getReadableTime(new Date());
        
        if (responseObj.message == "not authorized") {
        if (app.forcedSubmit) {
        app.forcedSubmit = false;
        navigator.notification
        .alert(
        "This passcode is not authorized. Try again or contact Britta. Your device id is: "
        + app.deviceId, null,
        "99 Red Beacons Tracker");
        }
        $(serverResponse).removeClass("success");
        $(serverResponse).addClass("fail");
        } else {
        if (app.forcedSubmit) {
        navigator.notification.alert("Success. Thank you!", null,
        "99 Red Beacons Tracker");
        app.forcedSubmit = false;
        }
        $(serverResponse).removeClass("fail");
        $(serverResponse).addClass("success");
        
        // Show or hide num of users option
        if (responseObj.advanced > 0) {
        document.getElementById("numUsersContainer").style.display = "block";
        } else {
        document.getElementById("numUsersContainer").style.display = "none";
        }
        }
        */
    }
    ;

    function serverError(request, errorType, errorMessage) {
        /*
        var serverError = document.getElementById('serverResponse');
        $(serverError).removeClass("success");
        $(serverError).addClass("fail");
        serverError.innerHTML = "Error: " + errorMessage + " "
        + app.getReadableTime(new Date());
        if (app.forcedSubmit) {
        navigator.notification.alert(
        "Error, please check your internet connection", null,
        "99 Red Beacons Tracker");
        app.forcedSubmit = false;
        }
        */
    }
})(SendPositionService || (SendPositionService = {}));
