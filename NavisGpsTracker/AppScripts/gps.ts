module Gps {
    "use strict";

    export var HIGH_GPS_ACCURACY = true;

    export var Position: Position;

    var gpsWatchId: number;

    var gpsErrorCount: number = 0;

    export var OnCoordinatesChanged: (position: Position) => void;
    export var OnStart: () => void;
    export var OnStop: () => void;
    export var OnError: (error: PositionError) => void;

    export function Init(onCoordinatesChanged?: (position: Position) => void, onError?: (error: PositionError) => void) {
        Gps.Stop();
        OnCoordinatesChanged = onCoordinatesChanged;
        OnError = onError;
        Gps.Start();
    }

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

    export function Start() {
        var gpsOptions = {
            enableHighAccuracy: HIGH_GPS_ACCURACY,
            timeout: 1000 * 60 * 4,
            maximumAge: 1 * 1000
        };
        gpsWatchId = navigator.geolocation.watchPosition(onSuccess, onError, gpsOptions);
        if (gpsWatchId && Gps.OnStart)
            Gps.OnStart();
    }

    export function Stop() {
        if (gpsWatchId) {
            navigator.geolocation.clearWatch(gpsWatchId);
            gpsWatchId = undefined;
            Gps.OnStop();
        }
    }

    function onSuccess(position: Position) {
        // reset error counter
        gpsErrorCount = 0;

        Position = position;
        if (OnCoordinatesChanged)
            OnCoordinatesChanged(position);
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

    function onError(error: PositionError) {
        gpsErrorCount++;

        if (gpsErrorCount > 3) {
/*
            elem = document.getElementById('locationInfo');
            $(elem).removeClass("success");
            $(elem).addClass("fail");
            elem.innerHTML = ('There is an error, restarting GPS. '
                + app.getReadableTime(new Date()) + "<br/> message:" + error.message);
*/
            console.log('error with GPS: error.code: ' + error.code
                + ' Message: ' + error.message);

            if (OnError)
                OnError(error);

            // Restart GPS listener, fixes most issues.
            Gps.Stop();
            Gps.Start();
        }
    }
} 