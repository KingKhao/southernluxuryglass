const STEPS = [
  {
    title: "Inquire About a Piece",
    body: "Found something you love? Send a quick inquiry right from its listing — no account needed.",
  },
  {
    title: "Hear Back From Crystal",
    body: "Crystal replies personally with more photos, condition details, and answers to your questions.",
  },
  {
    title: "Arrange Your Purchase",
    body: "Once you're ready, she'll walk you through the invoice process and getting your piece to you.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-10 text-center font-serif text-3xl text-emerald sm:text-4xl">
        How It Works
      </h2>
      <div className="grid gap-8 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <div key={step.title} className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold-deep font-serif text-lg text-gold-deep">
              {i + 1}
            </div>
            <h3 className="mt-4 font-serif text-lg text-emerald">{step.title}</h3>
            <p className="mt-2 text-sm text-charcoal-muted">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
