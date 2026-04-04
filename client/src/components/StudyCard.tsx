import styled from 'styled-components';
interface WordDetailType {
  number: number;
  english: string;
  korean: string;
  pronunciation: string;
  examples: Array<{ english: string; korean: string }>;
  grammar: string[];
  vocabulary: Array<{ word: string; meaning: string }>;
}

interface StudyCardProps {
  detail: WordDetailType;
}

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing['2xl']};
  transition: box-shadow ${({ theme }) => theme.transitions.normal};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  ${({ theme }) => theme.mq.mobile} {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderLight};
`;

const WordNumber = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  background: ${({ theme }) => theme.colors.primaryLight}22;
  padding: 2px 10px;
  border-radius: ${({ theme }) => theme.radius.full};
`;

const WordText = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Meaning = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Pronunciation = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-style: italic;
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SectionLabel = styled.span`
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ExampleBlock = styled.div`
  background: ${({ theme }) => theme.colors.bg};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ExampleEnglish = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.7;
  font-style: italic;
`;

const ExampleKorean = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`;

const SectionText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.7;
  background: ${({ theme }) => theme.colors.bg};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
`;

export default function StudyCard({ detail }: StudyCardProps) {
  return (
    <Card>
      <Header>
        <WordNumber>#{detail.number}</WordNumber>
        <WordText>{detail.english}</WordText>
        <Meaning>{detail.korean}</Meaning>
      </Header>
      {detail.pronunciation && (
        <Pronunciation>{detail.pronunciation}</Pronunciation>
      )}
      {detail.examples.length > 0 && (
        <Section>
          <SectionLabel>예문</SectionLabel>
          {detail.examples.map((ex, i) => (
            <ExampleBlock key={i}>
              <ExampleEnglish>{ex.english}</ExampleEnglish>
              <ExampleKorean>→ {ex.korean}</ExampleKorean>
            </ExampleBlock>
          ))}
        </Section>
      )}
      {detail.grammar.length > 0 && (
        <Section>
          <SectionLabel>문법</SectionLabel>
          {detail.grammar.map((g, i) => (
            <SectionText key={i}>{g}</SectionText>
          ))}
        </Section>
      )}
      {detail.vocabulary.length > 0 && (
        <Section>
          <SectionLabel>관련 단어</SectionLabel>
          {detail.vocabulary.map((v, i) => (
            <SectionText key={i}>{v.word}: {v.meaning}</SectionText>
          ))}
        </Section>
      )}
    </Card>
  );
}
