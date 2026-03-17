export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen px-8 py-12">
      <h1 className="text-3xl font-bold">Listing {id}</h1>
      {/* TODO: Listing detail with images, auth info, purchase button */}
    </div>
  );
}
