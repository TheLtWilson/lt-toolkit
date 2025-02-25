import Link from "next/link"
import { Card } from "@/components/ui/card"
import { DynamicIcon } from "lucide-react/dynamic"
import type { IconName } from "lucide-react/dynamic" 

export default function ToolCard({ name, description, href, iconName }: { name: string, description: string, href: string, iconName: IconName }) {
    return (
      <Link href={href}>
        <Card className="p-6 group hover:bg-muted/50 hover:scale-105 transition">
          <div className="space-y-4">
            <DynamicIcon name={iconName} className="w-8 h-8 group-hover:-rotate-6 transition-transform" />
            <div>
              <h2 className="text-xl font-semibold">{name}</h2>
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </Card>
      </Link>
    )
}