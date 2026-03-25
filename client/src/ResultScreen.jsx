const INFO = {
  caught:        { emoji:'🎉', title:'Spion enttarnt!',            green:true  },
  agent_correct: { emoji:'🕵️', title:'Spion hat den Ort erraten!',  green:false },
  agent_wrong:   { emoji:'❌', title:'Spion lag falsch!',           green:true  },
  time:          { emoji:'⏱',  title:'Zeit abgelaufen!',            green:false }
};

export default function ResultScreen({ result, myId, state, onNext }) {
  const isHost = state?.hostId === myId;
  const info = INFO[result.reason] || INFO.caught;
  const cards = result.cards || {};
  const players = result.players || {};
  const pts = result.points || [];
  const pointsOn = state?.cfg?.pointsOn;

  const agentEntry = Object.entries(cards).find(([,c])=>c.typ==='agent');
  const agentName = agentEntry ? (players[agentEntry[0]]?.name||'?') : '?';
  const list = Object.entries(cards).map(([id,c])=>({id,name:players[id]?.name||'?',...c}));

  return (
    <div style={{minHeight:'100vh',display:'flex',justifyContent:'center',padding:'24px 20px'}}>
      <div style={{width:'100%',maxWidth:560,display:'flex',flexDirection:'column',gap:14}}>

        <div style={{textAlign:'center',padding:'8px 0'}} className="fi">
          <div style={{fontSize:50,marginBottom:4}}>{info.emoji}</div>
          <h1 style={{fontFamily:'var(--fd)',fontSize:32,fontWeight:900,color:info.green?'var(--grn)':'var(--red)'}}>{info.title}</h1>
          {result.accuserName&&<p style={{fontSize:13,color:'var(--tx2)',marginTop:4}}>Anklage von <strong>{result.accuserName}</strong></p>}
          {result.guess&&<p style={{fontSize:13,color:'var(--tx2)',marginTop:4}}>Spion tippte: <strong>{result.guess}</strong> {result.reason==='agent_correct'?'✓':'✗'}</p>}
        </div>

        <div style={{background:'var(--adim)',border:'1px solid rgba(201,168,76,.3)',borderRadius:'var(--r)',padding:'14px 20px',textAlign:'center'}} className="fi">
          <div style={{fontSize:11,letterSpacing:'.15em',textTransform:'uppercase',color:'rgba(201,168,76,.6)',marginBottom:4}}>Der geheime Ort war</div>
          <div style={{fontFamily:'var(--fd)',fontSize:26,fontWeight:700,color:'var(--acc)'}}>{result.location?.emoji} {result.location?.name}</div>
        </div>

        <div style={{background:'var(--rdim)',border:'1px solid rgba(224,85,85,.3)',borderRadius:'var(--r)',padding:'12px 20px',textAlign:'center'}} className="fi">
          <div style={{fontSize:11,letterSpacing:'.15em',textTransform:'uppercase',color:'rgba(224,85,85,.6)',marginBottom:4}}>Der Spion war</div>
          <div style={{fontFamily:'var(--fd)',fontSize:22,fontWeight:700,color:'var(--red)'}}>🕵️ {agentName}</div>
        </div>

        {pointsOn&&pts.length>0&&(
          <div className="card fi">
            <div className="lbl">Punktestand</div>
            {[...pts].sort((a,b)=>b.pts-a.pts).map((p,i)=>(
              <div key={p.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',background:p.id===myId?'var(--adim)':'var(--bg2)',border:'1px solid '+(p.id===myId?'rgba(201,168,76,.3)':'var(--bord)'),borderRadius:'var(--rs)',marginBottom:6,fontSize:14}}>
                <span style={{fontSize:12,color:'var(--tx3)',minWidth:18}}>{i+1}.</span>
                <span style={{flex:1,fontWeight:500}}>{p.name}</span>
                <span style={{fontWeight:700,color:'var(--acc)'}}>{p.pts} Pkt</span>
              </div>
            ))}
          </div>
        )}

        <div className="card fi">
          <div className="lbl">Alle Karten</div>
          {list.map(p=>(
            <div key={p.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:p.typ==='agent'?'var(--rdim)':'var(--bg2)',border:'1px solid '+(p.typ==='agent'?'rgba(224,85,85,.2)':'var(--bord)'),borderRadius:'var(--rs)',marginBottom:6}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:'var(--surf2)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,color:'var(--acc)',flexShrink:0}}>{p.name.charAt(0).toUpperCase()}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14}}>{p.name}{p.id===myId&&<span style={{fontSize:11,color:'var(--tx3)',marginLeft:6}}>(Du)</span>}</div>
                {p.typ!=='agent'&&<div style={{fontSize:12,color:'var(--tx3)'}}>{p.rolle}</div>}
              </div>
              {p.typ==='agent'?<span className="tag ta">Spion</span>:<span className="tag ts">Spieler</span>}
            </div>
          ))}
        </div>

        <div style={{display:'flex',justifyContent:'center',padding:'8px 0 16px'}}>
          {isHost
            ? <button className="btn bp" style={{padding:'14px 40px',fontSize:15}} onClick={onNext}>▶ Nächste Runde</button>
            : <div style={{background:'var(--surf)',border:'1px solid var(--bord)',borderRadius:'var(--r)',padding:'14px 32px',color:'var(--tx2)',fontSize:14}}>Warte auf den Host...</div>
          }
        </div>
      </div>
    </div>
  );
}
