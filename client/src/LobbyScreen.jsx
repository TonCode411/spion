import { useState } from 'react';

export default function LobbyScreen({ state, myId, connected, onStart, onCfg }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tab, setTab] = useState('locations');
  const [copied, setCopied] = useState(false);
  const [testMode, setTestMode] = useState(false);

  const cfg = state.cfg || {};
  const players = state.players || [];
  const n = players.length;
  const isHost = state.hostId === myId;
  const allLocs = state.locations || [];

  const [activeLocs, setActiveLocs] = useState(cfg.activeLocations || allLocs.map(o=>o.id));
  const [timerOn, setTimerOn] = useState(cfg.timerOn||false);
  const [timerMode, setTimerMode] = useState(cfg.timerMode||'std');
  const [timerSecs, setTimerSecs] = useState(cfg.timerSecs||300);
  const [pointsOn, setPointsOn] = useState(cfg.pointsOn||false);
  const [nonComm, setNonComm] = useState(cfg.nonComm||false);

  function copyLink() {
    navigator.clipboard.writeText(window.location.origin+'?code='+state.code);
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  }

  function toggleLoc(id) {
    setActiveLocs(p=>p.includes(id)?(p.length>1?p.filter(x=>x!==id):p):[...p,id]);
  }

  function saveSettings() {
    onCfg({activeLocations:activeLocs,timerOn,timerMode,timerSecs,pointsOn,nonComm,testMode});
    setSettingsOpen(false);
  }

  function handleStart() {
    onCfg({testMode});
    setTimeout(()=>onStart(),50);
  }

  const timerLabel = ()=>{
    if(!timerOn) return 'Kein Timer';
    if(timerMode==='comp') return n+' × 1 Min';
    if(timerMode==='std') return n+' × 2 Min';
    return Math.floor(timerSecs/60)+':'+String(timerSecs%60).padStart(2,'0');
  };

  const S = {row:{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid var(--bord)',fontSize:13}};

  return (
    <div style={{minHeight:'100vh',padding:20,maxWidth:860,margin:'0 auto'}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:16,flexWrap:'wrap',marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:'var(--fd)',fontSize:26,fontWeight:700,marginBottom:4}}>🕵️ Spion <span style={{fontSize:11,color:'var(--tx3)',fontFamily:'monospace'}}>v1</span></h1>
          {n>=3&&n<5&&<div style={{fontSize:12,color:'var(--acc)',background:'var(--adim)',border:'1px solid rgba(201,168,76,.2)',borderRadius:20,padding:'2px 12px',display:'inline-block'}}>💡 Am besten mit 5+ Spielern</div>}
        </div>
        <div className="card" style={{textAlign:'center',minWidth:200}}>
          <div className="lbl">Lobby-Code</div>
          <div style={{fontSize:28,fontWeight:700,letterSpacing:'.25em',color:'var(--acc)',fontFamily:'monospace',marginBottom:10}}>{state.code}</div>
          <button className="btn bg" style={{width:'100%',justifyContent:'center',fontSize:12,padding:'6px 12px'}} onClick={copyLink}>{copied?'✓ Kopiert!':'🔗 Einladungslink'}</button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        {/* Players */}
        <div className="card">
          <div className="lbl">Spieler ({n} / {cfg.maxPlayers||8})</div>
          {players.map(p=>(
            <div key={p.id} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 0',borderBottom:'1px solid var(--bord)'}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:'var(--adim)',border:'1px solid rgba(201,168,76,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,color:'var(--acc)',flexShrink:0}}>{p.name.charAt(0).toUpperCase()}</div>
              <span style={{flex:1,fontWeight:500,fontSize:14}}>{p.name}</span>
              {pointsOn&&<span style={{fontSize:11,color:'var(--acc)',background:'var(--adim)',padding:'2px 8px',borderRadius:20}}>{p.pts||0} Pkt</span>}
              {p.isHost&&<span className="tag th">Host</span>}
              {p.id===myId&&!p.isHost&&<span style={{fontSize:10,color:'var(--tx3)',border:'1px solid var(--bord)',padding:'1px 6px',borderRadius:20}}>Du</span>}
            </div>
          ))}
          {n<3&&!testMode&&<p style={{fontSize:12,color:'var(--tx3)',marginTop:8}}>Noch {3-n} Spieler benötigt...</p>}
        </div>

        {/* Right */}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className="card">
            <div className="lbl">Einstellungen</div>
            {[['Aktive Orte',activeLocs.length+' / '+allLocs.length],['Timer',timerLabel()],['Punkte',pointsOn?'Aktiv':'Aus'],['Non-Comm',nonComm?'Aktiv':'Aus']].map(([k,v])=>(
              <div key={k} style={S.row}><span style={{color:'var(--tx2)'}}>{k}</span><span style={{color:'var(--acc)'}}>{v}</span></div>
            ))}
            {isHost&&<button className="btn bg" style={{width:'100%',justifyContent:'center',marginTop:12,fontSize:13}} onClick={()=>setSettingsOpen(true)}>⚙️ Einstellungen</button>}
          </div>

          {isHost ? (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <div style={{fontSize:11,textAlign:'center',color:connected?'var(--grn)':'var(--red)'}}>
                {connected?'● Verbunden':'● Keine Verbindung'}
              </div>
              <button className="btn bp" style={{width:'100%',justifyContent:'center',padding:15,fontSize:16}} onClick={handleStart}>
                🎮 Runde starten
              </button>
              <button className="btn bg" style={{width:'100%',justifyContent:'center',fontSize:12,...(testMode?{borderColor:'rgba(201,168,76,.5)',color:'var(--acc)'}:{})}} onClick={()=>setTestMode(t=>!t)}>
                🧪 Test-Modus: {testMode?'AN (Solo)':'AUS'}
              </button>
            </div>
          ) : (
            <div style={{background:'var(--surf)',border:'1px solid var(--bord)',borderRadius:'var(--r)',padding:16,display:'flex',alignItems:'center',justifyContent:'center',gap:12}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:'var(--acc)',animation:'pulse 1.5s infinite'}} />
              <span style={{color:'var(--tx2)',fontSize:13}}>Warte auf den Host...</span>
            </div>
          )}

          <details style={{background:'var(--surf)',border:'1px solid var(--bord)',borderRadius:'var(--r)',overflow:'hidden'}}>
            <summary style={{padding:'13px 16px',fontWeight:600,fontSize:14,cursor:'pointer',listStyle:'none'}}>📖 Spielregeln</summary>
            <div style={{padding:'0 16px 14px',fontSize:13,color:'var(--tx2)',lineHeight:1.6,display:'flex',flexDirection:'column',gap:8}}>
              <p>Alle befinden sich am gleichen geheimen <strong>Ort</strong> – nur der <strong>Spion</strong> kennt ihn nicht.</p>
              <p>Reihum stellt jeder eine Frage. Nicht zu spezifisch (verrät den Ort) und nicht zu vage (wirkt wie der Spion).</p>
              <div style={{background:'var(--bg2)',border:'1px solid var(--bord)',borderRadius:'var(--rs)',padding:'10px 12px',fontSize:12,display:'flex',flexDirection:'column',gap:5}}>
                <div>🎉 <strong>Spieler gewinnen</strong> wenn Spion per Voting enttarnt wird</div>
                <div>🕵️ <strong>Spion gewinnt</strong> wenn er unerkannt bleibt oder Ort errät</div>
                <div>🚨 <strong>Anklage</strong> — jeder kann starten, alle stimmen ab</div>
                <div>🎯 <strong>Spion raten</strong> — tippt Ort, Runde endet sofort</div>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* Settings Modal */}
      {settingsOpen && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.72)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,zIndex:1000}} onClick={()=>setSettingsOpen(false)}>
          <div style={{background:'var(--surf)',border:'1px solid var(--bord)',borderRadius:'var(--r)',padding:22,width:'100%',maxWidth:520,maxHeight:'85vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,flexWrap:'wrap',gap:10}}>
              <h2 style={{fontFamily:'var(--fd)',fontSize:20}}>Einstellungen</h2>
              <div style={{display:'flex',gap:3,background:'var(--bg2)',padding:3,borderRadius:'var(--rs)'}}>
                {['locations','game'].map(t=>(
                  <button key={t} onClick={()=>setTab(t)} style={{fontFamily:'var(--fb)',fontSize:12,fontWeight:600,padding:'5px 12px',border:'none',borderRadius:6,background:tab===t?'var(--surf2)':'transparent',color:tab===t?'var(--tx)':'var(--tx3)',cursor:'pointer'}}>
                    {t==='locations'?'Orte':'Spielmodus'}
                  </button>
                ))}
              </div>
            </div>

            {tab==='locations' && (
              <>
                <div style={{display:'flex',gap:8,marginBottom:12,alignItems:'center'}}>
                  <button className="btn bg" style={{fontSize:12,padding:'5px 10px'}} onClick={()=>setActiveLocs(allLocs.map(o=>o.id))}>Alle an</button>
                  <button className="btn bg" style={{fontSize:12,padding:'5px 10px'}} onClick={()=>setActiveLocs([allLocs[0]?.id])}>Alle aus</button>
                  <span style={{fontSize:12,color:'var(--tx3)',marginLeft:'auto'}}>{activeLocs.length} aktiv</span>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,maxHeight:'52vh',overflowY:'auto'}}>
                  {allLocs.map(o=>{
                    const on=activeLocs.includes(o.id);
                    return <button key={o.id} onClick={()=>toggleLoc(o.id)} style={{display:'flex',alignItems:'center',gap:7,padding:'8px 10px',background:on?'var(--adim)':'var(--bg2)',border:'1px solid '+(on?'rgba(201,168,76,.4)':'var(--bord)'),borderRadius:'var(--rs)',color:on?'var(--tx)':'var(--tx3)',fontFamily:'var(--fb)',cursor:'pointer',fontSize:12}}>
                      <span>{o.emoji}</span><span style={{flex:1,textAlign:'left'}}>{o.name}</span>{on&&<span style={{color:'var(--acc)',fontSize:11}}>✓</span>}
                    </button>;
                  })}
                </div>
              </>
            )}

            {tab==='game' && (
              <div style={{display:'flex',flexDirection:'column',gap:18}}>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  <div style={{fontSize:13,fontWeight:700,paddingBottom:8,borderBottom:'1px solid var(--bord)'}}>⏱ Timer</div>
                  <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',fontSize:13,color:'var(--tx2)'}}>
                    <input type="checkbox" checked={timerOn} onChange={e=>setTimerOn(e.target.checked)} style={{accentColor:'var(--acc)',width:15,height:15}} />Timer aktivieren
                  </label>
                  {timerOn && (
                    <div style={{display:'flex',flexDirection:'column',gap:6}}>
                      {[['comp','⚡ Competitive — 1 Min / Spieler'],['std','🕐 Standard — 2 Min / Spieler'],['custom','✏️ Eigene Zeit']].map(([id,label])=>(
                        <button key={id} onClick={()=>setTimerMode(id)} style={{fontFamily:'var(--fb)',fontSize:12,padding:'8px 12px',background:timerMode===id?'var(--adim)':'var(--bg2)',border:'1px solid '+(timerMode===id?'var(--acc)':'var(--bord)'),borderRadius:'var(--rs)',color:timerMode===id?'var(--tx)':'var(--tx3)',cursor:'pointer',textAlign:'left'}}>{label}</button>
                      ))}
                      {timerMode==='custom' && (
                        <div style={{display:'flex',alignItems:'center',gap:12}}>
                          <input type="range" min={60} max={900} step={30} value={timerSecs} onChange={e=>setTimerSecs(Number(e.target.value))} style={{flex:1,accentColor:'var(--acc)'}} />
                          <span style={{color:'var(--acc)',fontWeight:700,minWidth:44}}>{Math.floor(timerSecs/60)}:{String(timerSecs%60).padStart(2,'0')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  <div style={{fontSize:13,fontWeight:700,paddingBottom:8,borderBottom:'1px solid var(--bord)'}}>🏆 Punkte</div>
                  <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',fontSize:13,color:'var(--tx2)'}}>
                    <input type="checkbox" checked={pointsOn} onChange={e=>setPointsOn(e.target.checked)} style={{accentColor:'var(--acc)',width:15,height:15}} />Punktesystem aktivieren
                  </label>
                  {pointsOn && (
                    <div style={{background:'var(--bg2)',border:'1px solid var(--bord)',borderRadius:'var(--rs)',padding:'10px 12px',fontSize:12,color:'var(--tx2)',display:'flex',flexDirection:'column',gap:5}}>
                      <div>Spion enttarnt → <strong>Alle +1</strong>, Ankläger +1 extra</div>
                      <div>Falsche Anklage → <strong>Spion +1</strong></div>
                      <div>Spion errät Ort → <strong>Spion +3</strong></div>
                      <div>Zeit ab (Standard) → <strong>Spion +2</strong> · Competitive → <strong>Spion +1</strong></div>
                    </div>
                  )}
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  <div style={{fontSize:13,fontWeight:700,paddingBottom:8,borderBottom:'1px solid var(--bord)'}}>💬 Non-Communication</div>
                  <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',fontSize:13,color:'var(--tx2)'}}>
                    <input type="checkbox" checked={nonComm} onChange={e=>setNonComm(e.target.checked)} style={{accentColor:'var(--acc)',width:15,height:15}} />Anklage-These ins Textfeld tippen
                  </label>
                </div>
              </div>
            )}

            <div style={{display:'flex',gap:10,marginTop:20}}>
              <button className="btn bg" style={{flex:1,justifyContent:'center'}} onClick={()=>setSettingsOpen(false)}>Abbrechen</button>
              <button className="btn bp" style={{flex:1,justifyContent:'center'}} onClick={saveSettings}>Speichern</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
