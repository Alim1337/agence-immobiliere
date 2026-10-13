import { MessageCircle } from "lucide-react";

export function WhatsAppButton({
  whatsappNumber,
  message,
  className,
}: {
  whatsappNumber: string;
  message: string;
  className?: string;
}) {
  const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "inline-flex h-11 items-center justify-center gap-2 rounded-sm border border-stone-line bg-white text-sm font-medium text-ink transition-colors hover:bg-stone-100 " +
        (className ?? "")
      }
    >
      <MessageCircle className="h-4 w-4 text-[#25D366]" strokeWidth={2} />
      Contacter sur WhatsApp
    </a>
  );
}
