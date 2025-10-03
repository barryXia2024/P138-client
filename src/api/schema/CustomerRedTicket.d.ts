
declare namespace CustomerRedTicket {

    interface Class2 {
        list: Class3[] | null;
        maxBlack: number;
        maxRed: number;
        odds: number;
        rate: string;
    }

    interface Class3 {
        serialNumber: string;
        matchup: string;
        predict: string;
        sp: number;
        result: string;
    }

    interface ListRedTicketCommand {
        bf: string[] | null;
        bqc: string[] | null;
        events: string;
        rq: string[] | null;
        sessions: number;
        spf: string[] | null;
        zjq: string[] | null;
    }

    interface ListRedTicketResult {
        code: number;
        msg: any;
        data: Class2;
    }

}
