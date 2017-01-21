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

# Challenge Problem: Arrays with Nested Documents

This problem is provided as a supplementary learning opportunity. It is more challenging that the ordinary homework. It is ungraded. We do not ask you submit an answer.

Suppose our movie details documents are structured so that rather than contain an awards field that looks like this:

```json
"awards" : {
    "wins" : 56,
    "nominations" : 86,
    "text" : "Won 2 Oscars. Another 56 wins and 86 nominations."
}
```
they are structured with an awards field as follows:
```javascript
"awards" : {
    "oscars" : [
        {"award": "bestAnimatedFeature", "result": "won"},
        {"award": "bestMusic", "result": "won"},
        {"award": "bestPicture", "result": "nominated"},
        {"award": "bestSoundEditing", "result": "nominated"},
        {"award": "bestScreenplay", "result": "nominated"}
    ],
    "wins" : 56,
    "nominations" : 86,
    "text" : "Won 2 Oscars. Another 56 wins and 86 nominations."
}
```
What query would we use in the Mongo shell to return all movies in the video.movieDetails collection that either won or were nominated for a best picture Oscar? You may assume that an award will appear in the oscars array only if the movie won or was nominated. You will probably want to create a little sample data for yourself in order to work this problem.

HINT: For this question we are looking for the simplest query that will work. This problem has a very straightforward solution, but you will need to extrapolate a little from some of the information presented in the "Reading Documents" lesson.

```javascript
db.movieDetails.find({"awards.oscars.award": "bestPicture"})

```

# Challenge Problem: Updating Based on Multiple Criteria

Write an update command that will remove the "tomato.consensus" field for all documents matching the following criteria:

* The number of imdb votes is less than 10,000
* The year for the movie is between 2010 and 2013 inclusive
* The tomato.consensus field is null

How many documents required an update to eliminate a "tomato.consensus" field?

NOTE: There is a dump of the video database included in the handouts for the "Creating Documents" lesson. Use that data set to answer this question.

You can arrive at the answer here in a couple of different ways, either of which provide some good learning opportunities. The key is realizing that you need to report on the number of documents that actually required an update to remove the tomato.consensus field. You can do this either by ensuring that you filter for only those documents that do not contain a tomato.consensus field or by recognizing that only 13 documents were actually modified by your update.

Using the first approach, you can issue the following command.

```javascript
db.movieDetails.updateMany({ year: {$gte: 2010, $lte: 2013},
                             "imdb.votes": {$lt: 10000},
                             $and: [{"tomato.consensus": {$exists: true} },
                                    {"tomato.consensus": null} ] },
                           { $unset: { "tomato.consensus": "" } });
```

In response, you will receive the following:

```javascript
{ "acknowledged" : true, "matchedCount" : 13, "modifiedCount" : 13 }
```

Using the second approach, you can issue a simpler command, but one that is not precise about what needs to be updated.

```javascript
db.movieDetails.updateMany({ year: {$gte: 2010, $lte: 2013},
                             "imdb.votes": {$lt: 10000},
                             "tomato.consensus": null },
                           { $unset: { "tomato.consensus": "" } });
```
                                                   
