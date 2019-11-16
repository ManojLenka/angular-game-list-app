export interface IGame {
    Rank: number;
    Name: string;
    Year: number;
    Genre: string;
    Global_Sales: number;
    Platform: string;
    Publisher: string;
}

export interface IGameTable {
    key: string;
    value: string | number;
}

export interface IPageInfo {
    pageSize: number;
    pageIndex: number;
}