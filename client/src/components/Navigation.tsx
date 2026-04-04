import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing['2xl']}`};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  z-index: 100;

  ${({ theme }) => theme.mq.tablet} {
    top: auto;
    bottom: 0;
    height: 56px;
    border-bottom: none;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    justify-content: space-around;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  }
`;

const NavItem = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
  background: ${({ theme, $active }) => ($active ? `${theme.colors.primary}12` : 'transparent')};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme, $active }) => ($active ? `${theme.colors.primary}12` : theme.colors.surfaceHover)};
    color: ${({ theme }) => theme.colors.text};
  }

  ${({ theme }) => theme.mq.tablet} {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.fontSizes.xs};
    background: transparent;
    min-height: 44px;
    justify-content: center;
    position: relative;

    ${({ $active, theme }) => $active && `
      color: ${theme.colors.primary};
      font-weight: 700;

      &::before {
        content: '';
        position: absolute;
        top: -1px;
        left: 20%;
        right: 20%;
        height: 3px;
        background: ${theme.colors.primary};
        border-radius: 0 0 3px 3px;
      }
    `}
  }
`;

const NavIcon = styled.span<{ $active?: boolean }>`
  display: none;
  font-size: 20px;

  ${({ theme }) => theme.mq.tablet} {
    display: block;
    font-size: ${({ $active }) => $active ? '24px' : '20px'};
    transition: font-size ${({ theme }) => theme.transitions.fast};
  }
`;

const NavLabel = styled.span`
  ${({ theme }) => theme.mq.mobile} {
    font-size: 10px;
  }
`;

const NavItemDesktopOnly = styled(NavItem)`
  ${({ theme }) => theme.mq.tablet} {
    display: none;
  }
`;

const navItems = [
  { path: '/', label: '홈', icon: '🏠', desktopOnly: false },
  { path: '/today', label: '오늘의 단어', shortLabel: '단어', icon: '📖', desktopOnly: false },
  { path: '/flashcard', label: '플래시카드', shortLabel: '학습', icon: '📋', desktopOnly: false },
  { path: '/quiz', label: '퀴즈', icon: '🎯', desktopOnly: false },
  { path: '/manage', label: '단어 관리', shortLabel: '관리', icon: '⚙️', desktopOnly: true },
];

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Nav>
      {navItems.map(({ path, label, shortLabel, icon, desktopOnly }) => {
        const Component = desktopOnly ? NavItemDesktopOnly : NavItem;
        return (
          <Component
            key={path}
            $active={location.pathname === path}
            onClick={() => navigate(path)}
          >
            <NavIcon $active={location.pathname === path}>{icon}</NavIcon>
            <NavLabel>{shortLabel || label}</NavLabel>
          </Component>
        );
      })}
    </Nav>
  );
}
