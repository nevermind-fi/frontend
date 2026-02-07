import { Header } from "@/components/Header";
import { BackgroundGradientAnimation } from "@/components/ui/BackgroundGradientAnimation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative">
      <BackgroundGradientAnimation
        interactive={false}
        containerClassName="fixed inset-0 -z-10 opacity-40"
      />
      <Header showConnect />
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {children}
      </main>
    </div>
  );
}
