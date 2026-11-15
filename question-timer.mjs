export function createQuestionTimer(now = () => performance.now()) {
  const elapsedByQuestion = [];
  let running = null;

  function assertQuestionIndex(index) {
    if (!Number.isInteger(index) || index < 0) {
      throw new RangeError("Question timer index must be a non-negative integer.");
    }
  }

  function pause(index) {
    if (!running || (index !== undefined && index !== running.index)) return;
    elapsedByQuestion[running.index] += Math.max(0, now() - running.startedAt);
    running = null;
  }

  return {
    start(index) {
      assertQuestionIndex(index);
      if (running?.index === index) return;
      pause();
      elapsedByQuestion[index] ??= 0;
      running = { index, startedAt: now() };
    },
    pause,
    elapsed(index) {
      assertQuestionIndex(index);
      const accumulated = elapsedByQuestion[index] || 0;
      if (running?.index !== index) return accumulated;
      return accumulated + Math.max(0, now() - running.startedAt);
    },
    reset() {
      elapsedByQuestion.length = 0;
      running = null;
    }
  };
}
