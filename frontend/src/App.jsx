import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import PrepareResult from './pages/PrepareResult';
import ResultView from './pages/ResultView';
import SearchResult from './pages/SearchResult';
import AllStudents from './pages/AllStudents';
import { fetchStudentByPrn, fetchStudentById } from './services/api';
import './styles/style.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard-view');
  const [selectedResult, setSelectedResult] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [toastConfig, setToastConfig] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  const showToast = (message, type = 'success') => {
    setToastConfig({ show: true, message, type });
  };

  const closeToast = () => {
    setToastConfig((prev) => ({ ...prev, show: false }));
  };

  const handleNavigate = (viewId) => {
    if (viewId !== 'prepare-view') {
      setEditingStudent(null);
    }
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewResultByPrn = async (prn) => {
    try {
      const data = await fetchStudentByPrn(prn);
      setSelectedResult(data);
      setCurrentView('result-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error loading student result:', err);
      showToast(err.message, 'danger');
    }
  };

  const handleEditStudent = async (id) => {
    try {
      const data = await fetchStudentById(id);
      setEditingStudent(data);
      setCurrentView('prepare-view');
      showToast(`Editing records for PRN: ${data.prn}`, 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error fetching student for edit:', err);
      showToast(err.message, 'danger');
    }
  };

  const handleResultSaved = (data) => {
    setSelectedResult(data);
    setCurrentView('result-view');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />
      <main className="main-wrapper">
        <div className="container-fluid px-lg-4">
          {currentView === 'dashboard-view' && (
            <Dashboard onNavigate={handleNavigate} onViewResult={handleViewResultByPrn} />
          )}

          {currentView === 'prepare-view' && (
            <PrepareResult
              editingStudent={editingStudent}
              onResultSaved={handleResultSaved}
              showToast={showToast}
            />
          )}

          {currentView === 'result-view' && (
            <ResultView resultData={selectedResult} onNavigate={handleNavigate} />
          )}

          {currentView === 'search-view' && (
            <SearchResult onViewResult={handleViewResultByPrn} showToast={showToast} />
          )}

          {currentView === 'students-view' && (
            <AllStudents
              onNavigate={handleNavigate}
              onViewResult={handleViewResultByPrn}
              onEditResult={handleEditStudent}
              showToast={showToast}
            />
          )}
        </div>
      </main>

      <Toast toastConfig={toastConfig} onClose={closeToast} />
    </div>
  );
}

export default App;
