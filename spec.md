# MJD Healthcare

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Professional McKinsey/Bain-style single-page marketing website for MJD Healthcare
- Hero section with H1, subtext, and two CTA buttons ("Explore Our Approach", "Partner With Us")
- Value proposition section with 3 columns: Nationwide Reach, Compliance & Risk Management, ROI-Driven Growth
- Phygital Approach feature section with H2 and 4 bullet points
- Market Insights trust section with statistics (USD 18.3B market, 7.8% CAGR, Ayushman Bharat) and visual infographic
- Case Studies / Success Stories section with 3 metrics/stories
- Final CTA conversion section with H2 and two buttons ("Book a Consultation", "Contact Our Team")
- Sticky navigation header with company name/logo and nav links
- Footer with company info and links
- Contact/consultation modal or form triggered by CTA buttons

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Generate hero background image (professional healthcare/India themed)
2. Generate market insights infographic image (India map + growth curve)
3. Backend: store contact form submissions (name, email, company, message)
4. Frontend:
   - Sticky top nav: "MJD Healthcare" logo + nav links (Home, Approach, Insights, Case Studies, Contact)
   - Hero: full-width dark/navy background, H1 headline, subtext, two CTA buttons with data-ocid markers
   - Value props: 3-column cards with icons
   - Phygital Approach: feature section with bullet points and visual
   - Market Insights: stat highlights + infographic image
   - Case Studies: 3 cards with metrics
   - CTA section: centered H2 + two buttons
   - Contact modal: form fields (name, email, company, message), submit to backend
   - Footer
5. Apply SEO-friendly structure (semantic HTML, H1/H2 hierarchy, keyword-dense copy)
6. Deploy
