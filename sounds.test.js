const {
  playButtonSound,
  playRunSound,
  playBoundarySound,
  playSixSound,
  playWicketSound,
  playWinSound,
  playChaseSound,
  playTossRevealSound,
} = require('./sounds');

describe('sound functions', function () {
  test('all exported functions are present', function () {
    expect(typeof playButtonSound).toBe('function');
    expect(typeof playRunSound).toBe('function');
    expect(typeof playBoundarySound).toBe('function');
    expect(typeof playSixSound).toBe('function');
    expect(typeof playWicketSound).toBe('function');
    expect(typeof playWinSound).toBe('function');
    expect(typeof playChaseSound).toBe('function');
    expect(typeof playTossRevealSound).toBe('function');
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

  test('playSixSound does not throw', function () {
    expect(function () { playSixSound(); }).not.toThrow();
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

  test('playTossRevealSound does not throw', function () {
    expect(function () { playTossRevealSound(); }).not.toThrow();
  });

  test('calling a sound twice does not throw', function () {
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
      playSixSound();
      playWicketSound();
      playWinSound();
      playChaseSound();
      playTossRevealSound();
    }).not.toThrow();
  });
});
