import React, { useState } from "react";
import MyTree from "./Tree";

const TabTreeContainer = ({ trees, method, elementsData }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Validasi struktur data
  const isDFS = method === "dfs" && Array.isArray(trees);
  const isBFS = method === "bfs" && Array.isArray(trees?.Results);

  if (!isDFS && !isBFS) {
    return <div className="flex items-center justify-center h-full text-white">No Recipe Found</div>;
  }

  const treeList = isDFS ? trees : trees.Results;

  return (
    <div className="flex flex-col h-full">
      {/* Tab Headers */}
      <div className="overflow-x-auto whitespace-nowrap flex space-x-2 mb-4">
        {treeList.map((_, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-t-lg transition ${index === activeTab ? "bg-[#c426a4] text-white" : "bg-transparent text-[#c426a4] border-b-2 border-transparent hover:border-[#c426a4]"}`}
            onClick={() => setActiveTab(index)}
          >
            Tree {index + 1}
          </button>
        ))}
      </div>

      {/* Gambar tree */}
      <div className="flex-1 overflow-hidden">
        <div style={{ width: "100%", height: "100%" }}>
          <MyTree result={treeList[activeTab]?.Path || []} elementsData={elementsData} />
        </div>
      </div>
    </div>
  );
};

export default TabTreeContainer;
