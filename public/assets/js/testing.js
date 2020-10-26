/*

Testing

*/

function getTesting(x){
    var state = x.trim().toLowerCase();
    var query = "https://covid-19-testing.github.io/locations/" + state + "/complete.json";
    $('#testing-modal-body').empty();
          $.ajax({
              url:query,
              method:"GET",
              error:function (xhr, ajaxOptions, thrownError){
                if(xhr.status==404) {
          $('#testing-modal-body').text("No Results.");
                return;
    }
  }
          }).then(function(response){
              for(var i = 0; i < response.length; i++){
            var newDiv = $('<div>');
            newDiv.append(response[i].name + "<br>")
            newDiv.append(response[i].phones[0].number + "<br>")
            newDiv.append(response[i].physical_address[0].address_1 + "<br>")
            newDiv.append(response[i].physical_address[0].city + ", ")
            newDiv.append(response[i].physical_address[0].state_province + " ")
            newDiv.append(response[i].physical_address[0].postal_code)
            newDiv.append("<hr>");
            $('#testing-modal-body').append(newDiv);
              }
          })
  }