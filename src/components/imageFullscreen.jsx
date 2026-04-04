import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

function formatFileSize(bytes) {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb.toFixed(1) + ' MB';
}

function getImageTitle(tags) {
  if (!tags) return 'Untitled';
  const parts = tags.split(',').map(t => t.trim());
  return parts.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getInitials(name) {
  if (!name) return '??';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const ImageFullscreen = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSingleImageData = async () => {
      setLoading(true);
      const response = await fetch(
        `https://pixabay.com/api/?key=55291921-2ced599f065e80b80f0484e72&id=${id}`,
      );
      const result = await response.json();
      if (result) {
        setData(result);
        setLoading(false);
      }
    };
    fetchSingleImageData();
  }, [id]);

  const handleDownload = async (url, filename = "image.jpg") => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const image = data?.hits?.[0];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        {/* <Spin size="large" /> */}
        <img className='size-10' src="https://media.tenor.com/eFde1mp-8fYAAAAM/carregando.gif" alt="" />
      </div>
    )
  }

  return (
    <div className="fullscreen-page">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4">
        <button className="back-btn" onClick={() => navigate("/")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Gallery
        </button>

      </div>

      {/* Content */}
      {image && (
        <div className="flex flex-col lg:flex-row flex-1">
          {/* Image Section */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 pb-6 lg:px-12">
            <img
              src={image.previewURL || image.webformatURL}
              alt={image.tags}
              className="max-w-full rounded-lg object-contain"
              style={{ height: '75vh', width: '75vw' }}
            />
          </div>

          {/* Detail Panel */}
          <div className="lg:w-80 xl:w-96 p-6 flex flex-col gap-6 border-l border-[#2a2a2a] bg-[#1a1a1a]">
            {/* Title */}
            <h1 className="font-mono-title text-xl font-bold text-white m-0">
              {getImageTitle(image.tags)}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-3">
              {image.userImageURL ? (
                <img src={image.userImageURL} alt={image.user} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: '#f59e0b' }}>
                  {getInitials(image.user)}
                </div>
              )}
              <div>
                <div className="text-white text-sm font-medium">{image.user}</div>
                <div className="text-gray-500 text-xs">Pixabay Contributor</div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-[#2a2a2a] m-0" />

            {/* Details */}
            <div>
              <h3 className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-3 m-0">Details</h3>
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between">
                  <span className="detail-label">Resolution</span>
                  <span className="detail-value">{image.imageWidth} × {image.imageHeight} px</span>
                </div>
                <div className="flex justify-between">
                  <span className="detail-label">File Size</span>
                  <span className="detail-value">{formatFileSize(image.imageSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="detail-label">Format</span>
                  <span className="detail-value">{image.type?.toUpperCase() || 'JPEG'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="detail-label">Views</span>
                  <span className="detail-value">{image.views?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="detail-label">Downloads</span>
                  <span className="detail-value">{image.downloads?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="detail-label">License</span>
                  <span className="detail-value" style={{ color: '#22c55e' }}>Free to use</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-[#2a2a2a] m-0" />

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button className="download-btn" onClick={() => handleDownload(image.previewURL || image.webformatURL, `image-${image.id}.jpg`)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageFullscreen
