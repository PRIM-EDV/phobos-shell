import { Controller, Get, Req, Res } from "@nestjs/common";
import { Response } from "express";

import { DiscoveryService } from "src/infrastructure/discovery.service";

@Controller()
export class FederationController {

    constructor(
        private readonly discoveryService: DiscoveryService
    ) {}
    
    @Get('federation.manifest.json')
    getFederationManifest(@Req() req, @Res() res: Response) {
        const protocol = req.protocol;

        const config = {
            "phobos-auth": authUrl,
            "phobos-maptool": maptoolUrl,
            "phobos-lsx": lsxUrl,
            "phobos-cloak": cloakUrl
        }
        return res.json(config);
    }
}