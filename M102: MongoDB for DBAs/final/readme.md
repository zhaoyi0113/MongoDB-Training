# Final Exam

## Problem 1

Problems 1 through 3 are an exercise in running mongod's, replica sets, and an exercise in testing of replica set rollbacks, which can occur when a former primary rejoins a set after it has previously had a failure.

Get the files from Download Handout link, and extract them. Use a.bat instead of a.sh on Windows.

Start a 3 member replica set (with default options for each member, all are peers). (a.sh will start the mongod's for you if you like.)

```javascript
# if on unix:
chmod +x a.sh
./a.sh
```

You will need to initiate the replica set next.

Run:

```javascript
mongo --shell --port 27003 a.js
// ourinit() will initiate the set for us.
// to see its source code type without the parentheses:
ourinit

// now execute it:
ourinit()
```

We will now do a test of replica set rollbacks. This is the case where data never reaches a majority of the set. We'll test a couple scenarios.

Now, let's do some inserts. Run:

```javascript
db.foo.insert( { _id : 1 }, { writeConcern : { w : 2 } } )
db.foo.insert( { _id : 2 }, { writeConcern : { w : 2 } } )
db.foo.insert( { _id : 3 }, { writeConcern : { w : 2 } } )
```

Note: if 27003 is not primary, make it primary -- using rs.stepDown() on the mongod on port 27001 (perhaps also rs.freeze()) for example.

Next, let's shut down that server on port 27001:
```javascript
var a = connect("localhost:27001/admin");
a.shutdownServer()
rs.status()
```
At this point the mongod on 27001 is shut down. We now have only our 27003 mongod, and our arbiter on 27002, running.

Let's insert some more documents:
```javascript
db.foo.insert( { _id : 4 } )
db.foo.insert( { _id : 5 } )
db.foo.insert( { _id : 6 } )
```

Now, let's restart the mongod that is shut down. If you like you can cut and paste the relevant mongod invocation from a.sh.

Now run ps again and verify three are up:

```javascript
ps -A | grep mongod
```
Now, we want to see if any data that we attempted to insert isn't there. Go into the shell to any member of the set. Use rs.status() to check state. Be sure the member is "caught up" to the latest optime (if it's a secondary). Also on a secondary you might need to invoke rs.slaveOk() before doing a query.)

Now run:
```javascript
db.foo.find()
```
to see what data is there after the set recovered from the outage. How many documents do you have?

Answer: 6

## Problem 2

Let's do that again with a slightly different crash/recover scenario for each process. Start with the following:

With all three members (mongod's) up and running, you should be fine; otherwise, delete your data directory, and, once again:

```javascript
./a.sh
mongo --shell --port 27003 a.js
ourinit() // you might need to wait a bit after this.
// be sure 27003 is the primary.
// use rs.stepDown() elsewhere if it isn't.
db.foo.drop()
db.foo.insert( { _id : 1 }, { writeConcern : { w : 2 } } )
db.foo.insert( { _id : 2 }, { writeConcern : { w : 2 } } )
db.foo.insert( { _id : 3 }, { writeConcern : { w : 2 } } )
var a = connect("localhost:27001/admin");
a.shutdownServer()
rs.status()
db.foo.insert( { _id : 4 } )
db.foo.insert( { _id : 5 } )
db.foo.insert( { _id : 6 } )
```

Now this time, shut down the mongod on port 27003 (in addition to the other member being shut down already) before doing anything else. One way of doing this in Unix would be:

```javascript
ps -A | grep mongod
# should see the 27003 and 27002 ones running (only)
ps ax | grep mongo | grep 27003 | awk '{print $1}' | xargs kill
# wait a little for the shutdown perhaps...then:
ps -A | grep mongod
# should get that just the arbiter is presentâ€¦
```

Now restart just the 27001 member. Wait for it to get healthy -- check this with rs.status() in the shell. Then query

```javascript
> db.foo.find()
```
Then add another document:

```javascript
> db.foo.insert( { _id : "last" } )
```
After this, restart the third set member (mongod on port 27003). Wait for it to come online and enter a health state (secondary or primary).

Run (on any member -- try multiple if you like) :
```javascript
> db.foo.find()
```
You should see a difference from problem 1 in the result above.

Question: Which of the following are true about mongodb's operation in these scenarios? Check all that apply.

Answer: MongoDB preserves the order of writes in a collection in its consistency model. In this problem, 27003’s oplog was effectively a “fork” and to preserve write ordering a rollback was necessary during 27003’s recovery phase.

## Homework3
In question 2 the mongod on port 27003 does a rollback. Go to that mongod's data directory. Look for a rollback directory inside. Find the .bson file there. Run the bsondump utility on that file. What are its contents?

Answer: It contains 3 documents.

## Homework4
Keep the three member replica set from the above problems running. We've had a request to make the third member never eligible to be primary. (The member should still be visible as a secondary.)

Reconfigure the replica set so that the third member can never be primary. Then run:

```javascript
$ mongo --shell a.js --port 27003
```
And run:

```javascript
> part4()
```
And enter the result in the text box below (with no spaces or line feeds just the exact value returned).

Answer: 233

## Homework5
Suppose we have blog posts in a (not sharded*) postings collection, of the form:

```javascript
{
  _id : ...,
  author : 'joe',
  title : 'Too big to fail',
  text : '...',
  tags : [ 'business', 'finance' ],
  when : ISODate("2008-11-03"),
  views : 23002,
  votes : 4,
  voters : ['joe', 'jane', 'bob', 'somesh'],
  comments : [
    { commenter : 'allan',
      comment : 'Well, i don't think soâ€¦',
      flagged : false,
      plus : 2
    },
    ...
  ]
}
```
Which of these statements is true?

Note: to get a multiple answer question right in this final you must get all the components right, so even if some parts are simple, take your time.

*Certain restrictions apply to unique constraints on indexes when sharded, so I mention this to be clear.

Answer:

We can create an index to make the following query fast/faster: db.postings.find( { “comments.flagged” : true } )

One way to assure people vote at most once per posting is to use this form of update: db.postings.update( { _id: . . . , voters:{$ne:’joe’} }, { $inc : {votes:1}, $push : {voters:’joe’} } );

## Homework6
Which of these statements is true?

Answer: 

MongoDB supports atomic operations on individual documents.

MongoDB has a data type for binary data.

## Homework7
Which of these statements is true?

Answer: MongoDB supports reads from slaves/secondaries that are in remote locations.

## Homework8
Download Handouts:
gene_backup_553f1c22d8ca396a7a77dfee.zip
We have been asked by our users to pull some data from a previous database backup of a sharded cluster. They'd like us to set up a temporary data mart for this purpose, in addition to answering some questions from the data. The next few questions involve this user request.

First we will restore the backup. Download gene_backup.zip from the Download Handout link and unzip this to a temp location on your computer.

The original cluster that was backed up consisted of two shards, each of which was a three member replica set. The first one named "s1" and the second "s2". We have one mongodump (backup) for each shard, plus the config database. After you unzip you will see something like this

```javascript
$ ls -la
total 0
drwxr-xr-x   5 dwight  staff  170 Dec 11 13:47 .
drwxr-xr-x  17 dwight  staff  578 Dec 11 13:49 ..
drwxr-xr-x   4 dwight  staff  136 Dec 11 13:45 config_server
drwxr-xr-x   5 dwight  staff  170 Dec 11 13:46 s1
drwxr-xr-x   5 dwight  staff  170 Dec 11 13:46 s2
```

Our data mart will be temporary, so we won't need more than one mongod per shard, nor more than one config server (we are not worried about downtime, the mart is temporary).

As a first step, restore the config server backup and run a mongod config server instance with that restored data. The backups were made with mongodump. Thus you will use the mongorestore utility to restore.

Once you have the config server running, confirm the restore of the config server data by running the last javascript line below in the mongo shell, and entering the 5 character result it returns.

```javascript
$ mongo localhost:27019/config
configsvr>
configsvr> db
config
configsvr> db.chunks.find().sort({_id:1}).next().lastmodEpoch.getTimestamp().toUTCString().substr(20,6)
```
Notes:

You must do this with MongoDB 3.0. The mongorestore may not work with prior versions of MongoDB.
If you do not see the prompt with 'configsvr' before the '>', then you are not running as a config server.

Answer: 39:15

## Homework9
Now that the config server from question #8 is up and running, we will restore the two shards ("s1" and "s2").

If we inspect our restored config db, we see this in db.shards:

```javascript
~/dba/final $ mongo localhost:27019/config
MongoDB shell version: 3.0.0
connecting to: localhost:27019/config
configsvr> db.shards.find()
{ "_id" : "s1", "host" : "s1/genome_svr1:27501,genome_svr2:27502,genome_svr2:27503" }
{ "_id" : "s2", "host" : "s2/genome_svr4:27601,genome_svr5:27602,genome_svr5:27603" }
```

From this we know when we run a mongos for the cluster, it will expect the first shard to be a replica set named "s1", and the second to be a replica set named "s2", and also to be able to be able to resolve and connect to at least one of the seed hostnames for each shard.

If we were restoring this cluster as "itself", it would be best to assign the hostnames "genome_svr1" etc. to the appropriate IP addresses in DNS, and not change config.shard. However, for this problem, our job is not to restore the cluster, but rather to create a new temporary data mart initialized with this dataset.

Thus instead we will update the config.shards metadata to point to the locations of our new shard servers. Update the config.shards collection such that your output is:

```javascript
configsvr> db.shards.find()
{ "_id" : "s1", "host" : "localhost:27501" }
{ "_id" : "s2", "host" : "localhost:27601" }
configsvr>
```

Be sure when you do this nothing is running except the single config server. mongod and mongos processes cache metadata, so this is important. After the update restart the config server itself for the same reason.

Now start a mongod for each shard -- one on port 27501 for shard "s1" and on port 27601 for shard "s2". At this point if you run ps you should see three mongod's -- one for each shard, and one for our config server. Note they need not be replica sets, but just regular mongod's, as we did not begin our host string in config.shards with setname/. Finally, use mongorestore to restore the data for each shard.

The next step is to start a mongos for the cluster.

Connect to the mongos with a mongo shell. Run this:

```javascript
use snps
var x = db.elegans.aggregate( [ { $match : { N2 : "T" } } , { $group : { _id:"$N2" , n : { $sum : 1 } } } ] ).next(); print( x.n )
```

Enter the number output for n.

Notes:

You must do this with MongoDB 3.0. The mongoimport may not work with prior versions of MongoDB.

Answer: 47664

## Homework10

Now, for our temporary data mart, once again from a mongo shell connected to the cluster:


1) create an index { N2 : 1, mutant : 1 } for the "snps.elegans" collection.
2) now run:

```javascript
db.elegans.find( { N2 : "T", mutant : "A" } ).limit( 5 ).explain( "executionStats" )
```

Based on the explain output, which of the following statements below are true?

Answer:

2 shards are queried.

8 documents are examined.