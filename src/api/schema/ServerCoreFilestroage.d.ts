
declare namespace ServerCoreFilestroage {

    interface CreateOSSConfigCommand {
        ossVendor: OssVendor;
        endpoint: string;
        bucket: string;
        accessKeyID: string;
        accessKeySecret: string;
        region: string;
        signExpiration: number;
        roleArn: string;
    }

    interface GetOSSAuthCommandQuery {
        ossVendor: OssVendor | null;
    }

    interface GetOSSConfigCommandPathParams {
        ossConfigID: string;
    }

    interface ListEnableOSSOauthInfoCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        ossVendor?: OssVendor | null;
    }

    interface ListEnableOSSOauthInfoCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        ossVendor?: OssVendor | null;
    }

    interface ListEnableOSSOauthInfoCommandResult {
        list: OssInfo[] | null;
        total: number;
        query: ListEnableOSSOauthInfoCommand;
    }

    interface ListOSSConfigCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        ossVendor?: OssVendor | null;
        ossStatus?: OSSStatus | null;
    }

    interface ListOSSConfigCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        ossVendor?: OssVendor | null;
        ossStatus?: OSSStatus | null;
    }

    interface ListOSSConfigResult {
        list: OssConfig[] | null;
        total: number;
        query: ListOSSConfigCommand;
    }

    interface OssConfig {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        ossVendor: OssVendor;
        ossStatus: OSSStatus;
        endpoint: string;
        bucket: string;
        accessKeyID: string;
        accessKeySecret: string;
        region: string;
        signExpiration: number;
        roleArn: string;
        operator: string;
        operatorID: string;
    }

    interface OssInfo {
        bucket: string;
        endpoint: string;
        accessKeyID: string;
        accessKeySecret: string;
        securityToken: string;
        region: string;
        expirationTime: number;
    }

    interface UpdateOSSConfigCommandPathParams {
        ossConfigID: string;
    }

    interface UpdateOSSConfigCommandWithoutPath {
        ossVendor?: OssVendor | null;
        ossStatus?: OSSStatus | null;
        endpoint?: string | null;
        accessKeyID?: string | null;
        accessKeySecret?: string | null;
        region?: string | null;
        signExpiration?: number | null;
        roleArn: string | null;
        bucket: string | null;
    }

    interface UploadFileApiResult {
        fileURL: string;
    }

    interface UploadFileCommandPathParams {
        userID: string;
    }

    // 1: 禁用, 2: 开启
    type OSSStatus = 1 | 2;

    // aliyun: aliyun, tencent: tencent, aws: aws
    type OssVendor = 'aliyun' | 'tencent' | 'aws';

}
