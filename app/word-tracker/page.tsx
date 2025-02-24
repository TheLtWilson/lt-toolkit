"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface WordCount {
  word: string;
  count: number;
}

export default function WordTracker() {
  const [isListening, setIsListening] = useState(false);
  const [trackedWords, setTrackedWords] = useState<WordCount[]>([]);
  const [newWord, setNewWord] = useState("");
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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
          setTranscript(prev => {
            const words = prev.split(' ').slice(-10).join(' ') + ' ' + latestTranscript;
            return words.trim();
          });

          // Count words in the latest transcript only
          const words = latestTranscript.toLowerCase().split(' ');
          setTrackedWords(currentTrackedWords => {
            return currentTrackedWords.map(trackedWord => {
              const wordCount = words.filter(word => 
                word.trim() === trackedWord.word.toLowerCase()
              ).length;
              return {
                ...trackedWord,
                count: trackedWord.count + wordCount
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
    if (newWord.trim() && !trackedWords.some(w => w.word.toLowerCase() === newWord.toLowerCase())) {
      setTrackedWords([...trackedWords, { word: newWord.trim(), count: 0 }]);
      setNewWord("");
    }
  };

  const removeWord = (wordToRemove: string) => {
    setTrackedWords(trackedWords.filter(w => w.word !== wordToRemove));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Word Tracker</h1>
      
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          placeholder="Enter a word to track"
          className="max-w-xs"
        />
        <Button onClick={addWord}>Add Word</Button>
      </div>

      <Button
        onClick={toggleListening}
        variant={isListening ? "destructive" : "default"}
        className="mb-6"
      >
        {isListening ? "Stop Listening" : "Start Listening"}
      </Button>

      {isListening && (
        <Card className="p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">Live Transcript Preview</h3>
          <p className="text-gray-600">
            {transcript.split(' ').map((word, index) => {
              const isTracked = trackedWords.some(
                tw => tw.word.toLowerCase() === word.toLowerCase()
              );
              return (
                <span key={index}>
                  <span className={isTracked ? 'bg-yellow-200 dark:bg-yellow-800' : ''}>
                    {word}
                  </span>
                  {' '}
                </span>
              );
            }) || "Listening..."}
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trackedWords.map((wordCount) => (
          <Card key={wordCount.word} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{wordCount.word}</h3>
                <p className="text-2xl">{wordCount.count}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeWord(wordCount.word)}
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}      
      </div>
    </div>
  );
}