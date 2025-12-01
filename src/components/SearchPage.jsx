import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getUniqueValues, searchDesigns } from '../data/designs';
import './SearchPage.css';

// Helper function to create intelligent acronyms
const createAcronym = (text) => {
  if (!text || text.length <= 18) return text;

  // Common patterns and their acronyms
  const patterns = {
    'Infinity Traditional Square': 'ITS',
    'Infinity Traditional': 'IT',
    'Traditional Square': 'TS',
    'Micropockets - Standard': 'MPS',
    'Micropockets - Compact': 'MPC',
    'Micropockets - Aggressive': 'MPA',
    'Micropockets': 'MP',
    'Xcelerator': 'XC',
    'Xcellerators': 'XCS',
    'Serrations': 'SER',
    'Diamonds': 'DIA',
    'Skater': 'SK',
    'Terrain': 'TER',
    'Hex': 'HX',
    'Honey': 'HNY',
    'Palmer': 'PAL',
    'Space Invaders': 'SI',
    'Goosebumps': 'GB',
    '1911 Grip Panels': '1911GP',
    'Full Size': 'FS',
    'Compact': 'COMP',
    'Standard': 'STD',
    'Aggressive': 'AGG',
    'Hybrid': 'HYB',
    'Steel': 'ST',
    'Aluminum': 'AL',
    'Titanium': 'TI',
    'No': 'N',
    'Yes': 'Y',
    'Dot': 'D',
    'Irons': 'I',
    'None': 'N/A',
    'Infinity Font': 'IF',
    'Short Butler': 'SB',
    'Long Butler': 'LB',
    'Baby Comp': 'BC',
    'Island': 'ISL',
    'Bushing': 'BUSH',
    'Bull': 'BULL'
  };

  // Try to find exact matches first
  for (const [pattern, acronym] of Object.entries(patterns)) {
    if (text.includes(pattern)) {
      return text.replace(pattern, acronym);
    }
  }

  // If no pattern matches, create a smart acronym
  const words = text.split(/[\s\-_]+/).filter(word => word.length > 0);
  if (words.length <= 2) {
    return words.map(word => word.charAt(0).toUpperCase()).join('');
  }

  // For longer phrases, take first letter of each significant word
  const significantWords = words.filter(word =>
    word.length > 2 &&
    !['the', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by'].includes(word.toLowerCase())
  );

  if (significantWords.length <= 3) {
    return significantWords.map(word => word.charAt(0).toUpperCase()).join('');
  }

  // Fallback: first 3 letters of first word + first letter of other words
  const firstWord = words[0].substring(0, 3).toUpperCase();
  const otherLetters = words.slice(1).map(word => word.charAt(0).toUpperCase()).join('');
  return firstWord + otherLetters;
};

// Helper function to check if a value should make the label transparent
const shouldMakeTransparent = (value) => {
  return value === "No" || value === "None";
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Helper to get filters from URL
  const getFiltersFromUrl = (params) => {
    return {
      barrel_length: params.get('barrel_length') || '',
      drop_cycle: params.get('drop_cycle') || '',
      frame_material: params.get('frame_material') || '',
      barrel_type: params.get('barrel_type') || '',
      grip_texture: params.get('grip_texture') || '',
      trigger_guard: params.get('trigger_guard') || '',
      grip_length: params.get('grip_length') || '',
      slide_serrations: params.get('slide_serrations') || '',
      full_slide_serrations: params.get('full_slide_serrations') || '',
      cheekbuster: params.get('cheekbuster') || '',
      irons_dot: params.get('irons_dot') || '',
      tumbled_grip: params.get('tumbled_grip') || '',
      blast_pattern: params.get('blast_pattern') || '',
      slide_engraving: params.get('slide_engraving') || '',
      rollmark_font: params.get('rollmark_font') || '',
      dust_cover_cut: params.get('dust_cover_cut') || '',
      compensator: params.get('compensator') || ''
    };
  };

  // Helper to build URL params from state
  const buildParamsFromState = (query, filterState) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    Object.entries(filterState).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params;
  };

  // Initialize state from URL parameters
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [filters, setFilters] = useState(() => getFiltersFromUrl(searchParams));

  // Track previous URL to detect external changes (back/forward buttons)
  const prevUrlRef = useRef(searchParams.toString());

  // Update URL when search query or filters change (from user action)
  useEffect(() => {
    const expectedParams = buildParamsFromState(searchQuery, filters);
    const currentParamsStr = searchParams.toString();
    const expectedParamsStr = expectedParams.toString();

    // Only update URL if it doesn't match current state
    if (currentParamsStr !== expectedParamsStr) {
      setSearchParams(expectedParams, { replace: true });
      // Update ref to track that we're updating the URL
      prevUrlRef.current = expectedParamsStr;
    }
  }, [searchQuery, filters, searchParams, setSearchParams]);

  // Update state when URL parameters change externally (e.g., browser back/forward)

  useEffect(() => {
    const currentUrl = searchParams.toString();
    const prevUrl = prevUrlRef.current;

    // Only update state if URL changed externally (not from our own update)
    if (currentUrl !== prevUrl) {
      const urlQuery = searchParams.get('q') || '';
      const urlFilters = getFiltersFromUrl(searchParams);

      // Update state only if values are different
      setSearchQuery(prev => prev !== urlQuery ? urlQuery : prev);
      setFilters(prev => {
        const changed = Object.keys(urlFilters).some(
          key => urlFilters[key] !== prev[key]
        );
        return changed ? urlFilters : prev;
      });

      prevUrlRef.current = currentUrl;
    }
  }, [searchParams]);

  // Get unique values for filter dropdowns
  const barrelLengths = useMemo(() => getUniqueValues('barrel_length'), []);
  const dropCycles = useMemo(() => {
    const cycles = getUniqueValues('drop_cycle');
    return cycles.sort((a, b) => parseInt(b) - parseInt(a));
  }, []);
  const frameMaterials = useMemo(() => getUniqueValues('frame_material'), []);
  const barrelTypes = useMemo(() => getUniqueValues('barrel_type'), []);
  const gripTextures = useMemo(() => getUniqueValues('grip_texture'), []);
  const triggerGuards = useMemo(() => getUniqueValues('trigger_guard'), []);
  const gripLengths = useMemo(() => getUniqueValues('grip_length'), []);
  const slideSerrations = useMemo(() => getUniqueValues('slide_serrations'), []);
  const fullSlideSerrations = useMemo(() => getUniqueValues('full_slide_serrations'), []);
  const cheekbusters = useMemo(() => getUniqueValues('cheekbuster'), []);
  const ironsDots = useMemo(() => getUniqueValues('irons_dot'), []);
  const tumbledGrips = useMemo(() => getUniqueValues('tumbled_grip'), []);
  const blastPatterns = useMemo(() => getUniqueValues('blast_pattern'), []);
  const slideEngravings = useMemo(() => getUniqueValues('slide_engraving'), []);
  const rollmarkFonts = useMemo(() => getUniqueValues('rollmark_font'), []);
  const dustCoverCuts = useMemo(() => getUniqueValues('dust_cover_cut'), []);
  const compensators = useMemo(() => getUniqueValues('compensator'), []);

  // Search results
  const searchResults = useMemo(() => {
    const results = searchDesigns(searchQuery, filters);
    // Sort by release date descending (newest first)
    return results.sort((a, b) => {
      // Handle empty release dates by putting them at the end
      if (!a.release_date && !b.release_date) return 0;
      if (!a.release_date) return 1;
      if (!b.release_date) return -1;

      // Compare dates (newest first)
      return new Date(b.release_date) - new Date(a.release_date);
    });
  }, [searchQuery, filters]);

  // Calculate mean days between designs
  const meanDaysBetween = useMemo(() => {
    // Only calculate if there are more than 1 design
    if (searchResults.length <= 1) return null;

    // Filter designs with valid release dates and sort chronologically (oldest first)
    const designsWithDates = searchResults
      .filter(design => design.release_date && design.release_date.trim() !== '')
      .map(design => ({
        ...design,
        date: new Date(design.release_date)
      }))
      .sort((a, b) => a.date - b.date); // Sort oldest to newest

    // Need at least 2 designs with dates to calculate
    if (designsWithDates.length < 2) return null;

    // Calculate days between consecutive designs
    const daysBetween = [];
    for (let i = 1; i < designsWithDates.length; i++) {
      const daysDiff = (designsWithDates[i].date - designsWithDates[i - 1].date) / (1000 * 60 * 60 * 24);
      daysBetween.push(daysDiff);
    }

    // Calculate mean
    const mean = daysBetween.reduce((sum, days) => sum + days, 0) / daysBetween.length;
    return Math.round(mean * 10) / 10; // Round to 1 decimal place
  }, [searchResults]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      barrel_length: '',
      drop_cycle: '',
      frame_material: '',
      barrel_type: '',
      grip_texture: '',
      trigger_guard: '',
      grip_length: '',
      slide_serrations: '',
      full_slide_serrations: '',
      cheekbuster: '',
      irons_dot: '',
      tumbled_grip: '',
      blast_pattern: '',
      slide_engraving: '',
      rollmark_font: '',
      dust_cover_cut: '',
      compensator: ''
    });
  };

  const handleDesignClick = (index) => {
    navigate(`/design/${index}`);
  };

  return (
    <div className="search-page">
      <div className="search-container">
        {/* Search Bar */}
        <div className="search-bar">
          <div className="disclaimer-text">
            This site is not in any way affiliated with SVI or Infinity Firearms. It is purely for informational purposes only to help enthusiasts appreciate the variety that SVI has to offer with the Infinity designs.
          </div>
          <div className="search-group">
            <input
              id="search-input"
              type="text"
              placeholder="Search designs by name or characteristics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          {/* Barrel & Muzzle Device Section */}
          <div className="filter-section">
            <h3 className="filter-section-title">Barrel & Muzzle</h3>
            <div className="filter-group">
              <label htmlFor="barrel-length">Barrel Length:</label>
              <select
                id="barrel-length"
                value={filters.barrel_length}
                onChange={(e) => handleFilterChange('barrel_length', e.target.value)}
              >
                <option value="">All Lengths</option>
                {barrelLengths.map(length => (
                  <option key={length} value={length}>{length}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="barrel-type">Barrel Type:</label>
              <select
                id="barrel-type"
                value={filters.barrel_type}
                onChange={(e) => handleFilterChange('barrel_type', e.target.value)}
              >
                <option value="">All Types</option>
                {barrelTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="cheekbuster">Cheekbuster:</label>
              <select
                id="cheekbuster"
                value={filters.cheekbuster}
                onChange={(e) => handleFilterChange('cheekbuster', e.target.value)}
              >
                <option value="">All</option>
                {cheekbusters.map(cheekbuster => (
                  <option key={cheekbuster} value={cheekbuster}>{cheekbuster}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="compensator">Compensator:</label>
              <select
                id="compensator"
                value={filters.compensator}
                onChange={(e) => handleFilterChange('compensator', e.target.value)}
              >
                <option value="">All</option>
                {compensators.map(comp => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Slide Section */}
          <div className="filter-section">
            <h3 className="filter-section-title">Slide</h3>
            <div className="filter-group">
              <label htmlFor="slide-serrations">Slide Serrations:</label>
              <select
                id="slide-serrations"
                value={filters.slide_serrations}
                onChange={(e) => handleFilterChange('slide_serrations', e.target.value)}
              >
                <option value="">All Slide Serrations</option>
                {slideSerrations.map(serration => (
                  <option key={serration} value={serration}>{serration}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="full-slide-serrations">Full Slide Serrations:</label>
              <select
                id="full-slide-serrations"
                value={filters.full_slide_serrations}
                onChange={(e) => handleFilterChange('full_slide_serrations', e.target.value)}
              >
                <option value="">All</option>
                {fullSlideSerrations.map(serration => (
                  <option key={serration} value={serration}>{serration}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="slide-engraving">Slide Engraving:</label>
              <select
                id="slide-engraving"
                value={filters.slide_engraving}
                onChange={(e) => handleFilterChange('slide_engraving', e.target.value)}
              >
                <option value="">All</option>
                {slideEngravings.map(engraving => (
                  <option key={engraving} value={engraving}>{engraving}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="rollmark-font">Rollmark Font:</label>
              <select
                id="rollmark-font"
                value={filters.rollmark_font}
                onChange={(e) => handleFilterChange('rollmark_font', e.target.value)}
              >
                <option value="">All</option>
                {rollmarkFonts.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Frame Section */}
          <div className="filter-section">
            <h3 className="filter-section-title">Frame</h3>
            <div className="filter-group">
              <label htmlFor="frame-material">Frame Material:</label>
              <select
                id="frame-material"
                value={filters.frame_material}
                onChange={(e) => handleFilterChange('frame_material', e.target.value)}
              >
                <option value="">All Materials</option>
                {frameMaterials.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="dust-cover-cut">Dust Cover Cut:</label>
              <select
                id="dust-cover-cut"
                value={filters.dust_cover_cut}
                onChange={(e) => handleFilterChange('dust_cover_cut', e.target.value)}
              >
                <option value="">All</option>
                {dustCoverCuts.map(cut => (
                  <option key={cut} value={cut}>{cut}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grip Section */}
          <div className="filter-section">
            <h3 className="filter-section-title">Grip</h3>
            <div className="filter-group">
              <label htmlFor="grip-texture">Grip Texture:</label>
              <select
                id="grip-texture"
                value={filters.grip_texture}
                onChange={(e) => handleFilterChange('grip_texture', e.target.value)}
              >
                <option value="">All Textures</option>
                {gripTextures.map(texture => (
                  <option key={texture} value={texture}>{texture}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="grip-length">Grip Length:</label>
              <select
                id="grip-length"
                value={filters.grip_length}
                onChange={(e) => handleFilterChange('grip_length', e.target.value)}
              >
                <option value="">All Lengths</option>
                {gripLengths.map(length => (
                  <option key={length} value={length}>{length}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="trigger-guard">Trigger Guard:</label>
              <select
                id="trigger-guard"
                value={filters.trigger_guard}
                onChange={(e) => handleFilterChange('trigger_guard', e.target.value)}
              >
                <option value="">All Guards</option>
                {triggerGuards.map(guard => (
                  <option key={guard} value={guard}>{guard}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="tumbled-grip">Tumbled Grip:</label>
              <select
                id="tumbled-grip"
                value={filters.tumbled_grip}
                onChange={(e) => handleFilterChange('tumbled_grip', e.target.value)}
              >
                <option value="">All</option>
                {tumbledGrips.map(grip => (
                  <option key={grip} value={grip}>{grip}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Misc Section */}
          <div className="filter-section">
            <h3 className="filter-section-title">Misc</h3>
            <div className="filter-group">
              <label htmlFor="irons-dot">Irons/Dot:</label>
              <select
                id="irons-dot"
                value={filters.irons_dot}
                onChange={(e) => handleFilterChange('irons_dot', e.target.value)}
              >
                <option value="">All</option>
                {ironsDots.map(irons => (
                  <option key={irons} value={irons}>{irons}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="blast-pattern">Blast Pattern:</label>
              <select
                id="blast-pattern"
                value={filters.blast_pattern}
                onChange={(e) => handleFilterChange('blast_pattern', e.target.value)}
              >
                <option value="">All</option>
                {blastPatterns.map(pattern => (
                  <option key={pattern} value={pattern}>{pattern}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="drop-cycle">Drop Cycle:</label>
              <select
                id="drop-cycle"
                value={filters.drop_cycle}
                onChange={(e) => handleFilterChange('drop_cycle', e.target.value)}
              >
                <option value="">All Cycles</option>
                {dropCycles.map(cycle => (
                  <option key={cycle} value={cycle}>Cycle {cycle}</option>
                ))}
              </select>
            </div>
          </div>

          <button onClick={clearFilters} className="clear-filters-btn">
            Clear All Filters
          </button>
        </div>

        {/* Results Count */}
        <div className="results-count">
          <p>Found {searchResults.length} design{searchResults.length !== 1 ? 's' : ''}</p>
          {meanDaysBetween !== null && (
            <p className="mean-days-metric">
              Mean days between designs: <strong>{meanDaysBetween}</strong> days
            </p>
          )}
        </div>

        {/* Search Results */}
        <div className="search-results">
          {searchResults.length === 0 ? (
            <div className="no-results">
              <p>No designs found matching your criteria.</p>
              <p>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="results-grid">
              {searchResults.map((design) => {
                const cycleNumber = parseInt(design.drop_cycle);
                const cycleClass = cycleNumber % 2 === 0 ? 'even-cycle' : 'odd-cycle';

                return (
                  <div
                    key={design.index}
                    className={`design-card ${cycleClass}`}
                    onClick={() => handleDesignClick(design.index)}
                  >
                    <div className="design-thumbnail">
                      <img
                        src={`/assets/${design.index}/thumbnail.png`}
                        alt={`${design.design_name} thumbnail`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="thumbnail-placeholder" style={{ display: 'none' }}>
                        <span>No Image</span>
                      </div>
                    </div>
                    <div className="design-info">
                      <h3>{design.design_name}</h3>
                      <div className="design-specs">
                        <div className="spec-column">
                          {design.barrel_length && (
                            <div className={`spec-item ${shouldMakeTransparent(design.barrel_length) ? 'transparent' : ''}`}>
                              <span className={`spec-label ${shouldMakeTransparent(design.barrel_length) ? 'transparent' : ''}`}>Barrel Length:</span>
                              <span className={`spec-value ${shouldMakeTransparent(design.barrel_length) ? 'transparent' : ''}`}>{createAcronym(design.barrel_length)}"</span>
                            </div>
                          )}
                          {design.barrel_type && (
                            <div className={`spec-item ${shouldMakeTransparent(design.barrel_type) ? 'transparent' : ''}`}>
                              <span className={`spec-label ${shouldMakeTransparent(design.barrel_type) ? 'transparent' : ''}`}>Barrel Type:</span>
                              <span className={`spec-value ${shouldMakeTransparent(design.barrel_type) ? 'transparent' : ''}`}>{createAcronym(design.barrel_type)}</span>
                            </div>
                          )}
                          {design.frame_material && (
                            <div className={`spec-item ${shouldMakeTransparent(design.frame_material) ? 'transparent' : ''}`}>
                              <span className={`spec-label ${shouldMakeTransparent(design.frame_material) ? 'transparent' : ''}`}>Frame Material:</span>
                              <span className={`spec-value ${shouldMakeTransparent(design.frame_material) ? 'transparent' : ''}`}>{createAcronym(design.frame_material)}</span>
                            </div>
                          )}
                          {design.grip_texture && (
                            <div className={`spec-item ${shouldMakeTransparent(design.grip_texture) ? 'transparent' : ''}`}>
                              <span className={`spec-label ${shouldMakeTransparent(design.grip_texture) ? 'transparent' : ''}`}>Grip Texture:</span>
                              <span className={`spec-value ${shouldMakeTransparent(design.grip_texture) ? 'transparent' : ''}`}>{createAcronym(design.grip_texture)}</span>
                            </div>
                          )}
                        </div>
                        <div className="spec-column">
                          {design.trigger_guard && (
                            <div className={`spec-item ${shouldMakeTransparent(design.trigger_guard) ? 'transparent' : ''}`}>
                              <span className={`spec-label ${shouldMakeTransparent(design.trigger_guard) ? 'transparent' : ''}`}>Trigger Guard:</span>
                              <span className={`spec-value ${shouldMakeTransparent(design.trigger_guard) ? 'transparent' : ''}`}>{createAcronym(design.trigger_guard)}</span>
                            </div>
                          )}
                          {design.grip_length && (
                            <div className={`spec-item ${shouldMakeTransparent(design.grip_length) ? 'transparent' : ''}`}>
                              <span className={`spec-label ${shouldMakeTransparent(design.grip_length) ? 'transparent' : ''}`}>Grip Length:</span>
                              <span className={`spec-value ${shouldMakeTransparent(design.grip_length) ? 'transparent' : ''}`}>{createAcronym(design.grip_length)}</span>
                            </div>
                          )}
                          {design.slide_serrations && (
                            <div className={`spec-item ${shouldMakeTransparent(design.slide_serrations) ? 'transparent' : ''}`}>
                              <span className={`spec-label ${shouldMakeTransparent(design.slide_serrations) ? 'transparent' : ''}`}>Slide Serrations:</span>
                              <span className={`spec-value ${shouldMakeTransparent(design.slide_serrations) ? 'transparent' : ''}`}>{createAcronym(design.slide_serrations)}</span>
                            </div>
                          )}
                          {design.irons_dot && (
                            <div className={`spec-item ${shouldMakeTransparent(design.irons_dot) ? 'transparent' : ''}`}>
                              <span className={`spec-label ${shouldMakeTransparent(design.irons_dot) ? 'transparent' : ''}`}>Irons/Dot:</span>
                              <span className={`spec-value ${shouldMakeTransparent(design.irons_dot) ? 'transparent' : ''}`}>{createAcronym(design.irons_dot)}</span>
                            </div>
                          )}
                        </div>
                        <div className="spec-column">
                          {design.rollmark_font && (
                            <div className={`spec-item ${shouldMakeTransparent(design.rollmark_font) ? 'transparent' : ''}`}>
                              <span className={`spec-label ${shouldMakeTransparent(design.rollmark_font) ? 'transparent' : ''}`}>Rollmark Font:</span>
                              <span className={`spec-value ${shouldMakeTransparent(design.rollmark_font) ? 'transparent' : ''}`}>{createAcronym(design.rollmark_font)}</span>
                            </div>
                          )}
                          {design.compensator && (
                            <div className={`spec-item ${shouldMakeTransparent(design.compensator) ? 'transparent' : ''}`}>
                              <span className={`spec-label ${shouldMakeTransparent(design.compensator) ? 'transparent' : ''}`}>Compensator:</span>
                              <span className={`spec-value ${shouldMakeTransparent(design.compensator) ? 'transparent' : ''}`}>{createAcronym(design.compensator)}</span>
                            </div>
                          )}
                          {design.release_date && (
                            <div className={`spec-item ${shouldMakeTransparent(design.release_date) ? 'transparent' : ''}`}>
                              <span className={`spec-label ${shouldMakeTransparent(design.release_date) ? 'transparent' : ''}`}>Release Date:</span>
                              <span className={`spec-value ${shouldMakeTransparent(design.release_date) ? 'transparent' : ''}`}>{createAcronym(design.release_date)}</span>
                            </div>
                          )}
                          {design.drop_cycle && (
                            <div className={`spec-item ${shouldMakeTransparent(design.drop_cycle) ? 'transparent' : ''}`}>
                              <span className={`spec-label ${shouldMakeTransparent(design.drop_cycle) ? 'transparent' : ''}`}>Drop Cycle:</span>
                              <span className={`spec-value ${shouldMakeTransparent(design.drop_cycle) ? 'transparent' : ''}`}>Cycle {createAcronym(design.drop_cycle)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
