var expect = require("chai").expect;
var IntervalTree = require("../src/intervaltree");
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

describe("Test Interval Tree", function() {
	it("Point queries", function() {
        var tree = new IntervalTree(intervals);
		expect(tree.queryPoint(7).length).to.equal(3);
        expect(tree.queryPoint(10).length).to.equal(3);
        expect(tree.queryPoint(6).length).to.equal(1);
        expect(tree.queryPoint(6)[0].data.color).to.equal("red");
        expect(tree.queryPoint(42).length).to.equal(2);
        expect(tree.queryPoint(4).length).to.equal(0);
	});

    it("Range queries", function() {
        var tree = new IntervalTree(intervals);
        expect(tree.query(9, 21).length).to.equal(5);
        expect(tree.query(-1000, 1000).length).to.equal(8);
        expect(tree.query(42, 32).length).to.equal(3);
        expect(tree.query(-1, 3).length).to.equal(0);
        expect(tree.query(100, 99).length).to.equal(0);
    });
});
