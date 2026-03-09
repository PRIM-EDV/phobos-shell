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
            const url = `${protocol}://${req.host}${mfe.path}/remoteEntry.json`;
            manifest.set(mfe.name, url);
        });
        
        return res.json(Object.fromEntries(manifest));
    }

    @Get('phobos.manifest.json')
    getPhobosManifest(@Req() req, @Res() res: Response) {
        const manifest = new Map<string, string>();
        const mfes = this.discoveryService.mfes;

        mfes.map(mfe => {
            manifest.set(mfe.name, mfe.path);
        });
        
        return res.json(Object.fromEntries(manifest));
    }
}