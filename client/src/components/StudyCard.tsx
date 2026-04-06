import { useEffect } from 'react';
import styled from 'styled-components';

function speakEnglish(text: string) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.9;
  const voices = speechSynthesis.getVoices();
  const voice = voices.find(v =>
    v.name.includes('Samantha') || v.name.includes('Google US English')
  ) || voices.find(v => v.lang.startsWith('en-US'));
  if (voice) u.voice = voice;
  speechSynthesis.speak(u);
}

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
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const HeaderRow1 = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: 2px;
`;

const WordNumber = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  flex-shrink: 0;
`;

const WordText = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Meaning = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding-left: ${({ theme }) => theme.spacing.xl};
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

const ExampleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ExampleEnglish = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.7;
  font-style: italic;
  flex: 1;
`;

const SpeakBtn = styled.button`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
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
  useEffect(() => {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }, []);

  return (
    <Card>
      <Header>
        <HeaderRow1>
          <WordNumber>#{detail.number}</WordNumber>
          <WordText>{detail.english}</WordText>
        </HeaderRow1>
        <Meaning>{detail.korean}{detail.pronunciation && ` / ${detail.pronunciation}`}</Meaning>
      </Header>
      {detail.examples.length > 0 && (
        <Section>
          <SectionLabel>예문</SectionLabel>
          {detail.examples.map((ex, i) => (
            <ExampleBlock key={i}>
              <ExampleRow>
                <ExampleEnglish>{ex.english}</ExampleEnglish>
                <SpeakBtn onClick={() => speakEnglish(ex.english)}>🔊</SpeakBtn>
              </ExampleRow>
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
