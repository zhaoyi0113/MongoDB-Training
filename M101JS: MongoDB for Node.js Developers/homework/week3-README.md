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
