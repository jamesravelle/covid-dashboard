function displayStateInfo(x) {
  // var state = $(this).attr("state");
  var state = x.trim();
  var apiKey = "7a4fe6eeb916d074e239c499a4d5f4a8";
  var minDate = "2020-01-01"
  var maxDate =  $('#date').val();
  if (maxDate === ""){
    maxDate = "Today";
  }

      // Constructing a queryURL
      var queryURL = "https://gnews.io/api/v3/search?q=coronavirus+" + state + "&mindate=" + minDate + "&maxdate=" + maxDate + "&token=" + apiKey;

      // AJAX request with the queryURL
      $.ajax({
        url: queryURL,
        method: "GET"
      })
      // return "$this.state"
        // Data comes back from the request
        .then(function(response) {
          $('.news-section').css("opacity",1);
          console.log(response);
          console.log(queryURL);
          // storing the data from the AJAX request in the results variable
          var results = response;
          $("#covid-news").empty();
          $("#news-headline").text(state + " News Headlines");
          $("#news-date").text(minDate + " to " + maxDate)
          for (var i = 0; i < 5; i++) {
            var title =$("<h5><a href='" + response.articles[i].url + "' target='_blank'>" + response.articles[i].title + "</a></h5>");
            var description =$("<p>" + response.articles[i].description + "</p>");
            $("#covid-news").append(title);
            $("#covid-news").append(description);
            $("#covid-news").append("<hr>");
          }
          // var stateDiv = $("<div class='state'>");
    });
 }
