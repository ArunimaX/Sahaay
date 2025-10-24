import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { mockMapLocations } from "@/lib/mock-data";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  onLocationSelect?: (location: any) => void;
}

interface RiskAssessmentInput {
  mpiHeadcountAdult: number;
  mpiHeadcountChild: number;
  dropoutSecondary: number;
  femaleLiteracy: number;
}

interface DistrictData {
  name: string;
  state: string;
  riskScore: number;
  coordinates: [number, number];
  type: 'critical' | 'moderate' | 'low' | 'center';
}

export function InteractiveMap({ onLocationSelect }: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [riskInputs, setRiskInputs] = useState<RiskAssessmentInput>({
    mpiHeadcountAdult: 0,
    mpiHeadcountChild: 0,
    dropoutSecondary: 0,
    femaleLiteracy: 0,
  });
  const [predictedRiskScore, setPredictedRiskScore] = useState<number | null>(null);
  const [closestDistrict, setClosestDistrict] = useState<DistrictData | null>(null);
  const [showRiskForm, setShowRiskForm] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock district data based on your Python code structure
  const mockDistrictData: DistrictData[] = [
    {
      name: "Mumbai",
      state: "Maharashtra",
      riskScore: 75.2,
      coordinates: [19.0760, 72.8777],
      type: "critical"
    },
    {
      name: "Delhi",
      state: "Delhi",
      riskScore: 68.9,
      coordinates: [28.6139, 77.2090],
      type: "critical"
    },
    {
      name: "Bangalore",
      state: "Karnataka",
      riskScore: 45.3,
      coordinates: [12.9716, 77.5946],
      type: "moderate"
    },
    {
      name: "Chennai",
      state: "Tamil Nadu",
      riskScore: 52.1,
      coordinates: [13.0827, 80.2707],
      type: "moderate"
    },
    {
      name: "Kolkata",
      state: "West Bengal",
      riskScore: 78.4,
      coordinates: [22.5726, 88.3639],
      type: "critical"
    },
    {
      name: "Hyderabad",
      state: "Telangana",
      riskScore: 38.7,
      coordinates: [17.3850, 78.4867],
      type: "low"
    },
    {
      name: "Pune",
      state: "Maharashtra",
      riskScore: 42.3,
      coordinates: [18.5204, 73.8567],
      type: "moderate"
    },
    {
      name: "Ahmedabad",
      state: "Gujarat",
      riskScore: 35.9,
      coordinates: [23.0225, 72.5714],
      type: "low"
    }
  ];

  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = L.map(mapRef.current).setView([22.9734, 78.6569], 5);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(newMap);

      // Add India boundary (simplified)
      const indiaBounds = [
        [6.0, 68.0], // Southwest coordinates
        [37.0, 97.0]  // Northeast coordinates
      ];
      L.rectangle(indiaBounds, {
        color: "#3388ff",
        weight: 2,
        fillOpacity: 0.1
      }).addTo(newMap);

      // Add district markers
      mockDistrictData.forEach((district) => {
        const markerColor = getDistrictColor(district.type);
        const marker = L.circleMarker(district.coordinates, {
          radius: 8,
          fillColor: markerColor,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(newMap);

        marker.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-lg">${district.name}</h3>
            <p class="text-sm text-gray-600">${district.state}</p>
            <p class="text-sm font-semibold">Risk Score: ${district.riskScore.toFixed(1)}</p>
            <p class="text-xs text-gray-500">Type: ${district.type}</p>
          </div>
        `);

        marker.on('click', () => {
          setSelectedLocation(district);
          onLocationSelect?.(district);
        });
      });

      setMap(newMap);
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map, onLocationSelect]);

  const getDistrictColor = (type: string) => {
    switch (type) {
      case "critical": return "#ef4444";
      case "moderate": return "#f59e0b";
      case "low": return "#10b981";
      case "center": return "#3b82f6";
      default: return "#6b7280";
    }
  };

  const handleLocationClick = (location: any) => {
    setSelectedLocation(location);
    onLocationSelect?.(location);
  };

  const handleRiskInputChange = (field: keyof RiskAssessmentInput, value: string) => {
    setRiskInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const calculateRiskScore = () => {
    // Simplified risk calculation based on your Python code
    const { mpiHeadcountAdult, mpiHeadcountChild, dropoutSecondary, femaleLiteracy } = riskInputs;
    
    // Weighted risk calculation
    let riskScore = (
      mpiHeadcountAdult * 0.3 +
      mpiHeadcountChild * 0.25 +
      dropoutSecondary * 0.25 +
      (100 - femaleLiteracy) * 0.2
    );

    // Normalize to 0-100 scale
    riskScore = Math.max(0, Math.min(100, riskScore));
    
    setPredictedRiskScore(riskScore);

    // Find closest district
    const closest = mockDistrictData.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.riskScore - riskScore);
      const currDiff = Math.abs(curr.riskScore - riskScore);
      return prevDiff < currDiff ? prev : curr;
    });

    setClosestDistrict(closest);
  };

  const getLocationColor = (type: string) => {
    switch (type) {
      case "critical": return "bg-red-500";
      case "moderate": return "bg-yellow-500";
      case "center": return "bg-hope-green";
      case "program": return "bg-blue-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden" data-testid="interactive-map">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-4 items-center justify-between">
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
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm" data-testid="legend-low">Low Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm" data-testid="legend-center">Distribution Center</span>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowRiskForm(!showRiskForm)}
            variant="outline"
            size="sm"
          >
            {showRiskForm ? "Hide" : "Risk Assessment"}
          </Button>
        </div>
      </div>

      {/* Risk Assessment Form */}
      {showRiskForm && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <CardTitle className="text-lg mb-4">Risk Assessment Calculator</CardTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="mpi-adult">MPI Headcount (Adult) %</Label>
              <Input
                id="mpi-adult"
                type="number"
                value={riskInputs.mpiHeadcountAdult}
                onChange={(e) => handleRiskInputChange('mpiHeadcountAdult', e.target.value)}
                placeholder="0-100"
                min="0"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="mpi-child">Child Stunting %</Label>
              <Input
                id="mpi-child"
                type="number"
                value={riskInputs.mpiHeadcountChild}
                onChange={(e) => handleRiskInputChange('mpiHeadcountChild', e.target.value)}
                placeholder="0-100"
                min="0"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="dropout">Dropout (Secondary) %</Label>
              <Input
                id="dropout"
                type="number"
                value={riskInputs.dropoutSecondary}
                onChange={(e) => handleRiskInputChange('dropoutSecondary', e.target.value)}
                placeholder="0-100"
                min="0"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="literacy">Female Literacy %</Label>
              <Input
                id="literacy"
                type="number"
                value={riskInputs.femaleLiteracy}
                onChange={(e) => handleRiskInputChange('femaleLiteracy', e.target.value)}
                placeholder="0-100"
                min="0"
                max="100"
              />
            </div>
          </div>
          <Button onClick={calculateRiskScore} className="mt-4">
            Calculate Risk Score
          </Button>
          
          {predictedRiskScore !== null && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">Risk Assessment Results:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Predicted Risk Score:</p>
                  <p className="text-xl font-bold text-red-600">{predictedRiskScore.toFixed(1)}</p>
                </div>
                {closestDistrict && (
                  <div>
                    <p className="text-sm text-gray-600">Closest District:</p>
                    <p className="font-semibold">{closestDistrict.name}, {closestDistrict.state}</p>
                    <p className="text-sm text-gray-600">Actual Risk: {closestDistrict.riskScore.toFixed(1)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Interactive Map */}
      <div className="relative">
        <div 
          ref={mapRef}
          className="h-96 w-full"
          data-testid="map-container"
        />
        
        {/* Location Info Panel */}
        {selectedLocation && (
          <Card className="absolute bottom-4 left-4 max-w-sm z-10" data-testid="location-info-panel">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg" data-testid={`text-location-${selectedLocation.id || selectedLocation.name}`}>
                  {selectedLocation.name}
                </CardTitle>
                <Badge variant={selectedLocation.type === 'critical' ? 'destructive' : 'secondary'}>
                  {selectedLocation.type}
                </Badge>
              </div>
              <CardDescription>{selectedLocation.state}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  Risk Score: <span className="font-semibold text-red-600">{selectedLocation.riskScore?.toFixed(1) || 'N/A'}</span>
                </div>
                {selectedLocation.familiesInNeed && (
                  <div data-testid={`text-families-${selectedLocation.id || selectedLocation.name}`}>
                    Families in Need: <span className="font-semibold text-red-600">{selectedLocation.familiesInNeed.toLocaleString()}</span>
                  </div>
                )}
                {selectedLocation.dailyMealsRequired && (
                  <div data-testid={`text-meals-${selectedLocation.id || selectedLocation.name}`}>
                    Daily Meals Required: <span className="font-semibold text-orange-600">{selectedLocation.dailyMealsRequired.toLocaleString()}</span>
                  </div>
                )}
                {selectedLocation.distributionCenters && (
                  <div data-testid={`text-centers-${selectedLocation.id || selectedLocation.name}`}>
                    Active Distribution Centers: <span className="font-semibold text-hope-green">{selectedLocation.distributionCenters}</span>
                  </div>
                )}
              </div>
              <button className="mt-3 text-hope-green hover:text-green-700 font-semibold text-sm" data-testid={`button-details-${selectedLocation.id || selectedLocation.name}`}>
                View Details →
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
