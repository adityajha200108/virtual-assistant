const controllersMeta = [];
export function ControleRoute(baseRoutePath) {
    return function (controller) {
        controllersMeta.push({
            controller: controller,
            baseRoutePath: baseRoutePath,
            routes: Reflect.getMetadata('routes', controller.prototype) || [],
        });
        Reflect.defineMetadata('baseRoutePath', baseRoutePath, controller);
    };
}
//# sourceMappingURL=controller.js.map