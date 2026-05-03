import { HttpMethod } from '../core/createApp';
import 'reflect-metadata';
export declare function RoutePath(crud: HttpMethod, path: string, middlewares?: any[]): (target: any, propertyKey: string | symbol) => void;
