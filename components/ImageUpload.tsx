import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  currentImageUrl?: string;
}

export function ImageUpload({ onUploadSuccess, currentImageUrl }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError("");

      // Tentar criar o bucket caso ele não exista
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.find(b => b.name === 'capas-animeskiwi');
      
      if (!bucketExists) {
        await supabase.storage.createBucket('capas-animeskiwi', {
          public: true,
        });
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('capas-animeskiwi')
        .upload(filePath, file);

      if (uploadError) {
        if (uploadError.message.includes("Bucket not found") || uploadError.message.includes("does not exist") || uploadError.message.includes("row-level security")) {
            throw new Error(`Erro de permissão no Supabase. Para resolver, vá no painel do seu Supabase > SQL Editor e rode o seguinte comando:
            
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Public Upload" on storage.objects;

create policy "Public Access" on storage.objects for select using ( bucket_id = 'capas-animeskiwi' );
create policy "Public Upload" on storage.objects for insert with check ( bucket_id = 'capas-animeskiwi' );`);
        }
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('capas-animeskiwi')
        .getPublicUrl(filePath);

      onUploadSuccess(data.publicUrl);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setUploadError(error.message || "Erro ao fazer upload da imagem.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        ref={fileInputRef}
        className="hidden"
      />
      
      <div className="flex gap-4 items-center">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 bg-[#bd00ff] hover:bg-[#9900cf] text-white px-4 py-2 rounded-lg font-bold transition-colors font-body text-sm uppercase tracking-wider disabled:opacity-50 shadow-[0_0_15px_rgba(189,0,255,0.4)] hover:shadow-[0_0_25px_rgba(189,0,255,0.6)]"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {isUploading ? "Enviando..." : "Adicionar capa"}
        </button>
        
        {(currentImageUrl || isUploading) && (
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {isUploading ? "Processando..." : currentImageUrl ? "Imagem carregada" : ""}
          </div>
        )}
      </div>
      {uploadError && (
        <div className="text-red-400 text-xs mt-1 font-body leading-relaxed whitespace-pre-wrap">{uploadError}</div>
      )}
    </div>
  );
}
