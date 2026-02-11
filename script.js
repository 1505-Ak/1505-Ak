const modes = [
  {
    id: "replace",
    label: "Replace Finder",
    description: "For power users who want dual-pane, tabs, and richer file operations.",
  },
  {
    id: "organize",
    label: "Organize in background",
    description: "For users who want downloads/desktop cleaned up automatically.",
  },
];

const tools = {
  replace: [
    {
      name: "Commander One",
      tags: { keyboard: 6, automation: 3, cloud: 7, lightweight: 4 },
      desc: "Dual-pane manager with cloud integrations like Google Drive and Dropbox.",
      type: "Power User",
    },
    {
      name: "Marta",
      tags: { keyboard: 9, automation: 2, cloud: 4, lightweight: 8 },
      desc: "Native, fast, keyboard-first file manager with extensibility.",
      type: "Power User",
    },
    {
      name: "Spacedrive",
      tags: { keyboard: 7, automation: 6, cloud: 10, lightweight: 3 },
      desc: "Open-source VDFS approach to unify files across devices and cloud.",
      type: "Power User",
    },
    {
      name: "Rectangle",
      tags: { keyboard: 8, automation: 2, cloud: 1, lightweight: 10 },
      desc: "Snap and manage Finder windows quickly with keyboard shortcuts.",
      type: "Lightweight Utility",
    },
  ],
  organize: [
    {
      name: "Hazel",
      tags: { keyboard: 4, automation: 10, cloud: 5, lightweight: 5 },
      desc: "Rule-based automation for sorting, renaming, and processing files.",
      type: "Automator",
    },
    {
      name: "TagSpaces",
      tags: { keyboard: 5, automation: 7, cloud: 8, lightweight: 6 },
      desc: "Tag and color files across folders; includes visual board workflows.",
      type: "Automator",
    },
    {
      name: "PearCleaner",
      tags: { keyboard: 2, automation: 6, cloud: 1, lightweight: 10 },
      desc: "Cleans app leftovers and orphan files to keep storage tidy.",
      type: "Lightweight Utility",
    },
    {
      name: "Alfred",
      tags: { keyboard: 10, automation: 8, cloud: 3, lightweight: 9 },
      desc: "Keyboard-driven launcher with workflows for file actions.",
      type: "Lightweight Utility",
    },
  ],
};

const modeChoices = document.getElementById("modeChoices");
const quizSection = document.getElementById("quizSection");
const quizForm = document.getElementById("quizForm");
const resultsEl = document.getElementById("results");
const resultsList = document.getElementById("resultsList");

let selectedMode = null;

for (const mode of modes) {
  const btn = document.createElement("button");
  btn.className = `choice-btn ${mode.id === "organize" ? "secondary" : ""}`;
  btn.innerHTML = `${mode.label}<br/><small>${mode.description}</small>`;
  btn.onclick = () => {
    selectedMode = mode.id;
    quizSection.classList.remove("hidden");
    resultsEl.classList.add("hidden");
  };
  modeChoices.appendChild(btn);
}

quizForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!selectedMode) return;

  const data = new FormData(quizForm);
  const weights = {
    keyboard: Number(data.get("keyboard")),
    automation: Number(data.get("automation")),
    cloud: Number(data.get("cloud")),
    lightweight: Number(data.get("lightweight")),
  };

  const ranked = tools[selectedMode]
    .map((tool) => ({
      ...tool,
      score:
        tool.tags.keyboard * weights.keyboard +
        tool.tags.automation * weights.automation +
        tool.tags.cloud * weights.cloud +
        tool.tags.lightweight * weights.lightweight,
    }))
    .sort((a, b) => b.score - a.score);

  const picked = ranked.slice(0, 3);
  resultsList.innerHTML = picked
    .map(
      (tool) => `
        <article class="tool">
          <h3>${tool.name} <small>(${tool.type})</small></h3>
          <p>${tool.desc}</p>
        </article>
      `,
    )
    .join("");

  resultsEl.classList.remove("hidden");
});
