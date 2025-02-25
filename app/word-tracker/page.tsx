"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrashIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface WordCount {
  word: string;
  count: number;
  sessionCount: number;
}

export default function WordTracker() {
  const [isListening, setIsListening] = useState(false);
  const [trackedWords, setTrackedWords] = useState<WordCount[]>([]);
  const [newWord, setNewWord] = useState("");
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  // Load tracked words from localStorage on component mount
  useEffect(() => {
    const savedWords = localStorage.getItem("trackedWords");
    if (savedWords) {
      const parsedWords = JSON.parse(savedWords);
      // Initialize session counts to 0
      setTrackedWords(parsedWords.map((word: WordCount) => ({ ...word, sessionCount: 0 })));
    }
  }, []);

  // Save tracked words to localStorage whenever they change
  useEffect(() => {
    if (trackedWords.length > 0) {
      // Save without session counts
      const wordsToSave = trackedWords.map(({ word, count }) => ({ word, count }));
      localStorage.setItem("trackedWords", JSON.stringify(wordsToSave));
    }
  }, [trackedWords]);

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
                sessionCount: (trackedWord.sessionCount || 0) + wordCount,
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
      setTrackedWords([...trackedWords, { word: newWord.trim(), count: 0, sessionCount: 0 }]);
      setNewWord("");
    }
  };

  const removeWord = (wordToRemove: string) => {
    setTrackedWords(trackedWords.filter((w) => w.word !== wordToRemove));
    // If no words left, clear localStorage
    if (trackedWords.length === 1) {
      localStorage.removeItem("trackedWords");
    }
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
          <CardDescription>
            This is where you configure what words to listen for.
          </CardDescription>
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

      {/* Tracked words table */}
      <Card>
        <CardHeader>
          <CardTitle>Tracked Words</CardTitle>
          <CardDescription>
            These are the words you are currently tracking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-3/5">Word</TableHead>
                <TableHead>Total Usage</TableHead>
                <TableHead>Session Usage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trackedWords.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground p-4"
                  >
                    No words are being tracked. Add some words above to get
                    started.
                  </TableCell>
                </TableRow>
              ) : (
                trackedWords.map((wordCount) => (
                  <TableRow key={wordCount.word}>
                    <TableCell>{wordCount.word}</TableCell>
                    <TableCell>{wordCount.count}</TableCell>
                    <TableCell>{wordCount.sessionCount}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        onClick={() => removeWord(wordCount.word)}
                      >
                        <TrashIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
