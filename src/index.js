const footnotes = require(`remark-numbered-footnotes`);
const visit = require('unist-util-visit')
const _ = require(`lodash`)
const remove = require(`unist-util-remove`)

const reorder = (tree) => {

  let footnoteOrder = {}
  let count = 0

  let defNodeCopy = {} // copies of definition nodes

  visit(tree, (node, index, parent) => {
    
    if (node.type === "footnoteReference") {
      if (!Object.values(footnoteOrder).includes(node.identifier)) {
        footnoteOrder[count] = node.identifier
        count++
      }
    }

    if (node.type === "footnoteDefinition") {
      defNodeCopy[node.identifier] = _.cloneDeep(node)
    }
  })

  console.log(defNodeCopy)

  remove(tree, { type: "footnoteDefinition" })

  for (let key in footnoteOrder) {
    // console.log("key", key)
    tree.children.push(defNodeCopy[footnoteOrder[key]])
  }
}

module.exports = ({ markdownAST }) => {
  return new Promise(resolve => {
    reorder(markdownAST)

    footnotes()(markdownAST)
    return resolve(markdownAST)
  })
}