import { useState, useEffect, useRef } from 'react';
import socket from './socket';
import StartScreen from './StartScreen';
import LobbyScreen from './LobbyScreen';
import GameScreen from './GameScreen';
import VoteScreen from './VoteScreen';
import ResultScreen from './ResultScreen';

export default function App() {
  const [screen, setScreen] = useState('start');
  const [myId, setMyId] = useState(null);
  const [lobbyState, setLobbyState] = useState(null);
  const [card, setCard] = useState(null);
  const [locations, setLocations] = useState([]);
  const [roundNr, setRoundNr] = useState(0);
  const [cfg, setCfg] = useState(null);
  const [crossed, setCrossed] = useState([]);
  const [timer, setTimer] = useState(null);
  const [vote, setVote] = useState(null);
  const [voteResult, setVoteResult] = useState(null);
  const [result, setResult] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [connected, setConnected] = useState(socket.connected);

  const codeRef = useRef(null);
  const nameRef = useRef(null);
  const voteResultTimeout = useRef(null);

  function msg(t) {
    setMsgs(p => [...p.slice(-3), t]);
    setTimeout(() => setMsgs(p => p.slice(1)), 5000);
  }

  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true);
      socket.emit('SYNC', { code: codeRef.current, name: nameRef.current });
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('STATE', s => setLobbyState(s));
    socket.on('YOUR_CARD', ({ card: c, locations: l, roundNr: r, cfg: f }) => {
      setCard(c); setLocations(l); setRoundNr(r); setCfg(f);
      setCrossed([]); setVote(null); setVoteResult(null);
      setTimer(null); setResult(null);
      setScreen('game');
    });
    socket.on('TIMER', ({ left, total }) => setTimer({ left, total }));
    socket.on('ROUND_END', d => {
      setResult(d); setVote(null); setTimer(null);
      setScreen('result');
    });
    socket.on('CROSSED', ({ crossed: c }) => setCrossed(c));
    socket.on('VOTE_START', d => { setVote(d); setScreen('vote'); });
    socket.on('VOTE_PROGRESS', ({ voted, total, votes }) =>
      setVote(p => p ? { ...p, voted, total, votes } : p));
    socket.on('VOTE_RESULT', d => {
      setVote(null); setVoteResult(d); setScreen('game');
      if (voteResultTimeout.current) clearTimeout(voteResultTimeout.current);
      voteResultTimeout.current = setTimeout(() => setVoteResult(null), 6000);
    });
    socket.on('VOTE_CANCELLED', () => { setVote(null); setScreen('game'); msg('Abstimmung abgebrochen.'); });
    socket.on('MSG', t => msg(t));

    return () => {
      ['connect','disconnect','STATE','YOUR_CARD','TIMER','ROUND_END','CROSSED',
       'VOTE_START','VOTE_PROGRESS','VOTE_RESULT','VOTE_CANCELLED','MSG']
        .forEach(e => socket.off(e));
      if (voteResultTimeout.current) clearTimeout(voteResultTimeout.current);
    };
  }, []);

  function create(name) {
    return new Promise((ok, err) =>
      socket.emit('CREATE', { name }, r => {
        if (r.ok) { setMyId(r.myId); codeRef.current = r.code; nameRef.current = name; setScreen('lobby'); ok(); }
        else err(new Error(r.err));
      })
    );
  }

  function join(name, code) {
    return new Promise((ok, err) =>
      socket.emit('JOIN', { code, name }, r => {
        if (r.ok) { setMyId(r.myId); codeRef.current = r.code; nameRef.current = name; setScreen('lobby'); ok(); }
        else err(new Error(r.err));
      })
    );
  }

  function startRound() {
    socket.emit('START', {}, r => { if (r && !r.ok) alert(r.err); });
  }

  function updateCfg(c) { socket.emit('CONFIG', c); }
  function mark(locId) { socket.emit('MARK', { locId }); }
  function startVote(accused, thesis) { socket.emit('VOTE_START', { accused, thesis }); }
  function castVote(yes) { socket.emit('VOTE_CAST', { yes }); }
  function cancelVote() { socket.emit('VOTE_CANCEL'); }
  function guess(name) { socket.emit('GUESS', { name }); }
  function nextRound() { setCard(null); setResult(null); setCrossed([]); setVote(null); setVoteResult(null); setTimer(null); setScreen('lobby'); }

  return (
    <>
      {!connected && (
        <div style={{position:'fixed',top:0,left:0,right:0,zIndex:9999,background:'#c0392b',color:'#fff',padding:'10px',textAlign:'center',fontSize:13,fontWeight:600}}>
          ⚠️ Verbindung unterbrochen – wird wiederhergestellt...
        </div>
      )}
      {screen==='start' && <StartScreen onCreate={create} onJoin={join} />}
      {screen==='lobby' && lobbyState && <LobbyScreen state={lobbyState} myId={myId} connected={connected} onStart={startRound} onCfg={updateCfg} />}
      {screen==='game' && <GameScreen card={card} locations={locations} roundNr={roundNr} state={lobbyState} myId={myId} crossed={crossed} timer={timer} cfg={cfg} voteResult={voteResult} onMark={mark} onVote={startVote} onGuess={guess} />}
      {screen==='vote' && vote && <VoteScreen vote={vote} myId={myId} players={lobbyState?.players||[]} onYes={()=>castVote(true)} onNo={()=>castVote(false)} onCancel={cancelVote} />}
      {screen==='result' && result && <ResultScreen result={result} myId={myId} state={lobbyState} onNext={nextRound} />}
      {msgs.length > 0 && (
        <div style={{position:'fixed',bottom:20,left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',gap:8,zIndex:2000,alignItems:'center'}}>
          {msgs.map((m,i) => <div key={i} style={{background:'var(--surf2)',border:'1px solid var(--bord)',borderRadius:'var(--rs)',padding:'8px 16px',fontSize:13,color:'var(--tx2)',whiteSpace:'nowrap'}}>{m}</div>)}
        </div>
      )}
    </>
  );
}
