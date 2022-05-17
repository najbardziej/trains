import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { GameService } from "../game.service";


@Injectable({ providedIn: 'root' })
export class GameMapResolver implements Resolve<any> {
  constructor(private service: GameService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.service.getGameMapData();
  }
}