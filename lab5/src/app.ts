import express from 'express';
import axios from 'axios';

import LoggerService from "./LoggerService/LoggerService";
// @ts-ignore
import {ConsoleLogger, EventHubsLogger} from "./LoggerService/LoggerStrategy";
// @ts-ignore
import {ICacheService, FetchCacheService} from "./CacheService/CacheService";

const app = express();
const FETCH_URL = (size = 10, page = 1) => 'https://data.cityofnewyork.us/resource/pvqr-7yc4.json?$select=`summons_number`,' +
    '`plate_id`,`registration_state`,`plate_type`,`violation_code`,' +
    '`vehicle_body_type`,`vehicle_make`,`issuing_agency`, `issue_date`, `street_code1`,' +
    '`street_code2`,`street_code3`,`vehicle_expiration_date`,`violation_location`,' +
    '`violation_precinct`,`issuer_precinct`,`issuer_code`,`issuer_command`,`issuer_squad`,' +
    '`violation_time`,`violation_county`,`violation_in_front_of_or_opposite`,`house_number`,' +
    '`street_name`,`date_first_observed`,`law_section`,`sub_division`,`days_parking_in_effect`,' +
    '`from_hours_in_effect`,`to_hours_in_effect`,`vehicle_color`,`unregistered_vehicle`,`vehicle_year`,' +
    '`meter_number`,`feet_from_curb`'
    +`&$limit=${size}&$offset=${page*size}`;

//@ts-ignore
const fetchLoop = async (logger: LoggerService, cacheService: FetchCacheService) => {
    const size = 50;
    for (let i = 1; i <= 1; i++) {
        let response = await axios.get(FETCH_URL(size, i));
        for (const item of response.data) {
            try {
                 const key = item.summons_number;
                 await cacheService.cache(key, 'start');
                await logger.log(item);
                 await cacheService.cache(key, 'completed');
            } catch (err) {
                console.log(err);
            }
        }
         const resultString = `Cached ${(i-1)*size}-${i*size}`
         await cacheService.cache(resultString, ' completed');
    }
};

const main = async () => {
    const hubsLogger = new EventHubsLogger();
    const logger = new LoggerService(hubsLogger);
     const cacheService = new FetchCacheService();
     await fetchLoop(logger, cacheService);
    await hubsLogger.disconnect();
}

main();

export default app;
