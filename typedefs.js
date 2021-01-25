/**
 * @typedef {Object} PropChange
 * @property {string} text - optional
 * @property {string} value - optional
 */
/** 
 * @typedef {Object} MentionType
 * @property {number} _id - optional
 * @property {bool} _delete - optional
 */
/**
 * @typedef {PropChange & MentionType} Mention
 */
/**
 * @typedef {Mention & {mentions: Array.<Mention>}} Post
 */
/**
 * @typedef {Object} Doc
 * @property {number} _id
 * @property {string} name
 * @property {Array.<Post>} posts
 * 
 * @typedef {Object} Mutation
 * @property {Array.<Post>} posts
 *
 */