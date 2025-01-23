import Link from "next/link";
import { MapPin, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hospital } from "@/types";
export function HospitalCard(hospital: Hospital): React.JSX.Element {
    return <Link key={hospital.id} href={`/hospitals/${hospital.id}`}>
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle>{hospital.name}</CardTitle>
                <div className="flex gap-2">
                    <Badge variant={hospital.type === "PUBLIC" ? "default" : "secondary"}>
                        {hospital.type}
                    </Badge>
                    <Badge variant="outline">{hospital.level}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{hospital.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>
                            {hospital.availableIcuBeds} of {hospital.icuBeds} ICU beds available
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    </Link>;
}

