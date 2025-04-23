import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";

import { TokenService } from "./token.service";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const accessToken = inject(TokenService).accessToken();

    if (accessToken !== null) {
        const newReq = req.clone({
            headers: req.headers.append('Authorization', `Bearer ${accessToken}`),
        });

        return next(newReq);
    } else {
        return req
    }
}