import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['3xl']};
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  justify-content: center;

  ${({ theme }) => theme.mq.tablet} {
    padding: ${({ theme }) => theme.spacing.xl};
    min-height: auto;
    justify-content: flex-start;
    padding-top: ${({ theme }) => theme.spacing['2xl']};
  }

  ${({ theme }) => theme.mq.mobile} {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  animation: ${fadeIn} 0.5s ease;

  ${({ theme }) => theme.mq.mobile} {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
  animation: ${fadeIn} 0.5s ease 0.1s both;

  ${({ theme }) => theme.mq.mobile} {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  animation: ${fadeIn} 0.5s ease 0.2s both;

  ${({ theme }) => theme.mq.tablet} {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const Card = styled.button<{ $color: string; $desktopOnly?: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    border-color: ${({ $color }) => $color};
  }

  ${({ theme }) => theme.mq.tablet} {
    ${({ $desktopOnly }) => $desktopOnly && 'display: none;'}
    flex-direction: row;
    padding: ${({ theme }) => theme.spacing.lg};
    gap: ${({ theme }) => theme.spacing.md};
    text-align: left;
  }
`;

const CardIcon = styled.div<{ $color: string }>`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ $color }) => `${$color}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  ${({ theme }) => theme.mq.mobile} {
    width: 48px;
    height: 48px;
    font-size: 22px;
    margin-bottom: 0;
  }
`;

const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const CardDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;

  ${({ theme }) => theme.mq.mobile} {
    font-size: ${({ theme }) => theme.fontSizes.xs};
    display: none;
  }
`;

const cards = [
  {
    title: '오늘의 단어',
    desc: '오늘 학습할 단어들을 카드 형태로 확인하세요',
    icon: '\uD83D\uDCD6',
    path: '/today',
    color: '#10B981',
    desktopOnly: false,
  },
  {
    title: '플래시카드',
    desc: '카드를 넘기며 단어를 반복 학습하세요',
    icon: '\uD83D\uDCCB',
    path: '/flashcard',
    color: '#F59E0B',
    desktopOnly: false,
  },
  {
    title: '단어 퀴즈',
    desc: '영한/한영 퀴즈로 실력을 점검하세요',
    icon: '\uD83C\uDFAF',
    path: '/quiz',
    color: '#4F46E5',
    desktopOnly: false,
  },
  {
    title: '단어 관리',
    desc: '등록된 단어를 조회, 초기화, 삭제하세요',
    icon: '\u2699\uFE0F',
    path: '/manage',
    color: '#8B5CF6',
    desktopOnly: true,
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>English Vocabulary</Title>
      <Subtitle>매일 꾸준히, 영어 단어 암기장</Subtitle>
      <CardGrid>
        {cards.map(card => (
          <Card key={card.path} $color={card.color} $desktopOnly={card.desktopOnly} onClick={() => navigate(card.path)}>
            <CardIcon $color={card.color}>{card.icon}</CardIcon>
            <CardTitle>{card.title}</CardTitle>
            <CardDesc>{card.desc}</CardDesc>
          </Card>
        ))}
      </CardGrid>
    </Container>
  );
}
