package mz.org.fgh.scb.district;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.domain.Specifications;

import mz.org.fgh.scb.filter.SearchCriteria;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public class DistrictSpecificationsBuilder {
	
	 private final List<SearchCriteria> params;
	 
	    public DistrictSpecificationsBuilder() {
	        params = new ArrayList<SearchCriteria>();
	    }
	 
	    public DistrictSpecificationsBuilder with(String key, String operation, Object value) {
	        params.add(new SearchCriteria(key, operation, value));
	        return this;
	    }
	 
	    public Specification<District> build() {
	        if (params.size() == 0) {
	            return null;
	        }
	 
	        List<Specification<District>> specs = new ArrayList<Specification<District>>();
	        for (SearchCriteria param : params) {
	            specs.add(new DistrictSpecification(param));
	        }
	 
	        Specification<District> result = specs.get(0);
	        for (int i = 1; i < specs.size(); i++) {
	            result = Specifications.where(result).and(specs.get(i));
	        }
	        return result;
	    }
}
