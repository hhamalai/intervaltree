var IntervalTree = (function() {
    var IntervalTree = function(intervals) {
        this.root = new IntervalTreeNode();
        this.root.construct(intervals);
    };

    IntervalTree.prototype.getRoot = function() {
        return this.root;
    };

    IntervalTree.prototype.queryPoint = function(point) {
        var results = [];
        var root = this.getRoot();
        return this._queryPoint(root, point, results);
    };

    IntervalTree.prototype._queryPoint = function(v, q, results) {
        var i, it;
        if (v === null) {
            return results;
        } else if (q == v.getXMid()) {
            for (i=0; i < v.getLeftSet().length; i++) {
                it = v.getLeftSet()[i];
                results.push(it);
            }
            return results;
        } else if (q < v.getXMid()) {
            for (i=0; i < v.getLeftSet().length; i++) {
                it = v.getLeftSet()[i];
                if (it.start <= q) {
                    results.push(it);
                }
            }
            return this._queryPoint(v.getLeftChild(), q, results);
        } else if (q > v.getXMid()) {
            for (i=0; i < v.getRightSet().length; i++) {
                it = v.getRightSet()[i];
                if (it.end >= q) {
                    results.push(it);
                }
            }
            return this._queryPoint(v.getRightChild(), q, results);
        }
    };

    IntervalTree.prototype.query = function(q_start, q_end) {
        var results = [];
        return this._query(this.getRoot(), q_start, q_end, results);
    };

    IntervalTree.prototype._query = function(v, q_start, q_end, results) {
        if (v === null) {
            return results;
        } else if (q_start == q_end) {
            return this._queryPoint(v, q_start, results);
        }
        if (q_start > q_end) {
            q_tmp = q_start;
            q_start = q_end;
            q_end = q_tmp;
        }
        var child;
        var intervalSet;
        if (q_start < v.getXMid()) {
            intervalSet = v.getLeftSet();
        } else if (q_start > v.getXMid()) {
            intervalSet = v.getRightSet();
        }
        for (var i=0; i < intervalSet.length; i++) {
            var it = intervalSet[i];
            if (it.start <= q_end && it.end >= q_start) {
                results.push(it);
            }
        }
        this._query(v.getLeftChild(), q_start, q_end, results);
        this._query(v.getRightChild(), q_start, q_end, results);
        return results;
    };


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
            if (intervals.length === 0) {
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
        };

        IntervalTreeNode.prototype.getXMid = function() {
            return this.xMid;
        };

        IntervalTreeNode.prototype.getLeftChild = function() {
            return this.leftChild;
        };

        IntervalTreeNode.prototype.getRightChild = function() {
            return this.rightChild;
        };

        IntervalTreeNode.prototype.getLeftSet = function() {
            return this.mLeftSet;
        };

        IntervalTreeNode.prototype.getRightSet = function() {
            return this.mRightSet;
        };
    }

    function sortByKey(key) {
        return function(a, b) {
            if (a[key] < b[key]) return -1;
            else if (a[key] > b[key]) return 1;
            else return 0;
        };
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


    IntervalTree.IntervalTree = function(intervals) {
        var root = new IntervalTreeNode();
        root.construct(intervals);

        /* v - root of the IntervalTree
         * d - interval object
         */
        IntervalTree.prototype.insert = function(v, d) {
        };

        /* v - root of the IntervalTree
         * q - query point
         */
        IntervalTree.prototype.query = function(v, q, results) {
            var i, it;
            if (v === null) {
                return;
            } else if (q == v.getXMid()) {
                results.concat(v.getLeftSet());
                return;
            } else if (q < v.getXMid()) {
                for (i=0; i < v.getLeftSet().length; i++) {
                    it = v.getLeftSet().at(i);
                    if (it.start < q) {
                        results.push(it);
                    }
                }
                self.query(v.getLeftChild(), q, results);
            } else if (q > v.getXMid()) {
                for (i=0; i < v.getRightSet().length; i++) {
                    it = v.getRightSet()[i];
                    if (it.end > q) {
                        results.push(it);
                    }
                }
                self.query(v.getRightChild(), q, results);
            }
        };
        IntervalTree.prototype.getRoot = function() {
            return this.root;
        };
    };

    return IntervalTree;
})();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = IntervalTree;
else
    window.Validator = IntervalTree;
