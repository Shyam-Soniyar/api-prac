import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const filterArr = [
  { label: 'All', icon: '🔲', query: 'nature' },
  { label: 'Sunrise', icon: '🌅', query: 'sunrise' },
  { label: 'Nature', icon: '🌿', query: 'nature landscape' },
  { label: 'Mountains', icon: '⛰️', query: 'mountains' },
  { label: 'Ocean', icon: '🌊', query: 'ocean' },
  { label: 'Forest', icon: '🌲', query: 'forest' },
  { label: 'Desert', icon: '🏜️', query: 'desert' },
  { label: 'Night Sky', icon: '🌌', query: 'night sky' },
  { label: 'Wildlife', icon: '🦌', query: 'wildlife' },
];

function formatFileSize(bytes) {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb.toFixed(1) + ' MB';
}

function getImageTitle(tags) {
  if (!tags) return 'Untitled';
  const parts = tags.split(',').map(t => t.trim());
  const title = parts.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return title;
}

function App() {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('nature');
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();
  const debounce = useRef(null);

  const totalPage = Math.ceil(data?.totalHits / 8);

  useEffect(() => {
    const fetchImageData = async () => {
      const response = await fetch(`https://pixabay.com/api/?key=55291921-2ced599f065e80b80f0484e72&q=${query}&per_page=8&page=${page}`);
      const data = await response.json();
      if (data) {
        setData(data);
      }
    };
    fetchImageData();
  }, [page, query])


  const handleSearch = (e) => {
    if (debounce.current) {
      clearTimeout(debounce.current);
    }
    debounce.current = setTimeout(() => {
      setQuery(e.target.value);
      setPage(1);
      setActiveFilter('');
    }, 1000);
  }

  const handleFilterClick = (filter) => {
    setActiveFilter(filter.label);
    setQuery(filter.query);
    setPage(1);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-5 bg-white">
        <h1 className="font-mono-title text-2xl font-bold tracking-tight m-0">
          Image Gallery
        </h1>
        <div className="gallery-search">
          <Input
            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
            className="w-56"
            placeholder="Search images..."
            onChange={handleSearch}
            style={{ borderRadius: 8, border: 'none', background: '#f3f4f6' }}
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 px-8 py-4 bg-white border-b border-gray-200 overflow-x-auto">
        <span className="flex items-center gap-1 text-gray-500 text-sm mr-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="16" y2="12" /><line x1="4" y1="18" x2="12" y2="18" />
          </svg>
          Filters
        </span>
        {filterArr.map((filter) => (
          <button
            key={filter.label}
            className={`filter-pill ${activeFilter === filter.label ? 'active' : ''}`}
            onClick={() => handleFilterClick(filter)}
          >
            <span>{filter.icon}</span>
            {filter.label}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 px-8 py-6">
        {data?.hits?.map((image) => (
          <div key={image.id} className="image-card flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200">
            <img
              className="w-full object-cover"
              style={{ height: '200px' }}
              src={image.previewURL.replace("_150.", "_640.")}
              alt={image.tags}
            />
            <div className="flex flex-col justify-between flex-1 p-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-base m-0">
                  {getImageTitle(image.tags)}
                </h3>
                <p className="text-gray-500 text-sm mt-1 m-0">
                  {image.webformatWidth} × {image.webformatHeight} · {formatFileSize(image.imageSize)}
                </p>
              </div>
              <div
                className="flex items-center gap-1.5 mt-4 text-gray-700 text-sm cursor-pointer hover:text-gray-900 transition-colors"
                onClick={() => navigate(`${image.id}`)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                </svg>
                View Fullscreen
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-1 pb-8">
        {/* {renderPagination()} */}
        <button className='disabled:text-gray-400 disabled:cursor-not-allowed rounded-full shadow flex items-center justify-center size-10 cursor-pointer' onClick={() => setPage(page - 1)} disabled={page === 1}>
          {'<'}
        </button>

        <span className='rounded-lg shadow flex items-center justify-center size-10 cursor-pointer' style={{ margin: "0 10px" }}>{page}</span>

        <button className='disabled:text-gray-400 disabled:cursor-not-allowed rounded-full shadow flex items-center justify-center size-10 cursor-pointer' onClick={() => setPage(page + 1)} disabled={page === totalPage}>
          {'>'}
        </button>
      </div>
    </div>
  )
}

export default App
