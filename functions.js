 //helsinki coordinates
 var startLocation = '60.1699, 24.9384';

 //destinations options for navigation
 function listOptions() {
   for (var i = 0; i <= restaurants.length; i++) {
     var opt = document.createElement('option');
     opt.value = restaurants[i].location.lat + ', ' + restaurants[i].location.lon;
     opt.innerHTML = restaurants[i].name;
     document.getElementById('end').appendChild(opt);
     
   }
 };


 var map;
 function initMap() {

   var mapStyles = [
     { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
     { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
     { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
     {
       featureType: 'administrative.locality',
       elementType: 'labels.text.fill',
       stylers: [{ color: '#d59563' }]
     },
     {
       featureType: 'poi.business',
       stylers: [{ visibility: 'off' }]
     },
     {
       featureType: 'poi',
       elementType: 'labels.text.fill',
       stylers: [{ visibility: 'off' }]
     },
     {
       featureType: 'poi.park',
       elementType: 'geometry',
       stylers: [{ color: '#263c3f' }]
     },
     {
       featureType: 'poi.park',
       elementType: 'labels.text.fill',
       stylers: [{ color: '#6b9a76' }]
     },
     {
       featureType: 'road',
       elementType: 'geometry',
       stylers: [{ color: '#38414e' }]
     },
     {
       featureType: 'road',
       elementType: 'geometry.stroke',
       stylers: [{ color: '#212a37' }]
     },
     {
       featureType: 'road',
       elementType: 'labels.text.fill',
       stylers: [{ color: '#9ca5b3' }]
     },
     {
       featureType: 'road.highway',
       elementType: 'geometry',
       stylers: [{ color: '#746855' }]
     },
     {
       featureType: 'road.highway',
       elementType: 'geometry.stroke',
       stylers: [{ color: '#1f2835' }]
     },
     {
       featureType: 'road.highway',
       elementType: 'labels.text.fill',
       stylers: [{ color: '#f3d19c' }]
     },
     {
       featureType: 'transit',
       elementType: 'geometry',
       stylers: [{ color: '#2f3948' }]
     },
     {
       featureType: 'transit.station',
       elementType: 'labels.text.fill',
       stylers: [{ color: '#d59563' }]
     },
     {
       featureType: 'water',
       elementType: 'geometry',
       stylers: [{ color: '#17263c' }]
     },
     {
       featureType: 'water',
       elementType: 'labels.text.fill',
       stylers: [{ color: '#515c6d' }]
     },
     {
       featureType: 'water',
       elementType: 'labels.text.stroke',
       stylers: [{ color: '#17263c' }]
     }
   ];


   var directionsService = new google.maps.DirectionsService;
   var directionsDisplay = new google.maps.DirectionsRenderer;

   map = new google.maps.Map(document.getElementById('map'), {
     zoom: 7,
     center: { lat: 60.1699, lng: 24.9384 },
     styles: mapStyles,
   });


   if (navigator.geolocation) { // check if the browser supports geolocation

     navigator.geolocation.getCurrentPosition(function (location) {

       var here = {
         lat: location.coords.latitude,
         lng: location.coords.longitude
       }

       //sets location current location for navigation
       startLocation = location.coords.latitude + ', ' + location.coords.longitude;
       map = new google.maps.Map(document.getElementById('map'), {
         zoom: 15,
         center: here,
         styles: mapStyles,
       });

       directionsDisplay.setMap(map);
       directionsDisplay.setPanel(document.getElementById('right-panel'));

       var control = document.getElementById('floating-panel');
       //control.style.display = 'block';
       //map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
       map.controls.push(control);

       var onChangeHandler = function () {
         calculateAndDisplayRoute(directionsService, directionsDisplay);
       };
       document.getElementById('start').addEventListener('change', onChangeHandler);
       document.getElementById('end').addEventListener('change', onChangeHandler);


       var markers = [];
       for (var i = 0; i < restaurants.length; i++) {

         markers.push({
           coords: { lat: restaurants[i].location.lat, lng: restaurants[i].location.lon },
           content: '<h1>' + restaurants[i].name + '</h1>' + '<p>' + restaurants[i].description + '</p>' + '<a href="tel:'+restaurants[i].phone_number+'"><i class="fa fa-phone"></i> '+restaurants[i].phone_number+'</a> '
         }
         )
                   
       }

       // Loop through markers
       for (var i = 0; i < markers.length; i++) {
         // Add marker
         addMarker(markers[i]);
       }

       // Add Marker Function
       function addMarker(props) {
         var marker = new google.maps.Marker({
           position: props.coords,
           map: map,
           animation: google.maps.Animation.DROP,
           //icon:props.iconImage
         });


         // Check for customicon
         if (props.iconImage) {
           // Set icon image
           marker.setIcon(props.iconImage);
         }

         // Check content
         if (props.content) {
           var infoWindow = new google.maps.InfoWindow({
             content: props.content
           });

           marker.addListener('click', function () {
             infoWindow.open(map, marker);
           });
         }
       }



       listOptions();



     });
   };
 }

 function calculateAndDisplayRoute(directionsService, directionsDisplay) {
   directionsService.route({
     origin: startLocation,
     destination: document.getElementById('end').value,
     travelMode: 'BICYCLING'
   }, function (response, status) {
     if (status === 'OK') {
       directionsDisplay.setDirections(response);
     } else {
       window.alert('Directions request failed due to ' + status);
     }
   });
 }





