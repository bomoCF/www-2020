import{ fib_rek } from './maincos.js';
import { expect } from "chai";
import "mocha";

describe("Fibonacci", () => {
    it("should equal 0 for call with 0", () => {
        expect(fib_rek(0)).to.equal(0);
    });
});
  
describe("Fibonacci", () => {
    it("should equal 1 for call with 1", () => {
        expect(fib_rek(1)).to.equal(1);
    });
});

describe("Fibonacci", () => {
    it("should equal 1 for call with 2", () => {
        expect(fib_rek(2)).to.equal(1);
    });
});

describe("Fibonacci", () => {
    it("should equal 3 for call with 4", () => {
        expect(fib_rek(4)).to.equal(3);
    });
});

describe("Fibonacci", () => {
    it("should equal 5 for call with 5", () => {
        expect(fib_rek(5)).to.equal(5);
    });
});