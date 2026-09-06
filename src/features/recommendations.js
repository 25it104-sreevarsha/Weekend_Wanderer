import { qs, qsa } from "../utils/dom.js";
import { state, setQuizAnswer, resetQuiz } from "../state.js";
import { getRecommendations } from "../logic.js";
import { cardHTML } from "./cards.js";

// FEATURE: Personalized Destination Recommendations
export function initRecommendationQuiz() {
  qsa(".quiz-chip").forEach((chip) => {
    chip.type = "button";
    chip.setAttribute("aria-pressed", "false");

    chip.addEventListener("click", () => {
      const group = chip.dataset.group;

      qsa(`.quiz-chip[data-group="${group}"]`).forEach((c) => {
        const selected = c === chip;
        c.classList.toggle("selected", selected);
        c.setAttribute("aria-pressed", String(selected));
      });

      setQuizAnswer(group, chip.dataset.value);
    });
  });

  const resetButton = qs("#quiz-reset");
  if (resetButton) {
    resetButton.type = "button";
    resetButton.addEventListener("click", () => {
      qsa(".quiz-chip").forEach((c) => {
        c.classList.remove("selected");
        c.setAttribute("aria-pressed", "false");
      });
      resetQuiz();
    });
  }
}

export function renderRecommendations() {
  const grid = qs("#recommendations-grid");
  const prompt = qs("#recommendations-prompt");
  const { vibe, pace, distance } = state.quizAnswers;

  if (!grid || !prompt) return;

  if (!vibe && !pace && !distance) {
    prompt.hidden = false;
    grid.hidden = true;
    grid.innerHTML = "";
    return;
  }

  prompt.hidden = true;
  grid.hidden = false;

  const matches = getRecommendations(
    state.destinations,
    state.quizAnswers,
    3
  );

  if (matches.length === 0) {
    grid.innerHTML =
      '<p class="empty-state">No strong matches for that combination yet — try a different mood or pace.</p>';
    return;
  }

  const maxScore = 4; // 2 (vibe) + 1 (pace) + 1 (distance)

  grid.innerHTML = matches
    .map(({ dest, score }) =>
      cardHTML(dest, {
        matchPct: Math.round((score / maxScore) * 100),
      })
    )
    .join("");
}
