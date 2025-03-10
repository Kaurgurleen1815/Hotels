import { Link } from 'react-router-dom';
import { FaStar, FaWifi, FaSwimmingPool, FaUtensils } from 'react-icons/fa';

export default function HotelCard({ hotel }) {
  return (
    <div className="hotel-card">
      <div className="card-image">
        <img src={hotel.image} alt={hotel.name} />
        <div className="card-badge">Exclusive Deal</div>
        <button className="favorite-btn">♥</button>
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <h3>{hotel.name}</h3>
          <div className="rating">
            <FaStar className="star-icon" />
            <span>{hotel.rating}</span>
          </div>
        </div>
        
        <p className="location">📍 {hotel.location}</p>
        
        <div className="amenities">
          {hotel.amenities.map((amenity) => (
            <span key={amenity} className="amenity-item">
              {amenity === 'Pool' && <FaSwimmingPool />}
              {amenity === 'Free WiFi' && <FaWifi />}
              {amenity === 'Restaurant' && <FaUtensils />}
              {amenity}
            </span>
          ))}
        </div>
        
        <div className="card-footer">
          <div className="price">
            <span className="price-night">${hotel.price}</span>/night
          </div>
          <Link to={`/hotel/${hotel.id}`} className="view-details-btn">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}