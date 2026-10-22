import { Clock3, ArrowUpRight } from "lucide-react";
import type { ArticleSummary } from "../lib/types";
import { articleUrl, shortDate } from "../lib/types";
import { imageSrcSet } from "../lib/images";

export default function ArticleCard({
  article,
  showExcerpt = false,
}: {
  article: ArticleSummary;
  showExcerpt?: boolean;
}) {
  return (
    <article className="article-card group">
      <a
        className="card-image"
        href={articleUrl(article)}
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={article.image}
          srcSet={imageSrcSet(article.image)}
          sizes="(max-width:760px) 46vw, (max-width:1180px) 34vw, 400px"
          alt=""
          width="600"
          height="375"
          loading="lazy"
          decoding="async"
          style={{ objectPosition: article.imagePosition }}
        />
        <span className="image-arrow">
          <ArrowUpRight size={19} />
        </span>
      </a>
      <div className="card-meta">
        <a
          href={`/category/${article.category.toLowerCase()}/`}
          className="category-label"
        >
          {article.category}
        </a>
        <span className="meta-dot">·</span>
        <time dateTime={article.publishedAt}>
          {shortDate(article.publishedAt)}
        </time>
      </div>
      <h3>
        <a href={articleUrl(article)}>{article.title}</a>
      </h3>
      {showExcerpt && <p className="card-excerpt">{article.excerpt}</p>}
      <div className="card-byline">
        <span>By {article.author}</span>
        <span>
          <Clock3 size={12} />
          {article.readingMinutes} min read
        </span>
      </div>
    </article>
  );
}
