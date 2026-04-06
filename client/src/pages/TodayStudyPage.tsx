import { useState } from 'react';
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

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const PreviewTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const HideBtnGroup = styled.div`
  display: flex;
  gap: 4px;
`;

const HideBtn = styled.button<{ $active: boolean }>`
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $active }) => $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
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
  const [hideMode, setHideMode] = useState<'none' | 'korean' | 'english'>('none');

  const handleDateChange = (date?: string) => {
    if (date) fetchData(date);
  };

  return (
    <Container>
      <PageTitle>오늘의 단어</PageTitle>

      <DateFilter onDateChange={handleDateChange} />

      <Spacer />

      {loading ? (
        <CenterMessage><LoadingSpinner /></CenterMessage>
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
            <PreviewHeader>
              <PreviewTitle>단어 미리보기</PreviewTitle>
              <HideBtnGroup>
                <HideBtn $active={hideMode === 'korean'} onClick={() => setHideMode(prev => prev === 'korean' ? 'none' : 'korean')}>한글 가리기</HideBtn>
                <HideBtn $active={hideMode === 'english'} onClick={() => setHideMode(prev => prev === 'english' ? 'none' : 'english')}>영어 가리기</HideBtn>
              </HideBtnGroup>
            </PreviewHeader>
            <PreviewList>
              {data.preview.map((w, i) => (
                <PreviewItem key={w.number}>
                  <PreviewIndex>{i + 1}</PreviewIndex>
                  <PreviewWord style={hideMode === 'english' ? { color: 'transparent', background: '#E2E8F0', borderRadius: '4px' } : undefined}>{w.english}</PreviewWord>
                  <PreviewMeaning style={hideMode === 'korean' ? { color: 'transparent', background: '#E2E8F0', borderRadius: '4px' } : undefined}>{w.korean}</PreviewMeaning>
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
