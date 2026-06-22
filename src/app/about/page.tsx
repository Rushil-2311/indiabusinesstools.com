export default function About() {
  return (
    <>
      <div className="bg-background py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-8">
            <svg width="80" height="80" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="ibt-about" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF6200"/>
                  <stop offset="1" stopColor="#138808"/>
                </linearGradient>
              </defs>
              <rect width="40" height="40" rx="10" fill="url(#ibt-about)"/>
              <rect x="0" y="13" width="40" height="2.5" fill="white" fillOpacity="0.25"/>
              <rect x="0" y="24.5" width="40" height="2.5" fill="white" fillOpacity="0.25"/>
              <text x="20" y="28" fontSize="20" fontFamily="system-ui, Arial, sans-serif" fontWeight="700" fill="white" textAnchor="middle">&#8377;</text>
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
            About IndianBusinessTools
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
            with intrusive ads, paywalls, or poor user interfaces. We created IndianBusinessTools
            with a simple mission: to provide the highest quality utilities for free,
            accessible to everyone.
          </p>

          <h2 className="text-foreground font-display mt-10">Privacy by Design</h2>
          <p>
            We believe your data is yours. That's why all the tools on IndianBusinessTools run
            entirely in your browser. When you format JSON, calculate a loan, or check
            your age, that data never leaves your device. There is no backend server
            storing your inputs.
          </p>

          <h2 className="text-foreground font-display mt-10">The Team</h2>
          <p>
            IndianBusinessTools is built and maintained by a small group of passionate developers
            and designers who love creating elegant solutions to simple problems. We
            continuously update and add new tools based on community feedback.
          </p>
        </div>
      </div>
    </>
  );
}
