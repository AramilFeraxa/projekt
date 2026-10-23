import { useEffect, useRef, useState } from 'react';
import { generateSeries, summarize, type Attempt, type Difficulty, type Operator, type Question } from './training';
import styles from './App.module.scss';

type View = 'start' | 'training' | 'duel';
type Stage = 'setup' | 'active' | 'result';
const ops: Operator[] = ['+', '−', '×', '÷'];
const format = (ms: number) => { const s = Math.floor(ms / 1000); return `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`; };

export default function App() {
  const [view, setView] = useState<View>('start');
  const [stage, setStage] = useState<Stage>('setup');
  const [selected, setSelected] = useState<Operator[]>(['+', '−', '×']);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [limit, setLimit] = useState(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');
  const sessionStart = useRef(0);
  const questionStart = useRef(0);
  const locked = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { if (stage !== 'active' || view !== 'training') return; const id = window.setInterval(() => setElapsed(performance.now() - sessionStart.current), 100); return () => window.clearInterval(id); }, [stage, view]);
  useEffect(() => { if (stage === 'active' && view === 'training') input.current?.focus(); }, [index, stage, view]);
  const summary = summarize(attempts);
  const streakIndex = [...attempts].reverse().findIndex((a) => !a.correct);
  const streak = streakIndex < 0 ? attempts.length : streakIndex;
  const progress = stage === 'result' ? 100 : stage === 'active' ? Math.round(index / limit * 100) : 0;
  const go = (v: View) => { setView(v); if (v !== 'training') setStage('setup'); };
  const start = () => {
    if (!selected.length) return;
    setQuestions(generateSeries(selected, difficulty, limit));
    setIndex(0); setAnswer(''); setAttempts([]); setElapsed(0); setError(''); locked.current = false;
    sessionStart.current = performance.now(); questionStart.current = sessionStart.current; setStage('active');
  };
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (stage !== 'active' || locked.current) return;
    if (!/^-?\d+$/.test(answer.trim())) { setError('Wpisz poprawną liczbę całkowitą.'); return; }
    locked.current = true;
    const now = performance.now();
    const attempt = { correct: Number(answer) === questions[index].answer, durationMs: now - questionStart.current };
    setAttempts((previous) => [...previous, attempt]);
    setElapsed(now - sessionStart.current);
    setAnswer(''); setError('');
    if (index + 1 === questions.length) setStage('result'); else { setIndex(index + 1); questionStart.current = now; }
    locked.current = false;
  };
  return <div className={styles.shell}><div className={styles.glowA}/><div className={styles.glowB}/>
    <div className={styles.frame}>
      <header className={styles.header}><button className={styles.brand} onClick={() => go('start')}><span className={styles.mark}>∑</span> MATH<span className={styles.accent}>/</span>DUEL</button><nav aria-label="Nawigacja główna"><button className={view === 'start' ? styles.active : ''} onClick={() => go('start')}>Start</button><button className={view === 'training' ? styles.active : ''} onClick={() => go('training')}>Trening</button><button className={view === 'duel' ? styles.active : ''} onClick={() => go('duel')}>Pojedynek 1v1</button></nav><span className={styles.online}><i/> WERSJA TESTOWA</span></header>
      <main className={styles.main}>
        {view === 'start' && <section className={styles.home}><div className={styles.hero}><span className={styles.eyebrow}>01 / MATEMATYKA W PRAKTYCE</span><h1>Trening<br/><em>szybkiego</em><br/>liczenia<span className={styles.accent}>.</span></h1><p>Trenuj refleks i precyzję. Jedno działanie po drugim, we własnym tempie.</p><button className={styles.primary} onClick={() => go('training')}>Rozpocznij trening <span>↗</span></button></div><div className={styles.visual} aria-hidden="true"><div className={styles.orbit}><div className={styles.innerOrbit}><span>18 × 7</span><strong>126</strong></div></div><span className={styles.orbitText}>+ − × ÷</span></div></section>}
        {view === 'duel' && <section className={styles.waiting}><span className={styles.eyebrow}>02 / MULTIPLAYER</span><h1>Pojedynek <em>1v1</em></h1><p>Tworzenie pokoi, kody zaproszeń i rozgrywka na dwóch urządzeniach pojawią się w kolejnym etapie.</p><span className={styles.tag}>W PRZYGOTOWANIU</span><button className={styles.secondary} onClick={() => go('start')}>← Powrót</button></section>}
        {view === 'training' && <section className={styles.workspace}>
          <aside className={styles.settings}><div className={styles.panelTitle}><span className={styles.eyebrow}>01 / PARAMETRY</span><h2>Ustawienia</h2></div>
            <label>RODZAJ DZIAŁAŃ</label><div className={styles.operators}>{ops.map(op => <button key={op} disabled={stage === 'active'} aria-pressed={selected.includes(op)} className={selected.includes(op) ? styles.chosen : ''} onClick={() => setSelected(old => old.includes(op) ? old.filter(x => x !== op) : [...old, op])}>{op}</button>)}</div>
            <label htmlFor="difficulty">POZIOM TRUDNOŚCI</label><select id="difficulty" disabled={stage === 'active'} value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)}><option value="easy">Łatwy</option><option value="medium">Średni</option><option value="hard">Trudny</option></select>
            <label htmlFor="limit">LICZBA ZADAŃ</label><select id="limit" disabled={stage === 'active'} value={limit} onChange={e => setLimit(Number(e.target.value))}><option value={10}>10 działań</option><option value={20}>20 działań</option><option value={30}>30 działań</option></select>
            {stage === 'active' ? <button className={styles.secondary} onClick={() => { setStage('setup'); setElapsed(0); }}>Przerwij trening</button> : <button className={styles.primary} disabled={!selected.length} onClick={start}>{stage === 'result' ? 'Nowa sesja' : 'Rozpocznij'} <span>↗</span></button>}
            {!selected.length && <p className={styles.notice}>Wybierz co najmniej jedno działanie.</p>}
          </aside>
          <section className={styles.arena}><div className={styles.arenaTop}><span className={styles.eyebrow}>02 / TRENING</span><span className={styles.tag}>{stage === 'active' ? '● SESJA AKTYWNA' : '● LOKALNY PROTOTYP'}</span></div>
            {stage === 'setup' && <div className={styles.arenaCenter}><span className={styles.bigGlyph}>∑</span><h2>Gotowy na trening?</h2><p>Wybierz parametry po lewej i rozpocznij serię.</p><button className={styles.primary} disabled={!selected.length} onClick={start}>Start <span>→</span></button></div>}
            {stage === 'active' && <div className={styles.arenaCenter}><span className={styles.eyebrow}>ZADANIE {String(index + 1).padStart(2,'0')} / {limit}</span><div className={styles.equation}>{questions[index]?.label} <span className={styles.accent}>= ?</span></div><form className={styles.answerForm} onSubmit={submit}><input ref={input} aria-label="Wynik działania" inputMode="numeric" autoComplete="off" placeholder="Twój wynik" value={answer} onChange={e => setAnswer(e.target.value)} /><button type="submit" disabled={!answer.trim()}>Sprawdź ↗</button></form><small role="status">{error || 'ENTER ↵ ABY ZATWIERDZIĆ'}</small></div>}
            {stage === 'result' && <div className={styles.arenaCenter}><span className={styles.eyebrow}>TRENING UKOŃCZONY</span><h2>Sesja zakończona.</h2><div className={styles.finalScore}>{summary.accuracy}<span>%</span></div><p>{summary.correct} poprawnych odpowiedzi na {attempts.length}</p><button className={styles.primary} onClick={start}>Jeszcze raz ↗</button></div>}
            <div className={styles.progress}><div><span>POSTĘP</span><span>{progress}%</span></div><div className={styles.track}><div style={{width:`${progress}%`}}/></div></div>
          </section>
          <aside className={styles.stats}><div className={styles.panelTitle}><span className={styles.eyebrow}>03 / STATYSTYKI</span><h2>Na żywo</h2></div>{[['CZAS', format(elapsed)],['POPRAWNE', String(summary.correct)],['BŁĘDNE', String(summary.incorrect)],['SERIA', String(streak)],['SKUTECZNOŚĆ', `${summary.accuracy}%`],...(stage === 'result' ? [['ŚREDNI CZAS', `${summary.averageSeconds.toFixed(1)} s`]] : [])].map(([name,value]) => <div className={styles.stat} key={name}><span>{name}</span><strong>{value}</strong></div>)}</aside>
        </section>}
      </main><footer className={styles.footer}><span>SZYBKIE LICZENIE 1V1</span><span>PROJEKT INŻYNIERSKI · PROTOTYP</span></footer>
    </div>
  </div>;
}
