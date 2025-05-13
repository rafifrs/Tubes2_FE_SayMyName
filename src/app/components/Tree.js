import React, { useRef, useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { convertResultToTree } from "./../helper/converter";

const MyTree = ({ result, elementsData }) => {
  const treeContainer = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const updateDimensions = () => {
      if (treeContainer.current) {
        const { width, height } = treeContainer.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // trackpad
  useEffect(() => {
    if (treeContainer.current) {
      const preventDefaultWheel = (e) => {
        if (e.ctrlKey) {
          e.preventDefault();
        }
      };

      const currentTreeContainer = treeContainer.current;
      currentTreeContainer.addEventListener("wheel", preventDefaultWheel, { passive: false });

      return () => {
        if (currentTreeContainer) {
          currentTreeContainer.removeEventListener("wheel", preventDefaultWheel);
        }
      };
    }
  }, []);

  if (!Array.isArray(result) || result.length === 0) {
    return <div className="text-white flex items-center justify-center h-full">No Path Found</div>;
  }

  let resultReversed = result.slice().reverse();

  const treeData = convertResultToTree(resultReversed);

  const renderCustomNodeElement = ({ nodeDatum }) => {
    const elementInfo = elementsData?.find((el) => el.name === nodeDatum.name);

    const imageName = nodeDatum.name + ".svg";
    const imagePath = `/img/${imageName}`;
    const fallbackImagePath = "/img/default.svg";

    const imageSize = 40;
    const textOffsetY = imageSize / 2 + 15;

    return (
      <g>
        <image
          href={imagePath}
          x={-imageSize / 2}
          y={-imageSize / 2}
          width={imageSize}
          height={imageSize}
          onError={(e) => {
            e.target.onerror = null;
            e.target.href = fallbackImagePath;
          }}
        />
        <text fill="white" stroke="none" textAnchor="middle" dy={textOffsetY} fontSize="12" fontWeight="bold">
          {nodeDatum.name}
        </text>
      </g>
    );
  };

  return (
    <div ref={treeContainer} className="w-full h-full cursor-move" style={{ touchAction: "manipulation" }}>
      {dimensions.width > 0 && (
        <Tree
          data={treeData}
          translate={{ x: dimensions.width / 2, y: 100 }}
          zoom={0.8}
          zoomable={true}
          draggable={true}
          scaleExtent={{ min: 0.1, max: 2 }}
          separation={{ siblings: 1.4, nonSiblings: 2.2 }}
          pathFunc="diagonal"
          orientation="vertical"
          nodeSize={{ x: 100, y: 100 }}
          collapsible={false}
          renderCustomNodeElement={renderCustomNodeElement}
          shouldRenderLabel={true}
        />
      )}
      <style jsx>{`
        :global(.custom-link) {
          stroke: #c426a4 !important;
          stroke-width: 2px !important;
        }
        :global(.rd3t-link) {
          stroke: #c426a4 !important;
          stroke-width: 2px !important;
        }
        .rd3t-label {
          fill: white !important;
          font-weight: bold;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default MyTree;
