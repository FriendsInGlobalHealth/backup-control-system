import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as myGlobals from 'globals';

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
@Injectable()
export class LoginsService {
  
  public url: string = myGlobals.API;
  
  constructor(public http: Http) {
  }

  findOneUserByCredentials(usercreds) {
    var headers: any = new Headers();
    headers.append('Authorization', 'Basic ' + btoa(usercreds.username + ':' + usercreds.password));
    headers.append('Content-Type', 'application/json');
    return this.http.get("api/v1/authenticate?fields=districts.parent.fullName,districts.parent.name,districts.canceled,authorities.name,locale,person.gender,person.othersNames,person.surname,person.email,person.phoneNumber,enabled,notification,dateCreated,dateUpdated,creatorId,updaterId,uid,districts.fullName,districts.uid,authorities.description,lastLogin,username,person.personId,person.uid,districts.districtId,creatorId,userId,authorities.authorityId,creatorName,updaterName,districts.name", { headers: headers })
      .map(res => res.json());
  }
  
}