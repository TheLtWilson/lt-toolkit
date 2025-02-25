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
        description: "Give your Twitch chat vocal cords! For better or worse.",
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