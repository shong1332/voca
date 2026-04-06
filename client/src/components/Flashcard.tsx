import styled, { keyframes } from 'styled-components';
import type { Word, FlashcardMode } from '../types';

interface FlashcardProps {
  word: Word;
  mode: FlashcardMode;
  revealed: boolean;
  onReveal: () => void;
  onNext: () => void;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing['3xl']};
  text-align: center;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
  animation: ${fadeIn} 0.3s ease;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;

  ${({ theme }) => theme.mq.tablet} {
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  ${({ theme }) => theme.mq.mobile} {
    padding: ${({ theme }) => theme.spacing.xl};
    min-height: 200px;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const QuestionText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;

  ${({ theme }) => theme.mq.mobile} {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
  }
`;

const Pronunciation = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  margin-top: -${({ theme }) => theme.spacing.md};
`;

const RevealedText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  animation: ${fadeIn} 0.25s ease;

  ${({ theme }) => theme.mq.mobile} {
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
`;

const ExampleText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
  line-height: 1.6;
  animation: ${fadeIn} 0.3s ease;
  max-width: 480px;

  ${({ theme }) => theme.mq.mobile} {
    font-size: ${({ theme }) => theme.fontSizes.xs};
  }
`;

const ExampleTranslation = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
  max-width: 480px;
  animation: ${fadeIn} 0.3s ease;
`;

export default function Flashcard({ word, mode, revealed, onReveal, onNext }: FlashcardProps) {
  const effectiveMode = mode === 'random'
    ? (word.id % 2 === 0 ? 'hide_korean' : 'hide_english')
    : mode;

  const isHideKorean = effectiveMode === 'hide_korean';
  const showText = isHideKorean ? word.english : word.korean;
  const hiddenText = isHideKorean ? word.korean : word.english;
  const showPronunciation = false;

  const handleCardClick = () => {
    const isTouch = window.matchMedia('(max-width: 768px)').matches;
    if (!isTouch) return;
    if (!revealed) onReveal();
    else onNext();
  };

  return (
    <Card onClick={handleCardClick}>
      <QuestionText>{showText}</QuestionText>
      {showPronunciation && <Pronunciation>{word.pronunciation}</Pronunciation>}
      {revealed && (
        <>
          <RevealedText>{hiddenText}</RevealedText>
          {word.pronunciation && <Pronunciation>{word.pronunciation}</Pronunciation>}
          {word.exampleSentence && (
            <>
              <ExampleText>{word.exampleSentence}</ExampleText>
              {word.exampleTranslation && (
                <ExampleTranslation>→ {word.exampleTranslation}</ExampleTranslation>
              )}
            </>
          )}
        </>
      )}
    </Card>
  );
}
