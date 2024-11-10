// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IAppState {}

interface IAppContext {
  events: IEventsServer;
}

interface IEventsServer {
  getStatus(): Promise<string>;
}
