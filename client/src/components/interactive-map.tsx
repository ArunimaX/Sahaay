import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockMapLocations } from "@/lib/mock-data";

interface InteractiveMapProps {
  onLocationSelect?: (location: any) => void;
}

export function InteractiveMap({ onLocationSelect }: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const handleLocationClick = (location: any) => {
    setSelectedLocation(location);
    onLocationSelect?.(location);
  };

  const getLocationColor = (type: string) => {
    switch (type) {
      case "critical": return "bg-red-500";
      case "moderate": return "bg-yellow-500";
      case "center": return "bg-hope-green";
      case "program": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden" data-testid="interactive-map">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm" data-testid="legend-critical">Critical Need</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-sm" data-testid="legend-moderate">Moderate Need</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-hope-green rounded-full"></div>
            <span className="text-sm" data-testid="legend-center">Distribution Center</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-sm" data-testid="legend-program">Active Program</span>
          </div>
        </div>
      </div>
      
      {/* Mock Interactive Map */}
      <div 
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600')"
        }}
        data-testid="map-container"
      >
        <div className="absolute inset-0 bg-blue-50/80"></div>
        
        {/* Mock Location Pins */}
        {mockMapLocations.map((location, index) => (
          <div
            key={location.id}
            className={`absolute w-4 h-4 ${getLocationColor(location.type)} rounded-full animate-pulse cursor-pointer transform -translate-x-1/2 -translate-y-1/2`}
            style={{
              top: `${25 + index * 15}%`,
              left: `${33 + index * 10}%`,
            }}
            onClick={() => handleLocationClick(location)}
            data-testid={`map-pin-${location.id}`}
          />
        ))}
        
        {/* Location Info Panel */}
        {selectedLocation && (
          <Card className="absolute bottom-4 left-4 max-w-sm" data-testid="location-info-panel">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg" data-testid={`text-location-${selectedLocation.id}`}>
                {selectedLocation.name} - Food Distribution Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1 text-sm text-gray-600">
                <div data-testid={`text-families-${selectedLocation.id}`}>
                  Families in Need: <span className="font-semibold text-red-600">{selectedLocation.familiesInNeed?.toLocaleString()}</span>
                </div>
                <div data-testid={`text-meals-${selectedLocation.id}`}>
                  Daily Meals Required: <span className="font-semibold text-orange-600">{selectedLocation.dailyMealsRequired?.toLocaleString()}</span>
                </div>
                <div data-testid={`text-centers-${selectedLocation.id}`}>
                  Active Distribution Centers: <span className="font-semibold text-hope-green">{selectedLocation.distributionCenters}</span>
                </div>
              </div>
              <button className="mt-3 text-hope-green hover:text-green-700 font-semibold text-sm" data-testid={`button-details-${selectedLocation.id}`}>
                View Details →
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
