export function getTreeMouseDownTarget(nodeClassName: string, event: React.MouseEvent<any>): string | undefined {
  const target = event.target as HTMLElement;
  let listItem = target;
  while (listItem.parentElement !== null) {
    listItem = listItem.parentElement;
    if (listItem.classList.contains(nodeClassName)) {
      break;
    }
  }
  if (listItem == null) {
    return;
  }
  let nodeId: string | null = null;
  for (const [_, clazz] of (listItem.classList as any).entries()) { 
    if (clazz.startsWith('id:')) {
      nodeId = clazz.split(':')[1];
    } 
  }
  return nodeId;
}