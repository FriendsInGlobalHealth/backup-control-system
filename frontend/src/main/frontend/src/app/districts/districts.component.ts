/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DistrictsService } from "./shared/districts.service";
import { District } from "./shared/district";
import { SendsService } from "./../sends/shared/sends.service";
import { Send } from "./../sends/shared/send";
import { SyncsService } from "./../syncs/shared/syncs.service";
import { Sync } from "./../syncs/shared/sync";
import { Receive } from '../receives/shared/receive';
import { ReceivesService } from '../receives/shared/receives.service';
import { Evaluation } from '../evaluations/shared/evaluation';
import { EvaluationsService } from '../evaluations/shared/evaluations.service';
import { MzToastService } from 'ng2-materialize';
import { CsvService } from "angular2-json2csv";
import { DatePipe } from '@angular/common';
import { TranslateService } from 'ng2-translate';
declare var jsPDF: any;
import * as alasql from 'alasql';
import * as myGlobals from '../../globals';

@Component({
  selector: 'app-districts',
  templateUrl: './districts.component.html',
  styleUrls: ['./districts.component.css']
})

/** 
* @author Damasceno Lopes
*/
export class DistrictsComponent implements OnInit {

  public districts; districtsreport; alldistricts: District[] = [];
  public district: District = new District();
  public send: Send = new Send();
  public sends: Send[] = [];
  public receive: Receive = new Receive();
  public evaluations: Evaluation[] = [];
  public evaluation: Evaluation = new Evaluation();
  public syncs: Sync[] = [];
  public sync: Sync = new Sync();
  public p: number;
  public isHidden; isHidden2m; isDisabledt; isDisabledt2; isHidden2; name: string;
  public isDisabled; showResult; disabled1; canceled: boolean;
  public resultEvaluation; districtsinfo; districtsresinfo; districtssyncinfo: Object[];
  public keys: string[] = [];
  public form; form1: FormGroup;
  public total; totali: number = 0;
  public ROLE_SIS; ROLE_IT; ROLE_OA; ROLE_GMA; ROLE_ODMA; ROLE_ORMA; ROLE_GDD: string;

   
  constructor(
    public datepipe: DatePipe,
    public _csvService: CsvService,
    public evaluationsService: EvaluationsService,
    public districtsService: DistrictsService,
    public toastService: MzToastService,
    public sendsService: SendsService,
    public receivesService: ReceivesService,
    public translate: TranslateService,
    public syncsService: SyncsService,
    public formBuilder: FormBuilder) {
    this.form1 = formBuilder.group({
      name: [],
      canceled: []
    });
  }

  ngOnInit() {
    this.name = "";
    this.canceled = false;
    this.isHidden = "";
    this.isDisabledt = "disabled";
    this.isDisabledt2 = "disabled";
    this.isHidden2 = "hide";
    this.isDisabled = false;
    this.ROLE_SIS = window.sessionStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.sessionStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.sessionStorage.getItem('ROLE_IT');
    this.ROLE_GMA = window.sessionStorage.getItem('ROLE_GMA');
    this.ROLE_ODMA = window.sessionStorage.getItem('ROLE_ODMA');
    this.ROLE_ORMA = window.sessionStorage.getItem('ROLE_ORMA');
    this.ROLE_GDD = window.sessionStorage.getItem('ROLE_GDD');
    this.total = 0;
    if (this.ROLE_SIS || this.ROLE_IT || this.ROLE_GMA || this.ROLE_OA) {
      this.getPageAll(1);
    } else if (this.ROLE_ODMA || this.ROLE_ORMA || this.ROLE_GDD) {
      this.getPageFiltered(1);
    }
  }

  getPageAll(page: number) {
    this.isHidden = "";
    this.districtsService.getDistrictsAll(page, 10, this.name, this.canceled)
      .subscribe(data => {
        this.totali = data.totalElements;
        this.p = page;
        this.alldistricts = data.content;
      },
        error => {
          this.isHidden = "hide";
          this.total = 0;
          this.p = 1;
        },
        () => {
          this.districtsService.getDistrictsReceiveInfo()
            .subscribe(data => {
              this.districtsinfo = data
            },
              error => { },
              () => {
                this.districtsService.getDistrictsRestoreInfo()
                  .subscribe(data => {
                    this.districtsresinfo = data;
                  },
                    error => { },
                    () => {
                      this.districtsService.getDistrictsSyncInfo()
                        .subscribe(data => {
                          this.districtssyncinfo = data;
                        },
                          error => { },
                          () => {
                            var received = alasql("SELECT [0] AS send_id_rec,[1] AS district_id,[2] AS last_backup_received FROM ?", [this.districtsinfo]);
                            var restored = alasql("SELECT [0] AS send_id_res,[1] AS district_id,[2] AS last_backup_restored FROM ?", [this.districtsresinfo]);
                            var synced = alasql("SELECT [0] AS sync_id,[1] AS district_id,[2] AS server,[3] AS start_time,[4] AS end_time, [5] AS server_report FROM ?", [this.districtssyncinfo]);
                            var recres = alasql("SELECT * FROM ?alldistricts LEFT JOIN ?received USING district_id LEFT JOIN ?restored USING district_id", [this.alldistricts, received, restored]);
                            this.districts = alasql("SELECT * FROM ?recres LEFT JOIN ?synced USING district_id ", [recres, synced]);
                            this.isHidden = "hide";
                            this.isDisabledt = "";
                            this.total = this.totali;
                          });
                    }
                  );
              }
            );
        }
      );
  }
 
  getPageFiltered(page: number) {
    this.isHidden = "";
    this.districtsService.getDistrictsFiltered(page, 10, this.name, this.canceled)
      .subscribe(data => {
        this.totali = data.totalElements;
        this.p = page;
        this.alldistricts = data.content;
      },
        error => {
          this.isHidden = "hide";
          this.total = 0;
          this.p = 1;
          this.districts = [];
        },
        () => {
          this.districtsService.getDistrictsReceiveInfo()
            .subscribe(data => {
              this.districtsinfo = data
            },
              error => { },
              () => {
                this.districtsService.getDistrictsRestoreInfo()
                  .subscribe(data => {
                    this.districtsresinfo = data;
                  },
                    error => { },
                    () => {
                      this.districtsService.getDistrictsSyncInfo()
                        .subscribe(data => {
                          this.districtssyncinfo = data;
                        },
                          error => { },
                          () => {
                            var received = alasql("SELECT [0] AS send_id_rec,[1] AS district_id,[2] AS last_backup_received FROM ?", [this.districtsinfo]);
                            var restored = alasql("SELECT [0] AS send_id_res,[1] AS district_id,[2] AS last_backup_restored FROM ?", [this.districtsresinfo]);
                            var synced = alasql("SELECT [0] AS sync_id,[1] AS district_id,[2] AS server,[3] AS start_time,[4] AS end_time, [5] AS server_report FROM ?", [this.districtssyncinfo]);
                            var recres = alasql("SELECT * FROM ?alldistricts LEFT JOIN ?received USING district_id LEFT JOIN ?restored USING district_id", [this.alldistricts, received, restored]);
                            this.districts = alasql("SELECT * FROM ?recres LEFT JOIN ?synced USING district_id ", [recres, synced]);
                            this.isHidden = "hide";
                            this.isDisabledt = "";
                            this.total = this.totali;
                          });
                    }
                  );
              }
            );
        }
      );
  }
  
  search1() {
    var userValue = this.form1.value;
    if (userValue.name) {
      this.name = userValue.name;
    }
    else {
      this.name = "";
    }
    if (userValue.canceled) {
      this.canceled = userValue.canceled;
    } else {
      this.canceled = false;
    }
    if (this.ROLE_SIS || this.ROLE_IT || this.ROLE_GMA || this.ROLE_OA) {
      this.getPageAll(1);
    } else if (this.ROLE_ODMA || this.ROLE_ORMA || this.ROLE_GDD) {
      this.getPageFiltered(1);
    }
  }

  
  setDistrict(uuid) {
    this.district = this.districts.find(item => item.uuid == uuid);
  }

 
  deleteDistrict() {
    this.isDisabledt = "disabled";
    this.isHidden = "";
    this.districtsService.deleteDistrict(this.district.uuid)
      .subscribe(data => {
        if (data.text() == "Success") {
          this.search1()
          this.showMsg(this.district.name);
          this.isHidden = "hide";
          this.isDisabledt = "disabled";
        } else {
          this.isHidden = "hide";
          this.isDisabledt = "";
        }
      },
        error => {
        }
      );
  }

  
  setSend(send_id) {
    this.isHidden2m = "";
    this.sendsService.getSendById(send_id)
      .subscribe(data => {
        this.send = data;
      }, error => {
      }, () => {
        if (this.send.received == true) {
          this.receivesService.getReceiveBySendId(send_id)
            .subscribe(data => {
              this.receive = data;
              if (this.receive != null) {
                this.send.receivername = this.receive.created_by.person.others_names + " " + this.receive.created_by.person.surname;
                this.send.receivedate = this.receive.receive_date;
                this.send.restored = this.receive.restored;
                if (this.receive.restored_by != null) {
                  this.send.restorername = this.receive.restored_by.person.others_names + " " + this.receive.restored_by.person.surname;
                }
                this.send.date_restored = this.receive.date_restored;
                this.send.sis_observation = this.receive.observation;
                this.send.ik_returned = this.receive.ik_returned;
                if (this.send.ik_returned) {
                  this.send.ik_returneddate = this.receive.date_ik_returned;
                  this.send.ik_returnedto = this.receive.transporter.name;
                }
              }
            }, error => {
            },
              () => {
                this.isHidden2m = "hide";
              });
        } else {
          this.isHidden2m = "hide";
        }
      });
  }

  
  evaluate() {
    this.isHidden2 = "";
    this.isDisabledt2 = "disabled";
    this.isDisabled = true;
    this.showResult = false;
    this.districtsService.evaluate(this.district.uuid, this.evaluation.openmrs_sql_dataset_uuid)
      .subscribe(data => {
        this.resultEvaluation = data.rows;
      }, error => {
        this.showMsgErr2();
        this.isHidden2 = "hide";
        this.isDisabledt2 = "";
        this.isDisabled = false;
      },
        () => {
          this.isHidden2 = "hide";
          this.isDisabledt2 = "";
          this.isDisabled = false;
          this.showResult = true;
          this.keys = Object.keys(this.resultEvaluation[0])
        }
      );
  }

  
  download() {
    this._csvService.download(this.resultEvaluation, this.district.name + '_' + this.evaluation.name + '_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
  }

  
  clean() {
    this.resultEvaluation = [];
    this.keys = [];
    this.showResult = false;
  }

  
  setSync(sync_id) {
    this.isHidden2m = "";
    this.syncsService.getSyncById(sync_id)
      .subscribe(
        sync => {
          this.sync = sync;
        }, error => { }, () => { this.isHidden2m = "hide"; });
  }

 
  printList() {
    this.isHidden = "";
    this.isDisabledt = "disabled";

    if (this.ROLE_SIS || this.ROLE_IT || this.ROLE_GMA || this.ROLE_OA) {
      this.districtsService.getDistrictsAll(1, 1000000, this.name, this.canceled)
        .subscribe(data => {
          this.districtsreport = data.content;
        },
          error => {
            this.isHidden = "hide";
            this.isDisabledt = "";
            this.districtsreport = [];
          },
          () => {
            this.districtsService.getDistrictsReceiveInfo()
              .subscribe(data => {
                this.districtsinfo = data
              },
                error => { },
                () => {
                  this.districtsService.getDistrictsRestoreInfo()
                    .subscribe(data => {
                      this.districtsresinfo = data;
                    },
                      error => { },
                      () => {
                        this.districtsService.getDistrictsSyncInfo()
                          .subscribe(data => {
                            this.districtssyncinfo = data;
                          },
                            error => { },
                            () => {
                              var received = alasql("SELECT [0] AS send_id_rec,[1] AS district_id,[2] AS last_backup_received FROM ?", [this.districtsinfo]);
                              var restored = alasql("SELECT [0] AS send_id_res,[1] AS district_id,[2] AS last_backup_restored FROM ?", [this.districtsresinfo]);
                              var synced = alasql("SELECT [0] AS sync_id,[1] AS district_id,[2] AS server,[3] AS start_time,[4] AS end_time, [5] AS server_report FROM ?", [this.districtssyncinfo]);
                              var recres = alasql("SELECT * FROM ?alldistricts LEFT JOIN ?received USING district_id LEFT JOIN ?restored USING district_id", [this.districtsreport, received, restored]);
                              this.districtsreport = alasql("SELECT * FROM ?recres LEFT JOIN ?synced USING district_id ", [recres, synced]);
                              this.isHidden = "hide";
                              this.isDisabledt = "";
                              this.total = this.totali;
                              var user = JSON.parse(window.sessionStorage.getItem('user'));
                              var doc = new jsPDF('landscape');
                              var totalPagesExp = "{total_pages_count_string}";
                              var columns = [
                                { title: "Distrito/ US", dataKey: "namef" },
                                { title: "Último Backup\nRecebido", dataKey: "last_backup_received" },
                                { title: "Último backup\nRestaurado", dataKey: "last_backup_restored" },
                                { title: "Última\nSincronização", dataKey: "server_report" },
                                { title: "Ironkey(s)", dataKey: "ironkeysnames" }
                              ];
                              var listSize = this.districtsreport.length;
                              var datenow = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
                              // HEADER
                              doc.setFontSize(18);
                              doc.text('Lista de Distritos/US', 14, 22);
                              doc.setFontSize(14);
                              doc.text(listSize + ' distritos/us encontrados.', 14, 45);
                              doc.setFontSize(11);
                              doc.setTextColor(100);
                              var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
                              var text = doc.splitTextToSize('Distritos/US representam locais apoiados por FGH onde existe uma Base de Dados OpenMRS.', pageWidth - 25, {});
                              doc.text(text, 14, 32);
                              var pageContent = function (data) {
                                // FOOTER
                                var str = "Página " + data.pageCount;
                                if (typeof doc.putTotalPages === 'function') {
                                  str = str + " de " + totalPagesExp;
                                }
                                doc.setFontSize(10);
                                var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
                                doc.text(str, data.settings.margin.left, pageHeight - 5);
                              };
                              doc.autoTable(columns, this.districtsreport, {
                                startY: 50,
                                styles: { overflow: 'linebreak' },
                                bodyStyles: { valign: 'top' },
                                theme: 'grid',
                                headerStyles: { fillColor: [41, 128, 185], lineWidth: 0 },
                                addPageContent: pageContent
                              });
                              doc.setFontSize(11);
                              doc.setTextColor(100);
                              doc.text('Lista impressa em: ' + datenow + ', por: ' + user.person.others_names + ' ' + user.person.surname + '.', 14, doc.autoTable.previous.finalY + 10);
                              doc.setTextColor(0, 0, 200);
                              doc.textWithLink('Sistema de Controle de Backup', 14, doc.autoTable.previous.finalY + 15, { url: myGlobals.Production_URL });
                              if (typeof doc.putTotalPages === 'function') {
                                doc.putTotalPages(totalPagesExp);
                              }
                              doc.save('SCB_Distritos_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm') + '.pdf');
                            });
                      });
                });
          });
    } else if (this.ROLE_ODMA || this.ROLE_ORMA || this.ROLE_GDD) {
      this.districtsService.getDistrictsFiltered(1, 1000000, this.name, this.canceled)
        .subscribe(data => {
          this.districtsreport = data.content;
        },
          error => {
            this.isHidden = "hide";
            this.isDisabledt = "";
            this.districtsreport = [];
          },
          () => {
            this.districtsService.getDistrictsReceiveInfo()
              .subscribe(data => {
                this.districtsinfo = data
              },
                error => { },
                () => {
                  this.districtsService.getDistrictsRestoreInfo()
                    .subscribe(data => {
                      this.districtsresinfo = data;
                    },
                      error => { },
                      () => {
                        this.districtsService.getDistrictsSyncInfo()
                          .subscribe(data => {
                            this.districtssyncinfo = data;
                          },
                            error => { },
                            () => {
                              var received = alasql("SELECT [0] AS send_id_rec,[1] AS district_id,[2] AS last_backup_received FROM ?", [this.districtsinfo]);
                              var restored = alasql("SELECT [0] AS send_id_res,[1] AS district_id,[2] AS last_backup_restored FROM ?", [this.districtsresinfo]);
                              var synced = alasql("SELECT [0] AS sync_id,[1] AS district_id,[2] AS server,[3] AS start_time,[4] AS end_time, [5] AS server_report FROM ?", [this.districtssyncinfo]);
                              var recres = alasql("SELECT * FROM ?alldistricts LEFT JOIN ?received USING district_id LEFT JOIN ?restored USING district_id", [this.districtsreport, received, restored]);
                              this.districtsreport = alasql("SELECT * FROM ?recres LEFT JOIN ?synced USING district_id ", [recres, synced]);
                              this.isHidden = "hide";
                              this.isDisabledt = "";
                              this.total = this.totali;
                              var user = JSON.parse(window.sessionStorage.getItem('user'));
                              var doc = new jsPDF('landscape');
                              var totalPagesExp = "{total_pages_count_string}";
                              var columns = [
                                { title: "Distrito/ US", dataKey: "namef" },
                                { title: "Último Backup\nRecebido", dataKey: "last_backup_received" },
                                { title: "Último backup\nRestaurado", dataKey: "last_backup_restored" },
                                { title: "Última\nSincronização", dataKey: "server_report" },
                                { title: "Ironkey(s)", dataKey: "ironkeysnames" }
                              ];
                              var listSize = this.districtsreport.length;
                              var datenow = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
                              // HEADER
                              doc.setFontSize(18);
                              doc.text('Lista de Distritos/US', 14, 22);
                              doc.setFontSize(14);
                              doc.text(listSize + ' distritos/us encontrados.', 14, 45);
                              doc.setFontSize(11);
                              doc.setTextColor(100);
                              var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
                              var text = doc.splitTextToSize('Distritos/US representam locais apoiados por FGH onde existe uma Base de Dados OpenMRS.', pageWidth - 25, {});
                              doc.text(text, 14, 32);
                              var pageContent = function (data) {
                                // FOOTER
                                var str = "Página " + data.pageCount;
                                if (typeof doc.putTotalPages === 'function') {
                                  str = str + " de " + totalPagesExp;
                                }
                                doc.setFontSize(10);
                                var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
                                doc.text(str, data.settings.margin.left, pageHeight - 5);
                              };
                              doc.autoTable(columns, this.districtsreport, {
                                startY: 50,
                                styles: { overflow: 'linebreak' },
                                bodyStyles: { valign: 'top' },
                                theme: 'grid',
                                headerStyles: { fillColor: [41, 128, 185], lineWidth: 0 },
                                addPageContent: pageContent
                              });
                              doc.setFontSize(11);
                              doc.setTextColor(100);
                              doc.text('Lista impressa em: ' + datenow + ', por: ' + user.person.others_names + ' ' + user.person.surname + '.', 14, doc.autoTable.previous.finalY + 10);
                              doc.setTextColor(0, 0, 200);
                              doc.textWithLink('Sistema de Controle de Backup', 14, doc.autoTable.previous.finalY + 15, { url: myGlobals.Production_URL });
                              if (typeof doc.putTotalPages === 'function') {
                                doc.putTotalPages(totalPagesExp);
                              }
                              doc.save('SCB_Distritos_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm') + '.pdf');
                            });
                      });
                });
          });
    }
  }


  getEvaluations() {
    this.disabled1 = true;
    this.evaluationsService.getEvaluations()
      .subscribe(data => { this.evaluations = data; }, error => { }, () => { this.disabled1 = false; }
      );
  }

 
  showMsg(district) {
    this.toastService.show('Distrito: ' + district + ', excluido com sucesso!', 2000, 'green', null);
  }
  showMsgErr(district) {
    this.toastService.show('Distrito: ' + district + ', não pode ser excluido!', 2000, 'red', null);
  }
  showMsgErr2() {
    this.toastService.show('Erro ao avaliar, tente denovo ou contacte o SIS!', 2000, 'red', null);
  }
  showMsgErr3() {
    this.toastService.show('Data de Backup inicial não pode ser inferior.', 2000, 'red', null);
  }
}