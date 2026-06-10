const {
  playButtonSound,
  playRunSound,
  playBoundarySound,
  playWicketSound,
  playWinSound,
  playChaseSound,
} = require('./sounds');

describe('sound functions', function () {
  test('all six sound functions are exported', function () {
    expect(typeof playButtonSound).toBe('function');
    expect(typeof playRunSound).toBe('function');
    expect(typeof playBoundarySound).toBe('function');
    expect(typeof playWicketSound).toBe('function');
    expect(typeof playWinSound).toBe('function');
    expect(typeof playChaseSound).toBe('function');
  });

  test('playButtonSound does not throw', function () {
    expect(function () { playButtonSound(); }).not.toThrow();
  });

  test('playRunSound does not throw', function () {
    expect(function () { playRunSound(); }).not.toThrow();
  });

  test('playBoundarySound does not throw', function () {
    expect(function () { playBoundarySound(); }).not.toThrow();
  });

  test('playWicketSound does not throw', function () {
    expect(function () { playWicketSound(); }).not.toThrow();
  });

  test('playWinSound does not throw', function () {
    expect(function () { playWinSound(); }).not.toThrow();
  });

  test('playChaseSound does not throw', function () {
    expect(function () { playChaseSound(); }).not.toThrow();
  });

  test('calling twice does not throw', function () {
    expect(function () {
      playRunSound();
      playRunSound();
    }).not.toThrow();
  });

  test('all functions can be called in sequence without error', function () {
    expect(function () {
      playButtonSound();
      playRunSound();
      playBoundarySound();
      playWicketSound();
      playWinSound();
      playChaseSound();
    }).not.toThrow();
  });
});
