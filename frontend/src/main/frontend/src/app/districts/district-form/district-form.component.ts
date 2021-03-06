import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { District } from '../shared/district';
import { DistrictsService } from '../shared/districts.service';
import { IronkeysService } from './../../ironkeys/shared/ironkeys.service';;
import { Ironkey } from './../../ironkeys/shared/ironkey';
import { MatSnackBar} from '@angular/material';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-district-form',
  templateUrl: './district-form.component.html',
  styleUrls: ['./district-form.component.css']
})

/** 
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 */
export class DistrictFormComponent implements OnInit {
  
  /**
   *If this is already persisted on the database dont edit or delete
   *Just add new value
   */
  public provinces = [
    { name: 'Cabo Delgado' },
    { name: 'Gaza' },
    { name: 'Inhambane' },
    { name: 'Maníca' },
    { name: 'Maputo Cidade' },
    { name: 'Maputo Província' },
    { name: 'Nampula' },
    { name: 'Niassa' },
    { name: 'Sofala' },
    { name: 'Tete' },
    { name: 'Zambézia' },
    { name: 'Outra' }
  ]
  public form: FormGroup;
  public title; isHidden: string;
  public isDisabled; disabled1: boolean;
  public district: District = new District();
  public alldistricts: District[] = [];
  public allironkeys: Ironkey[] = [];
  public user: any;
   
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public districtsService: DistrictsService,
    public ironkeysService: IronkeysService,
    public snackBar: MatSnackBar,
    public translate: TranslateService
  ) {
    this.form = formBuilder.group({
      province: ['', [
        Validators.required
      ]],
      name: ['', [
        Validators.required
      ]],
      instanceUrl: [],
      instanceUsername: [],
      instancePassword: [],
      ironkeys: [],
      canceled: [],
      canceledReason: [],
      parent: []
    });
  }

  ngOnInit() {
    this.isDisabled = false;
    this.disabled1 = true;
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.route.params.subscribe(params => {
      var uuid = params['uuid'];
      this.title = uuid ? 'Editar Distrito' : 'Novo Distrito';
      this.isHidden = uuid ? '' : 'hide';
      if (!uuid) {
        this.districtsService.findDistricts("","","",false,"fullName,uid,districtId")
          .subscribe(data => {
            this.alldistricts = data.content;
          });
        this.ironkeysService.findIronkeys("","","","","","","serial,ironkeyId,uid,size")
          .subscribe(data => { this.allironkeys = data.content }, error => { },
            () => {
              this.disabled1 = false;
            });
        return;
      } else {
        this.districtsService.findOneDistrictByUuid(uuid,"instanceUrl,instanceUsername,instancePassword,districtId,name,province,uid,dateCreated,createdBy.userId,createdBy.uid,ironkeys.serial,ironkeys.ironkeyId,ironkeys.uid,ironkeys.size,parent.districtId,parent.uid,parent.fullName,canceled,canceledReason").subscribe(
          district => {
            this.district = district;
            var districtik = district.ironkeys;
            this.ironkeysService.findIronkeys("","","","","","","serial,ironkeyId,uid,size")
              .subscribe(data => {
                this.allironkeys = data.content;
                var filteredironkeys = this.allironkeys;
                for (let i of districtik) {
                  filteredironkeys = filteredironkeys.filter(item => item.ironkeyId !== i.ironkeyId);
                }
                for (let i of districtik) {
                  filteredironkeys.push(i);
                }
                this.allironkeys = filteredironkeys.sort(function (a, b) {
                  var nameA = a.serial.toUpperCase();
                  var nameB = b.serial.toUpperCase();
                  if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }
                  return 0;
                });
              }, error => { },
                () => {
                  this.districtsService.findDistricts("","","",false,"fullName,uid,districtId")
                    .subscribe(data => {
                      this.alldistricts = data.content;
                      if (this.district.parent != null) {
                        this.alldistricts = this.alldistricts.filter(item => item.districtId != this.district.parent.districtId);
                        this.alldistricts.push(this.district.parent);
                      }
                      this.alldistricts = this.alldistricts.sort(function (a, b) {
                        var nameA = a.fullName.toUpperCase(); // ignore upper and lowercase
                        var nameB = b.fullName.toUpperCase(); // ignore upper and lowercase
                        if (nameA < nameB) {
                          return -1;
                        }
                        if (nameA > nameB) {
                          return 1;
                        }
                        return 0;
                      });

                    }, error => { },
                      () => { this.disabled1 = false; });
                }
              );
          },
          response => {
            if (response.status == 404) {
              this.router.navigate(['NotFound']);
            }
          });
      }
    });
  }

  save() {
    this.isDisabled = true;
    var result, userValue = this.form.value;
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    if (this.district.uid) {
      if (userValue.canceled == true && userValue.canceledReason == null) {
        this.openSnackBar("Escreva a razão para anular!", "OK");
        this.isDisabled = false;
      }else{

      userValue.districtId = this.district.districtId;
      userValue.dateCreated = this.district.dateCreated;
      userValue.uid = this.district.uid;
      userValue.createdBy = this.district.createdBy;
      userValue.updatedBy = {
        uid: this.user.uid,
        userId: this.user.userId
      };
      result = this.districtsService.updateDistrict(userValue);
      result.subscribe(data => {
        if (data.text() == "Success") {
          this.router.navigate(['districts']);
          this.openSnackBar("Distrito: "+userValue.name+", actualizado com sucesso!", "OK");
            } else {
          this.openSnackBar("Este Distrito ja existe!", "OK");
          this.isDisabled = false;
        }
      });
    }} else {
      
      userValue.createdBy = {
        uid: this.user.uid,
        userId: this.user.userId
      };
      result = this.districtsService.createDistrict(userValue);
      result.subscribe(data => {
        if (data.text() == "Success") {
          this.router.navigate(['districts']);
          this.openSnackBar("Distrito: "+userValue.name+", cadastrado com sucesso!", "OK");
        } else {
          this.openSnackBar("Este Distrito ja existe!", "OK");
          this.isDisabled = false;
        }
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

  
}