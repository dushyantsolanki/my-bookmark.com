import { RefreshCw } from 'lucide-react';

export function Footer() {
  return (
    <footer className="px-4 py-3 border-t bg-muted/30 mt-auto space-y-1.5">
      <p className="text-[10px] text-muted-foreground/60 text-center leading-relaxed">
        If something looks weird, hit the{' '}
        <RefreshCw size={9} className="inline text-primary" /> refresh button.
      </p>
      <p className="text-[10px] font-black text-muted-foreground/30 tracking-[0.3em] uppercase text-center">
        MyBookmark Extension
      </p>
    </footer>
  );
}
