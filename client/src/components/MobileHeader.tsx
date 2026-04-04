import styled from 'styled-components';

const Header = styled.header`
  display: none;

  ${({ theme }) => theme.mq.tablet} {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    background: ${({ theme }) => theme.colors.surface};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    position: sticky;
    top: 0;
    z-index: 100;
  }
`;

const AppName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;
`;

export default function MobileHeader() {
  return (
    <Header>
      <AppName>RnC Voca</AppName>
    </Header>
  );
}
