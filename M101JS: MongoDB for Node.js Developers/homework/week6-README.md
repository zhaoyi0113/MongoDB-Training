# Homework 6-1

Starting with the example we looked at for calculating the total number of relationships individuals have participated in (in the CrunchBase data set):

```javascript
db.companies.aggregate( [
    { $match: { "relationships.person": { $ne: null } } },
    { $project: { relationships: 1, _id: 0 } },
    { $unwind: "$relationships" },
    { $group: {
        _id: "$relationships.person",
        count: { $sum: 1 }
    } },
    { $sort: { count: -1 } }
] )
```

Write an aggregation query that will determine the number of unique companies with which an individual has been associated. To test that you wrote your aggregation query correctly, from the choices below, select the number of unique companies that Eric Di Benedetto (eric-di-benedetto) has been associated with. I've attached the CrunchBase data set for use in this problem.

Hint: Review the available accumulators before beginning this exercise.

As a check on your work, the number of unique companies for roger-ehrenberg is 16, for josh-stein is 14, and the number for tim-hanlon actually is 28.

```javascript
db.companies.aggregate( {"$match": {"name": {"$ne": null}, "relationships.person.permalink":{"$regex": "eric-di-benedetto"}  }   }, {"$group": {"_id": "$name", "count": {"$sum": 1}}}, {"$match": {"count": {"$gte": 1}}}, {"$group": {_id: null, count:{"$sum":1}}},  {"$project": {"_id": 0, "count":1}} )
{ "count" : 15 }
```
