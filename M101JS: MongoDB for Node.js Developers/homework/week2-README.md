# Homework 2.1

Which of the choices below is the title of a movie from the year 2013 that is rated PG-13 and won no awards? Please query the video.movieDetails collection to find the answer.

NOTE: There is a dump of the video database included in the handouts for the "Creating Documents" lesson. Use that data set to answer this question.

```javascript
db.movieDetails.find({year:2013, "awards.wins":0, rated: "PG-13"},{title:1})
```

# Homework 2.2

Using the video.movieDetails collection, which of the queries below would produce output documents that resemble the following. Check all that apply.

NOTE: We are not asking you to consider specifically which documents would be output from the queries below, but rather what fields the output documents would contain.

```json
{ "title" : "P.S. I Love You" }
{ "title" : "Love Actually" }
{ "title" : "Shakespeare in Love" }
```

```javascript
db.movieDetails.find({}, {title: 1, _id: 0})
db.movieDetails.find({year: 1964},{title:1,_id:0})
```
