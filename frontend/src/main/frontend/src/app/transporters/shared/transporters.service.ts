/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as CryptoJS from 'crypto-js';
import * as myGlobals from '../../../globals';

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
@Injectable()
export class TransportersService {
  public url: string = myGlobals.API;
  
     
  constructor(public http: Http) {
  }

  /**
   * Returns all Transporters with the given name, role or lifecicle status
   * 
   * @param page the page number
   * @param size the size of page
   * @param name the Transporter name
   * @param role the Transporter role
   * @param canceled the lifecycle status
   */
  findTransporters(page, size, name, role, canceled) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/transporters?filterCriteria=name=like:" + name + ",role=eq:" + role + ",canceled=eq:" + canceled+"&pageNumber=" + page + "&pageSize=" + size + "&sortingCriteria=+name", { headers: headers })
      .map(res => res.json());
  }

  /**
   * Returns the Transporter with the given uuid
   * 
   * @param uuid Transporter uuid
   */
  findOneTransporterByUuid(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + "/transporter/" + uuid, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Add new Tranpsorter
   * 
   * @param transporter the Transporter
   */
  createTransporter(transporter) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + "/transporter", JSON.stringify(transporter), { headers: headers });
  }

  /**
   * Update the Transporter
   * 
   * @param transporter the Transporter
   */
  updateTransporter(transporter) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url + "/transporter", JSON.stringify(transporter), { headers: headers });
  }

  /**
   * Delete the Transporter with the given uuid
   * 
   * @param uuid The Transporter uuid
   */
  deleteTransporter(uuid) {
    var headers: any = new Headers();
    var parsedWordArray = CryptoJS.enc.Base64.parse(window.sessionStorage.getItem('password'));
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + parsedWordArray.toString(CryptoJS.enc.Utf8)));
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.url + "/transporter/" + uuid, { headers: headers });
  }

}