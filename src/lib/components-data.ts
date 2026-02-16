export interface ComponentInfo {
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
}

export const components: ComponentInfo[] = [
  // Buttons (1-15)
  { name: "Magnetic Button", slug: "magnetic-button", description: "Button that follows cursor with magnetic effect", category: "Buttons", tags: ["hover", "magnetic", "interactive"] },
  { name: "Skewed Button", slug: "skewed-button", description: "Button with CSS skew transform on hover", category: "Buttons", tags: ["skew", "transform", "hover"] },
  { name: "Liquid Button", slug: "liquid-button", description: "Button with liquid morphing effect", category: "Buttons", tags: ["liquid", "morph", "svg"] },
  { name: "Morphing Button", slug: "morphing-button", description: "Button that morphs shape on interaction", category: "Buttons", tags: ["morph", "shape", "animation"] },
  { name: "Glitch Button", slug: "glitch-button", description: "Button with glitch distortion effect", category: "Buttons", tags: ["glitch", "distortion", "cyber"] },
  { name: "Neon Button", slug: "neon-button", description: "Button with neon glow effect", category: "Buttons", tags: ["neon", "glow", "cyberpunk"] },
  { name: "Bounce Button", slug: "bounce-button", description: "Button with bouncy spring animation", category: "Buttons", tags: ["bounce", "spring", "playful"] },
  { name: "Ripple Button", slug: "ripple-button", description: "Material-style ripple effect button", category: "Buttons", tags: ["ripple", "material", "click"] },
  { name: "Gradient Shift Button", slug: "gradient-shift-button", description: "Button with animated gradient background", category: "Buttons", tags: ["gradient", "animated", "colorful"] },
  { name: "3D Push Button", slug: "3d-push-button", description: "Button with 3D push down effect", category: "Buttons", tags: ["3d", "push", "depth"] },
  { name: "Rotate Button", slug: "rotate-button", description: "Button that rotates on hover", category: "Buttons", tags: ["rotate", "transform", "hover"] },
  { name: "Split Button", slug: "split-button", description: "Button that splits on hover", category: "Buttons", tags: ["split", "creative", "hover"] },
  { name: "Shake Button", slug: "shake-button", description: "Button with shake animation", category: "Buttons", tags: ["shake", "attention", "animation"] },
  { name: "Pulse Button", slug: "pulse-button", description: "Button with pulsing glow effect", category: "Buttons", tags: ["pulse", "glow", "attention"] },
  { name: "Spotlight Button", slug: "spotlight-button", description: "Button with spotlight follow effect", category: "Buttons", tags: ["spotlight", "light", "follow"] },

  // Cards (16-30)
  { name: "Skewed Card", slug: "skewed-card", description: "Card with CSS skew transform", category: "Cards", tags: ["skew", "transform", "layout"] },
  { name: "Tilt Card", slug: "tilt-card", description: "Card that tilts based on mouse position", category: "Cards", tags: ["tilt", "3d", "perspective"] },
  { name: "Flip Card", slug: "flip-card", description: "Card that flips to reveal back content", category: "Cards", tags: ["flip", "3d", "reveal"] },
  { name: "Parallax Card", slug: "parallax-card", description: "Card with parallax depth layers", category: "Cards", tags: ["parallax", "depth", "layers"] },
  { name: "Glass Card", slug: "glass-card", description: "Card with glassmorphism effect", category: "Cards", tags: ["glass", "blur", "modern"] },
  { name: "Morphing Card", slug: "morphing-card", description: "Card with morphing border", category: "Cards", tags: ["morph", "border", "organic"] },
  { name: "Hover Lift Card", slug: "hover-lift-card", description: "Card that lifts and shadows on hover", category: "Cards", tags: ["lift", "shadow", "hover"] },
  { name: "Reveal Card", slug: "reveal-card", description: "Card with content reveal animation", category: "Cards", tags: ["reveal", "content", "animation"] },
  { name: "Spotlight Card", slug: "spotlight-card", description: "Card with spotlight gradient effect", category: "Cards", tags: ["spotlight", "gradient", "glow"] },
  { name: "Gradient Border Card", slug: "gradient-border-card", description: "Card with animated gradient border", category: "Cards", tags: ["gradient", "border", "animated"] },
  { name: "Noise Card", slug: "noise-card", description: "Card with noise texture overlay", category: "Cards", tags: ["noise", "texture", "grainy"] },
  { name: "Fold Card", slug: "fold-card", description: "Card with paper fold effect", category: "Cards", tags: ["fold", "paper", "3d"] },
  { name: "Stack Card", slug: "stack-card", description: "Stacked cards with hover spread", category: "Cards", tags: ["stack", "spread", "multiple"] },
  { name: "Squeeze Card", slug: "squeeze-card", description: "Card that squeezes on hover", category: "Cards", tags: ["squeeze", "scale", "playful"] },
  { name: "Blur Card", slug: "blur-card", description: "Card with blur reveal effect", category: "Cards", tags: ["blur", "reveal", "focus"] },

  // Text Effects (31-45)
  { name: "Glitch Text", slug: "glitch-text", description: "Text with glitch distortion effect", category: "Text Effects", tags: ["glitch", "cyber", "distortion"] },
  { name: "Wave Text", slug: "wave-text", description: "Text with wave animation", category: "Text Effects", tags: ["wave", "animation", "playful"] },
  { name: "Gradient Text", slug: "gradient-text", description: "Text with animated gradient fill", category: "Text Effects", tags: ["gradient", "colorful", "animated"] },
  { name: "Split Text", slug: "split-text", description: "Text that splits on hover", category: "Text Effects", tags: ["split", "hover", "creative"] },
  { name: "Typewriter Text", slug: "typewriter-text", description: "Text with typewriter typing effect", category: "Text Effects", tags: ["typewriter", "typing", "reveal"] },
  { name: "Scramble Text", slug: "scramble-text", description: "Text with scramble decode effect", category: "Text Effects", tags: ["scramble", "decode", "cyber"] },
  { name: "Bounce Text", slug: "bounce-text", description: "Text with bouncing letters", category: "Text Effects", tags: ["bounce", "letters", "playful"] },
  { name: "Float Text", slug: "float-text", description: "Text with floating animation", category: "Text Effects", tags: ["float", "gentle", "ambient"] },
  { name: "Neon Text", slug: "neon-text", description: "Text with neon glow effect", category: "Text Effects", tags: ["neon", "glow", "cyberpunk"] },
  { name: "Outline Text", slug: "outline-text", description: "Text with animated outline stroke", category: "Text Effects", tags: ["outline", "stroke", "minimal"] },
  { name: "3D Text", slug: "3d-text", description: "Text with 3D depth effect", category: "Text Effects", tags: ["3d", "depth", "perspective"] },
  { name: "Highlight Text", slug: "highlight-text", description: "Text with highlight marker effect", category: "Text Effects", tags: ["highlight", "marker", "attention"] },
  { name: "Underline Reveal", slug: "underline-reveal", description: "Text with animated underline reveal", category: "Text Effects", tags: ["underline", "reveal", "hover"] },
  { name: "Stroke Text", slug: "stroke-text", description: "Text with stroke animation", category: "Text Effects", tags: ["stroke", "draw", "svg"] },
  { name: "Clip Text", slug: "clip-text", description: "Text with clip-path reveal", category: "Text Effects", tags: ["clip", "reveal", "mask"] },

  // Cursor Effects (46-55)
  { name: "Blob Cursor", slug: "blob-cursor", description: "Blob that follows the cursor", category: "Cursor Effects", tags: ["blob", "follow", "organic"] },
  { name: "Spotlight Cursor", slug: "spotlight-cursor", description: "Spotlight effect following cursor", category: "Cursor Effects", tags: ["spotlight", "light", "reveal"] },
  { name: "Trail Cursor", slug: "trail-cursor", description: "Trail effect behind cursor", category: "Cursor Effects", tags: ["trail", "particles", "follow"] },
  { name: "Magnetic Cursor", slug: "magnetic-cursor", description: "Cursor with magnetic pull effect", category: "Cursor Effects", tags: ["magnetic", "pull", "interactive"] },
  { name: "Emoji Cursor", slug: "emoji-cursor", description: "Custom emoji cursor trail", category: "Cursor Effects", tags: ["emoji", "fun", "trail"] },
  { name: "Ring Cursor", slug: "ring-cursor", description: "Ring that follows cursor", category: "Cursor Effects", tags: ["ring", "circle", "follow"] },
  { name: "Glow Cursor", slug: "glow-cursor", description: "Glowing orb cursor effect", category: "Cursor Effects", tags: ["glow", "orb", "light"] },
  { name: "Inverse Cursor", slug: "inverse-cursor", description: "Cursor that inverts colors", category: "Cursor Effects", tags: ["inverse", "blend", "creative"] },
  { name: "Stretch Cursor", slug: "stretch-cursor", description: "Cursor that stretches on move", category: "Cursor Effects", tags: ["stretch", "elastic", "motion"] },
  { name: "Particle Cursor", slug: "particle-cursor", description: "Particles emitting from cursor", category: "Cursor Effects", tags: ["particles", "emit", "dynamic"] },

  // Backgrounds (56-65)
  { name: "Gradient Mesh", slug: "gradient-mesh", description: "Animated gradient mesh background", category: "Backgrounds", tags: ["gradient", "mesh", "animated"] },
  { name: "Noise Background", slug: "noise-bg", description: "Animated noise texture background", category: "Backgrounds", tags: ["noise", "texture", "grainy"] },
  { name: "Aurora Background", slug: "aurora-bg", description: "Northern lights aurora effect", category: "Backgrounds", tags: ["aurora", "lights", "gradient"] },
  { name: "Waves Background", slug: "waves-bg", description: "Animated wave layers background", category: "Backgrounds", tags: ["waves", "layers", "ocean"] },
  { name: "Particles Background", slug: "particles-bg", description: "Floating particles background", category: "Backgrounds", tags: ["particles", "float", "ambient"] },
  { name: "Grid Background", slug: "grid-bg", description: "Animated grid pattern background", category: "Backgrounds", tags: ["grid", "pattern", "tech"] },
  { name: "Dots Background", slug: "dots-bg", description: "Dotted pattern background", category: "Backgrounds", tags: ["dots", "pattern", "minimal"] },
  { name: "Blur Blob Background", slug: "blur-blob-bg", description: "Blurred animated blobs background", category: "Backgrounds", tags: ["blur", "blob", "organic"] },
  { name: "Starfield Background", slug: "starfield-bg", description: "Animated starfield space background", category: "Backgrounds", tags: ["stars", "space", "parallax"] },


  // Loaders (66-75)
  { name: "Orbit Loader", slug: "orbit-loader", description: "Orbiting dots loader", category: "Loaders", tags: ["orbit", "dots", "circular"] },
  { name: "Pulse Loader", slug: "pulse-loader", description: "Pulsing circle loader", category: "Loaders", tags: ["pulse", "circle", "simple"] },
  { name: "Wave Loader", slug: "wave-loader", description: "Wave bars loader", category: "Loaders", tags: ["wave", "bars", "audio"] },
  { name: "Bounce Loader", slug: "bounce-loader", description: "Bouncing dots loader", category: "Loaders", tags: ["bounce", "dots", "playful"] },
  { name: "Morph Loader", slug: "morph-loader", description: "Morphing shape loader", category: "Loaders", tags: ["morph", "shape", "organic"] },
  { name: "Flip Loader", slug: "flip-loader", description: "Flipping square loader", category: "Loaders", tags: ["flip", "square", "3d"] },
  { name: "Rotate Loader", slug: "rotate-loader", description: "Rotating arc loader", category: "Loaders", tags: ["rotate", "arc", "spinner"] },
  { name: "Dots Loader", slug: "dots-loader", description: "Sequential dots loader", category: "Loaders", tags: ["dots", "sequence", "simple"] },
  { name: "Bar Loader", slug: "bar-loader", description: "Progress bar loader", category: "Loaders", tags: ["bar", "progress", "linear"] },
  { name: "Skeleton Loader", slug: "skeleton-loader", description: "Content skeleton loader", category: "Loaders", tags: ["skeleton", "content", "placeholder"] },

  // Reveals/Transitions (76-85)
  { name: "Split Reveal", slug: "split-reveal", description: "Content split reveal animation", category: "Reveals", tags: ["split", "reveal", "scroll"] },
  { name: "Fade Reveal", slug: "fade-reveal", description: "Fade in reveal animation", category: "Reveals", tags: ["fade", "reveal", "scroll"] },
  { name: "Slide Reveal", slug: "slide-reveal", description: "Slide in reveal animation", category: "Reveals", tags: ["slide", "reveal", "scroll"] },
  { name: "Scale Reveal", slug: "scale-reveal", description: "Scale up reveal animation", category: "Reveals", tags: ["scale", "reveal", "scroll"] },
  { name: "Rotate Reveal", slug: "rotate-reveal", description: "Rotate in reveal animation", category: "Reveals", tags: ["rotate", "reveal", "scroll"] },
  { name: "Blur Reveal", slug: "blur-reveal", description: "Blur to clear reveal animation", category: "Reveals", tags: ["blur", "reveal", "scroll"] },
  { name: "Clip Reveal", slug: "clip-reveal", description: "Clip-path reveal animation", category: "Reveals", tags: ["clip", "reveal", "mask"] },
  { name: "Stagger Reveal", slug: "stagger-reveal", description: "Staggered children reveal", category: "Reveals", tags: ["stagger", "children", "sequence"] },
  { name: "Mask Reveal", slug: "mask-reveal", description: "Mask wipe reveal animation", category: "Reveals", tags: ["mask", "wipe", "reveal"] },
  { name: "Perspective Reveal", slug: "perspective-reveal", description: "3D perspective reveal animation", category: "Reveals", tags: ["perspective", "3d", "reveal"] },

  // Layout (86-95)
  { name: "Tilted Section", slug: "tilted-section", description: "Full-width tilted section", category: "Layout", tags: ["tilt", "section", "angle"] },
  { name: "Broken Grid", slug: "broken-grid", description: "Asymmetric broken grid layout", category: "Layout", tags: ["grid", "broken", "asymmetric"] },
  { name: "Overlap Section", slug: "overlap-section", description: "Overlapping content sections", category: "Layout", tags: ["overlap", "section", "depth"] },
  { name: "Diagonal Section", slug: "diagonal-section", description: "Diagonal split section", category: "Layout", tags: ["diagonal", "section", "creative"] },
  { name: "Sticky Stack", slug: "sticky-stack", description: "Sticky stacking cards on scroll", category: "Layout", tags: ["sticky", "stack", "scroll"] },
  { name: "Scroll Snap", slug: "scroll-snap", description: "Scroll snap sections", category: "Layout", tags: ["scroll", "snap", "sections"] },
  { name: "Parallax Section", slug: "parallax-section", description: "Parallax scrolling section", category: "Layout", tags: ["parallax", "scroll", "depth"] },
  { name: "Asymmetric Grid", slug: "asymmetric-grid", description: "Asymmetric masonry grid", category: "Layout", tags: ["asymmetric", "masonry", "grid"] },
  { name: "Floating Elements", slug: "floating-elements", description: "Floating positioned elements", category: "Layout", tags: ["float", "position", "creative"] },
  { name: "Perspective Container", slug: "perspective-container", description: "3D perspective container", category: "Layout", tags: ["perspective", "3d", "container"] },

  // Interactions (96-100)
  { name: "Magnetic Area", slug: "magnetic-area", description: "Area with magnetic pull effect", category: "Interactions", tags: ["magnetic", "area", "pull"] },
  { name: "Hover Distort", slug: "hover-distort", description: "Image distortion on hover", category: "Interactions", tags: ["distort", "hover", "image"] },
  { name: "Tilt Container", slug: "tilt-container", description: "Container that tilts with mouse", category: "Interactions", tags: ["tilt", "container", "3d"] },
  { name: "Follow Mouse", slug: "follow-mouse", description: "Element that follows mouse", category: "Interactions", tags: ["follow", "mouse", "tracking"] },
  { name: "Elastic Drag", slug: "elastic-drag", description: "Elastic draggable element", category: "Interactions", tags: ["elastic", "drag", "spring"] },

  // RareUI Premium Components (101-110)
  { name: "Particle Card", slug: "particle-card", description: "Card that explodes into particles on hover", category: "Cards", tags: ["particle", "explosion", "reveal", "premium"] },
  { name: "Sound Text", slug: "sound-text", description: "Text that plays musical notes on hover", category: "Text Effects", tags: ["sound", "music", "interactive", "audio"] },
  { name: "Magnetic Scatter Text", slug: "magnetic-scatter-text", description: "Text with magnetic scatter effect", category: "Text Effects", tags: ["magnetic", "scatter", "animation"] },
  { name: "Vapor Smoke Text", slug: "vapor-smoke-text", description: "Text with vapor smoke reveal effect", category: "Text Effects", tags: ["vapor", "smoke", "blur", "reveal"] },
  { name: "Soft Button", slug: "soft-button", description: "Neumorphic soft button with depth", category: "Buttons", tags: ["neumorphism", "soft", "depth", "shadow"] },
  { name: "Neumorphism 3D Button", slug: "neumorphism-3d-button", description: "3D neumorphic button with press effect", category: "Buttons", tags: ["neumorphism", "3d", "press", "depth"] },
  { name: "Glass Shimmer Button", slug: "glass-shimmer-button", description: "Glass button with shimmer animation", category: "Buttons", tags: ["glass", "shimmer", "glossy", "modern"] },

  // NEW: Tabs & Navigation (111-115)
  { name: "Animated Tabs", slug: "animated-tabs", description: "Tabs with smooth animated indicator", category: "Navigation", tags: ["tabs", "animated", "indicator"] },
  { name: "Floating Dock", slug: "floating-dock", description: "macOS-style floating dock navigation", category: "Navigation", tags: ["dock", "floating", "macos"] },
  { name: "Breadcrumbs", slug: "breadcrumbs", description: "Animated breadcrumb navigation", category: "Navigation", tags: ["breadcrumbs", "navigation", "path"] },
  { name: "Stepper", slug: "stepper", description: "Step progress indicator", category: "Navigation", tags: ["stepper", "progress", "steps"] },
  { name: "Command Palette", slug: "command-palette", description: "Searchable command palette modal", category: "Navigation", tags: ["command", "search", "palette", "modal"] },

  // NEW: Counters & Time (116-120)
  { name: "Countdown Timer", slug: "countdown-timer", description: "Animated countdown timer display", category: "Counters", tags: ["countdown", "timer", "animated"] },
  { name: "Flip Counter", slug: "flip-counter", description: "Flip card style number counter", category: "Counters", tags: ["flip", "counter", "numbers"] },
  { name: "Clock", slug: "clock", description: "Animated analog and digital clock", category: "Counters", tags: ["clock", "time", "analog", "digital"] },
  { name: "Stats Counter", slug: "stats-counter", description: "Animated statistics counter", category: "Counters", tags: ["stats", "counter", "numbers"] },
  { name: "Progress Ring", slug: "progress-ring", description: "Circular progress indicator", category: "Counters", tags: ["progress", "circular", "ring"] },

  // NEW: Badges & Indicators (121-125)
  { name: "Event Badge", slug: "event-badge", description: "3D event badge with animations", category: "Badges", tags: ["badge", "event", "3d"] },
  { name: "Badge", slug: "badge", description: "Animated badge component", category: "Badges", tags: ["badge", "label", "tag"] },
  { name: "Social Count", slug: "social-count", description: "Social media follower count display", category: "Badges", tags: ["social", "count", "followers"] },
  { name: "Rating Stars", slug: "rating-stars", description: "Interactive star rating component", category: "Badges", tags: ["rating", "stars", "interactive"] },
  { name: "Avatar Group", slug: "avatar-group", description: "Overlapping avatar stack", category: "Badges", tags: ["avatar", "group", "stack"] },

  // NEW: Forms (126-135)
  { name: "Animated Input", slug: "animated-input", description: "Input with animated label and focus", category: "Forms", tags: ["input", "animated", "label"] },
  { name: "Toggle Switch", slug: "toggle-switch", description: "Animated toggle switch", category: "Forms", tags: ["toggle", "switch", "boolean"] },
  { name: "File Upload", slug: "file-upload", description: "Drag and drop file upload", category: "Forms", tags: ["file", "upload", "drag-drop"] },
  { name: "Color Picker", slug: "color-picker", description: "Interactive color picker", category: "Forms", tags: ["color", "picker", "input"] },
  { name: "Slider", slug: "slider", description: "Animated range slider", category: "Forms", tags: ["slider", "range", "input"] },
  { name: "Password Input", slug: "password-input", description: "Password input with strength indicator", category: "Forms", tags: ["password", "input", "strength"] },
  { name: "Search Input", slug: "search-input", description: "Animated search input with suggestions", category: "Forms", tags: ["search", "input", "suggestions"] },
  { name: "Tag Input", slug: "tag-input", description: "Multi-tag input field", category: "Forms", tags: ["tags", "input", "multi"] },
  { name: "Date Input", slug: "date-input", description: "Date picker input", category: "Forms", tags: ["date", "picker", "calendar"] },
  { name: "OTP Input", slug: "otp-input", description: "One-time password input", category: "Forms", tags: ["otp", "input", "code"] },

  // NEW: Feedback (136-145)
  { name: "Toast", slug: "toast", description: "Toast notification component", category: "Feedback", tags: ["toast", "notification", "alert"] },
  { name: "Notification", slug: "notification", description: "Notification cards with actions", category: "Feedback", tags: ["notification", "alert", "message"] },
  { name: "Modal", slug: "modal", description: "Animated modal dialog", category: "Feedback", tags: ["modal", "dialog", "popup"] },
  { name: "Tooltip", slug: "tooltip", description: "Animated tooltip component", category: "Feedback", tags: ["tooltip", "hover", "info"] },
  { name: "Accordion", slug: "accordion", description: "Collapsible accordion panels", category: "Feedback", tags: ["accordion", "collapse", "expand"] },
  { name: "Confetti Button", slug: "confetti-button", description: "Button that triggers confetti", category: "Feedback", tags: ["confetti", "celebration", "button"] },
  { name: "Loading States", slug: "loading-states", description: "Various loading indicators", category: "Feedback", tags: ["loading", "spinner", "skeleton"] },
  { name: "Skeleton Loader", slug: "skeleton-loader-new", description: "Content skeleton placeholder", category: "Feedback", tags: ["skeleton", "loading", "placeholder"] },
  { name: "Progress Loader", slug: "progress-loader", description: "Linear progress indicator", category: "Feedback", tags: ["progress", "loading", "bar"] },
  { name: "Infinite Scroll Loader", slug: "infinite-scroll-loader", description: "Infinite scroll loading indicator", category: "Feedback", tags: ["infinite", "scroll", "loader"] },

  // NEW: Premium Cards (146-155)
  { name: "Pricing Card", slug: "pricing-card", description: "Animated pricing plan card", category: "Cards", tags: ["pricing", "plan", "subscription"] },
  { name: "Testimonial Card", slug: "testimonial-card", description: "Customer testimonial card", category: "Cards", tags: ["testimonial", "review", "quote"] },
  { name: "Profile Card", slug: "profile-card", description: "User profile card with actions", category: "Cards", tags: ["profile", "user", "social"] },
  { name: "Bento Grid", slug: "bento-grid", description: "Bento box style grid layout", category: "Cards", tags: ["bento", "grid", "layout"] },
  { name: "LED Card", slug: "led-card", description: "Card with LED border effect", category: "Cards", tags: ["led", "border", "glow"] },
  { name: "Animated Border Card", slug: "animated-border-card", description: "Card with animated border", category: "Cards", tags: ["border", "animated", "gradient"] },
  { name: "Kanban Board", slug: "kanban", description: "Draggable kanban board", category: "Cards", tags: ["kanban", "board", "drag"] },
  { name: "Liquid Glass Card", slug: "liquid-glass", description: "Liquid glass morphism card", category: "Cards", tags: ["liquid", "glass", "blur"] },
  { name: "Image Compare", slug: "image-compare", description: "Before/after image comparison", category: "Cards", tags: ["image", "compare", "slider"] },
  { name: "Image Gallery", slug: "image-gallery", description: "Animated image gallery grid", category: "Cards", tags: ["gallery", "images", "grid"] },

  // NEW: Carousels & Scrolling (156-160)
  { name: "Carousel", slug: "carousel", description: "Image carousel with indicators", category: "Carousels", tags: ["carousel", "slider", "images"] },
  { name: "Marquee", slug: "marquee", description: "Infinite scrolling marquee", category: "Carousels", tags: ["marquee", "scroll", "infinite"] },
  { name: "Timeline", slug: "timeline", description: "Vertical timeline component", category: "Carousels", tags: ["timeline", "history", "events"] },

  // NEW: Backgrounds (161-165)
  { name: "Flickering Grid", slug: "flickering-grid", description: "Flickering grid background", category: "Backgrounds", tags: ["grid", "flickering", "canvas"] },
  { name: "Matrix Rain", slug: "matrix-rain", description: "Matrix-style falling code", category: "Backgrounds", tags: ["matrix", "rain", "code", "cyber"] },
  { name: "Meteor Shower", slug: "meteor-shower", description: "Animated meteor shower", category: "Backgrounds", tags: ["meteor", "shower", "stars"] },
  { name: "Particle Field", slug: "particle-field", description: "Connected particle field", category: "Backgrounds", tags: ["particles", "field", "connected"] },
  { name: "Wave Animation", slug: "wave-animation", description: "Animated wave layers", category: "Backgrounds", tags: ["wave", "layers", "animation"] },

  // NEW: Text Animations (166-175)
  { name: "Typing Animation", slug: "typing-animation", description: "Typewriter text effect", category: "Text Effects", tags: ["typing", "typewriter", "text"] },
  { name: "Text Reveal", slug: "text-reveal", description: "Animated text reveal", category: "Text Effects", tags: ["reveal", "text", "animation"] },
  { name: "Wavy Text", slug: "wavy-text", description: "Text with wavy animation", category: "Text Effects", tags: ["wavy", "text", "animation"] },
  { name: "Shiny Text", slug: "shiny-text", description: "Shimmering text effect", category: "Text Effects", tags: ["shiny", "shimmer", "text"] },
  { name: "Text Explosion", slug: "text-explosion", description: "Text that explodes on click", category: "Text Effects", tags: ["explosion", "particles", "interactive"] },
  { name: "Text Flip", slug: "text-flip", description: "Flipping word animation", category: "Text Effects", tags: ["flip", "rotate", "words"] },
  { name: "Circular Text", slug: "circular-text", description: "Text arranged in circle", category: "Text Effects", tags: ["circular", "rotate", "creative"] },
  { name: "Text 3D Extrude", slug: "text-3d-extrude", description: "3D extruded text effect", category: "Text Effects", tags: ["3d", "extrude", "depth"] },
  { name: "Text Shadow Pulse", slug: "text-shadow-pulse", description: "Pulsing text shadow", category: "Text Effects", tags: ["shadow", "pulse", "glow"] },
  { name: "Text Highlight Hover", slug: "text-highlight-hover", description: "Highlight on hover", category: "Text Effects", tags: ["highlight", "hover", "marker"] },

  // NEW: Image Effects (176-185)
  { name: "Image Reveal", slug: "image-reveal", description: "Image reveal animation", category: "Image Effects", tags: ["image", "reveal", "animation"] },
  { name: "Image Zoom", slug: "image-zoom", description: "Click to zoom image", category: "Image Effects", tags: ["image", "zoom", "lightbox"] },
  { name: "Image Parallax", slug: "image-parallax", description: "Parallax scrolling image", category: "Image Effects", tags: ["image", "parallax", "scroll"] },
  { name: "Image Mask", slug: "image-mask", description: "Masked image shapes", category: "Image Effects", tags: ["image", "mask", "shape"] },
  { name: "Image Glitch", slug: "image-glitch", description: "Glitch effect on hover", category: "Image Effects", tags: ["image", "glitch", "hover"] },
  { name: "Before After Slider", slug: "before-after-slider", description: "Before/after comparison", category: "Image Effects", tags: ["before", "after", "compare"] },
  { name: "Image Tilt", slug: "image-tilt", description: "3D tilt on hover", category: "Image Effects", tags: ["image", "tilt", "3d"] },
  { name: "Image Masonry", slug: "image-masonry", description: "Masonry image grid", category: "Image Effects", tags: ["masonry", "grid", "layout"] },

  // NEW: Cursor Effects (186-190)
  { name: "Cursor Trail", slug: "cursor-trail", description: "Trail following cursor", category: "Cursor Effects", tags: ["cursor", "trail", "follow"] },
  { name: "Spotlight Cursor New", slug: "spotlight-cursor-new", description: "Spotlight cursor effect", category: "Cursor Effects", tags: ["spotlight", "cursor", "light"] },
  { name: "Follow Cursor", slug: "follow-cursor", description: "Element following cursor", category: "Cursor Effects", tags: ["follow", "cursor", "tracking"] },
  { name: "Ripple Cursor", slug: "ripple-cursor", description: "Ripple effect on click", category: "Cursor Effects", tags: ["ripple", "click", "cursor"] },
  { name: "Morphing Cursor", slug: "morphing-cursor", description: "Shape-morphing cursor", category: "Cursor Effects", tags: ["morph", "cursor", "shape"] },

  // NEW: Media Controls (191-200)
  { name: "Music Player", slug: "music-player", description: "Animated music player UI", category: "Media", tags: ["music", "player", "audio"] },
  { name: "Video Player", slug: "video-player", description: "Custom video player", category: "Media", tags: ["video", "player", "controls"] },
  { name: "Audio Visualizer", slug: "audio-visualizer", description: "Audio frequency visualizer", category: "Media", tags: ["audio", "visualizer", "frequency"] },
  { name: "Volume Control", slug: "volume-control", description: "Animated volume slider", category: "Media", tags: ["volume", "slider", "audio"] },
  { name: "Theme Toggle", slug: "theme-toggle", description: "Dark/light mode toggle", category: "Media", tags: ["theme", "toggle", "dark", "light"] },
  { name: "Notification Bell", slug: "notification-bell", description: "Animated notification bell", category: "Media", tags: ["notification", "bell", "alert"] },
  { name: "Zoom Control", slug: "zoom-control", description: "Zoom in/out control", category: "Media", tags: ["zoom", "control", "scale"] },

  // NEW: Interactive Elements (201-210)
  { name: "Segmented Control", slug: "segmented-control", description: "iOS-style segmented control", category: "Interactions", tags: ["segmented", "control", "tabs"] },
  { name: "Chip Group", slug: "chip-group", description: "Selectable chip/tag group", category: "Interactions", tags: ["chip", "tag", "select"] },
  { name: "Phone Input", slug: "phone-input", description: "Phone number input", category: "Interactions", tags: ["phone", "input", "format"] },
  { name: "Keyboard", slug: "keyboard", description: "Animated virtual keyboard", category: "Interactions", tags: ["keyboard", "virtual", "input"] },

  // NEW: Social Actions (211-215)
  { name: "Copy Button", slug: "copy-button", description: "Copy to clipboard button", category: "Social", tags: ["copy", "clipboard", "button"] },
  { name: "Share Buttons", slug: "share-buttons", description: "Social share buttons", category: "Social", tags: ["share", "social", "buttons"] },
  { name: "Like Button", slug: "like-button", description: "Animated like button", category: "Social", tags: ["like", "heart", "animated"] },
  { name: "Code Block", slug: "code-block", description: "Syntax highlighted code block", category: "Social", tags: ["code", "syntax", "highlight"] },

  // NEW: Data Visualization (216-220)
  { name: "Bar Chart", slug: "bar-chart", description: "Animated bar chart", category: "Data", tags: ["chart", "bar", "data"] },
  { name: "Donut Chart", slug: "donut-chart", description: "Animated donut/pie chart", category: "Data", tags: ["chart", "donut", "pie"] },
  { name: "Sparkline", slug: "sparkline", description: "Mini line chart", category: "Data", tags: ["sparkline", "chart", "mini"] },
  { name: "Heatmap", slug: "heatmap", description: "Data heatmap grid", category: "Data", tags: ["heatmap", "grid", "data"] },
  { name: "Mini Stat", slug: "mini-stat", description: "Stat card with trend", category: "Data", tags: ["stat", "trend", "mini"] },

  // NEW: Animations (221-225)
  { name: "Gravity Balls", slug: "gravity-balls", description: "Physics-based bouncing balls", category: "Animations", tags: ["gravity", "physics", "balls"] },
  { name: "Shooting Stars", slug: "shooting-stars", description: "Animated shooting stars", category: "Animations", tags: ["shooting", "stars", "animation"] },
  { name: "Pulsating Circles", slug: "pulsating-circles", description: "Expanding pulse circles", category: "Animations", tags: ["pulse", "circles", "expand"] },
  { name: "DNA Helix", slug: "dna-helix", description: "Animated DNA helix", category: "Animations", tags: ["dna", "helix", "rotate"] },
  { name: "Flowing Dots", slug: "flowing-dots", description: "Mouse-reactive dot grid", category: "Animations", tags: ["dots", "grid", "reactive"] },
];

export const categories = [
  "All",
  "Buttons",
  "Cards",
  "Text Effects",
  "Cursor Effects",
  "Backgrounds",
  "Loaders",
  "Reveals",
  "Layout",
  "Interactions",
  "Navigation",
  "Counters",
  "Badges",
  "Forms",
  "Feedback",
  "Carousels",
  "Image Effects",
  "Media",
  "Social",
  "Data",
  "Animations",
];
