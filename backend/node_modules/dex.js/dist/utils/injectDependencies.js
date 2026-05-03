export function InjectDeps(Controller, Service, Model) {
    const modelInstance = new Model();
    const serviceInstance = new Service(modelInstance);
    return new Controller(serviceInstance, modelInstance);
}
//# sourceMappingURL=injectDependencies.js.map