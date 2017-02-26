# Homework 6-1

For this week's homework we will start with a standalone MongoDB database, turn it into a sharded cluster with two shards, and shard one of the collections. We will create a "dev" environment on our local box: no replica sets, and only one config server. In production you would almost always use three config servers and replica sets as part of a sharded cluster. In the final of the course we'll set up a larger cluster with replica sets and three config servers.

Download the handout.

Start an initially empty mongod database instance.

Connect to it with the shell and week6.js loaded:

```javascript
mongo --shell localhost/week6 week6.js
```

Run homework.init(). It will take some time to run as it inserts quite a few documents. When it is done run

```javascript
db.trades.stats()
```
to check the status of the collection.
At this point we have a single mongod and would like to transform it into a sharded cluster with one shard. (We'll use this node's existing week6.trades data in the cluster.)

Stop the mongod process. Now, restart the mongod process adding the option --shardsvr. If you started mongod with a --dbpath option, specify that as well.

```javascript
mongod --shardsvr ...
```
Note that with --shardsvr specified the default port for mongod becomes 27018.

Start a mongo config server:

```javascript
mongod --configsvr ...
```
(Note with --configsvr specified the default port for listening becomes 27019 and the default data directory /data/configdb. Wherever your data directory is, it is suggested that you verify that the directory is empty before you begin.)

Start a mongos:

```javascript
mongos --configdb your_host_name:27019
```
Connect to mongos with the shell:

```javascript
mongo --shell localhost/week6 week6.js
```
Add the first shard ("your_host_name:27018").

Verify that the week6.trades data is visible via mongos. Note at this point the week6 database isn't "sharding enabled" but its data is still visible via mongos:

```javascript
db.trades.find().pretty()
db.trades.count()
db.trades.stats()
```
Run homework.a() and enter the result below. This method will simply verify that this simple cluster is up and running and return a result key.

1000001


# Homework 6-2

Now enable sharding for the week6 database. (See sh.help() for details.)

Then shard the trades collection on the compound shard key ticker plus time. Note to shard a collection, you must have an index on the shard key, so you will need to create the index first:

```javascript
db.trades.createIndex( { ticker : 1, time : 1 } )
// can now shard the trades collection on the shard key  { ticker:1, time:1 }
```

After sharding the collection, look at the chunks which exist:

```javascript
use config
db.chunks.find()
// or:
db.chunks.find({}, {min:1,max:1,shard:1,_id:0,ns:1})
```
Run homework.b() to verify the above and enter the return value below.

Answer: 3
# Homework 6-3
Let's now add a new shard. Run another mongod as the new shard on a new port number. Use --shardsvr.

Then add the shard to the cluster (see sh.help()).

You can confirm the above worked by running:

```javascript
homework.check1()
```
Now wait for the balancer to move data among the two shards more evenly. Periodically run:

```javascript
use config
db.chunks.find( { ns:"week6.trades" }, {min:1,max:1,shard:1,_id:0} ).sort({min:1})
```
and/or:
```javascript
db.chunks.aggregate( [
 { $match : { ns : "week6.trades" } } ,
 { $group : { _id : "$shard", n : { $sum : 1 } } }
] )
```
When done, run homework.c() and enter the result value.

That completes this week's homework. However if you want to explore more, something to try would be to try some queries and/or write operations with a single process down to see how the system behaves in such a situation.

Answer: 2
