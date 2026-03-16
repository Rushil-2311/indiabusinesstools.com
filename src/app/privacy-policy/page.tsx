import { PageLayout } from "@/components/layout/PageLayout";

export default function Privacy() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 mb-16">
        <h1 className="text-4xl font-display font-bold mb-8 tracking-tight">Privacy Policy</h1>

        <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
          <p className="lead text-foreground">Last updated: October 15, 2023</p>

          <p>
            At ToolsKit, we take your privacy seriously. This policy outlines what data we
            collect (or rather, don't collect) and how we ensure your information remains
            secure.
          </p>

          <h2 className="text-foreground font-display">1. Data Processing</h2>
          <p>
            <strong>All calculations and formatting happen locally in your browser.</strong>
            We do not send any of the data you input into our tools (such as loan amounts,
            JSON text, or dates of birth) to our servers. Because of this architecture, it
            is impossible for us to store, sell, or share your input data.
          </p>

          <h2 className="text-foreground font-display">2. Analytics</h2>
          <p>
            We use basic, privacy-friendly analytics to understand how many people visit our
            site and which tools are the most popular. This data is aggregated and completely
            anonymous. We do not track individual users across the web.
          </p>

          <h2 className="text-foreground font-display">3. Third-Party Services</h2>
          <p>
            We may display advertisements provided by third-party networks (like Google
            AdSense) to keep the site free. These networks may use cookies to serve ads based
            on your prior visits to our website or other websites. You can opt out of
            personalized advertising by visiting the respective ad network's settings.
          </p>

          <h2 className="text-foreground font-display">4. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any
            changes by posting the new Privacy Policy on this page.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
