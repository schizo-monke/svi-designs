import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDesignByIndex } from '../data/designs';
import './DesignDetail.css';

const DesignDetail = () => {
  const { index } = useParams();
  const navigate = useNavigate();
  const [design, setDesign] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaError, setMediaError] = useState(false);

  useEffect(() => {
    const designData = getDesignByIndex(index);
    if (designData) {
      setDesign(designData);
    } else {
      // Design not found, redirect to search
      navigate('/');
    }
  }, [index, navigate]);

  if (!design) {
    return <div className="loading">Loading...</div>;
  }

  const mediaFiles = [
    { type: 'image', src: `/assets/${design.index}/thumbnail.png`, name: 'Thumbnail' },
    { type: 'video', src: `/assets/${design.index}/box.mp4`, name: 'Box View' },
    { type: 'video', src: `/assets/${design.index}/spinning.mp4`, name: 'Spinning View' }
  ];

  const handleMediaError = () => {
    setMediaError(true);
  };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % mediaFiles.length);
    setMediaError(false);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + mediaFiles.length) % mediaFiles.length);
    setMediaError(false);
  };

  const currentMedia = mediaFiles[currentMediaIndex];

  // Helper function to check if a value should make the label transparent
  const shouldMakeTransparent = (value) => {
    return value === "No" || value === "None";
  };

  const characteristics = [
    { label: 'Design Name', value: design.design_name },
    { label: 'Index', value: design.index },
    { label: 'Drop Cycle', value: design.drop_cycle ? `Cycle ${design.drop_cycle}` : 'Not specified' },
    { label: 'Barrel Length', value: design.barrel_length ? `${design.barrel_length}"` : 'Not specified' },
    { label: 'Barrel Type', value: design.barrel_type || 'Not specified' },
    { label: 'Frame Material', value: design.frame_material || 'Not specified' },
    { label: 'Grip Texture', value: design.grip_texture || 'Not specified' },
    { label: 'Trigger Guard', value: design.trigger_guard || 'Not specified' },
    { label: 'Grip Length', value: design.grip_length || 'Not specified' },
    { label: 'Slide Serrations', value: design.slide_serrations || 'Not specified' },
    { label: 'Full Slide Serrations', value: design.full_slide_serrations || 'Not specified' },
    { label: 'Cheekbuster', value: design.cheekbuster || 'Not specified' },
    { label: 'Irons/Dot', value: design.irons_dot || 'Not specified' },
    { label: 'Tumbled Grip', value: design.tumbled_grip || 'Not specified' },
    { label: 'Blast Pattern', value: design.blast_pattern || 'Not specified' },
    { label: 'Slide Engraving', value: design.slide_engraving || 'Not specified' },
    { label: 'Rollmark Font', value: design.rollmark_font || 'Not specified' },
    { label: 'Dust Cover Cut', value: design.dust_cover_cut || 'Not specified' },
    { label: 'Compensator', value: design.compensator || 'Not specified' },
    { label: 'Release Date', value: design.release_date || 'Not specified' }
  ];

  return (
    <div className="design-detail">
      <div className="detail-content">
        <div className="detail-header">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to Search
          </button>
        </div>
        {/* Design Image */}
        <div className="design-image-large">
          <img
            src={`/assets/${design.index}/thumbnail.png`}
            alt={`${design.design_name} thumbnail`}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="no-image" style={{ display: 'none' }}>
            <span>No Image</span>
          </div>
        </div>

        {/* Design Card */}
        <div className="design-card-detail">
          <div className="design-info">
            <h3>{design.design_name}</h3>
            <div className="design-specs-grid">
              {design.drop_cycle && (
                <div className={`spec-item ${shouldMakeTransparent(design.drop_cycle) ? 'transparent' : ''}`}>
                  <span className={`spec-label ${shouldMakeTransparent(design.drop_cycle) ? 'transparent' : ''}`}>Drop Cycle:</span>
                  <span className={`spec-value ${shouldMakeTransparent(design.drop_cycle) ? 'transparent' : ''}`}>Cycle {design.drop_cycle}</span>
                </div>
              )}
              {design.barrel_length && (
                <div className="spec-item">
                  <span className="spec-label">Barrel Length:</span>
                  <span className="spec-value">{design.barrel_length}"</span>
                </div>
              )}
              {design.barrel_type && (
                <div className={`spec-item ${shouldMakeTransparent(design.barrel_type) ? 'transparent' : ''}`}>
                  <span className={`spec-label ${shouldMakeTransparent(design.barrel_type) ? 'transparent' : ''}`}>Barrel Type:</span>
                  <span className={`spec-value ${shouldMakeTransparent(design.barrel_type) ? 'transparent' : ''}`}>{design.barrel_type}</span>
                </div>
              )}
              {design.frame_material && (
                <div className={`spec-item ${shouldMakeTransparent(design.frame_material) ? 'transparent' : ''}`}>
                  <span className={`spec-label ${shouldMakeTransparent(design.frame_material) ? 'transparent' : ''}`}>Frame Material:</span>
                  <span className={`spec-value ${shouldMakeTransparent(design.frame_material) ? 'transparent' : ''}`}>{design.frame_material}</span>
                </div>
              )}
              {design.grip_texture && (
                <div className={`spec-item ${shouldMakeTransparent(design.grip_texture) ? 'transparent' : ''}`}>
                  <span className={`spec-label ${shouldMakeTransparent(design.grip_texture) ? 'transparent' : ''}`}>Grip Texture:</span>
                  <span className={`spec-value ${shouldMakeTransparent(design.grip_texture) ? 'transparent' : ''}`}>{design.grip_texture}</span>
                </div>
              )}
              {design.trigger_guard && (
                <div className={`spec-item ${shouldMakeTransparent(design.trigger_guard) ? 'transparent' : ''}`}>
                  <span className={`spec-label ${shouldMakeTransparent(design.trigger_guard) ? 'transparent' : ''}`}>Trigger Guard:</span>
                  <span className={`spec-value ${shouldMakeTransparent(design.trigger_guard) ? 'transparent' : ''}`}>{design.trigger_guard}</span>
                </div>
              )}
              {design.grip_length && (
                <div className={`spec-item ${shouldMakeTransparent(design.grip_length) ? 'transparent' : ''}`}>
                  <span className={`spec-label ${shouldMakeTransparent(design.grip_length) ? 'transparent' : ''}`}>Grip Length:</span>
                  <span className={`spec-value ${shouldMakeTransparent(design.grip_length) ? 'transparent' : ''}`}>{design.grip_length}</span>
                </div>
              )}
              {design.slide_serrations && (
                <div className={`spec-item ${shouldMakeTransparent(design.slide_serrations) ? 'transparent' : ''}`}>
                  <span className={`spec-label ${shouldMakeTransparent(design.slide_serrations) ? 'transparent' : ''}`}>Slide Serrations:</span>
                  <span className={`spec-value ${shouldMakeTransparent(design.slide_serrations) ? 'transparent' : ''}`}>{design.slide_serrations}</span>
                </div>
              )}
              {design.full_slide_serrations && (
                <div className={`spec-item ${shouldMakeTransparent(design.full_slide_serrations) ? 'transparent' : ''}`}>
                  <span className={`spec-label ${shouldMakeTransparent(design.full_slide_serrations) ? 'transparent' : ''}`}>Full Slide Serrations:</span>
                  <span className={`spec-value ${shouldMakeTransparent(design.full_slide_serrations) ? 'transparent' : ''}`}>{design.full_slide_serrations}</span>
                </div>
              )}
              {design.cheekbuster && (
                <div className={`spec-item ${shouldMakeTransparent(design.cheekbuster) ? 'transparent' : ''}`}>
                  <span className={`spec-label ${shouldMakeTransparent(design.cheekbuster) ? 'transparent' : ''}`}>Cheekbuster:</span>
                  <span className={`spec-value ${shouldMakeTransparent(design.cheekbuster) ? 'transparent' : ''}`}>{design.cheekbuster}</span>
                </div>
              )}
              {design.irons_dot && (
                <div className={`spec-item ${shouldMakeTransparent(design.irons_dot) ? 'transparent' : ''}`}>
                  <span className={`spec-label ${shouldMakeTransparent(design.irons_dot) ? 'transparent' : ''}`}>Irons/Dot:</span>
                  <span className={`spec-value ${shouldMakeTransparent(design.irons_dot) ? 'transparent' : ''}`}>{design.irons_dot}</span>
                </div>
              )}
              {design.tumbled_grip && (
                <div className={`spec-item ${shouldMakeTransparent(design.tumbled_grip) ? 'transparent' : ''}`}>
                  <span className={`spec-label ${shouldMakeTransparent(design.tumbled_grip) ? 'transparent' : ''}`}>Tumbled Grip:</span>
                  <span className={`spec-value ${shouldMakeTransparent(design.tumbled_grip) ? 'transparent' : ''}`}>{design.tumbled_grip}</span>
                </div>
              )}
              {design.blast_pattern && (
                <div className={`spec-item ${shouldMakeTransparent(design.blast_pattern) ? 'transparent' : ''}`}>
                  <span className={`spec-label ${shouldMakeTransparent(design.blast_pattern) ? 'transparent' : ''}`}>Blast Pattern:</span>
                  <span className={`spec-value ${shouldMakeTransparent(design.blast_pattern) ? 'transparent' : ''}`}>{design.blast_pattern}</span>
                </div>
              )}
              {design.slide_engraving && (
                <div className={`spec-item ${shouldMakeTransparent(design.slide_engraving) ? 'transparent' : ''}`}>
                  <span className={`spec-label ${shouldMakeTransparent(design.slide_engraving) ? 'transparent' : ''}`}>Slide Engraving:</span>
                  <span className={`spec-value ${shouldMakeTransparent(design.slide_engraving) ? 'transparent' : ''}`}>{design.slide_engraving}</span>
                </div>
              )}
              {design.rollmark_font && (
                <div className={`spec-item ${shouldMakeTransparent(design.rollmark_font) ? 'transparent' : ''}`}>
                  <span className={`spec-label ${shouldMakeTransparent(design.rollmark_font) ? 'transparent' : ''}`}>Rollmark Font:</span>
                  <span className={`spec-value ${shouldMakeTransparent(design.rollmark_font) ? 'transparent' : ''}`}>{design.rollmark_font}</span>
                </div>
              )}
              {design.dust_cover_cut && (
                <div className={`spec-item ${shouldMakeTransparent(design.dust_cover_cut) ? 'transparent' : ''}`}>
                  <span className={`spec-label ${shouldMakeTransparent(design.dust_cover_cut) ? 'transparent' : ''}`}>Dust Cover Cut:</span>
                  <span className={`spec-value ${shouldMakeTransparent(design.dust_cover_cut) ? 'transparent' : ''}`}>{design.dust_cover_cut}</span>
                </div>
              )}
              {design.compensator && (
                <div className={`spec-item ${shouldMakeTransparent(design.compensator) ? 'transparent' : ''}`}>
                  <span className={`spec-label ${shouldMakeTransparent(design.compensator) ? 'transparent' : ''}`}>Compensator:</span>
                  <span className={`spec-value ${shouldMakeTransparent(design.compensator) ? 'transparent' : ''}`}>{design.compensator}</span>
                </div>
              )}
              {design.release_date && (
                <div className={`spec-item ${shouldMakeTransparent(design.release_date) ? 'transparent' : ''}`}>
                  <span className={`spec-label ${shouldMakeTransparent(design.release_date) ? 'transparent' : ''}`}>Release Date:</span>
                  <span className={`spec-value ${shouldMakeTransparent(design.release_date) ? 'transparent' : ''}`}>{design.release_date}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignDetail;
