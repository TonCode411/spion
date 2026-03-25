export default function VoteScreen({ vote, myId, players, onYes, onNo, onCancel }) {
  const isAccuser = vote?.accuser === myId;
  const voted = vote?.votes?.[myId] !== undefined;
  const done = vote?.voted || Object.keys(vote?.votes||{}).length || 0;
  const total = vote?.total || players?.length || 1;

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:24,background:'radial-gradient(ellipse at center,rgba(224,85,85,.06) 0%,transparent 70%)'}}>
      <div style={{width:'100%',maxWidth:420,display:'flex',flexDirection:'column',gap:18}} className="fi">
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:52,animation:'pulse 1s infinite',marginBottom:8}}>🚨</div>
          <h1 style={{fontFamily:'var(--fd)',fontSize:44,fontWeight:900,color:'var(--red)'}}>Anklage!</h1>
        </div>

        <div style={{background:'var(--rdim)',border:'1px solid rgba(224,85,85,.3)',borderRadius:'var(--r)',padding:'18px 20px',textAlign:'center',display:'flex',flexDirection:'column',gap:12}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,flexWrap:'wrap'}}>
            <span style={{fontWeight:700,fontSize:15}}>{vote?.accuserName}</span>
            <span style={{color:'var(--tx3)',fontSize:13}}>beschuldigt</span>
            <span style={{fontFamily:'var(--fd)',fontSize:22,fontWeight:700,color:'var(--red)'}}>{vote?.accusedName}</span>
          </div>
          {vote?.thesis && <div style={{fontSize:13,color:'var(--tx2)',fontStyle:'italic',borderTop:'1px solid rgba(224,85,85,.2)',paddingTop:10}}>„{vote.thesis}"</div>}
        </div>

        {isAccuser && <div style={{background:'var(--adim)',border:'1px solid rgba(201,168,76,.3)',borderRadius:'var(--rs)',padding:'10px 14px',textAlign:'center',fontSize:13,fontWeight:600,color:'var(--acc)'}}>✓ Du hast die Anklage gestartet – deine Stimme zählt als Ja.</div>}

        <div style={{textAlign:'center',fontSize:16,color:'var(--tx2)',lineHeight:1.5}}>
          Ist <strong>{vote?.accusedName}</strong> der Spion?
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          <div style={{fontSize:12,color:'var(--tx3)',textAlign:'center'}}>{done} von {total} haben abgestimmt</div>
          <div style={{height:6,background:'var(--bord)',borderRadius:3,overflow:'hidden'}}>
            <div style={{height:'100%',background:'var(--acc)',borderRadius:3,width:Math.round((done/total)*100)+'%',transition:'width .4s ease'}} />
          </div>
        </div>

        {!voted ? (
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            <button className="btn bgrn" style={{width:'100%',justifyContent:'center',padding:15,fontSize:15}} onClick={onYes}>✓ Ja, ist der Spion</button>
            <button className="btn br" style={{width:'100%',justifyContent:'center',padding:15,fontSize:15}} onClick={onNo}>✗ Nein, falsch beschuldigt</button>
          </div>
        ) : (
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,padding:16,background:'var(--surf)',border:'1px solid var(--bord)',borderRadius:'var(--r)',fontSize:14,color:'var(--tx2)'}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:'var(--acc)',animation:'pulse 1.5s infinite',flexShrink:0}} />
            Warte auf andere Spieler...
          </div>
        )}

        {isAccuser && <button className="btn bg" style={{width:'100%',justifyContent:'center',fontSize:12}} onClick={onCancel}>Abstimmung abbrechen</button>}
      </div>
    </div>
  );
}
