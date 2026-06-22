"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ProfileUser {
  id: string;
  email: string;
  name: string | null;
  displayId: string | null;
  image: string | null;
}

export default function ProfileForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayId, setDisplayId] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/profile");
      if (res.status === 401) {
        router.replace("/auth/login");
        return;
      }
      if (!res.ok) {
        setError("Failed to load profile.");
        setLoading(false);
        return;
      }
      const data = (await res.json()) as ProfileUser;
      setUser(data);
      setDisplayId(data.displayId ?? "");
      setEmail(data.email ?? "");
      setImage(data.image ?? null);
      setLoading(false);
    })();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayId: displayId.trim() || null,
          email: email.trim(),
          image: image || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError((data as { message?: string }).message ?? "Failed to update.");
        return;
      }
      setUser(data as ProfileUser);
      setMessage("Profile updated.");
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setError(null);
    setSaving(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const uploadRes = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const uploadData = (await uploadRes.json()) as { url?: string };
      if (!uploadRes.ok || !uploadData.url) {
        setError("Upload failed.");
        return;
      }
      const patchRes = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: uploadData.url }),
      });
      if (!patchRes.ok) {
        setError("Failed to update avatar.");
        return;
      }
      const updated = (await patchRes.json()) as ProfileUser;
      setImage(updated.image ?? null);
      setUser(updated);
      setMessage("Avatar updated.");
    } catch {
      setError("Upload error.");
    } finally {
      setSaving(false);
    }
    e.target.value = "";
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-800/60 bg-[#0a0a0a]/80 p-8 text-center text-zinc-500 font-mono text-sm">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto w-full">
      <div className="mb-6 flex items-center gap-2 text-sm sm:text-base text-zinc-300">
        <span className="text-emerald-500 font-bold">kaixun@online:~$</span> <span className="text-zinc-100">sudo nano /etc/profile.conf</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur-md p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0" />
        
        <h1 className="font-tech tracking-widest text-xl font-bold text-emerald-400 border-b border-zinc-800 pb-4 flex items-center gap-2">
          USER_PROFILE_CONFIGURATION
          <span className="inline-block w-2 h-5 bg-emerald-400 animate-pulse" />
        </h1>

        <div className="flex flex-col items-center gap-4 py-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={saving}
            className="group relative flex h-28 w-28 overflow-hidden rounded bg-black border border-zinc-700 hover:border-emerald-500 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
            aria-label="Change avatar"
          >
            {image ? (
              <Image
                src={image.startsWith("/") ? image : image}
                alt="Avatar"
                fill
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                unoptimized={image.startsWith("http")}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-tech text-lg text-zinc-600 group-hover:text-emerald-500">
                NO_IMG
              </span>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs text-emerald-400 font-bold tracking-widest">
              UPLOAD
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <span className="text-xs text-zinc-500 tracking-widest uppercase">Select Image Module</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">System ID</label>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">&gt;</span>
              <input
                type="text"
                className="flex-1 bg-black/50 border border-zinc-800 rounded px-4 py-2 text-sm text-zinc-300 placeholder-zinc-700 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                value={displayId}
                onChange={(e) => setDisplayId(e.target.value)}
                placeholder="Unique ID (e.g. username)"
                maxLength={60}
              />
            </div>
            <p className="mt-2 ml-4 text-[10px] text-zinc-600 uppercase tracking-wider">Used in global logs and routing. Must be strictly unique.</p>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">Contact Address</label>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">&gt;</span>
              <input
                type="email"
                className="flex-1 bg-black/50 border border-zinc-800 rounded px-4 py-2 text-sm text-zinc-300 placeholder-zinc-700 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="border-l-2 border-red-500 bg-red-950/20 pl-3 py-2">
            <p className="text-xs text-red-400 font-bold uppercase tracking-wider">ERR: {error}</p>
          </div>
        )}
        {message && (
          <div className="border-l-2 border-emerald-500 bg-emerald-950/20 pl-3 py-2">
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">SYS: {message}</p>
          </div>
        )}

        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="relative overflow-hidden rounded border border-emerald-900 bg-emerald-950/30 px-8 py-2.5 text-xs font-bold tracking-widest text-emerald-400 transition-all hover:bg-emerald-900/50 hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span className="relative z-10">{saving ? "WRITING_TO_DISK..." : "COMMIT_CHANGES"}</span>
            <div className="absolute inset-0 bg-emerald-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </form>
    </div>
  );
}
