interface ToolDescriptionData {
  whatIs: string;
  howToUse: string[];
  example: string;
  whyUse: string[];
}

interface ToolDescriptionProps {
  toolName: string;
  data: ToolDescriptionData;
}

export function ToolDescription({ toolName, data }: ToolDescriptionProps) {
  return (
    <div className="mt-16 max-w-3xl mx-auto space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-3">What is a {toolName}?</h2>
        <p className="text-muted-foreground leading-relaxed">{data.whatIs}</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">How to Use It</h2>
        <ol className="space-y-2 list-none">
          {data.howToUse.map((step, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="text-muted-foreground leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Example</h2>
        <div className="bg-muted/50 border rounded-xl p-5">
          <p className="text-muted-foreground leading-relaxed">{data.example}</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Why Use It</h2>
        <ul className="space-y-2">
          {data.whyUse.map((point, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
              <span className="text-muted-foreground leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export type { ToolDescriptionData };
