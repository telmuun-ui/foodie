export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to upload image" }));
    throw new Error(error.error ?? "Failed to upload image");
  }

  const { url } = await response.json();
  return url;
};
