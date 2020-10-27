# Covid-19 Dashboard
Covid Dash is a web application that displays current and historical Covid-19 statistics in the USA. The data will default to all of the United States 
for yesterday's date (the most up to date data available).

[View Application](https://afternoon-fjord-46442.herokuapp.com/)

[View Project Repo](https://github.com/jamesravelle/covid-dashboard.git)

[Screenshot](Images/screenshot.png)

###### How to Use:
- Select a location from the dropdown
- Select a date
- Click "Submit" to get data for that state

Click "Current Location" to use the state that you are currently in.

###### Using the Map
Hovering over a state on the map will show a tooltip with the daily total of positive cases and amount of people hospitalized for the date entered. 
Clicking on a state will display cumulative data and news articles for that state and the date entered. 
Click "Reset Zoom" to display the entire USA. 
The states are color coded according to a heat map. The key for the heat map can be found at the bottom of the map.

###### View Table Output
A list of all states for the current date entered in table format

###### View Testing Locations
Output all testing locations for the state entered.

###### News Headlines
After clicking submit or getting your current location, the top 5 news headlines related to Coronavirus + the state will be listed. 
These articles will be from January 1st, 2020 to the date entered.

## Languages and Frameworks Used:
- [Bulma Front End CSS Framework](https://bulma.io/)
- [Vanilla Javascript](http://vanilla-js.com/)
- [jQuery](https://jquery.com/)
- [AM Charts Maps](https://www.amcharts.com/javascript-maps/)

## APIs Used:
- [Covid Tracking API](https://covidtracking.com/data/api)
- [OpenCage Geolocation API](https://opencagedata.com/api)
- [Covid Testing Location API](https://covid-19-apis.postman.com/covid-19-testing-locations/)
- [Google News API](https://gnews.io/)

