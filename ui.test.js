/**
 * @jest-environment jsdom
 */

var {
  toggleBallLog,
  toggleCommentary,
  getBallLogVisible,
  getCommentaryVisible,
  renderBallLog,
  triggerCentury,
  triggerHalfCentury,
  triggerWicketGlow,
  triggerInningsEnd,
  updateRoleIndicator,
  showHowToPlay,
  showSettings,
  toggleVolume,
  toggleTossMode,
  playClickSound,
  game,
  tossMode,
  getSavedPlayerName,
  setSavedPlayerName,
  getDisplayName,
  getDisplayNamePossessive,
} = require('./script');
var fs = require('fs');
var path = require('path');

describe('toggleBallLog', function () {
  var entries;

  beforeAll(function () {
    entries = document.createElement('div');
    entries.id = 'ball-log-entries';
    entries.className = 'ball-log-entries';
    document.body.appendChild(entries);
  });

  afterAll(function () {
    if (entries && entries.parentNode) entries.parentNode.removeChild(entries);
  });

  beforeEach(function () {
    entries.classList.remove('collapsed');
    while (toggleBallLog() === false) {}
  });

  test('is a function', function () {
    expect(typeof toggleBallLog).toBe('function');
  });

  test('getBallLogVisible is a function', function () {
    expect(typeof getBallLogVisible).toBe('function');
  });

  test('starts visible', function () {
    expect(getBallLogVisible()).toBe(true);
  });

  test('toggles to hidden on first call', function () {
    var result = toggleBallLog();
    expect(result).toBe(false);
    expect(getBallLogVisible()).toBe(false);
  });

  test('toggles back to visible on second call', function () {
    toggleBallLog();
    var result = toggleBallLog();
    expect(result).toBe(true);
    expect(getBallLogVisible()).toBe(true);
  });

  test('adds collapsed class when hidden', function () {
    toggleBallLog();
    expect(entries.classList.contains('collapsed')).toBe(true);
  });

  test('removes collapsed class when shown', function () {
    toggleBallLog();
    toggleBallLog();
    expect(entries.classList.contains('collapsed')).toBe(false);
  });

  test('returns true after even number of toggles', function () {
    toggleBallLog();
    toggleBallLog();
    toggleBallLog();
    toggleBallLog();
    expect(getBallLogVisible()).toBe(true);
  });

  test('returns false after odd number of toggles', function () {
    toggleBallLog();
    toggleBallLog();
    toggleBallLog();
    expect(getBallLogVisible()).toBe(false);
  });
});

describe('toggleCommentary', function () {
  var commentaryArea;
  var toggleIcon;

  beforeAll(function () {
    toggleIcon = document.createElement('span');
    toggleIcon.id = 'toggle-commentary-icon';
    document.body.appendChild(toggleIcon);

    commentaryArea = document.createElement('div');
    commentaryArea.id = 'commentary-area';
    document.body.appendChild(commentaryArea);
  });

  afterAll(function () {
    if (toggleIcon && toggleIcon.parentNode) toggleIcon.parentNode.removeChild(toggleIcon);
    if (commentaryArea && commentaryArea.parentNode) commentaryArea.parentNode.removeChild(commentaryArea);
  });

  beforeEach(function () {
    commentaryArea.classList.remove('collapsed');
    toggleIcon.classList.remove('collapsed');
    while (toggleCommentary() === false) {}
  });

  test('is a function', function () {
    expect(typeof toggleCommentary).toBe('function');
  });

  test('getCommentaryVisible is a function', function () {
    expect(typeof getCommentaryVisible).toBe('function');
  });

  test('starts visible', function () {
    expect(getCommentaryVisible()).toBe(true);
  });

  test('toggles to hidden on first call', function () {
    var result = toggleCommentary();
    expect(result).toBe(false);
    expect(getCommentaryVisible()).toBe(false);
  });

  test('toggles back to visible on second call', function () {
    toggleCommentary();
    var result = toggleCommentary();
    expect(result).toBe(true);
    expect(getCommentaryVisible()).toBe(true);
  });

  test('adds collapsed class to commentary-area when hidden', function () {
    toggleCommentary();
    expect(commentaryArea.classList.contains('collapsed')).toBe(true);
  });

  test('removes collapsed class from commentary-area when shown', function () {
    toggleCommentary();
    toggleCommentary();
    expect(commentaryArea.classList.contains('collapsed')).toBe(false);
  });

  test('adds collapsed class to toggle icon when hidden', function () {
    toggleCommentary();
    expect(toggleIcon.classList.contains('collapsed')).toBe(true);
  });

  test('removes collapsed class from toggle icon when shown', function () {
    toggleCommentary();
    toggleCommentary();
    expect(toggleIcon.classList.contains('collapsed')).toBe(false);
  });

  test('commentary toggle cycles correctly', function () {
    toggleCommentary();
    toggleCommentary();
    toggleCommentary();
    expect(getCommentaryVisible()).toBe(false);
    toggleCommentary();
    expect(getCommentaryVisible()).toBe(true);
  });
});

describe('renderBallLog (empty message fix)', function () {
  var entries;

  beforeAll(function () {
    entries = document.createElement('div');
    entries.id = 'ball-log-entries';
    document.body.appendChild(entries);
  });

  beforeEach(function () {
    entries.innerHTML = '<div class="ball-log-empty">No balls bowled yet</div>';
  });

  afterAll(function () {
    if (entries && entries.parentNode) entries.parentNode.removeChild(entries);
  });

  test('removes empty message before appending new entry', function () {
    renderBallLog();
    var emptyMsg = entries.querySelector('.ball-log-empty');
    expect(emptyMsg).toBeNull();
  });

  test('does not throw when container has no empty message', function () {
    entries.innerHTML = '';
    renderBallLog();
    var emptyMsg = entries.querySelector('.ball-log-empty');
    expect(emptyMsg).toBeNull();
  });

  test('does not throw when container is empty', function () {
    entries.innerHTML = '';
    expect(function () { renderBallLog(); }).not.toThrow();
  });

  test('does not throw when container has regular content (no empty message)', function () {
    entries.innerHTML = '<div>Some content</div>';
    expect(function () { renderBallLog(); }).not.toThrow();
  });
});

describe('toss screen back button', function () {
  beforeAll(function () {
    var tossScreen = document.createElement('div');
    tossScreen.id = 'toss-screen';
    tossScreen.className = 'screen hidden';
    tossScreen.innerHTML =
      '<h2>TOSS</h2>' +
      '<p class="screen-desc">Rock Paper Scissors — winner chooses</p>' +
      '<div class="rps-buttons">' +
        '<button class="rps-btn">ROCK</button>' +
        '<button class="rps-btn">PAPER</button>' +
        '<button class="rps-btn">SCISSORS</button>' +
      '</div>' +
      '<div id="toss-result" class="toss-result"></div>' +
      '<button class="back-btn" onclick="showModeSelect()">← BACK</button>';
    document.body.appendChild(tossScreen);
  });

  afterAll(function () {
    var el = document.getElementById('toss-screen');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  });

  test('toss screen has a back button', function () {
    var backBtn = document.querySelector('#toss-screen .back-btn');
    expect(backBtn).not.toBeNull();
  });

  test('back button has onclick handler returning to mode select', function () {
    var backBtn = document.querySelector('#toss-screen .back-btn');
    expect(backBtn.getAttribute('onclick')).toContain('showModeSelect');
  });

  test('back button displays back arrow text', function () {
    var backBtn = document.querySelector('#toss-screen .back-btn');
    expect(backBtn.textContent).toContain('BACK');
  });
});

describe('changelog.json', function () {
  var changelogPath = path.resolve(__dirname, 'changelog.json');

  test('file exists', function () {
    expect(fs.existsSync(changelogPath)).toBe(true);
  });

  test('parses as valid JSON', function () {
    var content = fs.readFileSync(changelogPath, 'utf8');
    var data = JSON.parse(content);
    expect(Array.isArray(data)).toBe(true);
  });

  test('contains at least one version entry', function () {
    var content = fs.readFileSync(changelogPath, 'utf8');
    var data = JSON.parse(content);
    expect(data.length).toBeGreaterThanOrEqual(1);
  });

  test('each entry has version string and entries array', function () {
    var content = fs.readFileSync(changelogPath, 'utf8');
    var data = JSON.parse(content);
    for (var i = 0; i < data.length; i++) {
      expect(typeof data[i].version).toBe('string');
      expect(Array.isArray(data[i].entries)).toBe(true);
    }
  });

  test('each entry has at least one changelog item', function () {
    var content = fs.readFileSync(changelogPath, 'utf8');
    var data = JSON.parse(content);
    for (var i = 0; i < data.length; i++) {
      expect(data[i].entries.length).toBeGreaterThanOrEqual(1);
    }
  });

  test('all entry strings are non-empty', function () {
    var content = fs.readFileSync(changelogPath, 'utf8');
    var data = JSON.parse(content);
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].entries.length; j++) {
        expect(typeof data[i].entries[j]).toBe('string');
        expect(data[i].entries[j].length).toBeGreaterThan(0);
      }
    }
  });
});

describe('changelog scrollbar styles', function () {
  var cssPath = path.resolve(__dirname, 'style.css');

  test('changelog-content has custom scrollbar width', function () {
    var cssText = fs.readFileSync(cssPath, 'utf8');
    expect(cssText).toMatch(/\.changelog-content::-webkit-scrollbar\s*\{\s*width:\s*4px/i);
  });

  test('changelog-content has transparent scrollbar track', function () {
    var cssText = fs.readFileSync(cssPath, 'utf8');
    expect(cssText).toMatch(/\.changelog-content::-webkit-scrollbar-track\s*\{\s*background:\s*transparent/i);
  });

  test('changelog-content has styled scrollbar thumb', function () {
    var cssText = fs.readFileSync(cssPath, 'utf8');
    expect(cssText).toMatch(/\.changelog-content::-webkit-scrollbar-thumb\s*\{\s*background:\s*rgba\(57,\s*255,\s*20,\s*0\.2\)/i);
  });

  test('changelog-content has padding-right for scrollbar clearance', function () {
    var cssText = fs.readFileSync(cssPath, 'utf8');
    expect(cssText).toMatch(/\.changelog-content\s*\{[^}]*padding-right:\s*0\.25rem/i);
  });
});

describe('triggerCentury', function () {
  var overlay;
  var textEl;

  beforeAll(function () {
    overlay = document.createElement('div');
    overlay.id = 'milestone-overlay';
    overlay.className = 'milestone-overlay hidden';
    document.body.appendChild(overlay);
    textEl = document.createElement('div');
    textEl.id = 'milestone-text';
    textEl.className = 'milestone-text';
    document.body.appendChild(textEl);
  });

  afterAll(function () {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    if (textEl && textEl.parentNode) textEl.parentNode.removeChild(textEl);
  });

  beforeEach(function () {
    overlay.className = 'milestone-overlay hidden';
    overlay.style.background = '';
    textEl.className = 'milestone-text';
    textEl.textContent = '';
  });

  test('is a function', function () {
    expect(typeof triggerCentury).toBe('function');
  });

  test('shows overlay and sets century text', function () {
    triggerCentury();
    expect(overlay.classList.contains('hidden')).toBe(false);
    expect(textEl.textContent).toContain('CENTURY');
    expect(textEl.classList.contains('century-text')).toBe(true);
  });

  test('hides overlay after timeout', function () {
    jest.useFakeTimers();
    triggerCentury();
    expect(overlay.classList.contains('hidden')).toBe(false);
    jest.advanceTimersByTime(2200);
    expect(overlay.classList.contains('hidden')).toBe(true);
    jest.useRealTimers();
  });

  test('sets golden background', function () {
    triggerCentury();
    expect(overlay.style.background).toContain('rgba(255,215,0');
  });
});

describe('triggerHalfCentury', function () {
  var overlay;
  var textEl;

  beforeAll(function () {
    overlay = document.getElementById('milestone-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'milestone-overlay';
      overlay.className = 'milestone-overlay hidden';
      document.body.appendChild(overlay);
    }
    textEl = document.getElementById('milestone-text');
    if (!textEl) {
      textEl = document.createElement('div');
      textEl.id = 'milestone-text';
      textEl.className = 'milestone-text';
      document.body.appendChild(textEl);
    }
  });

  afterAll(function () {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    if (textEl && textEl.parentNode) textEl.parentNode.removeChild(textEl);
  });

  beforeEach(function () {
    overlay.className = 'milestone-overlay hidden';
    overlay.style.background = '';
    textEl.className = 'milestone-text';
    textEl.textContent = '';
  });

  test('is a function', function () {
    expect(typeof triggerHalfCentury).toBe('function');
  });

  test('shows overlay and sets fifty text', function () {
    triggerHalfCentury();
    expect(overlay.classList.contains('hidden')).toBe(false);
    expect(textEl.textContent).toContain('FIFTY');
    expect(textEl.classList.contains('fifty-text')).toBe(true);
  });

  test('hides overlay after timeout', function () {
    jest.useFakeTimers();
    triggerHalfCentury();
    expect(overlay.classList.contains('hidden')).toBe(false);
    jest.advanceTimersByTime(2000);
    expect(overlay.classList.contains('hidden')).toBe(true);
    jest.useRealTimers();
  });

  test('sets blue background', function () {
    triggerHalfCentury();
    expect(overlay.style.background).toContain('rgba(100,200,255');
  });
});

describe('triggerWicketGlow', function () {
  var scoreboard;

  beforeAll(function () {
    scoreboard = document.createElement('div');
    scoreboard.id = 'scoreboard';
    scoreboard.className = 'scoreboard';
    document.body.appendChild(scoreboard);
  });

  afterAll(function () {
    if (scoreboard && scoreboard.parentNode) scoreboard.parentNode.removeChild(scoreboard);
  });

  beforeEach(function () {
    scoreboard.classList.remove('wicket-glow');
  });

  test('is a function', function () {
    expect(typeof triggerWicketGlow).toBe('function');
  });

  test('adds wicket-glow class to scoreboard', function () {
    triggerWicketGlow();
    expect(scoreboard.classList.contains('wicket-glow')).toBe(true);
  });

  test('removes wicket-glow class after timeout', function () {
    jest.useFakeTimers();
    triggerWicketGlow();
    expect(scoreboard.classList.contains('wicket-glow')).toBe(true);
    jest.advanceTimersByTime(800);
    expect(scoreboard.classList.contains('wicket-glow')).toBe(false);
    jest.useRealTimers();
  });
});

describe('triggerInningsEnd', function () {
  var overlay;
  var textEl;

  beforeAll(function () {
    overlay = document.getElementById('milestone-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'milestone-overlay';
      overlay.className = 'milestone-overlay hidden';
      document.body.appendChild(overlay);
    }
    textEl = document.getElementById('milestone-text');
    if (!textEl) {
      textEl = document.createElement('div');
      textEl.id = 'milestone-text';
      textEl.className = 'milestone-text';
      document.body.appendChild(textEl);
    }
  });

  afterAll(function () {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    if (textEl && textEl.parentNode) textEl.parentNode.removeChild(textEl);
  });

  beforeEach(function () {
    overlay.className = 'milestone-overlay hidden';
    overlay.style.background = '';
    textEl.className = 'milestone-text';
    textEl.textContent = '';
  });

  test('is a function', function () {
    expect(typeof triggerInningsEnd).toBe('function');
  });

  test('shows overlay and sets innings end text', function () {
    triggerInningsEnd();
    expect(overlay.classList.contains('hidden')).toBe(false);
    expect(textEl.textContent).toContain('OUT');
    expect(textEl.classList.contains('innings-end-text')).toBe(true);
  });

  test('hides overlay after timeout', function () {
    jest.useFakeTimers();
    triggerInningsEnd();
    expect(overlay.classList.contains('hidden')).toBe(false);
    jest.advanceTimersByTime(2200);
    expect(overlay.classList.contains('hidden')).toBe(true);
    jest.useRealTimers();
  });

  test('sets red background', function () {
    triggerInningsEnd();
    expect(overlay.style.background).toContain('rgba(255,0,0');
  });
});

describe('game milestones', function () {
  test('initializes with fifty and hundred as false', function () {
    expect(game.milestones).toBeDefined();
    expect(game.milestones.fifty).toBe(false);
    expect(game.milestones.hundred).toBe(false);
  });
});

describe('updateRoleIndicator', function () {
  var el;
  var savedPhase;
  var savedUserRole;
  var savedCurrentInnings;

  beforeAll(function () {
    el = document.createElement('div');
    el.id = 'role-indicator';
    el.className = 'role-indicator idle';
    document.body.appendChild(el);
  });

  afterAll(function () {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  });

  beforeEach(function () {
    savedPhase = game.phase;
    savedUserRole = game.userRole;
    savedCurrentInnings = game.currentInnings;
    el.className = 'role-indicator idle';
    el.textContent = '';
  });

  test('shows bowling indicator when user is bowling', function () {
    game.phase = 'play';
    game.userRole = 'bowl';
    game.currentInnings = { battingTeam: 'ai' };
    updateRoleIndicator();
    expect(el.textContent).toContain('BOWLING');
    expect(el.classList.contains('bowling')).toBe(true);
    expect(el.classList.contains('idle')).toBe(false);
  });

  test('goes idle when phase is not play', function () {
    game.phase = 'menu';
    game.userRole = 'bat';
    game.currentInnings = { battingTeam: 'user' };
    updateRoleIndicator();
    expect(el.classList.contains('idle')).toBe(true);
    expect(el.textContent).toBe('');
  });

  test('goes idle when userRole is null', function () {
    game.phase = 'play';
    game.userRole = null;
    game.currentInnings = { battingTeam: 'user' };
    updateRoleIndicator();
    expect(el.classList.contains('idle')).toBe(true);
  });

  test('goes idle when currentInnings is null', function () {
    game.phase = 'play';
    game.userRole = 'bat';
    game.currentInnings = null;
    updateRoleIndicator();
    expect(el.classList.contains('idle')).toBe(true);
  });

  test('goes idle when battingTeam is undefined', function () {
    game.phase = 'play';
    game.userRole = 'bat';
    game.currentInnings = {};
    updateRoleIndicator();
    expect(el.classList.contains('idle')).toBe(true);
  });

  test('goes idle when leaving play screen', function () {
    game.phase = 'play';
    game.userRole = 'bat';
    game.currentInnings = { battingTeam: 'user' };
    updateRoleIndicator();
    expect(el.classList.contains('idle')).toBe(false);
    expect(el.textContent).toContain('BATTING');
    game.phase = 'menu';
    game.userRole = null;
    game.currentInnings = null;
    updateRoleIndicator();
    expect(el.classList.contains('idle')).toBe(true);
    expect(el.textContent).toBe('');
  });
});

describe('text selection disabled', function () {
  test('style.css sets user-select none on universal selector', function () {
    var cssText = fs.readFileSync(path.resolve(__dirname, 'style.css'), 'utf8');
    expect(cssText).toContain('user-select: none');
  });

  test('style.css sets -webkit-user-select none on universal selector', function () {
    var cssText = fs.readFileSync(path.resolve(__dirname, 'style.css'), 'utf8');
    expect(cssText).toContain('-webkit-user-select: none');
  });
});

describe('showHowToPlay', function () {
  var modalOverlay;
  var modalHeading;
  var modalBody;
  var modalBtn;

  beforeAll(function () {
    global.playButtonSound = function () {};
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'event-modal';
    modalOverlay.className = 'modal-overlay hidden';
    document.body.appendChild(modalOverlay);

    var modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalOverlay.appendChild(modalContent);

    modalHeading = document.createElement('h2');
    modalHeading.id = 'modal-heading';
    modalContent.appendChild(modalHeading);

    modalBody = document.createElement('div');
    modalBody.id = 'modal-body';
    modalContent.appendChild(modalBody);

    modalBtn = document.createElement('button');
    modalBtn.id = 'modal-btn';
    modalContent.appendChild(modalBtn);
  });

  afterAll(function () {
    if (modalOverlay && modalOverlay.parentNode) modalOverlay.parentNode.removeChild(modalOverlay);
  });

  beforeEach(function () {
    modalOverlay.classList.add('hidden');
    modalHeading.textContent = '';
    modalBody.innerHTML = '';
  });

  test('is a function', function () {
    expect(typeof showHowToPlay).toBe('function');
  });

  test('opens modal with how to play heading', function () {
    showHowToPlay();
    expect(modalOverlay.classList.contains('hidden')).toBe(false);
    expect(modalHeading.textContent).toContain('HOW TO PLAY');
  });

  test('modal body contains game mode sections', function () {
    showHowToPlay();
    expect(modalBody.innerHTML).toContain('QUICK');
    expect(modalBody.innerHTML).toContain('T20');
    expect(modalBody.innerHTML).toContain('TEST');
  });

  test('modal body contains how to play header', function () {
    showHowToPlay();
    expect(modalBody.innerHTML).toContain('HOW TO PLAY');
  });

  test('modal body mentions batting and bowling', function () {
    showHowToPlay();
    expect(modalBody.innerHTML).toContain('Batting');
    expect(modalBody.innerHTML).toContain('Bowling');
  });

  test('modal body explains the core mechanic', function () {
    showHowToPlay();
    expect(modalBody.innerHTML).toContain('Pick a number');
  });

  test('modal body contains controls', function () {
    showHowToPlay();
    expect(modalBody.innerHTML).toContain('CONTROLS');
  });

  test('modal has GOT IT button', function () {
    showHowToPlay();
    expect(modalBtn.textContent).toBe('GOT IT');
  });
});

describe('how to play button in HTML', function () {
  test('index.html contains how to play button', function () {
    var html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
    expect(html).toContain('HOW TO PLAY');
  });

  test('how to play button calls showHowToPlay', function () {
    var html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
    expect(html).toContain('onclick="showHowToPlay()"');
  });
});

describe('showSettings', function () {
  var modalOverlay;
  var modalHeading;
  var modalBody;
  var modalBtn;

  beforeAll(function () {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'event-modal';
    modalOverlay.className = 'modal-overlay hidden';
    document.body.appendChild(modalOverlay);

    var modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalOverlay.appendChild(modalContent);

    modalHeading = document.createElement('h2');
    modalHeading.id = 'modal-heading';
    modalContent.appendChild(modalHeading);

    modalBody = document.createElement('div');
    modalBody.id = 'modal-body';
    modalContent.appendChild(modalBody);

    modalBtn = document.createElement('button');
    modalBtn.id = 'modal-btn';
    modalContent.appendChild(modalBtn);
  });

  afterAll(function () {
    if (modalOverlay && modalOverlay.parentNode) modalOverlay.parentNode.removeChild(modalOverlay);
  });

  beforeEach(function () {
    modalOverlay.classList.add('hidden');
    modalHeading.textContent = '';
    modalBody.innerHTML = '';
  });

  test('is a function', function () {
    expect(typeof showSettings).toBe('function');
  });

  test('opens modal with settings heading', function () {
    showSettings();
    expect(modalOverlay.classList.contains('hidden')).toBe(false);
    expect(modalHeading.textContent).toContain('SETTINGS');
  });

  test('modal body contains volume row', function () {
    showSettings();
    expect(modalBody.innerHTML).toContain('Volume');
  });

  test('modal body contains toss mode row', function () {
    showSettings();
    expect(modalBody.innerHTML).toContain('Toss Mode');
  });

  test('modal has GOT IT button', function () {
    showSettings();
    expect(modalBtn.textContent).toBe('GOT IT');
  });
});

describe('toggleVolume', function () {
  test('is a function', function () {
    expect(typeof toggleVolume).toBe('function');
  });
});

describe('toggleTossMode', function () {
  test('is a function', function () {
    expect(typeof toggleTossMode).toBe('function');
  });
});

describe('settings button in HTML', function () {
  test('index.html contains settings button', function () {
    var html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
    expect(html).toContain('SETTINGS');
  });

  test('settings button calls showSettings', function () {
    var html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
    expect(html).toContain('onclick="showSettings()"');
  });
});

describe('sound toggle removed from header', function () {
  test('index.html no longer has sound-toggle button in header', function () {
    var html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
    expect(html).not.toContain('id="sound-toggle"');
  });
});

describe('heads & tails buttons in toss screen', function () {
  test('index.html contains HT buttons', function () {
    var html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
    expect(html).toContain('onclick="startToss(\'heads\')"');
    expect(html).toContain('onclick="startToss(\'tails\')"');
  });

  test('HT buttons have hidden class by default', function () {
    var html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
    expect(html).toContain('class="ht-buttons hidden"');
  });

  test('toss screen has descriptive id for dynamic updates', function () {
    var html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
    expect(html).toContain('id="toss-desc"');
  });
});

describe('toss mode persistence keys', function () {
  test('script.js uses batblitz-toss-mode localStorage key', function () {
    var js = fs.readFileSync(path.resolve(__dirname, 'script.js'), 'utf8');
    expect(js).toContain('batblitz-toss-mode');
  });
});

describe('volume mute respects soundEnabled', function () {
  var callCount;

  beforeAll(function () {
    global.playButtonSound = function () { callCount++; };
  });

  beforeEach(function () {
    callCount = 0;
  });

  test('playClickSound plays when sound is on', function () {
    playClickSound();
    expect(callCount).toBe(1);
  });

  test('playClickSound does not play when sound is muted', function () {
    toggleVolume();
    playClickSound();
    expect(callCount).toBe(0);
    toggleVolume();
  });

  test('toggleBallLog respects mute state', function () {
    toggleVolume();
    toggleBallLog();
    expect(callCount).toBe(0);
    toggleVolume();
    toggleBallLog();
    expect(callCount).toBe(1);
  });

  test('toggleCommentary respects mute state', function () {
    toggleVolume();
    toggleCommentary();
    expect(callCount).toBe(0);
    toggleVolume();
    toggleCommentary();
    expect(callCount).toBe(1);
  });

  test('playClickSound does not throw when playButtonSound is undefined', function () {
    delete global.playButtonSound;
    expect(function () { playClickSound(); }).not.toThrow();
    global.playButtonSound = function () { callCount++; };
  });
});

describe('mode select tooltips and descriptions', function () {
  var html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
  var css = fs.readFileSync(path.resolve(__dirname, 'style.css'), 'utf8');

  test('each mode card has a wrapper', function () {
    var matches = html.match(/<div class="mode-card-wrapper">/g);
    expect(matches).not.toBeNull();
    expect(matches.length).toBe(4);
  });

  test('each mode card has a tooltip element', function () {
    var matches = html.match(/<div class="mode-tooltip">/g);
    expect(matches).not.toBeNull();
    expect(matches.length).toBe(3);
  });

  test('tooltip has descriptive text for quick mode', function () {
    expect(html).toMatch(/Every ball is do-or-die/i);
  });

  test('tooltip has descriptive text for t20 mode', function () {
    expect(html).toMatch(/20 overs per side/i);
  });

  test('tooltip has descriptive text for test mode', function () {
    expect(html).toMatch(/ultimate endurance test/i);
  });

  test('quick mode description updated', function () {
    expect(html).toMatch(/High stakes.*1 wicket.*unlimited overs/);
  });

  test('t20 mode description updated', function () {
    expect(html).toMatch(/Classic T20.*10 wickets.*20 overs/);
  });

  test('test mode description updated', function () {
    expect(html).toMatch(/Endurance test.*10 wickets.*unlimited overs/);
  });

  test('tooltip has glassmorphism dark background', function () {
    expect(css).toMatch(/\.mode-tooltip\s*\{[^}]*background:\s*rgba\(10,\s*15,\s*10,\s*0\.95\)/i);
  });

  test('tooltip hidden by default via opacity 0', function () {
    expect(css).toMatch(/\.mode-tooltip\s*\{[^}]*opacity:\s*0/i);
  });

  test('tooltip shown on wrapper hover', function () {
    expect(css).toMatch(/\.mode-card-wrapper:hover\s*\.mode-tooltip\s*\{[^}]*opacity:\s*1/i);
  });

  test('tooltip has pointer-events none', function () {
    expect(css).toMatch(/\.mode-tooltip\s*\{[^}]*pointer-events:\s*none/i);
  });

  test('tooltip hidden on touch devices', function () {
    expect(css).toMatch(/@media\s*\(hover:\s*none\)\s*\{[^}]*\.mode-tooltip\s*\{[^}]*display:\s*none/i);
  });
});

describe('player name settings', function () {
  var html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
  var js = fs.readFileSync(path.resolve(__dirname, 'script.js'), 'utf8');

  test('script.js exports getSavedPlayerName', function () {
    expect(typeof getSavedPlayerName).toBe('function');
  });

  test('script.js exports setSavedPlayerName', function () {
    expect(typeof setSavedPlayerName).toBe('function');
  });

  test('script.js exports getDisplayName', function () {
    expect(typeof getDisplayName).toBe('function');
  });

  test('script.js exports getDisplayNamePossessive', function () {
    expect(typeof getDisplayNamePossessive).toBe('function');
  });

  test('getSavedPlayerName uses batblitz-player-name localStorage key', function () {
    expect(js).toContain('batblitz-player-name');
  });

  test('getDisplayName falls back to "You"', function () {
    expect(js).toMatch(/return\s+name\s*\|\|\s*['"]You['"]/);
  });

  test('getDisplayNamePossessive returns "Your" for "You"', function () {
    expect(js).toMatch(/name\s*===\s*['"]You['"]\s*\?\s*['"]Your['"]/);
  });

  test('settings render includes player name row', function () {
    expect(js).toMatch(/Player Name/);
  });

  test('settings render calls getDisplayName for player name value', function () {
    expect(js).toMatch(/getDisplayName\(\s*\)/);
  });

  test('renderSettingsBody includes onclick for showPlayerNameModal', function () {
    expect(js).toMatch(/showPlayerNameModal/);
  });

  test('showPlayerNameModal creates input with maxlength 20', function () {
    expect(js).toMatch(/maxlength="20"/);
  });

  test('showPlayerNameModal has SAVE and CANCEL buttons', function () {
    expect(js).toMatch(/SAVE/);
    expect(js).toMatch(/CANCEL/);
  });

  test('render uses getDisplayName for batting label', function () {
    expect(js).toMatch(/battingTeam\s*===\s*['"]user['"]\s*\?\s*getDisplayName\(\s*\)/);
  });

  test('render uses getDisplayName for previous innings label', function () {
    expect(js).toMatch(/prevBatting\s*===\s*['"]user['"]\s*\?\s*getDisplayName\(\s*\)/);
  });

  test('last ball display uses getDisplayName', function () {
    expect(js).toMatch(/lb\.batter\s*===\s*['"]user['"]\s*\?\s*getDisplayName\(\s*\)\s*:\s*['"]AI['"]/);
  });

  test('innings end modal uses getDisplayNamePossessive', function () {
    expect(js).toMatch(/getDisplayNamePossessive\(\s*\)\.toUpperCase\(\s*\)/);
  });

  test('chase complete uses getDisplayName for winner', function () {
    expect(js).toMatch(/winnerLabel2\s*=\s*game\.currentInnings\.battingTeam\s*===\s*['"]user['"]\s*\?\s*getDisplayName\(\s*\)/);
  });

  test('setSavedPlayerName trims input', function () {
    expect(js).toMatch(/\.trim\(\s*\)/);
  });
});

describe('name edit modal CSS', function () {
  var css = fs.readFileSync(path.resolve(__dirname, 'style.css'), 'utf8');

  test('name-edit-input has styling', function () {
    expect(css).toMatch(/\.name-edit-input/);
  });

  test('name-edit-label has styling', function () {
    expect(css).toMatch(/\.name-edit-label/);
  });
});
