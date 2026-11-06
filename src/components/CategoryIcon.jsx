import {
  Camera,
  Palette,
  PenTool,
  Music,
  Shirt,
  Film,
  Video,
  Monitor,
  Hammer,
  Gem,
  Building2,
  Sparkles,
  Brush,
  Scissors,
} from "lucide-react";

const ICONS = {
  camera: Camera,
  palette: Palette,
  pen: PenTool,
  music: Music,
  shirt: Shirt,
  film: Film,
  video: Video,
  monitor: Monitor,
  hammer: Hammer,
  gem: Gem,
  building: Building2,
  sparkles: Sparkles,
  sculpture: Brush,
  scissors: Scissors,
};

export default function CategoryIcon({ name = "sparkles", className = "h-5 w-5" }) {
  const Icon = ICONS[name] || Sparkles;
  return <Icon className={className} strokeWidth={1.5} />;
}