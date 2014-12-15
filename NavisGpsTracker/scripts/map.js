var map;
var marker;
var infowindow;
var watchID;


window.onload = function () {
    initialize();
};

function initialize() {
    initialized = false;
    document.addEventListener('deviceready', onDeviceReady, false);

    setTimeout(onDeviceReady, 1000);
}

function onPause() {
    
}

function onResume() {

}

var initialized = false;

//PhoneGap is ready function
function onDeviceReady() {
    if (initialized) return;
    initialized = true;
    $('#footer').html("Initializing...");
    document.addEventListener('pause', onPause, false);
    document.addEventListener('resume', onResume, false);

    $(window).unbind();
    $(window).bind('pageshow resize orientationchange', function (e) {
        max_height();
    });
    max_height();

    $('#footer').html("Getting coordinates...");
    Gps.HIGH_GPS_ACCURACY = true;
    Gps.Init(geo_success, geo_error);

    google.load("maps", "3.8", { "callback": map, other_params: "sensor=true&language=en" });
}

function max_height() {
    var h = $('div[data-role="header"]').outerHeight(true);
    var f = $('div[data-role="footer"]').outerHeight(true);
    var w = $(window).height();
    var c = $('div[data-role="content"]');
    var ch = c.height();
    var coh = c.outerHeight(true);
    var cNew = w - h - f - coh + ch;
    //var total = h + f + coh;
    if (ch < c.get(0).scrollHeight) {
        c.height(c.get(0).scrollHeight);
    } else {
        c.height(cNew);
    }
}

var firstTime = false;
var mapInitialized = false;
var lastPosition;

function map() {
    mapInitialized = false;
    firstTime = true;
    var latlng = new google.maps.LatLng(48.4575, 35.0683);
    var myOptions = {
        zoom: 15,
        center: latlng,
        streetViewControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true
    };
    map = new google.maps.Map(document.getElementById("map"), myOptions);

    google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
        mapInitialized = true;
        if (lastPosition)
            geo_success(lastPosition);
    });
}

function geo_error(error) {
    //comment
    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}


function geo_success(position) {
    $('#footer').html(getReadableTime(new Date(position.timestamp))
        + ': (' + position.coords.latitude.toFixed(4) + ',' + position.coords.longitude.toFixed(4) + ')'
        + ' v: ' + (position.coords.speed ? position.coords.speed.toFixed(1) : '?')
        + ' dir: ' + (position.coords.heading ? position.coords.heading.toFixed(1) : '?')
    );

    if (mapInitialized) {
        map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        if (firstTime) {
            map.setZoom(15);
            firstTime = false;
        }

        var info =
            ('Latitude: ' + position.coords.latitude + '<br>' +
            'Longitude: ' + position.coords.longitude + '<br>' +
            'Altitude: ' + position.coords.altitude + '<br>' +
            'Accuracy: ' + position.coords.accuracy + '<br>' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br>' +
            'Heading: ' + position.coords.heading + '<br>' +
            'Speed: ' + position.coords.speed + '<br>' +
            'Timestamp: ' + new Date(position.timestamp));

        var point = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var createIcon = function(heading) {
            return {
                path: heading ? google.maps.SymbolPath.FORWARD_CLOSED_ARROW : google.maps.SymbolPath.CIRCLE,
                scale: 8,
                rotation: heading,
                fillOpacity: 0.5,
                fillColor: '#0000EF',
                strokeWeight: 1,
                strokeColor: "blue",
            };
        }

        if (!marker) {
            //create marker
            marker = new google.maps.Marker({
                position: point,
                icon: createIcon(position.coords.heading),
                map: map,
            });
        } else {
            //move marker to new position
            marker.setPosition(point);
            marker.setIcon(createIcon(position.coords.heading));
        }
        if (!infowindow) {
            infowindow = new google.maps.InfoWindow({
                content: info
            });
        } else {
            infowindow.setContent(info);
        }
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });
    }

    lastPosition = position;
}

function padZero(num) {
    return (num < 10 ? '0' + num : num);
}

function getReadableTime(time) {
    return (time.getHours() + ':' + padZero(time.getMinutes()) + ':' + padZero(time.getSeconds()));
}

