package mz.org.fgh.scb.send;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public interface SendService {

	Send save(Send send);

	void delete(Send send);

	Send findOneByUuid(String uuid);
	
	Page<Send> findAll(Specification<Send> spec, PageRequest pageRequest);

}
