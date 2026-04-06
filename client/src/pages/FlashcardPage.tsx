import { useEffect, useState } from 'react';
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
  height: calc(100vh - 44px);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  ${({ theme }) => theme.mq.tablet} {
    padding: ${({ theme }) => theme.spacing.md};
    height: calc(100dvh - 92px);
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

const SpeakButton = styled.button`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 20px;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
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

const SpeakRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SpeedSlider = styled.input.attrs({ type: 'range' })`
  width: 100px;
  height: 4px;
  accent-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

const SpeedLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  min-width: 28px;
  text-align: center;
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

let speakRate = 0.9;

function speak(text: string, lang: 'en-GB' | 'en-US') {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = speakRate;
  const voices = speechSynthesis.getVoices();
  if (lang === 'en-GB') {
    const v = voices.find(v => v.name.includes('Daniel') || v.name.includes('Google UK English Male'))
      || voices.find(v => v.lang.startsWith('en-GB'));
    if (v) u.voice = v;
  } else {
    const v = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google US English'))
      || voices.find(v => v.lang.startsWith('en-US'));
    if (v) u.voice = v;
  }
  speechSynthesis.speak(u);
}

export default function FlashcardPage() {
  const {
    currentWord, revealed, error,
    mode, setMode, reveal, next, prev, fetchWords,
  } = useFlashcard();

  const [rate, setRate] = useState(0.9);

  useEffect(() => {
    fetchWords();
    // 음성 목록 미리 로드
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }, []);

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

  return (
    <Container>
      <PageTitle>플래시카드</PageTitle>

      <Controls>
        <FlashcardModeSelector mode={mode} onModeChange={setMode} />
        <DateFilter onDateChange={handleDateChange} />
      </Controls>

      {error ? (
        <CenterMessage>
          <p>{error}</p>
          <RetryButton onClick={() => fetchWords()}>다시 시도</RetryButton>
        </CenterMessage>
      ) : currentWord ? (
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
          {revealed && (
            <SpeakRow>
              <SpeedLabel>{rate.toFixed(1)}x</SpeedLabel>
              <SpeedSlider
                min="0.5"
                max="1.5"
                step="0.1"
                value={rate}
                onChange={e => { const v = Number(e.target.value); setRate(v); speakRate = v; }}
              />
              <SpeakButton onClick={() => speak(currentWord.english, 'en-GB')}>🇬🇧</SpeakButton>
              <SpeakButton onClick={() => speak(currentWord.english, 'en-US')}>🇺🇸</SpeakButton>
            </SpeakRow>
          )}
          <NavButtons>
            {revealed ? (
              <NavButton onClick={next}>다음 →</NavButton>
            ) : (
              <NavButton onClick={reveal}>정답 보기</NavButton>
            )}
          </NavButtons>
        </>
      ) : null}
    </Container>
  );
}
