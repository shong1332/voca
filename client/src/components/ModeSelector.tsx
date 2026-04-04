import styled from 'styled-components';

interface ModeSelectorProps {
  children: React.ReactNode;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

export default function ModeSelector({ children }: ModeSelectorProps) {
  return <Wrapper>{children}</Wrapper>;
}
