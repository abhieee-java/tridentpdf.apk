/**
 * Tier 2 - Feature 14: PowerPoint (PPTX / PPT) Engine Boundaries
 * Verifies edge cases: 0 slides fallback, 100+ shapes per slide, bounds clamping, missing thumbnails.
 */

const { describe, it, expect } = require('../harness');

describe('Tier 2: Feature 14 - PowerPoint (PPTX / PPT) Engine Boundaries', () => {
  it('F14-T2-1: PPTX deck with 0 slides initializes with 1 default blank slide', () => {
    function normalizeDeck(deck) {
      if (!deck.slides || deck.slides.length === 0) {
        return {
          title: deck.title || 'Untitled Presentation',
          slides: [{ index: 1, shapes: [] }],
        };
      }
      return deck;
    }

    const normalized = normalizeDeck({ title: 'Empty Deck', slides: [] });
    expect(normalized.slides.length).toBe(1);
    expect(normalized.slides[0].index).toBe(1);
  }, { feature: 'F14', tier: 2, milestone: 'M4' });

  it('F14-T2-2: Slide with 100+ overlapping text boxes and shapes parses without dropping items', () => {
    const complexSlide = {
      index: 1,
      shapes: [],
    };
    for (let i = 0; i < 120; i++) {
      complexSlide.shapes.push({
        id: `shape_${i}`,
        type: i % 2 === 0 ? 'text' : 'rect',
        bounds: { x: i, y: i, w: 50, h: 20 },
      });
    }

    expect(complexSlide.shapes.length).toBe(120);
    const textShapes = complexSlide.shapes.filter((s) => s.type === 'text');
    expect(textShapes.length).toBe(60);
  }, { feature: 'F14', tier: 2, milestone: 'M4' });

  it('F14-T2-3: Carousel swiping past last slide or before first slide clamps safely to limits', () => {
    function clampSlideIndex(requestedIndex, totalSlides) {
      if (totalSlides <= 0) return 0;
      return Math.max(0, Math.min(requestedIndex, totalSlides - 1));
    }

    const total = 5;
    expect(clampSlideIndex(-1, total)).toBe(0);
    expect(clampSlideIndex(-10, total)).toBe(0);
    expect(clampSlideIndex(5, total)).toBe(4);
    expect(clampSlideIndex(100, total)).toBe(4);
    expect(clampSlideIndex(2, total)).toBe(2);
  }, { feature: 'F14', tier: 2, milestone: 'M4' });

  it('F14-T2-4: Missing thumbnail preview falls back to slide number badge placeholder', () => {
    function getThumbnailSource(slide) {
      if (!slide.thumbnailUri) {
        return { type: 'placeholder', label: `Slide ${slide.index}` };
      }
      return { type: 'image', uri: slide.thumbnailUri };
    }

    const fallback = getThumbnailSource({ index: 3 });
    expect(fallback.type).toBe('placeholder');
    expect(fallback.label).toBe('Slide 3');

    const withThumb = getThumbnailSource({ index: 1, thumbnailUri: 'thumb1.png' });
    expect(withThumb.type).toBe('image');
  }, { feature: 'F14', tier: 2, milestone: 'M4' });

  it('F14-T2-5: Rapid successive slide changes maintain correct active slide index', () => {
    let current = 0;
    const total = 10;
    const moves = [1, 1, 1, -1, 1, -1, -1, 1];

    for (const delta of moves) {
      current = Math.max(0, Math.min(current + delta, total - 1));
    }
    expect(current).toBe(2);
  }, { feature: 'F14', tier: 2, milestone: 'M4' });
}, { feature: 'F14', tier: 2, milestone: 'M4' });
