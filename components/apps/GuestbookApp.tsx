"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BookOpen, User, Loader2 } from "lucide-react";

interface GuestbookEntry {
  id: number;
  name: string;
  email: string | null;
  message: string;
  created_at: string;
}

export default function GuestbookApp() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameLength, setNameLength] = useState(0);
  const [messageLength, setMessageLength] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/guestbook");
      if (!response.ok) {
        throw new Error("Failed to fetch entries");
      }
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error("Error fetching entries:", error);
      setError("Failed to load guestbook entries");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: email || null,
          message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add entry");
      }

      const newEntry = await response.json();
      setEntries([newEntry, ...entries]);

      // Safely reset the form using the ref
      if (formRef.current) {
        formRef.current.reset();
      }

      // Reset character counters
      setNameLength(0);
      setMessageLength(0);
      setError(null);
    } catch (error) {
      console.error("Error adding entry:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to add your message. Please try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 h-full overflow-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Sign My Guest Book
      </h2>

      {/* Guest Book Form */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 mb-8 border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Leave a message
        </h3>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name *{" "}
                <span className="text-xs text-gray-500">
                  ({nameLength}/100)
                </span>
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                className="w-full"
                maxLength={100}
                onChange={(e) => setNameLength(e.target.value.length)}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email (optional)
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                className="w-full"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Message *{" "}
              <span className="text-xs text-gray-500">
                ({messageLength}/1000)
              </span>
            </label>
            <Textarea
              id="message"
              name="message"
              required
              placeholder="Leave your thoughts, feedback, or just say hello!"
              className="w-full min-h-24"
              maxLength={1000}
              onChange={(e) => setMessageLength(e.target.value.length)}
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 mr-2" />
                Sign Guest Book
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Guest Book Entries */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Entries ({entries.length})
        </h3>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-600">Loading entries...</span>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No entries yet. Be the first to sign the guest book!
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {entry.name}
                    </h4>
                    {entry.email && (
                      <p className="text-sm text-gray-500">{entry.email}</p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {entry.created_at}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{entry.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export type { GuestbookEntry };
