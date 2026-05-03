import express from 'express';
import cors from 'cors';
export function createDexApp({ port = 7173, controllers, corsOpt }) {
    const dexApp = express();
    dexApp.use(express.json());
    if (corsOpt) {
        dexApp.use(cors(corsOpt));
    }
    else {
        dexApp.use(cors());
    }
    for (const { Controller, Service, Model } of controllers) {
        const modelInstance = new Model();
        const serviceInstance = new Service(modelInstance);
        const controllerInstance = new Controller(serviceInstance, modelInstance);
        const controllerPrototype = controllerInstance.constructor.prototype;
        const controllerRoutes = Reflect.getMetadata('routes', controllerPrototype) || [];
        const baseRoutePath = Reflect.getMetadata('baseRoutePath', controllerInstance.constructor) || '/';
        for (const route of controllerRoutes) {
            const fullPath = baseRoutePath + route.path;
            const middlewares = route.middleware || [];
            dexApp[route.method](fullPath, ...middlewares, (req, res) => {
                controllerInstance[route.handler].call(controllerInstance, req, res);
            });
            console.log(`✅ [${route.method.toUpperCase()}] ${fullPath}`);
        }
    }
    dexApp.listen(port, () => {
        console.log(`🚀 Dex.js server on port ${port}`);
    }).on('error', (err) => {
        console.error('Server error:', err);
    });
}
//# sourceMappingURL=createApp.js.map