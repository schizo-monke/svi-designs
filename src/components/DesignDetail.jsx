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

  const characteristics = [
    { label: 'Design Name', value: design.design_name },
    { label: 'Index', value: design.index },
    { label: 'Barrel Style', value: design.barrel_style || 'Not specified' },
    { label: 'Barrel Length', value: design.barrel_length ? `${design.barrel_length}"` : 'Not specified' },
    { label: 'Frame/Grip Material', value: design.frame_grip_material || 'Not specified' },
    { label: 'Grip Style', value: design.grip_style || 'Not specified' },
    { label: 'Release Date', value: design.release_date || 'Not specified' },
    { label: 'Drop Cycle', value: design.drop_cycle ? `Cycle ${design.drop_cycle}` : 'Not specified' }
  ];

  return (
    <div className="design-detail">
      <div className="detail-content">
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
            <div className="design-specs">
              {design.barrel_style && (
                <div className="spec-item">
                  <span className="spec-label">Barrel Style:</span>
                  <span className="spec-value">{design.barrel_style}</span>
                </div>
              )}
              {design.barrel_length && (
                <div className="spec-item">
                  <span className="spec-label">Barrel Length:</span>
                  <span className="spec-value">{design.barrel_length}"</span>
                </div>
              )}
              {design.frame_grip_material && (
                <div className="spec-item">
                  <span className="spec-label">Frame/Grip Material:</span>
                  <span className="spec-value">{design.frame_grip_material}</span>
                </div>
              )}
              {design.grip_style && (
                <div className="spec-item">
                  <span className="spec-label">Grip Style:</span>
                  <span className="spec-value">{design.grip_style}</span>
                </div>
              )}
              {design.release_date && (
                <div className="spec-item">
                  <span className="spec-label">Release Date:</span>
                  <span className="spec-value">{design.release_date}</span>
                </div>
              )}
              {design.drop_cycle && (
                <div className="spec-item">
                  <span className="spec-label">Drop Cycle:</span>
                  <span className="spec-value">Cycle {design.drop_cycle}</span>
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
