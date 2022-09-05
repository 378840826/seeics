export function getParentIdList(list, id) {
  if (!list || !id) {
    return '';
  }
  const arr = [];
  const findParent = (data, nodeId, parentId) => {
    for (let i = 0, length = data.length; i < length; i++) {
      const node = data[i];
      if (node.value === nodeId) {
        arr.unshift(nodeId);
        if (nodeId === list[0].value) {
          break;
        }
        findParent(list, parentId);
        break;
      } else {
        if (node.children) {
          findParent(node.children, nodeId, node.value);
        }
        continue;
      }
    }
    return arr;
  };
  return findParent(list, id);
}