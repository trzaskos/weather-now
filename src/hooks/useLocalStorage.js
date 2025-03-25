import { useState, useEffect } from 'react';

/**
 * Custom hook to persist state in localStorage
 * @param {string} key - The key to store the value under in localStorage
 * @param {any} initialValue - The initial value to use if no value is found in localStorage
 * @returns {Array} - [storedValue, setValue] - Similar to useState return value
 */
const useLocalStorage = (key, initialValue) => {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);

            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error, return initialValue
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that
    // persists the new value to localStorage
    const setValue = (value) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;

            // Save state
            setStoredValue(valueToStore);

            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    // Listen for changes to this localStorage key in other tabs/windows
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === key) {
                try {
                    setStoredValue(JSON.parse(e.newValue || JSON.stringify(initialValue)));
                } catch (error) {
                    console.error(`Error parsing localStorage change for key "${key}":`, error);
                }
            }
        };

        // Add event listener
        window.addEventListener('storage', handleStorageChange);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key, initialValue]);

    return [storedValue, setValue];
};

export default useLocalStorage;