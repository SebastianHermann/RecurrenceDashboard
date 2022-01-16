import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import Store from './Store';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TGroupsMain from './components/views/tacticalGroups/TGroupsMain';
import ProjectsMain from './components/views/projects/ProjectsMain';
import Main from './components/views/Main';

const rootElement = document.getElementById('root');
const element = () => {
  return <div>hellllllo</div>;
};

render(
  <BrowserRouter>
    <Provider store={Store}>
      <Routes>
        <Route path="/" element={<App />} exact></Route>
        <Route path="projects" element={<ProjectsMain />} exact></Route>
        <Route path="projects/:project_id" element={<Main />} exact />
      </Routes>
    </Provider>
  </BrowserRouter>,
  rootElement
);
