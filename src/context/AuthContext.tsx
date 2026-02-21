"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { decodeTokenUnsafe } from "@/lib/jwt";
import type { JWTPayload, Role } from "@/types/rbac";

interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: Role;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (userData: AuthUser, accessToken: string) => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state from token on mount
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = getAccessToken();
                if (token) {
                    const decoded = decodeTokenUnsafe(token);
                    if (decoded) {
                        setUser({
                            id: decoded.userId,
                            email: decoded.email,
                            name: decoded.name,
                            role: decoded.role,
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to initialize auth:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = useCallback((userData: AuthUser, accessToken: string) => {
        setUser(userData);
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("user", JSON.stringify(userData));
    }, []);

    const logout = useCallback(async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("user");
        }
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const token = getAccessToken();
            if (token) {
                const decoded = decodeTokenUnsafe(token);
                if (decoded) {
                    setUser({
                        id: decoded.userId,
                        email: decoded.email,
                        name: decoded.name,
                        role: decoded.role,
                    });
                }
            }
        } catch (error) {
            console.error("Failed to refresh user:", error);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: user !== null,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// Helper function to get access token
function getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("accessToken");
}
