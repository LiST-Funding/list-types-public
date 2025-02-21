import { BaseDistrabutionTableTypes } from "./enums";

export type BaseDistrabutionTableTypesInterface<T> = {
    [key in BaseDistrabutionTableTypes]: T;
};
