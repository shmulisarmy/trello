export const onServer = typeof window === "undefined";
export const onClient = !onServer;