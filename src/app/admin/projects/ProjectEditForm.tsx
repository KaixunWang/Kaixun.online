"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProjectEditFormProps {
  id: string;
  initialTitle: string;
  initialLink: string;
  initialAlbum: string;
  initialOrder: number;
  initialLocationName: string;
  initialLatitude: number | null;
  initialLongitude: number | null;
}

export function ProjectEditForm({
  id,
  initialTitle,
  initialLink,
  initialAlbum,
  initialOrder,
  initialLocationName,
  initialLatitude,
  initialLongitude,
}: ProjectEditFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [link, setLink] = useState(initialLink);
  const [album, setAlbum] = useState(initialAlbum);
  const [order, setOrder] = useState(initialOrder);
  const [locationName, setLocationName] = useState(initialLocationName);
  const [latitude, setLatitude] = useState(
    initialLatitude != null ? String(initialLatitude) : "",
  );
  const [longitude, setLongitude] = useState(
    initialLongitude != null ? String(initialLongitude) : "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const latNum = latitude.trim() === "" ? null : Number(latitude);
      const lngNum = longitude.trim() === "" ? null : Number(longitude);

      if (
        (latitude.trim() !== "" && Number.isNaN(latNum)) ||
        (longitude.trim() !== "" && Number.isNaN(lngNum))
      ) {
        setError("Latitude/longitude 必须是合法数字。");
        setSubmitting(false);
        return;
      }

      if ((latNum != null && lngNum == null) || (latNum == null && lngNum != null)) {
        setError("建议同时填写 latitude 和 longitude，以便世界地图正确显示位置。");
        setSubmitting(false);
        return;
      }

      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          link: link.trim() || null,
          album: album.trim() || null,
          order: Number(order) || 0,
          locationName: locationName.trim() || null,
          latitude: latNum,
          longitude: lngNum,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError((data as { message?: string }).message ?? "Failed to update.");
        return;
      }
      router.push("/admin/projects");
    } catch {
      setError("Network error.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this project?")) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setError("Failed to delete.");
        return;
      }
      router.push("/admin/projects");
    } catch {
      setError("Network error.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-200"
    >
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-700" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-700" htmlFor="locationName">
          Location name（可选）
        </label>
        <input
          id="locationName"
          className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          placeholder="例如 Tokyo / Remote"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700" htmlFor="latitude">
            Latitude（纬度）
          </label>
          <input
            id="latitude"
            type="number"
            step="any"
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="例如 35.68"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700" htmlFor="longitude">
            Longitude（经度）
          </label>
          <input
            id="longitude"
            type="number"
            step="any"
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="例如 139.76"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-700" htmlFor="link">
          Link
        </label>
        <input
          id="link"
          type="url"
          className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-700" htmlFor="album">
          Album
        </label>
        <input
          id="album"
          className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-700" htmlFor="order">
          Order
        </label>
        <input
          id="order"
          type="number"
          className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value) || 0)}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
        <Link
          href="/admin/projects"
          className="inline-flex items-center rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="ml-auto inline-flex items-center rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </form>
  );
}
