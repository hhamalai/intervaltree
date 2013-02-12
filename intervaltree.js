function ConstructIntervalTree(I) {
    if (I.length == 0) {
        return new IntervalTree();
    } 
}

function objectCompare (a, b) {
    if (a.start < b.start) {
        return -1;
    } else if (a.start == b.start) {
        if (a.end < b.end) {
            return -1;
        } else {
            return 1;
        }
    } else {
        return 1;
    }
}

function IntervalTreeNode() {
    this.leftChild = null;
    this.rightChild = null;
    this.mLeftSet = null;
    this.mRightSet = null;
    this.xMid = null;

    this.construct = function(intervals) {
        if (intervals.length == 0) {
            return null;
        }
        this.xMid = median(intervals);
        var lSet = [];
        this.mLeftSet = []; 
        this.mRightSet = [];
        var rSet = [];
        for (var i=0; i < intervals.length; i++) {
            var elem = intervals[i];
            if (elem.end < this.xMid) {
                lSet.push(elem);
            } else if (elem.start > this.xMid) {
                rSet.push(elem);
            } else {
                this.mLeftSet.push(elem);
                this.mRightSet.push(elem);
            } 
        }
        this.mLeftSet.sort(sortByKey('start'));
        this.mRightSet.sort(sortByKey('end'));
        var nc = new IntervalTreeNode();
        if( nc.construct(lSet) ) {
            this.leftChild = nc;
        }
        nc = new IntervalTreeNode();
        if (nc.construct(rSet) ) {
            this.rightChild = nc;
        }
        return true;
    }
    IntervalTreeNode.prototype.getXMid = function() {
        return this.xMid;
    }
    IntervalTreeNode.prototype.getLeftChild = function() {
        return this.leftChild;
    }
    IntervalTreeNode.prototype.getRightChild = function() {
        return this.rightChild;
    }
    IntervalTreeNode.prototype.getLeftSet = function() {
        return this.mLeftSet;
    }
    IntervalTreeNode.prototype.getRightSet = function() {
        return this.mRightSet;
    }
}

function sortByKey(key) {
    return function(a, b) {
        if (a[key] < b[key]) return -1;
        else if (a[key] > b[key]) return 1;
        else return 0;
    }
}
function sortInt(a, b) {
    if (a < b) return -1;
    else if (a > b)  return 1;
    else return 0;
}
function median(intervals) {
    var endpoints = [];
    intervals.forEach(function(elem){
        endpoints.push(elem.start);
        endpoints.push(elem.end);
    });
    endpoints.sort(sortInt);
    return endpoints[parseInt(endpoints.length / 2)];
}

function query_point(v, q, results) {
    if (v == null) {
        return;
    } else if (q == v.getXMid()) {
        for (var i=0; i < v.getLeftSet().length; i++) {
            var it = v.getLeftSet()[i];
            results.push(it);
        }
        return;
    } else if (q < v.getXMid()) {
        for (var i=0; i < v.getLeftSet().length; i++) {
            var it = v.getLeftSet()[i];
            if (it.start <= q) {
                results.push(it);
            }
        }
        query_point(v.getLeftChild(), q, results);
    } else if (q > v.getXMid()) {
        for (var i=0; i < v.getRightSet().length; i++) {
            var it = v.getRightSet()[i];
            if (it.end >= q) {
                results.push(it);
            }
        }
        query_point(v.getRightChild(), q, results);
    }
}

function query(v, q_start, q_end, results) {
    if (v == null) {
        return;
    } else if (q_start == q_end) {
        query_point(v, q_start, results);
        return;
    }
    if (q_start > q_end) {
        q_tmp = q_start;
        q_start = q_end;
        q_end = q_tmp;
    }
    var child;
    var intervalSet;
    if (q_start < v.getXMid()) {
        intervalSet = v.getLeftSet()
    } else if (q_start > v.getXMid()) {
        intervalSet = v.getRightSet();
    }
    for (var i=0; i < intervalSet.length; i++) {
        var it = intervalSet[i];
        if (it.start <= q_end && it.end >= q_start) {
            results.push(it);
        }
    }
    query(v.getLeftChild(), q_start, q_end, results);
    query(v.getRightChild(), q_start, q_end, results);
}


function IntervalTree(intervals) {
    var root = new IntervalTreeNode();
    root.construct(intervals);

    /* v - root of the IntervalTree
     * d - interval object
     */
    IntervalTree.prototype.insert = function(v, d) {
    }

    /* v - root of the IntervalTree
     * q - query point
     */
    IntervalTree.prototype.query = function(v, q, results) {
        if (v == null) {
            return;
        } else if (q == v.getXMid()) {
            results.concat(v.getLeftSet());
            return
        } else if (q < v.getXMid()) {
            for (var i=0; i < v.getLeftSet().length; i++) {
                var it = v.getLeftSet().at(i);
                if (it.start < q) {
                    results.push(it);
                }
            }
            self.query(v.getLeftChild(), q, results);
        } else if (q > v.getXMid()) {
            for (var i=0; i < v.getRightSet().length; i++) {
                console.log(v.getRightSet());
                var it = v.getRightSet()[i];
                if (it.end > q) {
                    results.push(it);
                }
            }
            self.query(v.getRightChild(), q, results);
        }
    }
    IntervalTree.prototype.getRoot = function() {
        return root;
    }
}


function debug() {
    var intervals  = [
      {start: 5, end: 10, data: {color: "red"}},
      {start: 7, end: 10, data: {color: "blue"}},
      {start: 7, end: 21, data: {color: "pink"}},
      {start: 14, end: 20},
      {start: 21, end: 25},
      {start: 30, end: 35},
      {start: 36, end: 45},
      {start: 32, end: 42}
    ];
    console.log("intervals:")
    for (var i=0; i < intervals.length; i++) {
        console.log(intervals[i].start + " - " + intervals[i].end);
    }
    var tree = new IntervalTree(intervals);
    console.log("query results for point(7):");
    var l = new Array();
    query_point(tree.getRoot(), 7, l);
    console.log(l);
    console.log("query results for point(10):");
    var l = new Array();
    query_point(tree.getRoot(), 10, l);
    console.log(l);
    console.log("")
    console.log("query results for point(42):");
    l = new Array();
    query_point(tree.getRoot(), 42, l);
    console.log(l);
    console.log("")
    console.log("query results for range(9, 21):");
    l = new Array();
    query(tree.getRoot(), 9, 21, l);
    console.log(l)
    console.log("")
    
    console.log("query results for range(-1, 100):");
    l = new Array();
    query(tree.getRoot(), -1, 100, l);
    console.log(l)
    console.log("")

    console.log("query results for range(32, 42):");
    l = new Array();
    query(tree.getRoot(), 32, 42, l);
    console.log(l)
    console.log("")


    console.log("query results for range(-1, 3):");
    l = new Array();
    query(tree.getRoot(), -1, 3, l);
    console.log(l)
    console.log("")

}

debug();
