import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import Navigation from './components/Navigation'
import MobileHeader from './components/MobileHeader'
import HomePage from './pages/HomePage'
import TodayStudyPage from './pages/TodayStudyPage'
import FlashcardPage from './pages/FlashcardPage'
import QuizPage from './pages/QuizPage'
import ManagePage from './pages/ManagePage'

const Main = styled.main`
  flex: 1;

  ${({ theme }) => theme.mq.tablet} {
    padding-bottom: 64px;
  }
`;

function App() {
  return (
    <BrowserRouter>
      <MobileHeader />
      <Navigation />
      <Main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/today" element={<TodayStudyPage />} />
          <Route path="/flashcard" element={<FlashcardPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/manage" element={<ManagePage />} />
        </Routes>
      </Main>
    </BrowserRouter>
  )
}

export default App
