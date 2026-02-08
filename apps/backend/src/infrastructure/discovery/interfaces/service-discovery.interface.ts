export interface ServiceDiscovery {
  app: string;
  name: string;
  clusterIP: string;
  ports: number[];
}