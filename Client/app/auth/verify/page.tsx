import React from 'react';
import { Card, CardContent, CardHeader, CardTitle }  from "@/components/ui/card"

const UnverifiedPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="max-w-md w-full shadow-lg rounded-lg">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-semibold text-red-600">
                        Not Verified
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-gray-700">
                        Your account is not verified. Please wait for approval.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default UnverifiedPage;