import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
      <p className="eyebrow">Page not found</p>
      <h1 className="mt-4 font-display text-6xl font-medium md:text-8xl">
        This wall is <em className="text-clay">still blank</em>
      </h1>
      <p className="mt-6 max-w-md text-umber">The page you were looking for doesn&apos;t exist or has moved.</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-dark">Back to home</Link>
        <Link href="/work/" className="btn btn-outline">See our work</Link>
      </div>
    </section>
  );
}
