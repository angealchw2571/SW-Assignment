function PasswordValidation(password) {
  const rank = {
    TOO_SHORT: 0,
    WEAK: 1,
    MEDIUM: 2,
    STRONG: 3,
    VERY_STRONG: 4,
  };

  function rankPassword(password) {
    let score = 0;
    const upper = /[A-Z]/,
      lower = /[a-z]/,
      number = /[0-9]/,
      special = /[^A-Za-z0-9]/,
      minLength = 8;

    if (password.length < minLength) {
      return rank.TOO_SHORT; // End early
    }

    // Increment the score for each of these conditions
    if (upper.test(password)) score++;
    if (lower.test(password)) score++;
    if (number.test(password)) score++;
    if (special.test(password)) score++;

    // Penalize if there aren't at least three char types
    if (score < 3) score--;

    if (password.length > minLength) {
      // Increment the score for every 2 chars longer than the minimum
      score += Math.floor((password.length - minLength) / 2);
    }

    // Return a ranking based on the calculated score
    if (score < 3) return rank.WEAK; // score is 2 or lower
    if (score < 4) return rank.MEDIUM; // score is 3
    if (score < 6) return rank.STRONG; // score is 4 or 5
    return rank.VERY_STRONG; // score is 6 or higher
  }

  // Test it...
  // const labels = ["Too Short", "Weak", "Medium", "Strong", "Very Strong"],
  const result = rankPassword(password);
  // message = labels[result] //? returns a num for the index of labels

  // console.log("number", result);
  // console.log("message", message);

  return result;
}

module.exports = PasswordValidation;
