package mz.org.fgh.scb.ironkey;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.domain.Specifications;

import mz.org.fgh.scb.filter.SearchCriteria;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public class IronkeySpecificationsBuilder {

	private final List<SearchCriteria> params;

	public IronkeySpecificationsBuilder() {
		params = new ArrayList<SearchCriteria>();
	}

	public IronkeySpecificationsBuilder with(String key, String operation, Object value) {
		params.add(new SearchCriteria(key, operation, value));
		return this;
	}

	public Specification<Ironkey> build() {
		if (params.size() == 0) {
			return null;
		}

		List<Specification<Ironkey>> specs = new ArrayList<Specification<Ironkey>>();
		for (SearchCriteria param : params) {
			specs.add(new IronkeySpecification(param));
		}

		Specification<Ironkey> result = specs.get(0);
		for (int i = 1; i < specs.size(); i++) {
			result = Specifications.where(result).and(specs.get(i));
		}
		return result;
	}
}
