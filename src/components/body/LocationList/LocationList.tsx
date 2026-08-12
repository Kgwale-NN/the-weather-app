import React, { useState } from 'react';
import { MapPin, Trash2 } from 'lucide-react';
import styles from './LocationList.module.css';
import { ConfirmModal } from './ConfirmModal';

type Location = {
  name: string;
  country: string;
};

type LocationListProps = {
  locations: Location[];
  currentLocation: string;
  onSelectLocation: (location: string) => void;
  onDeleteLocation: (location: string) => void;
  theme?: 'light' | 'dark';
};

export const LocationList: React.FC<LocationListProps> = ({ 
  locations, 
  currentLocation, 
  onSelectLocation, 
  onDeleteLocation,
  theme = 'light' 
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);

  const handleDeleteClick = (locationName: string) => {
    setLocationToDelete(locationName);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (locationToDelete) {
      onDeleteLocation(locationToDelete);
    }
    setShowConfirmModal(false);
    setLocationToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setLocationToDelete(null);
  };

  if (locations.length === 0) {
    return (
      <div className={`${styles.locationList} ${theme === 'dark' ? styles.dark : ''}`}>
        <h3 className={`${styles.title} ${theme === 'dark' ? styles.dark : ''}`}>
          Saved Locations
        </h3>
        <p className={`${styles.emptyState} ${theme === 'dark' ? styles.dark : ''}`}>
          No saved locations yet
        </p>
      </div>
    );
  }

  return (
    <div className={`${styles.locationList} ${theme === 'dark' ? styles.dark : ''}`}>
      <h3 className={`${styles.title} ${theme === 'dark' ? styles.dark : ''}`}>
        Saved Locations
      </h3>
      
      <div className={styles.locationItems}>
        {locations.map((location, index) => (
          <div
            key={index}
            className={`${styles.locationItem} ${currentLocation === location.name ? styles.active : ''} ${theme === 'dark' ? styles.dark : ''}`}
            onClick={() => onSelectLocation(location.name)}
          >
            <div className={styles.locationInfo}>
              <div className={`${styles.locationName} ${theme === 'dark' ? styles.dark : ''}`}>
                <MapPin size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                {location.name}
              </div>
              <div className={`${styles.locationCountry} ${theme === 'dark' ? styles.dark : ''}`}>
                {location.country}
              </div>
            </div>
            
            <button
              type="button"
              className={`${styles.deleteButton} ${theme === 'dark' ? styles.dark : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDeleteClick(location.name);
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Delete Location"
        message={`Are you sure you want to delete ${locationToDelete} from your saved locations? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        theme={theme}
      />
    </div>
  );
};