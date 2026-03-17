import { createClient } from "@/lib/supabase/client";

export async function uploadImage(
  file: File,
  folder: string
): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const ext = file.name.split(".").pop();
  const fileName = `${user.id}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("listing-images")
    .upload(fileName, file, { upsert: false });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("listing-images").getPublicUrl(fileName);

  return publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  const supabase = createClient();
  // Extract path after /object/public/listing-images/
  const match = url.match(/listing-images\/(.+)$/);
  if (!match) return;

  await supabase.storage.from("listing-images").remove([match[1]]);
}
