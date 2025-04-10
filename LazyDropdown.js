

import React, { useState, useEffect, useRef } from 'react';

const LazyDropdown = ({ data, onSelect }) => {
  const BATCH_SIZE = 50;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef();
  const dropdownRef = useRef();

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
    setVisibleData(filtered.slice(0, BATCH_SIZE));
    setStartIndex(BATCH_SIZE);
  }, [searchQuery, data]);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      const nextBatch = filteredData.slice(startIndex, startIndex + BATCH_SIZE);
      setVisibleData((prev) => [...prev, ...nextBatch]);
      setStartIndex(startIndex + BATCH_SIZE);
    }
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={searchQuery}
        placeholder="Search..."
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        style={{
          width: '100%',
          padding: '8px',
          boxSizing: 'border-box',
          border: '1px solid #ccc',
          borderRadius: isOpen ? '5px 5px 0 0' : '5px',
        }}
      />
      {isOpen && (
        <div
          ref={dropdownRef}
          onScroll={handleScroll}
          style={{
            position: 'absolute',
            width: '100%',
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            borderTop: 'none',
            borderRadius: '0 0 5px 5px',
            background: 'white',
            zIndex: 999,
          }}
        >
          {visibleData.length > 0 ? (
            visibleData.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelect(item);
                  setSearchQuery(item.label); // optional: show selected label
                  setIsOpen(false);
                }}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                }}
              >
                {item.label}
              </div>
            ))
          ) : (
            <div style={{ padding: '8px', color: '#999' }}>Options loading...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default LazyDropdown;

   <LazyDropdown
                      data={this.props.transporterOption}
                      onSelect={this.props.handleSelectGroup}
                    />
