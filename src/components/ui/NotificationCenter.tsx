import { CheckCircle2, X } from "lucide-react";
import { useCloudData } from "../../context/CloudDataContext";

export default function NotificationCenter() {
  const { notifications, dismissNotification } = useCloudData();

  return (
    <div className="fixed right-4 top-4 z-50 space-y-2 w-[min( calc(100vw-2rem), 340px)]">
      {notifications.map((notification) => (
        <div key={notification.id} className="toast flex items-center gap-3 bg-card border border-security/30 shadow-card rounded-xl px-3 py-3">
          <CheckCircle2 size={18} className="text-security shrink-0" />
          <p className="text-sm text-text-primary flex-1">{notification.message}</p>
          <button type="button" onClick={() => dismissNotification(notification.id)} aria-label="Cerrar notificación" className="text-text-secondary hover:text-text-primary"><X size={15} /></button>
        </div>
      ))}
    </div>
  );
}