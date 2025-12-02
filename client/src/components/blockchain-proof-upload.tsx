
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Upload } from "lucide-react";

export function BlockchainProofUpload() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [deliveryId, setDeliveryId] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [temperature, setTemperature] = useState("");
    const [notes, setNotes] = useState("");

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/blockchain/upload-proof", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ngoId: "current-ngo-id", // In real app, get from user context
                    deliveryId,
                    photoUrl,
                    temperature,
                    notes
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Upload failed");
            }

            toast({
                title: "Proof Uploaded to Blockchain",
                description: `Block Hash: ${data.block.hash.substring(0, 15)}...`,
            });

            // Reset form
            setDeliveryId("");
            setPhotoUrl("");
            setTemperature("");
            setNotes("");

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <ShieldCheck className="mr-2 h-5 w-5 text-green-600" />
                    Secure Delivery Proof
                </CardTitle>
                <CardDescription>
                    Upload delivery evidence to the immutable blockchain ledger.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="delivery-id">Delivery ID</Label>
                        <Input
                            id="delivery-id"
                            placeholder="DEL-12345"
                            value={deliveryId}
                            onChange={(e) => setDeliveryId(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="photo-url">Photo Evidence URL</Label>
                        <Input
                            id="photo-url"
                            placeholder="https://..."
                            value={photoUrl}
                            onChange={(e) => setPhotoUrl(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="temp">Food Temp (°C)</Label>
                            <Input
                                id="temp"
                                placeholder="65"
                                value={temperature}
                                onChange={(e) => setTemperature(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Input
                                id="notes"
                                placeholder="Delivered safely"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                        {isLoading ? (
                            "Hashing & Uploading..."
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" /> Upload Proof
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
