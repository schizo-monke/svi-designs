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
      <div className="detail-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Search
        </button>
        <h1>{design.design_name}</h1>
      </div>

      <div className="detail-content">
        <div className="media-section">
          <div className="media-gallery">
            <div className="media-display">
              {!mediaError ? (
                currentMedia.type === 'video' ? (
                  <video
                    src={currentMedia.src}
                    controls
                    onError={handleMediaError}
                    className="media-content"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={currentMedia.src}
                    alt={`${design.design_name} - ${currentMedia.name}`}
                    onError={handleMediaError}
                    className="media-content"
                  />
                )
              ) : (
                <div className="media-error">
                  <p>Media not available</p>
                  <p>{currentMedia.name}</p>
                </div>
              )}
            </div>

            <div className="media-controls">
              <button onClick={prevMedia} className="media-nav-btn">
                ← Previous
              </button>
              <span className="media-info">
                {currentMedia.name} ({currentMediaIndex + 1} of {mediaFiles.length})
              </span>
              <button onClick={nextMedia} className="media-nav-btn">
                Next →
              </button>
            </div>

            <div className="media-thumbnails">
              {mediaFiles.map((media, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentMediaIndex(idx);
                    setMediaError(false);
                  }}
                  className={`media-thumbnail ${idx === currentMediaIndex ? 'active' : ''}`}
                >
                  {media.type === 'video' ? '🎥' : '🖼️'} {media.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="characteristics-section">
          <h2>Design Characteristics</h2>
          <div className="characteristics-table">
            <table>
              <tbody>
                {characteristics.map((char, idx) => (
                  <tr key={idx}>
                    <td className="characteristic-label">{char.label}:</td>
                    <td className="characteristic-value">{char.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignDetail;
