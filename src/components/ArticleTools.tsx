import { Link as LinkIcon } from "lucide-react";
import { useState } from "react";

export default function ArticleTools() {
  const [message, setMessage] = useState("");
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
