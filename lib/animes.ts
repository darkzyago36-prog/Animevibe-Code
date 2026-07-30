"use server";
import { supabase } from "./supabase";

export async function getAnimes() {
  try {
    const { data, error } = await supabase
      .from('animes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase error fetching animes:", error);
      throw error;
    }

    return (data || []).map(anime => ({
      ...anime,
      tags: anime.tags ?? [],
    }));
  } catch (error) {
    console.error("Error reading animes data:", error);
    return [];
  }
}

export async function createAnime(newAnime: any) {
  try {
    const { data, error } = await supabase
      .from('animes')
      .insert([{
        slug: newAnime.slug,
        titulos: newAnime.titulos,
        nota: newAnime.nota,
        genero: newAnime.genero,
        capa_url: newAnime.capa_url,
        novo: newAnime.novo,
        destaque: newAnime.destaque,
        tags: newAnime.tags || [],
      }])
      .select();

    if (error) {
      console.error("Supabase error inserting anime:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error("No data returned from insert");
    }

    return {
      ...data[0],
      tags: data[0].tags ?? []
    };
  } catch (error) {
    console.error("Error saving anime data:", error);
    throw new Error("Failed to create anime");
  }
}

export async function deleteAnime(id: number) {
  try {
    const { error } = await supabase
      .from('animes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase error deleting anime:", error);
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting anime:", error);
    throw new Error("Failed to delete anime");
  }
}

export async function updateAnime(id: number, updatedAnime: any) {
  try {
    const { data: existingData, error: fetchError } = await supabase
      .from('animes')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingData) {
      console.error("Supabase error fetching existing anime:", fetchError);
      throw new Error("Failed to find anime to update");
    }

    const { error: deleteError } = await supabase
      .from('animes')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error("Supabase error deleting anime for update:", deleteError);
      throw deleteError;
    }

    const { data, error } = await supabase
      .from('animes')
      .insert([{
        id: existingData.id,
        slug: existingData.slug,
        titulos: updatedAnime.titulos !== undefined ? updatedAnime.titulos : existingData.titulos,
        nota: updatedAnime.nota !== undefined ? updatedAnime.nota : existingData.nota,
        genero: updatedAnime.genero !== undefined ? updatedAnime.genero : existingData.genero,
        capa_url: updatedAnime.capa_url !== undefined ? updatedAnime.capa_url : existingData.capa_url,
        novo: existingData.novo,
        destaque: updatedAnime.destaque !== undefined ? updatedAnime.destaque : existingData.destaque,
        tags: updatedAnime.tags || existingData.tags || [],
        created_at: existingData.created_at
      }])
      .select();

    if (error) {
      console.error("Supabase error inserting updated anime:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error("No data returned from update");
    }

    return {
      ...data[0],
      tags: data[0].tags ?? []
    };
  } catch (error) {
    console.error("Error updating anime data:", error);
    throw new Error("Failed to update anime");
  }
}
