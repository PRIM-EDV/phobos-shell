import { Controller, Get, Req, Res } from "@nestjs/common";
import { Response } from "express";

const PHOBOS_AUTH_URL = process.env.PHOBOS_AUTH_URL;
const PHOBOS_MAPTOOL_URL = process.env.PHOBOS_MAPTOOL_URL;
const PHOBOS_LSX_URL = process.env.PHOBOS_LSX_URL;
const PHOBOS_CLOAK_URL = process.env.PHOBOS_CLOAK_URL;

@Controller()
export class FederationController {
    @Get('federation.manifest.json')
    getFederationManifest(@Req() req, @Res() res: Response) {
        const protocol = req.protocol;

        const authUrl = PHOBOS_AUTH_URL ? `${PHOBOS_AUTH_URL}/remoteEntry.json` : `${protocol}://${req.hostname}:3000/remoteEntry.json`;
        const maptoolUrl = PHOBOS_MAPTOOL_URL ? `${PHOBOS_MAPTOOL_URL}/remoteEntry.json` : `${protocol}://${req.hostname}:3002/remoteEntry.json`;
        const lsxUrl = PHOBOS_LSX_URL ? `${PHOBOS_LSX_URL}/remoteEntry.json` : `${protocol}://${req.hostname}:3005/remoteEntry.json`;
        const cloakUrl = PHOBOS_CLOAK_URL ? `${PHOBOS_CLOAK_URL}/remoteEntry.json` : `${protocol}://${req.hostname}:3006/remoteEntry.json`;

        const config = {
            "phobos-auth": authUrl,
            "phobos-maptool": maptoolUrl,
            "phobos-lsx": lsxUrl,
            "phobos-cloak": cloakUrl
        }
        return res.json(config);
    }
}