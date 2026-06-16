import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFilterStore } from "@/stores";
import { useTools } from "@/hooks/use-api";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";
import Pagination from "@/components/Pagination";

const CATEGORIES = [
  { id: "chat", name: "Chat & Assistants" },
  { id: "code", name: "Code & Dev" },
  { id: "image", name: "Image Generation" },
  { id: "writing", name: "Writing" },
  { id: "audio", name: "Audio & Video" },
  { id: "auto", name: "Automation" },
  { id: "data", name: "Data & Analytics" },
  { id: "search", name: "Search & Research" },
];

const CATEGORY_COLORS: Record<string, string> = {
  chat: "oklch(0.62 0.17 312)",
  code: "oklch(0.56 0.16 28)",
  image: "oklch(0.68 0.16 320)",
  writing: "oklch(0.7 0.16 72)",
  audio: "oklch(0.66 0.18 35)",
  auto: "oklch(0.61 0.16 210)",
  data: "oklch(0.6 0.15 255)",
  search: "oklch(0.62 0.14 160)",
};

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "??";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export default function BrowsePage() {
  const { search, category, sort, page, setSearch, setCategory, setSort, setPage } =
    useFilterStore();
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (debouncedSearch !== search) {
      setSearch(debouncedSearch);
    }
  }, [debouncedSearch, search, setSearch]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const { data, isLoading, isFetching, isError, error } = useTools({
    page,
    limit: 12,
    search: search || undefined,
    category: category || undefined,
    sort,
  });

  const showSpinner = isLoading || (isFetching && !data);

  return (
    <div className="content">
      <div className="browse__bar">
        <input
          className="input browse__search"
          placeholder="Search tools…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <div className="browse__filters">
          <select className="select browse__select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select className="select browse__select" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="newest">Newest</option>
            <option value="name">A → Z</option>
            <option value="votes">Most votes</option>
          </select>
        </div>
        <Link to="/add" className="browse__add">
          <Button className="browse__add-btn">Add tool</Button>
        </Link>
      </div>

      {showSpinner && (
        <div className="card">
          <LoadingSpinner />
        </div>
      )}
      {isError && (
        <div className="empty card">{(error as Error).message}</div>
      )}
      {!showSpinner && !isError && data?.items.length === 0 && (
        <div className="empty card">
          <div style={{ fontWeight: 650 }}>No tools found</div>
          <p style={{ color: "var(--text-3)", marginTop: 4 }}>Try adjusting your search or filters.</p>
        </div>
      )}

      {!showSpinner && data && data.items.length > 0 && (
        <>
          <div className="tools-grid">
            {data.items.map((tool) => {
              const tags = Array.isArray(tool.tags) ? tool.tags : [];
              const votes = typeof tool.votes === "number" ? tool.votes : 0;
              return (
              <Link key={tool.id} to={`/tools/${tool.id}`} className="tool-card fade-in">
                <div className="tool-card__top">
                  <div
                    className="logo-tile"
                    style={{
                      width: 40,
                      height: 40,
                      fontSize: 13,
                      background: tool.logo_color ?? CATEGORY_COLORS[tool.category] ?? "var(--accent)",
                      color: "var(--surface)",
                    }}
                  >
                    {getInitials(tool.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="tool-card__name">{tool.name}</div>
                    <div className="tool-card__cat">{tool.category}</div>
                  </div>
                </div>
                <div className="tool-card__desc">{tool.description}</div>
                <div className="tool-card__tags">
                  {tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag tag--mono">{tag}</span>
                  ))}
                </div>
                <div className="tool-card__foot">
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {tool.api_available && <span className="badge badge--blue">API</span>}
                    {tool.free_plan && <span className="badge badge--green">Free</span>}
                    {tool.open_source && <span className="badge badge--violet">Open source</span>}
                    {tool.featured && <span className="badge badge--amber">Featured</span>}
                  </div>
                  <span className="tag tag--mono">{votes} votes</span>
                </div>
              </Link>
            );
            })}
          </div>

          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
