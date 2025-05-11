import React, { useRef, useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { convertResultToTree } from "./../helper/converter";

const MyTree = ({ result } ) => {
  // console.log('ini result di MyTree', result);
  console.log("MyTree props:", result);
  let resultReversed = result.slice().reverse();

  const treeData = convertResultToTree(resultReversed);
  const treeContainer = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions when component mounts or window resizes
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

  // Enhance trackpad interaction
  useEffect(() => {
    if (treeContainer.current) {
      // Prevent default browser wheel behavior to avoid conflicting with tree panning/zooming
      const preventDefaultWheel = (e) => {
        if (e.ctrlKey) { // Most trackpads send ctrl+wheel for pinch zoom
          e.preventDefault();
        }
      };
      
      treeContainer.current.addEventListener('wheel', preventDefaultWheel, { passive: false });
      
      return () => {
        if (treeContainer.current) {
          treeContainer.current.removeEventListener('wheel', preventDefaultWheel);
        }
      };
    }
  }, []);

  // Custom styling for nodes and links
  const nodeStyles = {
    node: {
      circle: {
        fill: "#c426a4",
        stroke: "white",
        strokeWidth: 1,
      },
    },
    link: {
      stroke: "#c426a4",
      strokeWidth: 2,
    },
  };

  // Custom node element to apply the styling
  const renderCustomNodeElement = ({ nodeDatum }) => (
    <g>
      <circle 
        r={20} 
        fill="#c426a4" 
        stroke="#c426a4"
        strokeWidth={2}
      />
      <text
        fill="white"        // warna teks (oranye)
        stroke="none"
        textAnchor="middle"
        dy={-30}               // posisi vertikal teks di bawah lingkaran
        fontSize="14"
        fontWeight="bold"
      >
        {nodeDatum.name}
      </text>
    </g>
  );
  
  
  return (
    <div 
      ref={treeContainer} 
      className="w-full h-full cursor-move"
      style={{ touchAction: "manipulation" }}
    >
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
          stroke: ${nodeStyles.link.stroke};
          stroke-width: ${nodeStyles.link.strokeWidth};
        }
        :global(.rd3t-link) {
          stroke: ${nodeStyles.link.stroke} !important;
          stroke-width: ${nodeStyles.link.strokeWidth} !important;
        }
        .rd3t-label {
          fill: white !important;  /* warna teks */
          font-weight: bold;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default MyTree;