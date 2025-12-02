
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Link as LinkIcon, Clock } from "lucide-react";

interface Block {
    index: number;
    timestamp: number;
    data: {
        ngoId: string;
        deliveryId: string;
        photoUrl: string;
        temperature?: string;
        notes?: string;
    };
    hash: string;
    previousHash: string;
}

export default function BlockchainVerification() {
    const [chain, setChain] = useState<Block[]>([]);
    const [isValid, setIsValid] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/blockchain/chain")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setChain(data.chain);
                    setIsValid(data.isValid);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                        <ShieldCheck className="mr-3 h-8 w-8 text-green-600" />
                        Blockchain Verification Ledger
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Transparent, immutable record of all food deliveries and safety checks.
                    </p>
                    <div className="mt-4">
                        <Badge variant={isValid ? "default" : "destructive"} className="text-md py-1 px-4">
                            {isValid ? "✅ Blockchain Integrity Verified" : "❌ Blockchain Compromised"}
                        </Badge>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center">Loading ledger...</div>
                ) : (
                    <div className="space-y-6">
                        {chain.map((block) => (
                            <Card key={block.hash} className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
                                <CardHeader className="bg-gray-50/50 pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="outline">Block #{block.index}</Badge>
                                            <span className="text-xs font-mono text-gray-500 truncate max-w-[200px]" title={block.hash}>
                                                Hash: {block.hash}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Clock className="mr-1 h-3 w-3" />
                                            {new Date(block.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold text-sm text-gray-900 mb-2">Delivery Data</h4>
                                            <div className="space-y-1 text-sm">
                                                <div><span className="font-medium">Delivery ID:</span> {block.data.deliveryId}</div>
                                                <div><span className="font-medium">NGO ID:</span> {block.data.ngoId}</div>
                                                {block.data.temperature && (
                                                    <div><span className="font-medium">Temperature:</span> {block.data.temperature}°C</div>
                                                )}
                                                {block.data.notes && (
                                                    <div><span className="font-medium">Notes:</span> {block.data.notes}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm text-gray-900 mb-2">Evidence</h4>
                                            {block.data.photoUrl === 'genesis' ? (
                                                <div className="text-gray-400 italic">Genesis Block - No Evidence</div>
                                            ) : (
                                                <a
                                                    href={block.data.photoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline text-sm flex items-center"
                                                >
                                                    <LinkIcon className="mr-1 h-3 w-3" /> View Photo Proof
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
