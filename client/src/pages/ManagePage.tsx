import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import DateFilter from '../components/DateFilter';
import type { Word } from '../types';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth > 768);
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isDesktop;
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing['2xl']}`};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing.sm} 0`};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ToolbarRight = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Btn = styled.button<{ $danger?: boolean; $active?: boolean }>`
  padding: 4px 12px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 500;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme, $danger, $active }) =>
    $danger ? theme.colors.danger : $active ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $danger, $active }) =>
    $danger ? theme.colors.danger : $active ? theme.colors.primary : 'transparent'};
  color: ${({ theme, $danger, $active }) =>
    $danger || $active ? '#fff' : theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) { opacity: 0.8; }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 14px;
  height: 14px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

const TableWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.surfaceHover};
`;

const Th = styled.th<{ $sortable?: boolean; $active?: boolean }>`
  padding: ${({ theme }) => `6px ${theme.spacing.md}`};
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;
  user-select: none;
  cursor: ${({ $sortable }) => $sortable ? 'pointer' : 'default'};
  transition: color ${({ theme }) => theme.transitions.fast};

  ${({ $sortable, theme }) => $sortable && `
    &:hover { color: ${theme.colors.text}; }
  `}

  &:first-child { width: 32px; text-align: center; }
  &:last-child { width: 64px; text-align: center; }
`;

const Tr = styled.tr<{ $selected?: boolean }>`
  background: ${({ $selected }) => $selected ? '#F0F4FF' : 'transparent'};

  &:hover { background: ${({ $selected }) => $selected ? '#E8EEFF' : '#FAFAFA'}; }
  &:not(:last-child) td { border-bottom: 1px solid #F1F5F9; }
`;

const Td = styled.td`
  padding: ${({ theme }) => `5px ${theme.spacing.md}`};
  color: ${({ theme }) => theme.colors.text};
  vertical-align: middle;
  white-space: nowrap;

  &:first-child { text-align: center; }
  &:last-child { text-align: center; }
`;

const Mono = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: 600;
`;

const Muted = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Num = styled.span<{ $color?: string }>`
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.mono};
  color: ${({ $color, theme }) => $color || theme.colors.text};
`;

const ResetLink = styled.button`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover { color: ${({ theme }) => theme.colors.danger}; }
  &:disabled { opacity: 0.4; cursor: not-allowed; text-decoration: none; }
`;

const TabRow = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ $active }) => $active ? 600 : 400};
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.textSecondary};
  border-bottom: 2px solid ${({ theme, $active }) => $active ? theme.colors.primary : 'transparent'};
  transition: all ${({ theme }) => theme.transitions.fast};
  margin-bottom: -1px;

  &:hover { color: ${({ theme }) => theme.colors.text}; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const DeviceTag = styled.span<{ $device: string }>`
  display: inline-block;
  padding: 1px 8px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 11px;
  font-weight: 600;
  background: ${({ $device }) =>
    $device === 'iPhone' ? '#E0F2FE' : $device === 'Android' ? '#DCFCE7' : '#F1F5F9'};
  color: ${({ $device }) =>
    $device === 'iPhone' ? '#0284C7' : $device === 'Android' ? '#16A34A' : '#64748B'};
`;

const StatCards = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatCard = styled.div`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.radius.md};
  text-align: center;
`;

const StatNum = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export default function ManagePage() {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  if (!isDesktop) return <Navigate to="/" replace />;
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [resettingId, setResettingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [sortKey, setSortKey] = useState<'none' | 'wrong' | 'correct' | 'weight' | 'attempts'>('none');

  const fetchWords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = selectedDate ? `/api/words?date=${selectedDate}` : '/api/words';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setWords(json.data || []);
      setSelectedIds(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => { fetchWords(); }, [fetchWords]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev =>
      prev.size === words.length ? new Set() : new Set(words.map(w => w.id))
    );
  };

  const handleReset = async (id: number) => {
    setResettingId(id);
    try {
      const res = await fetch(`/api/words/${id}/reset`, { method: 'PUT' });
      if (!res.ok) throw new Error('Reset failed');
      setWords(prev => prev.map(w => w.id === id ? { ...w, wrongCount: 0, correctCount: 0 } : w));
    } catch { alert('초기화 실패'); }
    finally { setResettingId(null); }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`${selectedIds.size}개 단어를 삭제하시겠습니까?`)) return;
    setDeleting(true);
    try {
      const results = await Promise.all(
        Array.from(selectedIds).map(id => fetch(`/api/words/${id}`, { method: 'DELETE' }))
      );
      const failed = results.filter(r => !r.ok).length;
      if (failed > 0) alert(`${failed}개 삭제 실패`);
      setWords(prev => prev.filter(w => !selectedIds.has(w.id)));
      setSelectedIds(new Set());
    } catch { alert('삭제 실패'); }
    finally { setDeleting(false); }
  };

  const [resettingAll, setResettingAll] = useState(false);
  const [activeTab, setActiveTab] = useState<'words' | 'logs'>('words');
  const [logs, setLogs] = useState<Array<{ id: number; device: string; page: string; accessedAt: string }>>([]);
  const [logStats, setLogStats] = useState<{ total: number; byDevice: Record<string, number>; today: number } | null>(null);
  const [logsLoading, setLogsLoading] = useState(false);

  const handleResetAll = async () => {
    if (!window.confirm('전체 단어의 가중치를 초기화하시겠습니까?')) return;
    setResettingAll(true);
    try {
      const res = await fetch('/api/words/reset-all', { method: 'PUT' });
      if (!res.ok) throw new Error('Failed');
      setWords(prev => prev.map(w => ({ ...w, wrongCount: 0, correctCount: 0 })));
    } catch { alert('전체 초기화 실패'); }
    finally { setResettingAll(false); }
  };

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const [logsRes, statsRes] = await Promise.all([
        fetch('/api/access-log'),
        fetch('/api/access-log/stats'),
      ]);
      const logsJson = await logsRes.json();
      const statsJson = await statsRes.json();
      setLogs(logsJson.data || []);
      setLogStats(statsJson.data || null);
    } catch { /* ignore */ }
    finally { setLogsLoading(false); }
  }, []);

  useEffect(() => {
    if (activeTab === 'logs') fetchLogs();
  }, [activeTab, fetchLogs]);

  const getWeight = (w: Word) => 1 + w.wrongCount * 2;
  const getAttempts = (w: Word) => w.wrongCount + w.correctCount;

  const toggleSort = (key: typeof sortKey) => {
    setSortKey(prev => prev === key ? 'none' : key);
  };

  const sorted = sortKey === 'none' ? words : [...words].sort((a, b) => {
    switch (sortKey) {
      case 'wrong': return b.wrongCount - a.wrongCount;
      case 'correct': return b.correctCount - a.correctCount;
      case 'weight': return getWeight(b) - getWeight(a);
      case 'attempts': return getAttempts(b) - getAttempts(a);
      default: return 0;
    }
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') navigate('/'); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  return (
    <Container>
      <Header>
        <Title>관리</Title>
      </Header>

      <TabRow>
        <Tab $active={activeTab === 'words'} onClick={() => setActiveTab('words')}>단어 관리</Tab>
        <Tab $active={activeTab === 'logs'} onClick={() => setActiveTab('logs')}>접속 로그</Tab>
      </TabRow>

      {activeTab === 'logs' ? (
        logsLoading ? (
          <EmptyState>로딩 중...</EmptyState>
        ) : (
          <>
            {logStats && (
              <StatCards>
                <StatCard>
                  <StatNum>{logStats.total}</StatNum>
                  <StatLabel>전체</StatLabel>
                </StatCard>
                <StatCard>
                  <StatNum>{logStats.today}</StatNum>
                  <StatLabel>오늘</StatLabel>
                </StatCard>
                <StatCard>
                  <StatNum>{logStats.byDevice?.iPhone || 0}</StatNum>
                  <StatLabel>iPhone</StatLabel>
                </StatCard>
                <StatCard>
                  <StatNum>{logStats.byDevice?.Android || 0}</StatNum>
                  <StatLabel>Android</StatLabel>
                </StatCard>
                <StatCard>
                  <StatNum>{logStats.byDevice?.PC || 0}</StatNum>
                  <StatLabel>PC</StatLabel>
                </StatCard>
              </StatCards>
            )}
            <TableWrapper>
              <Table>
                <Thead>
                  <tr>
                    <Th>시각</Th>
                    <Th>기기</Th>
                    <Th>페이지</Th>
                  </tr>
                </Thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr><Td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>접속 기록이 없습니다.</Td></tr>
                  ) : logs.map(log => (
                    <Tr key={log.id}>
                      <Td><Muted>{log.accessedAt}</Muted></Td>
                      <Td><DeviceTag $device={log.device}>{log.device}</DeviceTag></Td>
                      <Td><Mono>{log.page}</Mono></Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          </>
        )
      ) : (
      <>
      <HeaderRight>
        <DateFilter onDateChange={d => setSelectedDate(d)} />
      </HeaderRight>

      <Toolbar>
        <ToolbarLeft>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <Checkbox
              checked={words.length > 0 && selectedIds.size === words.length}
              onChange={toggleSelectAll}
            />
            전체
          </label>
          <span>{words.length}개{selectedIds.size > 0 && ` · ${selectedIds.size}개 선택`}</span>
        </ToolbarLeft>
        <ToolbarRight>
          <Btn disabled={resettingAll || words.length === 0} onClick={handleResetAll}>
            {resettingAll ? '초기화 중...' : '전체 초기화'}
          </Btn>
          <Btn $danger disabled={selectedIds.size === 0 || deleting} onClick={handleDeleteSelected}>
            {deleting ? '삭제 중...' : `삭제 (${selectedIds.size})`}
          </Btn>
        </ToolbarRight>
      </Toolbar>

      {loading ? (
        <EmptyState>로딩 중...</EmptyState>
      ) : error ? (
        <EmptyState>{error} <Btn onClick={fetchWords}>재시도</Btn></EmptyState>
      ) : words.length === 0 ? (
        <EmptyState>등록된 단어가 없습니다.</EmptyState>
      ) : (
        <TableWrapper>
          <Table>
            <Thead>
              <tr>
                <Th />
                <Th>영어</Th>
                <Th>한글</Th>
                <Th>발음</Th>
                <Th $sortable $active={sortKey === 'wrong'} onClick={() => toggleSort('wrong')}>틀림{sortKey === 'wrong' ? ' ↓' : ''}</Th>
                <Th $sortable $active={sortKey === 'correct'} onClick={() => toggleSort('correct')}>맞음{sortKey === 'correct' ? ' ↓' : ''}</Th>
                <Th $sortable $active={sortKey === 'weight'} onClick={() => toggleSort('weight')}>가중치{sortKey === 'weight' ? ' ↓' : ''}</Th>
                <Th $sortable $active={sortKey === 'attempts'} onClick={() => toggleSort('attempts')}>출제{sortKey === 'attempts' ? ' ↓' : ''}</Th>
                <Th>날짜</Th>
                <Th />
              </tr>
            </Thead>
            <tbody>
              {sorted.map(w => (
                <Tr key={w.id} $selected={selectedIds.has(w.id)}>
                  <Td><Checkbox checked={selectedIds.has(w.id)} onChange={() => toggleSelect(w.id)} /></Td>
                  <Td><Mono>{w.english}</Mono></Td>
                  <Td>{w.korean}</Td>
                  <Td><Muted>{w.pronunciation || '-'}</Muted></Td>
                  <Td><Num $color={w.wrongCount > 0 ? '#EF4444' : undefined}>{w.wrongCount}</Num></Td>
                  <Td><Num $color={w.correctCount > 0 ? '#10B981' : undefined}>{w.correctCount}</Num></Td>
                  <Td><Num $color={getWeight(w) > 1 ? '#F59E0B' : undefined}>{getWeight(w)}</Num></Td>
                  <Td><Num>{getAttempts(w)}</Num></Td>
                  <Td><Muted>{w.studyDate}</Muted></Td>
                  <Td>
                    <ResetLink onClick={() => handleReset(w.id)} disabled={resettingId === w.id}>
                      {resettingId === w.id ? '...' : '초기화'}
                    </ResetLink>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}
      </>
      )}
    </Container>
  );
}
