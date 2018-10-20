/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.sync;

import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.mail.DefaultAuthenticator;
import org.apache.commons.mail.HtmlEmail;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mz.org.fgh.scb.resource.ResourceRepository;

/**
 * @author Damasceno Lopes
 *
 */
@Service
public class SyncServiceImpl implements SyncService {

	@Autowired
	SyncRepository syncRepository;
	
	@Autowired
	ResourceRepository resourceRepository;

	@Autowired
	private Environment env;

	private String  sync_time,duration, start_items_to_send, start_items_to_receive, end_items_to_send, end_items_to_receive, district, obs,error,server;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Transactional(readOnly = true)
	@Override
	public Sync findOneByUuid(String uuid) {
		return syncRepository.findOneByUid(uuid);
	}

	@Transactional(readOnly = false)
	@Override
	public Sync save(Sync sync) {
		if (sync.getSyncId() == null) {
			sync.setDateCreated(new Date());
			sync.setDateUpdated(new Date());
			sync.setDistrict(sync.getServer().getDistrict());
			DateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm");
			DateFormat simpleDateFormat2 = new SimpleDateFormat("HH:mm");
			if(sync.getEndTime()==null) {
				sync_time=simpleDateFormat.format(sync.getStartTime());
				duration="<span style='color:white;background-color: orange; font-size: 11px;border-radius: 5%; padding: 5px;'>EM PROGRESSO</span>";
				end_items_to_send = "";
				end_items_to_receive = "";
			}else {
				DecimalFormat decimalFormat = new DecimalFormat("00");
				long diff = sync.getEndTime().getTime() - sync.getStartTime().getTime();
				long diffMinutes = diff / (60 * 1000) % 60;
				long diffHours = diff / (60 * 60 * 1000) % 24;
				duration=decimalFormat.format(diffHours) + "h " + decimalFormat.format(diffMinutes) + "min";
				sync_time = simpleDateFormat.format(sync.getStartTime())+"-"+simpleDateFormat2.format(sync.getEndTime());
				end_items_to_send = sync.getEndItemsToSend()+" por enviar";
				end_items_to_receive = sync.getEndItemsToReceive()+" por receber";
			}
			
			start_items_to_send = sync.getStartItemsToSend()+"";
			start_items_to_receive = sync.getStartItemsToReceive()+"";
			
			error="";
			if (sync.isSyncError()) {
				error= "Erro de Sync<br>";
			} 
			if (sync.isServerFault()) {
				error= error+"Avaria do Servidor<br>";
			} 
			if (sync.isLaptopFault()) {
				error= error+"Avaria do Laptop<br>";
			} 
			if (sync.isPowerCut()) {
				error= error+"Corte de Energia";
			} 
			obs="";
			if (sync.getObservation() != null && sync.getObservationHis() == null) {
				obs = sync.getObservation();
			} else if (sync.getObservation() == null && sync.getObservationHis() != null) {
				obs =  sync.getObservationHis();
			} else if (sync.getObservation() != null && sync.getObservationHis() != null) {
				obs =  "M&A: " + sync.getObservation() + "\nSIS: " + sync.getObservationHis();
			}
			
			district = sync.getServer().getDistrict().getName();
			server=sync.getServer().getName();

			new Thread(new Runnable() {
				public void run() {
					HtmlEmail email = new HtmlEmail();
					email.setHostName("smtp.gmail.com");
					email.setSmtpPort(465);
					email.setAuthenticator(new DefaultAuthenticator("scb.fgh@gmail.com", "Pepfar2014"));
					email.setSSLOnConnect(true);
					try {
						String r1 = resourceRepository.findUsersForSyncNotification(sync.getServer().getDistrict().getDistrictId()).toString().replace("[", "");
						String r2 = r1.replace("]", " ");
						String[] temp;
						String divisor = ", ";
						temp = r2.split(divisor);
						int i = 0;

						while (i < temp.length) {
							email.addBcc(temp[i] + "");
							i++;
						}
						email.setFrom("scb.fgh@gmail.com", "SCB");
						email.setSubject("[SCB-" + env.getProperty("org") + "] Registo de Sincronização, " + server + "-"+ sync_time + " (No Reply)");
						email.setHtmlMsg(""
								+ "<table border='1' style='border-color:#EEEEEE;' cellspacing='0' cellpadding='5' style='width:400px;'>"
								+ "<thead><tr><th colspan='2' style='text-aign:center;background-color:#0288D1;color:white;'>Registo de Sincronização</th></tr><thead>"
								+ "<tbody><tr>" + "<td bgcolor='#F3F3F3'>Servidor:</td><td>" + server + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Distrito:</td><td>" + district + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Horário de<br>Sincronização:</td><td>" + sync_time + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Duração:</td><td>" + duration + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Nº de itens na hora<br>inicial</td><td>" + start_items_to_send+" por enviar<br>"+start_items_to_receive + " por receber</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Nº de itens na hora<br>final</td><td>" + end_items_to_send+"<br>"+end_items_to_receive + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3'>Ocorrências:</td><td>" + error + "</td></tr>"
								+ "<tr><td bgcolor='#F3F3F3' aling='top'>Observação:</td><td>" + obs
								+ "</td></tr>" + "<tr><td bgcolor='#F3F3F3'>Sincronização<br>iniciada por:</td><td>"
								+ sync.getCreatedBy().getPersonName() + "<br>("
								+ sync.getCreatedBy().getPerson().getPhoneNumber() + ")" + "</td></tr>"
								+ "<tr><th colspan='2' style='text-aign:center;background-color:#0288D1;color:white;'><a href='http://196.28.230.195:8080/scb'><span style='color:#00FFFF;'>Sistema de Controle de Backup</span></a><br/>Mantido por: <a href='mailto:his@fgh.org.mz'><span style='color:#00FFFF;'>his@fgh.org.mz</span></a></th></tr>"
								+ "</tbody></table>");
						email.setTextMsg(
								"O seu cliente não aceita mensagens HTML. \nContacte o Administador para mais detalhes.");
						email.setCharset("utf-8");
						email.send();
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}).start();
			
			logger.info(sync.getCreatedBy().getUid() + ", created Sync: " + sync.toString());
		} else {
			sync.setDateUpdated(new Date());
			sync.setDistrict(sync.getServer().getDistrict());
			DateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm");
			DateFormat simpleDateFormat2 = new SimpleDateFormat("HH:mm");
			if (sync.isCanceled() == true) {
				sync.setDateCanceled(new Date());
				sync.setCanceledBy(sync.getUpdatedBy());
			} else {
				sync.setCanceledReason(null);
				if (sync.getStartTime() != null) {
					
					SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
					try {
						sync.setStartTime(sdf.parse(sdf.format(sync.getStartTime())));
					} catch (ParseException e) {
						e.printStackTrace();
					}
				}
				
				if (sync.getEndTime() != null) {
					SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
					try {
						sync.setEndTime(sdf.parse(sdf.format(sync.getEndTime())));
					} catch (ParseException e) {
						e.printStackTrace();
					}
				}
				
				if(sync.getEndTime()==null) {
					sync_time=simpleDateFormat.format(sync.getStartTime());
					duration="<span style='color:white;background-color: orange; font-size: 11px;border-radius: 5%; padding: 5px;'>EM PROGRESSO</span>";
					end_items_to_send = "";
					end_items_to_receive = "";
				}else {
					DecimalFormat decimalFormat = new DecimalFormat("00");
					long diff = sync.getEndTime().getTime() - sync.getStartTime().getTime();
					long diffMinutes = diff / (60 * 1000) % 60;
					long diffHours = diff / (60 * 60 * 1000) % 24;
					duration=decimalFormat.format(diffHours) + "h " + decimalFormat.format(diffMinutes) + "min";
					sync_time = simpleDateFormat.format(sync.getStartTime())+"-"+simpleDateFormat2.format(sync.getEndTime());
					end_items_to_send = sync.getEndItemsToSend()+" por enviar";
					end_items_to_receive = sync.getEndItemsToReceive()+" por receber";
				}
				
				start_items_to_send = sync.getStartItemsToSend()+"";
				start_items_to_receive = sync.getStartItemsToReceive()+"";
				
			
				error="";
				if (sync.isSyncError()) {
					error= "Erro de Sync<br>";
				} 
				if (sync.isServerFault()) {
					error= error+"Avaria do Servidor<br>";
				} 
				if (sync.isLaptopFault()) {
					error= error+"Avaria do Laptop<br>";
				} 
				if (sync.isPowerCut()) {
					error= error+"Corte de Energia";
				} 
				obs="";
				if (sync.getObservation() != null && sync.getObservationHis() == null) {
					obs = sync.getObservation();
				} else if (sync.getObservation() == null && sync.getObservationHis() != null) {
					obs =  sync.getObservationHis();
				} else if (sync.getObservation() != null && sync.getObservationHis() != null) {
					obs =  "M&A: " + sync.getObservation() + "\nSIS: " + sync.getObservationHis();
				}
				
				district = sync.getServer().getDistrict().getName();
				server=sync.getServer().getName();

				new Thread(new Runnable() {
					public void run() {
						HtmlEmail email = new HtmlEmail();
						email.setHostName("smtp.gmail.com");
						email.setSmtpPort(465);
						email.setAuthenticator(new DefaultAuthenticator("scb.fgh@gmail.com", "Pepfar2014"));
						email.setSSLOnConnect(true);
						try {
							String r1 = resourceRepository.findUsersForSyncNotification(sync.getServer().getDistrict().getDistrictId()).toString().replace("[", "");
							String r2 = r1.replace("]", " ");
							String[] temp;
							String divisor = ", ";
							temp = r2.split(divisor);
							int i = 0;
							
							
							while (i < temp.length) {
								email.addBcc(temp[i] + "");
								i++;
							}
							email.setFrom("scb.fgh@gmail.com", "SCB");
							email.setSubject("[SCB-" + env.getProperty("org") + "] Registo de Sincronização, " + server + "-"+ sync_time + " (No Reply)");
							email.setHtmlMsg(""
									+ "<table border='1' style='border-color:#EEEEEE;' cellspacing='0' cellpadding='5' style='width:400px;'>"
									+ "<thead><tr><th colspan='2' style='text-aign:center;background-color:#0288D1;color:white;'>Registo de Sincronização</th></tr><thead>"
									+ "<tbody><tr>" + "<td bgcolor='#F3F3F3'>Servidor:</td><td>" + server + "</td></tr>"
									+ "<tr><td bgcolor='#F3F3F3'>Distrito:</td><td>" + district + "</td></tr>"
									+ "<tr><td bgcolor='#F3F3F3'>Horário de<br>Sincronização:</td><td>" + sync_time + "</td></tr>"
									+ "<tr><td bgcolor='#F3F3F3'>Duração:</td><td>" + duration + "</td></tr>"
									+ "<tr><td bgcolor='#F3F3F3'>Nº de itens na hora<br>inicial</td><td>" + start_items_to_send+" por enviar<br>"+start_items_to_receive + " por receber</td></tr>"
									+ "<tr><td bgcolor='#F3F3F3'>Nº de itens na hora<br>final</td><td>" + end_items_to_send+"<br>"+end_items_to_receive + "</td></tr>"
									+ "<tr><td bgcolor='#F3F3F3'>Ocorrências:</td><td>" + error + "</td></tr>"
									+ "<tr><td bgcolor='#F3F3F3' aling='top'>Observação:</td><td>" + obs
									+ "</td></tr>" + "<tr><td bgcolor='#F3F3F3'>Sincronização<br>iniciada por:</td><td>"
									+ sync.getCreatedBy().getPerson().getOthersNames() + " "
									+ sync.getCreatedBy().getPerson().getSurname() + "<br>("
									+ sync.getCreatedBy().getPerson().getPhoneNumber() + ")" + "</td></tr>"
									+ "</td></tr>" + "<tr><td bgcolor='#F3F3F3'>Sincronização<br>actualizada por:</td><td>"
									+ sync.getUpdatedBy().getPersonName() + "<br>("
									+ sync.getUpdatedBy().getPerson().getPhoneNumber() + ")" + "</td></tr>"
									+ "<tr><th colspan='2' style='text-aign:center;background-color:#0288D1;color:white;'><a href='http://196.28.230.195:8080/scb'><span style='color:#00FFFF;'>Sistema de Controle de Backup</span></a><br/>Mantido por: <a href='mailto:his@fgh.org.mz'><span style='color:#00FFFF;'>his@fgh.org.mz</span></a></th></tr>"
									+ "</tbody></table>");
							email.setTextMsg(
									"O seu cliente não aceita mensagens HTML. \nContacte o Administador para mais detalhes.");
							email.setCharset("utf-8");
							email.send();
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
				}).start();
				
				logger.info(sync.getCreatedBy().getUid() + ", updated Sync: " + sync.toString());
	
			}
			
			
		}
		
		return syncRepository.save(sync);
	}

	@Transactional(readOnly = false)
	@Override
	public void delete(Sync sync) {
		logger.info("Deleted Sync: " + sync.toString());
		syncRepository.delete(sync);
	}

	@Transactional(readOnly = true)
	@Override
	public Page<Sync> findAll(Specification<Sync> spec, PageRequest pageRequest) {
		return syncRepository.findAll(spec, pageRequest);
	}

}