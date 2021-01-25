/// <reference path="./typedefs.js" />
/**
 * Interprets its input as a mutation to be rearranged
 * into 3 labels/properties it can return: $add, $update, $remove
 * Open the test for examples
 * @param {Doc} doc - The input document
 * @param {Mutation} mutation - The mutation to execute
 * @returns {Object}
 */
function generateUpdateStatement(doc, mutation) {
  const opsNames = ["$remove", "$update", "$add"];
  const props = ["text", "value"];
  const iterable = mutation.posts ? "posts" : "mentions";
  let ops = {};

  mutation[iterable].forEach((change) => {

    // $add handling
    if (!change._id) {
      ops.$add = ops.$add || {};
      ops.$add[iterable] = ops.$add[iterable] || [];
      Object.keys(change).forEach((prop) => {
        if (!props.includes(prop)) {
          throw new Error(`Unsupported property found: ${prop}`);
        }
      });
      ops.$add[iterable].push(change);
      return;
    }

    // $remove handling
    let elementIndex = doc[iterable].findIndex((e) => e._id === change._id);
    if (change._delete) {
      ops.$remove = ops.$remove || {};
      ops.$remove[`${iterable}.${elementIndex}`] = true;
      return;
    }

    // $update handling
    for (let index = 0; index < props.length; index++) {
      const prop = props[index];
      if (change[prop]) {
        ops.$update = ops.$update || {};
        ops.$update[`${iterable}.${elementIndex}.${prop}`] = change[prop];
        return;
      }
    }

    // 'mentions' property handling (using recursion)
    if (change.mentions) {
      let mention = generateUpdateStatement(
        doc[iterable][elementIndex],
        change
      );
      opsNames.forEach((opName) => {
        if (mention[opName]) {
          for (const [key, value] of Object.entries(mention[opName])) {
            ops[opName] = ops[opName] || {};
            ops[opName][`posts.${elementIndex}.${key}`] = value;
          }
        }
      });
      return;
    }

    // If it reaches here something went wrong!
    throw new Error("Unsupported update mutation: " + JSON.stringify(change));
  });

  return ops;
}

module.exports = { generateUpdateStatement };
