function determineTossWinner(userPick, aiPick) {
  if (!userPick || !aiPick) return null;
  if (userPick === aiPick) return 'tie';
  const userWins = (
    (userPick === 'rock' && aiPick === 'scissors') ||
    (userPick === 'paper' && aiPick === 'rock') ||
    (userPick === 'scissors' && aiPick === 'paper')
  );
  return userWins ? 'user' : 'ai';
}

function formatOvers(balls) {
  if (typeof balls !== 'number' || balls < 0 || !Number.isFinite(balls)) return '0.0';
  return Math.floor(balls / 6) + '.' + (balls % 6);
}

function getBallResult(batterPick, bowlerPick) {
  const valid = [1, 2, 3, 4, 5, 6];
  if (!valid.includes(batterPick) || !valid.includes(bowlerPick)) {
    return { isOut: false, runs: 0 };
  }
  const isOut = batterPick === bowlerPick;
  return { isOut, runs: isOut ? 0 : batterPick };
}

function shouldEndInnings(wickets, wicketsLimit, balls, ballsLimit) {
  if (typeof wickets !== 'number' || typeof wicketsLimit !== 'number') return false;
  if (!Number.isFinite(wickets) || !Number.isFinite(wicketsLimit)) return false;
  if (wickets < 0 || wicketsLimit < 0) return false;
  if (wickets >= wicketsLimit) return true;
  if (ballsLimit !== null && ballsLimit !== undefined) {
    if (typeof balls !== 'number' || !Number.isFinite(balls) || balls < 0) return false;
    if (balls >= ballsLimit) return true;
  }
  return false;
}

function getChaseResult(score, target, wickets, wicketsLimit) {
  if (
    typeof score !== 'number' || typeof target !== 'number' ||
    typeof wickets !== 'number' || typeof wicketsLimit !== 'number'
  ) return null;
  if (
    !Number.isFinite(score) || !Number.isFinite(target) ||
    !Number.isFinite(wickets) || !Number.isFinite(wicketsLimit)
  ) return null;
  if (score < 0 || target < 0 || wickets < 0 || wicketsLimit < 0) return null;
  if (score >= target) return 'win';
  if (wickets >= wicketsLimit) return 'lose';
  return null;
}

function getOppositeRole(role) {
  if (role === 'bat') return 'bowl';
  if (role === 'bowl') return 'bat';
  return null;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    determineTossWinner,
    formatOvers,
    getBallResult,
    shouldEndInnings,
    getChaseResult,
    getOppositeRole,
  };
}
