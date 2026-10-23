import { useState } from 'react';
import styles from './App.module.scss';

type Mode = 'trening' | 'pojedynek';

const examples = [
  { a: 17, sign: '×', b: 6, result: 102 },
  { a: 84, sign: '÷', b: 7, result: 12 },
  { a: 38, sign: '+', b: 47, result: 85 },
  { a: 92, sign: '−', b: 36, result: 56 },
];

export default function App() {
  const [selected, setSelected] = useState<Mode>('trening');
  const [exampleIndex, setExampleIndex] = useState(0);
  const example = examples[exampleIndex];

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <a className={styles.logo} href="#start" aria-label="Strona startowa"><span className={styles.logoIcon}>∑</span><span>MATH<span className={styles.slash}>/</span>DUEL</span></a>
        <nav className={styles.navigation} aria-label="Nawigacja">
          <a href="#start" className={styles.current} aria-current="page">Start</a>
          <a href="#tryby">Tryby</a>
        </nav>
        <span className={styles.edition}>EDYCJA 01 <span>—</span> 2026</span>
      </header>

      <main id="start">
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.index}><span className={styles.miniDot} /> LABORATORIUM ARYTMETYKI / 001</span>
            <h1>Trening<br/><span>szybkiego</span><br/>liczenia<span className={styles.period}>.</span></h1>
            <p className={styles.intro}>Dobre liczenie to kwestia wprawy. Ćwicz samodzielnie albo sprawdź się w pojedynku z drugą osobą.</p>
            <a href="#tryby" className={styles.explore}>ODKRYJ TRYBY <span aria-hidden="true">↘</span></a>
          </div>
          <div className={styles.poster} aria-label="Interaktywny podgląd przykładowego działania">
            <div className={styles.posterHead}><span>FIG. 01 — ZADANIE</span><span>ARYTMETYKA / PODGLĄD</span></div>
            <div className={styles.posterEquation}><span>{example.a}</span><span className={styles.operator}>{example.sign}</span><span>{example.b}</span><span className={styles.equals}>=</span><span className={styles.answer}>?</span></div>
            <div className={styles.posterAnswer}><span>WYNIK</span><strong>{example.result}</strong><span className={styles.answerNote}>PRZYKŁAD</span></div>
            <div className={styles.posterFooter}><span>LICZBY / DZIAŁANIA / REFLEKS</span><button type="button" onClick={() => setExampleIndex((i) => (i + 1) % examples.length)} aria-label="Pokaż kolejne działanie">NASTĘPNE <span aria-hidden="true">↗</span></button></div>
          </div>
          <span className={styles.verticalNote} aria-hidden="true">SZYBKOŚĆ × PRECYZJA</span>
        </section>

        <section id="tryby" className={styles.modes}>
          <div className={styles.sectionTop}><span>02 / WYBIERZ ŚCIEŻKĘ</span><span>DWA SPOSOBY NA ROZWÓJ</span></div>
          <div className={styles.modeLayout}>
            <div className={styles.modeList} role="group" aria-label="Tryby aplikacji">
              <button type="button" className={selected === 'trening' ? styles.modeActive : styles.mode} onClick={() => setSelected('trening')} aria-pressed={selected === 'trening'}><span className={styles.modeNum}>01</span><span className={styles.modeName}>Trening</span><span className={styles.modeArrow}>↗</span></button>
              <button type="button" className={selected === 'pojedynek' ? styles.modeActive : styles.mode} onClick={() => setSelected('pojedynek')} aria-pressed={selected === 'pojedynek'}><span className={styles.modeNum}>02</span><span className={styles.modeName}>Pojedynek 1v1</span><span className={styles.modeArrow}>↗</span></button>
            </div>
            <div className={styles.modeDescription} aria-live="polite">
              <span className={styles.status}>● W PRZYGOTOWANIU</span>
              <h2>{selected === 'trening' ? 'Twój własny rytm.' : 'Dwoje graczy. Jeden pojedynek.'}</h2>
              <p>{selected === 'trening' ? 'Indywidualne ćwiczenia z arytmetyki, szybkie odpowiedzi i śledzenie postępów. Trenuj bez presji rywalizacji.' : 'Prywatny pokój, kod zaproszenia i rozgrywka w czasie rzeczywistym. Stań naprzeciw znajomego i porównaj wyniki.'}</p>
              <span className={styles.modeCounter}>{selected === 'trening' ? 'INDYWIDUALNIE / 01' : 'ONLINE / 02'}</span>
            </div>
          </div>
        </section>
      </main>
      <footer className={styles.footer}><span>MATH / DUEL</span><span>PROJEKT INŻYNIERSKI <span className={styles.footerSeparator}>·</span> SZYBKIE LICZENIE 1V1</span><a href="#start">DO GÓRY ↑</a></footer>
    </div>
  );
}
