import { Controller, Get, Req, Res } from "@nestjs/common";
import { Response } from "express";

import { DiscoveryService } from "src/infrastructure/discovery/discovery.service";

@Controller()
export class FederationController {

    constructor(
        private readonly discoveryService: DiscoveryService
    ) {}
    
    @Get('federation.manifest.json')
    getFederationManifest(@Req() req, @Res() res: Response) {
        const protocol = req.protocol;
        const manifest = new Map<string, string>();
        const mfes = this.discoveryService.mfes;

        mfes.map(mfe => {
            const url = `${protocol}://${req.hostname}:${req.port}${mfe.path}`;
            manifest.set(mfe.name, url);
        });
        
        return res.json(Object.fromEntries(manifest));
    }
}