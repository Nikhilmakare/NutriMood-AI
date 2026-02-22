"use client";

import { useState } from "react";
import api from "@/lib/api";
import { ModeToggle } from "@/components/theme/mode";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, Loader2 } from "lucide-react";

import UploadCard from "@/components/ui/UploadCard";
import ResultCard from "@/components/ui/ResultCard";

export default function Home() {
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [results, setResults] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!text.trim()) return setError("Please enter some text");
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/emotion", { text });
      setEmotion(res.data.emotion);
      setConfidence(res.data.confidence);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Could not connect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/70 backdrop-blur px-4 sm:px-6 lg:px-8">
        <h1 className="font-semibold tracking-wide">NutriMood AI</h1>
        <ModeToggle />
      </header>
      <main className="container mx-auto max-w-6xl px-4 py-10 space-y-10">
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>How are you feeling? 😊</CardTitle>
              <CardDescription>
                Describe your mood to get dish suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe what you feel…"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <Button
                  size="sm"
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ArrowUpCircle className="size-4" />
                  )}
                  Analyze
                </Button>
                {error && (
                  <p className="text-sm text-destructive dark:text-red-400">
                    {error}
                  </p>
                )}
              </div>

              {emotion && (
                <div className="grid grid-cols-2 gap-4 pt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center text-sm">
                        Emotion
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-lg font-semibold">
                      {emotion}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center text-sm">
                        Confidence
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-lg font-semibold">
                      {confidence}
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload + Results */}
          <Card>
            <CardHeader>
              <CardTitle>Upload your meal 🍱</CardTitle>
              <CardDescription>
                Predict dish, calories, and mood‑matched suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <UploadCard userMood={text} onResult={setResults} />
              {results && <ResultCard results={results} />}
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
