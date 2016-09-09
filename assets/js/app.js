$(document).ready(function(){
	var city = ""
	var latitude = 0;
	var longitude = 0;

	function getData(type) {
		var queryURL = "";
		if(type == "city") {
			queryURL = "https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&APPID=20497d7277a6d8e11da54b4af9fbd7c7";
		} else if(type == "latlon") {
			queryURL = "https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&units=imperial&APPID=20497d7277a6d8e11da54b4af9fbd7c7";
		}
			$.ajax({url: queryURL, method: 'GET'}).done(function(response) {
				var description = response.weather[0].description;
				$("h1").html(response.name);
				$("#wind").html("Wind Speed: "+response.wind.speed+" miles/hour");		
				$("#humidity").html("Humidity: "+response.main.humidity+"%");
				$("#temperature").html("Temperature: "+response.main.temp+"&deg;F");
				$("#weather-description").html("Weather: "+response.weather[0].description);

				var queryURL = "https://crossorigin.me/http://api.giphy.com/v1/gifs/search?q="+description+"&api_key=dc6zaTOxFJmzC&limit=1";

				$.ajax({url: queryURL, method: 'GET'}).done(function(response) {
					$("html").css("background-image", "url('"+response.data[0].images.original.url+"')");

					queryURL = "https://api.spotify.com/v1/search?q="+description+"&type=track&limit=5"

					$.ajax({url: queryURL, method: 'GET'}).done(function(response) {
						$("#player").empty();
						$.each(response.tracks.items, function(i, v){
							$("#player").append("<iframe src='https://embed.spotify.com/?uri="+v.uri+"'width='300' height='80' frameborder='0' allowtransparency='true'></iframe>")
						});
					});
				});
		});

	}

	$("body").on("click", "#geolocate", geoFindMe);

	$("body").on("click", "#city-button", function() {
		city = $("#city-name").val();
		getData("city");
	});

	// geolocation function
	function geoFindMe() {
	  var output = document.getElementById("out");

	  if (!navigator.geolocation){
	    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
	    return;
	  }

	  function success(position) {
	    latitude  = position.coords.latitude;
	    longitude = position.coords.longitude;

	    output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

	    var img = new Image();
	    img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false&key=AIzaSyBL02KJBq9tdQaDHkDzGTq8Ha4qy3Wf4vU";

	    output.appendChild(img);
	    getData("latlon");
	  };

	  function error() {
	    output.innerHTML = "Unable to retrieve your location";
	  };

	  output.innerHTML = "<p>Locating…</p>";

	  navigator.geolocation.getCurrentPosition(success, error);
	}	
});
