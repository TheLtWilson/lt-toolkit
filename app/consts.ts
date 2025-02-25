import type { IconName } from "lucide-react/dynamic"

export type Tool = {
    name: string,
    description: string,
    href: string
    icon: IconName,
}

export const Tools: Tool[] = [
    {
        name: "Chatvoice",
        description: "Voice-enabled chat interface for natural conversations.",
        href: "/chatvoice",
        icon: "message-square",
    },
    {
        name: "Word Tracker",
        description: "Track and analyze your vocabulary usage.",
        href: "/word-tracker",
        icon: "book-open",
    }
]