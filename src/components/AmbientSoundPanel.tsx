import { useAmbientSound, Sound } from "@/hooks/useAmbientSound";
import { Slider } from "@/components/ui/slider";
import { Volume2 } from "lucide-react";

const AmbientSoundPanel = () => {
  const { activeSound, volume, playSound, changeVolume, sounds } = useAmbientSound();

  const activeYoutube = sounds.find((s) => s.id === activeSound && s.type === "youtube");

  return (
    <div className="glass-panel p-5 space-y-4">
      <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-body">
        Soundscape
      </h3>

      {/* Ambient noise */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-body mb-2">Ambient</p>
        <div className="grid grid-cols-2 gap-2">
          {sounds.filter((s) => s.type === "noise").map((sound) => (
            <button
              key={sound.id}
              onClick={() => playSound(sound)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all font-body ${
                activeSound === sound.id
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
              }`}
            >
              <span className="text-base">{sound.icon}</span>
              <span className="text-xs">{sound.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Music */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-body mb-2">Music</p>
        <div className="grid grid-cols-2 gap-2">
          {sounds.filter((s) => s.type === "youtube").map((sound) => (
            <button
              key={sound.id}
              onClick={() => playSound(sound)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all font-body ${
                activeSound === sound.id
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
              }`}
            >
              <span className="text-base">{sound.icon}</span>
              <span className="text-xs">{sound.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* YouTube embed (hidden for audio playback) */}
      {activeYoutube && activeYoutube.youtubeId && (
        <div className="rounded-lg overflow-hidden border border-border/30">
          <iframe
            src={`https://www.youtube.com/embed/${activeYoutube.youtubeId}?autoplay=1&loop=1&playlist=${activeYoutube.youtubeId}`}
            className="w-full h-20"
            allow="autoplay; encrypted-media"
            title={activeYoutube.name}
          />
        </div>
      )}

      {/* Volume for ambient sounds */}
      {activeSound && !activeYoutube && (
        <div className="flex items-center gap-3 pt-1">
          <Volume2 size={14} className="text-muted-foreground" />
          <Slider
            value={[volume * 100]}
            onValueChange={([v]) => changeVolume(v / 100)}
            max={100}
            step={1}
            className="flex-1"
          />
        </div>
      )}
    </div>
  );
};

export default AmbientSoundPanel;
