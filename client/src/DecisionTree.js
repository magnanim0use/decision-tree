import React from 'react';
import Header from './components/header/Header';
import Tree from './components/tree/Tree';
import Modal from './components/modal/Modal';
import './DecisionTree.css';

export default function DecisionTree() {
  return (
    <div className="App">
      <Modal />
      <Header />
      <Tree />
    </div>
  );
}
