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

# Homework 2.3

Using the video.movieDetails collection, how many movies list "Sweden" second in the the list of countries.

NOTE: There is a dump of the video database included in the handouts for the "Creating Documents" lesson. Use that data set to answer this question.

```javascript
db.movieDetails.find({"countries.1": "Sweden"},{countries:1,_id:0}).count()
```

# Homework 2.4

How many documents in our video.movieDetails collection list just the following two genres: "Comedy" and "Crime" with "Comedy" listed first.

NOTE: There is a dump of the video database included in the handouts for the "Creating Documents" lesson. Use that data set to answer this question.



```javascript
db.movieDetails.find({"genres.0": "Comedy", "genres.1": "Crime", genres: {$size:2}}).count()
```

# Homework 2.5

As a follow up to the previous question, how many documents in the video.movieDetails collection list both "Comedy" and "Crime" as genres regardless of how many other genres are listed?

NOTE: There is a dump of the video database included in the handouts for the "Creating Documents" lesson. Use that data set to answer this question.

```javascript
db.movieDetails.find({genres: {$all:  ["Comedy", "Crime"]}}).count()
```

# Homework 2.6

Suppose you wish to update the value of the "plot" field for one document in our "movieDetails" collection to correct a typo. Which of the following update operators and modifiers would you need to use to do this?

```javascript
$set
```