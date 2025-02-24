import { Card } from "@/components/ui/card";
import Link from "next/link";
import { MessageSquare, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="p-4 mx-auto max-w-4xl">
      <div className="pb-4">
        <h1 className="text-4xl font-bold">Lt. Toolkit</h1>
        <p className="text-muted-foreground">A collection of tools that I might need during my streams.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/chatvoice">
          <Card className="p-6 hover:bg-muted/50 hover:scale-105 transition">
            <div className="space-y-4">
              <MessageSquare className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-semibold">Chatvoice</h2>
                <p className="text-sm text-muted-foreground">Voice-enabled chat interface for natural conversations.</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/word-tracker">
          <Card className="p-6 hover:bg-muted/50 hover:scale-105 transition">
            <div className="space-y-4">
              <BookOpen className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-semibold">Word Tracker</h2>
                <p className="text-sm text-muted-foreground">Track and analyze your vocabulary usage.</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}