import { createContext, useState, useContext, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within LocationProvider');
    }
    return context;
};

export const LocationProvider = ({ children }) => {
    const [selectedCity, setSelectedCity] = useState(
        localStorage.getItem('selectedCity') || ''
    );
    const [selectedArea, setSelectedArea] = useState(
        localStorage.getItem('selectedArea') || ''
    );

    useEffect(() => {
        if (selectedCity) {
            localStorage.setItem('selectedCity', selectedCity);
        }
    }, [selectedCity]);

    useEffect(() => {
        if (selectedArea) {
            localStorage.setItem('selectedArea', selectedArea);
        }
    }, [selectedArea]);

    const value = {
        selectedCity,
        selectedArea,
        setSelectedCity,
        setSelectedArea,
    };

    return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};
