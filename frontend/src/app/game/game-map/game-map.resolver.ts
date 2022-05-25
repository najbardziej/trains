import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { GameMapService } from "./game-map.service";


@Injectable({ providedIn: 'root' })
export class GameMapResolver implements Resolve<any> {
  constructor(private gameMapService: GameMapService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.gameMapService.getGameMapData(route.paramMap.get('id') || '');
  }
}