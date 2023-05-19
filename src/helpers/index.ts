export const isPath = (item: paper.Item): item is paper.Path => {
  return item.className === 'Path';
};
