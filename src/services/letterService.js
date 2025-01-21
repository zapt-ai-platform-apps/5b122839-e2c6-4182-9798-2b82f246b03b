import { supabase } from '../supabaseClient';

export async function saveLetter({ formData, letter, summary }) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const saveResponse = await fetch('/api/save-letter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
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