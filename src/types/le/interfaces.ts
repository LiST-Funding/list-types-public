import { type } from "os";
import { BaseDistrabutionTableTypes, Gender, SmokeStatus, Round } from "./enums";

export interface LeDataRequest extends BaseLeDataRequest {
    type: BaseDistrabutionTableTypes,
    multiplier: number,
}

export interface leMultiDataRequest {
    1: LeDataRequest,
    2: LeDataRequest,
}

export interface BaseLeDataRequest {
    gender: Gender,
    age: number,
    smoker?: SmokeStatus
}

export interface PredictionDataRequest extends BaseLeDataRequest {
    prediction: number
    type?: BaseDistrabutionTableTypes,
}


export interface LeMonthData {
    lives: number,
    deaths: number,
    deathRatePC: number,
    mortalityRate: number
}

export interface LeGeneralData {
    monthData: LeMonthData[],
    average: number | undefined,
    median: number
}

export interface LePdfData {
    median : number
    average : number
    lives: number[]
    projectedDeath: number[]
    livesTable: number[]
    projectedDeathTable: number[]
}

export interface BaseDistrabutionTableOptions {
    round: Round.down;
}

export interface BaseDistrabutionTableFactory {
    getTable(leDataReq: LeDataRequest, options?: BaseDistrabutionTableOptions): number[];
}

export interface BaseDistrabutionTable {
    getTable(dateReq: BaseLeDataRequest): number[];
}
