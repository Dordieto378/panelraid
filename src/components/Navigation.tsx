import { useEffect, useRef, useState } from "react";
import { Search, X, Menu, ArrowUpRight } from "lucide-react";
import type { Article } from "../lib/types";
import { imageSrcSet } from "../lib/images";

type SearchArticle = Pick<Article, "title" | "slug" | "category" | "image">;

export default function Navigation({
  articles,
  active = "",
}: {
  articles: SearchArticle[];
  active?: string;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const links = [
    ["News", "/news/"],
    ["Anime", "/category/anime/"],
    ["Manga", "/category/manga/"],
    ["Reviews", "/category/reviews/"],
    ["Gaming", "/category/gaming/"],
    ["The Loot", "/the-loot/"],
  ];

  useEffect(() => {
    if (searchOpen) {
      dialog.current?.showModal();
      searchInput.current?.focus();
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
    dialog.current?.close();
  }, [searchOpen]);

  const results = articles
    .filter((article) =>
      `${article.title} ${article.category}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
    )
    .slice(0, 7);
  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`main-nav ${menuOpen ? "is-open" : ""}`}
      >
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            className={active === label ? "active" : ""}
            aria-current={active === label ? "page" : undefined}
          >
            {label}
            {label === "The Loot" && <span className="nav-new">NEW</span>}
          </a>
        ))}
      </nav>
      <div className="nav-actions">
        <button
          ref={searchButton}
          className="icon-button search-toggle"
          aria-label="Search articles"
          onClick={() => setSearchOpen(true)}
        >
          <Search size={21} strokeWidth={1.8} />
        </button>
        <a href="/newsletter/" className="newsletter-nav">
          The weekly raid <ArrowUpRight size={15} />
        </a>
        <button
          className="icon-button menu-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
      <dialog
        ref={dialog}
        className="search-dialog"
        aria-label="Search Panelraid stories"
        onKeyDownCapture={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            setSearchOpen(false);
          }
        }}
        onCancel={() => setSearchOpen(false)}
        onClose={() => {
          setSearchOpen(false);
          searchButton.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) setSearchOpen(false);
        }}
      >
        <div className="search-panel">
          <div className="search-heading">
            <span>Find your next obsession</span>
            <button
              className="icon-button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
            >
              <X size={22} />
            </button>
          </div>
          <label className="search-input">
            <Search size={22} />
            <input
              ref={searchInput}
              type="search"
              placeholder="Search anime, manga, reviews…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search articles"
            />
          </label>
          <p className="search-caption" aria-live="polite">
            {query
              ? `${results.length} matching ${results.length === 1 ? "story" : "stories"}`
              : "Explore the latest stories"}
          </p>
          <div className="search-results">
            {results.length ? (
              results.map((article) => (
                <a key={article.slug} href={`/articles/${article.slug}/`}>
                  <img
                    src={article.image}
                    srcSet={imageSrcSet(article.image)}
                    sizes="96px"
                    alt=""
                    width="96"
                    height="64"
                  />
                  <div>
                    <span className="eyebrow">{article.category}</span>
                    <h3>{article.title}</h3>
                  </div>
                  <ArrowUpRight size={18} />
                </a>
              ))
            ) : (
              <p className="empty-search">
                No stories found. Try “Frieren”, “manga”, or “reviews”.
              </p>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
