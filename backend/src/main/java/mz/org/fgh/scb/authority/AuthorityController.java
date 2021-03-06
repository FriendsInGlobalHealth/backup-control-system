package mz.org.fgh.scb.authority;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
@RestController
@RequestMapping("api")
@Api(tags = {"Authority"})
public class AuthorityController {

	@Autowired
	private AuthorityServiceImpl authorityServiceImpl;

	@GetMapping(value = "/v1/authorities")
	public List<Authority> findAllAuthorities() {
		return authorityServiceImpl.findAllByOrderByNameAsc();
	}
}
