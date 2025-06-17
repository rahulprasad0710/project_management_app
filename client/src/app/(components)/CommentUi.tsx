import React, { useState } from "react";

export default function CommentBox() {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1000));
      alert("Comment submitted: " + comment);
      setComment("");
    } catch (err) {
      setError("Failed to submit comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full max-w-3xl space-x-4 rounded-xl border bg-white p-4 shadow-sm">
      {/* Avatar */}
      <img
        src="https://i.pravatar.cc/40"
        alt="Avatar"
        className="h-10 w-10 rounded-full"
      />

      {/* Comment input and actions */}
      <div className="flex-1">
        <textarea
          className="min-h-[80px] w-full resize-y rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
        />

        {/* Error message */}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

        {/* Buttons */}
        <div className="mt-2 flex space-x-2">
          <button
            onClick={handleSubmit}
            className="rounded-md bg-blue-600 px-4 py-1.5 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting || !comment.trim()}
          >
            {isSubmitting ? "Commenting..." : "Comment"}
          </button>
          <button
            onClick={() => setComment("")}
            className="rounded-md px-4 py-1.5 text-gray-600 hover:underline"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
