"use client";
import { useEffect, useState } from "react";

export function useNotifications() {
	const [notificationPermission, setNotificationPermission] = useState(null);

	useEffect(() => {
		// Request permission for notifications
		Notification.requestPermission().then((permission) => {
			setNotificationPermission(permission);
		});
	}, []);

	const showNotification = (title, options) => {
		if (notificationPermission !== "granted") {
			console.log("Notification permission denied");
			return;
		}

		// Check if service workers are supported
		if (!("serviceWorker" in navigator)) {
			console.log("Service workers are not supported");
			return;
		}

		// Check if Push messaging is supported
		if (!("PushManager" in window)) {
			console.log("Push messaging is not supported");
			return;
		}

		// Display the notification
		new Notification(title, options);
	};

	return { showNotification };
}
