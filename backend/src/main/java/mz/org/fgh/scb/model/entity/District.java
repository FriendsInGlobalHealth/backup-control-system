package mz.org.fgh.scb.model.entity;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.fasterxml.jackson.annotation.JsonBackReference;

/**
 * @author damasceno.lopes
 *
 */
@Entity(name = "district")
@Table(uniqueConstraints={
	    @UniqueConstraint(columnNames = {"province", "name"})})
public class District {

	@Id
	@SequenceGenerator(name = "seq_district", initialValue = 1)
	@GeneratedValue(generator = "seq_district", strategy = GenerationType.AUTO)
	private Long district_id;

	@Column(nullable = false)
	private String province;

	@Column(nullable = false)
	private String name;

	private String instance_url;

	private String instance_username;

	private String instance_password;

	@JsonBackReference(value = "district-ironkeys")
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "district_ironkey", joinColumns = {
			@JoinColumn(name = "district_id", nullable = false, updatable = false) }, inverseJoinColumns = {
					@JoinColumn(name = "ironkey_id", nullable = false, updatable = false) }, uniqueConstraints = {
							@UniqueConstraint(columnNames = { "district_id", "ironkey_id" }) })
	private Set<Ironkey> ironkeys = new HashSet<Ironkey>(0);

	@Column(nullable = false)
	private Date date_created;

	private Date date_updated;

	@JoinColumn(name = "created_by")
	@ManyToOne
	private User created_by;

	@JoinColumn(name = "updated_by")
	@ManyToOne
	private User updated_by;

	@JsonBackReference(value = "district-users")
	@ManyToMany(fetch = FetchType.EAGER, mappedBy = "districts")
	private Set<User> users = new HashSet<User>(0);

	@Column(nullable = false, unique = true)
	private String uuid;
	
	@Column(nullable = false)
	private boolean canceled;

	private String canceled_reason;
	
	@JoinColumn(name = "canceled_by")
	@ManyToOne
	private User canceled_by;
	
	private Date date_canceled;

	public District() {
		this.canceled = false;
		this.uuid = UUID.randomUUID().toString();
	}
	
	public Date getDate_canceled() {
		return date_canceled;
	}

	public void setDate_canceled(Date date_canceled) {
		this.date_canceled = date_canceled;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getDistrict_id() {
		return district_id;
	}

	public void setDistrict_id(Long district_id) {
		this.district_id = district_id;
	}

	public Date getDate_created() {
		return date_created;
	}

	public void setDate_created(Date date_created) {
		this.date_created = date_created;
	}

	public Date getDate_updated() {
		return date_updated;
	}

	public void setDate_updated(Date date_updated) {
		this.date_updated = date_updated;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	

	public User getCreated_by() {
		if (this.created_by != null) {
			created_by.setDistricts(null);
			created_by.setAuthorities(null);
			return created_by;
			}else {
				return null;
			}
	}

	public void setCreated_by(User created_by) {
		this.created_by = created_by;
	}

	public User getUpdated_by() {
		if (this.updated_by != null) {
			this.updated_by.setDistricts(null);
			this.updated_by.setAuthorities(null);
			return this.updated_by;
		} else {
			return null;
		}
	}
	
	public User getCanceled_by() {
		if (this.canceled_by != null) {
			this.canceled_by.setDistricts(null);
			this.canceled_by.setAuthorities(null);
			return this.canceled_by;
		} else {
			return null;
		}
	}

	public void setCanceled_by(User canceled_by) {
		this.canceled_by = canceled_by;
	}

	public void setUpdated_by(User updated_by) {
		this.updated_by = updated_by;
	}

	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	public Set<Ironkey> getIronkeys() {
		return ironkeys;
	}
	
	public Set<Ironkey> getIronkeysDistrict() {
		Set <Ironkey> ironkeys = new HashSet<Ironkey>(0);
		for(Ironkey i: this.ironkeys) {
			i.setCreated_by(null);
			i.setUpdated_by(null);
			ironkeys.add(i);
		}
		return ironkeys;
	}

	public void setIronkeys(Set<Ironkey> ironkeys) {
		this.ironkeys = ironkeys;
	}

	public String getInstance_url() {
		return instance_url;
	}

	public void setInstance_url(String instance_url) {
		this.instance_url = instance_url;
	}

	public String getInstance_username() {
		return instance_username;
	}

	public void setInstance_username(String instance_username) {
		this.instance_username = instance_username;
	}

	public String getInstance_password() {
		return instance_password;
	}

	public void setInstance_password(String instance_password) {
		this.instance_password = instance_password;
	}

	public int getIronkeysnumber() {
		if (this.getIronkeys() == null)
			return 0;
		else
			return this.getIronkeys().size();
	}

	public Date getLast_Backup_recived() {
		return null;
	}

	public Date getLast_Backup_restored() {
		return null;
	}
	
	public boolean isCanceled() {
		return canceled;
	}

	public void setCanceled(boolean canceled) {
		this.canceled = canceled;
	}

	public String getCanceled_reason() {
		return canceled_reason;
	}

	public void setCanceled_reason(String canceled_reason) {
		this.canceled_reason = canceled_reason;
	}

	public String getIronkeysnames() {
		String names = "";
		if (this.getIronkeys() == null) {
			return "";
		}

		else {
			if (this.getIronkeys().size() < 2) {
				for (Ironkey i : this.getIronkeys()) {
					names = i.getSize()+" GB - "+i.getSerial()+" - "+i.getStatus();
				}
			} else {
				for (Ironkey i : this.getIronkeys()) {
					if (names.equals(""))
						names = i.getSize()+" GB - "+i.getSerial()+" - "+i.getStatus();
					else
						names = names + "\n" + i.getSize()+" GB - "+i.getSerial()+" - "+i.getStatus();
				}

			}

			return names;
		}

	}
	
	@Override
	public String toString() {
		return "District [district_id=" + district_id + ", province=" + province + ", name=" + name + ", instance_url="
				+ instance_url + ", instance_username=" + instance_username + ", instance_password=" + instance_password
				+ ", date_created=" + date_created + ", date_updated=" + date_updated + ", uuid=" + uuid + ", canceled="
				+ canceled + ", canceled_reason=" + canceled_reason + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((district_id == null) ? 0 : district_id.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		District other = (District) obj;
		if (district_id == null) {
			if (other.district_id != null)
				return false;
		} else if (!district_id.equals(other.district_id))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		return true;
	}

}
