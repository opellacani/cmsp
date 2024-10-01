const cookie = JSON.parse(document.cookie.split("; ").find((row) => row.startsWith("device_data="))?.split("=")[1]);
