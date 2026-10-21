export const setupGuide = 'https://github.com/itspatmorgan/design-studio/blob/v0.1.2/src/platform/context/installing.md';
export const publishingGuide = 'https://github.com/itspatmorgan/design-studio/blob/main/src/platform/context/publishing.md';

// Examples of agent harnesses, independent of the installation procedure.
export const agentHarnesses = [
  { title: 'Codex', logo: '/images/logos/square-chatgpt.svg' },
  { title: 'Claude Code', logo: '/images/logos/square-claude.svg' },
  { title: 'Cursor', logo: '/images/logos/cursor.svg' },
];

export const publishingHosts = [
  { title: 'Vercel', logo: '/images/logos/vercel.svg' },
  { title: 'Netlify', logo: '/images/logos/netlify.svg' },
  { title: 'Cloudflare', logo: '/images/logos/cloudflare.svg' },
];

// One installation procedure, whether the person or their agent performs it.
export const installationPrompt = `Install Design Studio from release v0.1.2 using ${setupGuide}. Use the repository installation guide without a plugin installer. Help me choose a folder, preserve existing files, and verify the running preview. Then help me open the Design Studio folder in my agent harness.`;
export const configurationPrompt = 'Read AGENTS.md and help me configure my Design Studio. Start with the included examples and show me the running preview.';
export const publishingPrompt = "Help me publish my Design Studio with [hosting service] so [audience] can explore it. Follow my Design Studio's publishing instructions and guide me through setting up hosting. Review what will be shared and verify the published link.";
