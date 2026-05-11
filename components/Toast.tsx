'use client';

export default function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-40">
      <div className="bg-slate-900 text-white text-sm px-3 py-2 rounded-xl shadow-lg animate-[pageEnter_.2s_ease-out]">
        {message}
      </div>
    </div>
  );
}
