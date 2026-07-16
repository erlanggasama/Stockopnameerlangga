import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CheckCircle2, Loader2, AlertCircle, Package2, Tag, Hash, Store } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const queryClient = new QueryClient();

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfxbXC2p0rugA63OhJhrR-P5D4rqhD46lXm2eBhxYEqaFKm8g/formResponse";

const FORM_FIELDS = {
  namaToko: "entry.1645627044",
  tipe: "entry.1703783121",
  produk: "entry.1834168342",
  jumlah: "entry.2006386930",
};

const TIPE_OPTIONS = [
  "Stock awal",
  "Stock akhir",
];

const PRODUK_OPTIONS = [
  "Extrait",
  "EDP",
  "EDT",
  "Facewash 100ml",
  "Facewash 50ml",
  "Pomade",
  "Hair powder",
  "Bodywash",
  "Deodorant",
  "Hair oil",
  "Hair serum",
  "Sunscreen",
  "Serum",
  "Face spray",
];

function Home() {
  const [storeName, setStoreName] = useState("");
  const [storeSaved, setStoreSaved] = useState(false);
  const [tipe, setTipe] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Auto-load store name on mount
  useEffect(() => {
    const saved = localStorage.getItem("erlangga_store_name");
    if (saved) {
      setStoreName(saved);
      setStoreSaved(true);
    }
  }, []);

  // Auto-save store name
  useEffect(() => {
    if (!storeName) {
      setStoreSaved(false);
      localStorage.removeItem("erlangga_store_name");
      return;
    }
    
    const timeout = setTimeout(() => {
      localStorage.setItem("erlangga_store_name", storeName);
      setStoreSaved(true);
    }, 800);
    
    return () => {
      clearTimeout(timeout);
      setStoreSaved(false);
    }
  }, [storeName]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !tipe || !product || !quantity) {
      showNotification('error', 'Lengkapi semua kolom');
      return;
    }

    setIsLoading(true);

    const formData = new URLSearchParams();
    formData.append(FORM_FIELDS.namaToko, storeName);
    formData.append(FORM_FIELDS.tipe, tipe);
    formData.append(FORM_FIELDS.produk, product);
    formData.append(FORM_FIELDS.jumlah, quantity);

    try {
      await fetch(GOOGLE_FORM_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });
      
      // Reset form but keep storeName
      setTipe("");
      setProduct("");
      setQuantity("");
      showNotification('success', 'Data berhasil disimpan!');
    } catch (err) {
      showNotification('error', 'Gagal menyimpan data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-start bg-background p-4 sm:p-6 md:justify-center">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={cn(
              "fixed top-4 left-4 right-4 z-50 mx-auto max-w-[448px] flex items-center gap-3 p-4 rounded-xl shadow-lg border",
              notification.type === 'success' 
                ? "bg-[#e8f3ee] text-primary border-primary/10" 
                : "bg-destructive/10 text-destructive border-destructive/20"
            )}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-primary" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-destructive" />
            )}
            <p className="text-sm font-semibold">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="w-full max-w-[480px] bg-card rounded-3xl shadow-xl shadow-primary/5 border border-primary/10 overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        
        <div className="p-6 sm:p-8 pb-6">
          <div className="flex flex-col items-center text-center space-y-2 mb-8 mt-2">
            <h1 className="text-2xl font-bold tracking-tight text-primary">Erlangga Stock Opname</h1>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-widest text-primary uppercase">
              Kahf
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-primary flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Nama Toko
                </label>
                <AnimatePresence>
                  {storeSaved && storeName && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-xs font-semibold text-primary/70 flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded-md"
                    >
                      <Check className="w-3 h-3" /> tersimpan
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full min-h-[48px] px-4 rounded-xl bg-muted/50 border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-transparent outline-none transition-all placeholder:text-muted-foreground/60 font-medium text-primary"
                placeholder="Masukkan nama toko"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tipe
              </label>
              <div className="relative">
                <select
                  value={tipe}
                  onChange={(e) => setTipe(e.target.value)}
                  className={cn(
                    "w-full min-h-[48px] px-4 pr-10 rounded-xl bg-muted/50 border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-transparent outline-none transition-all appearance-none font-medium text-primary",
                    !tipe && "text-muted-foreground/60"
                  )}
                  required
                >
                  <option value="" disabled>Pilih tipe</option>
                  {TIPE_OPTIONS.map((t) => (
                    <option key={t} value={t} className="text-primary">{t}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/50"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary flex items-center gap-2">
                <Package2 className="w-4 h-4" />
                Nama Produk
              </label>
              <div className="relative">
                <select
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className={cn(
                    "w-full min-h-[48px] px-4 pr-10 rounded-xl bg-muted/50 border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-transparent outline-none transition-all appearance-none font-medium text-primary",
                    !product && "text-muted-foreground/60"
                  )}
                  required
                >
                  <option value="" disabled>Pilih nama produk</option>
                  {PRODUK_OPTIONS.map((prod) => (
                    <option key={prod} value={prod} className="text-primary">{prod}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/50"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Jumlah (pcs)
              </label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full min-h-[48px] px-4 rounded-xl bg-muted/50 border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-transparent outline-none transition-all placeholder:text-muted-foreground/60 font-medium text-primary"
                placeholder="0"
                required
              />
            </div>

            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                type="submit"
                className="w-full min-h-[52px] bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-primary/20 disabled:opacity-80 disabled:cursor-not-allowed transition-colors hover:bg-primary/95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  'Simpan Data'
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
      
      <p className="mt-8 mb-4 text-xs text-primary/40 font-semibold tracking-wide uppercase">
        &copy; {new Date().getFullYear()} Erlangga Stock Opname
      </p>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Switch>
          <Route path="/" component={Home} />
          {/* A simple inline 404 since we just need one page */}
          <Route>
            <div className="min-h-[100dvh] flex items-center justify-center bg-background text-primary">
              <h1 className="font-bold text-xl">404 Not Found</h1>
            </div>
          </Route>
        </Switch>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;