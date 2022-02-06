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
import Report2PDF from './components/views/pdf/Report2PDF';
import Home from './components/views/home/home';
import TacticalGroups from './components/views/tacticalGroups/TacticalGroups';
import RecurrenceAnalysis from './components/views/recboard/RecurrenceAnalysis';
import TestPDF from './components/views/pdf/TestPDF';
import RecurrenceReport from './components/views/reports/RecurrenceReport';

const rootElement = document.getElementById('root');

render(
  <BrowserRouter>
    <Provider store={Store}>
      <Routes>
        <Route path="/" element={<App />} exact></Route>
        <Route path="projects" element={<ProjectsMain />}></Route>
        <Route path="projects/:project_id" element={<Main />}>
          <Route path="tacticalgroups" element={<TacticalGroups />}></Route>
          <Route
            path="recurrenceanalysis"
            element={<RecurrenceAnalysis />}
          ></Route>
          <Route path="recurrencereport" element={<RecurrenceReport />}></Route>
        </Route>
        <Route path="projects/:project_id/export" element={<TestPDF />}></Route>
      </Routes>
    </Provider>
  </BrowserRouter>,
  rootElement
);
