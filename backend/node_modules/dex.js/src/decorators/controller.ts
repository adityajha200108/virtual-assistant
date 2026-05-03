const controllersMeta: any[] = [];

export function ControleRoute(baseRoutePath: string) {
    return function (controller: any) {
        controllersMeta.push({
            controller: controller,
            baseRoutePath: baseRoutePath,
            routes: Reflect.getMetadata('routes', controller.prototype) || [],
        });

        Reflect.defineMetadata('baseRoutePath', baseRoutePath, controller);
    };
}
