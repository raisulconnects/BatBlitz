var localStorageMock = (function () {
  var store = {};
  return {
    getItem: function (key) { return store[key] !== undefined ? store[key] : null; },
    setItem: function (key, val) { store[key] = String(val); },
    removeItem: function (key) { delete store[key]; },
    clear: function () { store = {}; }
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

const {
  getSavedSoundPreference,
  setSavedSoundPreference,
  getSavedTossMode,
  setSavedTossMode,
  getRunFromKey,
  isPlayBlocked,
  getSavedPlayerName,
  setSavedPlayerName,
  getDisplayName,
  getDisplayNamePossessive,
  getSavedTrophies,
  setSavedTrophies,
  getSavedCurrency,
  setSavedCurrency,
  getSavedStreak,
  setSavedStreak,
  getSavedWins,
  setSavedWins,
  getSavedLosses,
  setSavedLosses,
  getSavedDraws,
  setSavedDraws,
  updateTrophiesAndCurrency,
  getInventory,
  setInventory,
  getItemCount,
  addItem,
  useItem,
  activateShield,
  buyItem,
  setCachedShopItems,
  game,
  getShieldBarHTML,
  renderShopContent,
} = require('./script');

describe('getSavedSoundPreference', function () {
  test('returns true by default when localStorage is unavailable', function () {
    expect(getSavedSoundPreference()).toBe(true);
  });

  describe('edge cases', function () {
    test('handles null localStorage gracefully', function () {
      expect(getSavedSoundPreference()).toBe(true);
    });

    test('always returns a boolean', function () {
      var result = getSavedSoundPreference();
      expect(typeof result).toBe('boolean');
    });
  });
});

describe('setSavedSoundPreference', function () {
  test('does not throw when called with true', function () {
    expect(function () { setSavedSoundPreference(true); }).not.toThrow();
  });

  test('does not throw when called with false', function () {
    expect(function () { setSavedSoundPreference(false); }).not.toThrow();
  });

  describe('edge cases', function () {
    test('does not throw when called with null', function () {
      expect(function () { setSavedSoundPreference(null); }).not.toThrow();
    });

    test('does not throw when called with undefined', function () {
      expect(function () { setSavedSoundPreference(undefined); }).not.toThrow();
    });

    test('does not throw when called with number', function () {
      expect(function () { setSavedSoundPreference(1); }).not.toThrow();
    });
  });
});

describe('getSavedTossMode', function () {
  test('returns rps by default when localStorage is unavailable', function () {
    expect(getSavedTossMode()).toBe('rps');
  });

  test('always returns a string', function () {
    var result = getSavedTossMode();
    expect(typeof result).toBe('string');
  });
});

describe('setSavedTossMode', function () {
  test('does not throw when called with rps', function () {
    expect(function () { setSavedTossMode('rps'); }).not.toThrow();
  });

  test('does not throw when called with ht', function () {
    expect(function () { setSavedTossMode('ht'); }).not.toThrow();
  });

  describe('edge cases', function () {
    test('does not throw when called with null', function () {
      expect(function () { setSavedTossMode(null); }).not.toThrow();
    });

    test('does not throw when called with undefined', function () {
      expect(function () { setSavedTossMode(undefined); }).not.toThrow();
    });
  });
});

describe('getRunFromKey', function () {
  function makeEvent(key) {
    return { key: key };
  }

  test('key "1" returns 1', function () {
    expect(getRunFromKey(makeEvent('1'))).toBe(1);
  });

  test('key "3" returns 3', function () {
    expect(getRunFromKey(makeEvent('3'))).toBe(3);
  });

  test('key "6" returns 6', function () {
    expect(getRunFromKey(makeEvent('6'))).toBe(6);
  });

  test('key "0" returns null (out of range)', function () {
    expect(getRunFromKey(makeEvent('0'))).toBeNull();
  });

  test('key "7" returns null (out of range)', function () {
    expect(getRunFromKey(makeEvent('7'))).toBeNull();
  });

  test('key "a" returns null (non-numeric)', function () {
    expect(getRunFromKey(makeEvent('a'))).toBeNull();
  });

  test('key "Escape" returns null', function () {
    expect(getRunFromKey(makeEvent('Escape'))).toBeNull();
  });

  describe('edge cases', function () {
    test('null event returns null', function () {
      expect(getRunFromKey(null)).toBeNull();
    });

    test('undefined event returns null', function () {
      expect(getRunFromKey(undefined)).toBeNull();
    });

    test('event with missing key returns null', function () {
      expect(getRunFromKey({})).toBeNull();
    });

    test('numeric key 1 returns null (must be string)', function () {
      expect(getRunFromKey(makeEvent(1))).toBeNull();
    });

    test('string with whitespace returns null', function () {
      expect(getRunFromKey(makeEvent(' 1 '))).toBeNull();
    });
  });
});

describe('isPlayBlocked', function () {
  test('returns true when phase is not "play"', function () {
    expect(isPlayBlocked('menu')).toBe(true);
  });

  test('returns true when phase is "toss"', function () {
    expect(isPlayBlocked('toss')).toBe(true);
  });

  test('returns true when phase is "result"', function () {
    expect(isPlayBlocked('result')).toBe(true);
  });

  test('returns false when user is bowling (phase is play)', function () {
    expect(isPlayBlocked('play')).toBe(false);
  });

  test('returns false when user is batting (phase is play)', function () {
    expect(isPlayBlocked('play')).toBe(false);
  });

  test('isUserBatting parameter is ignored (bowling not blocked)', function () {
    expect(isPlayBlocked('play', false)).toBe(false);
  });

  describe('edge cases', function () {
    test('returns true for null phase', function () {
      expect(isPlayBlocked(null)).toBe(true);
    });

    test('returns true for undefined phase', function () {
      expect(isPlayBlocked(undefined)).toBe(true);
    });

    test('returns true for empty string phase', function () {
      expect(isPlayBlocked('')).toBe(true);
    });

    test('extra arguments are ignored', function () {
      expect(isPlayBlocked('play', 'anything', 123)).toBe(false);
    });
  });
});

describe('getSavedPlayerName', function () {
  test('returns empty string when localStorage is unavailable', function () {
    expect(getSavedPlayerName()).toBe('');
  });
});

describe('setSavedPlayerName', function () {
  test('does not throw when called with a name', function () {
    expect(function () { setSavedPlayerName('Alex'); }).not.toThrow();
  });

  test('does not throw when called with whitespace name', function () {
    expect(function () { setSavedPlayerName('  Alex  '); }).not.toThrow();
  });

  test('does not throw when called with empty string', function () {
    expect(function () { setSavedPlayerName(''); }).not.toThrow();
  });

  test('does not throw when called with whitespace-only', function () {
    expect(function () { setSavedPlayerName('   '); }).not.toThrow();
  });
});

describe('getDisplayName', function () {
  test('returns "You" when no name is saved', function () {
    expect(getDisplayName()).toBe('You');
  });
});

describe('getDisplayNamePossessive', function () {
  test('returns "Your" when no name is saved', function () {
    expect(getDisplayNamePossessive()).toBe('Your');
  });
});

describe('getSavedTrophies', function () {
  test('returns 0 by default when localStorage is unavailable', function () {
    expect(getSavedTrophies()).toBe(0);
  });

  test('always returns a number', function () {
    expect(typeof getSavedTrophies()).toBe('number');
  });
});

describe('setSavedTrophies', function () {
  test('does not throw when called with a number', function () {
    expect(function () { setSavedTrophies(42); }).not.toThrow();
  });

  test('does not throw when called with 0', function () {
    expect(function () { setSavedTrophies(0); }).not.toThrow();
  });
});

describe('getSavedCurrency', function () {
  test('returns 0 by default when localStorage is unavailable', function () {
    expect(getSavedCurrency()).toBe(0);
  });
});

describe('setSavedCurrency', function () {
  test('does not throw when called with a number', function () {
    expect(function () { setSavedCurrency(100); }).not.toThrow();
  });
});

describe('getSavedStreak', function () {
  test('returns 0 by default when localStorage is unavailable', function () {
    expect(getSavedStreak()).toBe(0);
  });
});

describe('setSavedStreak', function () {
  test('does not throw when called with a number', function () {
    expect(function () { setSavedStreak(3); }).not.toThrow();
  });
});

describe('getSavedWins', function () {
  test('returns 0 by default', function () {
    expect(getSavedWins()).toBe(0);
  });
});

describe('setSavedWins', function () {
  test('does not throw', function () {
    expect(function () { setSavedWins(5); }).not.toThrow();
  });
});

describe('getSavedLosses', function () {
  test('returns 0 by default', function () {
    expect(getSavedLosses()).toBe(0);
  });
});

describe('setSavedLosses', function () {
  test('does not throw', function () {
    expect(function () { setSavedLosses(3); }).not.toThrow();
  });
});

describe('getSavedDraws', function () {
  test('returns 0 by default', function () {
    expect(getSavedDraws()).toBe(0);
  });
});

describe('setSavedDraws', function () {
  test('does not throw', function () {
    expect(function () { setSavedDraws(1); }).not.toThrow();
  });
});

describe('updateTrophiesAndCurrency', function () {
  beforeEach(function () {
    localStorage.clear();
  });

  test('win in quick mode gives +10 trophies, +30 currency', function () {
    var result = updateTrophiesAndCurrency('user', 'quick');
    expect(result.trophiesDelta).toBe(10);
    expect(result.currencyDelta).toBe(30);
    expect(typeof result.totalTrophies).toBe('number');
    expect(typeof result.totalCurrency).toBe('number');
  });

  test('win in t20 mode gives +10 trophies, +80 currency', function () {
    var result = updateTrophiesAndCurrency('user', 't20');
    expect(result.trophiesDelta).toBe(10);
    expect(result.currencyDelta).toBe(80);
  });

  test('win in test mode gives +10 trophies, +120 currency', function () {
    var result = updateTrophiesAndCurrency('user', 'test');
    expect(result.trophiesDelta).toBe(10);
    expect(result.currencyDelta).toBe(120);
  });

  test('loss gives -5 trophies delta, +5 currency delta', function () {
    var result = updateTrophiesAndCurrency('ai', 't20');
    expect(result.trophiesDelta).toBe(-5);
    expect(result.currencyDelta).toBe(5);
  });

  test('draw gives +2 trophies delta, +10 currency delta', function () {
    var result = updateTrophiesAndCurrency(null, 't20');
    expect(result.trophiesDelta).toBe(2);
    expect(result.currencyDelta).toBe(10);
  });

  test('result object has all expected properties', function () {
    var result = updateTrophiesAndCurrency('user', 't20');
    expect(result).toHaveProperty('trophiesDelta');
    expect(result).toHaveProperty('currencyDelta');
    expect(result).toHaveProperty('streak');
    expect(result).toHaveProperty('totalTrophies');
    expect(result).toHaveProperty('totalCurrency');
  });

  test('first win sets streak to 1', function () {
    var result = updateTrophiesAndCurrency('user', 't20');
    expect(result.streak).toBe(1);
  });

  test('first loss sets streak to -1', function () {
    var result = updateTrophiesAndCurrency('ai', 't20');
    expect(result.streak).toBe(-1);
  });

  test('draw sets streak to 0', function () {
    var result = updateTrophiesAndCurrency(null, 't20');
    expect(result.streak).toBe(0);
  });

  test('returned streak is an integer', function () {
    var win = updateTrophiesAndCurrency('user', 't20');
    expect(Number.isInteger(win.streak)).toBe(true);
    var loss = updateTrophiesAndCurrency('ai', 't20');
    expect(Number.isInteger(loss.streak)).toBe(true);
  });

  describe('edge cases', function () {
    test('does not throw when called with null result', function () {
      expect(function () { updateTrophiesAndCurrency(null, null); }).not.toThrow();
    });

    test('does not throw when called with undefined mode', function () {
      expect(function () { updateTrophiesAndCurrency('user', undefined); }).not.toThrow();
    });

    test('does not throw when called with empty string mode', function () {
      expect(function () { updateTrophiesAndCurrency('user', ''); }).not.toThrow();
    });

    test('delta values are always numbers', function () {
      var win = updateTrophiesAndCurrency('user', 't20');
      expect(typeof win.trophiesDelta).toBe('number');
      expect(typeof win.currencyDelta).toBe('number');
      var loss = updateTrophiesAndCurrency('ai', 'quick');
      expect(typeof loss.trophiesDelta).toBe('number');
      expect(typeof loss.currencyDelta).toBe('number');
      var draw = updateTrophiesAndCurrency(null, 't20');
      expect(typeof draw.trophiesDelta).toBe('number');
      expect(typeof draw.currencyDelta).toBe('number');
    });
  });
});

describe('getInventory', function () {
  test('returns empty object when localStorage is unavailable', function () {
    var inv = getInventory();
    expect(typeof inv).toBe('object');
    expect(Object.keys(inv).length).toBe(0);
  });

  test('always returns an object', function () {
    expect(typeof getInventory()).toBe('object');
  });
});

describe('setInventory', function () {
  test('does not throw when called with empty object', function () {
    expect(function () { setInventory({}); }).not.toThrow();
  });

  test('does not throw when called with shield inventory', function () {
    expect(function () { setInventory({ 'shield-1': 2, 'shield-2': 1 }); }).not.toThrow();
  });

  test('does not throw when called with null', function () {
    expect(function () { setInventory(null); }).not.toThrow();
  });
});

describe('getItemCount', function () {
  beforeEach(function () {
    localStorage.clear();
    setInventory({ 'shield-1': 3, 'shield-2': 1 });
  });

  afterEach(function () {
    setInventory({});
  });

  test('returns correct count for existing item', function () {
    expect(getItemCount('shield-1')).toBe(3);
  });

  test('returns correct count for another item', function () {
    expect(getItemCount('shield-2')).toBe(1);
  });

  test('returns 0 for non-existing item', function () {
    expect(getItemCount('nonexistent')).toBe(0);
  });

  test('always returns a number', function () {
    expect(typeof getItemCount('shield-1')).toBe('number');
  });
});

describe('addItem', function () {
  beforeEach(function () {
    localStorage.clear();
    setInventory({});
  });

  afterEach(function () {
    setInventory({});
  });

  test('adds item to empty inventory', function () {
    addItem('shield-1', 1);
    expect(getItemCount('shield-1')).toBe(1);
  });

  test('increments existing item count', function () {
    addItem('shield-1', 1);
    addItem('shield-1', 2);
    expect(getItemCount('shield-1')).toBe(3);
  });

  test('does not throw when called with default count', function () {
    expect(function () { addItem('shield-1'); }).not.toThrow();
  });

  test('does not throw when called with 0 count', function () {
    expect(function () { addItem('shield-1', 0); }).not.toThrow();
  });
});

describe('useItem', function () {
  beforeEach(function () {
    localStorage.clear();
    setInventory({ 'shield-1': 2, 'shield-2': 0 });
  });

  afterEach(function () {
    setInventory({});
  });

  test('returns true when item has stock', function () {
    expect(useItem('shield-1')).toBe(true);
  });

  test('decrements item count', function () {
    useItem('shield-1');
    expect(getItemCount('shield-1')).toBe(1);
  });

  test('returns false when item has no stock', function () {
    expect(useItem('shield-2')).toBe(false);
  });

  test('returns false for non-existing item', function () {
    expect(useItem('nonexistent')).toBe(false);
  });

  test('does not change count when item has no stock', function () {
    useItem('shield-2');
    expect(getItemCount('shield-2')).toBe(0);
  });
});

describe('activateShield', function () {
  beforeEach(function () {
    setInventory({ 'shield-1': 1, 'shield-2': 1 });
    game.activeShield = null;
    game.phase = 'play';
    game.currentInnings = { battingTeam: 'user' };
  });

  afterEach(function () {
    setInventory({});
    game.activeShield = null;
  });

  test('activates shield-1 and decrements inventory', function () {
    var result = activateShield('shield-1');
    expect(game.activeShield).not.toBeNull();
    expect(game.activeShield.id).toBe('shield-1');
    expect(game.activeShield.remaining).toBe(1);
    expect(getItemCount('shield-1')).toBe(0);
  });

  test('activates shield-2 with 2 remaining charges', function () {
    var result = activateShield('shield-2');
    expect(game.activeShield).not.toBeNull();
    expect(game.activeShield.id).toBe('shield-2');
    expect(game.activeShield.remaining).toBe(2);
    expect(getItemCount('shield-2')).toBe(0);
  });

  test('does nothing when no stock', function () {
    setInventory({ 'shield-1': 0 });
    var result = activateShield('shield-1');
    expect(game.activeShield).toBeNull();
  });
});

describe('getShieldBarHTML', function () {
  beforeEach(function () {
    game.phase = 'play';
    game.currentInnings = { battingTeam: 'user' };
    game.activeShield = null;
    setInventory({ 'shield-1': 1, 'shield-2': 1 });
  });

  afterEach(function () {
    game.activeShield = null;
    setInventory({});
  });

  test('returns shield buttons when user is batting and has shields', function () {
    var html = getShieldBarHTML();
    expect(html).toContain('shield-bar');
    expect(html).toContain('Bat Shield');
    expect(html).toContain('Reinforced Shield');
  });

  test('returns active shield indicator when shield is active', function () {
    game.activeShield = { id: 'shield-1', remaining: 1 };
    var html = getShieldBarHTML();
    expect(html).toContain('shield-active');
    expect(html).toContain('active');
  });

  test('returns empty string when user is not batting', function () {
    game.currentInnings.battingTeam = 'ai';
    expect(getShieldBarHTML()).toBe('');
  });

  test('returns empty string when no shields in inventory', function () {
    setInventory({});
    expect(getShieldBarHTML()).toBe('');
  });
});

describe('buyItem', function () {
  beforeEach(function () {
    localStorage.clear();
    setCachedShopItems([
      { id: 'shield-1', name: 'Bat Shield', description: 'Test', price: 50, icon: '\u{1F6E1}\uFE0F' },
      { id: 'shield-2', name: 'Reinforced Bat Shield', description: 'Test 2', price: 100, icon: '\u{1F530}' }
    ]);
    setSavedCurrency(200);
    setInventory({});
  });

  afterEach(function () {
    setCachedShopItems(null);
  });

  test('is a function', function () {
    expect(typeof buyItem).toBe('function');
  });

  test('deducts correct coin amount for shield-1', function () {
    buyItem('shield-1');
    expect(getSavedCurrency()).toBe(150);
  });

  test('deducts correct coin amount for shield-2', function () {
    buyItem('shield-2');
    expect(getSavedCurrency()).toBe(100);
  });

  test('adds purchased item to inventory', function () {
    buyItem('shield-1');
    expect(getItemCount('shield-1')).toBe(1);
  });

  test('does not purchase when not enough coins', function () {
    setSavedCurrency(30);
    buyItem('shield-1');
    expect(getSavedCurrency()).toBe(30);
    expect(getItemCount('shield-1')).toBe(0);
  });

  test('does not purchase for invalid item id', function () {
    buyItem('nonexistent');
    expect(getSavedCurrency()).toBe(200);
    expect(getItemCount('shield-1')).toBe(0);
  });

  test('does nothing when cachedShopItems is null', function () {
    setCachedShopItems(null);
    buyItem('shield-1');
    expect(getSavedCurrency()).toBe(200);
    expect(getItemCount('shield-1')).toBe(0);
  });

  test('exact coin purchase (coins == price) succeeds', function () {
    setSavedCurrency(50);
    buyItem('shield-1');
    expect(getSavedCurrency()).toBe(0);
    expect(getItemCount('shield-1')).toBe(1);
  });

  test('multiple purchases correctly accumulates inventory', function () {
    setSavedCurrency(200);
    buyItem('shield-1');
    buyItem('shield-2');
    expect(getSavedCurrency()).toBe(50);
    expect(getItemCount('shield-1')).toBe(1);
    expect(getItemCount('shield-2')).toBe(1);
  });

  test('multiple purchases of same item stack', function () {
    setSavedCurrency(200);
    buyItem('shield-1');
    buyItem('shield-1');
    buyItem('shield-1');
    expect(getSavedCurrency()).toBe(50);
    expect(getItemCount('shield-1')).toBe(3);
  });

  test('purchase fails if one coin short', function () {
    setSavedCurrency(49);
    buyItem('shield-1');
    expect(getSavedCurrency()).toBe(49);
    expect(getItemCount('shield-1')).toBe(0);
  });
});
