let modalCallback = null;
let modalCancelCallback = null;
let soundEnabled = true;
let currentScreen = null;
let gsapReady = false;
var uiSettings = {
  ballLogVisible: true,
  commentaryVisible: true
};

function loadUiSettings() {
  if (typeof localStorage !== 'undefined') {
    try {
      var bl = localStorage.getItem('batblitz-balllog');
      if (bl !== null) uiSettings.ballLogVisible = bl === 'true';
      var co = localStorage.getItem('batblitz-commentary');
      if (co !== null) uiSettings.commentaryVisible = co === 'true';
    } catch (e) {}
  }
}

function saveBallLogSetting(val) {
  if (typeof localStorage !== 'undefined') {
    try { localStorage.setItem('batblitz-balllog', val); } catch (e) {}
  }
}

function saveCommentarySetting(val) {
  if (typeof localStorage !== 'undefined') {
    try { localStorage.setItem('batblitz-commentary', val); } catch (e) {}
  }
}

function applyToggleStates() {
  var entries = document.getElementById('ball-log-entries');
  if (entries) {
    if (uiSettings.ballLogVisible) {
      entries.classList.remove('collapsed');
    } else {
      entries.classList.add('collapsed');
    }
  }

  var toggleIcon = document.getElementById('toggle-commentary-icon');
  var commentaryArea = document.getElementById('commentary-area');
  if (toggleIcon) {
    if (uiSettings.commentaryVisible) {
      toggleIcon.classList.remove('collapsed');
    } else {
      toggleIcon.classList.add('collapsed');
    }
  }
  if (commentaryArea) {
    if (uiSettings.commentaryVisible) {
      commentaryArea.classList.remove('collapsed');
    } else {
      commentaryArea.classList.add('collapsed');
    }
  }
}

function toggleBallLog() {
  var entries = document.getElementById('ball-log-entries');
  if (!entries) return;
  uiSettings.ballLogVisible = !uiSettings.ballLogVisible;
  if (uiSettings.ballLogVisible) {
    entries.classList.remove('collapsed');
  } else {
    entries.classList.add('collapsed');
  }
  saveBallLogSetting(uiSettings.ballLogVisible);
  if (typeof playButtonSound === 'function') playButtonSound();
  return uiSettings.ballLogVisible;
}

function toggleCommentary() {
  var commentaryArea = document.getElementById('commentary-area');
  var toggleIcon = document.getElementById('toggle-commentary-icon');
  var rows = document.querySelectorAll('.commentary-entry-row, .commentary-line');
  if (!commentaryArea) return;
  uiSettings.commentaryVisible = !uiSettings.commentaryVisible;
  if (uiSettings.commentaryVisible) {
    commentaryArea.classList.remove('collapsed');
    if (toggleIcon) toggleIcon.classList.remove('collapsed');
  } else {
    commentaryArea.classList.add('collapsed');
    if (toggleIcon) toggleIcon.classList.add('collapsed');
  }
  saveCommentarySetting(uiSettings.commentaryVisible);
  if (typeof playButtonSound === 'function') playButtonSound();
  return uiSettings.commentaryVisible;
}

function getBallLogVisible() { return uiSettings.ballLogVisible; }
function getCommentaryVisible() { return uiSettings.commentaryVisible; }

function checkGsap() {
  gsapReady = typeof gsap !== 'undefined';
}

function getSavedSoundPreference() {
  try {
    var val = localStorage.getItem('batblitz-sound');
    return val === null ? true : val === 'true';
  } catch (e) {
    return true;
  }
}

function setSavedSoundPreference(val) {
  try {
    localStorage.setItem('batblitz-sound', val ? 'true' : 'false');
  } catch (e) {
  }
}

function getRunFromKey(event) {
  if (!event || !event.key || typeof event.key !== 'string') return null;
  var key = event.key;
  if (key.length !== 1) return null;
  if (key >= '1' && key <= '6') return parseInt(key, 10);
  return null;
}

function isPlayBlocked(phase) {
  return phase !== 'play';
}

function playClickSound() {
  if (soundEnabled) playButtonSound();
}

soundEnabled = getSavedSoundPreference();

function showModal(heading, bodyHTML, buttonText, callback, cancelText, cancelCallback) {
  document.getElementById('modal-heading').textContent = heading;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  var confirmBtn = document.getElementById('modal-btn');
  var cancelBtn = document.getElementById('modal-btn-cancel');
  confirmBtn.textContent = buttonText;
  confirmBtn.style.display = '';
  confirmBtn.style.opacity = '1';
  confirmBtn.style.borderColor = '';
  confirmBtn.style.color = '';
  if (cancelText && cancelBtn) {
    cancelBtn.textContent = cancelText;
    cancelBtn.classList.remove('hidden');
    modalCancelCallback = cancelCallback || null;
  } else if (cancelBtn) {
    cancelBtn.classList.add('hidden');
    modalCancelCallback = null;
  }
  document.getElementById('event-modal').classList.remove('hidden');
  if (gsapReady) {
    gsap.fromTo('.modal-content', { y: -50, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.7)' });
  }
  modalCallback = callback;
  updateBallButtons();
}

function showModalAfterDelay(heading, bodyHTML, buttonText, callback, delay, cancelText, cancelCallback) {
  document.getElementById('event-modal').classList.remove('hidden');
  document.getElementById('modal-heading').textContent = heading;
  document.getElementById('modal-body').innerHTML = '<div class="thinking-text">' + heading + '</div>';
  var confirmBtn = document.getElementById('modal-btn');
  var cancelBtn = document.getElementById('modal-btn-cancel');
  confirmBtn.textContent = '...';
  confirmBtn.style.opacity = '0.4';
  if (cancelBtn) cancelBtn.classList.add('hidden');
  if (gsapReady) {
    gsap.fromTo('.modal-content', { y: -50, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.7)' });
  }
  var d = delay || 400;
  setTimeout(function () {
    document.getElementById('modal-heading').textContent = heading;
    document.getElementById('modal-body').innerHTML = bodyHTML;
    confirmBtn.textContent = buttonText;
    confirmBtn.style.opacity = '1';
    if (cancelText && cancelBtn) {
      cancelBtn.textContent = cancelText;
      cancelBtn.classList.remove('hidden');
      modalCancelCallback = cancelCallback || null;
    }
    modalCallback = callback;
  }, d);
  updateBallButtons();
}

function onModalContinue() {
  playClickSound();
  document.getElementById('event-modal').classList.add('hidden');
  if (modalCallback) {
    const cb = modalCallback;
    modalCallback = null;
    cb();
  }
  modalCancelCallback = null;
  updateBallButtons();
}

function onModalCancel() {
  playClickSound();
  document.getElementById('event-modal').classList.add('hidden');
  if (modalCancelCallback) {
    const cb = modalCancelCallback;
    modalCancelCallback = null;
    cb();
  }
  modalCallback = null;
  updateBallButtons();
}

function addAnimationClass(el, className) {
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

function screenShake() {
  const app = document.getElementById('app');
  app.classList.remove('screen-shake');
  void app.offsetWidth;
  if (gsapReady) {
    gsap.to(app, { x: '+=6', repeat: 5, yoyo: true, duration: 0.04, ease: 'power2.inOut', onComplete: function () { gsap.set(app, { x: 0 }); } });
  } else {
    app.classList.add('screen-shake');
  }
}

function triggerCentury() {
  var overlay = document.getElementById('milestone-overlay');
  var textEl = document.getElementById('milestone-text');
  if (!overlay || !textEl) return;
  textEl.textContent = '🎯 CENTURY!';
  textEl.className = 'milestone-text century-text';
  overlay.className = 'milestone-overlay';
  overlay.style.background = 'radial-gradient(circle at center, rgba(255,215,0,0.4) 0%, rgba(255,215,0,0.12) 30%, transparent 70%)';
  if (soundEnabled && typeof playSixSound === 'function') playSixSound();
  overlay.classList.remove('hidden');
  if (gsapReady) {
    gsap.fromTo(overlay, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' });
    gsap.fromTo(textEl, { opacity: 0, scale: 0.3, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, delay: 0.15, ease: 'back.out(2.5)' });
    gsap.to('#app', { x: '+=8', repeat: 7, yoyo: true, duration: 0.04, ease: 'power2.inOut' });
  }
  triggerParticles('century');
  setTimeout(function () {
    overlay.classList.add('hidden');
    if (gsapReady) gsap.set(overlay, { clearProps: 'all' });
  }, 2200);
}

function triggerHalfCentury() {
  var overlay = document.getElementById('milestone-overlay');
  var textEl = document.getElementById('milestone-text');
  if (!overlay || !textEl) return;
  textEl.textContent = '🎯 FIFTY!';
  textEl.className = 'milestone-text fifty-text';
  overlay.className = 'milestone-overlay';
  overlay.style.background = 'radial-gradient(circle at center, rgba(100,200,255,0.3) 0%, rgba(100,200,255,0.08) 30%, transparent 70%)';
  if (soundEnabled && typeof playBoundarySound === 'function') playBoundarySound();
  overlay.classList.remove('hidden');
  if (gsapReady) {
    gsap.fromTo(overlay, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' });
    gsap.fromTo(textEl, { opacity: 0, scale: 0.4, y: 15 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, delay: 0.1, ease: 'back.out(2)' });
    gsap.to('#app', { x: '+=5', repeat: 5, yoyo: true, duration: 0.04, ease: 'power2.inOut' });
  }
  triggerParticles('fifty');
  setTimeout(function () {
    overlay.classList.add('hidden');
    if (gsapReady) gsap.set(overlay, { clearProps: 'all' });
  }, 2000);
}

function triggerWicketGlow() {
  var sb = document.getElementById('scoreboard');
  if (!sb) return;
  sb.classList.remove('wicket-glow');
  void sb.offsetWidth;
  sb.classList.add('wicket-glow');
  setTimeout(function () {
    sb.classList.remove('wicket-glow');
  }, 800);
}

function triggerParticles(type) {
  if (typeof confetti !== 'function') return;
  if (type === 'six') {
    confetti({ particleCount: 30, spread: 90, origin: { y: 0.5 }, colors: ['#ffd700', '#ffea00', '#ffffff'] });
    setTimeout(function () { confetti({ particleCount: 15, spread: 60, origin: { y: 0.5 }, colors: ['#ffd700'] }); }, 100);
  } else if (type === 'four') {
    confetti({ particleCount: 15, spread: 60, origin: { y: 0.5 }, colors: ['#0288d1', '#03a9f4', '#ffffff'] });
  } else if (type === 'wicket') {
    confetti({ particleCount: 20, spread: 45, origin: { y: 0.5 }, colors: ['#d32f2f', '#ff5252'] });
  } else if (type === 'win') {
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.5, x: 0.5 }, colors: ['#39ff14', '#ffd700', '#ff6b6b', '#0288d1'] });
    setTimeout(function () {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.3 }, colors: ['#ffd700', '#ffffff'] });
    }, 250);
  } else if (type === 'century') {
    confetti({ particleCount: 80, spread: 120, origin: { y: 0.4 }, colors: ['#ffd700', '#ffea00', '#ffffff'] });
    setTimeout(function () { confetti({ particleCount: 40, spread: 90, origin: { y: 0.5 }, colors: ['#ffd700', '#ffaa00'] }); }, 200);
    setTimeout(function () { confetti({ particleCount: 20, spread: 60, origin: { y: 0.6 }, colors: ['#ffffff'] }); }, 400);
  } else if (type === 'fifty') {
    confetti({ particleCount: 40, spread: 90, origin: { y: 0.5 }, colors: ['#64c8ff', '#03a9f4', '#ffffff'] });
    setTimeout(function () { confetti({ particleCount: 20, spread: 60, origin: { y: 0.5 }, colors: ['#64c8ff', '#b3e5fc'] }); }, 200);
  }
}

function animateButton(btn) {
  if (gsapReady) {
    gsap.fromTo(btn, { scale: 1 }, { scale: 0.92, duration: 0.08, yoyo: true, ease: 'power2.inOut' });
  }
}

function animateScoreChange(element, newText) {
  if (gsapReady) {
    gsap.fromTo(element, { opacity: 0.3, y: -4 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' });
  }
}

function animateBallLogEntry(entry) {
  if (gsapReady) {
    gsap.fromTo(entry, { opacity: 0, x: -15, scale: 0.95 }, { opacity: 1, x: 0, scale: 1, duration: 0.25, ease: 'power2.out' });
  }
}

function updateBallButtons() {
  var isPlayPhase = game.phase === 'play';
  var modalHidden = document.getElementById('event-modal').classList.contains('hidden');
  var enabled = isPlayPhase && modalHidden && game.currentInnings !== null;
  var btns = document.querySelectorAll('.ball-btn');
  for (var i = 0; i < btns.length; i++) {
    if (enabled) {
      btns[i].classList.remove('disabled');
    } else {
      btns[i].classList.add('disabled');
    }
  }
}

function handleKeyDown(event) {
  if (getRunFromKey(event) !== null) {
    var run = getRunFromKey(event);
    var modalHidden = document.getElementById('event-modal').classList.contains('hidden');
    if (game.phase === 'play' && modalHidden && game.currentInnings) {
      event.preventDefault();
      playBall(run);
    }
  }
  if (event.key === 'Escape') {
    if (!document.getElementById('event-modal').classList.contains('hidden')) {
      event.preventDefault();
      onModalContinue();
    }
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('sound-toggle');
  btn.textContent = soundEnabled ? '🔊' : '🔇';
  setSavedSoundPreference(soundEnabled);
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
  milestones: { fifty: false, hundred: false },
};

function showMenu() {
  showScreen('menu', 'left');
}

function showModeSelect() {
  playButtonSound();
  showScreen('mode', 'left');
}

function showAbout() {
  playButtonSound();
  showScreen('about', 'left');
}

function showChangelog() {
  playButtonSound();
  showModal('📋 CHANGELOG', '<div class="changelog-content"><p class="changelog-loading">Loading...</p></div>', 'CLOSE');
  fetch('changelog.json?' + Date.now()).then(function (r) {
    if (!r.ok) throw new Error('Failed to load changelog');
    return r.json();
  }).then(function (data) {
    var html = '<div class="changelog-content">';
    for (var i = 0; i < data.length; i++) {
      var ver = data[i];
      html += '<div class="changelog-entry"><h3>v' + ver.version + '</h3><ul>';
      for (var j = 0; j < ver.entries.length; j++) {
        html += '<li>' + ver.entries[j] + '</li>';
      }
      html += '</ul></div>';
    }
    html += '</div>';
    document.getElementById('modal-body').innerHTML = html;
  }).catch(function () {
    document.getElementById('modal-body').innerHTML = '<div class="changelog-content"><p class="changelog-loading">Failed to load changelog.</p></div>';
  });
}

function showMultiplayerComingSoon() {
  playButtonSound();
  showModal(
    '👥 MULTIPLAYER',
    '<div class="coming-soon-content">' +
      '<div class="coming-soon-icon">🚧</div>' +
      '<p class="coming-soon-text">We\'re working on bringing multiplayer to BatBlitz!</p>' +
      '<p class="coming-soon-sub">Play against your friends in real-time matches. Stay tuned for updates.</p>' +
    '</div>',
    'GOT IT'
  );
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
  document.getElementById('menu-mode-label').textContent = mode.toUpperCase() + ' MATCH';
  showScreen('toss', 'left');
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
  const msg = emojis[pick] + ' You · AI ' + emojis[aiPick];

  if (result === 'tie') {
    showModal('⟳ TIE!', '<div class="toss-loader"><div class="toss-spinner"></div><div class="toss-loader-text">Redoing toss...</div></div>', '', function () {});
    var tieBtn = document.getElementById('modal-btn');
    var tieCancel = document.getElementById('modal-btn-cancel');
    tieBtn.style.display = 'none';
    if (tieCancel) tieCancel.classList.add('hidden');
    var self = this;
    setTimeout(function () {
      onModalContinue();
      var newAiPick, newResult;
      do {
        newAiPick = choices[Math.floor(Math.random() * 3)];
        newResult = determineTossWinner(pick, newAiPick);
      } while (newResult === 'tie');
      game.aiTossPick = newAiPick;
      game.tossWinner = newResult;
      var newMsg = emojis[pick] + ' You · AI ' + emojis[newAiPick];
      if (soundEnabled) playTossRevealSound();
      if (newResult === 'user') {
        showModal('🎉 YOU WIN!', newMsg, 'CHOOSE', function () {
          showScreen('choice', 'left');
        });
      } else {
        var aiRole = Math.random() < 0.5 ? 'bat' : 'bowl';
        game.aiRole = aiRole;
        game.userRole = getOppositeRole(aiRole);
        var roleLabel = aiRole === 'bat' ? 'BATTING' : 'BOWLING';
        showModal('🤖 AI WINS', newMsg + '<br><br>AI chose <strong>' + roleLabel + '</strong> first.', 'PLAY →', function () {
          initInnings();
          showScreen('play', 'left');
          render();
        });
      }
    }, 2000);
    return;
  }

  if (soundEnabled) playTossRevealSound();

  if (result === 'user') {
    showModal('🎉 YOU WIN!', msg, 'CHOOSE', function () {
      showScreen('choice', 'left');
    });
  } else {
    var aiRole = Math.random() < 0.5 ? 'bat' : 'bowl';
    game.aiRole = aiRole;
    game.userRole = getOppositeRole(aiRole);
    var roleLabel = aiRole === 'bat' ? 'BATTING' : 'BOWLING';
    showModal('🤖 AI WINS', msg + '<br><br>AI chose <strong>' + roleLabel + '</strong> first.', 'PLAY →', function () {
      initInnings();
      showScreen('play', 'left');
      render();
    });
  }
}

function chooseRole(role) {
  playButtonSound();
  game.userRole = role;
  game.aiRole = getOppositeRole(role);
  var roleLabel = role === 'bat' ? 'BATTING' : 'BOWLING';
  game.message = 'You chose ' + roleLabel + ' first.';
  initInnings();
  showScreen('play', 'left');
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
  game.milestones = { fifty: false, hundred: false };
  game.result = null;
  document.getElementById('ball-log-entries').innerHTML = '<div class="ball-log-empty">No balls bowled yet</div>';
  document.getElementById('commentary-area').innerHTML = '<div class="commentary-empty">Commentary will appear here</div>';
}

function playBall(userPick) {
  if (game.phase !== 'play') return;
  game.message = '';
  playButtonSound();

  var btn = document.querySelector('.ball-btn[data-run="' + userPick + '"]');
  if (btn) animateButton(btn);

  var battingTeam = game.currentInnings.battingTeam;
  var isUserBatting = battingTeam === 'user';

  var batterPick, bowlerPick;

  if (isUserBatting) {
    batterPick = userPick;
    bowlerPick = Math.floor(Math.random() * 6) + 1;
  } else {
    batterPick = Math.floor(Math.random() * 6) + 1;
    bowlerPick = userPick;
  }

  var result = getBallResult(batterPick, bowlerPick);
  game.currentInnings.balls++;

  if (result.isOut) {
    game.currentInnings.wickets++;
    triggerWicketGlow();
  } else {
    game.currentInnings.score += result.runs;
    if (!game.milestones.fifty && game.currentInnings.score >= 50) {
      game.milestones.fifty = true;
      triggerHalfCentury();
    }
    if (!game.milestones.hundred && game.currentInnings.score >= 100) {
      game.milestones.hundred = true;
      triggerCentury();
    }
  }

  game.lastBall = {
    batter: isUserBatting ? 'user' : 'ai',
    batterPick: batterPick,
    bowlerPick: bowlerPick,
    runs: result.runs,
    isOut: result.isOut,
  };

  game.ballHistory.push({
    batter: isUserBatting ? 'user' : 'ai',
    batterPick: batterPick,
    bowlerPick: bowlerPick,
    runs: result.runs,
    isOut: result.isOut,
  });
  if (game.ballHistory.length > 30) game.ballHistory.shift();

  if (soundEnabled) {
    if (result.isOut) {
      playWicketSound();
    } else if (result.runs >= 6) {
      playSixSound();
    } else if (result.runs >= 4) {
      playBoundarySound();
    } else if (result.runs > 0) {
      playRunSound();
    }
  }

  if (result.runs >= 6) {
    triggerParticles('six');
  } else if (result.runs >= 4) {
    triggerParticles('four');
  } else if (result.isOut) {
    triggerParticles('wicket');
  }

  if (result.isOut) {
    screenShake();
  }

  renderBallLog();

  var ballsLimit = game.config.maxOvers !== null ? game.config.maxOvers * game.config.ballsPerOver : null;

  if (game.currentInnings === game.innings1) {
    if (shouldEndInnings(game.currentInnings.wickets, game.config.wicketsLimit, game.currentInnings.balls, ballsLimit)) {
      var label = game.currentInnings.battingTeam === 'user' ? 'YOUR' : "AI'S";
      if (soundEnabled) playChaseSound();
      showModal(
        '🔥 INNINGS OVER',
        label + ' innings over!<br><br><strong>' + game.currentInnings.score + '/' + game.currentInnings.wickets + '</strong> (' + formatOvers(game.currentInnings.balls) + ' ov)<br><br>🎯 Target: <strong>' + game.currentInnings.score + '</strong>',
        'INNINGS 2 →',
        function () {
          endInnings1();
          showScreen('play', 'left');
          render();
        }
      );
      return;
    }
  } else {
    if (shouldEndInnings(game.currentInnings.wickets, game.config.wicketsLimit, game.currentInnings.balls, ballsLimit)) {
      game.result = game.currentInnings.battingTeam === 'user' ? 'ai' : 'user';
      var label2 = game.currentInnings.battingTeam === 'user' ? 'YOUR' : "AI'S";
      var winnerLabel = game.currentInnings.battingTeam === 'user' ? 'AI' : 'You';
      var margin = game.innings1.target - game.currentInnings.score;
      var endedBy = game.currentInnings.wickets >= game.config.wicketsLimit ? 'ALL OUT' : 'OVERS LIMIT';
      if (soundEnabled) playWicketSound();
      showModal(
        '🔥 INNINGS OVER (' + endedBy + ')',
        label2 + ' innings over!<br><br><strong>' + game.currentInnings.score + '/' + game.currentInnings.wickets + '</strong> (' + formatOvers(game.currentInnings.balls) + ' ov)<br><br>🎯 Target was <strong>' + game.innings1.target + '</strong><br>' + winnerLabel + ' won by <strong>' + margin + '</strong>',
        'RESULT →',
        function () {
          endGame();
          renderResult();
        }
      );
      return;
    }
    var chaseResult = getChaseResult(
      game.currentInnings.score,
      game.innings1.target,
      game.currentInnings.wickets,
      game.config.wicketsLimit
    );
    if (chaseResult === 'win') {
      game.result = game.currentInnings.battingTeam;
      var winnerLabel2 = game.currentInnings.battingTeam === 'user' ? 'You' : 'AI';
      if (soundEnabled) playWinSound();
      showModal(
        '🎉 CHASE COMPLETE!',
        winnerLabel2 + ' chased down <strong>' + game.innings1.target + '</strong> runs!<br><br>Final: <strong>' + game.currentInnings.score + '/' + game.currentInnings.wickets + '</strong> (' + formatOvers(game.currentInnings.balls) + ' ov)',
        'RESULT →',
        function () {
          endGame();
          renderResult();
        }
      );
      return;
    }
    if (chaseResult === 'lose') {
      game.result = game.currentInnings.battingTeam === 'user' ? 'ai' : 'user';
      var loserLabel = game.currentInnings.battingTeam === 'user' ? 'Your' : "AI's";
      var winnerLabel3 = game.currentInnings.battingTeam === 'user' ? 'AI' : 'You';
      var margin2 = game.innings1.target - game.currentInnings.score;
      if (soundEnabled) playWicketSound();
      showModal(
        '🔥 ALL OUT!',
        loserLabel + ' team all out!<br><br><strong>' + game.currentInnings.score + '/' + game.currentInnings.wickets + '</strong> (' + formatOvers(game.currentInnings.balls) + ' ov)<br><br>🎯 Target was <strong>' + game.innings1.target + '</strong><br>' + winnerLabel3 + ' won by <strong>' + margin2 + '</strong>',
        'RESULT →',
        function () {
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
  document.getElementById('ball-log-entries').innerHTML = '<div class="ball-log-empty">No balls bowled yet</div>';
  document.getElementById('commentary-area').innerHTML = '<div class="commentary-empty">Commentary will appear here</div>';
}

function endGame() {
  game.phase = 'result';
  showScreen('result', 'left');
  renderResult();
}

function confirmExit() {
  if (soundEnabled) playButtonSound();
  showModal(
    '✕ EXIT MATCH?',
    'Are you sure you want to quit?<br><br>All progress will be lost.',
    'YES, EXIT',
    function () {
      resetGame();
    },
    'CANCEL'
  );
  document.getElementById('modal-btn').style.borderColor = 'rgba(255,51,51,0.4)';
  document.getElementById('modal-btn').style.color = '#ff5555';
}

function playAgain() {
  playClickSound();
  if (!game.mode) {
    showScreen('menu', 'right');
    return;
  }
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
  game.ballHistory = [];
  game.message = '';
  document.getElementById('ball-log-entries').innerHTML = '<div class="ball-log-empty">No balls bowled yet</div>';
  document.getElementById('toss-result').innerHTML = '';
  showScreen('toss', 'left');
}

function renderCommentary() {
  var recent = game.ballHistory.slice(-3).reverse();
  if (recent.length === 0) return '';
  var html = '<div class="commentary">';
  for (var i = 0; i < recent.length; i++) {
    var b = recent[i];
    var batterLabel = b.batter === 'user' ? 'You' : 'AI';
    var bowlerLabel = b.batter === 'user' ? 'AI' : 'You';
    var text = batterLabel + ' picked ' + b.batterPick + ', ' + bowlerLabel + ' picked ' + b.bowlerPick + ' → ';
    text += b.isOut ? '<strong class="out-text">OUT!</strong>' : '<strong>' + b.runs + ' run' + (b.runs > 1 ? 's' : '') + '</strong>';
    html += '<div class="commentary-line">' + text + '</div>';
  }
  html += '</div>';
  return html;
}

function renderBallLog() {
  var container = document.getElementById('ball-log-entries');
  var emptyMsg = container.querySelector('.ball-log-empty');
  if (emptyMsg) container.removeChild(emptyMsg);
  var ball = game.ballHistory[game.ballHistory.length - 1];
  if (!ball) return;
  var ballNum = game.currentInnings.balls;

  var batterLabel = ball.batter === 'user' ? 'You' : 'AI';
  var text = batterLabel + ' → ' + (ball.isOut ? 'Wicket' : ball.runs + ' run' + (ball.runs > 1 ? 's' : ''));

  var dotClass = 'ball-log-run';
  if (ball.isOut) dotClass = 'ball-log-wicket';
  else if (ball.runs === 6) dotClass = 'ball-log-six';
  else if (ball.runs === 4) dotClass = 'ball-log-four';

  var display = ball.isOut ? '✕' : ball.runs;
  var entry = document.createElement('div');
  entry.className = 'ball-log-entry';
  entry.innerHTML = '<span class="ball-log-ball ' + dotClass + '">' + display + '</span><span class="ball-log-text">#' + ballNum + ' ' + text + '</span>';
  container.appendChild(entry);
  animateBallLogEntry(entry);
  container.scrollTop = container.scrollHeight;
}

function render() {
  if (game.phase !== 'play') return;

  var isInnings1 = game.currentInnings === game.innings1;
  var battingTeam = game.currentInnings.battingTeam;
  var battingLabel = battingTeam === 'user' ? 'You' : 'AI';
  var overs = formatOvers(game.currentInnings.balls);

  var sbHTML = '<div class="score-row">';
  sbHTML += '<span class="score-current"><strong>' + battingLabel + '</strong> ' + game.currentInnings.score + '/' + game.currentInnings.wickets + ' (' + overs + ' ov)</span>';
  if (!isInnings1 && game.innings1.target !== null) {
    sbHTML += '<span class="score-target">🎯 ' + game.innings1.target + '</span>';
  }
  sbHTML += '</div>';

  if (!isInnings1) {
    var prevBatting = game.innings1.battingTeam;
    var prevLabel = prevBatting === 'user' ? 'You' : 'AI';
    var prevOvers = formatOvers(game.innings1.balls);
    sbHTML += '<div class="score-previous"><strong>' + prevLabel + '</strong> ' + game.innings1.score + '/' + game.innings1.wickets + ' (' + prevOvers + ' ov)</div>';
  }

  var scoreboard = document.getElementById('scoreboard');
  scoreboard.innerHTML = sbHTML;
  animateScoreChange(scoreboard, sbHTML);

  if (!isInnings1 && game.innings1.target !== null) {
    var needed = game.innings1.target - game.currentInnings.score;
    if (needed > 0) {
      document.getElementById('chase-info').innerHTML = 'NEED <strong>' + needed + '</strong> MORE RUN' + (needed > 1 ? 'S' : '') + ' TO WIN';
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
    var isUserBatting = battingTeam === 'user';
    var inningsLabel = isInnings1 ? 'INNINGS 1' : 'INNINGS 2';
    var actionLabel = isUserBatting ? 'BATTING' : 'BOWLING';
    document.getElementById('status').innerHTML = '<div class="status-message">' + inningsLabel + ' — YOU ARE ' + actionLabel + '.</div>';
  }

  if (game.lastBall) {
    var lb = game.lastBall;
    var batterLabel2 = lb.batter === 'user' ? 'You' : 'AI';
    var bowlerLabel2 = lb.batter === 'user' ? 'AI' : 'You';
    var text2 = 'Last: ' + batterLabel2 + ' [' + lb.batterPick + '] vs ' + bowlerLabel2 + ' [' + lb.bowlerPick + '] → ';
    text2 += lb.isOut ? '<strong class="out-text">OUT!</strong>' : '<strong>' + lb.runs + ' runs</strong>';
    document.getElementById('last-ball').innerHTML = text2;

    var lastBallEl = document.getElementById('last-ball');
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

  var kbAction = document.getElementById('kb-action');
  if (kbAction) {
    kbAction.textContent = battingTeam === 'user' ? 'bat' : 'bowl';
  }

  updateBallButtons();
  applyToggleStates();
}

function renderResult() {
  var heading = document.getElementById('result-heading');
  var details = document.getElementById('result-details');

  var userBatFirst = game.innings1.battingTeam === 'user';
  var userInnings = userBatFirst ? game.innings1 : game.innings2;
  var aiInnings = userBatFirst ? game.innings2 : game.innings1;

  details.innerHTML =
    '<div class="result-grid">' +
      '<div class="result-team-card">' +
        '<h3>🏏 YOU</h3>' +
        '<p class="result-score">' + userInnings.score + '/' + userInnings.wickets + '</p>' +
        '<p class="result-overs">' + formatOvers(userInnings.balls) + ' ov</p>' +
      '</div>' +
      '<div class="result-team-card">' +
        '<h3>🤖 AI</h3>' +
        '<p class="result-score">' + aiInnings.score + '/' + aiInnings.wickets + '</p>' +
        '<p class="result-overs">' + formatOvers(aiInnings.balls) + ' ov</p>' +
      '</div>' +
    '</div>';

  if (game.result === 'user') {
    heading.textContent = '🎉 YOU WIN!';
    triggerParticles('win');
  } else if (game.result === 'ai') {
    heading.textContent = '😔 AI WINS!';
  } else {
    heading.textContent = "🤝 IT'S A DRAW!";
  }

  if (gsapReady) {
    gsap.from('.result-team-card', { y: 30, opacity: 0, stagger: 0.15, duration: 0.4, ease: 'power2.out' });
  }
}

function showScreen(screen, direction) {
  direction = direction || 'left';
  document.querySelectorAll('.screen').forEach(function (el) { el.classList.add('hidden'); });
  var screenEl = document.getElementById(screen + '-screen');
  if (screenEl) screenEl.classList.remove('hidden');

  if (gsapReady && currentScreen && screen !== currentScreen) {
    var fromX = direction === 'left' ? 40 : -40;
    gsap.fromTo(screenEl, { opacity: 0, x: fromX }, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' });
  }

  currentScreen = screen;
  game.phase = screen;
  updateBallButtons();
}

function resetGame() {
  document.getElementById('event-modal').classList.add('hidden');
  document.getElementById('ball-log-entries').innerHTML = '<div class="ball-log-empty">No balls bowled yet</div>';
  document.getElementById('commentary-area').innerHTML = '<div class="commentary-empty">Commentary will appear here</div>';
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
  document.getElementById('menu-mode-label').textContent = 'SELECT MODE TO START';
  document.getElementById('modal-btn').style.borderColor = '';
  document.getElementById('modal-btn').style.color = '';
  showScreen('menu', 'right');
}

if (typeof document !== 'undefined' && document.getElementById('sound-toggle')) {
  document.addEventListener('keydown', handleKeyDown);
  checkGsap();
  loadUiSettings();

  if (soundEnabled) {
    document.getElementById('sound-toggle').textContent = '🔊';
  } else {
    document.getElementById('sound-toggle').textContent = '🔇';
  }

  showScreen('menu');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getSavedSoundPreference: getSavedSoundPreference,
    setSavedSoundPreference: setSavedSoundPreference,
    getRunFromKey: getRunFromKey,
    isPlayBlocked: isPlayBlocked,
    toggleBallLog: toggleBallLog,
    toggleCommentary: toggleCommentary,
    getBallLogVisible: getBallLogVisible,
    getCommentaryVisible: getCommentaryVisible,
    renderBallLog: renderBallLog,
    triggerCentury: triggerCentury,
    triggerHalfCentury: triggerHalfCentury,
    triggerWicketGlow: triggerWicketGlow,
    triggerParticles: triggerParticles,
    game: game,
  };
}
