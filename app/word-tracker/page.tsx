"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface WordCount {
  word: string;
  count: number;
}

export default function WordTracker() {
  const [isListening, setIsListening] = useState(false);
  const [trackedWords, setTrackedWords] = useState<WordCount[]>([]);
  const [newWord, setNewWord] = useState("");
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          const latestResult = event.results[event.results.length - 1];
          if (!latestResult.isFinal) return; // Only process final results
          const latestTranscript = latestResult[0].transcript;

          // Keep only a short preview of the transcript
          setTranscript((prev) => {
            const words =
              prev.split(" ").slice(-20).join(" ") + " " + latestTranscript;
            return words.trim();
          });

          // Count words in the latest transcript only
          const words = latestTranscript.toLowerCase().split(" ");
          setTrackedWords((currentTrackedWords) => {
            return currentTrackedWords.map((trackedWord) => {
              const wordCount = words.filter(
                (word) => word.trim() === trackedWord.word.toLowerCase()
              ).length;
              return {
                ...trackedWord,
                count: trackedWord.count + wordCount,
              };
            });
          });
        };

        setRecognition(recognition);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setTranscript("");
    } else {
      recognition.start();
    }
    setIsListening(!isListening);
  };

  const addWord = () => {
    if (
      newWord.trim() &&
      !trackedWords.some((w) => w.word.toLowerCase() === newWord.toLowerCase())
    ) {
      setTrackedWords([...trackedWords, { word: newWord.trim(), count: 0 }]);
      setNewWord("");
    }
  };

  const removeWord = (wordToRemove: string) => {
    setTrackedWords(trackedWords.filter((w) => w.word !== wordToRemove));
  };

  // the page starts here
  return (
    <div className="p-4 mx-auto max-w-4xl">
      {/* Page information */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-3xl">Word Tracker</CardTitle>
          <CardDescription>
            A utility that listens to your microphone and keeps track of how
            many times you&apos;ve said a specific word.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Configuration card */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>This is where you configure what words to listen for.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Enter a word to track"
            />
            <Button onClick={addWord}>Add Word</Button>
            <Button
              onClick={toggleListening}
              variant={isListening ? "destructive" : "default"}
            >
              {isListening ? "Stop Listening" : "Start Listening"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isListening && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Live Transcript Preview</CardTitle>
            <CardDescription>
              This is what we think you&apos;re saying.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            {transcript.split(" ").map((word, index) => {
              const isTracked = trackedWords.some(
                (tw) => tw.word.toLowerCase() === word.toLowerCase()
              );
              return (
                <span key={index}>
                  <span
                    className={
                      isTracked ? "bg-yellow-200 dark:bg-yellow-800" : ""
                    }
                  >
                    {word}
                  </span>{" "}
                </span>
              );
            }) || "Listening..."}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trackedWords.map((wordCount) => (
          <Card key={wordCount.word}>
            <CardContent>
              <h3 className="text-lg font-semibold">{wordCount.word}</h3>
              <p className="text-2xl">{wordCount.count}</p>
            </CardContent>
            <CardFooter>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeWord(wordCount.word)}
              >
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
