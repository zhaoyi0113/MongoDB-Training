# Homework 2.1

Which of the choices below is the title of a movie from the year 2013 that is rated PG-13 and won no awards? Please query the video.movieDetails collection to find the answer.

NOTE: There is a dump of the video database included in the handouts for the "Creating Documents" lesson. Use that data set to answer this question.

```javascript
db.movieDetails.find({year:2013, "awards.wins":0, rated: "PG-13"},{title:1})
```
