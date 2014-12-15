var Gps;
(function (Gps) {
    "use strict";

    Gps.HIGH_GPS_ACCURACY = true;

    Gps.Position;

    var gpsWatchId;

    var gpsErrorCount = 0;

    Gps.OnCoordinatesChanged;
    Gps.OnStart;
    Gps.OnStop;
    Gps.OnError;

    function Init(onCoordinatesChanged, onError) {
        Gps.Stop();
        Gps.OnCoordinatesChanged = onCoordinatesChanged;
        Gps.OnError = onError;
        Gps.Start();
    }
    Gps.Init = Init;

    /*
    function initToggleListener() {
    $('#locationToggle').bind("change", function(event, ui) {
    if (this.value == "true") {
    Gps.Start();
    } else {
    Gps.Stop();
    }
    });
    }
    */
    function Start() {
        var gpsOptions = {
            enableHighAccuracy: Gps.HIGH_GPS_ACCURACY,
            timeout: 1000 * 60 * 4,
            maximumAge: 1 * 1000
        };
        gpsWatchId = navigator.geolocation.watchPosition(onSuccess, onError, gpsOptions);
        if (gpsWatchId && Gps.OnStart)
            Gps.OnStart();
    }
    Gps.Start = Start;

    function Stop() {
        if (gpsWatchId) {
            navigator.geolocation.clearWatch(gpsWatchId);
            gpsWatchId = undefined;
            Gps.OnStop();
        }
    }
    Gps.Stop = Stop;

    function onSuccess(position) {
        // reset error counter
        gpsErrorCount = 0;

        Gps.Position = position;
        if (Gps.OnCoordinatesChanged)
            Gps.OnCoordinatesChanged(position);
        /*
        app.submitToServer();
        
        elem = document.getElementById('locationInfo');
        this.successElement(elem);
        
        elem.innerHTML = ('Latitude: ' + position.coords.latitude.toFixed(3)
        + '<br/>' + 'Longitude: '
        + position.coords.longitude.toFixed(3) + '<br/>'
        + 'Last Update: ' + app.getReadableTime(position.timestamp));
        */
    }

    function onError(error) {
        gpsErrorCount++;

        if (gpsErrorCount > 3) {
            /*
            elem = document.getElementById('locationInfo');
            $(elem).removeClass("success");
            $(elem).addClass("fail");
            elem.innerHTML = ('There is an error, restarting GPS. '
            + app.getReadableTime(new Date()) + "<br/> message:" + error.message);
            */
            console.log('error with GPS: error.code: ' + error.code + ' Message: ' + error.message);

            if (Gps.OnError)
                Gps.OnError(error);

            // Restart GPS listener, fixes most issues.
            Gps.Stop();
            Gps.Start();
        }
    }
})(Gps || (Gps = {}));
