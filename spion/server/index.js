const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { ORTE } = require('./gameData');

const app = express();
app.use(cors({ origin: '*' }));
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  pingTimeout: 60000,
  pingInterval: 25000
});

// ─── State ────────────────────────────────────────────────────────────────────
const lobbies = {};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeCode() {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += abc[Math.floor(Math.random() * abc.length)];
  return s;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function agentId(lobby) {
  if (!lobby.cards) return null;
  for (const [id, card] of Object.entries(lobby.cards)) {
    if (card.typ === 'agent') return id;
  }
  return null;
}

function addPoints(lobby, id, n) {
  if (lobby.players[id]) lobby.players[id].pts = (lobby.players[id].pts || 0) + n;
}

function pointsSnapshot(lobby) {
  return Object.values(lobby.players).map(p => ({ id: p.id, name: p.name, pts: p.pts || 0 }));
}

function stopTimer(lobby) {
  if (lobby._t) { clearInterval(lobby._t); lobby._t = null; }
}

function startTimer(lobby) {
  stopTimer(lobby);
  if (!lobby.cfg.timerOn) return;
  const n = Object.keys(lobby.players).length;
  const secs =
    lobby.cfg.timerMode === 'comp' ? n * 60 :
    lobby.cfg.timerMode === 'std'  ? n * 120 :
    (lobby.cfg.timerSecs || 300);
  lobby.timerLeft = secs;
  lobby.timerTotal = secs;
  lobby._t = setInterval(() => {
    if (lobby.phase !== 'playing' || lobby.paused) return;
    lobby.timerLeft = Math.max(0, lobby.timerLeft - 1);
    io.to(lobby.code).emit('TIMER', { left: lobby.timerLeft, total: lobby.timerTotal });
    if (lobby.timerLeft <= 0) {
      stopTimer(lobby);
      const aid = agentId(lobby);
      const pts = lobby.cfg.timerMode === 'comp' ? 1 : 2;
      if (aid && lobby.cfg.pointsOn) addPoints(lobby, aid, pts);
      endRound(lobby, 'time', { agentPts: pts });
    }
  }, 1000);
}

function broadcastState(lobby) {
  io.to(lobby.code).emit('STATE', makeState(lobby));
}

function endRound(lobby, reason, extra) {
  stopTimer(lobby);
  lobby.phase = 'ended';
  lobby.paused = false;
  lobby.vote = null;
  io.to(lobby.code).emit('ROUND_END', {
    location: { name: lobby.location.name, emoji: lobby.location.emoji },
    cards: lobby.cards,
    players: lobby.players,
    reason,
    points: pointsSnapshot(lobby),
    ...extra
  });
  broadcastState(lobby);
}

function resolveVote(lobby) {
  if (!lobby.vote) return;
  const { votes, total, accuser, accuserName, accused } = lobby.vote;
  const yesCount = Object.values(votes).filter(Boolean).length;
  const majority = yesCount > total / 2;
  const aid = agentId(lobby);
  const correct = accused === aid;

  if (majority && correct) {
    if (lobby.cfg.pointsOn) {
      Object.keys(lobby.players).forEach(id => { if (id !== aid) addPoints(lobby, id, 1); });
      addPoints(lobby, accuser, 1);
    }
    endRound(lobby, 'caught', { accuser, accuserName });
  } else {
    if (lobby.cfg.pointsOn && aid) addPoints(lobby, aid, 1);
    lobby.vote = null;
    lobby.paused = false;
    io.to(lobby.code).emit('VOTE_RESULT', {
      majority, correct, yes: yesCount, total,
      agentPts: lobby.cfg.pointsOn ? 1 : 0
    });
    broadcastState(lobby);
  }
}

function makeState(lobby) {
  return {
    code: lobby.code,
    hostId: lobby.hostId,
    phase: lobby.phase,
    roundNr: lobby.roundNr,
    paused: lobby.paused,
    players: Object.values(lobby.players).map(p => ({
      id: p.id, name: p.name,
      isHost: p.id === lobby.hostId,
      pts: p.pts || 0
    })),
    cfg: lobby.cfg,
    locations: ORTE.map(o => ({ id: o.id, name: o.name, emoji: o.emoji })),
    vote: lobby.vote ? {
      accuser: lobby.vote.accuser,
      accuserName: lobby.vote.accuserName,
      accused: lobby.vote.accused,
      accusedName: lobby.vote.accusedName,
      thesis: lobby.vote.thesis,
      voted: Object.keys(lobby.vote.votes).length,
      total: lobby.vote.total,
      votes: lobby.vote.votes
    } : null,
    timerLeft: lobby.timerLeft ?? null,
    timerTotal: lobby.timerTotal ?? null
  };
}

function sendCard(playerId, lobby) {
  if (!lobby.cards?.[playerId]) return;
  io.to(playerId).emit('YOUR_CARD', {
    card: lobby.cards[playerId],
    locations: ORTE.map(o => ({ id: o.id, name: o.name, emoji: o.emoji })),
    roundNr: lobby.roundNr,
    cfg: lobby.cfg
  });
}

const DEFAULT_CFG = {
  activeLocations: ORTE.map(o => o.id),
  maxPlayers: 8,
  timerOn: false,
  timerMode: 'std',
  timerSecs: 300,
  pointsOn: false,
  nonComm: false,
  testMode: false
};

// ─── Socket handlers ──────────────────────────────────────────────────────────
io.on('connection', (socket) => {

  function myLobby() {
    return lobbies[socket.data.code] || null;
  }

  // CREATE lobby
  socket.on('CREATE', ({ name }, cb) => {
    let code;
    do { code = makeCode(); } while (lobbies[code]);
    lobbies[code] = {
      code, hostId: socket.id, phase: 'waiting', roundNr: 0,
      paused: false, vote: null, cards: null, location: null,
      _t: null, timerLeft: null, timerTotal: null,
      players: { [socket.id]: { id: socket.id, name, pts: 0 } },
      cfg: { ...DEFAULT_CFG }
    };
    socket.join(code);
    socket.data.code = code;
    socket.data.name = name;
    cb({ ok: true, code, myId: socket.id });
    broadcastState(lobbies[code]);
  });

  // JOIN lobby
  socket.on('JOIN', ({ code, name }, cb) => {
    const lobby = lobbies[code];
    if (!lobby) return cb({ ok: false, err: 'Lobby nicht gefunden' });
    const known = !!lobby.players[socket.id];
    if (!known && lobby.phase === 'playing')
      return cb({ ok: false, err: 'Spiel läuft bereits' });
    if (!known && Object.keys(lobby.players).length >= lobby.cfg.maxPlayers)
      return cb({ ok: false, err: 'Lobby ist voll' });
    if (!known) lobby.players[socket.id] = { id: socket.id, name, pts: 0 };
    socket.join(code);
    socket.data.code = code;
    socket.data.name = name;
    cb({ ok: true, code, myId: socket.id });
    broadcastState(lobby);
    if (lobby.phase === 'playing') sendCard(socket.id, lobby);
  });

  // SYNC after reconnect
  socket.on('SYNC', ({ code, name } = {}) => {
    const c = socket.data.code || code;
    if (!c) return;
    const lobby = lobbies[c];
    if (!lobby) return;
    if (!socket.data.code) {
      socket.data.code = c;
      socket.data.name = name;
      socket.join(c);
      if (!lobby.players[socket.id])
        lobby.players[socket.id] = { id: socket.id, name: name || 'Spieler', pts: 0 };
    }
    socket.emit('STATE', makeState(lobby));
    if (lobby.phase === 'playing') {
      sendCard(socket.id, lobby);
      if (lobby.timerTotal) socket.emit('TIMER', { left: lobby.timerLeft, total: lobby.timerTotal });
      if (lobby.vote) socket.emit('VOTE_START', lobby.vote);
    }
  });

  // UPDATE config
  socket.on('CONFIG', (newCfg) => {
    const lobby = myLobby();
    if (!lobby || lobby.hostId !== socket.id) return;
    lobby.cfg = { ...lobby.cfg, ...newCfg };
    broadcastState(lobby);
  });

  // START round
  socket.on('START', (_, cb) => {
    const lobby = myLobby();
    if (!lobby || lobby.hostId !== socket.id) return;
    const playerList = Object.values(lobby.players);
    if (playerList.length < 1) return cb && cb({ ok: false, err: 'Keine Spieler' });

    const available = ORTE.filter(o => lobby.cfg.activeLocations.includes(o.id));
    if (!available.length) return cb && cb({ ok: false, err: 'Keine Orte aktiviert' });

    const location = available[Math.floor(Math.random() * available.length)];
    const roles = shuffle(location.rollen).slice(0, Math.max(playerList.length - 1, 0));
    const agentIdx = Math.floor(Math.random() * playerList.length);
    const cards = {};
    let ri = 0;
    playerList.forEach((p, i) => {
      cards[p.id] = i === agentIdx
        ? { typ: 'agent', ort: null, ortEmoji: null, rolle: null }
        : { typ: 'spieler', ort: location.name, ortEmoji: location.emoji, rolle: roles[ri++] || 'Gast' };
    });

    lobby.phase = 'playing';
    lobby.roundNr++;
    lobby.cards = cards;
    lobby.location = location;
    lobby.paused = false;
    lobby.vote = null;
    lobby.timerLeft = null;
    lobby.timerTotal = null;
    playerList.forEach(p => { p.crossed = []; });

    playerList.forEach(p => sendCard(p.id, lobby));
    startTimer(lobby);
    broadcastState(lobby);
    if (cb) cb({ ok: true });
  });

  // MARK location
  socket.on('MARK', ({ locId }) => {
    const lobby = myLobby();
    if (!lobby || lobby.phase !== 'playing') return;
    const p = lobby.players[socket.id];
    if (!p) return;
    if (!p.crossed) p.crossed = [];
    const i = p.crossed.indexOf(locId);
    if (i === -1) p.crossed.push(locId);
    else p.crossed.splice(i, 1);
    socket.emit('CROSSED', { crossed: p.crossed });
  });

  // START vote
  socket.on('VOTE_START', ({ accused, thesis }) => {
    const lobby = myLobby();
    if (!lobby || lobby.phase !== 'playing' || lobby.vote) return;
    if (!lobby.players[accused]) return;
    lobby.paused = true;
    const total = Object.keys(lobby.players).length;
    lobby.vote = {
      accuser: socket.id,
      accuserName: lobby.players[socket.id]?.name || '?',
      accused,
      accusedName: lobby.players[accused]?.name || '?',
      thesis: thesis || '',
      votes: { [socket.id]: true },
      total
    };
    io.to(lobby.code).emit('VOTE_START', {
      accuser: socket.id,
      accuserName: lobby.vote.accuserName,
      accused,
      accusedName: lobby.vote.accusedName,
      thesis: lobby.vote.thesis,
      voted: 1,
      total,
      votes: lobby.vote.votes
    });
    broadcastState(lobby);
  });

  // CAST vote
  socket.on('VOTE_CAST', ({ yes }) => {
    const lobby = myLobby();
    if (!lobby || !lobby.vote) return;
    if (lobby.vote.votes[socket.id] !== undefined) return;
    lobby.vote.votes[socket.id] = yes;
    const voted = Object.keys(lobby.vote.votes).length;
    io.to(lobby.code).emit('VOTE_PROGRESS', {
      voted, total: lobby.vote.total, votes: lobby.vote.votes
    });
    if (voted >= lobby.vote.total) resolveVote(lobby);
  });

  // CANCEL vote
  socket.on('VOTE_CANCEL', () => {
    const lobby = myLobby();
    if (!lobby || !lobby.vote) return;
    if (lobby.vote.accuser !== socket.id && lobby.hostId !== socket.id) return;
    lobby.vote = null;
    lobby.paused = false;
    io.to(lobby.code).emit('VOTE_CANCELLED');
    broadcastState(lobby);
  });

  // AGENT GUESS
  socket.on('GUESS', ({ name }) => {
    const lobby = myLobby();
    if (!lobby || lobby.phase !== 'playing') return;
    if (socket.id !== agentId(lobby)) return;
    const correct = name.toLowerCase().trim() === lobby.location.name.toLowerCase().trim();
    if (correct && lobby.cfg.pointsOn) addPoints(lobby, socket.id, 3);
    endRound(lobby, correct ? 'agent_correct' : 'agent_wrong', {
      guess: name,
      agentPts: correct ? 3 : 0
    });
  });

  // DISCONNECT
  socket.on('disconnect', () => {
    const lobby = myLobby();
    if (!lobby) return;
    const name = socket.data.name || 'Jemand';
    delete lobby.players[socket.id];
    if (lobby.hostId === socket.id) {
      const rest = Object.keys(lobby.players);
      if (!rest.length) { stopTimer(lobby); delete lobbies[lobby.code]; return; }
      lobby.hostId = rest[0];
      io.to(rest[0]).emit('MSG', 'Du bist jetzt Host.');
    }
    if (lobby.vote) {
      delete lobby.vote.votes[socket.id];
      lobby.vote.total = Object.keys(lobby.players).length;
      const voted = Object.keys(lobby.vote.votes).length;
      if (lobby.vote.total > 0 && voted >= lobby.vote.total) resolveVote(lobby);
    }
    broadcastState(lobby);
    io.to(lobby.code).emit('MSG', name + ' hat die Lobby verlassen.');
  });
});

app.get('/', (_, res) => res.send('Spion Server v1.0.0'));
app.get('/health', (_, res) => res.json({ ok: true, v: '1.0.0', lobbies: Object.keys(lobbies).length }));

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log('Spion Server v1.0.0 auf Port ' + PORT));
