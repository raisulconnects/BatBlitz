const {
  determineTossWinner,
  formatOvers,
  getBallResult,
  shouldEndInnings,
  getChaseResult,
  getOppositeRole,
} = require('./game-logic');

describe('determineTossWinner', () => {
  describe('user wins', () => {
    test('rock beats scissors', () => {
      expect(determineTossWinner('rock', 'scissors')).toBe('user');
    });
    test('paper beats rock', () => {
      expect(determineTossWinner('paper', 'rock')).toBe('user');
    });
    test('scissors beats paper', () => {
      expect(determineTossWinner('scissors', 'paper')).toBe('user');
    });
  });

  describe('ai wins', () => {
    test('scissors loses to rock', () => {
      expect(determineTossWinner('scissors', 'rock')).toBe('ai');
    });
    test('rock loses to paper', () => {
      expect(determineTossWinner('rock', 'paper')).toBe('ai');
    });
    test('paper loses to scissors', () => {
      expect(determineTossWinner('paper', 'scissors')).toBe('ai');
    });
  });

  describe('ties', () => {
    test('rock vs rock', () => {
      expect(determineTossWinner('rock', 'rock')).toBe('tie');
    });
    test('paper vs paper', () => {
      expect(determineTossWinner('paper', 'paper')).toBe('tie');
    });
    test('scissors vs scissors', () => {
      expect(determineTossWinner('scissors', 'scissors')).toBe('tie');
    });
  });

  describe('edge cases', () => {
    test('returns null for invalid userPick', () => {
      expect(determineTossWinner('', 'rock')).toBeNull();
    });
    test('returns null for invalid aiPick', () => {
      expect(determineTossWinner('rock', null)).toBeNull();
    });
    test('returns null for missing aiPick', () => {
      expect(determineTossWinner('rock')).toBeNull();
    });
  });
});

describe('formatOvers', () => {
  test('0 balls = 0.0', () => {
    expect(formatOvers(0)).toBe('0.0');
  });
  test('1 ball = 0.1', () => {
    expect(formatOvers(1)).toBe('0.1');
  });
  test('5 balls = 0.5', () => {
    expect(formatOvers(5)).toBe('0.5');
  });
  test('6 balls = 1.0', () => {
    expect(formatOvers(6)).toBe('1.0');
  });
  test('7 balls = 1.1', () => {
    expect(formatOvers(7)).toBe('1.1');
  });
  test('12 balls = 2.0', () => {
    expect(formatOvers(12)).toBe('2.0');
  });
  test('13 balls = 2.1', () => {
    expect(formatOvers(13)).toBe('2.1');
  });

  describe('edge cases', () => {
    test('negative balls returns 0.0', () => {
      expect(formatOvers(-1)).toBe('0.0');
    });
    test('Infinity returns 0.0', () => {
      expect(formatOvers(Infinity)).toBe('0.0');
    });
    test('NaN returns 0.0', () => {
      expect(formatOvers(NaN)).toBe('0.0');
    });
    test('string returns 0.0', () => {
      expect(formatOvers('5')).toBe('0.0');
    });
    test('null returns 0.0', () => {
      expect(formatOvers(null)).toBe('0.0');
    });
  });
});

describe('getBallResult', () => {
  describe('match = out', () => {
    test('both pick 1', () => {
      expect(getBallResult(1, 1)).toEqual({ isOut: true, runs: 0 });
    });
    test('both pick 2', () => {
      expect(getBallResult(2, 2)).toEqual({ isOut: true, runs: 0 });
    });
    test('both pick 3', () => {
      expect(getBallResult(3, 3)).toEqual({ isOut: true, runs: 0 });
    });
    test('both pick 4', () => {
      expect(getBallResult(4, 4)).toEqual({ isOut: true, runs: 0 });
    });
    test('both pick 5', () => {
      expect(getBallResult(5, 5)).toEqual({ isOut: true, runs: 0 });
    });
    test('both pick 6', () => {
      expect(getBallResult(6, 6)).toEqual({ isOut: true, runs: 0 });
    });
  });

  describe('mismatch = runs', () => {
    test('batter 4, bowler 2 = 4 runs', () => {
      expect(getBallResult(4, 2)).toEqual({ isOut: false, runs: 4 });
    });
    test('batter 1, bowler 6 = 1 run', () => {
      expect(getBallResult(1, 6)).toEqual({ isOut: false, runs: 1 });
    });
    test('batter 6, bowler 1 = 6 runs', () => {
      expect(getBallResult(6, 1)).toEqual({ isOut: false, runs: 6 });
    });
  });

  describe('edge cases', () => {
    test('out-of-range low returns safe result', () => {
      expect(getBallResult(0, 3)).toEqual({ isOut: false, runs: 0 });
    });
    test('out-of-range high returns safe result', () => {
      expect(getBallResult(7, 3)).toEqual({ isOut: false, runs: 0 });
    });
    test('both out-of-range returns safe result', () => {
      expect(getBallResult(-1, 99)).toEqual({ isOut: false, runs: 0 });
    });
    test('null batter returns safe result', () => {
      expect(getBallResult(null, 3)).toEqual({ isOut: false, runs: 0 });
    });
    test('undefined bowler returns safe result', () => {
      expect(getBallResult(4, undefined)).toEqual({ isOut: false, runs: 0 });
    });
  });
});

describe('shouldEndInnings', () => {
  test('0 wickets, limit 1 → false', () => {
    expect(shouldEndInnings(0, 1)).toBe(false);
  });
  test('1 wicket, limit 1 → true', () => {
    expect(shouldEndInnings(1, 1)).toBe(true);
  });
  test('1 wicket, limit 10 → false', () => {
    expect(shouldEndInnings(1, 10)).toBe(false);
  });
  test('10 wickets, limit 10 → true', () => {
    expect(shouldEndInnings(10, 10)).toBe(true);
  });

  describe('over limits', () => {
    test('ends innings when balls reach ballsLimit', () => {
      expect(shouldEndInnings(5, 10, 20, 20)).toBe(true);
    });
    test('does not end when balls below ballsLimit', () => {
      expect(shouldEndInnings(5, 10, 19, 20)).toBe(false);
    });
    test('ends by wickets before ballsLimit', () => {
      expect(shouldEndInnings(10, 10, 5, 20)).toBe(true);
    });
    test('null ballsLimit means no over limit', () => {
      expect(shouldEndInnings(5, 10, 100, null)).toBe(false);
    });
    test('undefined ballsLimit means no over limit', () => {
      expect(shouldEndInnings(5, 10, 100)).toBe(false);
    });

    describe('edge cases', () => {
      test('negative balls returns false even with ballsLimit', () => {
        expect(shouldEndInnings(5, 10, -1, 20)).toBe(false);
      });
      test('NaN balls returns false', () => {
        expect(shouldEndInnings(5, 10, NaN, 20)).toBe(false);
      });
      test('string balls returns false', () => {
        expect(shouldEndInnings(5, 10, '5', 20)).toBe(false);
      });
    });
  });

  describe('edge cases', () => {
    test('negative wickets returns false', () => {
      expect(shouldEndInnings(-1, 1)).toBe(false);
    });
    test('negative limit returns false', () => {
      expect(shouldEndInnings(1, -1)).toBe(false);
    });
    test('NaN wickets returns false', () => {
      expect(shouldEndInnings(NaN, 1)).toBe(false);
    });
    test('string wickets returns false', () => {
      expect(shouldEndInnings('1', 1)).toBe(false);
    });
    test('null limit returns false', () => {
      expect(shouldEndInnings(1, null)).toBe(false);
    });
    test('undefined returns false', () => {
      expect(shouldEndInnings(undefined, 1)).toBe(false);
    });
  });
});

describe('getChaseResult', () => {
  test('score below target, under wicket limit → null (in progress)', () => {
    expect(getChaseResult(3, 10, 0, 1)).toBeNull();
  });
  test('score equals target → win', () => {
    expect(getChaseResult(10, 10, 0, 1)).toBe('win');
  });
  test('score exceeds target → win', () => {
    expect(getChaseResult(11, 10, 0, 1)).toBe('win');
  });
  test('wickets at limit, score below target → lose', () => {
    expect(getChaseResult(5, 10, 1, 1)).toBe('lose');
  });
  test('score equals target and wickets at limit → win (score checked first)', () => {
    expect(getChaseResult(10, 10, 1, 1)).toBe('win');
  });
  test('zero target, zero score, wicket limit not reached → win', () => {
    expect(getChaseResult(0, 0, 0, 1)).toBe('win');
  });

  describe('edge cases', () => {
    test('negative score returns null', () => {
      expect(getChaseResult(-1, 10, 0, 1)).toBeNull();
    });
    test('negative target returns null', () => {
      expect(getChaseResult(5, -5, 0, 1)).toBeNull();
    });
    test('NaN score returns null', () => {
      expect(getChaseResult(NaN, 10, 0, 1)).toBeNull();
    });
    test('string target returns null', () => {
      expect(getChaseResult(5, '10', 0, 1)).toBeNull();
    });
    test('null wickets returns null', () => {
      expect(getChaseResult(5, 10, null, 1)).toBeNull();
    });
    test('missing wicketsLimit returns null', () => {
      expect(getChaseResult(5, 10, 0)).toBeNull();
    });
  });
});

describe('getOppositeRole', () => {
  test('bat → bowl', () => {
    expect(getOppositeRole('bat')).toBe('bowl');
  });
  test('bowl → bat', () => {
    expect(getOppositeRole('bowl')).toBe('bat');
  });
  test('invalid returns null', () => {
    expect(getOppositeRole('invalid')).toBeNull();
  });
  test('empty string returns null', () => {
    expect(getOppositeRole('')).toBeNull();
  });
  test('null returns null', () => {
    expect(getOppositeRole(null)).toBeNull();
  });
  test('undefined returns null', () => {
    expect(getOppositeRole(undefined)).toBeNull();
  });
});
