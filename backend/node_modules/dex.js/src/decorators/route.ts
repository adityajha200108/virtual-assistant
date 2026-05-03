import { HttpMethod } from '../core/createApp';
import 'reflect-metadata';

export function RoutePath(crud: HttpMethod, path: string, middlewares: any[] = []) {
    return function (target: any, propertyKey: string | symbol): void {
        const routes = Reflect.getMetadata('routes', target) || [];

        routes.push({
            method: crud,
            path,
            handler: propertyKey, 
            middlewares
        });

        Reflect.defineMetadata('routes', routes, target);
    };
}
