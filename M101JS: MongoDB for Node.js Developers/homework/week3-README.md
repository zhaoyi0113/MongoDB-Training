# Homework 3-1

When using find() in the Node.js driver, which of the following best describes when the driver will send a query to MongoDB?

* when we call a cursor method passing a callback function to process query results

# Homework 3-2

Suppose you have a MongoDB collection called school.grades that is composed solely of these 20 documents:

```javascript
{"_id": 1, "student": "Mary", "grade": 45, "assignment": "homework"}
{"_id": 2, "student": "Alice", "grade": 48, "assignment": "homework"}
{"_id": 3, "student": "Fiona", "grade": 16, "assignment": "quiz"}
{"_id": 4, "student": "Wendy", "grade": 12, "assignment": "homework"}
{"_id": 5, "student": "Samantha", "grade": 82, "assignment": "homework"}
{"_id": 6, "student": "Fay", "grade": 89, "assignment": "quiz"}
{"_id": 7, "student": "Katherine", "grade": 77, "assignment": "quiz"}
{"_id": 8, "student": "Stacy", "grade": 73, "assignment": "quiz"}
{"_id": 9, "student": "Sam", "grade": 61, "assignment": "homework"}
{"_id": 10, "student": "Tom", "grade": 67, "assignment": "exam"}
{"_id": 11, "student": "Ted", "grade": 52, "assignment": "exam"}
{"_id": 12, "student": "Bill", "grade": 59, "assignment": "exam"}
{"_id": 13, "student": "Bob", "grade": 37, "assignment": "exam"}
{"_id": 14, "student": "Seamus", "grade": 33, "assignment": "exam"}
{"_id": 15, "student": "Kim", "grade": 28, "assignment": "quiz"}
{"_id": 16, "student": "Sacha", "grade": 23, "assignment": "quiz"}
{"_id": 17, "student": "David", "grade": 5, "assignment": "exam"}
{"_id": 18, "student": "Steve", "grade": 9, "assignment": "homework"}
{"_id": 19, "student": "Burt", "grade": 90, "assignment": "quiz"}
{"_id": 20, "student": "Stan", "grade": 92, "assignment": "exam"}
```
Assuming the variable db holds a connection to the school database in the following code snippet.
```javascript
var cursor = db.collection("grades").find({});
cursor.skip(6);
cursor.limit(2);
cursor.sort({"grade": 1});
```
Which student's documents will be returned as part of a subsequent call to toArray()?

* Seamus, Bob

# Homework 3-3

This application depends on the companies.json dataset distributed as a handout with the findAndCursorsInNodeJSDriver lesson. You must first import that collection. Please ensure you are working with an unmodified version of the collection before beginning this exercise.

To import a fresh version of the companies.json data, please type the following:
```javascript
mongoimport --drop -d crunchbase -c companies companies.json
```
If you have already mongoimported this data you will first need to drop the crunchbase database in the Mongo shell. Do that by typing the following two commands, one at a time, in the Mongo shell:

```javascript
use crunchbase
db.dropDatabase()
```

The code in the attached handout is complete with the exception of the queryDocument() function. As in the lessons, the queryDocument() function builds an object that will be passed to find() to match a set of documents from the crunchbase.companies collection.

For this assignment, please complete the queryDocument() function as described in the TODO comments you will find in that function.

Once complete, run this application by typing:

```javascript
node buildingQueryDocuments.js
```
When you are convinced you have completed the application correctly, please enter the average number of employees per company reported in the output. Enter only the number reported. It should be three numeric digits.

As a check that you have completed the exercise correctly, the total number of unique companies reported by the application should equal 42.

If the grading system does not accept the first solution you enter, please do not make further attempts to have your solution graded without seeking some help in the discussion forum.

```javascript
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


var allOptions = [
    {
        firstYear: 2002,
        lastYear: 2016,
        city: "Palo Alto"
    },
    {
        lastYear: 2010,
        city: "New York"
    },
    {
        city: "London"
    }
];

var numQueriesFinished = 0;
var companiesSeen = {};

for (var i=0; i<allOptions.length; i++) {
    var query = queryDocument(allOptions[i]);
    queryMongoDB(query, i);
}


function queryMongoDB(query, queryNum) {

    MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {

        assert.equal(err, null);
        console.log("Successfully connected to MongoDB for query: " + queryNum);

        var cursor = db.collection('companies').find(query);

        var numMatches = 0;

        cursor.forEach(
            function(doc) {
                numMatches = numMatches + 1;
                if (doc.permalink in companiesSeen) return;
                companiesSeen[doc.permalink] = doc;
            },
            function(err) {
                assert.equal(err, null);
                console.log("Query " + queryNum + " was:" + JSON.stringify(query));
                console.log("Matching documents: " + numMatches);
                numQueriesFinished = numQueriesFinished + 1;
                if (numQueriesFinished == allOptions.length) {
                    report();
                }
                return db.close();
            }
        );

    });

}


function queryDocument(options) {

    console.log(options);

    var query = {
        "tag_list":  {$regex: "social-networking"} /* TODO: Complete this statement to match the regular expression "social-networking" */
    };

    if (("firstYear" in options) && ("lastYear" in options)) {
        /*
           TODO: Write one line of code to ensure that if both firstYear and lastYear
           appear in the options object, we will match documents that have a value for
           the "founded_year" field of companies documents in the correct range.
        */
       query.founded_year={"$gte": options.firstYear, "$lte": options.lastYear}
    } else if ("firstYear" in options) {
        query.founded_year = { "$gte": options.firstYear };
    } else if ("lastYear" in options) {
        query.founded_year = { "$lte": options.lastYear };
    }

    if ("city" in options) {
        /*
           TODO: Write one line of code to ensure that we do an equality match on the
           "offices.city" field. The "offices" field stores an array in which each element
           is a nested document containing fields that describe a corporate office. Each office
           document contains a "city" field. A company may have multiple corporate offices.
        */
       query.offices = {"$elemMatch": {city: options.city}}
    }

    return query;

}


function report(options) {
    var totalEmployees = 0;
    for (key in companiesSeen) {
        totalEmployees = totalEmployees + companiesSeen[key].number_of_employees;
    }

    var companiesList = Object.keys(companiesSeen).sort();
    console.log("Companies found: " + companiesList);
    console.log("Total employees in companies identified: " + totalEmployees);
    console.log("Total unique companies: " + companiesList.length);
    console.log("Average number of employees per company: " + Math.floor(totalEmployees / companiesList.length));
}
```

# Homework 3-4
In completing this exercise, you will find the "Logical Operators" lesson from Chapter 2 of this course helpful as a refresher on the $or operator.

This application depends on the companies.json dataset distributed as a handout with the "find() and Cursors in the Node.js Driver" lesson. You must first import that collection. Please ensure you are working with an unmodified version of the collection before beginning this exercise.

To import a fresh version of the companies.json data, please type the following:

```javascript
mongoimport --drop -d crunchbase -c companies companies.json
```
If you have already mongoimported this data you will first need to drop the crunchbase database in the Mongo shell. Do that by typing the following two commands, one at a time, in the Mongo shell:
```javascript
use crunchbase
db.dropDatabase()
```
The code attached is complete with the exception of the queryDocument() function. As in the lessons, the queryDocument() function builds an object that will be passed to find() to match a set of documents from the crunchbase.companies collection.

For this assignment, please complete the queryDocument() function as described in the TODO comments you will find in that function.

Once complete, run this application by typing:

```javascript
node overviewOrTags.js
```
When you are convinced you have completed the application correctly, please enter the average number of employees per company reported in the output. Enter only the number reported. It should be two numeric digits.

As a check that you have completed the exercise correctly, the total number of unique companies reported by the application should equal 194.

If the grading system does not accept the first solution you enter, please do not make further attempts to have your solution graded without seeking some help in the discussion forum.

```javascript

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var allOptions = [
    {
        overview: "wiki",
    },
    {
        milestones: "CMO"
    }
];

var numQueriesFinished = 0;
var companiesSeen = {};

for (var i=0; i<allOptions.length; i++) {
    var query = queryDocument(allOptions[i]);
    queryMongoDB(query, i);
}



function queryMongoDB(query, queryNum) {

    MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {

        assert.equal(err, null);
        console.log("Successfully connected to MongoDB for query: " + queryNum);

        var cursor = db.collection('companies').find(query);

        var numMatches = 0;

        cursor.forEach(
            function(doc) {
                numMatches = numMatches + 1;
                if (doc.permalink in companiesSeen) return;
                companiesSeen[doc.permalink] = doc;
            },
            function(err) {
                assert.equal(err, null);
                console.log("Query " + queryNum + " was:" + JSON.stringify(query));
                console.log("Matching documents: " + numMatches);
                numQueriesFinished = numQueriesFinished + 1;
                if (numQueriesFinished == allOptions.length) {
                    report();
                }
                return db.close();
            }
        );

    });

}


function queryDocument(options) {

    var query = {};

    if ("overview" in options) {
        /*
           TODO: Write an assignment statement to ensure that if "overview" appears in the
           options object, we will match documents that have the value of options.overview
           in either the "overview" field or "tag_list" field of companies documents.

           You will need to use the $or operator to do this. As a hint, "$or" should be the
           name of the field you create in the query object.

           As with the example for options.milestones below, please ensure your regular
           expression matches are case insensitive.

           I urge you to test your query in the Mongo shell first and adapt it to fit
           the syntax for constructing query documents in this application.
        */
       query = {"$or": [{"overview": {"$regex": options.overview, "$options":"i"}}, {"tag_list": {"$regex": options.overview, "$options":"i"}}] }

    }

    if ("milestones" in options) {
        query["milestones.source_description"] =
            {"$regex": options.milestones, "$options": "i"};
    }
    console.log('query:', query);
    return query;

}


function report(options) {
    var totalEmployees = 0;
    for (key in companiesSeen) {
        totalEmployees = totalEmployees + companiesSeen[key].number_of_employees;
    }

    var companiesList = Object.keys(companiesSeen).sort();
    console.log("Companies found: " + companiesList);
    console.log("Total employees in companies identified: " + totalEmployees);
    console.log("Total unique companies: " + companiesList.length);
    console.log("Average number of employees per company: " + Math.floor(totalEmployees / companiesList.length));
}
```
