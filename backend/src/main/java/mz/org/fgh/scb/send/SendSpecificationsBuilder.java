package mz.org.fgh.scb.send;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.domain.Specifications;

import mz.org.fgh.scb.filter.SearchCriteria;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public class SendSpecificationsBuilder {

	private final List<SearchCriteria> params;

	public SendSpecificationsBuilder() {
		params = new ArrayList<SearchCriteria>();
	}

	public SendSpecificationsBuilder with(String key, String operation, Object value) {
		params.add(new SearchCriteria(key, operation, value));
		return this;
	}

	public Specification<Send> build() {
		if (params.size() == 0) {
			return null;
		}

		List<Specification<Send>> specs = new ArrayList<Specification<Send>>();
		for (SearchCriteria param : params) {
			specs.add(new SendSpecification(param));
		}

		Specification<Send> result = specs.get(0);
		for (int i = 1; i < specs.size(); i++) {
			result = Specifications.where(result).and(specs.get(i));
		}
		return result;
	}
}
