const MODES = [
  {
    id: "replace",
    label: "Replace Finder",
    description: "Dual-pane managers, tabs, and richer file control.",
  },
  {
    id: "organize",
    label: "Keep Finder + Automate",
    description: "Background sorting and cleanup with minimal disruption.",
  },
];

const TOOL_CATALOG = {
  replace: [
    {
      name: "Commander One",
      type: "Power User Manager",
      desc: "Dual-pane manager with cloud integrations (Google Drive, Dropbox).",
      tags: { keyboard: 6, automation: 3, cloud: 7, lightweight: 4 },
    },
    {
      name: "Marta",
      type: "Power User Manager",
      desc: "Native and keyboard-centric manager focused on speed and extensibility.",
      tags: { keyboard: 9, automation: 2, cloud: 4, lightweight: 8 },
    },
    {
      name: "Spacedrive",
      type: "Power User Manager",
      desc: "Open-source approach to organizing files across devices/cloud sources.",
      tags: { keyboard: 7, automation: 6, cloud: 10, lightweight: 3 },
    },
    {
      name: "Rectangle",
      type: "Utility",
      desc: "Window snapping for faster Finder and file-manager workflows.",
      tags: { keyboard: 8, automation: 2, cloud: 1, lightweight: 10 },
    },
  ],
  organize: [
    {
      name: "Hazel",
      type: "Automator",
      desc: "Rule-based sorting, renaming, and filing for Downloads/Desktop.",
      tags: { keyboard: 4, automation: 10, cloud: 5, lightweight: 5 },
    },
    {
      name: "TagSpaces",
      type: "Automator",
      desc: "Tag and color files regardless of folder structure.",
      tags: { keyboard: 5, automation: 7, cloud: 8, lightweight: 6 },
    },
    {
      name: "Alfred",
      type: "Utility",
      desc: "Keyboard launcher and workflows for quick file actions.",
      tags: { keyboard: 10, automation: 8, cloud: 3, lightweight: 9 },
    },
    {
      name: "PearCleaner",
      type: "Utility",
      desc: "Removes orphan files left behind after app uninstall.",
      tags: { keyboard: 2, automation: 6, cloud: 1, lightweight: 10 },
    },
  ],
};

const modeChoices = document.getElementById("modeChoices");
const quizSection = document.getElementById("quizSection");
const quizForm = document.getElementById("quizForm");
const resultsSection = document.getElementById("results");
const resultsSummary = document.getElementById("resultsSummary");
const resultsList = document.getElementById("resultsList");

let selectedMode = null;

for (const mode of MODES) {
  const button = document.createElement("button");
  button.className = `mode-btn ${mode.id === "organize" ? "alt" : ""}`;
  button.innerHTML = `${mode.label}<small>${mode.description}</small>`;
  button.type = "button";
  button.addEventListener("click", () => {
    selectedMode = mode.id;
    quizSection.classList.remove("hidden");
    resultsSection.classList.add("hidden");
  });
  modeChoices.appendChild(button);
}

function rankTools(mode, weights) {
  return TOOL_CATALOG[mode]
    .map((tool) => ({
      ...tool,
      score:
        tool.tags.keyboard * weights.keyboard +
        tool.tags.automation * weights.automation +
        tool.tags.cloud * weights.cloud +
        tool.tags.lightweight * weights.lightweight,
    }))
    .sort((a, b) => b.score - a.score);
}

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!selectedMode) {
    resultsSummary.textContent = "Pick a direction first so recommendations are relevant.";
    resultsSection.classList.remove("hidden");
    return;
  }

  const formData = new FormData(quizForm);
  const weights = {
    keyboard: Number(formData.get("keyboard")),
    automation: Number(formData.get("automation")),
    cloud: Number(formData.get("cloud")),
    lightweight: Number(formData.get("lightweight")),
  };

  const recommendations = rankTools(selectedMode, weights).slice(0, 3);
  resultsSummary.textContent =
    selectedMode === "replace"
      ? "You prefer a stronger Finder replacement stack."
      : "You prefer keeping Finder and layering automation/utilities.";

  resultsList.innerHTML = recommendations
    .map(
      (tool, index) => `
        <article class="tool">
          <h3>#${index + 1} ${tool.name} <small>(${tool.type})</small></h3>
          <p>${tool.desc}</p>
        </article>
      `,
    )
    .join("");

  resultsSection.classList.remove("hidden");
});
