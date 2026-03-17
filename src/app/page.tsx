import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-65px)] bg-white">
      <section className="flex flex-col items-center justify-center px-8 py-24 text-center">
        <h2 className="text-5xl font-bold tracking-tight">
          Authenticated Sports Memorabilia
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          Buy and sell verified collectibles with confidence. Every item is
          authenticated by our experts and every transaction is protected with
          escrow payments.
        </p>
        <div className="flex gap-4 mt-8">
          <Link
            href="/marketplace"
            className="px-6 py-3 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
          >
            Browse Marketplace
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 text-sm font-medium text-black border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Start Selling
          </Link>
        </div>
      </section>
    </main>
  );
}
