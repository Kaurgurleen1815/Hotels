import { useState } from 'react';
import { FaSearch, FaCalendarAlt, FaUser } from 'react-icons/fa';

export default function SearchForm({ onSearch }) {
  // ... (keep previous state and handler logic)

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="form-group">
        <FaSearch className="input-icon" />
        <input
          type="text"
          placeholder="Where are you going?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <FaCalendarAlt className="input-icon" />
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <FaCalendarAlt className="input-icon" />
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <FaUser className="input-icon" />
        <select value={guests} onChange={(e) => setGuests(e.target.value)}>
          {[1, 2, 3, 4].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'Guest' : 'Guests'}
            </option>
          ))}
        </select>
      </div>
      
      <button type="submit" className="search-btn">
        <FaSearch /> Search Hotels
      </button>
    </form>
  );
}