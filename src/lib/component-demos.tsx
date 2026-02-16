"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
import { DraggableStack } from "@/registry/draggable-stack";

// Buttons
import { SkewedButton } from "@/registry/skewed-button";
import { LiquidButton } from "@/registry/liquid-button";
import { MorphingButton } from "@/registry/morphing-button";
import { GlitchButton } from "@/registry/glitch-button";
import { GradientShiftButton } from "@/registry/gradient-shift-button";
import { ThreeDPushButton } from "@/registry/3d-push-button";
import { RotateButton } from "@/registry/rotate-button";
import { SplitButton } from "@/registry/split-button";
import { ShakeButton } from "@/registry/shake-button";

// Cards
import { ParallaxCard } from "@/registry/parallax-card";
import { MorphingCard } from "@/registry/morphing-card";
import { RevealCard } from "@/registry/reveal-card";
import { NoiseCard } from "@/registry/noise-card";
import { FoldCard } from "@/registry/fold-card";
import { StackCard } from "@/registry/stack-card";
import { SqueezeCard } from "@/registry/squeeze-card";
import { BlurCard } from "@/registry/blur-card";
import { ParticleCard } from "@/registry/particle-card";

// Text effects
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
import { SoundText } from "@/registry/sound-text";
import { MagneticScatterText } from "@/registry/magnetic-scatter-text";
import { VaporSmokeText } from "@/registry/vapor-smoke-text";
import { SoftButton } from "@/registry/soft-button";
import { Neumorphism3DButton } from "@/registry/neumorphism-3d-button";
import { GlassShimmerButton } from "@/registry/glass-shimmer-button";

// NEW: Tabs & Navigation
import { AnimatedTabs } from "@/registry/animated-tabs";
import { FloatingDock, MacOSDock } from "@/registry/floating-dock";
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
import { LiquidGlassCard, AppleLiquidGlass } from "@/registry/liquid-glass";
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
import { Typewriter, TextReveal, WavyText, ShinyText, CountingText } from "@/registry/typing-animation";
import { TextExplosion, TextFlip, TextCircular, Text3DExtrude, TextShadowPulse, TextHighlightHover, TextSplitReveal } from "@/registry/text-effects";

// NEW: Image Effects
import { ImageReveal, ImageZoom, ImageParallax, ImageMask, ImageGlitch, BeforeAfterSlider, ImageTilt, ImageMasonry } from "@/registry/image-effects";

// NEW: Cursor Effects
import { CursorTrail, SpotlightCursor as SpotlightCursorNew, FollowCursor, RippleCursor, MorphingCursor } from "@/registry/cursor-effects";
import { MagneticCursor } from "@/registry/magnetic-cursor";
import { EmojiCursor } from "@/registry/emoji-cursor";
import { RingCursor } from "@/registry/ring-cursor";
import { GlowCursor } from "@/registry/glow-cursor";
import { InverseCursor } from "@/registry/inverse-cursor";
import { StretchCursor } from "@/registry/stretch-cursor";
import { ParticleCursor } from "@/registry/particle-cursor";
import { NoiseBg } from "@/registry/noise-bg";
import { AuroraBg } from "@/registry/aurora-bg";
import { WavesBg } from "@/registry/waves-bg";
import { ParticlesBg } from "@/registry/particles-bg";
import { GridBg } from "@/registry/grid-bg";
import { DotsBg } from "@/registry/dots-bg";
import { BlurBlobBg } from "@/registry/blur-blob-bg";
import { StarfieldBg } from "@/registry/starfield-bg";
import { PulseLoader } from "@/registry/pulse-loader";
import { MorphLoader } from "@/registry/morph-loader";
import { FlipLoader } from "@/registry/flip-loader";
import { RotateLoader } from "@/registry/rotate-loader";
import { DotsLoader } from "@/registry/dots-loader";
import { BarLoader } from "@/registry/bar-loader";
import { SplitReveal } from "@/registry/split-reveal";
import { SlideReveal } from "@/registry/slide-reveal";
import { ScaleReveal } from "@/registry/scale-reveal";
import { RotateReveal } from "@/registry/rotate-reveal";
import { BlurReveal } from "@/registry/blur-reveal";
import { ClipReveal } from "@/registry/clip-reveal";
import { MaskReveal } from "@/registry/mask-reveal";
import { PerspectiveReveal } from "@/registry/perspective-reveal";
import { BrokenGrid } from "@/registry/broken-grid";
import { OverlapSection } from "@/registry/overlap-section";
import { DiagonalSection } from "@/registry/diagonal-section";
import { StickyStack } from "@/registry/sticky-stack";
import { ScrollSnap, ScrollSnapItem } from "@/registry/scroll-snap";
import { AsymmetricGrid } from "@/registry/asymmetric-grid";
import { FloatingElements } from "@/registry/floating-elements";
import { PerspectiveContainer } from "@/registry/perspective-container";
import { MagneticArea } from "@/registry/magnetic-area";
import { HoverDistort } from "@/registry/hover-distort";
import { TiltContainer } from "@/registry/tilt-container";
import { FollowMouse } from "@/registry/follow-mouse";
import { ElasticDrag } from "@/registry/elastic-drag";

// NEW: Media Controls
import { MusicPlayer, VideoPlayer, NotificationBell, ThemeToggle, VolumeControl, ZoomControl } from "@/registry/media-controls";
import { AudioVisualizer } from "@/registry/audio-visualizer";
import { Keyboard } from "@/registry/keyboard";

// NEW: Social Actions
import { CopyButton, CodeBlock, ShareButtons, LikeButton } from "@/registry/social-actions";

// NEW: Data Visualization
import { BarChart, DonutChart, Sparkline, Heatmap, MiniStat } from "@/registry/data-visualization";

// Helper component for cursor demos (contained within a box)
function CursorDemoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full min-w-[200px] min-h-[120px] rounded-xl border border-white/10 bg-black/30 relative overflow-hidden">
      {children}
    </div>
  );
}

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

// Stateful wrapper for PasswordInput
function PasswordInputDemo() {
  const [password, setPassword] = useState("");
  return <PasswordInput value={password} onChange={setPassword} placeholder="Enter password" />;
}

// Stateful wrapper for SearchInput
function SearchInputDemo() {
  const [search, setSearch] = useState("");
  return <SearchInput value={search} onChange={setSearch} placeholder="Search..." suggestions={["React", "Next.js", "TypeScript"]} />;
}

// Stateful wrapper for TagInput
function TagInputDemo() {
  const [tags, setTags] = useState(["react", "nextjs"]);
  return <TagInput tags={tags} onChange={setTags} placeholder="Add tag..." />;
}

// Stateful wrapper for DateInput
function DateInputDemo() {
  const [date, setDate] = useState<Date | null>(new Date());
  return <DateInput value={date} onChange={setDate} />;
}

// Stateful wrapper for OTPInput
function OTPInputDemo() {
  return <OTPInput length={4} onComplete={(code) => console.log("OTP:", code)} />;
}

// Wrapper for Apple Liquid Glass Demo
function AppleLiquidGlassDemo() {
  return (
    <div className="relative w-80 h-48 rounded-xl overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        alt="Nature"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white text-xl font-medium drop-shadow-lg z-10 pointer-events-none">Drag the glass</p>
      </div>
      <AppleLiquidGlass
        width={140}
        height={90}
        borderRadius={45}
        initialPosition={{ x: 70, y: 75 }}
        constrainToViewport={false}
      />
    </div>
  );
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

// All component demos - used on both gallery (scaled) and detail pages (full size)
export const componentDemos: Record<string, React.ReactNode> = {
  // Buttons
  "magnetic-button": <MagneticButton>Magnetic</MagneticButton>,
  "skewed-button": <SkewedButton>Skewed</SkewedButton>,
  "liquid-button": <LiquidButton>Liquid</LiquidButton>,
  "morphing-button": <MorphingButton>Morphing</MorphingButton>,
  "glitch-button": <GlitchButton>Glitch</GlitchButton>,
  "neon-button": <NeonButton>Neon</NeonButton>,
  "bounce-button": <BounceButton>Bounce</BounceButton>,
  "ripple-button": <RippleButton>Ripple</RippleButton>,
  "gradient-shift-button": <GradientShiftButton>Gradient</GradientShiftButton>,
  "3d-push-button": <ThreeDPushButton>3D Push</ThreeDPushButton>,
  "rotate-button": <RotateButton>Rotate</RotateButton>,
  "split-button": <SplitButton>Split</SplitButton>,
  "shake-button": <ShakeButton>Shake</ShakeButton>,
  "pulse-button": <PulseButton>Pulse</PulseButton>,
  "spotlight-button": <SpotlightButton>Spotlight</SpotlightButton>,
  "soft-button": <SoftButton>Soft</SoftButton>,
  "neumorphism-3d-button": <Neumorphism3DButton>Press</Neumorphism3DButton>,
  "glass-shimmer-button": <GlassShimmerButton>Shimmer</GlassShimmerButton>,

  // Cards
  "tilt-card": (
    <TiltCard className="w-64 h-44 rounded-xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 border border-white/10 flex items-center justify-center">
      <span className="text-white font-medium text-lg">Tilt Me</span>
    </TiltCard>
  ),
  "flip-card": (
    <FlipCard
      front={<div className="flex items-center justify-center h-full font-bold text-white text-lg">Hover</div>}
      back={<div className="flex items-center justify-center h-full font-bold text-white text-lg">Flipped!</div>}
      className="w-56 h-40"
    />
  ),
  "glass-card": (
    <GlassCard className="w-64 h-44 flex items-center justify-center">
      <span className="text-white font-medium text-lg">Glass</span>
    </GlassCard>
  ),
  "spotlight-card": (
    <SpotlightCard className="w-64 h-44 flex items-center justify-center">
      <span className="text-white font-medium text-lg">Spotlight</span>
    </SpotlightCard>
  ),
  "skewed-card": (
    <SkewedCard className="w-64 h-44">
      <div className="flex items-center justify-center h-full font-medium text-white text-lg">Skewed</div>
    </SkewedCard>
  ),
  "gradient-border-card": (
    <div className="p-8">
      <GradientBorderCard className="w-64 h-44 flex items-center justify-center">
        <span className="text-white font-medium text-lg">Gradient</span>
      </GradientBorderCard>
    </div>
  ),
  "hover-lift-card": (
    <HoverLiftCard className="w-64 h-44 flex items-center justify-center">
      <span className="text-white font-medium text-lg">Lift</span>
    </HoverLiftCard>
  ),
  "parallax-card": (
    <ParallaxCard className="w-64 h-44 flex items-center justify-center">
      <span className="text-white font-medium text-lg">Parallax</span>
    </ParallaxCard>
  ),
  "morphing-card": (
    <MorphingCard className="w-64 h-44 flex items-center justify-center">
      <span className="text-white font-medium text-lg">Morph</span>
    </MorphingCard>
  ),
  "reveal-card": (
    <RevealCard className="w-64 h-44">
      <span className="text-white font-medium text-lg">Reveal</span>
    </RevealCard>
  ),
  "noise-card": (
    <NoiseCard className="w-64 h-44 flex items-center justify-center">
      <span className="text-white font-medium text-lg">Noise</span>
    </NoiseCard>
  ),
  "fold-card": (
    <FoldCard className="w-64 h-44 flex items-center justify-center">
      <span className="text-white font-medium text-lg">Fold</span>
    </FoldCard>
  ),
  "stack-card": (
    <StackCard className="w-64 h-44 flex items-center justify-center">
      <span className="text-white font-medium text-lg">Stack</span>
    </StackCard>
  ),
  "squeeze-card": (
    <SqueezeCard className="w-64 h-44 flex items-center justify-center">
      <span className="text-white font-medium text-lg">Squeeze</span>
    </SqueezeCard>
  ),
  "blur-card": (
    <BlurCard className="w-64 h-44 flex items-center justify-center">
      <span className="text-white font-medium text-lg">Blur</span>
    </BlurCard>
  ),
  "particle-card": <ParticleCard cols={14} rows={16} />,

  // Text effects
  "glitch-text": <GlitchText className="text-4xl font-bold">GLITCH</GlitchText>,
  "wave-text": <WaveText className="text-4xl font-bold">Wave</WaveText>,
  "gradient-text": <GradientText className="text-4xl font-bold">Gradient</GradientText>,
  "typewriter-text": <TypewriterText className="text-2xl font-mono" text="Typing..." />,
  "scramble-text": <ScrambleText className="text-2xl font-mono">Hover</ScrambleText>,
  "split-text": <SplitText className="text-3xl font-bold">Split</SplitText>,
  "bounce-text": <BounceText className="text-3xl font-bold">Bounce</BounceText>,
  "float-text": <FloatText className="text-3xl font-bold">Float</FloatText>,
  "neon-text": <NeonText className="text-3xl font-bold">Neon</NeonText>,
  "outline-text": <OutlineText className="text-4xl font-bold">Outline</OutlineText>,
  "3d-text": <ThreeDText className="text-4xl font-bold">3D</ThreeDText>,
  "highlight-text": <HighlightText className="text-2xl">Highlight</HighlightText>,
  "underline-reveal": <UnderlineReveal className="text-2xl">Underline</UnderlineReveal>,
  "stroke-text": <StrokeText className="text-4xl font-bold">Stroke</StrokeText>,
  "clip-text": <ClipText className="text-4xl font-bold">Clip</ClipText>,
  "sound-text": <SoundText text="Sound" className="text-3xl" />,
  "magnetic-scatter-text": <MagneticScatterText text="Scatter" className="text-3xl" />,
  "vapor-smoke-text": <VaporSmokeText text="Vapor" className="text-3xl" />,

  // Cursor effects (contained in demo boxes)
  "blob-cursor": (
    <CursorDemoBox>
      <BlobCursor className="w-full h-full" />
    </CursorDemoBox>
  ),
  "spotlight-cursor": (
    <CursorDemoBox>
      <SpotlightCursorNew className="w-full h-full">
        <div className="flex items-center justify-center w-full h-full text-white/50">Move cursor</div>
      </SpotlightCursorNew>
    </CursorDemoBox>
  ),
  "trail-cursor": (
    <CursorDemoBox>
      <CursorTrail className="w-full h-full" />
    </CursorDemoBox>
  ),
  "magnetic-cursor": (
    <CursorDemoBox>
      <MagneticCursor className="w-full h-full">
        <div className="flex items-center justify-center w-full h-full text-white/50">Magnetic pull</div>
      </MagneticCursor>
    </CursorDemoBox>
  ),
  "emoji-cursor": (
    <CursorDemoBox>
      <EmojiCursor className="w-full h-full">
        <div className="flex items-center justify-center w-full h-full text-white/50">Move cursor</div>
      </EmojiCursor>
    </CursorDemoBox>
  ),
  "ring-cursor": (
    <CursorDemoBox>
      <RingCursor className="w-full h-full">
        <div className="flex items-center justify-center w-full h-full text-white/50">Ring follows</div>
      </RingCursor>
    </CursorDemoBox>
  ),
  "glow-cursor": (
    <CursorDemoBox>
      <GlowCursor className="w-full h-full">
        <div className="flex items-center justify-center w-full h-full text-white/50">Glow effect</div>
      </GlowCursor>
    </CursorDemoBox>
  ),
  "inverse-cursor": (
    <CursorDemoBox>
      <InverseCursor className="w-full h-full">
        <div className="flex items-center justify-center w-full h-full text-white/50">Inverse blend</div>
      </InverseCursor>
    </CursorDemoBox>
  ),
  "stretch-cursor": (
    <CursorDemoBox>
      <StretchCursor className="w-full h-full">
        <div className="flex items-center justify-center w-full h-full text-white/50">Stretch effect</div>
      </StretchCursor>
    </CursorDemoBox>
  ),
  "particle-cursor": (
    <CursorDemoBox>
      <ParticleCursor className="w-full h-full">
        <div className="flex items-center justify-center w-full h-full text-white/50">Particle trail</div>
      </ParticleCursor>
    </CursorDemoBox>
  ),

  // Backgrounds - these fill their container
  "gradient-mesh": (
    <div className="w-full h-full min-w-[200px] min-h-[120px] rounded-xl overflow-hidden relative">
      <GradientMesh className="absolute inset-0" />
    </div>
  ),
  "noise-bg": (
    <div className="w-full h-full min-w-[200px] min-h-[120px] rounded-xl overflow-hidden relative">
      <NoiseBg className="absolute inset-0" />
    </div>
  ),
  "aurora-bg": (
    <div className="w-full h-full min-w-[200px] min-h-[120px] rounded-xl overflow-hidden relative">
      <AuroraBg className="absolute inset-0" />
    </div>
  ),
  "waves-bg": (
    <div className="w-full h-full min-w-[200px] min-h-[120px] rounded-xl overflow-hidden relative">
      <WavesBg className="absolute inset-0" />
    </div>
  ),
  "particles-bg": (
    <div className="w-full h-full min-w-[200px] min-h-[120px] rounded-xl overflow-hidden relative">
      <ParticlesBg className="absolute inset-0" />
    </div>
  ),
  "grid-bg": (
    <div className="w-full h-full min-w-[200px] min-h-[120px] rounded-xl overflow-hidden relative">
      <GridBg className="absolute inset-0" />
    </div>
  ),
  "dots-bg": (
    <div className="w-full h-full min-w-[200px] min-h-[120px] rounded-xl overflow-hidden relative">
      <DotsBg className="absolute inset-0" />
    </div>
  ),
  "blur-blob-bg": (
    <div className="w-full h-full min-w-[200px] min-h-[120px] rounded-xl overflow-hidden relative">
      <BlurBlobBg className="absolute inset-0" />
    </div>
  ),
  "starfield-bg": (
    <div className="w-full h-full min-w-[200px] min-h-[120px] rounded-xl overflow-hidden relative">
      <StarfieldBg className="absolute inset-0" />
    </div>
  ),


  // Loaders
  "orbit-loader": <OrbitLoader size={70} />,
  "pulse-loader": <PulseLoader size={70} />,
  "wave-loader": <WaveLoader />,
  "bounce-loader": <BounceLoader />,
  "morph-loader": <MorphLoader size={70} />,
  "flip-loader": <FlipLoader size={60} />,
  "rotate-loader": <RotateLoader size={70} />,
  "dots-loader": <DotsLoader />,
  "bar-loader": <BarLoader className="w-56" />,
  "skeleton-loader": <SkeletonLoader className="w-64 h-24" />,

  // Reveals
  "fade-reveal": (
    <FadeReveal>
      <div className="text-2xl font-bold text-white">Fade In</div>
    </FadeReveal>
  ),
  "split-reveal": (
    <SplitReveal>
      <div className="text-2xl font-bold text-white">Split</div>
    </SplitReveal>
  ),
  "slide-reveal": (
    <SlideReveal>
      <div className="text-2xl font-bold text-white">Slide</div>
    </SlideReveal>
  ),
  "scale-reveal": (
    <ScaleReveal>
      <div className="text-2xl font-bold text-white">Scale</div>
    </ScaleReveal>
  ),
  "rotate-reveal": (
    <RotateReveal>
      <div className="text-2xl font-bold text-white">Rotate</div>
    </RotateReveal>
  ),
  "blur-reveal": (
    <BlurReveal>
      <div className="text-2xl font-bold text-white">Blur</div>
    </BlurReveal>
  ),
  "clip-reveal": (
    <ClipReveal direction="left">
      <div className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-6 py-3 rounded-lg">Clip</div>
    </ClipReveal>
  ),
  "stagger-reveal": (
    <StaggerReveal className="flex gap-2">
      {["S", "T", "A", "G", "G", "E", "R"].map((letter, i) => (
        <span key={i} className="text-2xl font-bold text-white">{letter}</span>
      ))}
    </StaggerReveal>
  ),
  "mask-reveal": (
    <MaskReveal>
      <div className="text-2xl font-bold text-white">Mask</div>
    </MaskReveal>
  ),
  "perspective-reveal": (
    <PerspectiveReveal>
      <div className="text-2xl font-bold text-white">3D</div>
    </PerspectiveReveal>
  ),

  // Layout
  "tilted-section": (
    <TiltedSection className="w-64 h-36 bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 flex items-center justify-center">
      <span className="text-white font-medium text-lg">Tilted</span>
    </TiltedSection>
  ),
  "parallax-section": (
    <ParallaxSection className="w-64 h-36 flex items-center justify-center">
      <span className="text-white font-medium text-lg">Parallax</span>
    </ParallaxSection>
  ),
  "broken-grid": (
    <BrokenGrid className="w-64 text-sm">
      <div className="bg-violet-500/30 p-3 rounded">1</div>
      <div className="bg-fuchsia-500/30 p-3 rounded">2</div>
      <div className="bg-cyan-500/30 p-3 rounded">3</div>
    </BrokenGrid>
  ),
  "overlap-section": (
    <div className="relative w-64">
      <div className="bg-violet-500/30 p-4 rounded-lg text-white">First</div>
      <OverlapSection overlap={16} className="bg-fuchsia-500/30 p-4 rounded-lg text-white">
        Overlap
      </OverlapSection>
    </div>
  ),
  "diagonal-section": (
    <DiagonalSection className="w-64 bg-violet-500/20" bgColor="rgba(139, 92, 246, 0.3)">
      <div className="text-center py-3 text-white font-medium">Diagonal</div>
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
  "draggable-stack": (
    <div className="flex flex-col items-center w-full py-8">
      <DraggableStack className="w-full max-w-md mx-auto">
        {[
          <div key="1" className="bg-violet-500/80 text-white rounded-2xl p-8 text-lg font-bold shadow-xl">Draggable Card 1</div>,
          <div key="2" className="bg-fuchsia-500/80 text-white rounded-2xl p-8 text-lg font-bold shadow-xl">Draggable Card 2</div>,
          <div key="3" className="bg-cyan-500/80 text-white rounded-2xl p-8 text-lg font-bold shadow-xl">Draggable Card 3</div>,
        ]}
      </DraggableStack>
      <div className="text-xs text-zinc-400 mt-6">Drag the cards vertically</div>
    </div>
  ),
  "scroll-snap": (
    <div className="w-80 h-40 relative">
      <div className="w-full h-full overflow-x-auto snap-x snap-mandatory flex rounded-lg">
        {["violet", "fuchsia", "cyan"].map((color, i) => (
          <div
            key={i}
            className={`snap-center flex-shrink-0 w-full h-full flex items-center justify-center text-white font-medium bg-${color}-500/30`}
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
    <AsymmetricGrid className="w-64 text-sm">
      <div className="bg-violet-500/30 p-3 rounded">Big</div>
      <div className="bg-fuchsia-500/30 p-3 rounded">2</div>
      <div className="bg-cyan-500/30 p-3 rounded">3</div>
    </AsymmetricGrid>
  ),
  "floating-elements": (
    <FloatingElements className="w-64 h-36 flex items-center justify-center">
      <span className="text-white font-medium">Floating</span>
    </FloatingElements>
  ),
  "perspective-container": (
    <PerspectiveContainer className="w-64" perspective={600}>
      <motion.div 
        className="bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 p-4 rounded-lg"
        animate={{ rotateY: [0, 15, 0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <span className="text-white font-medium">3D</span>
      </motion.div>
    </PerspectiveContainer>
  ),

  // Interactions
  "magnetic-area": (
    <MagneticArea className="p-6">
      <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 px-6 py-3 rounded-lg text-white font-medium">
        Magnetic
      </div>
    </MagneticArea>
  ),
  "hover-distort": (
    <HoverDistort className="w-64 h-36 bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 rounded-lg flex items-center justify-center">
      <span className="text-white font-medium">Distort</span>
    </HoverDistort>
  ),
  "tilt-container": (
    <TiltContainer className="w-64 h-36 bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 rounded-lg flex items-center justify-center">
      <span className="text-white font-medium">Tilt</span>
    </TiltContainer>
  ),
  "follow-mouse": (
    <FollowMouse className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center">
      <span className="text-white text-sm">Follow</span>
    </FollowMouse>
  ),
  "elastic-drag": (
    <ElasticDrag className="w-32 h-32 bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 rounded-lg flex items-center justify-center">
      <span className="text-white font-medium text-sm">Drag</span>
    </ElasticDrag>
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
    <MacOSDock
      items={[
        { id: "1", icon: <span className="text-2xl">📱</span>, label: "Finder", isActive: true },
        { id: "2", icon: <span className="text-2xl">🌐</span>, label: "Safari" },
        { id: "3", icon: <span className="text-2xl">💬</span>, label: "Messages", isActive: true },
        { id: "4", icon: <span className="text-2xl">🎵</span>, label: "Music" },
        { id: "5", icon: <span className="text-2xl">⚙️</span>, label: "Settings" },
      ]}
      magnification={1.8}
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
      <PasswordInputDemo />
    </div>
  ),
  "search-input": (
    <div className="w-56">
      <SearchInputDemo />
    </div>
  ),
  "tag-input": (
    <div className="w-64">
      <TagInputDemo />
    </div>
  ),
  "date-input": (
    <div className="w-56">
      <DateInputDemo />
    </div>
  ),
  "otp-input": <OTPInputDemo />,

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
        <BentoCard className="h-20 bg-cyan-500/20 flex items-center justify-center">3</BentoCard>
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
  "liquid-glass": <AppleLiquidGlassDemo />,
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
    <div className="w-full h-full min-w-[200px] min-h-[120px] rounded-xl overflow-hidden relative">
      <FlickeringGrid className="absolute inset-0" />
    </div>
  ),
  "matrix-rain": (
    <div className="w-full h-full min-w-[200px] min-h-[120px] rounded-xl overflow-hidden relative bg-black">
      <MatrixRain className="absolute inset-0" />
    </div>
  ),
  "meteor-shower": (
    <div className="w-full h-full min-w-[200px] min-h-[120px] rounded-xl overflow-hidden relative bg-zinc-900">
      <MeteorShower meteorCount={5} />
    </div>
  ),
  "particle-field": (
    <div className="w-full h-full min-w-[200px] min-h-[120px] rounded-xl overflow-hidden relative bg-black">
      <ParticleField count={30} />
    </div>
  ),
  "wave-animation": (
    <div className="w-full h-full min-w-[200px] min-h-[120px] rounded-xl overflow-hidden relative bg-zinc-900">
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
    <CursorDemoBox>
      <CursorTrail className="w-full h-full" />
    </CursorDemoBox>
  ),
  "spotlight-cursor-new": (
    <CursorDemoBox>
      <SpotlightCursorNew className="w-full h-full">
        <div className="flex items-center justify-center w-full h-full text-white/50">Spotlight</div>
      </SpotlightCursorNew>
    </CursorDemoBox>
  ),
  "follow-cursor": (
    <CursorDemoBox>
      <FollowCursor offset={{ x: 20, y: 20 }}>
        <div className="flex items-center justify-center w-full h-full text-white/50">Follow</div>
      </FollowCursor>
    </CursorDemoBox>
  ),
  "ripple-cursor": (
    <CursorDemoBox>
      <RippleCursor className="w-full h-full">
        <div className="flex items-center justify-center w-full h-full text-white/50">Click for ripple</div>
      </RippleCursor>
    </CursorDemoBox>
  ),
  "morphing-cursor": (
    <CursorDemoBox>
      <MorphingCursor className="w-full h-full" />
    </CursorDemoBox>
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
      <Keyboard 
        variant="neon" 
        highlightedKeys={["W", "A", "S", "D"]} 
        listenToKeyboard
      />
    </div>
  ),
  "copy-button": <CopyButton text="Hello World" />,
  "share-buttons": <ShareButtons url="https://example.com" title="Check this out" />,
  "like-button": <LikeButtonDemo />,
  "code-block": (
    <div className="w-64">
      <CodeBlock code="const x = 42;" language="javascript" />
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
    <div className="w-full h-full min-w-[200px] min-h-[120px] rounded-xl overflow-hidden relative bg-zinc-900">
      <GravityBalls count={5} />
    </div>
  ),
  "shooting-stars": (
    <div className="w-full h-full min-w-[200px] min-h-[120px] rounded-xl overflow-hidden relative bg-zinc-900">
      <ShootingStars frequency={1000} />
    </div>
  ),
  "pulsating-circles": (
    <div className="w-full h-full min-w-[200px] min-h-[120px] rounded-xl overflow-hidden relative">
      <PulsatingCircles count={3} />
    </div>
  ),
  "dna-helix": (
    <div className="w-16 h-32">
      <DNAHelix segments={10} />
    </div>
  ),
  "flowing-dots": (
    <div className="w-full h-full min-w-[200px] min-h-[120px] rounded-xl overflow-hidden relative bg-zinc-900">
      <FlowingDots rows={6} cols={10} />
    </div>
  ),
};

// Get a demo for a slug, with fallback
export function getComponentDemo(slug: string): React.ReactNode {
  return componentDemos[slug] || (
    <div className="text-center text-zinc-500">
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 mx-auto mb-2 flex items-center justify-center">
        <motion.div 
          className="w-6 h-6 rounded-lg bg-violet-500/50"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <span className="text-xs">Coming soon</span>
    </div>
  );
}
