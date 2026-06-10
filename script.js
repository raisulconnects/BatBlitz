let modalCallback = null;

function showModal(heading, bodyHTML, buttonText, callback) {
  document.getElementById('modal-heading').textContent = heading;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-btn').textContent = buttonText;
  document.getElementById('event-modal').classList.remove('hidden');
  modalCallback = callback;
}

function onModalContinue() {
  document.getElementById('event-modal').classList.add('hidden');
  if (modalCallback) {
    const cb = modalCallback;
    modalCallback = null;
    cb();
  }
}

const game = {
  phase: 'toss',
  tossWinner: null,
  userTossPick: null,
  aiTossPick: null,
  userRole: null,
  aiRole: null,
  innings1: { battingTeam: null, score: 0, wickets: 0, balls: 0, target: null },
  innings2: { battingTeam: null, score: 0, wickets: 0, balls: 0 },
  currentInnings: null,
  config: { wicketsLimit: 1, ballsPerOver: 6 },
  result: null,
  lastBall: null,
  message: '',
};

function startToss(pick) {
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
  game.result = null;
}

function playBall(userPick) {
  if (game.phase !== 'play') return;
  game.message = '';

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

  if (game.currentInnings === game.innings1) {
    if (shouldEndInnings(game.currentInnings.wickets, game.config.wicketsLimit)) {
      const label = game.currentInnings.battingTeam === 'user' ? 'Your' : "AI's";
      showModal(
        '🔥 WICKET!',
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
    const chaseResult = getChaseResult(
      game.currentInnings.score,
      game.innings1.target,
      game.currentInnings.wickets,
      game.config.wicketsLimit
    );
    if (chaseResult === 'win') {
      game.result = game.currentInnings.battingTeam;
      const winnerLabel = game.currentInnings.battingTeam === 'user' ? 'You' : 'AI';
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
}

function endGame() {
  game.phase = 'result';
  showScreen('result');
  renderResult();
}

function render() {
  if (game.phase !== 'play') return;

  const isInnings1 = game.currentInnings === game.innings1;
  const battingTeam = game.currentInnings.battingTeam;
  const battingLabel = battingTeam === 'user' ? 'You' : 'AI';
  const overs = formatOvers(game.currentInnings.balls);

  let sbHTML = `<div class="score-row">`;
  sbHTML += `<span class="score-current"><strong>${battingLabel}</strong> ${game.currentInnings.score}/${game.currentInnings.wickets} (${overs} ov)</span>`;
  if (!isInnings1 && game.innings1.target !== null) {
    sbHTML += `<span class="score-target">Target: ${game.innings1.target}</span>`;
  }
  sbHTML += `</div>`;

  if (!isInnings1) {
    const prevBatting = game.innings1.battingTeam;
    const prevLabel = prevBatting === 'user' ? 'You' : 'AI';
    const prevOvers = formatOvers(game.innings1.balls);
    sbHTML += `<div class="score-previous"><strong>${prevLabel}</strong> ${game.innings1.score}/${game.innings1.wickets} (${prevOvers} ov)</div>`;
  }

  document.getElementById('scoreboard').innerHTML = sbHTML;

  if (game.message) {
    document.getElementById('status').innerHTML = `<div class="status-message">${game.message}</div>`;
  } else {
    const isUserBatting = battingTeam === 'user';
    const inningsLabel = isInnings1 ? 'Innings 1' : 'Innings 2';
    const actionLabel = isUserBatting ? 'batting' : 'bowling';
    document.getElementById('status').innerHTML = `<div class="status-message">${inningsLabel} — You are ${actionLabel}. Pick a number!</div>`;
  }

  if (game.lastBall) {
    const lb = game.lastBall;
    const batterLabel = lb.batter === 'user' ? 'You' : 'AI';
    const bowlerLabel = lb.batter === 'user' ? 'AI' : 'You';
    let text = `Last ball: ${batterLabel} picked ${lb.batterPick}, ${bowlerLabel} picked ${lb.bowlerPick} → `;
    text += lb.isOut ? `<strong class="out-text">OUT!</strong>` : `<strong>${lb.runs} runs</strong>`;
    document.getElementById('last-ball').innerHTML = text;
  } else {
    document.getElementById('last-ball').innerHTML = '';
  }
}

function renderResult() {
  const heading = document.getElementById('result-heading');
  const details = document.getElementById('result-details');

  const userBatFirst = game.innings1.battingTeam === 'user';
  const userInnings = userBatFirst ? game.innings1 : game.innings2;
  const aiInnings = userBatFirst ? game.innings2 : game.innings1;

  details.innerHTML = `
    <div class="result-grid">
      <div class="result-team-card">
        <h3>🏏 You</h3>
        <p class="result-score">${userInnings.score}/${userInnings.wickets}</p>
        <p class="result-overs">${formatOvers(userInnings.balls)} overs</p>
      </div>
      <div class="result-team-card">
        <h3>🤖 AI</h3>
        <p class="result-score">${aiInnings.score}/${aiInnings.wickets}</p>
        <p class="result-overs">${formatOvers(aiInnings.balls)} overs</p>
      </div>
    </div>
  `;

  if (game.result === 'user') {
    heading.textContent = '🎉 You Win!';
  } else if (game.result === 'ai') {
    heading.textContent = '😔 AI Wins!';
  } else {
    heading.textContent = "🤝 It's a Draw!";
  }
}

function showScreen(screen) {
  document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
  const screenEl = document.getElementById(screen + '-screen');
  if (screenEl) screenEl.classList.remove('hidden');
  game.phase = screen;
}

function resetGame() {
  document.getElementById('event-modal').classList.add('hidden');
  game.tossWinner = null;
  game.userTossPick = null;
  game.aiTossPick = null;
  game.userRole = null;
  game.aiRole = null;
  game.innings1 = { battingTeam: null, score: 0, wickets: 0, balls: 0, target: null };
  game.innings2 = { battingTeam: null, score: 0, wickets: 0, balls: 0 };
  game.currentInnings = null;
  game.result = null;
  game.lastBall = null;
  game.message = '';
  document.getElementById('toss-result').innerHTML = '';
  showScreen('toss');
}

showScreen('toss');
