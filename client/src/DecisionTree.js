import React from 'react';
import Header from './components/header/Header';
import Tree from './components/tree/Tree';
import './App.css';

export default function DecisionTree() {
  return (
    <div className="App">
      <Header />
      <Tree />
    </div>
  );
}

/*
  <Header>
    <NodeInput>
      <InputForm>
        <Input>
        <SubmitButton>
    <UserAuthorization>
      <Modal>
        <Login>
        <Signup>
  <DecisionTree>
    <TimelineAxis>
    <Node>
  <NodeModal>
    <EditOptions>
      <DeleteNode>
      <DuplicateNode>
    <NodeContents>
      <TextContents>
      <ImageContents>
*/
