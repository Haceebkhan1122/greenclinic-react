const APP_ID = import.meta.env.VITE_REACT_APP_AGORA_APP_ID;

export const acquireApi = `https://api.agora.io/v1/apps/${APP_ID}/cloud_recording/acquire`;

export const startApi = (resourceId) => {
    return `https://api.agora.io/v1/apps/${APP_ID}/cloud_recording/resourceid/${resourceId}/mode/mix/start`;
}

export const stopApi = (resourceId, sid) => {
    return `https://api.agora.io/v1/apps/${APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/stop`
}