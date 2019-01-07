import { isEmpty } from "lodash";
import { LOADING_STATUS, OPERATION_MENU_OPTIONS } from "@/utils/constant";
export const isFailed = status => status === LOADING_STATUS.FAILED;
export const isSucceed = status => status === LOADING_STATUS.SUCCESS;
export const isEdit = currentOperate =>
  currentOperate === OPERATION_MENU_OPTIONS.EDIT;
export const isAdd = currentOperate =>
  currentOperate === OPERATION_MENU_OPTIONS.ADD;
export const getNodePath = node => {
  const nodePaths = [];
  let parent = node.getParentNode();
  while (parent) {
    nodePaths.unshift(parent);
    parent = parent.getParentNode();
  }
  return nodePaths.map(nodePath => nodePath.name).join(">");
};
export const rebuildTree = (children, parentNode) => {
  if (!children) return undefined;
  return children.map(node => {
    const child = node;
    child.getParentNode = () => parentNode;
    child.isLeafNode = () => isEmpty(child.children);
    child.getPath = () => getNodePath(child);
    child.children = rebuildTree(child.children, child);
    return child;
  });
};
export function getNodeById(tree, id) {
  let foundNode = {};
  const findNode = (nodeTree, nodeId) => {
    if (isEmpty(nodeTree)) {
      return;
    }
    nodeTree.forEach(node => {
      if (node.id == nodeId) {
        foundNode = node;
        return false;
      } else if (!isEmpty(node.children)) {
        findNode(node.children, nodeId);
      }
    });
  };
  findNode(tree, id);
  return foundNode;
}
