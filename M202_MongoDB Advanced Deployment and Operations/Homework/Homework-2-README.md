# Homework: 2.1: Broken node, corrupt data files

Download Handouts:
* primary_from_rs_with_corrupt_data_files_mmapv1.tar.gz
* secondary_from_rs_with_corrupt_data_files_mmapv1.tar.gz
* arbiter_from_rs_with_corrupt_data_files_mmapv1.tar.gz

In this problem we have provided you with a replica set that is corrupted. You will start out with a working primary, a corrupted secondary, and a working arbiter. Your goal is to recover the replica set by doing the necessary work to ensure the secondary has an uncorrupted version of the data.

Please download and extract the handouts. There are three data directories: one for the primary, secondary, and arbiter. On your guest VM, you will need to run mongods for each of these on ports 30001, 30002, and 30003. If you initially find that the mongod running on port 30002 is a primary, please step it down. To get the replica set up and running, each node should be launched as follows (note: the dbpath directory for each node is located within a subdirectory of each handout):

* Primary

```
mongod --port 30001 --dbpath mongod-pri --replSet CorruptionTest --smallfiles --oplogSize 128 --nojournal
```

* Secondary

```
mongod --port 30002 --dbpath mongod-sec --replSet CorruptionTest --smallfiles --oplogSize 128 --nojournal
```

* Arbiter

```
mongod --port 30003 --dbpath mongod-arb --replSet CorruptionTest --nojournal
```

For this problem, do not attempt to configure MongoProc's port settings. You may still configure the host setting.

The corrupt data is in the data files found within the mongod-sec directory. Specifically, the testColl collection of the testDB database is corrupted. You can generate an error due to the corruption by running a .find().explain("executionStats") query on this collection (e.g. "use testDB; db.testColl.find().explain("executionStats")" to show the corruption error).

Bring the secondary back on line with uncorrupted data. When you believe you have done this, use MongoProc to test and, if correct, submit the homework

Submission deadline has passed.

# Homework-2.2

You are running a service with a predictable traffic usage pattern. Every Monday the usage peaks at 100,000 reads/sec on your replica set at 17:00 UTC.

For each of the next four days, the peak is 2% higher than the previous day (so 102,000 reads/sec on Tuesday, 104,040 on Wednesday, 106,121 on Thursday, 108,243 on Friday) at 17:00 UTC each day. Saturday and Sunday see significantly reduced traffic, at peaks of 50,000. This pattern repeats each week.

You have nine servers that are evenly distributed across three data centers. The application uses a read preference of secondary. Each of the nine servers has been benchmarked to handle 24,000 reads/sec at its maximum capacity.

There is a further mandate to avoid exceeding 90% of available capacity, if at all possible, for performance reasons. If the application exceeds 90%, this must be reported and escalated to the executive level.

You have deployed the servers as follows:

Data Center A: Primary, Secondary, Secondary
Data Center B: Secondary, Secondary, Secondary
Data Center C: Secondary, Secondary, Secondary
A failure occurs at 19:00 UTC on a Saturday when Data Center C becomes unavailable, along with its servers. Based on the description above, by when must you fix the issue in order to be sure you do not exceed the 90% capacity rule and cause escalations to happen?

Assumptions:

The load is evenly distributed across all available secondaries, and redistributes itself shortlyafter the failure.
The load does not deviate from the prediction.
You cannot read from the primary.
All assumptions here are reasonable. 

# Answer:

In this problem, you are asked to consider a scenario involving maximum capacity.

The procedure will be to take the total load, divide by the number of secondaries available, and determine if there will be a problem that day, which there will be if the load exceeds 90% of capacity.

After Data Center C becomes unavailable, there will be six servers, five of which will be secondaries, so we will be dividing our load among those five servers.

This maximum will be:

* Sunday: 50,000 / 5 = 10,000 connections at peak per server, or 10,000 / 24,000 = 0.416 capacity = 41.6% capacity
* Monday: 100000 / 5 = 100000 connections at peak per server, or 20000 / 24000 = 0.833 capacity = 83.3% capacity
* Tuesday: 102000 / 5 = 102000 connections at peak per server, or 20400 / 24000 = 0.85 capacity = 85.0% capacity
* Wednesday: 104040 / 5 = 104040 connections at peak per server, or 20808 / 24000 = 0.867 capacity = 86.7% capacity
* Thursday: 106120 / 5 = 106120 connections at peak per server, or 21224 / 24000 = 0.884 capacity = 88.4% capacity
* Friday: 108242 / 5 = 108242 connections at peak per server, or 21648 / 24000 = 0.902 capacity = 90.2% capacity
* Saturday: 50,000 / 5 = 10,000 connections at peak per server, or 10,000 / 24,000 = 0.416 capacity = 41.6% capacity

Note that we'll be above 90% capacity for the first time on Friday, which is the correct answer.


# Homework 2-3

Suppose you have a 3 member replica set with the primary in Data Center 2 (DC2) and two secondaries in Data Center 1 (DC1). You have set write concern at w=1. 

[<img src="./data_center.jpg">]

application makes three writes to the primary. However, before these writes have been replicated to either of the secondaries, there is a network partition that prevents communication between DC2 and DC1. The partition lasts for 10 minutes. The application producing writes is able to see all three members of the replica set during the entire network partition between DC2 and DC1. No other problems with your system arise during this period.

You should also assume that all members of the replica set have the same priority.

Which of the following are true about the system during the period of the network partition?

# Homework 2-4

Suppose that last night at midnight you took a snapshot of your database with mongodump. At a later time, someone accidentally dropped the only collection in the database using db.collection.drop(). You wish to restore the database to the state it was in immediately before the collection was dropped by replaying the oplog.

Which of the following are steps you should take in order for this to be successful? Check all that apply.

# Homework 2-5 Replaying the oplog

Download Handouts:
mongod__homework_hw_m202_w3_week3_wk3_536bf5318bb48b4bb3853f31.conf
backupt__homework_hw_w3_week3_wk3_536bf4e28bb48b4bb3853ecc.tar.gz
backupD__homework_m202_w3_week3_wk3_536bf4708bb48b4bb3853ec2.tar.gz

This problem will be a hands-on implementation of the last problem.

The backupDB database has one collection, backupColl. Your system is backed up with a mongodump. After one of these, the server continued taking writes until someone (not you) ran the command:

```
db.backupColl.drop()
```

Your job is to put your database back into the state it was in immediately before the database was dropped, then use MongoProc to verify that you have done it correctly.

You have been provided with a server directory in the backuptest.tar.gz file that includes your (now empty) data files, the mongodump file in backupDB.tar.gz, and a mongod.conf file. The conf file will set the name of your replica set to "BackupTest" and the port to 30001. Your replica set must have these settings to be graded correct in MongoProc. You may configure the host setting for MongoProc if necessary.

Use MongoProc to evaluate your solution. You can verify that your database is in the correct state with the test button and turn it in once you've passed.

This assignment is fairly tricky so you may want to check this stackoverflow question and answer. An alternative method to the stackoverflow response is using the "mongooplog" tool (there are several solutions to this problem).

If you run into the error with mongorestore "error applying oplog: applyOps: EOF", this issue has been fixed in MongoDB 3.0.4. At the time of this update, 3.0.4 is available for download as a release candidate (The 3.0.4-rc0 mongorestore binary for Ubuntu 14.04 can be downloaded here )

Tip: You may not need this, but if you are interested in updating an oplog's 'op' field for a document, it will complain if you increase the size the document (which it thinks is happening as an intermediate stage of an update), but you can do it anyway by simultaneously unsetting another field. For example, db.oplog.rs.update( { query }, { $set : { "op" : "c" }, $unset : { "o" : 1 } } ).

Tip #2: After restoring, you will find that you have 614800 documents in the collection.
