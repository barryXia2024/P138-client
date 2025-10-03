
declare namespace FollowHallDeclaration {

    interface CreateDeclarationCommand {
        label: string;
        value: string;
    }

    interface CreateDeclarationResult {
        declarationID: string;
    }

    interface DeleteDeclarationCommandPathParams {
        declarationID: string;
    }

    interface DeleteDeclarationResult {
        declarationID: string;
    }

    interface GetDeclarationCommandPathParams {
        declarationID: string;
    }

    interface ListDeclarationCommand {
        current?: number;
        pageSize?: number;
        sort?: Sort;
        direction?: BasicTypes.Direction;
    }

    interface ListDeclarationCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: Sort;
        direction?: BasicTypes.Direction;
        label: string | null;
        value: string | null;
    }

    interface ListDeclarationResult {
        list: PostsOrderDeclaration[] | null;
        total: number;
        query: ListDeclarationCommand;
    }

    interface PostsOrderDeclaration {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        label: string;
        value: string;
        createBy: string;
        updateBy: string;
        deleteAt: number;
    }

    interface UpdateDeclarationCommandPathParams {
        declarationID: string;
    }

    interface UpdateDeclarationCommandWithoutPath {
        label: string | null;
        value: string | null;
    }

    interface UpdateDeclarationResult {
        declarationID: string;
    }


    type Sort = 'createdAt';

}
