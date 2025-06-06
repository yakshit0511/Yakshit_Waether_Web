import React from 'react';
import { Star, Trash2 } from 'lucide-react';
import { Location } from '../types';

interface FavoritesProps {
  favorites: Location[];
  onSelectLocation: (location: Location) => void;
  onRemoveFavorite: (location: Location) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ 
  favorites, 
  onSelectLocation, 
  onRemoveFavorite 
}) => {
  if (favorites.length === 0) {
    return (
      <div className="p-5 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center mb-4">
          <Star size={20} className="text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Favorite Locations</h3>
        </div>
        
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400">
            Add locations to your favorites for quick access
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-5 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center mb-4">
        <Star size={20} className="text-yellow-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Favorite Locations</h3>
      </div>
      
      <ul className="space-y-2">
        {favorites.map((location) => (
          <li 
            key={`${location.name}-${location.lat}-${location.lon}`}
            className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <button 
              className="flex-1 text-left py-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => onSelectLocation(location)}
            >
              {location.name}
            </button>
            
            <button 
              onClick={() => onRemoveFavorite(location)}
              className="p-1 text-gray-500 hover:text-red-500 transition-colors"
              aria-label={`Remove ${location.name} from favorites`}
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;