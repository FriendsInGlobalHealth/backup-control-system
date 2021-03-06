package mz.org.fgh.scb.transporter;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.domain.Specifications;

import mz.org.fgh.scb.filter.SearchCriteria;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public class TransporterSpecificationsBuilder {

	private final List<SearchCriteria> params;

	public TransporterSpecificationsBuilder() {
		params = new ArrayList<SearchCriteria>();
	}

	public TransporterSpecificationsBuilder with(String key, String operation, Object value) {
		params.add(new SearchCriteria(key, operation, value));
		return this;
	}

	public Specification<Transporter> build() {
		if (params.size() == 0) {
			return null;
		}

		List<Specification<Transporter>> specs = new ArrayList<Specification<Transporter>>();
		for (SearchCriteria param : params) {
			specs.add(new TransporterSpecification(param));
		}

		Specification<Transporter> result = specs.get(0);
		for (int i = 1; i < specs.size(); i++) {
			result = Specifications.where(result).and(specs.get(i));
		}
		return result;
	}
}
