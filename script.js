let modalCallback = null;
let soundEnabled = true;

function showModal(heading, bodyHTML, buttonText, callback) {
  document.getElementById('modal-heading').textContent = heading;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-btn').textContent = buttonText;
  document.getElementById('event-modal').classList.remove('hidden');
  modalCallback = callback;
}

function onModalContinue() {
  playButtonSound();
  document.getElementById('event-modal').classList.add('hidden');
  if (modalCallback) {
    const cb = modalCallback;
    modalCallback = null;
    cb();
  }
}

function addAnimationClass(el, className) {
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('sound-toggle');
  btn.textContent = soundEnabled ? '🔊' : '🔇';
}

const game = {
  phase: 'menu',
  mode: null,
  tossWinner: null,
  userTossPick: null,
  aiTossPick: null,
  userRole: null,
  aiRole: null,
  innings1: { battingTeam: null, score: 0, wickets: 0, balls: 0, target: null },
  innings2: { battingTeam: null, score: 0, wickets: 0, balls: 0 },
  currentInnings: null,
  config: { wicketsLimit: 1, maxOvers: null, ballsPerOver: 6 },
  result: null,
  lastBall: null,
  ballHistory: [],
  message: '',
};

function showMenu() {
  showScreen('menu');
}

function showModeSelect() {
  playButtonSound();
  showScreen('mode');
}

function showAbout() {
  playButtonSound();
  showScreen('about');
}

function selectMode(mode) {
  playButtonSound();
  game.mode = mode;
  if (mode === 'quick') {
    game.config.wicketsLimit = 1;
    game.config.maxOvers = null;
  } else if (mode === 't20') {
    game.config.wicketsLimit = 10;
    game.config.maxOvers = 20;
  } else if (mode === 'test') {
    game.config.wicketsLimit = 10;
    game.config.maxOvers = null;
  }
  showScreen('toss');
}

function startToss(pick) {
  playButtonSound();
  const choices = ['rock', 'paper', 'scissors'];
  const aiPick = choices[Math.floor(Math.random() * 3)];
  game.userTossPick = pick;
  game.aiTossPick = aiPick;

  const result = determineTossWinner(pick, aiPick);
  game.tossWinner = result;

  const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
  const msg = `${emojis[pick]} You · AI ${emojis[aiPick]}`;

  if (result === 'tie') {
    showModal('🤝 Tie!', `${msg}<br><br>Pick again.`, 'OK', () => {});
    return;
  }

  if (result === 'user') {
    showModal('🎉 You Won the Toss!', msg, 'Choose Bat/Bowl →', () => {
      showScreen('choice');
    });
  } else {
    const aiRole = Math.random() < 0.5 ? 'bat' : 'bowl';
    game.aiRole = aiRole;
    game.userRole = getOppositeRole(aiRole);
    const roleLabel = aiRole === 'bat' ? 'batting' : 'bowling';
    showModal('😤 AI Won the Toss!', `${msg}<br><br>AI chose to go <strong>${roleLabel}</strong> first.`, 'Start Game →', () => {
      initInnings();
      showScreen('play');
      render();
    });
  }
}

function chooseRole(role) {
  playButtonSound();
  game.userRole = role;
  game.aiRole = getOppositeRole(role);
  const roleLabel = role === 'bat' ? 'batting' : 'bowling';
  game.message = `You chose to go ${roleLabel} first.`;
  initInnings();
  showScreen('play');
  render();
}

function initInnings() {
  game.innings1.battingTeam = game.userRole === 'bat' ? 'user' : 'ai';
  game.innings2.battingTeam = game.userRole === 'bowl' ? 'user' : 'ai';
  game.currentInnings = game.innings1;
  game.currentInnings.score = 0;
  game.currentInnings.wickets = 0;
  game.currentInnings.balls = 0;
  game.lastBall = null;
  game.ballHistory = [];
  game.result = null;
  document.getElementById('ball-log-entries').innerHTML = '';
}

function playBall(userPick) {
  if (game.phase !== 'play') return;
  game.message = '';
  playButtonSound();

  const battingTeam = game.currentInnings.battingTeam;
  const isUserBatting = battingTeam === 'user';

  let batterPick, bowlerPick;

  if (isUserBatting) {
    batterPick = userPick;
    bowlerPick = Math.floor(Math.random() * 6) + 1;
  } else {
    batterPick = Math.floor(Math.random() * 6) + 1;
    bowlerPick = userPick;
  }

  const { isOut, runs } = getBallResult(batterPick, bowlerPick);
  game.currentInnings.balls++;

  if (isOut) {
    game.currentInnings.wickets++;
  } else {
    game.currentInnings.score += runs;
  }

  game.lastBall = {
    batter: isUserBatting ? 'user' : 'ai',
    batterPick,
    bowlerPick,
    runs,
    isOut,
  };

  game.ballHistory.push({
    batter: isUserBatting ? 'user' : 'ai',
    batterPick,
    bowlerPick,
    runs,
    isOut,
  });
  if (game.ballHistory.length > 30) game.ballHistory.shift();

  if (soundEnabled) {
    if (isOut) {
      playWicketSound();
    } else if (runs >= 4) {
      playBoundarySound();
    } else if (runs > 0) {
      playRunSound();
    }
  }

  renderBallLog();

  const ballsLimit = game.config.maxOvers !== null ? game.config.maxOvers * game.config.ballsPerOver : null;

  if (game.currentInnings === game.innings1) {
    if (shouldEndInnings(game.currentInnings.wickets, game.config.wicketsLimit, game.currentInnings.balls, ballsLimit)) {
      const label = game.currentInnings.battingTeam === 'user' ? 'Your' : "AI's";
      if (soundEnabled) playChaseSound();
      showModal(
        '🔥 INNINGS OVER!',
        `${label} innings over!<br><br><strong>Score: ${game.currentInnings.score}/${game.currentInnings.wickets}</strong> (${formatOvers(game.currentInnings.balls)} ov)<br><br>🎯 <strong>Target: ${game.currentInnings.score}</strong> runs`,
        'Start Innings 2 →',
        () => {
          endInnings1();
          showScreen('play');
          render();
        }
      );
      return;
    }
  } else {
    if (shouldEndInnings(game.currentInnings.wickets, game.config.wicketsLimit, game.currentInnings.balls, ballsLimit)) {
      game.result = game.currentInnings.battingTeam === 'user' ? 'ai' : 'user';
      const label = game.currentInnings.battingTeam === 'user' ? 'Your' : "AI's";
      const winnerLabel = game.currentInnings.battingTeam === 'user' ? 'AI' : 'You';
      const margin = game.innings1.target - game.currentInnings.score;
      const endedBy = game.currentInnings.wickets >= game.config.wicketsLimit ? 'all out' : 'overs limit';
      if (soundEnabled) playWicketSound();
      showModal(
        '🔥 INNINGS OVER!',
        `${label} innings over (${endedBy})!<br><br><strong>Score: ${game.currentInnings.score}/${game.currentInnings.wickets}</strong> (${formatOvers(game.currentInnings.balls)} ov)<br><br>🎯 Target was <strong>${game.innings1.target}</strong><br>${winnerLabel} won by <strong>${margin}</strong> runs`,
        'See Result →',
        () => {
          endGame();
          renderResult();
        }
      );
      return;
    }
    const chaseResult = getChaseResult(
      game.currentInnings.score,
      game.innings1.target,
      game.currentInnings.wickets,
      game.config.wicketsLimit
    );
    if (chaseResult === 'win') {
      game.result = game.currentInnings.battingTeam;
      const winnerLabel = game.currentInnings.battingTeam === 'user' ? 'You' : 'AI';
      if (soundEnabled) playWinSound();
      showModal(
        '🎉 Chase Complete!',
        `${winnerLabel} chased down <strong>${game.innings1.target}</strong> runs!<br><br>Final: <strong>${game.currentInnings.score}/${game.currentInnings.wickets}</strong> (${formatOvers(game.currentInnings.balls)} ov)`,
        'See Result →',
        () => {
          endGame();
          renderResult();
        }
      );
      return;
    }
    if (chaseResult === 'lose') {
      game.result = game.currentInnings.battingTeam === 'user' ? 'ai' : 'user';
      const loserLabel = game.currentInnings.battingTeam === 'user' ? 'You' : 'AI';
      const winnerLabel = game.currentInnings.battingTeam === 'user' ? 'AI' : 'You';
      const margin = game.innings1.target - game.currentInnings.score;
      if (soundEnabled) playWicketSound();
      showModal(
        '🔥 WICKET!',
        `${loserLabel} are all out!<br><br><strong>Score: ${game.currentInnings.score}/${game.currentInnings.wickets}</strong> (${formatOvers(game.currentInnings.balls)} ov)<br><br>🎯 Target was <strong>${game.innings1.target}</strong><br>${winnerLabel} won by <strong>${margin}</strong> runs`,
        'See Result →',
        () => {
          endGame();
          renderResult();
        }
      );
      return;
    }
  }

  render();
}

function endInnings1() {
  game.innings1.target = game.innings1.score;

  game.currentInnings = game.innings2;
  game.currentInnings.score = 0;
  game.currentInnings.wickets = 0;
  game.currentInnings.balls = 0;
  game.lastBall = null;
  document.getElementById('ball-log-entries').innerHTML = '';
}

function endGame() {
  game.phase = 'result';
  showScreen('result');
  renderResult();
}

function renderBallHistory() {
  const recent = game.ballHistory.slice(-12);
  if (recent.length === 0) return '';
  let html = '<div class="ball-history">';
  recent.forEach(function (b) {
    if (b.isOut) {
      html += '<span class="ball-dot ball-dot-out" title="Wicket">✕</span>';
    } else if (b.runs === 6) {
      html += '<span class="ball-dot ball-dot-six" title="SIX">6</span>';
    } else if (b.runs === 4) {
      html += '<span class="ball-dot ball-dot-four" title="FOUR">4</span>';
    } else {
      html += '<span class="ball-dot ball-dot-run" title="' + b.runs + ' run' + (b.runs > 1 ? 's' : '') + '">' + b.runs + '</span>';
    }
  });
  html += '</div>';
  return html;
}

function renderCommentary() {
  const recent = game.ballHistory.slice(-3).reverse();
  if (recent.length === 0) return '';
  let html = '<div class="commentary">';
  recent.forEach(function (b) {
    const batterLabel = b.batter === 'user' ? 'You' : 'AI';
    const bowlerLabel = b.batter === 'user' ? 'AI' : 'You';
    let text = batterLabel + ' picked ' + b.batterPick + ', ' + bowlerLabel + ' picked ' + b.bowlerPick + ' → ';
    text += b.isOut ? '<strong class="out-text">OUT!</strong>' : '<strong>' + b.runs + ' run' + (b.runs > 1 ? 's' : '') + '</strong>';
    html += '<div class="commentary-line">' + text + '</div>';
  });
  html += '</div>';
  return html;
}

function renderBallLog() {
  const container = document.getElementById('ball-log-entries');
  const ball = game.ballHistory[game.ballHistory.length - 1];
  const ballNum = game.currentInnings.balls;

  const batterLabel = ball.batter === 'user' ? 'You' : 'AI';
  const text = batterLabel + ' → ' + (ball.isOut ? 'Wicket' : ball.runs + ' run' + (ball.runs > 1 ? 's' : ''));

  let dotClass = 'ball-log-run';
  if (ball.isOut) dotClass = 'ball-log-wicket';
  else if (ball.runs === 6) dotClass = 'ball-log-six';
  else if (ball.runs === 4) dotClass = 'ball-log-four';

  const display = ball.isOut ? '✕' : ball.runs;
  const entry = document.createElement('div');
  entry.className = 'ball-log-entry';
  entry.innerHTML = '<span class="ball-log-ball ' + dotClass + '">' + display + '</span><span class="ball-log-text"><strong>#' + ballNum + '</strong> ' + text + '</span>';
  container.appendChild(entry);
  container.scrollTop = container.scrollHeight;
}

function render() {
  if (game.phase !== 'play') return;

  const isInnings1 = game.currentInnings === game.innings1;
  const battingTeam = game.currentInnings.battingTeam;
  const battingLabel = battingTeam === 'user' ? 'You' : 'AI';
  const overs = formatOvers(game.currentInnings.balls);

  let sbHTML = '<div class="score-row">';
  sbHTML += '<span class="score-current"><strong>' + battingLabel + '</strong> ' + game.currentInnings.score + '/' + game.currentInnings.wickets + ' (' + overs + ' ov)</span>';
  if (!isInnings1 && game.innings1.target !== null) {
    sbHTML += '<span class="score-target">Target: ' + game.innings1.target + '</span>';
  }
  sbHTML += '</div>';

  if (!isInnings1) {
    const prevBatting = game.innings1.battingTeam;
    const prevLabel = prevBatting === 'user' ? 'You' : 'AI';
    const prevOvers = formatOvers(game.innings1.balls);
    sbHTML += '<div class="score-previous"><strong>' + prevLabel + '</strong> ' + game.innings1.score + '/' + game.innings1.wickets + ' (' + prevOvers + ' ov)</div>';
  }

  document.getElementById('scoreboard').innerHTML = sbHTML;
  document.getElementById('ball-history-area').innerHTML = renderBallHistory();

  if (!isInnings1 && game.innings1.target !== null) {
    const needed = game.innings1.target - game.currentInnings.score;
    if (needed > 0) {
      document.getElementById('chase-info').innerHTML = '<div class="chase-info">Need <strong>' + needed + '</strong> more run' + (needed > 1 ? 's' : '') + ' to win</div>';
      document.getElementById('chase-info').classList.remove('hidden');
    } else {
      document.getElementById('chase-info').classList.add('hidden');
    }
  } else {
    document.getElementById('chase-info').classList.add('hidden');
  }

  if (game.message) {
    document.getElementById('status').innerHTML = '<div class="status-message">' + game.message + '</div>';
  } else {
    const isUserBatting = battingTeam === 'user';
    const inningsLabel = isInnings1 ? 'Innings 1' : 'Innings 2';
    const actionLabel = isUserBatting ? 'batting' : 'bowling';
    document.getElementById('status').innerHTML = '<div class="status-message">' + inningsLabel + ' — You are ' + actionLabel + '. Pick a number!</div>';
  }

  if (game.lastBall) {
    const lb = game.lastBall;
    const batterLabel = lb.batter === 'user' ? 'You' : 'AI';
    const bowlerLabel = lb.batter === 'user' ? 'AI' : 'You';
    let text = 'Last ball: ' + batterLabel + ' picked ' + lb.batterPick + ', ' + bowlerLabel + ' picked ' + lb.bowlerPick + ' → ';
    text += lb.isOut ? '<strong class="out-text">OUT!</strong>' : '<strong>' + lb.runs + ' runs</strong>';
    document.getElementById('last-ball').innerHTML = text;

    const lastBallEl = document.getElementById('last-ball');
    lastBallEl.classList.remove('flash-runs', 'flash-out', 'flash-four', 'flash-six');
    void lastBallEl.offsetWidth;
    if (lb.isOut) {
      lastBallEl.classList.add('flash-out');
    } else if (lb.runs >= 6) {
      lastBallEl.classList.add('flash-six');
    } else if (lb.runs >= 4) {
      lastBallEl.classList.add('flash-four');
    } else if (lb.runs > 0) {
      lastBallEl.classList.add('flash-runs');
    }
  } else {
    document.getElementById('last-ball').innerHTML = '';
  }

  document.getElementById('commentary-area').innerHTML = renderCommentary();
}

function renderResult() {
  const heading = document.getElementById('result-heading');
  const details = document.getElementById('result-details');

  const userBatFirst = game.innings1.battingTeam === 'user';
  const userInnings = userBatFirst ? game.innings1 : game.innings2;
  const aiInnings = userBatFirst ? game.innings2 : game.innings1;

  details.innerHTML =
    '<div class="result-grid">' +
      '<div class="result-team-card">' +
        '<h3>🏏 You</h3>' +
        '<p class="result-score">' + userInnings.score + '/' + userInnings.wickets + '</p>' +
        '<p class="result-overs">' + formatOvers(userInnings.balls) + ' overs</p>' +
      '</div>' +
      '<div class="result-team-card">' +
        '<h3>🤖 AI</h3>' +
        '<p class="result-score">' + aiInnings.score + '/' + aiInnings.wickets + '</p>' +
        '<p class="result-overs">' + formatOvers(aiInnings.balls) + ' overs</p>' +
      '</div>' +
    '</div>';

  if (game.result === 'user') {
    heading.textContent = '🎉 You Win!';
    if (typeof confetti === 'function') {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  } else if (game.result === 'ai') {
    heading.textContent = '😔 AI Wins!';
  } else {
    heading.textContent = "🤝 It's a Draw!";
  }
}

function showScreen(screen) {
  document.querySelectorAll('.screen').forEach(function (el) { el.classList.add('hidden'); });
  const screenEl = document.getElementById(screen + '-screen');
  if (screenEl) screenEl.classList.remove('hidden');
  game.phase = screen;
}

function resetGame() {
  document.getElementById('event-modal').classList.add('hidden');
  document.getElementById('ball-log-entries').innerHTML = '';
  game.mode = null;
  game.tossWinner = null;
  game.userTossPick = null;
  game.aiTossPick = null;
  game.userRole = null;
  game.aiRole = null;
  game.innings1 = { battingTeam: null, score: 0, wickets: 0, balls: 0, target: null };
  game.innings2 = { battingTeam: null, score: 0, wickets: 0, balls: 0 };
  game.currentInnings = null;
  game.config = { wicketsLimit: 1, maxOvers: null, ballsPerOver: 6 };
  game.result = null;
  game.lastBall = null;
  game.ballHistory = [];
  game.message = '';
  document.getElementById('toss-result').innerHTML = '';
  showScreen('menu');
}

showScreen('menu');
