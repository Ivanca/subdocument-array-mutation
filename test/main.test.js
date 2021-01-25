const { generateUpdateStatement } = require("../main.js");
const doc = require("./document.json");
const expect = require("chai").expect;

const baseTests = [
  {
    description: "handles post removal ($remove)",
    input: { posts: [{ _id: 2, _delete: true }] },
    output: { $remove: { "posts.0": true } },
  },
  {
    description: "handles mention's removal ($remove)",
    input: { posts: [{ _id: 3, mentions: [{ _id: 6, _delete: true }] }] },
    output: { $remove: { "posts.1.mentions.1": true } },
  },
  {
    description: "handles update of post ($update)",
    input: { posts: [{ _id: 2, value: "too" }] },
    output: { $update: { "posts.0.value": "too" } },
  },
  {
    description: "handles addition of new post ($add)",
    input: { posts: [{ value: "four" }] },
    output: { $add: { posts: [{ value: "four" }] } },
  },
  {
    description: "handles addition of new mention ($add)",
    input: { posts: [{ _id: 3, mentions: [{ text: "banana" }] }] },
    output: { $add: { "posts.1.mentions": [{ text: "banana" }] } },
  },
  {
    description: "handles multiple operations at once ($update, $add, $remove)",
    input: {
      posts: [
        { _id: 2, value: "too" },
        { value: "four" },
        { _id: 4, _delete: true },
      ],
    },
    output: {
      $update: { "posts.0.value": "too" },
      $add: { posts: [{ value: "four" }] },
      $remove: { "posts.2": true },
    },
  },
];

describe("generateUpdateStatement", function () {
  baseTests.forEach((test) => {
    it(test.description, function () {
      expect(generateUpdateStatement(doc, test.input)).to.eql(test.output);
    });
  });

  it("should throw an exception when updating an unsupported property", function () {
    let bad = { posts: [{ _id: 2, foo: "bar" }] };
    let error = `Unsupported update mutation: ${JSON.stringify(bad.posts[0])}`;
    expect(generateUpdateStatement.bind(null, doc, bad)).to.throw(error);
  });

  it("should throw an exception when adding an unsupported property", function () {
    let bad = { posts: [{ foo: "bar" }] };
    let error = "Unsupported property found: foo";
    expect(generateUpdateStatement.bind(null, doc, bad)).to.throw(error);
  });

});
