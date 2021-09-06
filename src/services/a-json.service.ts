import { AJson } from "../entities/a-json.entity";
import { EntityManager } from "@mikro-orm/core";

export { getAJson, saveAJson };

async function getAJson(em: EntityManager, key1: string): Promise<Error | AJson | null> {
    if (!(em instanceof EntityManager))
    return Error("invalid request");
    console.log(key1)
    
    if (!key1 || typeof key1 !== "string")
    return Error("invalid params");
    
    try {
        const aJson = await em.findOne(AJson, { key1 });
        return aJson;
    } catch (ex) {
        if(ex instanceof Error)
        return ex;
        
        return null;
    }
}

// async function saveWeatherData(em: EntityManager, weatherData: Partial<WeatherData>): Promise<Error | WeatherData> {
//     if (!(em instanceof EntityManager))
//         return Error("invalid request");

//     if (!weatherData || typeof weatherData !== "object")
//         return Error("invalid params");

//     try {
//         const weatherDataExists = await em.findOne(WeatherData, { id: weatherData.id });
//         if (weatherDataExists)
//             return Error("item already exists");
//     } catch (ex) {
//         return ex;
//     }

//     const weatherDataModel = new WeatherData({
//         temperature: weatherData.temperature,
//         airHumidity: weatherData.airHumidity,
//     });

//     try {
//         await em.persistAndFlush([weatherDataModel]);
//     } catch (ex) {
//         return ex;
//     }

//     return weatherDataModel;
// }

async function saveAJson(em: EntityManager, aJson: Partial<AJson>): Promise<Error | AJson> {
    if (!(em instanceof EntityManager))
        return Error("invalid request");

    if (!aJson || typeof aJson !== "object" || !aJson.key1)
        return Error("invalid params");

    try {
        const aJsonExists = await em.findOne(AJson, { key1: aJson.key1 });
        if (aJsonExists)
            return Error("item already exists");
    } catch (ex) {
        if(ex instanceof Error)
        return ex;
        
        
    }

    const jsonModel = new AJson({
        key1: aJson.key1,
        "key 2": aJson["key 2"]
    });

    try {
        console.log("here")
        await em.persistAndFlush([jsonModel]);
       
    } catch (ex) {
        if(ex instanceof Error)
        return ex;
    }

    return jsonModel;
}