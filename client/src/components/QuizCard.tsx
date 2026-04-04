import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import type { QuizQuestion } from '../types';

interface QuizCardProps {
  question: QuizQuestion;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => `${theme.spacing['2xl']} ${theme.spacing['2xl']}`};
  animation: ${fadeIn} 0.3s ease;

  ${({ theme }) => theme.mq.mobile} {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const KoreanText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.3;

  ${({ theme }) => theme.mq.mobile} {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
  }
`;

const HintButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 500;
  white-space: nowrap;
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $active }) => $active ? `${theme.colors.primary}12` : theme.colors.surface};
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.textMuted};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const HintArea = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  animation: ${fadeIn} 0.2s ease;
`;

const Pronunciation = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
`;

export default function QuizCard({ question }: QuizCardProps) {
  const [showHint, setShowHint] = useState(false);

  return (
    <Card>
      <TopRow>
        <KoreanText>{question.korean}</KoreanText>
        {question.pronunciation && (
          <HintButton
            $active={showHint}
            onClick={() => setShowHint(prev => !prev)}
          >
            {showHint ? '힌트 숨기기' : '힌트 보기'}
          </HintButton>
        )}
      </TopRow>
      {showHint && question.pronunciation && (
        <HintArea>
          <Pronunciation>{question.pronunciation}</Pronunciation>
        </HintArea>
      )}
    </Card>
  );
}
