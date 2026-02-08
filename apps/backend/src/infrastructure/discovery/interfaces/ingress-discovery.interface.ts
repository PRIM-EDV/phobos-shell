export interface IngressDiscovery {
  name: string;
  services: {
    service: string;
    path: string;
  }[];
}