# Understand mongo chunck movement

Let's say we have three shards server A,B and C. Each of them has a number of chunks. We are going to test the chunk movement among these shard servers. Initially A, B and C has 8, 5, 7 chunks respectively.

## Create a new cluster of shards for testing

Run below command to create a shards cluster with three members. 

```
cluster = new ShardingTest({shards:3,mongos: 1})
```
Then open another termainal to connect to the mongos instance and run below command to check its status:

```
sh.status()
```

## Stop balancer
```
sh.stopBalancer()
```
## Shard a collection
```
sh.shardCollection("balanceTest.foo", {_id:1})
```
## Split data
```
for(var i=0; i<19; i++){sh.splitAt('balanceTest.foo', {_id:i})}
```
then run `sh.status` you will see there are 20 chunks on shard `0000`

```
sh.status()

{  "_id" : "balanceTest",  "primary" : "shard0000",  "partitioned" : true }
		balanceTest.foo
			shard key: { "_id" : 1 }
			unique: false
			balancing: true
			chunks:
				shard0000	20
			too many chunks to print, use verbose if you want to force print
```

## Let move chunk for other members

```
mongos> for(var i=0; i<8; i++){sh.moveChunk('balanceTest.foo', {_id:i},'shard0001');};
{ "millis" : 115, "ok" : 1 }

mongos> for(var i=8; i<15; i++){sh.moveChunk('balanceTest.foo', {_id:i},'shard0002');};
{ "millis" : 110, "ok" : 1 }

mongos> for(var i=0; i<8; i++){sh.moveChunk('balanceTest.foo', {_id:i},'shard0001');};
{ "millis" : 61, "ok" : 1 }

mongos> sh.status()
--- Sharding Status --- 
  sharding version: {
	"_id" : 1,
	"minCompatibleVersion" : 5,
	"currentVersion" : 6,
	"clusterId" : ObjectId("58f2bcd2d243edd9edea63ef")
}
  shards:
	{  "_id" : "shard0000",  "host" : "192-168-1-6.tpgi.com.au:20000",  "state" : 1 }
	{  "_id" : "shard0001",  "host" : "192-168-1-6.tpgi.com.au:20001",  "state" : 1 }
	{  "_id" : "shard0002",  "host" : "192-168-1-6.tpgi.com.au:20002",  "state" : 1 }
  active mongoses:
	"3.4.0" : 1
 autosplit:
	Currently enabled: no
  balancer:
	Currently enabled:  no
	Currently running:  no
		Balancer lock taken at Sun Apr 16 2017 10:37:39 GMT+1000 (AEST) by ConfigServer:Balancer
	Failed balancer rounds in last 5 attempts:  0
	Migration Results for the last 24 hours: 
		15 : Success
		8 : Failed with error 'aborted', from shard0001 to shard0001
  databases:
	{  "_id" : "balanceTest",  "primary" : "shard0000",  "partitioned" : true }
		balanceTest.foo
			shard key: { "_id" : 1 }
			unique: false
			balancing: true
			chunks:
				shard0000	5
				shard0001	8
				shard0002	7
			too many chunks to print, use verbose if you want to force print

```

Before turn on the balancer, let's set the mongo log level to 1:

```
mongos> db.adminCommand({setParameter:1, logLevel:1})
{ "was" : 1, "ok" : 1 }
```
Start balancer:
```
mongos> sh.startBalancer()
{ "ok" : 1 }
```
Now check the log from mongo server for [balancer] part