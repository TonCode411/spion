import { useState, useEffect } from 'react';

export default function GameScreen({ card, locations, roundNr, state, myId, crossed, timer, cfg, voteResult, onMark, onVote, onGuess }) {
  const [revealed, setRevealed] = useState(false);
  const [accusing, setAccusing] = useState(false);
  const [target, setTarget] = useState('');
  const [thesis, setThesis] = useState('');
  const [guessing, setGuessing] = useState(false);
  const [guessInput, setGuessInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const isSpy = card?.typ === 'agent';
  const players = state?.players || [];
  const nonComm = cfg?.nonComm || false;
  const pointsOn = cfg?.pointsOn || false;

  useEffect(() => {
    if (!guessInput.trim()) { setSuggestions([]); return; }
    const q = guessInput.toLowerCase();
    setSuggestions((locations||[]).filter(l=>l.name.toLowerCase().includes(q)).slice(0,6));
  }, [guessInput, locations]);

  function doAccuse() {
    if (!target) return;
    const tName = players.find(p=>p.id===target)?.name || '?';
    onVote(target, nonComm&&thesis.trim() ? thesis.trim() : tName+' ist der Spion!');
    setAccusing(false); setTarget(''); setThesis('');
  }

  function doGuess(name) {
    onGuess(name); setGuessing(false); setGuessInput(''); setSuggestions([]);
  }

  const tw = timer&&timer.left<=30, tk = timer&&timer.left<=10;
  const fmt = s => Math.floor(s/60)+':'+String(s%60).padStart(2,'0');

  if (!card) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><p style={{color:'var(--tx3)'}}>Lade...</p></div>;

  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',maxWidth:1000,margin:'0 auto',padding:'12px 16px',gap:12}}>
      {/* Topbar */}
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'9px 14px',background:'var(--surf)',border:'1px solid var(--bord)',borderRadius:'var(--r)',flexWrap:'wrap'}}>
        <span style={{fontWeight:700,color:'var(--acc)',fontSize:13}}>Runde {roundNr}</span>
        {timer?.total && (
          <span style={{fontFamily:'monospace',fontSize:17,fontWeight:700,padding:'2px 10px',borderRadius:'var(--rs)',border:'1px solid '+(tk?'rgba(224,85,85,.4)':tw?'rgba(224,160,48,.4)':'var(--bord)'),background:tk?'var(--rdim)':tw?'rgba(224,160,48,.08)':'var(--bg2)',color:tk?'var(--red)':tw?'#e0a030':'var(--tx)',animation:tk?'pulse .8s infinite':'none'}}>
            ⏱ {fmt(timer.left)}
          </span>
        )}
        {pointsOn && (
          <div style={{display:'flex',gap:6,marginLeft:'auto',flexWrap:'wrap'}}>
            {[...players].sort((a,b)=>(b.pts||0)-(a.pts||0)).map(p=>(
              <span key={p.id} style={{fontSize:11,padding:'2px 8px',borderRadius:20,border:'1px solid '+(p.id===myId?'rgba(201,168,76,.3)':'var(--bord)'),background:p.id===myId?'var(--adim)':'var(--bg2)',color:p.id===myId?'var(--acc)':'var(--tx3)'}}>
                {p.name.split(' ')[0]}: {p.pts||0}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Vote result toast */}
      {voteResult && (
        <div style={{padding:'10px 16px',borderRadius:'var(--rs)',fontSize:13,fontWeight:500,background:voteResult.majority&&!voteResult.correct?'var(--rdim)':'var(--gdim)',border:'1px solid '+(voteResult.majority&&!voteResult.correct?'rgba(224,85,85,.3)':'rgba(76,175,125,.3)'),color:voteResult.majority&&!voteResult.correct?'var(--red)':'var(--grn)'}}>
          {!voteResult.majority&&`🗳 Keine Mehrheit (${voteResult.yes}/${voteResult.total}). Weiter!${voteResult.agentPts>0?' Spion +'+voteResult.agentPts:''}`}
          {voteResult.majority&&!voteResult.correct&&`❌ Falsche Anklage!${voteResult.agentPts>0?' Spion +'+voteResult.agentPts:''}`}
        </div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'290px 1fr',gap:14,alignItems:'start'}}>
        {/* Left: Card + Actions */}
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <div className="lbl">Deine Karte</div>

          {!revealed ? (
            <div onClick={()=>setRevealed(true)} style={{background:'var(--surf)',border:'2px dashed var(--bord)',borderRadius:'var(--r)',padding:'28px 16px',textAlign:'center',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:8,color:'var(--tx2)',fontSize:14}}>
              <span style={{fontSize:36}}>🃏</span><span>Tippen zum Aufdecken</span>
              <span style={{fontSize:11,color:'var(--tx3)'}}>Niemand darf mitsehen!</span>
            </div>
          ) : (
            <div style={{borderRadius:'var(--r)',overflow:'hidden',background:isSpy?'linear-gradient(135deg,#1a0808,#280e0e)':'linear-gradient(135deg,#071510,#0d2218)',border:'1px solid '+(isSpy?'rgba(224,85,85,.35)':'rgba(76,175,125,.35)')}}>
              {isSpy ? (
                <div style={{padding:'26px 20px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                  <div style={{fontSize:44,marginBottom:6}}>🕵️</div>
                  <div style={{fontSize:11,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(224,85,85,.7)',fontWeight:600}}>Du bist der</div>
                  <div style={{fontFamily:'var(--fd)',fontSize:34,fontWeight:900,color:'var(--red)'}}>SPION</div>
                  <div style={{fontSize:12,color:'var(--tx3)',marginTop:4,fontStyle:'italic'}}>Finde den Ort heraus!</div>
                </div>
              ) : (
                <div style={{padding:'24px 20px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                  <div style={{fontSize:38,marginBottom:6}}>{card.ortEmoji}</div>
                  <div style={{fontFamily:'var(--fd)',fontSize:20,fontWeight:700,color:'var(--grn)'}}>{card.ort}</div>
                  <div style={{fontSize:10,letterSpacing:'.15em',textTransform:'uppercase',color:'var(--tx3)',marginTop:10}}>Deine Rolle</div>
                  <div style={{fontSize:16,fontWeight:600,color:'var(--tx)'}}>{card.rolle}</div>
                </div>
              )}
            </div>
          )}

          {revealed && <button className="btn bg" style={{width:'100%',justifyContent:'center',fontSize:12}} onClick={()=>setRevealed(false)}>🙈 Karte verbergen</button>}

          {!accusing && !guessing && (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {!isSpy && <button className="btn br" style={{width:'100%',justifyContent:'center'}} onClick={()=>setAccusing(true)}>🚨 Anklage starten</button>}
              {isSpy && <button className="btn bg" style={{width:'100%',justifyContent:'center',borderColor:'rgba(201,168,76,.4)',color:'var(--acc)'}} onClick={()=>setGuessing(true)}>🎯 Ort erraten & beenden</button>}
            </div>
          )}

          {accusing && (
            <div className="card">
              <div className="lbl">Wen beschuldigst du?</div>
              <select value={target} onChange={e=>setTarget(e.target.value)} style={{marginBottom:8}}>
                <option value="">— Spieler wählen —</option>
                {players.filter(p=>p.id!==myId).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {nonComm && <input type="text" placeholder="These (optional)..." value={thesis} onChange={e=>setThesis(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doAccuse()} style={{marginBottom:8}} />}
              <div style={{display:'flex',gap:8}}>
                <button className="btn bg" style={{flex:1,justifyContent:'center',fontSize:13}} onClick={()=>{setAccusing(false);setTarget('');setThesis('');}}>Abbrechen</button>
                <button className="btn br" style={{flex:1,justifyContent:'center',fontSize:13}} onClick={doAccuse} disabled={!target}>🚨 Anklagen!</button>
              </div>
            </div>
          )}

          {guessing && (
            <div className="card">
              <div className="lbl">Welcher Ort?</div>
              <input type="text" placeholder="Ort eintippen..." value={guessInput} onChange={e=>setGuessInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&guessInput.trim()&&doGuess(guessInput)} autoFocus style={{marginBottom:6}} />
              {suggestions.length>0 && (
                <div style={{border:'1px solid var(--bord)',borderRadius:'var(--rs)',overflow:'hidden',marginBottom:6}}>
                  {suggestions.map(l=>(
                    <button key={l.id} onClick={()=>doGuess(l.name)} style={{fontFamily:'var(--fb)',fontSize:13,padding:'9px 12px',background:'var(--bg2)',border:'none',borderBottom:'1px solid var(--bord)',color:'var(--tx2)',cursor:'pointer',textAlign:'left',width:'100%',display:'flex',gap:8,alignItems:'center',transition:'background .1s'}}
                      onMouseEnter={e=>e.currentTarget.style.background='var(--adim)'}
                      onMouseLeave={e=>e.currentTarget.style.background='var(--bg2)'}>
                      {l.emoji} {l.name}
                    </button>
                  ))}
                </div>
              )}
              <div style={{display:'flex',gap:8}}>
                <button className="btn bg" style={{flex:1,justifyContent:'center',fontSize:13}} onClick={()=>{setGuessing(false);setGuessInput('');}}>Abbrechen</button>
                <button className="btn bp" style={{flex:1,justifyContent:'center',fontSize:13}} onClick={()=>doGuess(guessInput)} disabled={!guessInput.trim()}>🎯 Raten!</button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Locations */}
        <div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <div className="lbl" style={{margin:0}}>Alle Orte ({locations?.length||0})</div>
            <span style={{fontSize:11,color:'var(--tx3)'}}>{isSpy?'Klicken = ausschließen':'Klicken = markieren'}</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5}}>
            {(locations||[]).map(l=>{
              const x=crossed?.includes(l.id);
              const mine=!isSpy&&card?.ort===l.name;
              return (
                <button key={l.id} onClick={()=>onMark(l.id)} style={{display:'flex',alignItems:'center',gap:6,padding:'7px 9px',background:mine&&!x?'var(--gdim)':'var(--bg2)',border:'1px solid '+(mine&&!x?'rgba(76,175,125,.45)':'var(--bord)'),borderRadius:'var(--rs)',cursor:'pointer',fontFamily:'var(--fb)',color:x?'var(--tx3)':mine?'var(--tx)':'var(--tx2)',fontSize:12,textAlign:'left',opacity:x?.3:1,textDecoration:x?'line-through':'none'}}>
                  <span style={{fontSize:14,flexShrink:0}}>{l.emoji}</span>
                  <span style={{flex:1,lineHeight:1.3}}>{l.name}</span>
                  {x&&<span style={{color:'var(--red)',fontSize:10,fontWeight:700}}>✕</span>}
                  {mine&&!x&&<span style={{color:'var(--grn)',fontSize:9}}>●</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
