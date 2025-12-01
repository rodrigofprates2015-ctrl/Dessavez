import { useGameStore } from "@/lib/gameStore";
import { useEffect } from "react";
import { AlertCircle, Crown } from "lucide-react";

export function NotificationCenter() {
  const { notifications, removeNotification } = useGameStore();

  return (
    <div className="fixed top-4 right-4 z-40 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border animate-fade-in ${
            notification.type === 'host-changed'
              ? 'bg-[#1a2e2e]/80 border-cyan-400/50 backdrop-blur-sm'
              : 'bg-[#2e1a1a]/80 border-red-400/50 backdrop-blur-sm'
          }`}
        >
          {notification.type === 'host-changed' ? (
            <Crown className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          <span className={`text-sm ${
            notification.type === 'host-changed'
              ? 'text-cyan-200'
              : 'text-red-200'
          }`}>
            {notification.message}
          </span>
        </div>
      ))}
    </div>
  );
}
