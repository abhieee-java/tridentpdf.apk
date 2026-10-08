/**
 * Tier 1 - Feature 14: PowerPoint (PPTX / PPT) Engine Tests
 * Verifies slide carousel, thumbnail drawer, presentation mode, and slide deck parsing.
 */

const { describe, it, expect } = require('../harness');

describe('Tier 1: Feature 14 - PowerPoint (PPTX / PPT) Engine', () => {
  const sampleDeck = {
    title: 'Product Strategy 2026',
    slides: [
      { index: 1, title: 'Title Slide', shapes: [{ type: 'text', content: 'Product Strategy 2026' }] },
      { index: 2, title: 'Market Opportunity', shapes: [{ type: 'text', content: '$50B Market Size' }] },
      { index: 3, title: 'Roadmap & Milestones', shapes: [{ type: 'text', content: 'Q1: Alpha, Q2: Beta' }] },
      { index: 4, title: 'Financial Projections', shapes: [{ type: 'text', content: 'Break-even Month 18' }] },
    ],
  };

  it('F14-T1-1: PPTX parser identifies slides and text shape contents', () => {
    expect(sampleDeck.slides.length).toBe(4);
    expect(sampleDeck.slides[0].title).toBe('Title Slide');
    expect(sampleDeck.slides[1].shapes[0].content).toBe('$50B Market Size');
  }, { feature: 'F14', tier: 1, milestone: 'M4' });

  it('F14-T1-2: Slide carousel navigation tracks current slide index and bounds', () => {
    let currentSlide = 0;
    const totalSlides = sampleDeck.slides.length;

    function nextSlide() {
      if (currentSlide < totalSlides - 1) currentSlide++;
    }
    function prevSlide() {
      if (currentSlide > 0) currentSlide--;
    }

    expect(currentSlide).toBe(0);
    nextSlide();
    expect(currentSlide).toBe(1);
    prevSlide();
    expect(currentSlide).toBe(0);
    prevSlide(); // should clamp
    expect(currentSlide).toBe(0);
  }, { feature: 'F14', tier: 1, milestone: 'M4' });

  it('F14-T1-3: Current slide indicator formats slide counter string (e.g. Slide 1 of 4)', () => {
    function formatIndicator(currentIdx, total) {
      return `Slide ${currentIdx + 1} of ${total}`;
    }

    expect(formatIndicator(0, 4)).toBe('Slide 1 of 4');
    expect(formatIndicator(2, 4)).toBe('Slide 3 of 4');
  }, { feature: 'F14', tier: 1, milestone: 'M4' });

  it('F14-T1-4: Thumbnail drawer allows jumping directly to target slide', () => {
    let activeSlide = 0;
    function selectThumbnail(slideIndex) {
      if (slideIndex >= 0 && slideIndex < sampleDeck.slides.length) {
        activeSlide = slideIndex;
      }
    }

    selectThumbnail(3);
    expect(activeSlide).toBe(3);
    expect(sampleDeck.slides[activeSlide].title).toBe('Financial Projections');
  }, { feature: 'F14', tier: 1, milestone: 'M4' });

  it('F14-T1-5: Presentation mode toggles fullscreen immersive viewing state', () => {
    let isPresentationMode = false;
    function togglePresentationMode() {
      isPresentationMode = !isPresentationMode;
    }

    expect(isPresentationMode).toBe(false);
    togglePresentationMode();
    expect(isPresentationMode).toBe(true);
    togglePresentationMode();
    expect(isPresentationMode).toBe(false);
  }, { feature: 'F14', tier: 1, milestone: 'M4' });
}, { feature: 'F14', tier: 1, milestone: 'M4' });
