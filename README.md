# 6-Server-Side-APIs-Weather-Dashboard

## Homework 6 Introduction

Description of the Assignment
Screenshot
Deployed Link


## Overall Notes

### index.html
Bootstrap Formatting
rows
columns
cards
divs to hold content



### style.css
Styles for the cards
Styles for the UV Index
Colors and borders



### script.js

AJAX Calls
Noticed that the OpenWeatherAPIs could do a search by city.
HOWEVER, it would require multiple searches: one for current weather, one for future weather
I noticed that OpenWeatherAPI that they had one API called OneCall
That one required latitude and longitude, however
So I needed a way to get from a CITY input to a Latitude and Longitude output
Found the GeoCode website
Used THAT to get Lat and Long
Plugged that Lat and Long into the OneCall
Got the current and forecasted results I needed
NEEDED to use async and await





## Final Thoughts
Synthesizing all the previous lessons and homeworks
Async and await were tough to understand
Once I solved that, though, it was straightforward
