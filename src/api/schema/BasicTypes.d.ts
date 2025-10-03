
declare namespace BasicTypes {

    interface DefaultBaseHeader {
        Authorization?: string;
        'User-Agent'?: string;
        'Accept-Language'?: string;
        'X-Locale'?: Locale;
        'X-Timestamp'?: number;
        'X-Request-Id'?: string;
        'X-Device-Id'?: string;
        'X-Real-IP'?: string;
        'X-IP-Country'?: string;
        'X-IP-Region'?: string;
        'X-IP-City'?: string;
        'X-Sign'?: string;
    }

    interface DefaultResponseWrapper<T> {
        newToken(userId: any, newToken: any): unknown;
        success: boolean;
        data?: T;
        error?: ErrorDetails;
    }

    interface ErrorDetails {
        code: number;
        message: string;
        type: ErrType;
    }


    type Currency = 'USD' | 'EUR' | 'JPY' | 'GBP' | 'CNY' | 'INR' | 'BRL' | 'RUB' | 'CAD' | 'AUD' | 'ZAR' | 'MXN' | 'SGD' | 'NZD' | 'CHF' | 'HKD' | 'PHP';


    type Direction = 'asc' | 'desc';


    type ErrType = 'internal' | 'not_found' | 'validation' | 'authentication' | 'authorization' | 'rate_limit' | 'network' | 'timeout' | 'concurrency';


    type Locale = '' | 'zh-CN' | 'zh-TW' | 'zh-HK' | 'en-US' | 'en-GB' | 'en-AU' | 'en-CA' | 'en-IN' | 'fr-FR' | 'fr-CA' | 'de-DE' | 'fil-PH' | 'de-CH' | 'es-ES' | 'es-MX' | 'es-US' | 'ja-JP' | 'ko-KR' | 'ru-RU' | 'pt-BR' | 'pt-PT' | 'ar-SA' | 'ar-EG' | 'hi-IN' | 'it-IT' | 'it-CH' | 'nl-NL' | 'nl-BE' | 'pl-PL' | 'vi-VN' | 'th-TH' | 'el-GR' | 'tr-TR' | 'sv-SE';


    type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';


    type Platform = 'pc' | 'android' | 'ios';

}
