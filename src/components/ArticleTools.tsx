import { Bookmark, Check, Link as LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ArticleTools({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    try {
      setSaved(localStorage.getItem(`panelraid:saved:${slug}`) === "true");
    } catch {}
  }, [slug]);
  function toggleSaved() {
    try {
      localStorage.setItem(`panelraid:saved:${slug}`, String(!saved));
      setSaved(!saved);
      setMessage(
        saved
          ? "Removed from this browser’s saved stories."
          : "Saved in this browser.",
      );
    } catch {
      setMessage("Saving is unavailable in this browser.");
    }
  }
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("Link copied.");
    } catch {
      setMessage("Copy the URL from your address bar to share this story.");
    }
  }
  return (
    <div className="article-tools">
      <button onClick={toggleSaved} aria-pressed={saved}>
        {saved ? <Check size={15} /> : <Bookmark size={15} />}
        {saved ? "Saved" : "Save story"}
      </button>
      <button onClick={copyLink}>
        <LinkIcon size={15} />
        Copy link
      </button>
      <span className="tool-feedback" role="status">
        {message}
      </span>
    </div>
  );
}
