"use client";
import { useEffect, useState } from 'react';

export function useNotifications() {
    const [notificationPermission, setNotificationPermission] = useState(null);

    useEffect(() => {
        // Request permission for notifications
        Notification.requestPermission().then(permission => {
            setNotificationPermission(permission);
        });
    }, []);

    const showNotification = (title, options) => {
        if (notificationPermission !== 'granted') {
            console.log('Notification permission denied');
            return;
        }

        // Display the notification
        new Notification(title, options);
    };

    return { showNotification };
}
