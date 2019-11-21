import { ModelsInterface } from './ModelsInsterface';
export interface BaseModelInterface{

    prototype?
    associate?(models: ModelsInterface): void
}