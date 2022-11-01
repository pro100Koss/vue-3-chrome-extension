export class ExampleService {
  getAppVersion() {
    return __APP_VERSION__;
  }

  getAppName() {
    return __APP_NAME__;
  }
}

const exampleService = new ExampleService();
export default exampleService;
