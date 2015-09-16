var expect = chai.expect;
var assert = chai.assert;

describe("App", function() {
  describe("constructor", function() {
    it("should have a default city", function() {
      expect(App).to.have.property('cityStorage')
        .that.to.have.length.above(0);
    });

    it("should have a config", function() {
      expect(App).to.have.property('config')
        .that.to.be.an('object');
    });
  });

  describe("App.Model", function() {
    it("should exist", function() {
      expect(App.Model).to.exist;
    });

    it("should have a method getPlayers", function() {
      expect(App.Model.getPlayers).to.exist
        .that.to.be.an('function');
    });
  });

  describe('Ajax', function() {
    after(function () {
      jQuery.ajax.restore();
    });

    it("makes a GET request for players", function () {
      sinon.stub(jQuery, "ajax");
      App.Model.getPlayers(App.cityStorage, sinon.spy());
      assert(jQuery.ajax.calledWithMatch({ url:'https://kicker-parser.herokuapp.com/grabData' }));
    });

  });


});

describe("Extension config", function() {
  it("should exist", function() {
    expect(extensionConfig).to.exist;
  });

  it("should have a url", function() {
    expect(extensionConfig).to.have.property('url')
      .that.to.have.length.above(0);
  });

  it("should have a method", function() {
    expect(extensionConfig).to.have.property('method')
      .that.to.have.length.above(0);
  });
});