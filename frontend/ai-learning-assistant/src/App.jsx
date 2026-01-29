import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import DashBordPage from './pages/Dashboard/DashBordPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/Profile/ProfilePage';
import DocumentListPage from './pages/Documents/DocumentListPage';
import DocumentDetailPage from './pages/Documents/DocumentDetailPage';
import FlashCardListPage from './pages/FlashCard/FlashCardListPage';
import FlashCardDetailPage from './pages/FlashCard/FlashCardPage';
import QuizziesTakerPage from './pages/Quizzies/QuizziesTakerPage';
import QuizziesResultPage from './pages/Quizzies/QuizziesResultPage';
import Protected from './components/auth/Protected';
import { useAuth } from './context/AuthContext.jsx'

function App() {
  const { isAuthenticated, loading } = useAuth();
  console.log(isAuthenticated)
  if (loading) {
    return (<div>Loading...</div>);
  }

  return (
    <div className='text-blue-300 '>
      <Routes>
        {<Route path='/' element={isAuthenticated ? <Navigate to='/dashboard' replace /> : <Navigate to='/login' replace />}></Route>}
        <Route element={<Protected />}>
          <Route path='/dashboard' element={<DashBordPage></DashBordPage>}></Route>
          <Route path='/profile' element={<ProfilePage></ProfilePage>}></Route>
          <Route path='/documents' element={<DocumentListPage></DocumentListPage>}></Route>
          <Route path='/documents/:id' element={<DocumentDetailPage></DocumentDetailPage>}></Route>
          <Route path='/flashcards' element={<FlashCardListPage></FlashCardListPage>}></Route>
          <Route path='/documents/:id/flashcards/' element={<FlashCardDetailPage></FlashCardDetailPage>}></Route>
          <Route path='/quizzies/:quizId' element={<QuizziesTakerPage></QuizziesTakerPage>}></Route>
          <Route path='/quizzies/:quizId/result' element={<QuizziesResultPage></QuizziesResultPage>}></Route>
        </Route>
        <Route path='/login' element={<LoginPage></LoginPage>}></Route>
        <Route path='/register' element={<RegisterPage></RegisterPage>}></Route>
        <Route path='*' element={<NotFoundPage></NotFoundPage>}></Route>
      </Routes>
    </div>
  )
};

export default App;
