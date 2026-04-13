import dagre from 'dagre';

const nodeWidth = 250;
const nodeHeight = 100;

export const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 150, ranksep: 200 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const IGNORE_LIST = ['node_modules', '.git', '.next', 'dist', 'build', '.venv', '__pycache__'];

export const parseFileList = async (fileList) => {
  const nodes = [];
  const edges = [];
  const folderMap = new Map();

  const rootId = 'root';
  nodes.push({
    id: rootId,
    type: 'custom',
    data: { 
      label: 'PROJECT_ROOT', 
      type: 'database', 
      index: 0, 
      code: '// Root Directory',
      loc: 0,
      complexity: 'low'
    },
    position: { x: 0, y: 0 },
  });
  folderMap.set('', rootId);

  const files = Array.from(fileList).filter(file => {
    const pathParts = file.webkitRelativePath.split('/');
    return !pathParts.some(part => IGNORE_LIST.includes(part));
  });
  files.sort((a, b) => a.webkitRelativePath.split('/').length - b.webkitRelativePath.split('/').length);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const pathParts = file.webkitRelativePath.split('/');
    
    let currentPath = '';
    let parentId = rootId;

    for (let j = 0; j < pathParts.length; j++) {
      const part = pathParts[j];
      const isLast = j === pathParts.length - 1;
      const partPath = currentPath ? `${currentPath}/${part}` : part;
      
      if (!folderMap.has(partPath)) {
        const nodeId = `node-${nodes.length}`;
        const isFile = isLast;
        
        let fileContent = '';
        let loc = 0;
        let complexity = 'low';

        if (isFile) {
          fileContent = await file.text();
          loc = fileContent.split('\n').length;
          
          if (loc > 300) complexity = 'high';
          else if (loc > 100) complexity = 'medium';
        }

        nodes.push({
          id: nodeId,
          type: 'custom',
          data: { 
            label: part, 
            type: isFile ? getFileType(part) : 'backend',
            index: nodes.length,
            code: isFile ? fileContent : `// Directory: ${part}`,
            loc,
            complexity,
            isFolder: !isFile,
            collapsed: false
          },
          position: { x: 0, y: 0 },
        });

        edges.push({
          id: `edge-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: 'custom',
        });

        folderMap.set(partPath, nodeId);
      }

      parentId = folderMap.get(partPath);
      currentPath = partPath;
    }
  }

  return getLayoutedElements(nodes, edges);
};

function getFileType(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  if (['js', 'jsx', 'ts', 'tsx', 'html', 'css'].includes(ext)) return 'frontend';
  if (['py', 'go', 'rb', 'php', 'java', 'c', 'cpp'].includes(ext)) return 'backend';
  if (['sql', 'db', 'json', 'yml', 'yaml', 'md'].includes(ext)) return 'database';
  return 'default';
}
