import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUniqueValues, searchDesigns } from '../data/designs';
import './SearchPage.css';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    barrel_style: '',
    barrel_length: '',
    frame_grip_material: '',
    grip_style: '',
    drop_cycle: ''
  });
  const navigate = useNavigate();

  // Get unique values for filter dropdowns
  const barrelStyles = useMemo(() => getUniqueValues('barrel_style'), []);
  const barrelLengths = useMemo(() => getUniqueValues('barrel_length'), []);
  const frameGripMaterials = useMemo(() => getUniqueValues('frame_grip_material'), []);
  const gripStyles = useMemo(() => getUniqueValues('grip_style'), []);
  const dropCycles = useMemo(() => {
    const cycles = getUniqueValues('drop_cycle');
    return cycles.sort((a, b) => parseInt(b) - parseInt(a));
  }, []);

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

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      barrel_style: '',
      barrel_length: '',
      frame_grip_material: '',
      grip_style: '',
      drop_cycle: ''
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
          <div className="search-group">
            <label htmlFor="search-input">Search anything:</label>
            <input
              id="search-input"
              type="text"
              placeholder="Search designs by name or characteristics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="disclaimer-tooltip">
            <span className="tooltip-icon">?</span>
            <div className="tooltip-text">
              This site is not in any way affiliated with SVI or Infinity Firearms. It is purely for informational purposes only to help enthusiasts appreciate the variety that SVI has to offer with the Infinity designs.
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="barrel-style">Barrel Style:</label>
            <select
              id="barrel-style"
              value={filters.barrel_style}
              onChange={(e) => handleFilterChange('barrel_style', e.target.value)}
            >
              <option value="">All Styles</option>
              {barrelStyles.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>

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
            <label htmlFor="frame-grip-material">Frame/Grip Material:</label>
            <select
              id="frame-grip-material"
              value={filters.frame_grip_material}
              onChange={(e) => handleFilterChange('frame_grip_material', e.target.value)}
            >
              <option value="">All Materials</option>
              {frameGripMaterials.map(material => (
                <option key={material} value={material}>{material}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="grip-style">Grip Style:</label>
            <select
              id="grip-style"
              value={filters.grip_style}
              onChange={(e) => handleFilterChange('grip_style', e.target.value)}
            >
              <option value="">All Styles</option>
              {gripStyles.map(style => (
                <option key={style} value={style}>{style}</option>
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

          <button onClick={clearFilters} className="clear-filters-btn">
            Clear All Filters
          </button>
        </div>

        {/* Results Count */}
        <div className="results-count">
          <p>Found {searchResults.length} design{searchResults.length !== 1 ? 's' : ''}</p>
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
                        {design.barrel_style && <span>{design.barrel_style}</span>}
                        {design.barrel_length && <span>{design.barrel_length}"</span>}
                        {design.frame_grip_material && <span>{design.frame_grip_material}</span>}
                        {design.grip_style && <span>{design.grip_style}</span>}
                        {design.release_date && <span>{design.release_date}</span>}
                        {design.drop_cycle && <span>Cycle {design.drop_cycle}</span>}
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
