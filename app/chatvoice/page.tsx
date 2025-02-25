"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatClient } from "@twurple/chat";

interface ChatMessage {
  username: string;
  message: string;
  timestamp: number;
}

interface VoiceProfile {
  voice: SpeechSynthesisVoice;
  pitch: number;
  rate: number;
}

export default function ChatVoice() {
  const [channel, setChannel] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const [voiceProfiles, setVoiceProfiles] = useState<
    Record<string, VoiceProfile>
  >({});
  const [client, setClient] = useState<ChatClient | null>(null);

  // Initialize speech synthesis voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Generate a random voice profile for a new chatter
  const generateVoiceProfile = useCallback(
    (username: string) => {
      if (!availableVoices.length) return null;

      const profile: VoiceProfile = {
        voice:
          availableVoices[Math.floor(Math.random() * availableVoices.length)],
        pitch: 0.6 + Math.random() * 0.6,
        rate: 0.6 + Math.random() * 0.6,
      };

      setVoiceProfiles((prev) => ({ ...prev, [username]: profile }));
      return profile;
    },
    [availableVoices]
  );

  // Speak the message using the chatter's voice profile
  const speakMessage = useCallback(
    (username: string, message: string) => {
      let profile = voiceProfiles[username];
      if (!profile && availableVoices.length) {
        profile = generateVoiceProfile(username)!;
      }

      if (profile) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.voice = profile.voice;
        utterance.pitch = profile.pitch;
        utterance.rate = profile.rate;
        window.speechSynthesis.speak(utterance);
      }
    },
    [voiceProfiles, availableVoices, generateVoiceProfile]
  );

  // Connect to Twitch chat
  const connectToChat = useCallback(async () => {
    if (!channel || isConnected) return;

    const chatClient = new ChatClient({ channels: [channel] });

    chatClient.onMessage((channel, user, message, msg) => {
      const username = msg.userInfo.displayName || user || "anonymous";
      const newMessage: ChatMessage = {
        username,
        message,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev.slice(-99), newMessage]);
      speakMessage(username, message);
    });

    try {
      await chatClient.connect();
      setIsConnected(true);
      setClient(chatClient);
    } catch (error) {
      console.error(error);
    }
  }, [channel, isConnected, speakMessage]);

  // Disconnect from Twitch chat
  const disconnectFromChat = useCallback(() => {
    if (client) {
      client.quit();
      setClient(null);
      setIsConnected(false);
      window.speechSynthesis.cancel(); // Stop any ongoing speech
    }
  }, [client]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (client) {
        client.quit();
      }
      window.speechSynthesis.cancel();
    };
  }, [client]);

  return (
    <div className="p-4 mx-auto max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Chat Voice</CardTitle>
          <CardDescription>
            Give your Twitch chat the ability to speak! This utility will read
            out messages sent from a specified channel.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            Various options to tweak to your liking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter Twitch channel name"
              value={channel}
              onChange={(e) => setChannel(e.target.value.toLowerCase())}
              disabled={isConnected}
            />
            <Button
              onClick={isConnected ? disconnectFromChat : connectToChat}
              variant={isConnected ? "destructive" : "default"}
            >
              {isConnected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
          <CardDescription>Latest messages from chat (max 100)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={msg.timestamp + index}
                className="p-2 rounded bg-muted/50"
              >
                <span className="font-semibold">{msg.username}: </span>
                <span>{msg.message}</span>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground">
                No messages yet. Connect to a channel to start receiving
                messages.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
