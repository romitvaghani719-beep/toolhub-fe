/* ============================================================
   Mock data for the AI Tools Directory
   (logos are colored monograms — no real brand marks)
   ============================================================ */

const CATEGORIES = [
  { id: "chat",    name: "Chat & Assistants", color: "oklch(0.62 0.17 46)",  icon: "message" },
  { id: "code",    name: "Code & Dev",        color: "oklch(0.6 0.15 250)",  icon: "code" },
  { id: "image",   name: "Image Generation",  color: "oklch(0.6 0.16 300)",  icon: "image" },
  { id: "writing", name: "Writing",           color: "oklch(0.62 0.15 155)", icon: "pen" },
  { id: "audio",   name: "Audio & Video",     color: "oklch(0.6 0.16 20)",   icon: "wave" },
  { id: "auto",    name: "Automation",        color: "oklch(0.6 0.15 200)",  icon: "bolt" },
  { id: "data",    name: "Data & Analytics",  color: "oklch(0.58 0.14 270)", icon: "chart" },
  { id: "search",  name: "Search & Research", color: "oklch(0.6 0.15 130)",  icon: "search" },
];

const catName = (id) => (CATEGORIES.find(c => c.id === id) || {}).name || id;
const catColor = (id) => (CATEGORIES.find(c => c.id === id) || {}).color || "var(--text-3)";

const MEMBERS = [
  { id: "john",  name: "John Carter",   role: "Research Lead",   color: "oklch(0.62 0.17 46)" },
  { id: "sarah", name: "Sarah Nguyen",  role: "Product Manager", color: "oklch(0.6 0.16 300)" },
  { id: "mike",  name: "Mike Alvarez",  role: "Engineer",        color: "oklch(0.6 0.15 250)" },
  { id: "alex",  name: "Alex Petrov",   role: "Designer",        color: "oklch(0.62 0.15 155)" },
  { id: "priya", name: "Priya Shah",    role: "Analyst",         color: "oklch(0.6 0.16 20)" },
];
const memberName = (id) => (MEMBERS.find(m => m.id === id) || {}).name || id;
const memberColor = (id) => (MEMBERS.find(m => m.id === id) || {}).color || "var(--text-3)";

const TOOLS = [
  {
    id: "t1", name: "Orion Chat", logoColor: "oklch(0.62 0.17 46)", category: "chat",
    website: "orionchat.ai", description: "Conversational assistant for drafting, summarizing and reasoning across long documents with citations.",
    tags: ["LLM", "Assistant", "Summarize"], votes: 342, apiAvailable: true, freePlan: true, openSource: false,
    pricing: "Freemium · $20/mo Pro", automation: "Webhooks + Zapier", community: "Active Discord",
    models: ["GPT-4o", "Claude 3.5", "Gemini 1.5"],
    features: ["Long-context document chat", "Inline citations & sources", "Custom assistants / personas", "Team workspaces"],
    aiCapabilities: ["Reasoning", "Summarization", "Code help", "Vision (image input)"],
    useCases: ["Summarize research papers", "Draft customer replies", "Analyze meeting notes"],
    addedBy: "john", dateAdded: "2026-06-15", lastUpdated: "2 days ago", featured: true,
  },
  {
    id: "t2", name: "Quillstream", logoColor: "oklch(0.62 0.15 155)", category: "writing",
    website: "quillstream.io", description: "AI writing workspace with tone control, brand voice memory and one-click long-form drafting.",
    tags: ["Writing", "Marketing", "SEO"], votes: 271, apiAvailable: true, freePlan: true, openSource: false,
    pricing: "Freemium · $15/mo", automation: "Zapier + API", community: "Community forum",
    models: ["GPT-4o", "Claude 3.5"],
    features: ["Brand voice profiles", "Long-form outlines", "Plagiarism check", "Multi-language output"],
    aiCapabilities: ["Generation", "Rewriting", "Tone adjustment"],
    useCases: ["Blog posts", "Ad copy", "Email campaigns"],
    addedBy: "sarah", dateAdded: "2026-06-15", lastUpdated: "5 hours ago", featured: false,
  },
  {
    id: "t3", name: "Forge IDE", logoColor: "oklch(0.6 0.15 250)", category: "code",
    website: "forge.dev", description: "AI pair-programmer in your editor — multi-file edits, repo-aware chat and inline test generation.",
    tags: ["Coding", "IDE", "Agent"], votes: 418, apiAvailable: true, freePlan: false, openSource: false,
    pricing: "$20/mo · Team $40/seat", automation: "CLI + CI hooks", community: "GitHub + Discord",
    models: ["GPT-4o", "Claude 3.5 Sonnet"],
    features: ["Repo-aware completions", "Multi-file refactors", "Inline test generation", "Terminal command suggestions"],
    aiCapabilities: ["Code generation", "Debugging", "Refactoring", "Agentic edits"],
    useCases: ["Refactor legacy code", "Write unit tests", "Explain unfamiliar repos"],
    addedBy: "mike", dateAdded: "2026-06-14", lastUpdated: "1 day ago", featured: true,
  },
  {
    id: "t4", name: "Lumen Vision", logoColor: "oklch(0.6 0.16 300)", category: "image",
    website: "lumenvision.art", description: "Text-to-image studio with consistent characters, style presets and high-res upscaling.",
    tags: ["Image", "Design", "Generative"], votes: 305, apiAvailable: true, freePlan: true, openSource: false,
    pricing: "Credits · from $10", automation: "REST API", community: "Showcase gallery",
    models: ["Diffusion XL", "In-house v3"],
    features: ["Character consistency", "Style reference upload", "4K upscaling", "Batch generation"],
    aiCapabilities: ["Image generation", "Inpainting", "Style transfer"],
    useCases: ["Marketing visuals", "Concept art", "Product mockups"],
    addedBy: "alex", dateAdded: "2026-06-14", lastUpdated: "3 days ago", featured: false,
  },
  {
    id: "t5", name: "Cadence Flow", logoColor: "oklch(0.6 0.15 200)", category: "auto",
    website: "cadenceflow.com", description: "Visual automation builder that wires LLM steps between your apps with human-in-the-loop approvals.",
    tags: ["Automation", "Workflow", "No-code"], votes: 198, apiAvailable: true, freePlan: true, openSource: false,
    pricing: "Freemium · $29/mo", automation: "Native — it IS automation", community: "Templates library",
    models: ["Bring your own key"],
    features: ["Drag-and-drop flows", "200+ app connectors", "Human approval steps", "Scheduled runs"],
    aiCapabilities: ["Orchestration", "Routing", "Data extraction"],
    useCases: ["Lead enrichment", "Ticket triage", "Report generation"],
    addedBy: "john", dateAdded: "2026-06-13", lastUpdated: "4 days ago", featured: false,
  },
  {
    id: "t6", name: "Echo Transcribe", logoColor: "oklch(0.6 0.16 20)", category: "audio",
    website: "echo.audio", description: "Speech-to-text and meeting intelligence with speaker labels, summaries and action items.",
    tags: ["Audio", "Transcription", "Meetings"], votes: 156, apiAvailable: true, freePlan: true, openSource: true,
    pricing: "Free tier · $12/mo", automation: "Webhooks", community: "Open-source core",
    models: ["Whisper v3", "In-house diarizer"],
    features: ["Speaker diarization", "Auto summaries", "Action-item extraction", "40+ languages"],
    aiCapabilities: ["Transcription", "Summarization", "Translation"],
    useCases: ["Meeting notes", "Podcast captions", "Interview analysis"],
    addedBy: "priya", dateAdded: "2026-06-13", lastUpdated: "1 week ago", featured: false,
  },
  {
    id: "t7", name: "Insight Grid", logoColor: "oklch(0.58 0.14 270)", category: "data",
    website: "insightgrid.io", description: "Chat with your databases and spreadsheets — natural-language queries, charts and scheduled digests.",
    tags: ["Data", "SQL", "BI"], votes: 224, apiAvailable: true, freePlan: false, openSource: false,
    pricing: "$25/mo · Team $50", automation: "Slack + email digests", community: "Slack community",
    models: ["GPT-4o", "In-house SQL model"],
    features: ["Natural-language SQL", "Auto chart selection", "Scheduled digests", "Row-level security"],
    aiCapabilities: ["Query generation", "Data analysis", "Visualization"],
    useCases: ["Ad-hoc analytics", "KPI dashboards", "Exec summaries"],
    addedBy: "mike", dateAdded: "2026-06-12", lastUpdated: "6 days ago", featured: false,
  },
  {
    id: "t8", name: "Scout Research", logoColor: "oklch(0.6 0.15 130)", category: "search",
    website: "scout.so", description: "Answer engine that searches the live web and your private docs, returning sourced, structured answers.",
    tags: ["Search", "Research", "RAG"], votes: 289, apiAvailable: true, freePlan: true, openSource: false,
    pricing: "Freemium · $18/mo", automation: "API + browser ext", community: "Public roadmap",
    models: ["GPT-4o", "Claude 3.5"],
    features: ["Live web + private docs", "Structured citations", "Follow-up threads", "Browser extension"],
    aiCapabilities: ["Retrieval (RAG)", "Synthesis", "Citation"],
    useCases: ["Market research", "Competitive analysis", "Literature review"],
    addedBy: "sarah", dateAdded: "2026-06-12", lastUpdated: "2 days ago", featured: true,
  },
  {
    id: "t9", name: "Mosaic Deck", logoColor: "oklch(0.62 0.16 70)", category: "writing",
    website: "mosaicdeck.app", description: "Turn a prompt or doc into a polished slide deck with on-brand layouts and speaker notes.",
    tags: ["Slides", "Presentation", "Design"], votes: 167, apiAvailable: false, freePlan: true, openSource: false,
    pricing: "Free · $14/mo Pro", automation: "Export to PPTX", community: "Template gallery",
    models: ["GPT-4o"],
    features: ["Doc-to-deck", "Brand themes", "Speaker notes", "PPTX export"],
    aiCapabilities: ["Generation", "Layout", "Summarization"],
    useCases: ["Pitch decks", "Internal reviews", "Lecture slides"],
    addedBy: "alex", dateAdded: "2026-06-11", lastUpdated: "1 week ago", featured: false,
  },
  {
    id: "t10", name: "Sentinel Guard", logoColor: "oklch(0.58 0.15 30)", category: "code",
    website: "sentinelguard.dev", description: "AI code-security reviewer that flags vulnerabilities and secrets in pull requests automatically.",
    tags: ["Security", "DevOps", "Review"], votes: 143, apiAvailable: true, freePlan: false, openSource: true,
    pricing: "$15/seat/mo", automation: "GitHub Actions", community: "Open-source rules",
    models: ["In-house security model"],
    features: ["PR vulnerability scan", "Secret detection", "Fix suggestions", "SOC2 reports"],
    aiCapabilities: ["Static analysis", "Pattern detection", "Remediation"],
    useCases: ["Secure code review", "Compliance", "Secret scanning"],
    addedBy: "mike", dateAdded: "2026-06-11", lastUpdated: "3 days ago", featured: false,
  },
  {
    id: "t11", name: "Nova Assistant", logoColor: "oklch(0.6 0.16 330)", category: "chat",
    website: "novaassistant.ai", description: "Voice-first personal assistant that books, drafts and schedules across your connected accounts.",
    tags: ["Assistant", "Voice", "Productivity"], votes: 132, apiAvailable: true, freePlan: true, openSource: false,
    pricing: "Freemium · $16/mo", automation: "Calendar + email", community: "Beta community",
    models: ["GPT-4o", "In-house voice"],
    features: ["Voice commands", "Calendar booking", "Email drafting", "Cross-app memory"],
    aiCapabilities: ["Reasoning", "Speech", "Task automation"],
    useCases: ["Schedule meetings", "Triage inbox", "Daily briefings"],
    addedBy: "priya", dateAdded: "2026-06-10", lastUpdated: "5 days ago", featured: false,
  },
  {
    id: "t12", name: "Pixel Motion", logoColor: "oklch(0.6 0.16 350)", category: "audio",
    website: "pixelmotion.video", description: "Generate and edit short videos from scripts with AI voiceover, captions and stock footage.",
    tags: ["Video", "Generative", "Editing"], votes: 211, apiAvailable: true, freePlan: true, openSource: false,
    pricing: "Credits · from $12", automation: "REST API", community: "Creator showcase",
    models: ["In-house video v2", "ElevenVoice"],
    features: ["Script-to-video", "AI voiceover", "Auto captions", "Stock library"],
    aiCapabilities: ["Video generation", "Voice synthesis", "Editing"],
    useCases: ["Social clips", "Explainers", "Ads"],
    addedBy: "alex", dateAdded: "2026-06-10", lastUpdated: "1 week ago", featured: false,
  },
];

const toolById = (id) => TOOLS.find(t => t.id === id);

/* Recent activity log (grouped by day in the screen) */
const ACTIVITY = [
  { id: "a1", toolId: "t1", member: "john",  action: "added",   date: "2026-06-15", time: "14:22" },
  { id: "a2", toolId: "t2", member: "sarah", action: "added",   date: "2026-06-15", time: "11:08" },
  { id: "a3", toolId: "t1", member: "john",  action: "updated", date: "2026-06-15", time: "09:45" },
  { id: "a4", toolId: "t3", member: "mike",  action: "added",   date: "2026-06-14", time: "16:30" },
  { id: "a5", toolId: "t4", member: "alex",  action: "added",   date: "2026-06-14", time: "13:12" },
  { id: "a6", toolId: "t10",member: "mike",  action: "updated", date: "2026-06-14", time: "10:05" },
  { id: "a7", toolId: "t5", member: "john",  action: "added",   date: "2026-06-13", time: "15:48" },
  { id: "a8", toolId: "t6", member: "priya", action: "added",   date: "2026-06-13", time: "12:20" },
  { id: "a9", toolId: "t7", member: "mike",  action: "added",   date: "2026-06-12", time: "17:02" },
  { id: "a10",toolId: "t8", member: "sarah", action: "added",   date: "2026-06-12", time: "09:30" },
];

/* Per-member analytics */
const MEMBER_STATS = {
  john:  { added: 28, avgFill: "6m 12s", first: "Mar 2026", last: "Today",       score: 100 },
  sarah: { added: 22, avgFill: "5m 04s", first: "Mar 2026", last: "Today",       score: 79 },
  mike:  { added: 19, avgFill: "7m 41s", first: "Apr 2026", last: "Yesterday",   score: 68 },
  alex:  { added: 14, avgFill: "8m 18s", first: "Apr 2026", last: "Yesterday",   score: 50 },
  priya: { added: 9,  avgFill: "5m 55s", first: "May 2026", last: "2 days ago",  score: 32 },
};

const TEMPLATE_JSON = `[
  {
    "name": "Example Tool",
    "website": "example.ai",
    "category": "chat",
    "description": "Short description of what the tool does.",
    "tags": ["LLM", "Assistant"],
    "apiAvailable": true,
    "freePlan": true,
    "openSource": false,
    "pricing": "Freemium · $20/mo",
    "models": ["GPT-4o"],
    "features": ["Feature one", "Feature two"]
  }
]`;

Object.assign(window, {
  CATEGORIES, catName, catColor,
  MEMBERS, memberName, memberColor,
  TOOLS, toolById,
  ACTIVITY, MEMBER_STATS, TEMPLATE_JSON,
});
