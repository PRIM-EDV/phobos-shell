import { Injectable } from "@nestjs/common";

import * as k8s from '@kubernetes/client-node';

@Injectable()
export class DiscoveryService {

  private kc = new k8s.KubeConfig();
  private k8sApi: k8s.CoreV1Api;

  constructor() {
    this.kc.loadFromCluster();
    this.k8sApi = this.kc.makeApiClient(k8s.CoreV1Api);


    this.discover();

  }
  
  private async discover() {
    try {
      // Suche alle Services mit dem Label 'phobos-role: mfe'
      const req = { namespace: 'default', labelSelector: 'type=mfe' };

      const res = await this.k8sApi.listNamespacedService(req);
      const services = res.items.map(svc => ({
        name: svc.metadata?.name,
        clusterIP: svc.spec?.clusterIP,
        ports: svc.spec?.ports?.map(port => port.port)
      }));
      console.log('Discovered Services:', services);
    } catch (err) {
      console.error('K8s Discovery Error:', err);
      return [];
    }
  }
}