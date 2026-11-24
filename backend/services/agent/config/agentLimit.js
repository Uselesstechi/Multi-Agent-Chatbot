import redis from "../../../shared/redis/redis.js"

const Limits = {
    chat: 20,
    coding: 5,
    pdf: 5,
    ppt: 5,
    image: 5,
    search: 5
}

export const checkAgentLimit = async (userId, agent) => {
    const max = Limits[agent] || Limits["chat"] // getting the max limit for the agent, if not found then default to chat limit
    const key = `rate:${userId}:${agent}` // creating a unique key for the user and agent
    const count = await redis.incr(key) // incrementing the count for the key in redis
    if (count == 1) await redis.expire(key, 60) // setting the expiration time for the key to 60 seconds if it's the first time the key is created

    const ttl = await redis.ttl(key) // getting the time to live for the key in redis

    if (count > max) { // if the count exceeds the max limit, throw an error with the remaining time and retry after time
        const minutes = Math.floor(ttl / 60)
        const seconds = (ttl % 60)
        const time = minutes > 0 ? ` ${minutes}m : ${seconds}s` : `${seconds}s` // formatting the time to display in minutes and seconds

        const error = new Error(`Rate limit exceeded for ${agent}.`);
        error.status = 429
        error.data = {
            success: false,
            agent,
            limit: max,
            remainingTime: ttl,
            retryAfter: time,
            message: `You have reached the ${agent} limit (${max} requests/minute). Try again in ${time}.`
        }
        throw error // throwing the error to be handled by the calling function
    }

    return {
        remaining: max - count, // if no error, return the remaining limit for the agent
        limit: max
    }
}