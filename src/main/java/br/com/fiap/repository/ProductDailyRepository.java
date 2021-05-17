package br.com.fiap.repository;

import br.com.fiap.domain.ProductDaily;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ProductDaily entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductDailyRepository extends JpaRepository<ProductDaily, Long> {}
