export function InjectDeps(Controller: any, Service: any, Model: any) {
    const modelInstance = new Model();
    const serviceInstance = new Service(modelInstance);
    return new Controller(serviceInstance, modelInstance);
}