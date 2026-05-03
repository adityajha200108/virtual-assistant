type corsType = {
    origin?: string | string[] | boolean;
    methods?: string | string[];
    allowedHeaders?: string | string[];
    credentials?: boolean;
};
interface ControllersDepsType {
    Service: any;
    Model: any;
    Controller: any;
}
interface CreateAppProps {
    port: number;
    controllers: ControllersDepsType[];
    corsOpt?: corsType;
}
export type HttpMethod = 'get' | 'post' | 'put' | 'delete';
export declare function createDexApp({ port, controllers, corsOpt }: CreateAppProps): void;
export {};
