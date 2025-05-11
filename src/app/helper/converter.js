// Formatting ke struktur tree untuk react-d3-tree
function convertResultToTree(ResultReversed) {
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

    // console.log('ini ResultReversed', ResultReversed);
  
    // Bangun node dan relasi parent-child
    for (const step of ResultReversed) {
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

module.exports = {
  convertResultToTree,
}