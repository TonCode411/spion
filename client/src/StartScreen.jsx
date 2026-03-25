import { useState } from 'react';

export default function StartScreen({ onCreate, onJoin }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [mode, setMode] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function go() {
    if (!name.trim()) return setErr('Bitte Namen eingeben.');
    if (mode === 'join' && !code.trim()) return setErr('Bitte Code eingeben.');
    setErr(''); setLoading(true);
    try {
      if (mode === 'new') await onCreate(name.trim());
      else await onJoin(name.trim(), code.trim().toUpperCase());
    } catch(e) { setErr(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{width:'100%',maxWidth:400,display:'flex',flexDirection:'column',gap:24}} className="fi">
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:56,marginBottom:12}}>🕵️</div>
          <h1 style={{fontFamily:'var(--fd)',fontSize:42,fontWeight:900,lineHeight:1.1,marginBottom:8}}>Spion</h1>
          <p style={{color:'var(--tx2)',fontSize:14}}>Wer unter euch ist der Spion?</p>
        </div>
        <div className="card" style={{display:'flex',flexDirection:'column',gap:14}}>
          {!mode ? (
            <>
              <button className="btn bp" style={{width:'100%',justifyContent:'center',padding:14,fontSize:15}} onClick={()=>setMode('new')}>✦ Neue Lobby erstellen</button>
              <button className="btn bg" style={{width:'100%',justifyContent:'center',padding:14,fontSize:15}} onClick={()=>setMode('join')}>→ Lobby beitreten</button>
            </>
          ) : (
            <>
              <button onClick={()=>{setMode(null);setErr('');}} style={{background:'none',border:'none',color:'var(--tx3)',cursor:'pointer',textAlign:'left',fontSize:13,fontFamily:'var(--fb)'}}>← Zurück</button>
              <h2 style={{fontFamily:'var(--fd)',fontSize:20}}>{mode==='new'?'Neue Lobby':'Beitreten'}</h2>
              <div><div className="lbl">Dein Name</div><input type="text" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()} placeholder="z.B. Max" maxLength={20} autoFocus /></div>
              {mode==='join' && <div><div className="lbl">Lobby-Code</div><input type="text" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} onKeyDown={e=>e.key==='Enter'&&go()} placeholder="z.B. AB3XYZ" maxLength={6} style={{letterSpacing:'.2em',fontWeight:600,fontSize:18}} /></div>}
              {err && <div style={{background:'var(--rdim)',border:'1px solid rgba(224,85,85,.3)',color:'var(--red)',padding:'10px 14px',borderRadius:'var(--rs)',fontSize:13}}>{err}</div>}
              <button className="btn bp" style={{width:'100%',justifyContent:'center'}} onClick={go} disabled={loading}>{loading?'...':(mode==='new'?'Erstellen':'Beitreten')}</button>
            </>
          )}
        </div>
        <p style={{textAlign:'center',color:'var(--tx3)',fontSize:12}}>3–8 Spieler · Jeder auf seinem Gerät · Kein Account</p>
      </div>
    </div>
  );
}
