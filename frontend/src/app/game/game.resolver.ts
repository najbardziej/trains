import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { Game } from "../model/game";
import { GameService } from "./game.service";


@Injectable({ providedIn: 'root' })
export class GameResolver implements Resolve<Game> {
  constructor(private service: GameService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Game> {
    return this.service.getGameData(route.paramMap.get('id') || '');
  }
}