import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import UserAvatar from "@/components/UserAvatar";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [avatarId, setAvatarId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.username) setUsername(data.username);
        if (data?.avatar_url) setAvatarId(data.avatar_url);
      });
  }, [user]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/rooms", label: "Rooms" },
    ...(user ? [{ to: "/history", label: "History" }] : []),
    { to: "/about", label: "About" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/30 rounded-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary glow-amber" />
          <span className="text-sm font-display font-medium tracking-wider text-foreground">EcoDesk</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-xs font-body tracking-wider uppercase transition-colors ${
                isActive(link.to) ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/settings" className="flex items-center gap-2 hover:opacity-80 transition-opacity" title="Settings">
                <UserAvatar username={username || user.email?.split("@")[0]} avatarId={avatarId} size="sm" />
                <span className="text-xs font-body text-muted-foreground">
                  {username || user.email?.split("@")[0]}
                </span>
              </Link>
              <button
                onClick={signOut}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-flex text-xs font-body tracking-wider uppercase px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all"
            >
              Sign In
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted-foreground"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border/20"
          >
            <div className="px-6 py-4 space-y-3">
              {user && (
                <div className="flex items-center gap-2 pb-3 border-b border-border/20">
                  <UserAvatar username={username || user.email?.split("@")[0]} avatarId={avatarId} size="sm" />
                  <span className="text-sm font-body text-foreground">
                    {username || user.email?.split("@")[0]}
                  </span>
                </div>
              )}
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block text-sm font-body ${
                    isActive(link.to) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="text-sm text-muted-foreground font-body">
                  Sign Out
                </button>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm text-primary font-body">
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
