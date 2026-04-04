import { forwardRef } from 'react';
import styled from 'styled-components';

interface AnswerInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const Wrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const Input = styled.input`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  transition: background ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AnswerInput = forwardRef<HTMLInputElement, AnswerInputProps>(
  function AnswerInput({ value, onChange, onSubmit, disabled, placeholder }, ref) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !disabled) {
        onSubmit();
      }
    };

    return (
      <Wrapper>
        <Input
          ref={ref}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder || '답을 입력하세요'}
          autoFocus
        />
        <SubmitButton onClick={onSubmit} disabled={disabled || !value.trim()}>
          제출
        </SubmitButton>
      </Wrapper>
    );
  }
);

export default AnswerInput;
