const {
  getSavedSoundPreference,
  setSavedSoundPreference,
  getRunFromKey,
  isPlayBlocked,
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
