function ConstructIntervalTree(I) {
    if (I.length == 0) {
        return new IntervalTree();
    } 
}

function annotationCompare (a, b) {
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
        console.log("xmid" + this.xMid);
        //var node = new IntervalTreeNode(xMid, mLeftSet, mRightSet);
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
    IntervalTreeNode.prototype.setLeftChild = function(c) {
        leftChild = c;
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

function createNode(intervals) {
    console.log(intervals);
    if (intervals.length == 0) {
        return null;
    }
    var xMid = median(intervals);
    var lSet = [], mLeftSet = [], mRightSet = [], rSet = [];
    intervals.forEach(function(elem) {
        if (elem.end < xMid) {
            lSet.push(elem);
        } else if (elem.start > xMid) {
            rSet.push(elem);
        } else {
            mLeftSet.push(elem);
            mRightSet.push(elem);
        } 
    });
    mLeftSet.sort(sortByKey('start'));
    mRightSet.sort(sortByKey('end'));
    console.log("xmid" + xMid);
    var node = new IntervalTreeNode(xMid, mLeftSet, mRightSet);
    node.setLeftChild(createNode(lSet));
    node.setRightChild(createNode(rSet));
    return node;
}

function query(v, q, results) {
    if (v == null) {
        return;
    } else if (q == v.getXMid()) {
        results.concat(v.getLeftSet());
        return;
    } else if (q < v.getXMid()) {
        for (var i=0; i < v.getLeftSet().length; i++) {
            var it = v.getLeftSet()[i];
            if (it.start < q) {
                results.push(it);
            }
        }
        query(v.getLeftChild(), q, results);
    } else if (q > v.getXMid()) {
        for (var i=0; i < v.getRightSet().length; i++) {
            var it = v.getRightSet().at(i);
            if (it.end > q) {
                results.push(it);
            }
        }
        query(v.getRightChild(), q, results);
    }
}

function query(v, q_start, q_end, results) {
    if (v == null) {
        return;
    } else if (q_start == q_end) {
        query(v, q_start, results);
        return;
    }
    if (q_start > q_end) {
        q_tmp = q_start;
        q_start = q_end;
        q_end = q_tmp;
    }
    if (q_start <= v.getXMid() && q_end >= v.getXMid()) {
        results.concat(v.getLeftSet());
        return;
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
      {start: 5, end: 10},
      {start: 7, end: 10},
      {start: 7, end: 21},
      {start: 14, end: 20},
      {start: 21, end: 25},
      {start: 30, end: 35},
      {start: 36, end: 45},
      {start: 32, end: 42}
    ];
    var tree = new IntervalTree(intervals);
    console.log(tree);
    console.log(tree.getRoot().getXMid());
    console.log(tree.getRoot().getLeftSet());
    console.log(tree.getRoot().getRightSet());
    console.log("query results:");
    l = []
    query(tree.getRoot(), 8, l);
    console.log(l);
    if (tree.getRoot().getLeftChild() != null) {
        console.log("LC" + tree.getRoot().getLeftChild().getXMid());
        console.log(tree.getRoot().getLeftChild().getLeftSet());
        console.log(tree.getRoot().getLeftChild().getRightSet());
    }
    if (tree.getRoot().getRightChild() != null) {
        console.log("RC" + tree.getRoot().getRightChild().getXMid());
        console.log(tree.getRoot().getRightChild().getLeftSet());
        console.log(tree.getRoot().getRightChild().getRightSet());
    }

}

