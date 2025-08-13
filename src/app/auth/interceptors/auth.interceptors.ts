import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, tap } from "rxjs";
import { AuthService } from "../services/auth-service";

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const token = inject(AuthService).token();
  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`,),
  });
  return next(newReq);
}
