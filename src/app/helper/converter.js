function parseRawDFSResult(rawData, nodesVisited) {
    const pathArray = rawData.map(item => {
      const [child, parent1, parent2] = item.replace(/[{}]/g, "").split(" ");
      return {
        ChildName: child,
        Parent1Name: parent1,
        Parent2Name: parent2
      };
    });
  
    return {
      Path: pathArray,
      NodesVisited: nodesVisited
    };
  }
  
// Fungsi untuk konversi DFSResult ke struktur tree untuk react-d3-tree
function convertDFSResultToTree(dfsResultReversed) {
    const nameToNode = new Map();
    const isChild = new Set();
  
    // Helper untuk membuat/get node
    function getNode(name) {
      if (!name) return null;
      if (!nameToNode.has(name)) {
        nameToNode.set(name, { name, children: [] });
      }
      return nameToNode.get(name);
    }
  
    // Bangun node dan relasi parent-child
    for (const step of dfsResultReversed) {
      const parent = getNode(step.ChildName); // hasil gabungan, dianggap parent
      const child1 = getNode(step.Parent1Name); // bahan pertama
      const child2 = getNode(step.Parent2Name); // bahan kedua
  
      if (child1 && !parent.children.find(c => c.name === child1.name)) {
        parent.children.push(child1);
        isChild.add(child1.name);
      }
  
      if (child2 && !parent.children.find(c => c.name === child2.name)) {
        parent.children.push(child2);
        isChild.add(child2.name);
      }
    }
  
    // Cari node yang tidak pernah menjadi child → itu adalah root (misalnya "Picnic")
    const allNames = Array.from(nameToNode.keys());
    const rootNames = allNames.filter(name => !isChild.has(name));
  
    // Ambil root pertama saja untuk react-d3-tree
    const root = getNode(rootNames[0]);
    return [root];
  }

  function parseBackendDFSOutput(rawStr) {
    // Ambil semua elemen seperti {Child Parent1 Parent2}
    const tripleMatches = [...rawStr.matchAll(/\{(\w+)\s+(\w+)\s+(\w+)\}/g)];
  
    const pathArray = tripleMatches.map(match => ({
      ChildName: match[1],
      Parent1Name: match[2],
      Parent2Name: match[3],
    }));
  
    // Ambil angka terakhir setelah '] '
    const nodesVisitedMatch = rawStr.match(/\]\s*(\d+)\}?$/);
    const nodesVisited = nodesVisitedMatch ? parseInt(nodesVisitedMatch[1]) : 0;
  
    return {
      Path: pathArray,
      NodesVisited: nodesVisited
    };
  }

  function cleanRawData(rawStr) {
    // Hapus kurung kurawal luar yang tidak diperlukan
    const cleanedData = rawStr.replace(/^\{|\}$/g, '');
    return cleanedData;
  }
  
module.exports = {
    parseRawDFSResult,
    convertDFSResultToTree,
    parseBackendDFSOutput,
    cleanRawData
}