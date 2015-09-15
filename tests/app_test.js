var expect = chai.expect;

describe("True", function() {
  describe("constructor", function() {
    it("should have a default name", function() {
      expect("Anon cow").to.equal("Anon cow");
    });
  });

  describe("App", function() {
    it("should set cow's name if provided", function() {
      expect(typeof(App)).to.equal("object");
    });
  });
});