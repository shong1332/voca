import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { API_BASE } from '../hooks/config';
import styled from 'styled-components';

interface DateFilterProps {
  onDateChange: (date?: string) => void;
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

export default function DateFilter({ onDateChange }: DateFilterProps) {
  const location = useLocation();
  const isToday = location.pathname === '/today';
  const [dates, setDates] = useState<string[]>([]);
  const [selected, setSelected] = useState('');
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    fetch(`${API_BASE}/words/dates`)
      .then(res => res.json())
      .then(json => {
        const list: string[] = json.data || [];
        setDates(list);

        if (isToday && list.length > 0) {
          setSelected(list[0]);
          onDateChange(list[0]);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (val: string) => {
    setSelected(val);
    onDateChange(val || undefined);
  };

  return (
    <Wrapper>
      <Label>학습 구간</Label>
      <Select value={selected} onChange={e => handleChange(e.target.value)}>
        {!isToday && <option value="">전체</option>}
        {dates.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </Select>
    </Wrapper>
  );
}
