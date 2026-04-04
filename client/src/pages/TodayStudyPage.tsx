import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useStudy } from '../hooks/useStudy';
import StudyCard from '../components/StudyCard';
import DateFilter from '../components/DateFilter';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};

  ${({ theme }) => theme.mq.tablet} {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const PageTitle = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};

  ${({ theme }) => theme.mq.tablet} {
    display: none;
  }
`;

const Spacer = styled.div`
  height: ${({ theme }) => theme.spacing.md};
`;

const PreviewSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.sm}`};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  animation: ${fadeIn} 0.4s ease;
`;

const PreviewTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const PreviewList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const PreviewItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `3px ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bg};
  }
`;

const PreviewIndex = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primaryLight}22;
  width: 22px;
  height: 22px;
  border-radius: ${({ theme }) => theme.radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const PreviewWord = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  min-width: 100px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const PreviewMeaning = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
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

export default function TodayStudyPage() {
  const { data, loading, error, fetchData } = useStudy();

  useEffect(() => {
    fetchData();
  }, []);

  const handleDateChange = (date?: string) => {
    fetchData(date);
  };

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
        <PageTitle>오늘의 단어</PageTitle>
        <CenterMessage>
          <p>{error}</p>
          <RetryButton onClick={() => fetchData()}>다시 시도</RetryButton>
        </CenterMessage>
      </Container>
    );
  }

  if (!data || data.preview.length === 0) {
    return (
      <Container>
        <PageTitle>오늘의 단어</PageTitle>
        <CenterMessage>오늘의 단어가 없습니다. 먼저 단어를 생성하세요.</CenterMessage>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>오늘의 단어</PageTitle>

      <DateFilter onDateChange={handleDateChange} />

      <Spacer />

      <PreviewSection>
        <PreviewTitle>단어 미리보기</PreviewTitle>
        <PreviewList>
          {data.preview.map((w, i) => (
            <PreviewItem key={w.number}>
              <PreviewIndex>{i + 1}</PreviewIndex>
              <PreviewWord>{w.english}</PreviewWord>
              <PreviewMeaning>{w.korean}</PreviewMeaning>
            </PreviewItem>
          ))}
        </PreviewList>
      </PreviewSection>

      <CardList>
        {data.details.map((d) => (
          <StudyCard key={d.number} detail={d} />
        ))}
      </CardList>
    </Container>
  );
}
