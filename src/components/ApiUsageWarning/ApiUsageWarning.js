import React, { useState, useEffect } from 'react';
import './ApiUsageWarning.css';

const ApiUsageWarning = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [apiCallCount, setApiCallCount] = useState(0);

    useEffect(() => {
        // Get today's date in YYYY-MM-DD format
        const todayKey = new Date().toISOString().split('T')[0];

        // Get and parse API call count from localStorage
        const countData = localStorage.getItem('api_call_count') || '{}';
        const counts = JSON.parse(countData);
        const todayCount = counts[todayKey] || 0;

        setApiCallCount(todayCount);

        // Check every minute for updates
        const interval = setInterval(() => {
            const updatedCountData = localStorage.getItem('api_call_count') || '{}';
            const updatedCounts = JSON.parse(updatedCountData);
            const updatedTodayCount = updatedCounts[todayKey] || 0;
            setApiCallCount(updatedTodayCount);
        }, 60000);

        // Clean up the interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const closeWarning = () => {
        setIsVisible(false);

        // Remember that the user closed the warning for 24 hours
        localStorage.setItem('warning_closed', Date.now().toString());
    };

    // If warning was closed less than 24 hours ago, don't show it
    useEffect(() => {
        const warningClosedTimestamp = localStorage.getItem('warning_closed');
        if (warningClosedTimestamp) {
            const hoursSinceClosed = (Date.now() - parseInt(warningClosedTimestamp)) / (1000 * 60 * 60);
            if (hoursSinceClosed < 24) {
                setIsVisible(false);
            }
        }
    }, []);

    // Don't render if not visible or if API call count is very low
    if (!isVisible || apiCallCount < 5) {
        return null;
    }

    // Show warning banner with progressively more urgent styling as call count increases
    let warningLevel = 'low';
    if (apiCallCount > 500) warningLevel = 'high';
    else if (apiCallCount > 200) warningLevel = 'medium';

    return (
        <div className={`api-usage-warning ${warningLevel}`}>
            <div className="warning-content">
                <span className="warning-icon">⚠️</span>
                <div className="warning-text">
                    <p><strong>This is a portfolio project using the OpenWeatherMap free API plan.</strong></p>
                    <p>To avoid exceeding API limits, please limit your searches. API calls today: {apiCallCount}</p>
                </div>
                <button className="close-button" onClick={closeWarning}>×</button>
            </div>
        </div>
    );
};

export default ApiUsageWarning;