import SignupForm from "@/components/SignupForm";

export default function SignupSection() {
  return (
    <section className="border-t border-emerald/10 bg-emerald px-6 py-16 text-center text-cream">
      <h2 className="font-serif text-2xl">Be the first to see new pieces</h2>
      <p className="mx-auto mt-3 max-w-xl text-cream/80">
        Join the list for early access to new inventory — see beautiful finds before
        they hit the site.
      </p>
      <div className="mt-6">
        <SignupForm onDark />
      </div>
    </section>
  );
}
