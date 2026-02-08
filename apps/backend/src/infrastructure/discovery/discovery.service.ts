import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

import * as k8s from '@kubernetes/client-node';

import { IngressDiscovery } from "./interfaces/ingress-discovery.interface";
import { ServiceDiscovery } from "./interfaces/service-discovery.interface";
import { MfeDiscovery } from "./interfaces/mfe-discovery.interface";
import { WinstonLogger } from "../logger/winston/winston.logger";

@Injectable()
export class DiscoveryService implements OnModuleInit, OnModuleDestroy {

  public mfes: MfeDiscovery[] = [];

  private kc = new k8s.KubeConfig();
  private k8sApi: k8s.CoreV1Api;
  private k8sNetworkingApi: k8s.NetworkingV1Api;
  private k8sWatch: k8s.Watch;
  private k8sWatchRequest: AbortController | null = null;

  constructor(
    private readonly logger: WinstonLogger
  ) {
    this.logger.setContext(DiscoveryService.name);

    try {
      this.kc.loadFromDefault();
    } catch (e) {
      this.kc.loadFromCluster();
    }

    this.k8sApi = this.kc.makeApiClient(k8s.CoreV1Api);
    this.k8sNetworkingApi = this.kc.makeApiClient(k8s.NetworkingV1Api);
    this.k8sWatch = new k8s.Watch(this.kc);
  }

  onModuleInit() {
    this.watch().then().catch(err => {
      this.logger.error(`Error starting discovery watch: ${err}`);
    });
  }

  onModuleDestroy() {
    if (this.k8sWatchRequest) {
      this.k8sWatchRequest.abort();
    }
  }

  /**
   * Discovers Kubernetes services and associate ingress config with label 'type=mfe' in the default namespace
   * @returns  Array of service objects containing name, clusterIP, and ports
   */
  private async discover(): Promise<MfeDiscovery[]> {
    try {
      const services = await this.discoverServices();
      const ingresses = await this.discoverIngresses();
      const mfes = services.map(svc => {
        const ingress = ingresses.find(ing => ing.services.some(s => s.service === svc.name));
        const path = ingress ? ingress.services.find(s => s.service === svc.name)?.path : '/';

        return {
          name: svc.app,
          path: path
        };
      });

      this.logger.log(`Discovered MFEs: ${JSON.stringify(mfes)}`);
      return mfes;
    } catch (err) {
      this.logger.error(`Could not discover services: ${err}`);
      return [];
    }
  }


  /**
   * Discovers Kubernetes ingresses default namespace and returns the associated service and path.
   * @returns {Promise<IngressDiscovery[]>} Array of ingress objects containing name and associated services with paths
   */
  private async discoverIngresses(): Promise<IngressDiscovery[]> {
    try {
      const req = { namespace: 'default'};
      const res = await this.k8sNetworkingApi.listNamespacedIngress(req);

      const ingresses = res.items.map(ing => ({
        name: ing.metadata?.name,
        services: (ing.spec?.rules || []).flatMap(rule => (
          (rule.http?.paths || []).map(path => ({
            service: path.backend.service?.name,
            path: path.path
          }))
        ))
      }));

      this.logger.log(`Discovered ingresses: ${JSON.stringify(ingresses)}`);
      return ingresses;
    } catch (err) {
      this.logger.error(`Could not discover ingresses: ${err}`);
      return [];
    }
  }

  /**
   * Discovers Kubernetes services with label 'type=mfe' in the default namespace and returns their name, clusterIP, and ports.
   * @returns {Promise<ServiceDiscovery[]>} Array of service objects containing name, clusterIP, and ports
   */
  private async discoverServices(): Promise<ServiceDiscovery[]> {
    try {
      const req = { namespace: 'default', labelSelector: 'type=mfe' };
      const res = await this.k8sApi.listNamespacedService(req);
      const services = res.items.map(svc => ({
        app: svc.spec?.selector?.app,
        name: svc.metadata?.name,
        clusterIP: svc.spec?.clusterIP,
        ports: svc.spec?.ports?.map(port => port.port)
      }));
      this.logger.log(`Discovered services: ${JSON.stringify(services)}`);
      return services;
    } catch (err) {
      this.logger.error(`Could not discover services: ${err}`);
      return [];
    }  
  }

  /**
   * Watches for changes to Kubernetes services with label 'type=mfe' in the default namespace
   * and triggers discovery when changes occur. Automatically restarts the watch on errors.
   * @returns 
   */
  private async watch() {
    if (this.k8sWatchRequest) { return; }

    this.k8sWatchRequest = await this.k8sWatch.watch(
      '/api/v1/namespaces/default/services',
      { labelSelector: 'type=mfe' },
      async () => {
        this.mfes = await this.discover();
      },
      (err) => {
        this.k8sWatchRequest = null;
        setTimeout(() => this.watch(), 5000);
      }
    );
  }
}