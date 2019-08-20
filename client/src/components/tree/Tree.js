import React from 'react';
import SVG from './svg/Svg.js';
import './Tree.css';

export default function Tree() {
  return (
    <div className="Tree">
      <div id='decision-tree-container'>	
      	<SVG>
      	</SVG>
      </div>
    </div>
  );
}
