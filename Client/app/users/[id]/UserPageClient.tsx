"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { deleteUser, updateUser } from "@/utils/fakeBackend";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function UserPageClient({ user: initialUser }: { user: User }) {

    const { user: logged_in_user } = useAuth();
    const [user, setUser] = useState<User>(initialUser);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast()



    async function handleUserApproval(isVerified: boolean) {
        try {
            setLoading(true);
            await updateUser(user?.id || "", { isVerified });
            setUser((prev) => (prev ? { ...prev, isVerified } : prev));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleUserDeletion() {
        try {
            setLoading(true);
            await deleteUser(user.id)
            toast({ title: "User deleted successfully!", description: "success", style: { backgroundColor: 'green', color: 'white' } })
            window.history.back()
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            toast({
                title: "Error",
                description: "Failed to delete User. Please try again.",
                style: { backgroundColor: 'red', color: 'white' }
            })
        }
    }

    if (!user) {
        return (
            <div className="flex h-screen justify-center items-center">
                <Spinner />
            </div>
        );
    }
    if (logged_in_user?.id == user.id) {
        return (
            <div className="flex h-screen justify-center items-center">
                <h1>Unauthorized</h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-evenly m-4">
                <Button variant="secondary" onClick={() => window.history.back()}>
                    Back
                </Button>
                <Dialog >
                    <DialogTrigger asChild>
                        <Button variant="destructive">Delete</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="destructive" onClick={handleUserDeletion}>Confirm</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>{user.name}</CardTitle>
                        <Badge>{user.role}</Badge>
                        {user.isVerified ? <Badge>{"Verified"}</Badge> : <Badge variant={"destructive"}>{"Unverified"}</Badge>}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p>{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Member Since</p>
                            <p>{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                </CardContent>
            </Card>

            {loading ? (
                <div className="flex justify-center mt-4">
                    <Spinner />
                </div>
            ) : (
                <div className="flex justify-end mt-4">
                    <button
                        className={`mr-2 px-4 py-2 ${user.isVerified ? "bg-red-500" : "bg-green-500"} text-white rounded`}
                        onClick={() => handleUserApproval(!user.isVerified)}
                    >
                        {user.isVerified ? "Disapprove" : "Approve"}
                    </button>
                </div>
            )}

        </div>
    );
}
