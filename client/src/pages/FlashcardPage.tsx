import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useFlashcard } from '../hooks/useFlashcard';
import Flashcard from '../components/Flashcard';
import FlashcardModeSelector from '../components/FlashcardModeSelector';
import DateFilter from '../components/DateFilter';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};

  ${({ theme }) => theme.mq.tablet} {
    padding: ${({ theme }) => theme.spacing.md};
    height: calc(100dvh - 104px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
`;

const CardArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PageTitle = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};

  ${({ theme }) => theme.mq.tablet} {
    display: none;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  animation: ${fadeIn} 0.3s ease;

  ${({ theme }) => theme.mq.tablet} {
    margin-bottom: ${({ theme }) => theme.spacing.md};

    & > * {
      flex: 1;
    }
  }
`;

const NavButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.xl};

  ${({ theme }) => theme.mq.tablet} {
    margin-top: auto;
    padding-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const NavButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing['2xl']}`};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CenterMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RetryButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.xl}`};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 500;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${({ theme }) => theme.colors.borderLight};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function FlashcardPage() {
  const {
    currentWord, revealed, loading, error,
    mode, setMode, reveal, next, prev, fetchWords,
  } = useFlashcard();

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const handleDateChange = (date?: string) => {
    fetchWords(date);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!revealed) reveal();
        else next();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev, reveal, revealed]);

  if (loading) {
    return (
      <Container>
        <CenterMessage><LoadingSpinner /></CenterMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <PageTitle>플래시카드</PageTitle>
        <CenterMessage>
          <p>{error}</p>
          <RetryButton onClick={() => fetchWords()}>다시 시도</RetryButton>
        </CenterMessage>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>플래시카드</PageTitle>

      <Controls>
        <FlashcardModeSelector mode={mode} onModeChange={setMode} />
        <DateFilter onDateChange={handleDateChange} />
      </Controls>

      {currentWord ? (
        <>
          <CardArea>
            <Flashcard
              word={currentWord}
              mode={mode}
              revealed={revealed}
              onReveal={reveal}
              onNext={next}
            />
          </CardArea>
          <NavButtons>
            {revealed ? (
              <NavButton onClick={next}>다음 →</NavButton>
            ) : (
              <NavButton onClick={reveal}>정답 보기</NavButton>
            )}
          </NavButtons>
        </>
      ) : (
        <CenterMessage>단어가 없습니다.</CenterMessage>
      )}
    </Container>
  );
}
