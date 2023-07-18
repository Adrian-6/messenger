import Pusher from "pusher-js"

export const pusherClient = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
    cluster: import.meta.env.VITE_PUSHER_CLUSTER,
    userAuthentication: {
        transport: "jsonp",
        endpoint: import.meta.env.VITE_API_URL,
    },
})