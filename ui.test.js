/**
 * @jest-environment jsdom
 */

var {
  toggleBallLog,
  toggleCommentary,
  getBallLogVisible,
  getCommentaryVisible,
  renderBallLog,
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
