export async function saveLetter({ formData, letter, summary }) {
  const saveResponse = await fetch('/api/save-letter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...formData,
      letter,
      summary
    }),
  });

  if (!saveResponse.ok) {
    const errorText = await saveResponse.text();
    throw new Error(`Save failed: ${errorText}`);
  }

  return await saveResponse.json();
}