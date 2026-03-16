import { Wrench } from "lucide-react";

export default function About() {
  return (
    <>
      <div className="bg-background py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-xl shadow-primary/20">
              <Wrench className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
            About ToolsKit
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-12">
            We build beautiful, fast, and free utilities to make your everyday tasks
            easier. No subscriptions, no hidden fees, just great tools.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 mb-24">
        <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
          <h2 className="text-foreground font-display">Our Mission</h2>
          <p>
            The internet is full of calculators and formatters, but many are cluttered
            with intrusive ads, paywalls, or poor user interfaces. We created ToolsKit
            with a simple mission: to provide the highest quality utilities for free,
            accessible to everyone.
          </p>

          <h2 className="text-foreground font-display mt-10">Privacy by Design</h2>
          <p>
            We believe your data is yours. That's why all the tools on ToolsKit run
            entirely in your browser. When you format JSON, calculate a loan, or check
            your age, that data never leaves your device. There is no backend server
            storing your inputs.
          </p>

          <h2 className="text-foreground font-display mt-10">The Team</h2>
          <p>
            ToolsKit is built and maintained by a small group of passionate developers
            and designers who love creating elegant solutions to simple problems. We
            continuously update and add new tools based on community feedback.
          </p>
        </div>
      </div>
    </>
  );
}
