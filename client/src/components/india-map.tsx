import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface IndiaMapProps {
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
  properties?: any;
}

export function IndiaMap({ onLocationSelect }: IndiaMapProps) {
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
  const [userInputs, setUserInputs] = useState<RiskAssessmentInput>({
    mpiHeadcountAdult: 0,
    mpiHeadcountChild: 0,
    dropoutSecondary: 0,
    femaleLiteracy: 0,
  });
  const [isCalculating, setIsCalculating] = useState(false);
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
    },
    {
      name: "Jaipur",
      state: "Rajasthan",
      riskScore: 48.2,
      coordinates: [26.9124, 75.7873],
      type: "moderate"
    },
    {
      name: "Lucknow",
      state: "Uttar Pradesh",
      riskScore: 61.5,
      coordinates: [26.8467, 80.9462],
      type: "critical"
    },
    {
      name: "Patna",
      state: "Bihar",
      riskScore: 72.8,
      coordinates: [25.5941, 85.1376],
      type: "critical"
    },
    {
      name: "Bhopal",
      state: "Madhya Pradesh",
      riskScore: 55.3,
      coordinates: [23.2599, 77.4126],
      type: "moderate"
    }
  ];

  // Simplified India boundary coordinates
  const indiaBoundary = [
    [6.0, 68.0], // Southwest
    [37.0, 97.0]  // Northeast
  ];

  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = L.map(mapRef.current).setView([22.9734, 78.6569], 5);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(newMap);

      // Add India boundary rectangle
      L.rectangle(indiaBoundary, {
        color: "#3388ff",
        weight: 2,
        fillOpacity: 0.05,
        fillColor: "#3388ff"
      }).addTo(newMap);

      // Add district markers with enhanced styling
      mockDistrictData.forEach((district) => {
        const markerColor = getDistrictColor(district.type);
        const markerSize = getMarkerSize(district.riskScore);
        
        const marker = L.circleMarker(district.coordinates, {
          radius: markerSize,
          fillColor: markerColor,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(newMap);

        // Enhanced popup content
        marker.bindPopup(`
          <div class="p-3 min-w-[200px]">
            <h3 class="font-bold text-lg mb-2">${district.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${district.state}</p>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm font-semibold">Risk Score:</span>
              <span class="text-lg font-bold text-red-600">${district.riskScore.toFixed(1)}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">Type:</span>
              <span class="px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeClass(district.type)}">${district.type}</span>
            </div>
          </div>
        `);

        marker.on('click', () => {
          setSelectedLocation(district);
          onLocationSelect?.(district);
          
          // Center map on selected district
          newMap.setView(district.coordinates, 8);
        });

        // Add hover effect
        marker.on('mouseover', function() {
          this.setRadius(markerSize + 2);
        });
        
        marker.on('mouseout', function() {
          this.setRadius(markerSize);
        });
      });

      // Add legend
      addLegend(newMap);

      setMap(newMap);
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map, onLocationSelect]);

  const addLegend = (mapInstance: L.Map) => {
    const legend = L.control({ position: 'bottomright' });
    
    legend.onAdd = function() {
      const div = L.DomUtil.create('div', 'info legend bg-white p-3 rounded-lg shadow-lg border');
      div.style.backgroundColor = 'white';
      div.style.padding = '10px';
      div.style.borderRadius = '8px';
      div.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      div.style.border = '1px solid #e5e7eb';
      
      const grades = [
        { color: '#ef4444', label: 'Critical Need (70-100)' },
        { color: '#f59e0b', label: 'Moderate Need (40-69)' },
        { color: '#10b981', label: 'Low Risk (0-39)' }
      ];
      
      div.innerHTML = '<h4 class="font-bold mb-2">Risk Levels</h4>';
      grades.forEach(grade => {
        div.innerHTML += `
          <div class="flex items-center gap-2 mb-1">
            <div class="w-4 h-4 rounded-full" style="background-color: ${grade.color}"></div>
            <span class="text-sm">${grade.label}</span>
          </div>
        `;
      });
      
      return div;
    };
    
    legend.addTo(mapInstance);
  };

  const getDistrictColor = (type: string) => {
    switch (type) {
      case "critical": return "#ef4444";
      case "moderate": return "#f59e0b";
      case "low": return "#10b981";
      case "center": return "#3b82f6";
      default: return "#6b7280";
    }
  };

  const getMarkerSize = (riskScore: number) => {
    if (riskScore >= 70) return 12;
    if (riskScore >= 40) return 10;
    return 8;
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "critical": return "bg-red-100 text-red-800";
      case "moderate": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      case "center": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
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

  const handleUserInputChange = (field: keyof RiskAssessmentInput, value: string) => {
    setUserInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const calculateRiskScore = () => {
    // Enhanced risk calculation based on your Python code
    const { mpiHeadcountAdult, mpiHeadcountChild, dropoutSecondary, femaleLiteracy } = riskInputs;
    
    // Weighted risk calculation with normalization
    let riskScore = (
      mpiHeadcountAdult * 0.3 +
      mpiHeadcountChild * 0.25 +
      dropoutSecondary * 0.25 +
      (100 - femaleLiteracy) * 0.2
    );

    // Normalize to 0-100 scale
    riskScore = Math.max(0, Math.min(100, riskScore));
    
    setPredictedRiskScore(riskScore);

    // Find closest district with enhanced logic
    const closest = mockDistrictData.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.riskScore - riskScore);
      const currDiff = Math.abs(curr.riskScore - riskScore);
      return prevDiff < currDiff ? prev : curr;
    });

    setClosestDistrict(closest);

    // Highlight closest district on map
    if (map && closest) {
      map.setView(closest.coordinates, 8);
    }
  };

  const calculateUserRiskScore = async () => {
    setIsCalculating(true);
    
    // Simulate ML processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Enhanced risk calculation based on your Python code
    const { mpiHeadcountAdult, mpiHeadcountChild, dropoutSecondary, femaleLiteracy } = userInputs;
    
    // Weighted risk calculation with normalization (same as Python code)
    let riskScore = (
      mpiHeadcountAdult * 0.3 +
      mpiHeadcountChild * 0.25 +
      dropoutSecondary * 0.25 +
      (100 - femaleLiteracy) * 0.2
    );

    // Normalize to 0-100 scale
    riskScore = Math.max(0, Math.min(100, riskScore));
    
    setPredictedRiskScore(riskScore);

    // Find closest district with enhanced logic
    const closest = mockDistrictData.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.riskScore - riskScore);
      const currDiff = Math.abs(curr.riskScore - riskScore);
      return prevDiff < currDiff ? prev : curr;
    });

    setClosestDistrict(closest);

    // Highlight closest district on map with animation
    if (map && closest) {
      // Add a pulsing effect to the closest district
      const marker = L.circleMarker(closest.coordinates, {
        radius: 15,
        fillColor: '#ff0000',
        color: '#fff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);
      
      // Animate the marker
      let pulsing = true;
      const pulseInterval = setInterval(() => {
        if (pulsing) {
          marker.setRadius(20);
          pulsing = false;
        } else {
          marker.setRadius(15);
          pulsing = true;
        }
      }, 500);

      // Center map on the district
      map.setView(closest.coordinates, 8);
      
      // Remove pulsing after 5 seconds
      setTimeout(() => {
        clearInterval(pulseInterval);
        map.removeLayer(marker);
      }, 5000);
    }
    
    setIsCalculating(false);
    // Don't hide the form - keep it visible
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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden" data-testid="india-map">
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
      
      {/* User Input Form - Always Visible Under Map */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">India Hunger Risk Assessment</CardTitle>
            <CardDescription className="text-base">
              Enter the following data to predict the risk score and find the closest matching district in India
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="user-mpi-adult" className="text-sm font-medium">MPI Headcount (Adult) %</Label>
                <Input
                  id="user-mpi-adult"
                  type="number"
                  value={userInputs.mpiHeadcountAdult}
                  onChange={(e) => handleUserInputChange('mpiHeadcountAdult', e.target.value)}
                  placeholder="0-100"
                  min="0"
                  max="100"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="user-mpi-child" className="text-sm font-medium">Child Stunting %</Label>
                <Input
                  id="user-mpi-child"
                  type="number"
                  value={userInputs.mpiHeadcountChild}
                  onChange={(e) => handleUserInputChange('mpiHeadcountChild', e.target.value)}
                  placeholder="0-100"
                  min="0"
                  max="100"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="user-dropout" className="text-sm font-medium">Dropout (Secondary) %</Label>
                <Input
                  id="user-dropout"
                  type="number"
                  value={userInputs.dropoutSecondary}
                  onChange={(e) => handleUserInputChange('dropoutSecondary', e.target.value)}
                  placeholder="0-100"
                  min="0"
                  max="100"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="user-literacy" className="text-sm font-medium">Female Literacy %</Label>
                <Input
                  id="user-literacy"
                  type="number"
                  value={userInputs.femaleLiteracy}
                  onChange={(e) => handleUserInputChange('femaleLiteracy', e.target.value)}
                  placeholder="0-100"
                  min="0"
                  max="100"
                  className="mt-2"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={calculateUserRiskScore} 
                className="flex-1 h-12 text-lg font-semibold"
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing...
                  </>
                ) : (
                  'Calculate Risk & Find District'
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setUserInputs({
                    mpiHeadcountAdult: 65,
                    mpiHeadcountChild: 45,
                    dropoutSecondary: 35,
                    femaleLiteracy: 55
                  });
                }}
                className="sm:w-auto"
              >
                Load Sample Data
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 text-center bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-1">ML Model Weights:</p>
              <p>MPI Adult (30%) • Child Stunting (25%) • Dropout (25%) • Female Literacy (20%)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Display - Integrated with Form */}
      {predictedRiskScore !== null && closestDistrict && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-blue-900 flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              Risk Assessment Results
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <div className="text-center">
                <p className="text-sm font-medium text-red-800 mb-2">Predicted Risk Score</p>
                <p className="text-3xl font-bold text-red-600">{predictedRiskScore.toFixed(1)}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="text-center">
                <p className="text-sm font-medium text-blue-800 mb-2">Closest Matching District</p>
                <p className="text-lg font-bold text-blue-900">{closestDistrict.name}</p>
                <p className="text-sm text-blue-700">{closestDistrict.state}</p>
                <p className="text-xs text-blue-600 mt-1">Actual Risk: {closestDistrict.riskScore.toFixed(1)}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setPredictedRiskScore(null);
                setClosestDistrict(null);
                setUserInputs({
                  mpiHeadcountAdult: 0,
                  mpiHeadcountChild: 0,
                  dropoutSecondary: 0,
                  femaleLiteracy: 0
                });
              }}
              className="flex-1"
            >
              New Assessment
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                if (map && closestDistrict) {
                  map.setView(closestDistrict.coordinates, 8);
                }
              }}
              className="flex-1"
            >
              View on Map
            </Button>
          </div>
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
