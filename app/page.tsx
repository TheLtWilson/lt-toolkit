import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import ToolCard from "@/components/toolcard";
import { Tool, Tools } from '@/app/consts'

function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {Tools.map((tool: Tool) => {
        return (
          <ToolCard
            key={tool.name}
            name={tool.name}
            description={tool.description}
            iconName={tool.icon}
            href={tool.href}
          />
        );
      })}
    </div>
  );
}

function FeatureList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">FAQ</CardTitle>
        <CardDescription>Learn more about this project.</CardDescription>
      </CardHeader>
      <CardContent className="mx-4 border rounded-lg">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>What is Lt. Toolkit?</AccordionTrigger>
            <AccordionContent>
              Lt. Toolkit is an assortment of local-first privacy oriented tools
              that are built for my streams. Some tools are built for stream
              ideas, and others are built with everybody in mind.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              How does &quot;local-first&quot; work?
            </AccordionTrigger>
            <AccordionContent>
              As of right now, all the tools listed on this page are interfaced
              with anonymously, and data is stored in your browser. This means
              that no sensitive data is sent to any server, period. In the
              future, I want to create a bridge that runs on your own computer
              that can be used to interface with more services without having to
              worry about your data being sent to anyone.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it open sourced?</AccordionTrigger>
            <AccordionContent>
              Yes! Both the website and the (eventually) Toolkit Bridge are open
              sourced. You can find the source code for both projects on{" "}
              <Link href="https://github.com/theltwilson" className="underline">
                my GitHub
              </Link>
              .
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="p-4 mx-auto max-w-4xl">
      {/* Page Title */}
      <section id="hero">
        <div className="py-15">
          <div className="flex flex-col text-left items-start px-5 gap-2 md:text-center md:items-center md:px-10">
            <h1 className="text-5xl lg:text-7xl font-bold">Lt. Toolkit</h1>
            <p className="text-md lg:text-lg">
              A <span className="text-pink-500 drop-shadow-xl font-semibold">privacy-first</span> collection of tools that I might need during my streams.
            </p>
          </div>
        </div>
      </section>
      {/* Quick Actions */}
      <section id="quick-actions">
        <QuickActions />
      </section>
      {/* Feature List */}
      <section id="feature-list">
        <FeatureList />
      </section>
    </div>
  );
}
