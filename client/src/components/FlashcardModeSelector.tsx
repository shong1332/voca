import styled from 'styled-components';
import type { FlashcardMode } from '../types';

interface FlashcardModeSelectorProps {
  mode: FlashcardMode;
  onModeChange: (mode: FlashcardMode) => void;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Label = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  letter-spacing: 0.02em;
`;

const Select = styled.select`
  padding: ${({ theme }) => `6px ${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 28px;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }

  ${({ theme }) => theme.mq.tablet} {
    width: 100%;
  }
`;

export default function FlashcardModeSelector({ mode, onModeChange }: FlashcardModeSelectorProps) {
  return (
    <Wrapper>
      <Label>학습 모드</Label>
      <Select value={mode} onChange={e => onModeChange(e.target.value as FlashcardMode)}>
        <option value="hide_korean">한글 가리기</option>
        <option value="hide_english">영어 가리기</option>
        <option value="random">랜덤</option>
      </Select>
    </Wrapper>
  );
}
