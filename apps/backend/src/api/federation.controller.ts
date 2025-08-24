import { Controller, Get, Req, Res } from "@nestjs/common";
import { Response } from "express";

@Controller()
export class FederationController {
    @Get('federation.manifest.json')
    getFederationManifest(@Req() req, @Res() res: Response) {
        const protocol = req.protocol;
        const config = {
            "phobos-auth": `${protocol}://${req.get('host')}:3000/remoteEntry.json`,
            "phobos-maptool": `${protocol}://${req.get('host')}:3002/remoteEntry.json`,
            "phobos-lsx": `${protocol}://${req.get('host')}:3005/remoteEntry.json`
        }
        return res.json(config);
    }
}