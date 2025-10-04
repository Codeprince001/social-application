import arcjet, {tokenBucket, shield, detectBot} from "arcjet"
import { ENV } from "./env.js"

export const aj = arcjet({
    key: ENV.ARCJET_KEY,
    characteristics: ["ip.src"],


    rules: [
        shield({mode: "LIVE"}),

        detectBot({
            mode: "LIVE",
            allow: ["CATEGORY:SEARCH_ENGINE"]
        }),

        tokenBucket({
            mode: "LIVE",
            bucketSize: 20,
            refillRate: 20,
            interval: 10,
            capacity: 30,
        })
    ]
})