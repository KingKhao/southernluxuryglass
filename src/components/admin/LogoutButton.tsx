"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-emerald/30 px-4 py-1.5 text-sm text-emerald transition-colors hover:bg-emerald/10"
    >
      Log Out
    </button>
  );
}
