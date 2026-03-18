"use client";

import { useState, useEffect } from "react";

interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  content: string;
  mood?: string;
}

const journalPrompts = [
  "What moment today reminded you why you became a nurse?",
  "Describe a patient interaction that moved you recently.",
  "What would you tell your younger self about this journey?",
  "Write a letter to the version of you who just finished a hard shift.",
  "What does healing mean to you — for others and for yourself?",
  "Name three things your body does for you that you rarely thank it for.",
  "If your compassion fatigue could speak, what would it say?",
  "Describe a moment of unexpected beauty you witnessed today.",
  "What boundary do you need to set to protect your peace?",
  "Write about someone who inspired you this week.",
  "If you could take a sabbatical, where would your soul want to go?",
  "What are you carrying that isn't yours to carry?",
  "Describe the feeling between the end of a shift and arriving home.",
  "What does your ideal morning look like, with no responsibilities?",
  "Write about a time you felt truly seen and appreciated.",
  "What part of nursing surprised you the most?",
  "If your hands could tell their story, what would they say?",
  "What would you do differently if you knew no one was watching?",
  "Describe the sound, smell, or feeling that most calms you.",
  "What do you wish people understood about being a nurse?",
];

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [currentMood, setCurrentMood] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("nurselight-journal");
    if (saved) setEntries(JSON.parse(saved));
    shufflePrompt();
  }, []);

  const shufflePrompt = () => {
    setCurrentPrompt(journalPrompts[Math.floor(Math.random() * journalPrompts.length)]);
  };

  const saveEntry = () => {
    if (!currentContent.trim()) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      prompt: currentPrompt,
      content: currentContent,
      mood: currentMood || undefined,
    };

    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem("nurselight-journal", JSON.stringify(updated));
    setCurrentContent("");
    setCurrentMood("");
    setIsWriting(false);
    shufflePrompt();
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem("nurselight-journal", JSON.stringify(updated));
    setViewingEntry(null);
  };

  if (viewingEntry) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 animate-fade-in-up">
        <button
          onClick={() => setViewingEntry(null)}
          className="text-white/30 hover:text-white/50 text-sm mb-8 transition-colors"
        >
          ← Back to journal
        </button>
        <div className="glass-warm rounded-2xl p-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white/30 text-xs">{viewingEntry.date}</p>
            {viewingEntry.mood && <span className="text-xl">{viewingEntry.mood}</span>}
          </div>
          <p className="text-spirit-300/60 font-serif italic text-sm mb-6">
            {viewingEntry.prompt}
          </p>
          <p className="text-white/70 font-serif leading-relaxed whitespace-pre-wrap">
            {viewingEntry.content}
          </p>
          <button
            onClick={() => deleteEntry(viewingEntry.id)}
            className="mt-8 text-white/20 hover:text-red-400/60 text-xs transition-colors"
          >
            Delete this entry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in-up">
        <span className="text-3xl mb-4 block">✎</span>
        <h1 className="text-3xl md:text-4xl font-serif text-gradient mb-3">
          Sacred Pages
        </h1>
        <p className="text-white/40 font-serif italic">
          Your words are safe here. Write without judgment.
        </p>
      </div>

      {/* Writing Prompt */}
      {!isWriting ? (
        <div className="animate-fade-in-up delay-200" style={{ animationFillMode: "backwards" }}>
          <div
            className="glass-warm rounded-2xl p-8 text-center cursor-pointer transition-all duration-500 hover:scale-[1.01] group"
            onClick={() => setIsWriting(true)}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-spirit-300/50 mb-6">
              Today&apos;s prompt
            </p>
            <p className="text-xl md:text-2xl text-white/70 font-serif italic leading-relaxed mb-6">
              {currentPrompt}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={(e) => { e.stopPropagation(); shufflePrompt(); }}
                className="text-white/25 hover:text-white/50 text-xs transition-colors"
              >
                ↻ Different prompt
              </button>
              <span className="text-white/10">|</span>
              <p className="text-spirit-300/60 text-sm group-hover:text-spirit-300 transition-colors">
                Tap to begin writing →
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in-up">
          <div className="glass rounded-2xl p-6 md:p-8">
            <p className="text-spirit-300/50 font-serif italic text-sm mb-6">
              {currentPrompt}
            </p>

            {/* Mood selector */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-white/25 text-xs">Mood:</span>
              {["😔", "😐", "🙂", "😊", "✨"].map((m) => (
                <button
                  key={m}
                  onClick={() => setCurrentMood(currentMood === m ? "" : m)}
                  className={`text-lg transition-all duration-200 hover:scale-125 ${
                    currentMood === m ? "scale-125" : "opacity-40 hover:opacity-70"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <textarea
              autoFocus
              value={currentContent}
              onChange={(e) => setCurrentContent(e.target.value)}
              placeholder="Let your thoughts flow..."
              className="w-full bg-transparent text-white/70 placeholder-white/15 font-serif text-lg leading-relaxed resize-none border-none focus:ring-0 min-h-[250px]"
            />

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
              <button
                onClick={() => { setIsWriting(false); setCurrentContent(""); setCurrentMood(""); }}
                className="text-white/25 hover:text-white/50 text-sm transition-colors"
              >
                Cancel
              </button>
              <div className="flex items-center gap-3">
                <span className="text-white/15 text-xs">
                  {currentContent.length > 0 ? `${currentContent.split(/\s+/).filter(Boolean).length} words` : ""}
                </span>
                <button
                  onClick={saveEntry}
                  disabled={!currentContent.trim()}
                  className="px-6 py-2 rounded-full glass-warm text-spirit-200 hover:scale-105 transition-all disabled:opacity-30 disabled:hover:scale-100"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Past Entries */}
      {entries.length > 0 && (
        <div className="mt-12">
          <p className="text-white/25 text-xs uppercase tracking-[0.2em] mb-4 text-center">
            Your reflections
          </p>
          <div className="space-y-3">
            {entries.map((entry, i) => (
              <button
                key={entry.id}
                onClick={() => setViewingEntry(entry)}
                className="w-full glass rounded-xl p-5 text-left transition-all duration-300 hover:border-spirit-400/20 hover:bg-white/[0.02] animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: "backwards" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white/25 text-xs mb-1">{entry.date}</p>
                    <p className="text-white/50 font-serif text-sm truncate italic">
                      {entry.prompt}
                    </p>
                    <p className="text-white/35 text-xs mt-1 truncate">
                      {entry.content.slice(0, 100)}...
                    </p>
                  </div>
                  {entry.mood && (
                    <span className="text-lg flex-shrink-0">{entry.mood}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {entries.length === 0 && !isWriting && (
        <p className="text-center text-white/15 text-xs mt-12 font-serif italic animate-fade-in-up delay-500" style={{ animationFillMode: "backwards" }}>
          Your journal is empty. Every great journey begins with a single word.
        </p>
      )}
    </div>
  );
}
