import { RedisConfig } from "../../config/redis.config";

export class RedisService {
    /**
     * Store a value in Redis with type safety
     *  @Params: key:string
     *  @Params: T:Generic
     */
    public static async setValue<T>(
        key: string,
        value: T,
        ttlSeconds?: number
    ): Promise<"OK" | null> {
        const redis = await RedisConfig.getInstance();
        if (ttlSeconds) {
            return await redis.set(
                key,
                JSON.stringify(value),
                "EX",
                ttlSeconds
            );
        }
        return await redis.set(key, JSON.stringify(value));
    }

    /**
     * Get a value from Redis with type safety
     * @Params: key:string
     */
    public static async getValue<T>(key: string): Promise<T | null> {
        const redis = await RedisConfig.getInstance();
        const result = await redis.get(key);
        return result ? (JSON.parse(result) as T) : null;
    }

    /**
     * Delete a key from Redis
     * @Params: key:string
     */
    public static async deleteKey(key: string): Promise<number> {
        const redis = await RedisConfig.getInstance();
        return await redis.del(key);
    }
}
