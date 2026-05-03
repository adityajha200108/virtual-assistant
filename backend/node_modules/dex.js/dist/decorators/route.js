import 'reflect-metadata';
export function RoutePath(crud, path, middlewares = []) {
    return function (target, propertyKey) {
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
//# sourceMappingURL=route.js.map