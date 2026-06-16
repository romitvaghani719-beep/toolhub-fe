/** Example tool record for JSON import (matches backend createToolSchema). */
export const TOOL_JSON_PLACEHOLDER = {
  name: "Your Tool Name",
  description: "Short description of what the tool does.",
  website_url: "https://your-tool-website.com",
  category: "chat",
  logo_color: "oklch(0.6 0.15 250)",
  tags: ["Tag 1", "Tag 2", "Tag 3"],
  votes: 0,
  api_available: false,
  free_plan: true,
  open_source: false,
  pricing: "Freemium · $XX/mo",
  automation: "API / Webhooks / Zapier",
  community: "Discord / Forum / Docs",
  models: ["Model 1", "Model 2"],
  features: ["Feature one", "Feature two", "Feature three"],
  ai_capabilities: ["Capability one", "Capability two"],
  use_cases: ["Use case one", "Use case two", "Use case three"],
  featured: false,
} as const;

export const TOOL_JSON_TEMPLATE = JSON.stringify(TOOL_JSON_PLACEHOLDER, null, 2);

/** Bulk-import download template (array of one example record). */
export const TOOL_JSON_ARRAY_TEMPLATE = JSON.stringify([TOOL_JSON_PLACEHOLDER], null, 2);
