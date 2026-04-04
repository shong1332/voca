import styled, { keyframes } from 'styled-components';

interface FeedbackProps {
  correct: boolean;
  correctAnswer: string;
  korean: string;
  exampleSentence: string | null;
  exampleTranslation: string | null;
  accuracy: number;
  onNext: () => void;
}

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div<{ $correct: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme, $correct }) => $correct ? theme.colors.successLight : theme.colors.dangerLight};
  border: 1px solid ${({ theme, $correct }) => $correct ? theme.colors.success : theme.colors.danger};
  animation: ${slideIn} 0.25s ease;
  overflow-y: auto;
  position: relative;

  ${({ theme }) => theme.mq.mobile} {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.div<{ $correct: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
  color: ${({ theme, $correct }) => $correct ? theme.colors.success : theme.colors.danger};
`;

const Accuracy = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CorrectAnswerText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const KoreanText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ExampleSection = styled.div`
  background: ${({ theme }) => theme.colors.bg};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ExampleSentence = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  font-style: italic;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ExampleTranslation = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`;

const NextButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.xl}`};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 500;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.9;
  }
`;

export default function Feedback({ correct, correctAnswer, korean, exampleSentence, exampleTranslation, accuracy, onNext }: FeedbackProps) {
  return (
    <Wrapper $correct={correct}>
      <TopRow>
        <Title $correct={correct}>{correct ? '정답!' : '오답'}</Title>
        <Accuracy>정답률 {accuracy}%</Accuracy>
      </TopRow>
      <CorrectAnswerText>{correctAnswer}</CorrectAnswerText>
      <KoreanText>{korean}</KoreanText>
      {exampleSentence && (
        <ExampleSection>
          <ExampleSentence>{exampleSentence}</ExampleSentence>
          {exampleTranslation && (
            <ExampleTranslation>→ {exampleTranslation}</ExampleTranslation>
          )}
        </ExampleSection>
      )}
      <NextButton onClick={onNext}>다음 퀴즈</NextButton>
    </Wrapper>
  );
}
