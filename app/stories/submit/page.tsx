"use client";

import { useState } from "react";

export default function SubmitStoryPage() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Chhath memories");
  const [story, setStory] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // This is a front-end prototype.
    // Connect this form to your API/database before publishing it.
    setMessage(
      "Your form is working, but your story has not been saved yet. Database integration is required."
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f6ef] px-6 py-16 text-[#20392d]">
      <div className="mx-auto max-w-2xl">
        <a
          href="/stories"
          className="text-sm font-semibold text-amber-700 hover:underline"
        >
          ← Back to stories
        </a>

        <div className="mt-8 rounded-3xl border border-[#e5dfcf] bg-white p-7 shadow-sm md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-700">
            Bihar Ki Bhavna
          </p>

          <h1 className="mt-4 text-3xl font-bold md:text-4xl">
            Share your story
          </h1>

          <p className="mt-4 leading-7 text-[#526157]">
            Share a memory, a family tradition, or what Chhath means to you.
            Your story should be something you are comfortable sharing publicly.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 block font-semibold">
                Your name or display name
              </label>
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={80}
                placeholder="How should we credit your story?"
                className="w-full rounded-xl border border-[#d9d5c9] px-4 py-3 outline-none focus:border-[#183d2e]"
              />
            </div>

            <div>
              <label htmlFor="title" className="mb-2 block font-semibold">
                Story title
              </label>
              <input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                maxLength={120}
                placeholder="e.g. Chhath in my hometown"
                className="w-full rounded-xl border border-[#d9d5c9] px-4 py-3 outline-none focus:border-[#183d2e]"
              />
            </div>

            <div>
              <label htmlFor="category" className="mb-2 block font-semibold">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-[#d9d5c9] bg-white px-4 py-3 outline-none focus:border-[#183d2e]"
              >
                <option>Chhath memories</option>
                <option>Family traditions</option>
                <option>Folk songs</option>
                <option>Celebrating away from home</option>
                <option>Bihari culture</option>
              </select>
            </div>

            <div>
              <label htmlFor="story" className="mb-2 block font-semibold">
                Your story
              </label>
              <textarea
                id="story"
                value={story}
                onChange={(event) => setStory(event.target.value)}
                required
                minLength={20}
                maxLength={5000}
                rows={7}
                placeholder="Tell us your story..."
                className="w-full resize-y rounded-xl border border-[#d9d5c9] px-4 py-3 outline-none focus:border-[#183d2e]"
              />
              <p className="mt-2 text-right text-sm text-[#68746b]">
                {story.length}/5000
              </p>
            </div>

            <p className="text-sm leading-6 text-[#68746b]">
              Submissions should be reviewed before appearing publicly.
              Avoid sharing private information about yourself or others.
            </p>

            <button
              type="submit"
              className="w-full rounded-full bg-[#183d2e] px-6 py-3 font-semibold text-white transition hover:bg-[#285640]"
            >
              Submit story
            </button>

            {message && (
              <p
                role="status"
                className="rounded-xl bg-[#f3eee0] p-4 text-sm leading-6"
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}