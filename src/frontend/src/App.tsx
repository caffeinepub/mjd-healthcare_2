import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Loader2,
  MapPin,
  Menu,
  ShieldCheck,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type ContactFormState = "idle" | "loading" | "success" | "error";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

/* ─────────────────────────────────────────────
   Contact Modal
───────────────────────────────────────────── */
function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { actor } = useActor();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<ContactFormState>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !company || !message) return;
    setFormState("loading");
    try {
      if (actor) {
        await actor.submitContactForm(name, email, company, message);
      }
      setFormState("success");
    } catch {
      setFormState("error");
    }
  }

  function handleClose() {
    if (formState !== "loading") {
      setFormState("idle");
      setName("");
      setEmail("");
      setCompany("");
      setMessage("");
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-lg p-0 overflow-hidden border-0 shadow-navy-lg"
        data-ocid="contact.dialog"
      >
        {/* Header */}
        <div className="bg-navy px-8 py-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-semibold text-white tracking-tight">
              Partner With MJD Healthcare
            </DialogTitle>
            <DialogDescription className="text-white/70 text-sm mt-1">
              Tell us about your medical device brand and expansion goals.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-8 py-6 bg-white">
          {formState === "success" ? (
            <div
              className="flex flex-col items-center py-8 gap-4"
              data-ocid="contact.success_state"
            >
              <div className="w-14 h-14 rounded-full bg-teal-light/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-teal" />
              </div>
              <div className="text-center">
                <p className="font-serif text-lg font-semibold text-navy mb-1">
                  Thank you for reaching out.
                </p>
                <p className="text-sm text-muted-foreground">
                  Our team will be in touch within 24 hours.
                </p>
              </div>
              <Button
                onClick={handleClose}
                className="mt-2 bg-navy text-white hover:bg-navy-light px-6"
                data-ocid="contact.close_button"
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-name"
                    className="label-text text-foreground/70"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="contact-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rajesh Kumar"
                    required
                    disabled={formState === "loading"}
                    className="border-border focus-visible:ring-gold"
                    data-ocid="contact.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-email"
                    className="label-text text-foreground/70"
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rajesh@brand.com"
                    required
                    disabled={formState === "loading"}
                    className="border-border focus-visible:ring-gold"
                    data-ocid="contact.email_input"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="contact-company"
                  className="label-text text-foreground/70"
                >
                  Company Name *
                </Label>
                <Input
                  id="contact-company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your Medical Device Brand"
                  required
                  disabled={formState === "loading"}
                  className="border-border focus-visible:ring-gold"
                  data-ocid="contact.company_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="contact-message"
                  className="label-text text-foreground/70"
                >
                  Message *
                </Label>
                <Textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your distribution goals, target markets, and timeline..."
                  rows={4}
                  required
                  disabled={formState === "loading"}
                  className="border-border focus-visible:ring-gold resize-none"
                  data-ocid="contact.textarea"
                />
              </div>

              {formState === "error" && (
                <p
                  className="text-sm text-destructive"
                  data-ocid="contact.error_state"
                >
                  Something went wrong. Please try again.
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={formState === "loading"}
                  className="flex-1 bg-mjd-navy hover:bg-mjd-navy-light text-white font-semibold py-2.5"
                  data-ocid="contact.submit_button"
                >
                  {formState === "loading" ? (
                    <>
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        data-ocid="contact.loading_state"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Send Inquiry
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={formState === "loading"}
                  className="border-border hover:bg-secondary"
                  data-ocid="contact.close_button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────────────────────────────────────
   Navigation
───────────────────────────────────────────── */
function Navigation({ onOpenContact }: { onOpenContact: () => void }) {
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Approach", href: "approach" },
    { label: "Insights", href: "insights" },
    { label: "Case Studies", href: "case-studies" },
    { label: "Contact", href: "contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Wordmark */}
          <button
            type="button"
            onClick={() => scrollTo("hero")}
            className="font-serif text-lg lg:text-xl font-bold tracking-tight cursor-pointer bg-transparent border-0 p-0"
            style={{
              color: scrolled ? "oklch(var(--navy))" : "white",
            }}
          >
            MJD Healthcare
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <button
                type="button"
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`label-text transition-colors hover:text-gold cursor-pointer ${
                  scrolled ? "text-navy/70" : "text-white/80"
                }`}
                data-ocid={`nav.link.${i + 1}`}
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={onOpenContact}
              className="ml-2 px-5 py-2 bg-mjd-gold text-white font-semibold text-sm tracking-wide hover:bg-mjd-gold-dark transition-colors cursor-pointer"
              data-ocid="nav.button"
            >
              Partner With Us
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className={`lg:hidden p-2 ${scrolled ? "text-navy" : "text-white"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-border py-4 px-2 space-y-1">
            {navLinks.map((link, i) => (
              <button
                type="button"
                key={link.href}
                onClick={() => {
                  scrollTo(link.href);
                  setMobileOpen(false);
                }}
                className="w-full text-left px-4 py-3 label-text text-navy hover:bg-secondary rounded transition-colors"
                data-ocid={`nav.link.${i + 1}`}
              >
                {link.label}
              </button>
            ))}
            <div className="px-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  onOpenContact();
                  setMobileOpen(false);
                }}
                className="w-full py-2.5 bg-mjd-navy text-white font-semibold text-sm tracking-wide hover:bg-mjd-navy-light transition-colors"
                data-ocid="nav.button"
              >
                Partner With Us
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────
   Hero Section
───────────────────────────────────────────── */
function HeroSection({ onOpenContact }: { onOpenContact: () => void }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/generated/hero-bg.dim_1600x900.jpg')",
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
        {/* Eyebrow Label */}
        <div className="inline-flex items-center gap-2 mb-8 animate-fade-in">
          <div className="h-px w-8 bg-mjd-gold" />
          <span className="label-text text-mjd-gold tracking-widest">
            Phygital Healthcare Distribution
          </span>
          <div className="h-px w-8 bg-mjd-gold" />
        </div>

        {/* Headline */}
        <h1
          className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight mb-6"
          style={{ animationDelay: "0.1s" }}
        >
          Phygital Healthcare Distribution Across India{" "}
          <span className="text-mjd-gold">—</span>
          <br className="hidden sm:block" />
          <span className="text-white"> From Launch to Revenue</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg lg:text-xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed font-sans">
          Expand your medical device brand nationwide with MJD Healthcare's
          Phygital Approach. We combine digital intelligence with local presence
          to deliver growth, compliance, and ROI.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            type="button"
            onClick={() => scrollTo("approach")}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-mjd-gold text-white font-semibold text-base hover:bg-mjd-gold-dark transition-all duration-200 tracking-wide shadow-gold-glow"
            data-ocid="hero.primary_button"
          >
            Explore Our Approach
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onOpenContact}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/50 text-white font-semibold text-base hover:bg-white/10 transition-all duration-200 tracking-wide backdrop-blur-sm"
            data-ocid="hero.secondary_button"
          >
            Partner With Us
          </button>
        </div>

        {/* SEO Metadata Tags */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {[
            "phygital healthcare distribution India",
            "medical device market India 2026",
            "nationwide healthcare expansion",
          ].map((tag) => (
            <span key={tag} className="text-xs text-white/40 font-sans">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/30" />
        <span className="label-text text-white/40">Scroll</span>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Value Props Section
───────────────────────────────────────────── */
function ValuePropsSection() {
  const { ref, inView } = useInView();

  const cards = [
    {
      icon: MapPin,
      title: "Nationwide Reach",
      body: "Hub-and-spoke distribution covering metros, Tier-2, and Tier-3 cities across India's vast geography.",
      keywords:
        "MDR 2017 compliance · CDSCO registration · healthcare ROI India",
      ocid: "value_props.card.1",
    },
    {
      icon: ShieldCheck,
      title: "Compliance & Risk Management",
      body: "MDR 2017 licensing and CDSCO registrations handled seamlessly — so you focus on growth, not paperwork.",
      keywords: "MDR 2017 compliance · CDSCO registration · regulatory affairs",
      ocid: "value_props.card.2",
    },
    {
      icon: TrendingUp,
      title: "ROI-Driven Growth",
      body: "Value-focused campaigns deliver up to 40% better performance in emerging markets.",
      keywords:
        "healthcare ROI India · medical device performance · emerging markets",
      ocid: "value_props.card.3",
    },
  ];

  return (
    <section id="value-props" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14">
          <div className="section-divider" />
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-4">
            Why MJD Healthcare
          </h2>
          <p className="text-muted-foreground max-w-xl font-sans">
            A structured approach to healthcare distribution that delivers
            measurable outcomes at every stage of market entry.
          </p>
        </div>

        {/* Cards */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={card.ocid}
                className={`
                  card-gold-top bg-white border border-border p-8 
                  hover:shadow-card-hover transition-all duration-300
                  ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                `}
                style={{
                  transitionDelay: inView ? `${i * 100}ms` : "0ms",
                }}
                data-ocid={card.ocid}
              >
                <div className="w-10 h-10 flex items-center justify-center mb-5 bg-mjd-gold/10">
                  <Icon className="w-5 h-5 text-mjd-gold" />
                </div>
                <h3 className="font-serif text-xl font-bold text-navy mb-3 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed mb-6 font-sans">
                  {card.body}
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground font-sans italic">
                    {card.keywords}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Phygital Approach Section
───────────────────────────────────────────── */
function ApproachSection() {
  const { ref, inView } = useInView();

  const steps = [
    "Digital campaigns generate qualified leads nationwide.",
    "Local service engineers ensure <24-hour response times.",
    "Warehousing and logistics optimized for sensitive medical devices.",
    "Integrated feedback loop reduces leakage and maximizes conversions.",
  ];

  return (
    <section
      id="approach"
      className="py-20 lg:py-28 bg-mjd-warm-grey"
      data-ocid="approach.section"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start"
          ref={ref}
        >
          {/* Left: Steps */}
          <div>
            <div className="section-divider" />
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-4">
              Digital Intelligence + Local Presence ={" "}
              <span className="text-mjd-teal">Scalable Growth</span>
            </h2>
            <p className="text-muted-foreground text-sm mb-10 font-sans">
              hub-and-spoke healthcare distribution · last-mile healthcare
              service · medical device logistics India
            </p>

            <div className="space-y-0">
              {steps.map((step, i) => (
                <div
                  key={step}
                  className={`
                    flex gap-5 py-5 border-b border-border last:border-0
                    transition-all duration-500
                    ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}
                  `}
                  style={{ transitionDelay: inView ? `${i * 120}ms` : "0ms" }}
                  data-ocid={`approach.item.${i + 1}`}
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-mjd-gold text-mjd-gold font-serif font-bold text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="text-foreground text-base leading-relaxed font-sans pt-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Callout Box */}
          <div className="lg:pt-16">
            <div
              className={`
                bg-navy p-8 lg:p-10 relative overflow-hidden
                transition-all duration-700
                ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
              `}
              style={{ transitionDelay: "0.3s" }}
            >
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-mjd-gold" />
              <div className="absolute bottom-0 right-0 w-24 h-24 border border-white/5 rounded-full translate-x-8 translate-y-8" />

              <p className="label-text text-mjd-gold mb-4 tracking-widest">
                The Phygital Advantage
              </p>
              <h3 className="font-serif text-2xl lg:text-3xl font-bold text-white leading-tight mb-6">
                Digital reach at scale.
                <br />
                Human trust at the last mile.
              </h3>
              <div className="space-y-4">
                {[
                  { metric: "<24h", label: "Service engineer response time" },
                  { metric: "40%", label: "Better campaign performance" },
                  {
                    metric: "3 Tiers",
                    label: "Metro, Tier-2, and Tier-3 coverage",
                  },
                ].map((item) => (
                  <div
                    key={item.metric}
                    className="flex items-center gap-4 py-3 border-b border-white/10 last:border-0"
                  >
                    <span className="font-serif text-2xl font-bold text-mjd-gold w-20 flex-shrink-0">
                      {item.metric}
                    </span>
                    <span className="text-white/70 text-sm font-sans">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Market Insights Section
───────────────────────────────────────────── */
function InsightsSection() {
  const { ref, inView } = useInView();

  const stats = [
    {
      value: "USD 18.3B",
      label: "Medical devices market by 2026",
      sub: "India healthcare sector",
      ocid: "insights.card.1",
    },
    {
      value: "7.8% CAGR",
      label: "Growth through 2031",
      sub: "Consistently above global avg.",
      ocid: "insights.card.2",
    },
    {
      value: "Ayushman Bharat",
      label: "PM-JAY driving public sector demand",
      sub: "500M+ beneficiaries",
      ocid: "insights.card.3",
    },
  ];

  return (
    <section
      id="insights"
      className="py-20 lg:py-28 bg-white"
      data-ocid="insights.section"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-14">
          <div className="section-divider" />
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-4">
            India's Healthcare Market —{" "}
            <span className="text-mjd-teal">The Opportunity Ahead</span>
          </h2>
          <p className="text-muted-foreground max-w-xl font-sans text-sm">
            medical device market India 2026 · Ayushman Bharat PM-JAY
            opportunities · hospital infrastructure growth India
          </p>
        </div>

        {/* Stats Row */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div
              key={stat.ocid}
              className={`
                p-8 border border-border border-l-4 
                transition-all duration-500
                ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
              `}
              style={{
                borderLeftColor: "oklch(var(--gold))",
                transitionDelay: inView ? `${i * 120}ms` : "0ms",
              }}
              data-ocid={stat.ocid}
            >
              <div className="stat-number text-4xl lg:text-5xl text-navy mb-2">
                {stat.value}
              </div>
              <p className="font-semibold text-foreground text-sm mb-1 font-sans">
                {stat.label}
              </p>
              <p className="text-xs text-muted-foreground font-sans">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Infographic */}
        <div className="text-center">
          <img
            src="/assets/generated/market-insights-infographic.dim_1200x600.png"
            alt="India healthcare market distribution network map showing metro, Tier-2, and Tier-3 city coverage"
            className="max-w-4xl mx-auto w-full border border-border shadow-xs"
            loading="lazy"
          />
          <p className="mt-4 text-sm text-muted-foreground font-sans italic">
            Metro, Tier-2, and Tier-3 city coverage — India's expanding
            healthcare infrastructure
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Case Studies Section
───────────────────────────────────────────── */
function CaseStudiesSection() {
  const { ref, inView } = useInView();

  const cases = [
    {
      metric: "12 mo",
      metricLabel: "Time to market penetration",
      title: "Tier-2 City Expansion",
      body: "Helped an Indian brand scale into Tier-2 cities using our Phygital distribution model, achieving measurable market penetration within 12 months.",
      tag: "healthcare expansion case studies India",
      ocid: "case_studies.card.1",
    },
    {
      metric: "60%",
      metricLabel: "Reduction in service-to-sales ratio",
      title: "Service Efficiency",
      body: "Reduced the service-to-sales ratio by 60% through deployment of local engineers and optimized service protocols.",
      tag: "medical device ROI · service efficiency",
      ocid: "case_studies.card.2",
    },
    {
      metric: "40%",
      metricLabel: "Campaign outperformance vs. benchmark",
      title: "Campaign Performance",
      body: "Energy-efficient device campaigns outperformed benchmarks by 40%, driven by targeted digital-physical engagement strategies.",
      tag: "phygital success stories · campaign ROI",
      ocid: "case_studies.card.3",
    },
  ];

  return (
    <section id="case-studies" className="py-20 lg:py-28 bg-mjd-warm-grey">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-14">
          <div className="section-divider" />
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-4">
            Proven Results
          </h2>
          <p className="text-muted-foreground max-w-xl font-sans">
            Demonstrable outcomes from our Phygital distribution model across
            Indian healthcare markets.
          </p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {cases.map((c, i) => (
            <div
              key={c.ocid}
              className={`
                bg-white p-8 border border-border
                hover:shadow-card-hover transition-all duration-300
                ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
              `}
              style={{ transitionDelay: inView ? `${i * 120}ms` : "0ms" }}
              data-ocid={c.ocid}
            >
              {/* Big Metric */}
              <div className="mb-6 pb-6 border-b border-border">
                <div className="stat-number text-5xl lg:text-6xl text-mjd-gold mb-1">
                  {c.metric}
                </div>
                <p className="label-text text-muted-foreground">
                  {c.metricLabel}
                </p>
              </div>

              {/* Content */}
              <h3 className="font-serif text-lg font-bold text-navy mb-3">
                {c.title}
              </h3>
              <p className="text-foreground/70 text-sm leading-relaxed font-sans mb-4">
                {c.body}
              </p>
              <p className="text-xs text-muted-foreground italic font-sans">
                {c.tag}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CTA Section
───────────────────────────────────────────── */
function CTASection({ onOpenContact }: { onOpenContact: () => void }) {
  const { ref, inView } = useInView();

  return (
    <section
      id="contact"
      className="py-24 lg:py-32 bg-navy relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-mjd-gold" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 border border-white/5 rounded-full" />
      <div className="absolute -bottom-10 -right-10 w-48 h-48 border border-white/5 rounded-full" />

      <div
        ref={ref}
        className={`
          max-w-4xl mx-auto px-6 lg:px-8 text-center
          transition-all duration-700
          ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
      >
        <p className="label-text text-mjd-gold tracking-widest mb-6">
          Partner With MJD Healthcare
        </p>
        <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
          Ready to Scale Across India?
        </h2>
        <p className="text-white/70 text-lg mb-12 max-w-2xl mx-auto font-sans leading-relaxed">
          Join India's fastest-growing network of medical device brands
          expanding through phygital distribution. From compliance to last-mile
          delivery — we handle it all.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={onOpenContact}
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-mjd-gold text-white font-semibold text-base tracking-wide hover:bg-mjd-gold-dark transition-all duration-200 shadow-gold-glow"
            data-ocid="cta.primary_button"
          >
            Book a Consultation
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onOpenContact}
            className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-white/30 text-white font-semibold text-base tracking-wide hover:bg-white/10 transition-all duration-200"
            data-ocid="cta.secondary_button"
          >
            Contact Our Team
          </button>
        </div>

        {/* Trust indicators */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-white/10">
          {[
            {
              label: "MDR 2017 Compliance",
              sub: "Fully licensed & registered",
            },
            { label: "<24h Response", sub: "Local engineer network" },
            { label: "Pan-India Reach", sub: "Metro + Tier-2 + Tier-3" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="font-semibold text-white text-sm mb-1 font-sans">
                {item.label}
              </p>
              <p className="text-xs text-white/50 font-sans">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Footer
───────────────────────────────────────────── */
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-mjd-navy-dark text-white/70 py-12"
      data-ocid="footer.section"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 pb-10 border-b border-white/10">
          {/* Left: Wordmark */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-2">
              MJD Healthcare
            </h3>
            <p className="text-sm text-white/50 leading-relaxed font-sans max-w-xs">
              Phygital Healthcare Distribution Across India
            </p>
            <p className="text-xs text-white/30 mt-3 font-sans">
              partner with MJD Healthcare · healthcare distribution India ·
              medical device expansion strategy
            </p>
          </div>

          {/* Center: Nav links */}
          <div className="md:text-center">
            <p className="label-text text-white/40 mb-4">Navigation</p>
            <nav className="flex flex-col md:items-center gap-2">
              {[
                { label: "Our Approach", href: "approach" },
                { label: "Market Insights", href: "insights" },
                { label: "Case Studies", href: "case-studies" },
                { label: "Contact Us", href: "contact" },
              ].map((link) => (
                <button
                  type="button"
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-sm text-white/50 hover:text-white transition-colors font-sans text-left md:text-center"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: Legal */}
          <div className="md:text-right">
            <p className="label-text text-white/40 mb-4">Legal</p>
            <p className="text-sm text-white/50 font-sans mb-1">
              © {year} MJD Healthcare.
            </p>
            <p className="text-sm text-white/50 font-sans">
              All rights reserved.
            </p>
          </div>
        </div>

        {/* Caffeine attribution */}
        <div className="text-center">
          <p className="text-xs text-white/30 font-sans">
            © {year}. Built with <span className="text-mjd-gold/60">♥</span>{" "}
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white/70 transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   App Root
───────────────────────────────────────────── */
export default function App() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation onOpenContact={() => setContactOpen(true)} />

      <main>
        <HeroSection onOpenContact={() => setContactOpen(true)} />
        <ValuePropsSection />
        <ApproachSection />
        <InsightsSection />
        <CaseStudiesSection />
        <CTASection onOpenContact={() => setContactOpen(true)} />
      </main>

      <Footer />

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
