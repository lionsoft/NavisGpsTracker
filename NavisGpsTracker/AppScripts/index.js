// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints,
// and then run "window.location.reload()" in the JavaScript Console.
// ReSharper disable Html.EventNotResolved
var NavisGpsTracker;
(function (NavisGpsTracker) {
    "use strict";

    (function (Application) {
        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        }

        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        }

        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        }

        function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }
        Application.initialize = initialize;
    })(NavisGpsTracker.Application || (NavisGpsTracker.Application = {}));
    var Application = NavisGpsTracker.Application;

    window.onload = function () {
        Application.initialize();
        Gps.HIGH_GPS_ACCURACY = false;
        Gps.Init(onCoordinateChanged, onCoordinateError);
    };

    function onCoordinateChanged(position) {
        $("#err-container").hide();
        $("#lat").html(position.coords.latitude);
        $("#lon").html(position.coords.longitude);
        $("#alt").html(position.coords.altitude);
        $("#speed").html(position.coords.speed);
        $("#dir").html(position.coords.heading);
        $("#coords").show();
    }

    function onCoordinateError(error) {
        $("#coords").hide();
        $("#err").html(error.message);
        $("#err-container").show();
    }
})(NavisGpsTracker || (NavisGpsTracker = {}));
