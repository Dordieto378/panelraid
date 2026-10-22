import { useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import ArticleCard from "./ArticleCard";
import { categories, type ArticleSummary } from "../lib/types";

export default function ArticleFeed({
  articles,
  initialCategory = "All",
  pageSize = 6,
  showFilters = true,
}: {
  articles: ArticleSummary[];
  initialCategory?: string;
  pageSize?: number;
  showFilters?: boolean;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [limit, setLimit] = useState(pageSize);
  const filtered =
    category === "All"
      ? articles
      : articles.filter((a) => a.category === category);
  return (
    <div className="feed">
      {showFilters && (
        <div
          className="feed-filters"
          role="group"
          aria-label="Filter stories by category"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={category === cat ? "selected" : ""}
              aria-pressed={category === cat}
              onClick={() => {
                setCategory(cat);
                setLimit(pageSize);
              }}
            >
              {cat === "All" ? "All stories" : cat}
            </button>
          ))}
          <a href="/news/" className="feed-all">
            Browse all <ArrowUpRight size={15} />
          </a>
        </div>
      )}
      <div className="article-grid" aria-live="polite">
        {filtered.slice(0, limit).map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="feed-empty">
          More perspectives are on their way. Explore another category in the
          meantime.
        </div>
      )}
      {filtered.length > limit && (
        <button
          className="load-more"
          onClick={() => setLimit(limit + pageSize)}
        >
          Load more stories <ArrowDown size={16} />
        </button>
      )}
      {filtered.length > 0 &&
        filtered.length <= limit &&
        filtered.length > pageSize && (
          <p className="feed-end">
            You’re all caught up. Go find your next obsession.
          </p>
        )}
    </div>
  );
}
