"use client";

import { useState, use, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { components } from "@/lib/components-data";
import { componentRegistry } from "@/lib/component-registry";
import { cn } from "@/lib/utils";

// Import ALL registry components
import { MagneticButton } from "@/registry/magnetic-button";
import { TiltCard } from "@/registry/tilt-card";
import { GlitchText } from "@/registry/glitch-text";
import { WaveText } from "@/registry/wave-text";
import { RippleButton } from "@/registry/ripple-button";
import { GradientText } from "@/registry/gradient-text";
import { TypewriterText } from "@/registry/typewriter-text";
import { FlipCard } from "@/registry/flip-card";
import { GlassCard } from "@/registry/glass-card";
import { NeonButton } from "@/registry/neon-button";
import { BounceButton } from "@/registry/bounce-button";
import { PulseButton } from "@/registry/pulse-button";
import { OrbitLoader } from "@/registry/orbit-loader";
import { BounceLoader } from "@/registry/bounce-loader";
import { WaveLoader } from "@/registry/wave-loader";
import { SkeletonLoader } from "@/registry/skeleton-loader";
import { SpotlightCard } from "@/registry/spotlight-card";
import { FadeReveal } from "@/registry/fade-reveal";
import { StaggerReveal } from "@/registry/stagger-reveal";
import { TiltedSection } from "@/registry/tilted-section";
import { ParallaxSection } from "@/registry/parallax-section";
import { SkewedCard } from "@/registry/skewed-card";
import { SpotlightButton } from "@/registry/spotlight-button";
import { GradientBorderCard } from "@/registry/gradient-border-card";
import { HoverLiftCard } from "@/registry/hover-lift-card";
import { ScrambleText } from "@/registry/scramble-text";
import { GradientMesh } from "@/registry/gradient-mesh";
import { BlobCursor } from "@/registry/blob-cursor";

// New buttons
import { SkewedButton } from "@/registry/skewed-button";
import { LiquidButton } from "@/registry/liquid-button";
import { MorphingButton } from "@/registry/morphing-button";
import { GlitchButton } from "@/registry/glitch-button";
import { GradientShiftButton } from "@/registry/gradient-shift-button";
import { ThreeDPushButton } from "@/registry/3d-push-button";
import { RotateButton } from "@/registry/rotate-button";
import { SplitButton } from "@/registry/split-button";
import { ShakeButton } from "@/registry/shake-button";

// New cards
import { ParallaxCard } from "@/registry/parallax-card";
import { MorphingCard } from "@/registry/morphing-card";
import { RevealCard } from "@/registry/reveal-card";
import { NoiseCard } from "@/registry/noise-card";
import { FoldCard } from "@/registry/fold-card";
import { StackCard } from "@/registry/stack-card";
import { SqueezeCard } from "@/registry/squeeze-card";
import { BlurCard } from "@/registry/blur-card";

// New text effects
import { SplitText } from "@/registry/split-text";
import { BounceText } from "@/registry/bounce-text";
import { FloatText } from "@/registry/float-text";
import { NeonText } from "@/registry/neon-text";
import { OutlineText } from "@/registry/outline-text";
import { ThreeDText } from "@/registry/3d-text";
import { HighlightText } from "@/registry/highlight-text";
import { UnderlineReveal } from "@/registry/underline-reveal";
import { StrokeText } from "@/registry/stroke-text";
import { ClipText } from "@/registry/clip-text";

// New cursor effects
import { SpotlightCursor } from "@/registry/spotlight-cursor";
import { TrailCursor } from "@/registry/trail-cursor";
import { MagneticCursor } from "@/registry/magnetic-cursor";
import { EmojiCursor } from "@/registry/emoji-cursor";
import { RingCursor } from "@/registry/ring-cursor";
import { GlowCursor } from "@/registry/glow-cursor";
import { InverseCursor } from "@/registry/inverse-cursor";
import { StretchCursor } from "@/registry/stretch-cursor";
import { ParticleCursor } from "@/registry/particle-cursor";

// New backgrounds
import { NoiseBg } from "@/registry/noise-bg";
import { AuroraBg } from "@/registry/aurora-bg";
import { WavesBg } from "@/registry/waves-bg";
import { ParticlesBg } from "@/registry/particles-bg";
import { GridBg } from "@/registry/grid-bg";
import { DotsBg } from "@/registry/dots-bg";
import { BlurBlobBg } from "@/registry/blur-blob-bg";
import { StarfieldBg } from "@/registry/starfield-bg";


// New loaders
import { PulseLoader } from "@/registry/pulse-loader";
import { MorphLoader } from "@/registry/morph-loader";
import { FlipLoader } from "@/registry/flip-loader";
import { RotateLoader } from "@/registry/rotate-loader";
import { DotsLoader } from "@/registry/dots-loader";
import { BarLoader } from "@/registry/bar-loader";

// New reveals
import { SplitReveal } from "@/registry/split-reveal";
import { SlideReveal } from "@/registry/slide-reveal";
import { ScaleReveal } from "@/registry/scale-reveal";
import { RotateReveal } from "@/registry/rotate-reveal";
import { BlurReveal } from "@/registry/blur-reveal";
import { ClipReveal } from "@/registry/clip-reveal";
import { MaskReveal } from "@/registry/mask-reveal";
import { PerspectiveReveal } from "@/registry/perspective-reveal";

// New layout
import { BrokenGrid } from "@/registry/broken-grid";
import { OverlapSection } from "@/registry/overlap-section";
import { DiagonalSection } from "@/registry/diagonal-section";
import { StickyStack } from "@/registry/sticky-stack";
import { ScrollSnap, ScrollSnapItem } from "@/registry/scroll-snap";
import { AsymmetricGrid } from "@/registry/asymmetric-grid";
import { FloatingElements } from "@/registry/floating-elements";
import { PerspectiveContainer } from "@/registry/perspective-container";

// New interactions
import { MagneticArea } from "@/registry/magnetic-area";
import { HoverDistort } from "@/registry/hover-distort";
import { TiltContainer } from "@/registry/tilt-container";
import { FollowMouse } from "@/registry/follow-mouse";
import { ElasticDrag } from "@/registry/elastic-drag";
import { Keyboard } from "@/registry/keyboard";

// RareUI Premium Components
import { ParticleCard } from "@/registry/particle-card";
import { SoundText } from "@/registry/sound-text";
import { MagneticScatterText } from "@/registry/magnetic-scatter-text";
import { VaporSmokeText } from "@/registry/vapor-smoke-text";
import { SoftButton } from "@/registry/soft-button";
import { Neumorphism3DButton } from "@/registry/neumorphism-3d-button";
import { GlassShimmerButton } from "@/registry/glass-shimmer-button";

// NEW: Tabs & Navigation
import { AnimatedTabs } from "@/registry/animated-tabs";
import { FloatingDock } from "@/registry/floating-dock";
import { Breadcrumbs } from "@/registry/breadcrumbs";
import { Stepper } from "@/registry/stepper";
import { CommandPalette } from "@/registry/command-palette";

// NEW: Counters & Time
import { CountdownTimer } from "@/registry/countdown-timer";
import { FlipCounter } from "@/registry/flip-counter";
import { AnalogClock, DigitalClock } from "@/registry/clock";
import { StatsCounter } from "@/registry/stats-counter";
import { ProgressRing } from "@/registry/progress-ring";

// NEW: Badges & Indicators
import { EventBadge } from "@/registry/event-badge";
import { Badge } from "@/registry/badge";
import { SocialCount } from "@/registry/social-count";
import { RatingStars } from "@/registry/rating-stars";
import { AvatarGroup } from "@/registry/avatar-group";

// NEW: Forms
import { AnimatedInput } from "@/registry/animated-input";
import { ToggleSwitch } from "@/registry/toggle-switch";
import { FileUpload } from "@/registry/file-upload";
import { ColorPicker } from "@/registry/color-picker";
import { Slider } from "@/registry/slider";
import { PasswordInput, SearchInput, TagInput, DateInput } from "@/registry/form-inputs";
import { OTPInput, SegmentedControl, Chip, ChipGroup, PhoneInput } from "@/registry/interactive-elements";

// NEW: Feedback
import { ToastDemo } from "@/registry/toast";
import { Notification } from "@/registry/notification";
import { Modal } from "@/registry/modal";
import { Tooltip } from "@/registry/tooltip";
import { Accordion } from "@/registry/accordion";
import { ConfettiButton } from "@/registry/confetti-button";
import { Spinner, ProgressLoader, SkeletonCard } from "@/registry/loading-states";

// NEW: Premium Cards
import { PricingCard } from "@/registry/pricing-card";
import { TestimonialCard } from "@/registry/testimonial-card";
import { ProfileCard } from "@/registry/profile-card";
import { BentoGrid, BentoCard } from "@/registry/bento-grid";
import { LEDCard, AnimatedBorderCard } from "@/registry/led-card";
import { KanbanCard } from "@/registry/kanban";
import { LiquidGlassCard } from "@/registry/liquid-glass";
import { ImageCompare } from "@/registry/image-compare";
import { ImageGallery } from "@/registry/image-gallery";

// NEW: Carousels & Scrolling
import { Carousel } from "@/registry/carousel";
import { Marquee } from "@/registry/marquee";
import { Timeline } from "@/registry/timeline";

// NEW: Backgrounds
import { FlickeringGrid } from "@/registry/flickering-grid";
import { MatrixRain } from "@/registry/matrix-rain";
import { MeteorShower } from "@/registry/meteor-shower";
import { ParticleField, WaveAnimation, GravityBalls, ShootingStars, PulsatingCircles, DNAHelix, FlowingDots } from "@/registry/animations";

// NEW: Text Animations
import { Typewriter, TextReveal, WavyText, ShinyText } from "@/registry/typing-animation";
import { TextExplosion, TextFlip, TextCircular, Text3DExtrude, TextShadowPulse, TextHighlightHover } from "@/registry/text-effects";

// NEW: Image Effects
import { ImageReveal, ImageZoom, ImageParallax, ImageMask, ImageGlitch, BeforeAfterSlider, ImageTilt } from "@/registry/image-effects";

// NEW: Cursor Effects
import { CursorTrail, SpotlightCursor as SpotlightCursorNew, FollowCursor, RippleCursor, MorphingCursor } from "@/registry/cursor-effects";

// NEW: Media Controls
import { MusicPlayer, VideoPlayer, NotificationBell, ThemeToggle, VolumeControl, ZoomControl } from "@/registry/media-controls";
import { AudioVisualizer } from "@/registry/audio-visualizer";

// NEW: Social Actions
import { CopyButton, CodeBlock as CodeBlockDemo, ShareButtons, LikeButton } from "@/registry/social-actions";

// NEW: Data Visualization
import { BarChart, DonutChart, Sparkline, Heatmap, MiniStat } from "@/registry/data-visualization";

// Stateful wrapper for ThemeToggle demo
function ThemeToggleDemo() {
  const [isDark, setIsDark] = useState(true);
  return <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />;
}

// Stateful wrapper for CountdownTimer - always starts from NOW
function CountdownTimerDemo() {
  const [target] = useState(() => new Date(Date.now() + 3600000)); // 1 hour from now
  return <CountdownTimer targetDate={target} variant="cards" />;
}

// Stateful wrapper for FlipCounter - counting up
function FlipCounterDemo() {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setValue(v => v + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  return <FlipCounter value={value} />;
}

// Stateful wrapper for ToggleSwitch
function ToggleSwitchDemo() {
  const [checked, setChecked] = useState(false);
  return <ToggleSwitch checked={checked} onChange={setChecked} />;
}

// Stateful wrapper for ColorPicker
function ColorPickerDemo() {
  const [color, setColor] = useState("#8b5cf6");
  return <ColorPicker value={color} onChange={setColor} />;
}

// Stateful wrapper for Slider
function SliderDemo() {
  const [value, setValue] = useState(50);
  return <Slider value={value} onChange={setValue} className="w-48" />;
}

// Stateful wrapper for RatingStars
function RatingStarsDemo() {
  const [rating, setRating] = useState(3);
  return <RatingStars value={rating} max={5} onChange={setRating} />;
}

// Stateful wrapper for VolumeControl
function VolumeControlDemo() {
  const [volume, setVolume] = useState(75);
  return <VolumeControl value={volume} onChange={setVolume} />;
}

// Stateful wrapper for ZoomControl
function ZoomControlDemo() {
  const [zoom, setZoom] = useState(100);
  return <ZoomControl value={zoom} onChange={setZoom} />;
}

// Stateful wrapper for LikeButton
function LikeButtonDemo() {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(42);
  return (
    <LikeButton 
      liked={liked} 
      initialCount={count} 
      onLike={(isLiked) => {
        setLiked(isLiked);
        setCount(c => isLiked ? c + 1 : c - 1);
      }} 
    />
  );
}

// Stateful wrapper for ProgressRing - animating
function ProgressRingDemo() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 1));
    }, 50);
    return () => clearInterval(timer);
  }, []);
  return <ProgressRing progress={progress} size={80} />;
}

// Stateful wrapper for StatsCounter - counting up
function StatsCounterDemo() {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setValue(v => v + Math.floor(Math.random() * 10));
    }, 500);
    return () => clearInterval(timer);
  }, []);
  return <StatsCounter value={value} label="Active Users" />;
}

// Package manager icons
const PackageIcons = {
  npm: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/>
    </svg>
  ),
  pnpm: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 0v7.5h7.5V0zm8.25 0v7.5h7.498V0zm8.25 0v7.5H24V0zM8.25 8.25v7.5h7.498V8.25zM16.5 8.25v7.5H24V8.25zM8.25 16.5V24h7.498v-7.5zm8.25 0V24H24v-7.5z"/>
    </svg>
  ),
  yarn: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm.768 4.105c.183 0 .363.053.525.157.125.083.287.185.755 1.154.31-.088.468-.042.551-.019.204.056.366.19.463.375.477.917.542 2.553.334 3.605-.241 1.232-.755 2.029-1.131 2.576.324.329.778.899 1.117 1.825.278.774.31 1.478.273 2.015a5.51 5.51 0 0 0 .602-.329c.593-.366 1.487-.917 2.553-.931.714-.009 1.269.445 1.353 1.103a1.23 1.23 0 0 1-.945 1.362c-.649.158-.95.278-1.821.843-1.232.797-2.539 1.242-3.012 1.39a1.686 1.686 0 0 1-.704.343c-.737.181-3.266.315-3.466.315h-.046c-.783 0-1.214-.241-1.45-.491-.658.329-1.51.19-2.122-.134a1.078 1.078 0 0 1-.58-1.153 1.243 1.243 0 0 1-.153-.195c-.162-.25-.528-.936-.454-1.946.056-.723.556-1.367.88-1.71a5.522 5.522 0 0 1 .408-2.256c.306-.727.885-1.348 1.32-1.737-.32-.537-.644-1.367-.329-2.21.227-.602.412-.936.82-1.08h-.005c.199-.074.389-.153.486-.259a3.418 3.418 0 0 1 2.298-1.103c.037-.093.079-.185.125-.283.31-.658.639-1.029 1.024-1.168a.94.94 0 0 1 .328-.06z"/>
    </svg>
  ),
  bun: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22.596c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm-1.756-13.837c-.347 0-.628.28-.628.628 0 .347.281.628.628.628.347 0 .628-.281.628-.628 0-.348-.28-.628-.628-.628zm3.512 0c-.347 0-.628.28-.628.628 0 .347.281.628.628.628.347 0 .628-.281.628-.628 0-.348-.281-.628-.628-.628zm-5.82 3.267c0 1.748 1.418 3.166 3.166 3.166h1.796c1.748 0 3.166-1.418 3.166-3.166v-.628c0-.173-.14-.314-.314-.314H8.25c-.173 0-.314.14-.314.314v.628z"/>
    </svg>
  ),
};

// Copy icon component
function CopyIcon({ copied }: { copied: boolean }) {
  return copied ? (
    <motion.svg
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="w-4 h-4 text-green-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </motion.svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

// Code block with syntax highlighting and copy button
function CodeBlock({ 
  code, 
  language = "bash",
  showLineNumbers = false,
  className = "",
  maxHeight,
}: { 
  code: string; 
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
  maxHeight?: string;
}) {
  const [copied, setCopied] = useState(false);
  
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className={cn("group relative rounded-xl border border-border bg-zinc-900 overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-black/30">
        <span className="text-xs text-muted font-mono">{language}</span>
        <motion.button
          onClick={copyCode}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-muted hover:text-foreground hover:bg-border/50 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <CopyIcon copied={copied} />
          <span>{copied ? "Copied!" : "Copy"}</span>
        </motion.button>
      </div>
      {/* Code */}
      <div 
        className="overflow-auto"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <pre className={cn("p-4 text-sm", showLineNumbers && "flex")}>
          {showLineNumbers && (
            <div className="pr-4 mr-4 border-r border-border/30 text-muted/50 select-none font-mono text-xs text-right shrink-0">
              {code.split('\n').map((_, i) => (
                <div key={i} className="leading-relaxed">{i + 1}</div>
              ))}
            </div>
          )}
          <code className="text-zinc-300 font-mono text-[13px] leading-relaxed flex-1 overflow-x-auto">{code}</code>
        </pre>
      </div>
    </div>
  );
}

// Animated tab indicator
function TabIndicator({ activeIndex, tabRefs }: { activeIndex: number; tabRefs: React.RefObject<(HTMLButtonElement | null)[]> }) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  
  useState(() => {
    const updateIndicator = () => {
      const tab = tabRefs.current?.[activeIndex];
      if (tab) {
        setIndicatorStyle({
          left: tab.offsetLeft,
          width: tab.offsetWidth,
        });
      }
    };
    updateIndicator();
  });
  
  return (
    <motion.div
      className="absolute bottom-0 h-0.5 bg-accent rounded-full"
      layoutId="tab-indicator"
      initial={false}
      animate={indicatorStyle}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  );
}

export default function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [packageManager, setPackageManager] = useState<"npm" | "pnpm" | "yarn" | "bun">("npm");
  const [installMethod, setInstallMethod] = useState<"cli" | "manual">("cli");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  // Resizable panel state
  const [panelWidth, setPanelWidth] = useState(40); // percentage - default 40%
  const [isDragging, setIsDragging] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if desktop
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Handle resize drag
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      // Clamp between 25% and 65%
      setPanelWidth(Math.min(65, Math.max(25, newWidth)));
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const component = components.find((c) => c.slug === slug);
  
  // Find prev/next components for navigation
  const currentIndex = components.findIndex((c) => c.slug === slug);
  const prevComponent = currentIndex > 0 ? components[currentIndex - 1] : null;
  const nextComponent = currentIndex < components.length - 1 ? components[currentIndex + 1] : null;
  
  const router = useRouter();
  
  // Keyboard navigation with arrow keys
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger if user is typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    
    if (e.key === 'ArrowLeft' && prevComponent) {
      router.push(`/components/${prevComponent.slug}`);
    } else if (e.key === 'ArrowRight' && nextComponent) {
      router.push(`/components/${nextComponent.slug}`);
    }
  }, [prevComponent, nextComponent, router]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!component) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Component not found</h1>
          <Link href="/components" className="text-accent hover:underline">
            Back to components
          </Link>
        </div>
      </div>
    );
  }

  const installCommands = {
    npm: `npx shadcn@latest add https://nonaxial.com/r/${slug}.json`,
    pnpm: `pnpm dlx shadcn@latest add https://nonaxial.com/r/${slug}.json`,
    yarn: `yarn dlx shadcn@latest add https://nonaxial.com/r/${slug}.json`,
    bun: `bunx shadcn@latest add https://nonaxial.com/r/${slug}.json`,
  };

  const setCopied = (key: string, value: boolean) => {
    setCopiedStates(prev => ({ ...prev, [key]: value }));
    if (value) {
      setTimeout(() => setCopiedStates(prev => ({ ...prev, [key]: false })), 2000);
    }
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(installCommands[packageManager]);
    setCopied('install', true);
  };

  // Get component source code
  const componentCode = getComponentCode(slug);
  const pascalName = toPascalCase(slug);

  return (
    <div className="min-h-screen" ref={containerRef}>
      {/* Main Content - Side by Side Layout */}
      <div className="flex flex-col lg:flex-row pt-16">
        {/* Left Side - Preview (Fixed on desktop, Sticky on mobile) */}
        <div 
          className="w-full h-[50vh] md:h-[55vh] border-b lg:border-b-0 lg:border-r border-border bg-background lg:fixed lg:left-0 lg:top-16 lg:h-[calc(100vh-64px)] z-10 flex-shrink-0"
          style={isDesktop ? { width: `${panelWidth}%` } : undefined}
        >
          <div className="h-full flex flex-col">
            {/* Preview Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card/50 backdrop-blur-sm">
              {/* Left: Back button */}
              <Link
                href="/components"
                className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm font-medium">Components</span>
              </Link>
              
              {/* Right: Nav arrows */}
              <div className="flex items-center gap-1">
                {prevComponent ? (
                  <Link
                    href={`/components/${prevComponent.slug}`}
                    className="group relative flex items-center justify-center w-8 h-8 rounded-full bg-card hover:bg-card/80 border border-border transition-all duration-200"
                    title={`Previous: ${prevComponent.name}`}
                  >
                    <svg className="w-4 h-4 text-muted group-hover:text-foreground transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Link>
                ) : (
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.02] border border-white/[0.04] opacity-30 cursor-not-allowed">
                    <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </span>
                )}
                
                <span className="px-2 text-[11px] text-muted font-mono tabular-nums">
                  {currentIndex + 1}<span className="text-muted/60">/</span>{components.length}
                </span>
                
                {nextComponent ? (
                  <Link
                    href={`/components/${nextComponent.slug}`}
                    className="group relative flex items-center justify-center w-8 h-8 rounded-full bg-card hover:bg-card/80 border border-border transition-all duration-200"
                    title={`Next: ${nextComponent.name}`}
                  >
                    <svg className="w-4 h-4 text-muted group-hover:text-foreground transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-card/50 border border-border opacity-30 cursor-not-allowed">
                    <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
            
            {/* Preview Content */}
            <div className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-card">
                {/* Grid pattern background - hidden for full-bleed components */}
                {component.category !== "Backgrounds" && component.category !== "Cursor Effects" && (
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.08)_1px,transparent_0)]" style={{
                      backgroundSize: '24px 24px'
                    }} />
                  </div>
                )}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slug}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <ComponentDemo slug={slug} category={component.category} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          {/* Resize Handle */}
          <div
            className="hidden lg:block absolute right-0 top-0 h-full w-3 cursor-col-resize z-20 group"
            onMouseDown={handleMouseDown}
          >
            <div 
              className={cn(
                "absolute right-0 top-0 h-full w-[2px] transition-all duration-150",
                isDragging 
                  ? "bg-accent" 
                  : "bg-border/50 group-hover:bg-accent/70"
              )}
            />
          </div>
        </div>

        {/* Right Side - Installation & Details */}
        <div 
          className="w-full px-6 lg:px-10 py-8 lg:py-12"
          style={isDesktop ? { marginLeft: `${panelWidth}%`, width: `${100 - panelWidth}%` } : undefined}
        >
          {/* Component Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold tracking-tight">{component.name}</h1>
              <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                {component.category}
              </span>
            </div>
            <p className="text-muted leading-relaxed">{component.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {component.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-xs bg-card/80 border border-border/50 text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Installation Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Installation
            </h2>

            {/* CLI / Manual Toggle */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-card/50 border border-border/50 mb-5 w-fit">
              {(["cli", "manual"] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => setInstallMethod(method)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    installMethod === method
                      ? "bg-foreground text-background shadow-lg"
                      : "text-muted hover:text-foreground"
                  )}
                >
                  {method === "cli" ? "CLI" : "Manual"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {installMethod === "cli" ? (
                <motion.div
                  key="cli"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Package Manager Tabs */}
                  <div className="relative mb-4">
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-border/50">
                      {(["npm", "pnpm", "yarn", "bun"] as const).map((pm, index) => (
                        <motion.button
                          key={pm}
                          ref={(el) => { tabRefs.current[index] = el; }}
                          onClick={() => setPackageManager(pm)}
                          className={cn(
                            "relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 z-10",
                            packageManager === pm
                              ? "text-foreground bg-accent/20 border border-accent/30"
                              : "text-muted hover:text-foreground border border-transparent"
                          )}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="relative z-10">{PackageIcons[pm]}</span>
                          <span className="relative z-10">{pm}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Install Command */}
                  <div className="relative group">
                    <div className="flex items-center gap-3 px-4 py-4 pr-24 rounded-xl border border-border/50 bg-zinc-900 font-mono text-sm overflow-hidden">
                      <span className="text-accent font-bold shrink-0">$</span>
                      <div className="overflow-x-auto overflow-y-hidden scrollbar-none">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={packageManager}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                            className="text-zinc-300 whitespace-nowrap block"
                          >
                            {installCommands[packageManager]}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      {/* Fade gradient */}
                      <div 
                        className="absolute right-20 top-0 bottom-0 w-12 pointer-events-none"
                        style={{ background: 'linear-gradient(to right, transparent, var(--background))' }}
                      />
                    </div>
                    <motion.button
                      onClick={copyCommand}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 border border-border/50 hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white text-xs font-medium"
                      whileTap={{ scale: 0.95 }}
                    >
                      <CopyIcon copied={copiedStates['install'] || false} />
                      <span>{copiedStates['install'] ? "Copied!" : "Copy"}</span>
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Step 1: Install dependencies */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">1</div>
                      <span className="text-sm font-medium">Install dependencies</span>
                    </div>
                    <CodeBlock 
                      code="npm install framer-motion clsx tailwind-merge" 
                      language="bash"
                    />
                  </div>

                  {/* Step 2: Add utils */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">2</div>
                      <span className="text-sm font-medium">Add the cn utility</span>
                    </div>
                    <CodeBlock 
                      code={`import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`}
                      language="lib/utils.ts"
                    />
                  </div>

                  {/* Step 3: Copy component */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">3</div>
                      <span className="text-sm font-medium">Copy the component</span>
                    </div>
                    <CodeBlock 
                      code={componentCode}
                      language={`components/nonaxial/${slug}.tsx`}
                      showLineNumbers
                      maxHeight="400px"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Usage Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Usage
            </h2>
            <CodeBlock 
              code={`import { ${pascalName} } from "@/components/nonaxial/${slug}"

export default function Example() {
  return (
    <${pascalName}>{/* Your content here */}</${pascalName}>
  )
}`}
              language="tsx"
            />
          </motion.div>

          {/* Props Section (if applicable) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Props
            </h2>
            <div className="rounded-xl border border-border/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-card/50 border-b border-border/50">
                    <th className="text-left px-4 py-3 font-medium text-muted">Prop</th>
                    <th className="text-left px-4 py-3 font-medium text-muted">Type</th>
                    <th className="text-left px-4 py-3 font-medium text-muted">Default</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/30">
                    <td className="px-4 py-3 font-mono text-accent text-xs">children</td>
                    <td className="px-4 py-3 font-mono text-muted text-xs">ReactNode</td>
                    <td className="px-4 py-3 text-muted text-xs">—</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="px-4 py-3 font-mono text-accent text-xs">className</td>
                    <td className="px-4 py-3 font-mono text-muted text-xs">string</td>
                    <td className="px-4 py-3 text-muted text-xs">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Helper to convert slug to PascalCase
function toPascalCase(str: string) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

// Component demos - renders actual components
function ComponentDemo({ slug, category }: { slug: string; category: string }) {
  const isFullBleed = category === "Backgrounds" || category === "Cursor Effects";
  // Map of slug to actual interactive demo
  const demos: Record<string, React.ReactNode> = {
    // Buttons
    "magnetic-button": <MagneticButton>Hover me!</MagneticButton>,
    "ripple-button": <RippleButton>Click for Ripple</RippleButton>,
    "neon-button": <NeonButton>Neon Glow</NeonButton>,
    "bounce-button": <BounceButton>Bounce!</BounceButton>,
    "pulse-button": <PulseButton>Pulsing</PulseButton>,
    "spotlight-button": <SpotlightButton>Spotlight</SpotlightButton>,
    "skewed-button": <SkewedButton>Skewed</SkewedButton>,
    "liquid-button": <LiquidButton>Liquid</LiquidButton>,
    "morphing-button": <MorphingButton>Morphing</MorphingButton>,
    "glitch-button": <GlitchButton>Glitch</GlitchButton>,
    "gradient-shift-button": <GradientShiftButton>Gradient</GradientShiftButton>,
    "3d-push-button": <ThreeDPushButton>Push Me</ThreeDPushButton>,
    "rotate-button": <RotateButton>Rotate</RotateButton>,
    "split-button": <SplitButton>Split</SplitButton>,
    "shake-button": <ShakeButton>Shake</ShakeButton>,

    // Cards
    "tilt-card": (
      <TiltCard className="w-64 h-40 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center">
        <span className="text-white font-medium">Tilt Me</span>
      </TiltCard>
    ),
    "flip-card": (
      <FlipCard
        front={<div className="flex items-center justify-center h-full font-bold">Click to Flip</div>}
        back={<div className="flex items-center justify-center h-full font-bold">Back Side!</div>}
        className="w-48 h-32"
      />
    ),
    "glass-card": (
      <GlassCard className="w-64 h-40 flex items-center justify-center">
        <span className="text-white font-medium">Glass Effect</span>
      </GlassCard>
    ),
    "spotlight-card": (
      <SpotlightCard className="w-64 h-40 flex items-center justify-center">
        <span className="text-white font-medium">Move cursor here</span>
      </SpotlightCard>
    ),
    "skewed-card": (
      <SkewedCard className="w-64 h-40">
        <div className="flex items-center justify-center h-full font-medium">Skewed</div>
      </SkewedCard>
    ),
    "gradient-border-card": (
      <div className="p-8">
        <GradientBorderCard className="w-64 h-40 flex items-center justify-center">
          <span className="text-white font-medium">Gradient Border</span>
        </GradientBorderCard>
      </div>
    ),
    "hover-lift-card": (
      <HoverLiftCard className="w-64 h-40 flex items-center justify-center">
        <span className="text-white font-medium">Hover to Lift</span>
      </HoverLiftCard>
    ),
    "parallax-card": (
      <ParallaxCard className="w-64 h-40 flex items-center justify-center">
        <span className="text-white font-medium">Parallax Effect</span>
      </ParallaxCard>
    ),
    "morphing-card": (
      <MorphingCard className="w-64 h-40 flex items-center justify-center">
        <span className="text-white font-medium">Morphing</span>
      </MorphingCard>
    ),
    "reveal-card": (
      <RevealCard className="w-64 h-40">
        <span className="text-white font-medium">Hover to Reveal</span>
      </RevealCard>
    ),
    "noise-card": (
      <NoiseCard className="w-64 h-40 flex items-center justify-center">
        <span className="text-white font-medium">Noise Texture</span>
      </NoiseCard>
    ),
    "fold-card": (
      <FoldCard className="w-64 h-40 flex items-center justify-center">
        <span className="text-white font-medium">Fold Effect</span>
      </FoldCard>
    ),
    "stack-card": (
      <StackCard className="w-64 h-40 flex items-center justify-center">
        <span className="text-white font-medium">Stack</span>
      </StackCard>
    ),
    "squeeze-card": (
      <SqueezeCard className="w-64 h-40 flex items-center justify-center">
        <span className="text-white font-medium">Squeeze</span>
      </SqueezeCard>
    ),
    "blur-card": (
      <BlurCard className="w-64 h-40 flex items-center justify-center">
        <span className="text-white font-medium">Blur</span>
      </BlurCard>
    ),

    // Text effects
    "glitch-text": <GlitchText className="text-4xl font-bold">GLITCH EFFECT</GlitchText>,
    "wave-text": <WaveText className="text-4xl font-bold">Wave Motion</WaveText>,
    "gradient-text": <GradientText className="text-4xl font-bold">Gradient Flow</GradientText>,
    "typewriter-text": <TypewriterText className="text-2xl font-mono" text="Hello World..." />,
    "scramble-text": <ScrambleText className="text-2xl font-mono">Hover me</ScrambleText>,
    "split-text": <SplitText className="text-3xl font-bold">Split Text</SplitText>,
    "bounce-text": <BounceText className="text-3xl font-bold">Bouncing</BounceText>,
    "float-text": <FloatText className="text-3xl font-bold">Floating</FloatText>,
    "neon-text": <NeonText className="text-3xl font-bold">Neon</NeonText>,
    "outline-text": <OutlineText className="text-4xl font-bold">Outline</OutlineText>,
    "3d-text": <ThreeDText className="text-4xl font-bold">3D Text</ThreeDText>,
    "highlight-text": <HighlightText className="text-2xl">Highlighted Text</HighlightText>,
    "underline-reveal": <UnderlineReveal className="text-2xl">Hover for underline</UnderlineReveal>,
    "stroke-text": <StrokeText className="text-4xl font-bold">Stroke</StrokeText>,
    "clip-text": <ClipText className="text-4xl font-bold">Clipped</ClipText>,

    // Cursor effects - these render fixed position cursors
    "blob-cursor": (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <BlobCursor />
        <span className="text-zinc-400 text-sm pointer-events-none">Move cursor anywhere</span>
      </div>
    ),
    "spotlight-cursor": (
      <SpotlightCursor className="w-full h-full flex items-center justify-center">
        <span className="text-zinc-400 text-sm">Move cursor here</span>
      </SpotlightCursor>
    ),
    "trail-cursor": (
      <TrailCursor className="w-full h-full flex items-center justify-center">
        <span className="text-zinc-400 text-sm">Move cursor here</span>
      </TrailCursor>
    ),
    "magnetic-cursor": (
      <MagneticCursor className="w-full h-full flex items-center justify-center">
        <span className="text-zinc-400 text-sm">Move cursor here</span>
      </MagneticCursor>
    ),
    "emoji-cursor": (
      <EmojiCursor className="w-full h-full flex items-center justify-center">
        <span className="text-zinc-400 text-sm">Click for emojis</span>
      </EmojiCursor>
    ),
    "ring-cursor": (
      <RingCursor className="w-full h-full flex items-center justify-center">
        <span className="text-zinc-400 text-sm">Move cursor here</span>
      </RingCursor>
    ),
    "glow-cursor": (
      <GlowCursor className="w-full h-full flex items-center justify-center">
        <span className="text-zinc-400 text-sm">Move cursor here</span>
      </GlowCursor>
    ),
    "inverse-cursor": (
      <InverseCursor className="w-full h-full flex items-center justify-center">
        <span className="text-zinc-400 text-sm">Move cursor here</span>
      </InverseCursor>
    ),
    "stretch-cursor": (
      <StretchCursor className="w-full h-full flex items-center justify-center">
        <span className="text-zinc-400 text-sm">Move fast</span>
      </StretchCursor>
    ),
    "particle-cursor": (
      <ParticleCursor className="w-full h-full flex items-center justify-center">
        <span className="text-zinc-400 text-sm">Move cursor here</span>
      </ParticleCursor>
    ),

    // Backgrounds
    "gradient-mesh": (
      <div className="relative w-full h-full overflow-hidden">
        <GradientMesh className="absolute inset-0" />
        <span className="relative z-10 text-white font-medium flex items-center justify-center h-full">Gradient Mesh</span>
      </div>
    ),
    "noise-bg": (
      <NoiseBg className="w-full h-full bg-violet-500/20 flex items-center justify-center">
        <span className="text-white font-medium">Noise Background</span>
      </NoiseBg>
    ),
    "aurora-bg": (
      <AuroraBg className="w-full h-full flex items-center justify-center">
        <span className="text-white font-medium relative z-10">Aurora</span>
      </AuroraBg>
    ),
    "waves-bg": (
      <WavesBg className="w-full h-full flex items-center justify-center">
        <span className="text-white font-medium relative z-10">Waves</span>
      </WavesBg>
    ),
    "particles-bg": (
      <ParticlesBg className="w-full h-full flex items-center justify-center">
        <span className="text-white font-medium relative z-10">Particles</span>
      </ParticlesBg>
    ),
    "grid-bg": (
      <GridBg className="w-full h-full flex items-center justify-center">
        <span className="text-white font-medium relative z-10">Grid</span>
      </GridBg>
    ),
    "dots-bg": (
      <DotsBg className="w-full h-full flex items-center justify-center">
        <span className="text-white font-medium relative z-10">Dots</span>
      </DotsBg>
    ),
    "blur-blob-bg": (
      <BlurBlobBg className="w-full h-full flex items-center justify-center">
        <span className="text-white font-medium relative z-10">Blur Blobs</span>
      </BlurBlobBg>
    ),
    "starfield-bg": (
      <StarfieldBg className="w-full h-full flex items-center justify-center" starCount={50}>
        <span className="text-white font-medium relative z-10">Starfield</span>
      </StarfieldBg>
    ),


    // Loaders
    "orbit-loader": <OrbitLoader />,
    "bounce-loader": <BounceLoader />,
    "wave-loader": <WaveLoader />,
    "skeleton-loader": <SkeletonLoader className="w-64" />,
    "pulse-loader": <PulseLoader />,
    "morph-loader": <MorphLoader />,
    "flip-loader": <FlipLoader />,
    "rotate-loader": <RotateLoader />,
    "dots-loader": <DotsLoader />,
    "bar-loader": <BarLoader />,

    // Reveals
    "fade-reveal": (
      <FadeReveal>
        <div className="text-2xl font-bold">I fade in!</div>
      </FadeReveal>
    ),
    "stagger-reveal": (
      <StaggerReveal>
        <div className="flex gap-2">
          {["S", "T", "A", "G", "G", "E", "R"].map((letter, i) => (
            <span key={i} className="text-2xl font-bold">{letter}</span>
          ))}
        </div>
      </StaggerReveal>
    ),
    "split-reveal": (
      <SplitReveal>
        <div className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-6 py-3 rounded-lg">
          Split Reveal
        </div>
      </SplitReveal>
    ),
    "slide-reveal": (
      <SlideReveal direction="up">
        <div className="text-2xl font-bold">Sliding In!</div>
      </SlideReveal>
    ),
    "scale-reveal": (
      <ScaleReveal>
        <div className="text-2xl font-bold">Scale Up!</div>
      </ScaleReveal>
    ),
    "rotate-reveal": (
      <RotateReveal>
        <div className="text-2xl font-bold">Rotate In!</div>
      </RotateReveal>
    ),
    "blur-reveal": (
      <BlurReveal>
        <div className="text-2xl font-bold">Blur to Clear</div>
      </BlurReveal>
    ),
    "clip-reveal": (
      <ClipReveal direction="left">
        <div className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-6 py-3 rounded-lg">
          Clip Reveal
        </div>
      </ClipReveal>
    ),
    "mask-reveal": (
      <MaskReveal>
        <div className="text-2xl font-bold">Mask Reveal</div>
      </MaskReveal>
    ),
    "perspective-reveal": (
      <PerspectiveReveal>
        <div className="text-2xl font-bold">3D Perspective</div>
      </PerspectiveReveal>
    ),

    // Layout
    "tilted-section": (
      <TiltedSection className="w-64 h-32 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
        <span className="text-white font-medium">Tilted</span>
      </TiltedSection>
    ),
    "parallax-section": (
      <ParallaxSection className="w-64 h-32 flex items-center justify-center">
        <span className="text-white font-medium">Scroll me</span>
      </ParallaxSection>
    ),
    "broken-grid": (
      <BrokenGrid className="w-full max-w-md text-xs">
        <div className="bg-violet-500/20 p-4 rounded">1</div>
        <div className="bg-fuchsia-500/20 p-4 rounded">2</div>
        <div className="bg-cyan-500/20 p-4 rounded">3</div>
      </BrokenGrid>
    ),
    "overlap-section": (
      <div className="relative">
        <div className="bg-violet-500/20 p-6 rounded-lg">First</div>
        <OverlapSection overlap={20} className="bg-fuchsia-500/20 p-6 rounded-lg">
          Overlapping
        </OverlapSection>
      </div>
    ),
    "diagonal-section": (
      <DiagonalSection className="w-64 bg-violet-500/10" bgColor="rgba(139, 92, 246, 0.2)">
        <div className="text-center py-2 text-white font-medium">Diagonal</div>
      </DiagonalSection>
    ),
    "sticky-stack": (
      <div className="flex flex-col items-center w-full py-8">
        <StickyStack className="w-full max-w-md mx-auto">
          {[
            <div key="1" className="bg-violet-500/80 text-white rounded-2xl p-8 text-lg font-bold shadow-xl">Sticky Card 1</div>,
            <div key="2" className="bg-fuchsia-500/80 text-white rounded-2xl p-8 text-lg font-bold shadow-xl">Sticky Card 2</div>,
            <div key="3" className="bg-cyan-500/80 text-white rounded-2xl p-8 text-lg font-bold shadow-xl">Sticky Card 3</div>,
          ]}
        </StickyStack>
        <div className="text-xs text-zinc-400 mt-6">Scroll to see the sticky stack effect</div>
      </div>
    ),
    "scroll-snap": (
      <div className="w-80 h-40 relative">
        <div className="w-full h-full overflow-x-auto snap-x snap-mandatory flex rounded-lg">
          {["violet", "fuchsia", "cyan"].map((color, i) => (
            <div
              key={i}
              className="snap-center flex-shrink-0 w-full h-full flex items-center justify-center text-white font-medium"
              style={{ background: `linear-gradient(135deg, rgba(139,92,246,${0.3 + i * 0.2}), rgba(236,72,153,${0.3 + i * 0.2}))` }}
            >
              Section {i + 1}
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-400 text-center mt-2">Scroll horizontally →</p>
      </div>
    ),
    "asymmetric-grid": (
      <AsymmetricGrid className="w-full max-w-sm text-xs">
        <div className="bg-violet-500/20 p-4 rounded">Big</div>
        <div className="bg-fuchsia-500/20 p-4 rounded">2</div>
        <div className="bg-cyan-500/20 p-4 rounded">3</div>
      </AsymmetricGrid>
    ),
    "floating-elements": (
      <FloatingElements className="w-64 h-32 flex items-center justify-center">
        <span className="text-white font-medium">Floating Orbs</span>
      </FloatingElements>
    ),
    "perspective-container": (
      <PerspectiveContainer className="w-64" perspective={800}>
        <motion.div 
          className="bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 p-4 rounded-lg"
          animate={{ rotateY: [0, 15, 0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <span className="text-white font-medium">3D Container</span>
        </motion.div>
      </PerspectiveContainer>
    ),

    // Interactions
    "magnetic-area": (
      <MagneticArea className="p-8">
        <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 px-6 py-3 rounded-lg text-white font-medium">
          Magnetic
        </div>
      </MagneticArea>
    ),
    "hover-distort": (
      <HoverDistort className="w-64 h-32 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-lg flex items-center justify-center">
        <span className="text-white font-medium">Hover to Distort</span>
      </HoverDistort>
    ),
    "tilt-container": (
      <TiltContainer className="w-64 h-32 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-lg flex items-center justify-center">
        <span className="text-white font-medium">Tilt Container</span>
      </TiltContainer>
    ),
    "follow-mouse": (
      <FollowMouse className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xs">Follow</span>
      </FollowMouse>
    ),
    "elastic-drag": (
      <ElasticDrag className="w-32 h-32 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-lg flex items-center justify-center">
        <span className="text-white font-medium text-sm">Drag me</span>
      </ElasticDrag>
    ),

    // RareUI Premium Components
    "particle-card": (
      <ParticleCard 
        title="Magic Card"
        subtitle="Hover to reveal"
        description="This card explodes into particles on hover, revealing rich content underneath with a mesmerizing visual effect."
        tags={["React", "Animation", "Premium"]}
      />
    ),
    "sound-text": (
      <SoundText text="Hover over each letter!" className="text-3xl" />
    ),
    "magnetic-scatter-text": (
      <MagneticScatterText text="Magnetic Scatter" className="text-3xl" />
    ),
    "vapor-smoke-text": (
      <VaporSmokeText text="Vapor Smoke Effect" className="text-3xl" />
    ),
    "soft-button": (
      <SoftButton>Neumorphic</SoftButton>
    ),
    "neumorphism-3d-button": (
      <Neumorphism3DButton>Press Me</Neumorphism3DButton>
    ),
    "glass-shimmer-button": (
      <GlassShimmerButton>Shimmer Effect</GlassShimmerButton>
    ),

    // =====================
    // NEW COMPONENT DEMOS
    // =====================

    // Navigation
    "animated-tabs": (
      <AnimatedTabs
        tabs={[
          { id: "home", label: "Home" },
          { id: "about", label: "About" },
          { id: "contact", label: "Contact" },
        ]}
        defaultTab="home"
      />
    ),
    "floating-dock": (
      <FloatingDock
        items={[
          { id: "1", icon: <span>🏠</span>, label: "Home" },
          { id: "2", icon: <span>📁</span>, label: "Files" },
          { id: "3", icon: <span>⚙️</span>, label: "Settings" },
        ]}
      />
    ),
    "breadcrumbs": (
      <Breadcrumbs
        items={[
          { label: "Home", href: "#" },
          { label: "Products", href: "#" },
          { label: "Details" },
        ]}
      />
    ),
    "stepper": (
      <Stepper
        steps={[
          { id: "1", title: "Step 1" },
          { id: "2", title: "Step 2" },
          { id: "3", title: "Step 3" },
        ]}
        currentStep={1}
      />
    ),
    "command-palette": (
      <div className="text-sm text-zinc-400 text-center p-4">Press ⌘K to open</div>
    ),

    // Counters
    "countdown-timer": <CountdownTimerDemo />,
    "flip-counter": <FlipCounterDemo />,
    "clock": <AnalogClock size={100} />,
    "stats-counter": <StatsCounterDemo />,
    "progress-ring": <ProgressRingDemo />,

    // Badges
    "event-badge": <EventBadge title="Launch" date="Feb 20" />,
    "badge": <Badge variant="success">New</Badge>,
    "social-count": <SocialCount count={12500} label="Followers" />,
    "rating-stars": <RatingStarsDemo />,
    "avatar-group": (
      <AvatarGroup
        avatars={[
          { src: "https://i.pravatar.cc/100?img=1", name: "User 1" },
          { src: "https://i.pravatar.cc/100?img=2", name: "User 2" },
          { src: "https://i.pravatar.cc/100?img=3", name: "User 3" },
        ]}
        max={3}
      />
    ),

    // Forms
    "animated-input": <AnimatedInput label="Email" placeholder="Enter email" />,
    "toggle-switch": <ToggleSwitchDemo />,
    "file-upload": (
      <div className="w-48">
        <FileUpload />
      </div>
    ),
    "color-picker": <ColorPickerDemo />,
    "slider": <SliderDemo />,
    "password-input": (
      <div className="w-56">
        <PasswordInput value="" onChange={() => {}} />
      </div>
    ),
    "search-input": (
      <div className="w-56">
        <SearchInput value="" onChange={() => {}} placeholder="Search..." />
      </div>
    ),
    "tag-input": (
      <div className="w-64">
        <TagInput tags={["react", "nextjs"]} onChange={() => {}} />
      </div>
    ),
    "date-input": (
      <div className="w-56">
        <DateInput value={new Date()} onChange={() => {}} />
      </div>
    ),
    "otp-input": <OTPInput length={4} onComplete={() => {}} />,

    // Feedback
    "toast": (
      <ToastDemo
        title="Success!"
        description="Your changes have been saved."
        type="success"
      />
    ),
    "notification": (
      <Notification
        id="demo-1"
        title="New message"
        message="You have a new notification"
        type="info"
      />
    ),
    "modal": (
      <div className="text-sm text-zinc-400 text-center p-4">Click to open modal</div>
    ),
    "tooltip": (
      <Tooltip content="This is a tooltip">
        <button className="px-4 py-2 bg-violet-500 rounded-lg text-white">Hover me</button>
      </Tooltip>
    ),
    "accordion": (
      <div className="w-64">
        <Accordion
          items={[
            { id: "1", title: "Section 1", content: "Content for section 1" },
            { id: "2", title: "Section 2", content: "Content for section 2" },
          ]}
        />
      </div>
    ),
    "confetti-button": <ConfettiButton>Celebrate 🎉</ConfettiButton>,
    "loading-states": <Spinner size="md" variant="dots" />,
    "skeleton-loader-new": <SkeletonCard className="w-48" />,
    "progress-loader": <ProgressLoader progress={65} className="w-48" />,
    "infinite-scroll-loader": <Spinner size="sm" />,

    // Premium Cards
    "pricing-card": (
      <PricingCard
        name="Pro"
        price={29}
        features={[
          { text: "Feature 1", included: true },
          { text: "Feature 2", included: true },
          { text: "Feature 3", included: false },
        ]}
        popular
      />
    ),
    "testimonial-card": (
      <TestimonialCard
        content="Amazing product!"
        author={{ name: "John Doe", title: "CEO" }}
      />
    ),
    "profile-card": (
      <ProfileCard
        name="Jane Smith"
        title="Designer"
        avatar="https://i.pravatar.cc/100?img=10"
      />
    ),
    "bento-grid": (
      <div className="w-64">
        <BentoGrid>
          <BentoCard colSpan={2} className="h-20 bg-violet-500/20 flex items-center justify-center">1</BentoCard>
          <BentoCard className="h-20 bg-fuchsia-500/20 flex items-center justify-center">2</BentoCard>
        </BentoGrid>
      </div>
    ),
    "led-card": (
      <LEDCard className="w-48 h-32 flex items-center justify-center">
        <span className="text-white">LED Border</span>
      </LEDCard>
    ),
    "animated-border-card": (
      <AnimatedBorderCard className="w-48 h-32 flex items-center justify-center">
        <span className="text-white">Animated</span>
      </AnimatedBorderCard>
    ),
    "kanban": (
      <KanbanCard task={{ id: "1", title: "Task", description: "Drag me" }} />
    ),
    "liquid-glass": (
      <LiquidGlassCard className="w-48 h-32 flex items-center justify-center">
        <span className="text-white">Glass</span>
      </LiquidGlassCard>
    ),
    "image-compare": (
      <div className="w-64 h-40">
        <ImageCompare
          beforeImage="https://picsum.photos/300/200?grayscale"
          afterImage="https://picsum.photos/300/200"
        />
      </div>
    ),
    "image-gallery": (
      <div className="text-sm text-zinc-400 text-center p-4">Image grid gallery</div>
    ),

    // Carousels
    "carousel": (
      <div className="w-64">
        <Carousel
          items={[
            <div key={1} className="h-32 bg-violet-500/30 rounded-lg flex items-center justify-center">Slide 1</div>,
            <div key={2} className="h-32 bg-fuchsia-500/30 rounded-lg flex items-center justify-center">Slide 2</div>,
          ]}
        />
      </div>
    ),
    "marquee": (
      <div className="w-64 overflow-hidden">
        <Marquee speed={30}>
          <span className="mx-4 text-white">✨ Scrolling text ✨</span>
          <span className="mx-4 text-violet-400">Infinite marquee</span>
        </Marquee>
      </div>
    ),
    "timeline": (
      <div className="w-64">
        <Timeline
          items={[
            { id: "1", title: "Step 1", description: "First step" },
            { id: "2", title: "Step 2", description: "Second step" },
          ]}
        />
      </div>
    ),

    // Backgrounds
    "flickering-grid": (
      <div className="w-full h-full min-h-[120px] rounded-xl overflow-hidden relative">
        <FlickeringGrid className="absolute inset-0" />
      </div>
    ),
    "matrix-rain": (
      <div className="w-full h-full min-h-[120px] rounded-xl overflow-hidden relative bg-black">
        <MatrixRain className="absolute inset-0" />
      </div>
    ),
    "meteor-shower": (
      <div className="w-full h-full min-h-[120px] rounded-xl overflow-hidden relative bg-zinc-900">
        <MeteorShower />
      </div>
    ),
    "particle-field": (
      <div className="w-full h-full min-h-[120px] rounded-xl overflow-hidden relative bg-black">
        <ParticleField count={30} />
      </div>
    ),
    "wave-animation": (
      <div className="w-full h-full min-h-[120px] rounded-xl overflow-hidden relative bg-zinc-900">
        <WaveAnimation />
      </div>
    ),

    // Text Animations
    "typing-animation": <Typewriter text="Hello World" speed={100} />,
    "text-reveal": <TextReveal text="Reveal" />,
    "wavy-text": <WavyText text="Wavy" className="text-3xl font-bold" />,
    "shiny-text": <ShinyText text="Shiny" className="text-3xl font-bold" />,
    "text-explosion": <TextExplosion text="BOOM" className="text-3xl font-bold" />,
    "text-flip": <TextFlip words={["Hello", "World", "Flip"]} className="text-3xl font-bold" />,
    "circular-text": <TextCircular text="CIRCULAR TEXT • " radius={50} />,
    "text-3d-extrude": <Text3DExtrude text="3D" depth={6} />,
    "text-shadow-pulse": <TextShadowPulse text="Pulse" className="text-3xl font-bold" />,
    "text-highlight-hover": <TextHighlightHover text="Highlight" className="text-2xl font-bold" />,

    // Image Effects
    "image-reveal": (
      <div className="w-48 h-32">
        <ImageReveal src="https://picsum.photos/200/150" alt="Reveal" />
      </div>
    ),
    "image-zoom": (
      <div className="w-48 h-32">
        <ImageZoom src="https://picsum.photos/200/150" alt="Zoom" className="w-full h-full object-cover rounded-lg" />
      </div>
    ),
    "image-parallax": (
      <div className="w-48 h-32 overflow-hidden rounded-lg">
        <ImageParallax src="https://picsum.photos/200/200" alt="Parallax" />
      </div>
    ),
    "image-mask": (
      <ImageMask src="https://picsum.photos/150/150" alt="Mask" maskType="circle" className="w-24 h-24" />
    ),
    "image-glitch": (
      <div className="w-48 h-32">
        <ImageGlitch src="https://picsum.photos/200/150" alt="Glitch" className="w-full h-full rounded-lg" />
      </div>
    ),
    "before-after-slider": (
      <div className="w-64 h-40">
        <BeforeAfterSlider
          before="https://picsum.photos/300/200?grayscale"
          after="https://picsum.photos/300/200"
          className="w-full h-full rounded-lg"
        />
      </div>
    ),
    "image-tilt": (
      <div className="w-48 h-32">
        <ImageTilt src="https://picsum.photos/200/150" alt="Tilt" className="w-full h-full" />
      </div>
    ),
    "image-masonry": (
      <div className="text-sm text-zinc-400 text-center p-4">Masonry grid layout</div>
    ),

    // Cursor Effects
    "cursor-trail": (
      <CursorTrail className="w-full h-full min-h-[120px]" />
    ),
    "spotlight-cursor-new": (
      <SpotlightCursorNew className="w-full h-full min-h-[120px] flex items-center justify-center">
        <span className="text-zinc-400 text-sm">Move cursor</span>
      </SpotlightCursorNew>
    ),
    "follow-cursor": (
      <FollowCursor offset={{ x: 20, y: 20 }}>
        <div className="w-full h-full min-h-[120px] flex items-center justify-center text-zinc-400 text-sm">Follow cursor</div>
      </FollowCursor>
    ),
    "ripple-cursor": (
      <RippleCursor className="w-full h-full min-h-[120px] flex items-center justify-center">
        <span className="text-zinc-400 text-sm">Click for ripple</span>
      </RippleCursor>
    ),
    "morphing-cursor": (
      <MorphingCursor className="w-full h-full min-h-[120px]" />
    ),

    // Media Controls
    "music-player": <MusicPlayer />,
    "video-player": (
      <div className="w-64">
        <VideoPlayer poster="https://picsum.photos/320/180" />
      </div>
    ),
    "audio-visualizer": (
      <div className="w-48 h-24">
        <AudioVisualizer barCount={20} />
      </div>
    ),
    "volume-control": <VolumeControlDemo />,
    "theme-toggle": <ThemeToggleDemo />,
    "notification-bell": <NotificationBell count={5} />,
    "zoom-control": <ZoomControlDemo />,

    // Interactive Elements
    "segmented-control": (
      <SegmentedControl
        items={[
          { id: "day", label: "Day" },
          { id: "week", label: "Week" },
          { id: "month", label: "Month" },
        ]}
        value="week"
        onChange={() => {}}
      />
    ),
    "chip-group": (
      <ChipGroup
        chips={[
          { id: "1", label: "React" },
          { id: "2", label: "Next.js" },
          { id: "3", label: "Vue" },
        ]}
        selectedIds={["2"]}
        onChange={() => {}}
      />
    ),
    "phone-input": (
      <div className="w-56">
        <PhoneInput value="" onChange={() => {}} />
      </div>
    ),
    "keyboard": (
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-zinc-400">Press any key on your keyboard!</p>
        <Keyboard variant="neon" highlightedKeys={["W", "A", "S", "D"]} listenToKeyboard />
      </div>
    ),

    // Social Actions
    "copy-button": <CopyButton text="Hello World" />,
    "share-buttons": <ShareButtons url="https://example.com" title="Check this out" />,
    "like-button": <LikeButtonDemo />,
    "code-block": (
      <div className="w-64">
        <CodeBlockDemo code="const x = 42;" language="javascript" />
      </div>
    ),

    // Data Visualization
    "bar-chart": (
      <div className="w-64">
        <BarChart
          data={[
            { label: "Mon", value: 30 },
            { label: "Tue", value: 45 },
            { label: "Wed", value: 60 },
            { label: "Thu", value: 35 },
          ]}
          horizontal
        />
      </div>
    ),
    "donut-chart": (
      <DonutChart
        data={[
          { label: "A", value: 30, color: "#8b5cf6" },
          { label: "B", value: 45, color: "#d946ef" },
          { label: "C", value: 25, color: "#06b6d4" },
        ]}
        size={100}
        showLegend={false}
      />
    ),
    "sparkline": <Sparkline data={[10, 25, 15, 30, 20, 35, 28]} width={100} height={30} />,
    "heatmap": (
      <Heatmap
        data={[
          [1, 2, 3, 4],
          [2, 3, 4, 5],
          [3, 4, 5, 6],
        ]}
      />
    ),
    "mini-stat": (
      <MiniStat
        label="Revenue"
        value="$12.5k"
        trend={{ value: 12.5, isPositive: true }}
        sparklineData={[10, 15, 12, 18, 14, 20, 17]}
      />
    ),

    // Animations
    "gravity-balls": (
      <div className="w-full h-full min-h-[120px] rounded-xl overflow-hidden relative bg-zinc-900">
        <GravityBalls count={5} />
      </div>
    ),
    "shooting-stars": (
      <div className="w-full h-full min-h-[120px] rounded-xl overflow-hidden relative bg-zinc-900">
        <ShootingStars frequency={1000} />
      </div>
    ),
    "pulsating-circles": (
      <div className="w-full h-full min-h-[120px] rounded-xl overflow-hidden relative">
        <PulsatingCircles count={3} />
      </div>
    ),
    "dna-helix": (
      <div className="w-16 h-32">
        <DNAHelix segments={10} />
      </div>
    ),
    "flowing-dots": (
      <div className="w-full h-full min-h-[120px] rounded-xl overflow-hidden relative bg-zinc-900">
        <FlowingDots rows={6} cols={10} />
      </div>
    ),
  };

  const demo = demos[slug];
  
  if (demo) {
    if (isFullBleed) {
      return <div className="absolute inset-0">{demo}</div>;
    }
    return <div className="absolute inset-0 flex items-center justify-center p-6">{demo}</div>;
  }

  // Fallback for components without demos yet
  const component = components.find((c) => c.slug === slug);
  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 mx-auto mb-4 flex items-center justify-center">
        <motion.div 
          className="w-8 h-8 rounded-lg bg-violet-500/50"
          animate={{ rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <p className="text-zinc-400 text-sm">{component?.name || slug}</p>
      <p className="text-zinc-500 text-xs mt-1">Demo coming soon</p>
    </div>
  );
}

// Get component source code from registry
function getComponentCode(slug: string): string {
  const registryItem = componentRegistry[slug];
  
  if (registryItem?.code) {
    return registryItem.code;
  }
  
  // Fallback for components not in registry yet
  const pascalName = toPascalCase(slug);
  
  return `"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ${pascalName}Props {
  children?: React.ReactNode;
  className?: string;
}

export function ${pascalName}({ children, className }: ${pascalName}Props) {
  return (
    <motion.div
      className={cn("", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  );
}`;
}
