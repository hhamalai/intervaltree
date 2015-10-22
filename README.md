intervaltree.js
===============

An interval tree implemented in JS

Demo
====
```
var tree = new IntervalTree(intervals);
var intervals = [
    {start: 5, end: 10, data: {color: "red"}},
    {start: 7, end: 10, data: {color: "blue"}},
    {start: 7, end: 21, data: {color: "pink"}},
];
var matchedIntervals1 = tree.queryPoint(10);
var matchedIntervals2 = tree.query(10, 20);
```


Running Mocha tests
===================
npm test
