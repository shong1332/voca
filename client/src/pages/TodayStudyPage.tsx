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

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const SkeletonBox = styled.div<{ $w?: string; $h?: string }>`
  width: ${({ $w }) => $w || '100%'};
  height: ${({ $h }) => $h || '16px'};
  border-radius: ${({ theme }) => theme.radius.md};
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.borderLight} 25%, ${({ theme }) => theme.colors.surfaceHover} 50%, ${({ theme }) => theme.colors.borderLight} 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.5s infinite linear;
`;

const SkeletonPreview = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.sm}`};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SkeletonRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `3px ${theme.spacing.sm}`};
`;

const SkeletonCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

function TodaySkeleton() {
  return (
    <>
      <SkeletonPreview>
        <SkeletonBox $w="120px" $h="20px" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonRow key={i}>
              <SkeletonBox $w="22px" $h="22px" />
              <SkeletonBox $w="90px" $h="14px" />
              <SkeletonBox $w="60px" $h="14px" />
            </SkeletonRow>
          ))}
        </div>
      </SkeletonPreview>
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonCard key={i}>
          <SkeletonBox $w="200px" $h="20px" />
          <SkeletonBox $w="100%" $h="14px" />
          <SkeletonBox $w="80%" $h="14px" />
        </SkeletonCard>
      ))}
    </>
  );
}

export default function TodayStudyPage() {
  const { data, loading, error, fetchData } = useStudy();

  const handleDateChange = (date?: string) => {
    if (date) fetchData(date);
  };

  return (
    <Container>
      <PageTitle>오늘의 단어</PageTitle>

      <DateFilter onDateChange={handleDateChange} />

      <Spacer />

      {loading ? (
        <TodaySkeleton />
      ) : error ? (
        <CenterMessage>
          <p>{error}</p>
          <RetryButton onClick={() => fetchData()}>다시 시도</RetryButton>
        </CenterMessage>
      ) : !data || data.preview.length === 0 ? (
        <CenterMessage>단어가 없습니다.</CenterMessage>
      ) : (
        <>
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
        </>
      )}
    </Container>
  );
}
