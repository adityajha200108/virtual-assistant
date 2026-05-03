import express, { Express, Request, Response } from 'express';
import cors from 'cors';

type corsType = {
    origin?: string | string[] | boolean;
    methods?: string | string[];
    allowedHeaders?: string | string[];
    credentials?: boolean;
};

interface ControllersDepsType {
    Service: any,
    Model: any,
    Controller: any
}

interface CreateAppProps {
    port: number,
    controllers: ControllersDepsType[],
    corsOpt?: corsType
}

export type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export function createDexApp({ port = 7173, controllers, corsOpt }: CreateAppProps) {
    const dexApp: Express = express();

    dexApp.use(express.json());

    if(corsOpt){
        dexApp.use(cors(corsOpt));
    } else {
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

            dexApp[route.method as HttpMethod](fullPath, ...middlewares, (req: Request, res: Response) => {
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
