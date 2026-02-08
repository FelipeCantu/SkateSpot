"use client";

import { useState, useEffect } from "react";

interface GeolocationState {
    position: [number, number] | null;
    error: string | null;
    loading: boolean;
}

export function useGeolocation(): GeolocationState {
    const [state, setState] = useState<GeolocationState>({
        position: null,
        error: null,
        loading: true,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setState({ position: null, error: "Geolocation not supported", loading: false });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setState({
                    position: [pos.coords.latitude, pos.coords.longitude],
                    error: null,
                    loading: false,
                });
            },
            (err) => {
                setState({
                    position: null,
                    error: err.message,
                    loading: false,
                });
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
    }, []);

    return state;
}
